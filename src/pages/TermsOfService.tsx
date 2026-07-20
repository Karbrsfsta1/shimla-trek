export function TermsOfService() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-forest">Terms of Service</h1>
      <p className="mt-2 text-sm text-gray-500">Last updated: 19 July 2026</p>

      <div className="mt-8 space-y-8 text-gray-700 leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold text-forest">1. Acceptance of Terms</h2>
          <p className="mt-3">
            By booking a trek or homestay through ShimlaTrek, you confirm that you are 18 years or older,
            or that you have consent from a parent or legal guardian.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-forest">2. Services We Provide</h2>
          <ul className="ml-5 mt-3 list-disc space-y-1">
            <li>Guided treks with trained local guides.</li>
            <li>Camping equipment and meals during treks.</li>
            <li>Required permits for restricted zones.</li>
            <li>Homestay accommodation with local families.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-forest">3. Services NOT Included</h2>
          <ul className="ml-5 mt-3 list-disc space-y-1">
            <li>Transport from your home city to the trek start point.</li>
            <li>Personal trekking gear (jackets, shoes, etc.).</li>
            <li>Travel insurance — we strongly recommend purchasing your own.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-forest">4. Booking &amp; Payment</h2>
          <p className="mt-3">
            A booking is confirmed only after full payment is received via Razorpay and confirmed over
            WhatsApp by our team. Pending payments do not guarantee a spot.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-forest">5. Trek Risks Acknowledgment</h2>
          <p className="mt-3">
            Trekking in the Himalayas carries inherent risks, including but not limited to altitude
            sickness, slips and falls, adverse weather, and wildlife encounters. You accept these risks
            by participating.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-forest">6. Fitness Requirements</h2>
          <ul className="ml-5 mt-3 list-disc space-y-1">
            <li><strong>Easy:</strong> Suitable for most people in average health.</li>
            <li><strong>Moderate:</strong> Requires regular walking fitness and stamina.</li>
            <li><strong>Challenging:</strong> Requires strong fitness, prior trekking experience, and acclimatization awareness.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-forest">7. Code of Conduct</h2>
          <ul className="ml-5 mt-3 list-disc space-y-1">
            <li>Follow leave-no-trace principles — carry out all waste.</li>
            <li>Respect local culture, customs, and religious sites.</li>
            <li>No alcohol or drugs during treks.</li>
            <li>Stay with the group and follow the guide's instructions at all times.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-forest">8. Limitation of Liability</h2>
          <p className="mt-3">
            ShimlaTrek's liability is limited to the amount you paid for the specific trek or homestay
            booking. We are not liable for indirect, incidental, or consequential damages.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-forest">9. Governing Law</h2>
          <p className="mt-3">
            These terms are governed by the laws of India. Disputes will be subject to the exclusive
            jurisdiction of the courts of Shimla, Himachal Pradesh.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-forest">10. Force Majeure</h2>
          <p className="mt-3">
            We are not liable for failure to perform obligations due to events beyond our control,
            including natural disasters, government restrictions, or pandemics.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-forest">11. Contact</h2>
          <p className="mt-3">
            Email: <a href="mailto:hello@shimlatrek.example" className="text-forest hover:underline">hello@shimlatrek.example</a><br />
            WhatsApp: <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer" className="text-forest hover:underline">+91 98765 43210</a>
          </p>
        </section>
      </div>
    </div>
  );
}
