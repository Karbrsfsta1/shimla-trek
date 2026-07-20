/*
# ShimlaTrek — Core Schema

## Overview
Creates the full data model for ShimlaTrek, a platform for booking guided Himalayan
treks and authentic homestays in Shimla, Himachal Pradesh. This is a multi-user app
with Supabase email/password auth: every owner-scoped table uses
`user_id uuid NOT NULL DEFAULT auth.uid()` and `TO authenticated` RLS policies.

## New Tables

1. `profiles`
   - One row per authenticated user, keyed by `auth.users.id`.
   - `id` (uuid, PK, references auth.users.id ON DELETE CASCADE)
   - `full_name` (text, nullable)
   - `phone` (text, nullable)
   - `role` (text, default 'customer', values 'customer' | 'admin')
   - `avatar_url` (text, nullable)
   - `created_at`, `updated_at` (timestamptz)

2. `treks`
   - Catalog of guided treks. Public read; admin-managed.
   - `id`, `title`, `slug` (unique), `description`, `difficulty`
     ('easy' | 'moderate' | 'challenging'), `duration_days`, `price_per_person`,
     `max_group_size`, `start_location`, `end_location`, `image_url`,
     `gallery_urls` (text[]), `payment_link` (nullable), `is_active`,
     `created_at`, `updated_at`

3. `homestays`
   - Catalog of homestays. Public read; admin-managed.
   - `id`, `name`, `slug` (unique), `location`, `description`,
     `price_per_night`, `amenities` (text[]), `image_url`, `gallery_urls` (text[]),
     `is_active`, `created_at`, `updated_at`

4. `bookings`
   - A booking for a trek or homestay by an authenticated user.
   - `id`, `user_id` (DEFAULT auth.uid()), `trek_id` (nullable FK),
     `homestay_id` (nullable FK), `booking_date`, `end_date` (nullable),
     `number_of_persons`, `total_amount`, `status`
     ('pending' | 'confirmed' | 'cancelled' | 'completed'),
     `payment_id` (nullable), `payment_status`
     ('unpaid' | 'paid' | 'refunded'), `customer_notes` (nullable),
     `created_at`, `updated_at`

5. `reviews`
   - A review left by an authenticated user on a trek or homestay.
   - `id`, `user_id` (DEFAULT auth.uid()), `trek_id` (nullable FK),
     `homestay_id` (nullable FK), `rating` (int 1-5), `comment` (nullable),
     `is_published` (default true), `created_at`, `updated_at`

6. `contact_messages`
   - Submissions from the public contact form. Public INSERT only
     (no auth required to send a message); SELECT restricted to admins.
   - `id`, `name`, `email`, `subject`, `message`, `created_at`

## Security (RLS)
- `profiles`: owner-scoped CRUD (a user manages only their own profile row).
- `treks`, `homestays`: public SELECT (anon + authenticated) so the catalog
  renders without sign-in; INSERT/UPDATE/DELETE restricted to admins
  (role = 'admin') via a helper check.
- `bookings`: owner-scoped CRUD. `user_id` defaults to `auth.uid()` so inserts
  that omit it still satisfy the WITH CHECK policy.
- `reviews`: anyone (anon + authenticated) can read published reviews;
  authenticated users can create/update/delete only their own reviews.
- `contact_messages`: anyone can INSERT (public contact form); only admins
  can SELECT.

## Notes
1. `profiles.id` mirrors `auth.users.id`. A trigger auto-creates a profile row
   on signup so users don't need to manage it manually.
2. All owner columns use `DEFAULT auth.uid()` so client inserts that omit
   `user_id` still satisfy RLS WITH CHECK.
3. Admin-only writes on `treks`/`homestays` use `role = 'admin'` in `profiles`.
4. Idempotent: uses IF NOT EXISTS and DROP POLICY IF EXISTS patterns.
*/

-- ============================================================================
-- profiles
-- ============================================================================
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  phone text,
  role text NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  avatar_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile" ON profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "insert_own_profile" ON profiles;
CREATE POLICY "insert_own_profile" ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "delete_own_profile" ON profiles;
CREATE POLICY "delete_own_profile" ON profiles FOR DELETE
  TO authenticated USING (auth.uid() = id);

-- Auto-create a profile row when a new auth user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- treks
-- ============================================================================
CREATE TABLE IF NOT EXISTS treks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text NOT NULL DEFAULT '',
  difficulty text NOT NULL DEFAULT 'moderate' CHECK (difficulty IN ('easy', 'moderate', 'challenging')),
  duration_days integer NOT NULL DEFAULT 1 CHECK (duration_days >= 1),
  price_per_person numeric NOT NULL DEFAULT 0 CHECK (price_per_person >= 0),
  max_group_size integer NOT NULL DEFAULT 10 CHECK (max_group_size >= 1),
  start_location text NOT NULL DEFAULT '',
  end_location text NOT NULL DEFAULT '',
  image_url text,
  gallery_urls text[] NOT NULL DEFAULT '{}',
  payment_link text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS treks_active_idx ON treks(is_active);
