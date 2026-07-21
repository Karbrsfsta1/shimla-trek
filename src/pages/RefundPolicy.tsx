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

const tiers = [
  { notice: 'More than 7 days', refund: '90% of booking amount' },
  { notice: '3 to 7 days', refund: '50%' },
  { notice: 'Less than 3 days', refund: 'No refund' },
  { notice: 'No-show', refund: 'No refund' },
];

export function RefundPolicy() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-forest">Refund &amp; Cancellation Policy</h1>
      <p className="mt-2 text-sm text-gray-500">Last updated: {LAST_UPDATED}</p>

      {CONTACT_NOTE}

      <section className="mt-8">
        <h2 className="text-xl font-semibold text-forest">Cancellation by Customer</h2>
        <p className="mt-3 text-gray-700">
          If you need to cancel your booking, please notify us as early as possible. Refunds are
          issued based on how far in advance you cancel:
        </p>
        <div className="mt-4 overflow-hidden rounded-lg border border-gray-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-snow text-forest">
              <tr>
                <th className="px-4 py-3 font-semibold">Notice period</th>
                <th className="px-4 py-3 font-semibold">Refund</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {tiers.map((t) => (
                <tr key={t.notice}>
                  <td className="px-4 py-3 text-gray-700">{t.notice}</td>
                  <td className="px-4 py-3 text-gray-700">{t.refund}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold text-forest">Cancellation by ShimlaTrek</h2>
        <p className="mt-3 text-gray-700">
          If we cancel a trek or homestay booking for any reason, you will receive a <strong>100% refund</strong> of
          the booking amount.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold text-forest">Weather &amp; Force Majeure</h2>
        <p className="mt-3 text-gray-700">
          If a trek is cancelled due to extreme weather, natural disasters, or other force majeure events,
          you will receive a <strong>100% refund</strong> or the option to <strong>reschedule</strong> at no extra cost.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold text-forest">Refund Processing</h2>
        <p className="mt-3 text-gray-700">
          Refunds are processed within <strong>5-7 business days</strong> to the original payment method via Razorpay.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold text-forest">How to Request a Refund</h2>
        <p className="mt-3 text-gray-700">
          To request a cancellation or refund, contact us via:
        </p>
        <ul className="ml-5 mt-2 list-disc space-y-1 text-gray-700">
          <li>WhatsApp: <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer" className="text-forest hover:underline">+91 98765 43210</a> (placeholder)</li>
          <li>Email: <a href="mailto:update-before-launch@shimlatrek.com" className="text-forest hover:underline">update-before-launch@shimlatrek.com</a> (placeholder)</li>
        </ul>
      </section>
    </div>
  );
}
