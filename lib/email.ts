/**
 * Email Service
 * Handles transactional emails using Resend (or SendGrid/Postmark)
 * 
 * To use Resend:
 * npm install resend
 * 
 * To use SendGrid:
 * npm install @sendgrid/mail
 */

// ============================================================================
// Configuration
// ============================================================================

const EMAIL_PROVIDER = process.env.EMAIL_PROVIDER || 'resend'; // 'resend' | 'sendgrid' | 'postmark'
const FROM_EMAIL = process.env.FROM_EMAIL || 'PowerCore <noreply@powercore.app>';
const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL || 'support@powercore.app';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://powercore.app';
const APP_NAME = 'PowerCore';

// ============================================================================
// Types
// ============================================================================

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}

interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

// ============================================================================
// Email Sending Functions
// ============================================================================

async function sendWithResend(options: EmailOptions): Promise<SendEmailResult> {
  try {
    // Dynamic import to avoid issues if not installed
    const { Resend } = await import('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
      reply_to: options.replyTo,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, messageId: data?.id };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to send email' 
    };
  }
}

async function sendWithSendGrid(options: EmailOptions): Promise<SendEmailResult> {
  try {
    const sgMail = await import('@sendgrid/mail');
    sgMail.default.setApiKey(process.env.SENDGRID_API_KEY!);

    const [response] = await sgMail.default.send({
      from: FROM_EMAIL,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
      replyTo: options.replyTo,
    });

    return { 
      success: response.statusCode >= 200 && response.statusCode < 300,
      messageId: response.headers['x-message-id'] as string,
    };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to send email' 
    };
  }
}

async function sendEmail(options: EmailOptions): Promise<SendEmailResult> {
  switch (EMAIL_PROVIDER) {
    case 'resend':
      return sendWithResend(options);
    case 'sendgrid':
      return sendWithSendGrid(options);
    default:
      console.log('Email would be sent:', options);
      return { success: true, messageId: 'mock-' + Date.now() };
  }
}

// ============================================================================
// Email Templates
// ============================================================================

const baseStyles = `
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
  .container { max-width: 600px; margin: 0 auto; padding: 20px; }
  .header { text-align: center; padding: 20px 0; border-bottom: 1px solid #eee; }
  .logo { font-size: 24px; font-weight: bold; color: #8b5cf6; }
  .content { padding: 30px 0; }
  .button { display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #8b5cf6, #06b6d4); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; }
  .footer { text-align: center; padding: 20px 0; border-top: 1px solid #eee; color: #666; font-size: 14px; }
  .highlight { background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 15px 0; }
`;

