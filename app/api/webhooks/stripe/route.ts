/**
 * Stripe Webhook Handler
 * Processes payment confirmations with idempotency and retry logic
 */

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

// ============================================================================
// Types
// ============================================================================

interface WebhookEvent {
  id: string;
  provider: string;
  eventType: string;
  payload: Stripe.Event;
  status: 'pending' | 'processed' | 'failed';
  attempts: number;
  lastAttemptAt: Date | null;
  processedAt: Date | null;
  errorMessage: string | null;
  createdAt: Date;
}

// ============================================================================
// Database Operations (replace with actual implementation)
// ============================================================================

// Store webhook event for idempotency and retry
async function storeWebhookEvent(event: Stripe.Event): Promise<boolean> {
  // TODO: Replace with actual database operation
  // Example with Prisma:
  // try {
  //   await prisma.webhookEvent.create({
  //     data: {
  //       id: event.id,
  //       provider: 'stripe',
  //       eventType: event.type,
  //       payload: event as any,
  //       status: 'pending',
  //       attempts: 0,
  //     },
  //   });
  //   return true;
  // } catch (error) {
  //   // If unique constraint violation, event already exists
  //   if (error.code === 'P2002') return false;
  //   throw error;
  // }
  
  console.log(`Storing webhook event: ${event.id}`);
  return true; // Placeholder
}

// Check if event was already processed (idempotency)
async function isEventProcessed(eventId: string): Promise<boolean> {
  // TODO: Replace with actual database check
  // Example with Prisma:
  // const event = await prisma.webhookEvent.findUnique({
  //   where: { id: eventId },
  // });
  // return event?.status === 'processed';
  
  return false; // Placeholder
}

// Mark event as processed
async function markEventProcessed(eventId: string): Promise<void> {
  // TODO: Replace with actual database update
  // Example with Prisma:
  // await prisma.webhookEvent.update({
  //   where: { id: eventId },
  //   data: { status: 'processed', processedAt: new Date() },
  // });
  
  console.log(`Marked event processed: ${eventId}`);
}

// Mark event as failed
async function markEventFailed(eventId: string, error: string): Promise<void> {
  // TODO: Replace with actual database update
  // Example with Prisma:
  // await prisma.webhookEvent.update({
  //   where: { id: eventId },
  //   data: { 
  //     status: 'failed', 
  //     errorMessage: error,
  //     attempts: { increment: 1 },
  //     lastAttemptAt: new Date(),
  //   },
  // });
  
  console.error(`Event failed: ${eventId} - ${error}`);
}

// ============================================================================
// Business Logic Handlers
// ============================================================================

async function handleCheckoutCompleted(session: Stripe.Checkout.Session): Promise<void> {
  const { userId, itemType, itemId } = session.metadata || {};
  
  if (!userId || !itemType || !itemId) {
    throw new Error('Missing metadata in checkout session');
  }

  console.log(`Processing purchase: ${itemType}/${itemId} for user ${userId}`);

  // Grant access based on item type
  switch (itemType) {
    case 'agent':
      await grantAgentAccess(userId, itemId);
      break;
    case 'skill':
      await grantSkillAccess(userId, itemId);
      break;
    case 'skill_pack':
      await grantSkillPackAccess(userId, itemId);
      break;
    case 'credits':
      await addCredits(userId, itemId);
      break;
    default:
      throw new Error(`Unknown item type: ${itemType}`);
  }

  // Record the payment
  await recordPayment({
    userId,
    itemType,
    itemId,
    amount: session.amount_total! / 100,
    currency: session.currency!,
    paymentMethod: 'stripe',
    paymentProviderId: session.payment_intent as string,
    status: 'completed',
  });

  // Send confirmation email
  await sendPurchaseConfirmationEmail(userId, itemType, itemId);
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription): Promise<void> {
  const customerId = subscription.customer as string;
  
  // TODO: Get user by Stripe customer ID
  // const user = await prisma.user.findUnique({ where: { stripeCustomerId: customerId } });
  
  console.log(`Subscription created for customer: ${customerId}`);
  
  // TODO: Update user's subscription tier
  // await prisma.user.update({
  //   where: { stripeCustomerId: customerId },
  //   data: { tier: 'pro', subscriptionId: subscription.id },
  // });
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription): Promise<void> {
  const customerId = subscription.customer as string;
  
  console.log(`Subscription updated for customer: ${customerId}, status: ${subscription.status}`);
  
  // Handle subscription status changes
  if (subscription.status === 'canceled' || subscription.status === 'unpaid') {
    // TODO: Downgrade user
    // await prisma.user.update({
    //   where: { stripeCustomerId: customerId },
    //   data: { tier: 'free', subscriptionId: null },
    // });
  }
}

