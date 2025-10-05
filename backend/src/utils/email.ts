import { env } from '../config/env';

type SendEmailParams = {
  to: string;
  subject: string;
  html: string;
};

const sendEmail = async ({ to, subject, html }: SendEmailParams): Promise<void> => {
  if (!env.resendApiKey) {
    console.warn('[email] RESEND_API_KEY is not set. Email will not be sent.');
    return;
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: env.emailFrom,
      to,
      subject,
      html,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('[email] Failed to send email via Resend:', errorText);
    throw new Error('Failed to send email');
  }
};

export const sendVerificationEmail = async (to: string, url: string): Promise<void> => {
  const html = `
    <div style="font-family: Arial, sans-serif; font-size: 16px; line-height: 1.5; color: #111">
      <h2>Verify your email</h2>
      <p>Please verify your email address to activate your SAML account.</p>
      <p><a href="${url}" style="display: inline-block; padding: 12px 20px; background: #1d4ed8; color: #fff; text-decoration: none; border-radius: 4px;">Verify Email</a></p>
      <p>Or copy and paste this link into your browser:<br />${url}</p>
      <p>If you didn’t create an account, you can ignore this email.</p>
    </div>
  `;

  await sendEmail({
    to,
    subject: 'Verify your SAML account',
    html,
  });
};

export const sendPasswordResetEmail = async (to: string, url: string): Promise<void> => {
  const html = `
    <div style="font-family: Arial, sans-serif; font-size: 16px; line-height: 1.5; color: #111">
      <h2>Reset your password</h2>
      <p>We received a request to reset your SAML password.</p>
      <p><a href="${url}" style="display: inline-block; padding: 12px 20px; background: #1d4ed8; color: #fff; text-decoration: none; border-radius: 4px;">Reset Password</a></p>
      <p>Or copy and paste this link into your browser:<br />${url}</p>
      <p>If you did not request a password reset, no further action is required.</p>
    </div>
  `;

  await sendEmail({
    to,
    subject: 'Reset your SAML password',
    html,
  });
};
