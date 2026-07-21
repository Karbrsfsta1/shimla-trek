const LAST_UPDATED = '19 July 2026';

const CONTACT_NOTE = (
  <div className="mb-8 rounded-lg border border-apple/30 bg-apple/5 p-4 text-sm text-gray-700">
    <p className="font-medium text-apple">Pre-launch contact placeholder</p>
    <p className="mt-1">
      This policy page uses temporary contact details. Before launch, replace all
      references to <code className="rounded bg-white px-1">update-before-launch@shimlatrek.com</code> and
      <code className="rounded bg-white px-1">+91 98765 43210</code> with your real business contact information.
    </p>
  </div>
);

const sections = [
  {
    title: '1. Data We Collect',
    body: (
      <>
        <p>We collect the following information when you use ShimlaTrek:</p>
        <ul className="ml-5 list-disc space-y-1">
          <li><strong>Account data:</strong> name, email, phone number.</li>
          <li><strong>Booking details:</strong> trek/homestay selected, dates, number of persons, customer notes.</li>
          <li><strong>Payment data:</strong> processed securely via Razorpay — we never store card numbers or CVVs.</li>
          <li><strong>Technical data:</strong> IP address, browser type, device info, pages visited.</li>
        </ul>
      </>
    ),
  },
  {
    title: '2. How We Use Your Data',
    body: (
      <ul className="ml-5 list-disc space-y-1">
        <li>Process and confirm your bookings.</li>
        <li>Send booking confirmations, reminders, and updates.</li>
        <li>Respond to your enquiries and support requests.</li>
        <li>Comply with legal and tax obligations under Indian law.</li>
      </ul>
    ),
  },
  {
    title: '3. Data Storage and Security',
    body: (
      <p>
        Your data is stored in a Supabase PostgreSQL database hosted on AWS (Singapore region).
        Data in transit is protected with TLS 1.3, and data at rest is encrypted with AES-256.
        Access is restricted via Row Level Security policies so each user can only access their own records.
      </p>
    ),
  },
  {
    title: '4. Data Retention',
    body: (
      <ul className="ml-5 list-disc space-y-1">
        <li>Booking records are retained for <strong>7 years</strong> per Indian tax law.</li>
        <li>Permit IDs and temporary identification data are deleted after <strong>30 days</strong> post-trip.</li>
        <li>Account data is retained until you request deletion.</li>
      </ul>
    ),
  },
  {
    title: '5. Third-Party Services',
    body: (
      <ul className="ml-5 list-disc space-y-1">
        <li><a href="https://razorpay.com/privacy" target="_blank" rel="noreferrer" className="text-forest hover:underline">Razorpay</a> — payment processing.</li>
        <li><a href="https://supabase.com/privacy" target="_blank" rel="noreferrer" className="text-forest hover:underline">Supabase</a> — database and authentication.</li>
        <li><a href="https://cloudflare.com/privacypolicy" target="_blank" rel="noreferrer" className="text-forest hover:underline">Cloudflare</a> — CDN and security.</li>
      </ul>
    ),
  },
  {
    title: '6. Your Rights Under DPDP Act 2023',
    body: (
      <ul className="ml-5 list-disc space-y-1">
        <li>Access the personal data we hold about you.</li>
        <li>Request correction of inaccurate data.</li>
        <li>Request erasure of your data (subject to legal retention requirements).</li>
        <li>Seek grievance redressal from our Grievance Officer.</li>
      </ul>
    ),
  },
  {
    title: '7. Children\u2019s Privacy',
    body: <p>ShimlaTrek is not intended for anyone under 18. We do not knowingly collect data from minors.</p>,
  },
  {
    title: '8. Changes to This Policy',
    body: <p>We may update this policy from time to time. The "Last updated" date above reflects the most recent revision.</p>,
  },
  {
    title: '9. Grievance Officer',
    body: (
      <p>
        For privacy concerns, contact our Grievance Officer using the contact details
        noted at the top of this page.
      </p>
    ),
  },
];

export function PrivacyPolicy() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-forest">Privacy Policy</h1>
      <p className="mt-2 text-sm text-gray-500">Last updated: {LAST_UPDATED}</p>

      {CONTACT_NOTE}

      <div className="mt-8 space-y-8">
        {sections.map((s) => (
          <section key={s.title}>
            <h2 className="text-xl font-semibold text-forest">{s.title}</h2>
            <div className="mt-3 space-y-2 text-gray-700 leading-relaxed">{s.body}</div>
          </section>
        ))}
      </div>
    </div>
  );
}