function wrapTemplate(content: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>${baseStyles}</style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">⚡ ${APP_NAME}</div>
        </div>
        <div class="content">
          ${content}
        </div>
        <div class="footer">
          <p>${APP_NAME} - The AI Agent Marketplace</p>
          <p><a href="${APP_URL}">Visit our website</a> | <a href="mailto:${SUPPORT_EMAIL}">Contact support</a></p>
          <p style="font-size: 12px; color: #999;">
            You're receiving this email because you have an account with ${APP_NAME}.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// ============================================================================
// Template Functions
// ============================================================================

export async function sendWelcomeEmail(params: { 
  email: string; 
  name: string;
  referralCode?: string;
}): Promise<SendEmailResult> {
  const { email, name, referralCode } = params;
  
  const html = wrapTemplate(`
    <h1>Welcome to ${APP_NAME}, ${name}! 🎉</h1>
    <p>We're thrilled to have you join our community of AI enthusiasts, creators, and innovators.</p>
    
    <h2>Get Started:</h2>
    <ul>
      <li><strong>Browse the Marketplace</strong> - Discover powerful AI agents built by our community</li>
      <li><strong>Explore the Skills Armory</strong> - Find modular skills to supercharge your agents</li>
      <li><strong>Create in the Workshop</strong> - Build your own agents with our no-code builder</li>
      <li><strong>Manage your Hangar</strong> - Equip, configure, and deploy your agents</li>
    </ul>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${APP_URL}/marketplace" class="button">Explore the Marketplace</a>
    </div>
    
    ${referralCode ? `
      <div class="highlight">
        <strong>🎁 Your Referral Code:</strong> <code>${referralCode}</code><br>
        Share this code with friends and earn $10 in credits for each signup!
      </div>
    ` : ''}
    
    <p>If you have any questions, feel free to reach out to our support team.</p>
    
    <p>Welcome aboard!<br>The ${APP_NAME} Team</p>
  `);

  return sendEmail({
    to: email,
    subject: `Welcome to ${APP_NAME}! 🚀`,
    html,
    text: `Welcome to ${APP_NAME}, ${name}! Get started at ${APP_URL}`,
  });
}

export async function sendPurchaseConfirmationEmail(params: {
  email: string;
  name: string;
  itemName: string;
  itemType: 'agent' | 'skill' | 'skill_pack' | 'subscription' | 'credits';
  amount: number;
  currency: string;
  transactionId: string;
}): Promise<SendEmailResult> {
  const { email, name, itemName, itemType, amount, currency, transactionId } = params;
  
  const itemTypeLabel = {
    agent: 'Agent',
    skill: 'Skill',
    skill_pack: 'Skill Pack',
    subscription: 'Subscription',
    credits: 'Credits',
  }[itemType];

  const accessUrl = itemType === 'agent' || itemType === 'skill' || itemType === 'skill_pack'
    ? `${APP_URL}/hangar`
    : `${APP_URL}/dashboard`;

  const html = wrapTemplate(`
    <h1>Thank you for your purchase! 🎉</h1>
    <p>Hi ${name},</p>
    <p>Your purchase has been confirmed. Here are the details:</p>
    
    <div class="highlight">
      <table style="width: 100%;">
        <tr>
          <td><strong>Item:</strong></td>
          <td>${itemName}</td>
        </tr>
        <tr>
          <td><strong>Type:</strong></td>
          <td>${itemTypeLabel}</td>
        </tr>
        <tr>
          <td><strong>Amount:</strong></td>
          <td>${currency.toUpperCase()} ${amount.toFixed(2)}</td>
        </tr>
        <tr>
          <td><strong>Transaction ID:</strong></td>
          <td><code>${transactionId}</code></td>
        </tr>
      </table>
    </div>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${accessUrl}" class="button">Access Your Purchase</a>
    </div>
    
    <p>If you have any questions about your purchase, please contact our support team.</p>
    
    <p>Thank you for choosing ${APP_NAME}!<br>The ${APP_NAME} Team</p>
  `);

  return sendEmail({
    to: email,
    subject: `Purchase Confirmed: ${itemName}`,
    html,
    text: `Thank you for your purchase of ${itemName} for ${currency.toUpperCase()} ${amount.toFixed(2)}. Transaction ID: ${transactionId}`,
  });
}

export async function sendPasswordResetEmail(params: {
  email: string;
  name: string;
  resetToken: string;
}): Promise<SendEmailResult> {
  const { email, name, resetToken } = params;
  const resetUrl = `${APP_URL}/auth/reset-password?token=${resetToken}`;

  const html = wrapTemplate(`
    <h1>Reset Your Password</h1>
    <p>Hi ${name},</p>
    <p>We received a request to reset your password. Click the button below to create a new password:</p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${resetUrl}" class="button">Reset Password</a>
    </div>
    
    <p>This link will expire in 1 hour for security reasons.</p>
    
    <p style="color: #666; font-size: 14px;">
      If you didn't request a password reset, you can safely ignore this email. 
      Your password will remain unchanged.
    </p>
    
    <p>Best regards,<br>The ${APP_NAME} Team</p>
  `);

  return sendEmail({
    to: email,
    subject: 'Reset Your Password',
    html,
    text: `Reset your password by visiting: ${resetUrl}. This link expires in 1 hour.`,
  });
}

export async function sendCreatorPayoutNotificationEmail(params: {
  email: string;
  name: string;
  amount: number;
  currency: string;
  periodStart: string;
  periodEnd: string;
  payoutId: string;
}): Promise<SendEmailResult> {
  const { email, name, amount, currency, periodStart, periodEnd, payoutId } = params;

  const html = wrapTemplate(`
    <h1>Payout Processed! 💰</h1>
    <p>Hi ${name},</p>
    <p>Great news! Your creator payout has been processed and is on its way to your account.</p>
    
    <div class="highlight">
      <table style="width: 100%;">
        <tr>
          <td><strong>Amount:</strong></td>
          <td style="font-size: 24px; color: #10b981;">${currency.toUpperCase()} ${amount.toFixed(2)}</td>
        </tr>
        <tr>
          <td><strong>Period:</strong></td>
          <td>${periodStart} - ${periodEnd}</td>
        </tr>
        <tr>
          <td><strong>Payout ID:</strong></td>
          <td><code>${payoutId}</code></td>
        </tr>
      </table>
    </div>
    
    <p>Funds typically arrive within 2-3 business days, depending on your bank.</p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${APP_URL}/dashboard/payouts" class="button">View Payout History</a>
    </div>
    
    <p>Thank you for creating with ${APP_NAME}!</p>
    
    <p>The ${APP_NAME} Team</p>
  `);

  return sendEmail({
    to: email,
    subject: `Payout Processed: ${currency.toUpperCase()} ${amount.toFixed(2)}`,
    html,
    text: `Your payout of ${currency.toUpperCase()} ${amount.toFixed(2)} for ${periodStart} - ${periodEnd} has been processed. Payout ID: ${payoutId}`,
  });
}

export async function sendAgentSoldNotificationEmail(params: {
  email: string;
  name: string;
  agentName: string;
  saleAmount: number;
  yourEarnings: number;
  currency: string;
  buyerName?: string;
}): Promise<SendEmailResult> {
  const { email, name, agentName, saleAmount, yourEarnings, currency, buyerName } = params;

  const html = wrapTemplate(`
    <h1>You made a sale! 🎉</h1>
    <p>Hi ${name},</p>
    <p>Congratulations! Your agent was just purchased${buyerName ? ` by ${buyerName}` : ''}.</p>
    
    <div class="highlight">
      <table style="width: 100%;">
        <tr>
          <td><strong>Agent:</strong></td>
          <td>${agentName}</td>
        </tr>
        <tr>
          <td><strong>Sale Amount:</strong></td>
          <td>${currency.toUpperCase()} ${saleAmount.toFixed(2)}</td>
        </tr>
        <tr>
          <td><strong>Your Earnings:</strong></td>
          <td style="font-size: 20px; color: #10b981;">${currency.toUpperCase()} ${yourEarnings.toFixed(2)}</td>
        </tr>
      </table>
    </div>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${APP_URL}/dashboard/analytics" class="button">View Your Sales</a>
    </div>
    
    <p>Keep up the great work!</p>
    
    <p>The ${APP_NAME} Team</p>
  `);

  return sendEmail({
    to: email,
    subject: `💰 Sale: ${agentName} - You earned ${currency.toUpperCase()} ${yourEarnings.toFixed(2)}`,
    html,
    text: `Congratulations! Your agent "${agentName}" was purchased for ${currency.toUpperCase()} ${saleAmount.toFixed(2)}. Your earnings: ${currency.toUpperCase()} ${yourEarnings.toFixed(2)}`,
  });
}

export async function sendAccountDeletionConfirmationEmail(params: {
  email: string;
  name: string;
  deletionDate: string;
}): Promise<SendEmailResult> {
  const { email, name, deletionDate } = params;

  const html = wrapTemplate(`
    <h1>Account Deletion Confirmed</h1>
    <p>Hi ${name},</p>
    <p>We've received your request to delete your ${APP_NAME} account.</p>
    
    <div class="highlight">
      <p><strong>Your account will be permanently deleted on:</strong><br>
      <span style="font-size: 18px;">${deletionDate}</span></p>
    </div>
    
    <p>After this date:</p>
    <ul>
      <li>All your personal data will be permanently removed</li>
      <li>Your agents and skills will be delisted from the marketplace</li>
      <li>Any pending payouts will be processed before deletion</li>
      <li>This action cannot be undone</li>
    </ul>
    
    <p>If you didn't request this or have changed your mind, please contact our support team immediately at <a href="mailto:${SUPPORT_EMAIL}">${SUPPORT_EMAIL}</a>.</p>
    
    <p>We're sorry to see you go. If you have any feedback on how we could improve, we'd love to hear from you.</p>
    
    <p>Best regards,<br>The ${APP_NAME} Team</p>
  `);

  return sendEmail({
    to: email,
    subject: 'Account Deletion Confirmation',
    html,
    text: `Your ${APP_NAME} account will be permanently deleted on ${deletionDate}. Contact ${SUPPORT_EMAIL} if you didn't request this.`,
  });
}

// ============================================================================
// Export all functions
// ============================================================================

export {
  sendEmail,
  type EmailOptions,
  type SendEmailResult,
};
