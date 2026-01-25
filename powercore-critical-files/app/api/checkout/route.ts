/**
 * Stripe Checkout API Route
 * Creates checkout sessions for agent/skill purchases and subscriptions
 */

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

// Types
interface CheckoutRequest {
  itemType: 'agent' | 'skill' | 'skill_pack' | 'subscription' | 'credits';
  itemId: string;
  priceId?: string; // For subscriptions
  quantity?: number; // For credits
  successUrl?: string;
  cancelUrl?: string;
}

interface ItemDetails {
  name: string;
  description: string;
  price: number; // in cents
  image?: string;
}

// Mock function to get item details - replace with actual database query
async function getItemDetails(itemType: string, itemId: string): Promise<ItemDetails | null> {
  // TODO: Replace with actual database query
  // Example:
  // if (itemType === 'agent') {
  //   const agent = await prisma.agent.findUnique({ where: { id: itemId } });
  //   return agent ? { name: agent.name, description: agent.description, price: agent.price * 100 } : null;
  // }
  
  // Placeholder - replace with real implementation
  const mockItems: Record<string, Record<string, ItemDetails>> = {
    agent: {
      'agent-1': { name: 'Research Pro Agent', description: 'Advanced research assistant', price: 2900 },
      'agent-2': { name: 'Code Helper Agent', description: 'Programming assistant', price: 4900 },
    },
    skill: {
      'skill-1': { name: 'Web Search Pro', description: 'Advanced web search capability', price: 0 },
      'skill-2': { name: 'Document Creator', description: 'Create Word documents', price: 1900 },
    },
    skill_pack: {
      'pack-1': { name: 'Office Suite', description: 'Word, Excel, PDF skills', price: 4900 },
    },
    credits: {
      'credits-10': { name: '10 Credits', description: 'Platform credits', price: 1000 },
      'credits-50': { name: '50 Credits', description: 'Platform credits', price: 4500 },
      'credits-100': { name: '100 Credits', description: 'Platform credits', price: 8000 },
    },
  };

  return mockItems[itemType]?.[itemId] || null;
}

// Get user from session - replace with actual auth
async function getUserFromRequest(req: NextRequest): Promise<{ id: string; email: string } | null> {
  // TODO: Replace with actual auth implementation
  // Example with NextAuth:
  // const session = await getServerSession(authOptions);
  // return session?.user ? { id: session.user.id, email: session.user.email } : null;
  
  // Placeholder - check for auth header
  const authHeader = req.headers.get('authorization');
  if (!authHeader) return null;
  
  // Mock user - replace with real auth
  return { id: 'user-123', email: 'user@example.com' };
}

export async function POST(req: NextRequest) {
  try {
    // Get user
    const user = await getUserFromRequest(req);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Please sign in to make a purchase' },
        { status: 401 }
      );
    }

    // Parse request body
    const body: CheckoutRequest = await req.json();
    const { itemType, itemId, priceId, quantity, successUrl, cancelUrl } = body;

    // Validate required fields
    if (!itemType || !itemId) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'itemType and itemId are required' },
        { status: 400 }
      );
    }

    // Handle subscription checkout
    if (itemType === 'subscription' && priceId) {
      const session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        payment_method_types: ['card'],
        customer_email: user.email,
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        success_url: successUrl || `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: cancelUrl || `${process.env.NEXT_PUBLIC_APP_URL}/checkout/cancel`,
        metadata: {
          userId: user.id,
          itemType,
          itemId,
        },
      });

      return NextResponse.json({ checkoutUrl: session.url, sessionId: session.id });
    }

    // Get item details for one-time purchases
    const item = await getItemDetails(itemType, itemId);
    if (!item) {
      return NextResponse.json(
        { error: 'Not Found', message: 'Item not found' },
        { status: 404 }
      );
    }

    // Check if item is free
    if (item.price === 0) {
      // Handle free item - directly grant access
      // TODO: Add item to user's account
      return NextResponse.json({ 
        success: true, 
        message: 'Free item added to your account',
        transactionId: `free-${Date.now()}`
      });
    }

    // Create Stripe checkout session for one-time purchase
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: user.email,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: item.name,
              description: item.description,
              ...(item.image && { images: [item.image] }),
            },
            unit_amount: item.price,
          },
          quantity: quantity || 1,
        },
      ],
      success_url: successUrl || `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${process.env.NEXT_PUBLIC_APP_URL}/checkout/cancel`,
      metadata: {
        userId: user.id,
        itemType,
        itemId,
      },
      // Enable automatic tax calculation if configured
      // automatic_tax: { enabled: true },
      
      // Allow promotion codes
      allow_promotion_codes: true,
      
      // Collect billing address for tax purposes
      billing_address_collection: 'required',
    });

    return NextResponse.json({ 
      checkoutUrl: session.url, 
      sessionId: session.id 
    });

  } catch (error) {
    console.error('Checkout error:', error);
    
    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        { error: 'Payment Error', message: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal Error', message: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}

// GET endpoint to verify a checkout session
export async function GET(req: NextRequest) {
  try {
    const sessionId = req.nextUrl.searchParams.get('session_id');
    
    if (!sessionId) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'session_id is required' },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items', 'payment_intent'],
    });

    return NextResponse.json({
      id: session.id,
      status: session.payment_status,
      customerEmail: session.customer_details?.email,
      amountTotal: session.amount_total,
      currency: session.currency,
      metadata: session.metadata,
    });

  } catch (error) {
    console.error('Session verification error:', error);
    
    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        { error: 'Stripe Error', message: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal Error', message: 'Failed to verify session' },
      { status: 500 }
    );
  }
}
