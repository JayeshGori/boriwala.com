import { Metadata } from 'next';
import { PHONE_DISPLAY, PHONE_NUMBER, WHATSAPP_NUMBER, whatsappLink } from '@/lib/contact';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'Privacy Policy for Boriwala Trading Co. website and mobile app - what data we collect, how we use it, and how you can request deletion.',
};

const LAST_UPDATED = 'June 23, 2026';

export default function PrivacyPolicyPage() {
  return (
    <>
      {/* Hero */}
      <div className="bg-slate-800 py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-white">Privacy Policy</h1>
          <p className="text-slate-300 mt-2">Last updated: {LAST_UPDATED}</p>
        </div>
      </div>

      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 prose-custom text-slate-700 leading-relaxed space-y-8">
          <div>
            <p>
              This Privacy Policy explains how <strong>Boriwala Trading Co.</strong> (&quot;Boriwala&quot;,
              &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) collects, uses, and protects your information when you
              use our website <strong>boriwala.com</strong> and our companion mobile application
              <strong> Boriwala Trading</strong> (collectively, the &quot;Services&quot;). By using our Services,
              you agree to the practices described in this policy.
            </p>
          </div>

          <Section title="1. Who We Are">
            <p>
              Boriwala Trading Co. is a B2B trading business dealing in PP bags, jute bags, plastic products,
              and industrial packaging materials, based at A-214, Bedi Mandi, Rajkot Morbi Highway,
              Rajkot - 360003, Gujarat, India.
            </p>
          </Section>

          <Section title="2. Information We Collect">
            <p>We only collect information needed to provide and improve our Services:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>
                <strong>Account information</strong> (if you register as a buyer): your name, email address,
                phone number, and company name.
              </li>
              <li>
                <strong>Enquiry information:</strong> details you submit through contact, product enquiry, or
                &quot;Sell to Us&quot; forms, including name, phone, email, company, message, quantities, and any
                photos or video links you choose to upload.
              </li>
              <li>
                <strong>Device &amp; push notification data (mobile app):</strong> a push notification token,
                device name, and platform (Android/iOS), used solely to deliver notifications you opt in to.
              </li>
              <li>
                <strong>Technical data:</strong> standard log information such as cookies and session tokens
                used to keep you signed in.
              </li>
            </ul>
            <p className="mt-3">
              We do <strong>not</strong> collect precise location, contacts, photos beyond those you explicitly
              upload, or any financial/payment card information through the app.
            </p>
          </Section>

          <Section title="3. How We Use Your Information">
            <ul className="list-disc pl-6 space-y-2">
              <li>To create and manage your buyer account and show pricing to approved buyers.</li>
              <li>To respond to your enquiries and seller submissions.</li>
              <li>To send push notifications about offers, price updates, and new products (only if you allow notifications).</li>
              <li>To operate, maintain, secure, and improve our Services.</li>
            </ul>
          </Section>

          <Section title="4. Push Notifications">
            <p>
              The mobile app may request permission to send push notifications. You can disable notifications at
              any time from your device settings. If you decline or disable them, you can still use the rest of
              the app normally.
            </p>
          </Section>

          <Section title="5. How We Share Information">
            <p>
              We do <strong>not</strong> sell your personal information. We share data only with service providers
              that help us operate our Services, under appropriate confidentiality obligations:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li><strong>MongoDB Atlas</strong> — secure database hosting.</li>
              <li><strong>Vercel</strong> — website hosting and delivery.</li>
              <li><strong>Expo (Expo Push Notification Service)</strong> — delivery of push notifications.</li>
            </ul>
            <p className="mt-3">
              We may also disclose information if required by law or to protect our rights, users, or the public.
            </p>
          </Section>

          <Section title="6. Data Retention">
            <p>
              We keep your information only as long as necessary to provide the Services and for legitimate
              business or legal purposes. When no longer needed, we delete or anonymize it.
            </p>
          </Section>

          <Section title="7. Data Security">
            <p>
              We use industry-standard measures to protect your data, including password hashing and encrypted
              transport (HTTPS). No method of transmission or storage is 100% secure, but we work to protect your
              information at all times.
            </p>
          </Section>

          <Section title="8. Your Rights & Data / Account Deletion">
            <p>
              You may request access to, correction of, or deletion of your personal data, including full deletion
              of your account and any associated enquiries and push tokens. To make a request, contact us using any
              of the methods below and we will process it within 30 days:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>
                Email: <a className="text-amber-600 underline" href="mailto:info@boriwala.com?subject=Data%20Deletion%20Request">info@boriwala.com</a> with the
                subject &quot;Data Deletion Request&quot;.
              </li>
              <li>
                Phone: <a className="text-amber-600 underline" href={`tel:${PHONE_NUMBER}`}>{PHONE_DISPLAY}</a>
              </li>
              <li>
                WhatsApp: <a className="text-amber-600 underline" href={whatsappLink('I would like to request deletion of my Boriwala account and data.')} target="_blank" rel="noopener noreferrer">Message us on WhatsApp</a>
              </li>
            </ul>
            <p className="mt-3">
              Please include the email address or phone number associated with your account so we can verify and
              process your request.
            </p>
          </Section>

          <Section title="9. Children's Privacy">
            <p>
              Our Services are intended for businesses and users aged 18 and older. We do not knowingly collect
              personal information from children.
            </p>
          </Section>

          <Section title="10. Changes to This Policy">
            <p>
              We may update this Privacy Policy from time to time. Changes will be posted on this page with an
              updated &quot;Last updated&quot; date.
            </p>
          </Section>

          <Section title="11. Contact Us">
            <p>If you have any questions about this Privacy Policy, contact us at:</p>
            <ul className="list-none pl-0 space-y-1 mt-3">
              <li><strong>Boriwala Trading Co.</strong></li>
              <li>A-214, Bedi Mandi, Rajkot Morbi Highway, Rajkot - 360003, Gujarat, India</li>
              <li>Email: <a className="text-amber-600 underline" href="mailto:info@boriwala.com">info@boriwala.com</a></li>
              <li>Phone: <a className="text-amber-600 underline" href={`tel:${PHONE_NUMBER}`}>{PHONE_DISPLAY}</a></li>
              <li>WhatsApp: <a className="text-amber-600 underline" href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer">+{WHATSAPP_NUMBER}</a></li>
            </ul>
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
