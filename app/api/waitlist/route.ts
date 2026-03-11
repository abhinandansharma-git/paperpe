import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Simple in-memory rate limiter (use Redis in production)
const rateLimit = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 5; // 5 requests per minute

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimit.get(ip);
  
  if (!record || now > record.resetTime) {
    rateLimit.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return false;
  }
  
  if (record.count >= MAX_REQUESTS) {
    return true;
  }
  
  record.count++;
  return false;
}

function sanitizeEmail(email: string): string {
  return email.trim().toLowerCase().slice(0, 255);
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 255;
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const email = sanitizeEmail(body.email || '');

    // Validation
    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    // Supabase connection
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error('Supabase credentials not configured');
      return NextResponse.json(
        { error: 'Service temporarily unavailable.' },
        { status: 503 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check for existing email
    const { data: existing } = await supabase
      .from('waitlist')
      .select('email')
      .eq('email', email)
      .single();

    if (existing) {
      return NextResponse.json(
        { message: 'You\'re already on the waitlist!' },
        { status: 200 }
      );
    }

    // Insert new entry
    const { error } = await supabase
      .from('waitlist')
      .insert([{ email, created_at: new Date().toISOString() }]);

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to join waitlist. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Welcome to PaperPe! We\'ll notify you when we launch.' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Waitlist API error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