async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent): Promise<void> {
  console.log(`Payment failed: ${paymentIntent.id}`);
  
  // TODO: Notify user of failed payment
  // TODO: Update payment record status
}

async function handleRefund(charge: Stripe.Charge): Promise<void> {
  console.log(`Refund processed for charge: ${charge.id}`);
  
  // TODO: Revoke access if applicable
  // TODO: Update payment record status to 'refunded'
}

// ============================================================================
// Helper Functions (replace with actual implementations)
// ============================================================================

async function grantAgentAccess(userId: string, agentId: string): Promise<void> {
  // TODO: Add agent to user's owned agents
  // await prisma.userAgent.create({
  //   data: { userId, agentId, purchasedAt: new Date() },
  // });
  console.log(`Granted agent access: ${agentId} to user ${userId}`);
}

async function grantSkillAccess(userId: string, skillId: string): Promise<void> {
  // TODO: Add skill to user's owned skills
  // await prisma.userSkill.create({
  //   data: { userId, skillId, purchasedAt: new Date() },
  // });
  console.log(`Granted skill access: ${skillId} to user ${userId}`);
}

async function grantSkillPackAccess(userId: string, packId: string): Promise<void> {
  // TODO: Get pack's skills and grant all of them
  // const pack = await prisma.skillPack.findUnique({ where: { id: packId }, include: { skills: true } });
  // for (const skill of pack.skills) {
  //   await grantSkillAccess(userId, skill.id);
  // }
  console.log(`Granted skill pack access: ${packId} to user ${userId}`);
}

async function addCredits(userId: string, creditPackId: string): Promise<void> {
  // Map pack ID to credit amount
  const creditAmounts: Record<string, number> = {
    'credits-10': 10,
    'credits-50': 50,
    'credits-100': 100,
  };
  
  const amount = creditAmounts[creditPackId] || 0;
  
  // TODO: Add credits to user's balance
  // await prisma.userCredits.upsert({
  //   where: { userId },
  //   update: { balance: { increment: amount } },
  //   create: { userId, balance: amount },
  // });
  console.log(`Added ${amount} credits to user ${userId}`);
}

async function recordPayment(payment: {
  userId: string;
  itemType: string;
  itemId: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  paymentProviderId: string;
  status: string;
}): Promise<void> {
  // TODO: Record payment in database
  // await prisma.payment.create({ data: payment });
  console.log(`Recorded payment:`, payment);
}

async function sendPurchaseConfirmationEmail(userId: string, itemType: string, itemId: string): Promise<void> {
  // TODO: Send email using your email service
  // await sendEmail({
  //   to: user.email,
  //   template: 'purchase_confirmation',
  //   data: { itemType, itemId },
  // });
  console.log(`Sent confirmation email to user ${userId}`);
}

// ============================================================================
// Main Webhook Handler
// ============================================================================

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  // Check idempotency - has this event already been processed?
  const alreadyProcessed = await isEventProcessed(event.id);
  if (alreadyProcessed) {
    console.log(`Event already processed: ${event.id}`);
    return NextResponse.json({ received: true, status: 'already_processed' });
  }

  // Store event for audit trail and retry logic
  await storeWebhookEvent(event);

  try {
    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }

      case 'customer.subscription.created': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionCreated(subscription);
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdated(subscription);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdated(subscription); // Same handler, just checks status
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentFailed(paymentIntent);
        break;
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge;
        await handleRefund(charge);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    // Mark event as processed
    await markEventProcessed(event.id);

    return NextResponse.json({ received: true, status: 'processed' });

  } catch (error) {
    console.error(`Error processing webhook ${event.id}:`, error);
    
    // Mark event as failed for retry
    await markEventFailed(event.id, error instanceof Error ? error.message : 'Unknown error');

    // Return 500 so Stripe will retry
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

// Stripe requires raw body for signature verification
export const config = {
  api: {
    bodyParser: false,
  },
};
