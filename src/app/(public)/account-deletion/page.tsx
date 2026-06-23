import { Metadata } from 'next';
import { PHONE_DISPLAY, PHONE_NUMBER, WHATSAPP_NUMBER, whatsappLink } from '@/lib/contact';

export const metadata: Metadata = {
  title: 'Account & Data Deletion',
  description:
    'Request deletion of your Boriwala Trading account and associated personal data. Learn what is deleted, what may be retained, and how to submit a request.',
};

const LAST_UPDATED = 'June 23, 2026';

export default function AccountDeletionPage() {
  return (
    <>
      {/* Hero */}
      <div className="bg-slate-800 py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-white">Account &amp; Data Deletion</h1>
          <p className="text-slate-300 mt-2">Last updated: {LAST_UPDATED}</p>
        </div>
      </div>

      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-slate-700 leading-relaxed space-y-8">
          <p>
            This page explains how you can request deletion of your <strong>Boriwala Trading</strong> account
            (used on the boriwala.com website and the Boriwala Trading mobile app) and the personal data
            associated with it.
          </p>

          <Section title="How to request deletion">
            <p>To delete your account and data, contact us using any of the methods below:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>
                <strong>Email:</strong>{' '}
                <a
                  className="text-amber-600 underline"
                  href="mailto:info@boriwala.com?subject=Account%20Deletion%20Request&body=Please%20delete%20my%20Boriwala%20account%20and%20data.%20My%20registered%20email/phone%20is:%20"
                >
                  info@boriwala.com
                </a>{' '}
                with the subject &quot;Account Deletion Request&quot;.
              </li>
              <li>
                <strong>WhatsApp:</strong>{' '}
                <a
                  className="text-amber-600 underline"
                  href={whatsappLink('I would like to request deletion of my Boriwala account and data. My registered email/phone is: ')}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Message us on WhatsApp
                </a>
              </li>
              <li>
                <strong>Phone:</strong>{' '}
                <a className="text-amber-600 underline" href={`tel:${PHONE_NUMBER}`}>{PHONE_DISPLAY}</a>
              </li>
            </ul>
            <p className="mt-3">
              To help us verify your identity, please include the <strong>email address or phone number</strong>{' '}
              registered with your account. We may contact you to confirm the request.
            </p>
          </Section>

          <Section title="What data is deleted">
            <p>Once verified, we permanently delete the following from our systems:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>Your account profile — name, email, phone number, and company name.</li>
              <li>Your login credentials.</li>
              <li>Enquiries and &quot;Sell to Us&quot; submissions linked to your account, including any photos or video links you uploaded.</li>
              <li>Your device push-notification token(s).</li>
            </ul>
          </Section>

          <Section title="What may be retained">
            <p>
              We may retain a limited amount of information where required by law or for legitimate business
              records (for example, transaction or tax records). Such data is kept only as long as legally
              required and is then deleted or anonymized.
            </p>
          </Section>

          <Section title="Processing time">
            <p>
              We process verified deletion requests within <strong>30 days</strong>. We will confirm by email or
              WhatsApp once your account and data have been deleted.
            </p>
          </Section>

          <Section title="More information">
            <p>
              For full details on how we handle your data, see our{' '}
              <a className="text-amber-600 underline" href="/privacy-policy">Privacy Policy</a>.
            </p>
            <p className="mt-2">
              <strong>Boriwala Trading Co.</strong> · A-214, Bedi Mandi, Rajkot Morbi Highway, Rajkot - 360003,
              Gujarat, India · Email:{' '}
              <a className="text-amber-600 underline" href="mailto:info@boriwala.com">info@boriwala.com</a> · WhatsApp:{' '}
              <a className="text-amber-600 underline" href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer">
                +{WHATSAPP_NUMBER}
              </a>
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
