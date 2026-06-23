import { Metadata } from 'next';
import { PHONE_DISPLAY, PHONE_NUMBER } from '@/lib/contact';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description:
    'Terms of Service for the Boriwala Trading Co. website and mobile app.',
};

const LAST_UPDATED = 'June 23, 2026';

export default function TermsPage() {
  return (
    <>
      <div className="bg-slate-800 py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-white">Terms of Service</h1>
          <p className="text-slate-300 mt-2">Last updated: {LAST_UPDATED}</p>
        </div>
      </div>

      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-slate-700 leading-relaxed space-y-8">
          <p>
            These Terms of Service (&quot;Terms&quot;) govern your use of the Boriwala Trading Co. website
            (boriwala.com) and the Boriwala Trading mobile app (collectively, the &quot;Services&quot;). By using
            the Services, you agree to these Terms.
          </p>

          <Section title="1. Use of the Services">
            <p>
              Our Services are intended for business-to-business (B2B) use. You agree to use them only for lawful
              purposes and not to misuse, disrupt, or attempt to gain unauthorized access to any part of the
              Services.
            </p>
          </Section>

          <Section title="2. Accounts">
            <p>
              When you register, you are responsible for keeping your login credentials confidential and for all
              activity under your account. Buyer accounts require admin approval before product pricing becomes
              visible. We may suspend or terminate accounts that violate these Terms.
            </p>
          </Section>

          <Section title="3. Product Information & Pricing">
            <p>
              Product details, availability, and prices are provided for informational purposes and may change
              without notice. Prices shown to approved buyers are indicative; final pricing and terms are confirmed
              at the time of order. We are not liable for typographical errors or inaccuracies.
            </p>
          </Section>

          <Section title="4. Enquiries & Seller Submissions">
            <p>
              Submitting an enquiry or a &quot;Sell to Us&quot; request does not create a binding contract. Any
              transaction is subject to separate mutual agreement. You confirm that information and media you submit
              are accurate and that you have the right to share them.
            </p>
          </Section>

          <Section title="5. Intellectual Property">
            <p>
              All content on the Services, including logos, text, and images, is owned by or licensed to Boriwala
              Trading Co. and may not be copied or reused without permission.
            </p>
          </Section>

          <Section title="6. Limitation of Liability">
            <p>
              The Services are provided &quot;as is&quot; without warranties of any kind. To the maximum extent
              permitted by law, Boriwala Trading Co. is not liable for any indirect, incidental, or consequential
              damages arising from your use of the Services.
            </p>
          </Section>

          <Section title="7. Privacy">
            <p>
              Your use of the Services is also governed by our{' '}
              <a className="text-amber-600 underline" href="/privacy-policy">Privacy Policy</a>.
            </p>
          </Section>

          <Section title="8. Changes to These Terms">
            <p>
              We may update these Terms from time to time. Continued use of the Services after changes are posted
              constitutes acceptance of the updated Terms.
            </p>
          </Section>

          <Section title="9. Contact">
            <p>
              Questions about these Terms? Contact us at{' '}
              <a className="text-amber-600 underline" href="mailto:info@boriwala.com">info@boriwala.com</a> or{' '}
              <a className="text-amber-600 underline" href={`tel:${PHONE_NUMBER}`}>{PHONE_DISPLAY}</a>.
            </p>
          </Section>
        </div>
      </section>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-3">{title}</h2>
      <div className="space-y-2">{children}</div>
    </div>
  );
}