CREATE INDEX IF NOT EXISTS treks_difficulty_idx ON treks(difficulty);

ALTER TABLE treks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_treks" ON treks;
CREATE POLICY "public_read_treks" ON treks FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_treks" ON treks;
CREATE POLICY "admin_insert_treks" ON treks FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

DROP POLICY IF EXISTS "admin_update_treks" ON treks;
CREATE POLICY "admin_update_treks" ON treks FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

DROP POLICY IF EXISTS "admin_delete_treks" ON treks;
CREATE POLICY "admin_delete_treks" ON treks FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

-- ============================================================================
-- homestays
-- ============================================================================
CREATE TABLE IF NOT EXISTS homestays (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  location text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  price_per_night numeric NOT NULL DEFAULT 0 CHECK (price_per_night >= 0),
  amenities text[] NOT NULL DEFAULT '{}',
  image_url text,
  gallery_urls text[] NOT NULL DEFAULT '{}',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS homestays_active_idx ON homestays(is_active);

ALTER TABLE homestays ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_homestays" ON homestays;
CREATE POLICY "public_read_homestays" ON homestays FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_homestays" ON homestays;
CREATE POLICY "admin_insert_homestays" ON homestays FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

DROP POLICY IF EXISTS "admin_update_homestays" ON homestays;
CREATE POLICY "admin_update_homestays" ON homestays FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

DROP POLICY IF EXISTS "admin_delete_homestays" ON homestays;
CREATE POLICY "admin_delete_homestays" ON homestays FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

-- ============================================================================
-- bookings
-- ============================================================================
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  trek_id uuid REFERENCES treks(id) ON DELETE SET NULL,
  homestay_id uuid REFERENCES homestays(id) ON DELETE SET NULL,
  booking_date date NOT NULL DEFAULT current_date,
  end_date date,
  number_of_persons integer NOT NULL DEFAULT 1 CHECK (number_of_persons >= 1),
  total_amount numeric NOT NULL DEFAULT 0 CHECK (total_amount >= 0),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  payment_id text,
  payment_status text NOT NULL DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'paid', 'refunded')),
  customer_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (trek_id IS NOT NULL OR homestay_id IS NOT NULL)
);

CREATE INDEX IF NOT EXISTS bookings_user_idx ON bookings(user_id);
CREATE INDEX IF NOT EXISTS bookings_trek_idx ON bookings(trek_id);
CREATE INDEX IF NOT EXISTS bookings_homestay_idx ON bookings(homestay_id);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_bookings" ON bookings;
CREATE POLICY "select_own_bookings" ON bookings FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_bookings" ON bookings;
CREATE POLICY "insert_own_bookings" ON bookings FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_bookings" ON bookings;
CREATE POLICY "update_own_bookings" ON bookings FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_bookings" ON bookings;
CREATE POLICY "delete_own_bookings" ON bookings FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- ============================================================================
-- reviews
-- ============================================================================
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  trek_id uuid REFERENCES treks(id) ON DELETE CASCADE,
  homestay_id uuid REFERENCES homestays(id) ON DELETE CASCADE,
  rating integer NOT NULL DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  comment text,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (trek_id IS NOT NULL OR homestay_id IS NOT NULL)
);

CREATE INDEX IF NOT EXISTS reviews_trek_idx ON reviews(trek_id);
CREATE INDEX IF NOT EXISTS reviews_homestay_idx ON reviews(homestay_id);
CREATE INDEX IF NOT EXISTS reviews_user_idx ON reviews(user_id);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_published_reviews" ON reviews;
CREATE POLICY "public_read_published_reviews" ON reviews FOR SELECT
  TO anon, authenticated USING (is_published = true);

DROP POLICY IF EXISTS "insert_own_reviews" ON reviews;
CREATE POLICY "insert_own_reviews" ON reviews FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_reviews" ON reviews;
CREATE POLICY "update_own_reviews" ON reviews FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_reviews" ON reviews;
CREATE POLICY "delete_own_reviews" ON reviews FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- ============================================================================
-- contact_messages
-- ============================================================================
CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL DEFAULT '',
  message text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_insert_contact_messages" ON contact_messages;
CREATE POLICY "public_insert_contact_messages" ON contact_messages FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_read_contact_messages" ON contact_messages;
CREATE POLICY "admin_read_contact_messages" ON contact_messages FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

-- ============================================================================
-- updated_at trigger helper
-- ============================================================================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_updated_at_profiles ON profiles;
CREATE TRIGGER set_updated_at_profiles BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_treks ON treks;
CREATE TRIGGER set_updated_at_treks BEFORE UPDATE ON treks
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_homestays ON homestays;
CREATE TRIGGER set_updated_at_homestays BEFORE UPDATE ON homestays
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_bookings ON bookings;
CREATE TRIGGER set_updated_at_bookings BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_reviews ON reviews;
CREATE TRIGGER set_updated_at_reviews BEFORE UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
