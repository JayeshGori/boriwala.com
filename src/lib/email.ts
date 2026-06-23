import nodemailer from 'nodemailer';
import { PHONE_DISPLAY, WHATSAPP_NUMBER } from './contact';

/**
 * Email transport.
 * Reads SMTP config from env. If SMTP credentials are missing the helper logs
 * the email to console (dev fallback) instead of throwing — so the app keeps
 * running even when email is not configured.
 *
 * Required env vars (production):
 *   SMTP_HOST       e.g. smtp.gmail.com / smtp.zoho.in / smtp.hostinger.com
 *   SMTP_PORT       e.g. 465 (secure) or 587 (TLS)
 *   SMTP_USER       full email address
 *   SMTP_PASS       SMTP password / app password
 *   EMAIL_FROM      "Boriwala Trading <info@boriwala.com>"
 */

let cachedTransport: nodemailer.Transporter | null = null;

function getTransport(): nodemailer.Transporter | null {
  if (cachedTransport) return cachedTransport;
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) return null;

  const port = parseInt(process.env.SMTP_PORT || '465', 10);
  cachedTransport = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
  return cachedTransport;
}

export interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}

export async function sendEmail({ to, subject, html, text, replyTo }: SendEmailParams) {
  const transport = getTransport();
  const from = process.env.EMAIL_FROM || 'Boriwala Trading <info@boriwala.com>';

  if (!transport) {
    console.warn('[email] SMTP not configured — would have sent:', { to, subject });
    return { success: false, dev: true };
  }

  try {
    const info = await transport.sendMail({
      from,
      to,
      subject,
      html,
      text: text || stripHtml(html),
      replyTo,
    });
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error('[email] send failed:', err);
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

function stripHtml(html: string): string {
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// ────────────────────────────────────────────────────────────────────────────
// Templates
// ────────────────────────────────────────────────────────────────────────────

const BRAND_GOLD = '#D97706';
const BRAND_DARK = '#0F172A';
const BORDER = '#E2E8F0';
const MUTED = '#64748B';

function baseLayout(content: string, title: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#F8FAFC;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:${BRAND_DARK};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F8FAFC;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#FFFFFF;border-radius:16px;overflow:hidden;box-shadow:0 1px 3px rgba(15,23,42,.06);">
        <!-- Header -->
        <tr><td style="background:linear-gradient(135deg,${BRAND_DARK} 0%,#1E293B 100%);padding:28px 32px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="color:#FFFFFF;font-size:22px;font-weight:800;letter-spacing:.5px;">
                BORIWALA <span style="color:${BRAND_GOLD};">●</span>
              </td>
              <td align="right" style="color:#94A3B8;font-size:11px;font-weight:600;letter-spacing:1px;text-transform:uppercase;">
                B2B Trading
              </td>
            </tr>
          </table>
        </td></tr>
        <!-- Content -->
        <tr><td style="padding:36px 32px;">
          ${content}
        </td></tr>
        <!-- Footer -->
        <tr><td style="background:#F8FAFC;padding:24px 32px;border-top:1px solid ${BORDER};">
          <p style="margin:0 0 8px 0;font-size:12px;color:${MUTED};line-height:1.6;">
            <strong style="color:${BRAND_DARK};">Boriwala Trading Co.</strong><br>
            A-214, Bedi Mandi, Rajkot Morbi Highway, Rajkot - 360003, Gujarat, India
          </p>
          <p style="margin:0;font-size:12px;color:${MUTED};">
            📞 <a href="tel:${PHONE_DISPLAY.replace(/\s/g, '')}" style="color:${BRAND_GOLD};text-decoration:none;">${PHONE_DISPLAY}</a>
            &nbsp;·&nbsp;
            💬 <a href="https://wa.me/${WHATSAPP_NUMBER}" style="color:${BRAND_GOLD};text-decoration:none;">WhatsApp</a>
            &nbsp;·&nbsp;
            ✉️ <a href="mailto:info@boriwala.com" style="color:${BRAND_GOLD};text-decoration:none;">info@boriwala.com</a>
          </p>
          <p style="margin:12px 0 0 0;font-size:11px;color:#94A3B8;">
            © ${new Date().getFullYear()} Boriwala Trading Co. All rights reserved.
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function ctaButton(href: string, label: string): string {
  return `<a href="${href}" style="display:inline-block;background:${BRAND_GOLD};color:#FFFFFF;font-weight:600;font-size:14px;text-decoration:none;padding:12px 28px;border-radius:10px;">${label}</a>`;
}

export function welcomeEmail(name: string): { subject: string; html: string } {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://boriwala.com';
  const content = `
    <h1 style="margin:0 0 8px 0;font-size:24px;font-weight:700;color:${BRAND_DARK};">
      Welcome to Boriwala, ${escapeHtml(name)} 👋
    </h1>
    <p style="margin:0 0 20px 0;font-size:15px;line-height:1.6;color:${MUTED};">
      Thank you for registering with <strong style="color:${BRAND_DARK};">Boriwala Trading Co.</strong> —
      one of India's trusted names in B2B trading of PP Bags, Jute Bags, Plastic Products,
      Industrial Packaging Materials and Scrap Materials since 2009.
    </p>

    <div style="background:#FEF3C7;border-left:4px solid ${BRAND_GOLD};padding:16px 18px;border-radius:8px;margin:24px 0;">
      <p style="margin:0;font-size:14px;color:#78350F;line-height:1.6;">
        <strong>What happens next?</strong><br>
        Our B2B team is reviewing your account. Once approved, you'll be able to view
        wholesale pricing, MOQ details, and place enquiries directly from your dashboard.
        We'll reach out to you shortly via phone or WhatsApp to verify your business details.
      </p>
    </div>

    <p style="margin:0 0 24px 0;font-size:14px;line-height:1.7;color:${BRAND_DARK};">
      <strong>While you wait, you can:</strong>
    </p>
    <ul style="margin:0 0 24px 0;padding-left:20px;font-size:14px;line-height:1.8;color:${MUTED};">
      <li>Browse our complete product catalogue</li>
      <li>Send WhatsApp enquiries for any product</li>
      <li>Use our Bag Weight Calculator tool</li>
      <li>Reach our team directly for urgent requirements</li>
    </ul>

    <div style="text-align:center;margin:32px 0 8px 0;">
      ${ctaButton(`${siteUrl}/products`, 'Browse Products')}
    </div>
    <div style="text-align:center;margin:0 0 16px 0;">
      <a href="https://wa.me/${WHATSAPP_NUMBER}" style="display:inline-block;color:#16A34A;font-weight:600;font-size:14px;text-decoration:none;padding:8px 16px;">
        💬 Need urgent help? WhatsApp us
      </a>
    </div>
  `;
  return {
    subject: `Welcome to Boriwala, ${name} — Your account is being reviewed`,
    html: baseLayout(content, 'Welcome to Boriwala Trading Co.'),
  };
}

export function approvalEmail(name: string): { subject: string; html: string } {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://boriwala.com';
  const content = `
    <h1 style="margin:0 0 8px 0;font-size:24px;font-weight:700;color:${BRAND_DARK};">
      Your account is approved! 🎉
    </h1>
    <p style="margin:0 0 20px 0;font-size:15px;line-height:1.6;color:${MUTED};">
      Hi ${escapeHtml(name)}, great news — your B2B account has been approved.
      You can now log in to view wholesale pricing, place enquiries and track all your orders.
    </p>
    <div style="text-align:center;margin:24px 0;">
      ${ctaButton(`${siteUrl}/login`, 'Login to Your Account')}
    </div>
  `;
  return {
    subject: 'Your Boriwala B2B account is approved',
    html: baseLayout(content, 'Account Approved'),
  };
}

export function enquiryReceivedEmail(
  name: string,
  productName?: string,
): { subject: string; html: string } {
  const content = `
    <h1 style="margin:0 0 8px 0;font-size:22px;font-weight:700;color:${BRAND_DARK};">
      Thanks for your enquiry, ${escapeHtml(name)}!
    </h1>
    <p style="margin:0 0 16px 0;font-size:15px;line-height:1.6;color:${MUTED};">
      We've received your enquiry${productName ? ` for <strong style="color:${BRAND_DARK};">${escapeHtml(productName)}</strong>` : ''}.
      Our team will review the details and get back to you within
      <strong style="color:${BRAND_DARK};">24 working hours</strong> with pricing, MOQ and dispatch information.
    </p>
    <p style="margin:0 0 16px 0;font-size:14px;line-height:1.6;color:${MUTED};">
      For urgent requirements, you can also reach us directly:
    </p>
    <div style="text-align:center;margin:20px 0;">
      <a href="https://wa.me/${WHATSAPP_NUMBER}" style="display:inline-block;background:#16A34A;color:#FFFFFF;font-weight:600;font-size:14px;text-decoration:none;padding:12px 24px;border-radius:10px;margin:4px;">💬 WhatsApp Us</a>
      <a href="tel:${PHONE_DISPLAY.replace(/\s/g, '')}" style="display:inline-block;background:${BRAND_DARK};color:#FFFFFF;font-weight:600;font-size:14px;text-decoration:none;padding:12px 24px;border-radius:10px;margin:4px;">📞 Call Now</a>
    </div>
  `;
  return {
    subject: `We received your enquiry${productName ? ` — ${productName}` : ''}`,
    html: baseLayout(content, 'Enquiry Received'),
  };
}

export function priceAlertEmail(
  name: string,
  productName: string,
  productUrl: string,
  message: string,
): { subject: string; html: string } {
  const content = `
    <h1 style="margin:0 0 8px 0;font-size:22px;font-weight:700;color:${BRAND_DARK};">
      🔔 Price Update — ${escapeHtml(productName)}
    </h1>
    <p style="margin:0 0 16px 0;font-size:15px;line-height:1.6;color:${MUTED};">
      Hi ${escapeHtml(name)}, here's an update for a product you're tracking:
    </p>
    <div style="background:#FEF3C7;border-left:4px solid ${BRAND_GOLD};padding:16px 18px;border-radius:8px;margin:20px 0;">
      <p style="margin:0;font-size:15px;color:${BRAND_DARK};line-height:1.6;font-weight:600;">${escapeHtml(message)}</p>
    </div>
    <div style="text-align:center;margin:24px 0;">
      ${ctaButton(productUrl, 'View Product')}
    </div>
  `;
  return {
    subject: `🔔 ${productName} — price/stock update`,
    html: baseLayout(content, 'Product Update'),
  };
}

/**
 * Internal admin alert sent when a new buyer registers.
 */
export function adminNewRegistrationEmail(buyer: {
  name: string;
  email: string;
  phone?: string;
  companyName?: string;
}): { subject: string; html: string } {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://boriwala.com';
  const row = (label: string, value?: string) =>
    value
      ? `<tr><td style="padding:6px 0;font-size:13px;color:${MUTED};width:130px;">${label}</td><td style="padding:6px 0;font-size:14px;color:${BRAND_DARK};font-weight:600;">${escapeHtml(value)}</td></tr>`
      : '';
  const content = `
    <h1 style="margin:0 0 8px 0;font-size:22px;font-weight:700;color:${BRAND_DARK};">
      🆕 New buyer registration
    </h1>
    <p style="margin:0 0 20px 0;font-size:15px;line-height:1.6;color:${MUTED};">
      A new buyer just registered and is <strong style="color:${BRAND_DARK};">pending your approval</strong>.
    </p>
    <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border:1px solid ${BORDER};border-radius:10px;padding:14px 18px;margin:0 0 24px 0;">
      ${row('Name', buyer.name)}
      ${row('Email', buyer.email)}
      ${row('Phone', buyer.phone)}
      ${row('Company', buyer.companyName)}
    </table>
    <div style="text-align:center;margin:24px 0;">
      ${ctaButton(`${siteUrl}/admin/buyers`, 'Review & Approve')}
    </div>
  `;
  return {
    subject: `New buyer registration — ${buyer.name}`,
    html: baseLayout(content, 'New Registration'),
  };
}

/**
 * Generic marketing / newsletter campaign email used by the bulk-email module.
 * `bodyHtml` is admin-authored rich text; it is wrapped in the brand layout.
 */
export function campaignEmail(params: {
  heading: string;
  bodyHtml: string;
  recipientName?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  unsubscribeUrl?: string;
}): { html: string } {
  const { heading, bodyHtml, recipientName, ctaLabel, ctaUrl, unsubscribeUrl } = params;
  const greeting = recipientName
    ? `<p style="margin:0 0 16px 0;font-size:15px;color:${BRAND_DARK};">Hi ${escapeHtml(recipientName)},</p>`
    : '';
  const cta =
    ctaLabel && ctaUrl
      ? `<div style="text-align:center;margin:28px 0 8px 0;">${ctaButton(ctaUrl, escapeHtml(ctaLabel))}</div>`
      : '';
  const unsub = unsubscribeUrl
    ? `<p style="margin:20px 0 0 0;font-size:11px;color:#94A3B8;text-align:center;">
         Don't want these emails? <a href="${unsubscribeUrl}" style="color:#94A3B8;">Unsubscribe</a>
       </p>`
    : '';
  const content = `
    <h1 style="margin:0 0 16px 0;font-size:24px;font-weight:700;color:${BRAND_DARK};">
      ${escapeHtml(heading)}
    </h1>
    ${greeting}
    <div style="font-size:15px;line-height:1.7;color:${MUTED};">
      ${bodyHtml}
    </div>
    ${cta}
    ${unsub}
  `;
  return { html: baseLayout(content, heading) };
}

/**
 * Send the same email to many recipients with bounded concurrency so a single
 * campaign does not overwhelm the SMTP server. Returns per-batch counts.
 * Each recipient gets an individual message (good for deliverability and
 * per-recipient personalisation/unsubscribe links).
 */
export async function sendBulkEmails(
  recipients: { email: string; name?: string }[],
  build: (r: { email: string; name?: string }) => { subject: string; html: string },
  opts: { concurrency?: number; delayMs?: number } = {},
): Promise<{ sent: number; failed: number; total: number; errors: string[] }> {
  const concurrency = opts.concurrency ?? 5;
  const delayMs = opts.delayMs ?? 200;

  // De-dupe by lowercased email
  const seen = new Set<string>();
  const unique = recipients.filter((r) => {
    const e = r.email?.toLowerCase().trim();
    if (!e || seen.has(e)) return false;
    seen.add(e);
    return true;
  });

  let sent = 0;
  let failed = 0;
  const errors: string[] = [];

  for (let i = 0; i < unique.length; i += concurrency) {
    const batch = unique.slice(i, i + concurrency);
    await Promise.all(
      batch.map(async (r) => {
        try {
          const tpl = build(r);
          const res = await sendEmail({ to: r.email, subject: tpl.subject, html: tpl.html });
          if (res.success) sent++;
          else {
            failed++;
            if (res.error && errors.length < 10) errors.push(`${r.email}: ${res.error}`);
          }
        } catch (err) {
          failed++;
          if (errors.length < 10) errors.push(`${r.email}: ${err instanceof Error ? err.message : 'error'}`);
        }
      }),
    );
    if (delayMs && i + concurrency < unique.length) {
      await new Promise((res) => setTimeout(res, delayMs));
    }
  }

  return { sent, failed, total: unique.length, errors };
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
