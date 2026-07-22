import { useState } from 'react';
import { MapPin, Mail, Phone, MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

const WHATSAPP_NUMBER = '917876803910';
const EMAIL = 'kforkartikbforbhardwaj@gmail.com';
const OFFICE = 'The Ridge, Shimla, Himachal Pradesh 171001';

export function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from('contact_messages').insert({
      name,
      email,
      subject,
      message,
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Message sent! We'll respond within 24 hours.");
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
  };

  return (
    <div>
      <section className="bg-snow py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-4xl font-bold text-forest">Contact Us</h1>
          <p className="mt-2 text-lg text-gray-600">We're here to help plan your Himalayan adventure</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-4 rounded-xl bg-white p-8 shadow-md">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input label="Name" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <Input label="Subject" type="text" value={subject} onChange={(e) => setSubject(e.target.value)} required />
              <div>
                <label htmlFor="message" className="mb-1 block text-sm font-medium text-gray-700">Message</label>
                <textarea
                  id="message"
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-mountain focus:outline-none focus:ring-1 focus:ring-mountain"
                />
              </div>
              <Button type="submit" loading={loading}>Send Message</Button>
            </form>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="rounded-xl bg-white p-6 shadow-md">
              <h3 className="font-display text-lg font-semibold text-forest">Get in touch</h3>
              <ul className="mt-4 space-y-4 text-gray-700">
                <li className="flex items-start gap-3">
                  <MessageCircle className="mt-0.5 h-5 w-5 text-mountain" />
                  <div>
                    <p className="font-medium">WhatsApp</p>
                    <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer" className="text-sm text-gray-600 hover:text-forest">
                      +91 78768 03910
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-5 w-5 text-mountain" />
                  <div>
                    <p className="font-medium">Email</p>
                    <a href={`mailto:${EMAIL}`} className="text-sm text-gray-600 hover:text-forest">{EMAIL}</a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 text-mountain" />
                  <div>
                    <p className="font-medium">Office</p>
                    <p className="text-sm text-gray-600">{OFFICE}</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="overflow-hidden rounded-xl shadow-md">
              <iframe
                title="Shimla map"
                src="https://www.google.com/maps?q=Shimla,Himachal+Pradesh&output=embed"
                width="100%"
                height="250"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
