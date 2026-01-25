/**
 * Health Check Endpoint
 * Used by monitoring services to verify the application is running
 */

import { NextResponse } from 'next/server';

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  version: string;
  uptime: number;
  checks: {
    database: CheckResult;
    api: CheckResult;
    stripe: CheckResult;
  };
}

interface CheckResult {
  status: 'pass' | 'fail' | 'warn';
  latency?: number;
  message?: string;
}

// Track server start time for uptime calculation
const startTime = Date.now();

async function checkDatabase(): Promise<CheckResult> {
  const start = Date.now();
  try {
    // In production, replace with actual database ping
    // Example with Prisma:
    // await prisma.$queryRaw`SELECT 1`;
    
    // Simulated check - replace with real implementation
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
      return { status: 'fail', message: 'DATABASE_URL not configured' };
    }
    
    // TODO: Add actual database ping
    // For now, just check if env var exists
    return { status: 'pass', latency: Date.now() - start };
  } catch (error) {
    return { 
      status: 'fail', 
      latency: Date.now() - start,
      message: error instanceof Error ? error.message : 'Database check failed'
    };
  }
}

async function checkApi(): Promise<CheckResult> {
  const start = Date.now();
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      return { status: 'warn', message: 'API_URL not configured' };
    }

    const response = await fetch(`${apiUrl}/health`, {
      method: 'GET',
      signal: AbortSignal.timeout(5000), // 5 second timeout
    });

    if (response.ok) {
      return { status: 'pass', latency: Date.now() - start };
    } else {
      return { 
        status: 'warn', 
        latency: Date.now() - start,
        message: `API returned ${response.status}`
      };
    }
  } catch (error) {
    return { 
      status: 'fail', 
      latency: Date.now() - start,
      message: error instanceof Error ? error.message : 'API check failed'
    };
  }
}

async function checkStripe(): Promise<CheckResult> {
  const start = Date.now();
  try {
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) {
      return { status: 'warn', message: 'STRIPE_SECRET_KEY not configured' };
    }

    // Verify Stripe API is accessible
    // In production, you might want to make a simple Stripe API call
    // For now, just verify the key format
    if (!stripeKey.startsWith('sk_')) {
      return { status: 'fail', message: 'Invalid Stripe key format' };
    }

    return { status: 'pass', latency: Date.now() - start };
  } catch (error) {
    return { 
      status: 'fail', 
      latency: Date.now() - start,
      message: error instanceof Error ? error.message : 'Stripe check failed'
    };
  }
}

function determineOverallStatus(checks: HealthStatus['checks']): 'healthy' | 'degraded' | 'unhealthy' {
  const results = Object.values(checks);
  
  // If any critical service fails, unhealthy
  if (checks.database.status === 'fail') {
    return 'unhealthy';
  }
  
  // If any service fails, degraded
  if (results.some(r => r.status === 'fail')) {
    return 'degraded';
  }
  
  // If any service warns, degraded
  if (results.some(r => r.status === 'warn')) {
    return 'degraded';
  }
  
  return 'healthy';
}

export async function GET() {
  const [database, api, stripe] = await Promise.all([
    checkDatabase(),
    checkApi(),
    checkStripe(),
  ]);

  const checks = { database, api, stripe };
  const status = determineOverallStatus(checks);

  const health: HealthStatus = {
    status,
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    uptime: Math.floor((Date.now() - startTime) / 1000),
    checks,
  };

  // Return 200 for healthy/degraded, 503 for unhealthy
  const httpStatus = status === 'unhealthy' ? 503 : 200;

  return NextResponse.json(health, { status: httpStatus });
}

// Also support HEAD requests for simple uptime checks
export async function HEAD() {
  return new NextResponse(null, { status: 200 });
}
