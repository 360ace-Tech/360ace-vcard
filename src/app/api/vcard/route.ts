import { NextRequest, NextResponse } from 'next/server';
import { generateVCard, generateVCardFilename } from '@/lib/vcard';
import { VCardData } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const data: VCardData = await request.json();

    // Validate required fields
    if (!data.firstName || !data.lastName) {
      return NextResponse.json(
        { error: 'firstName and lastName are required' },
        { status: 400 }
      );
    }

    // Generate vCard content
    const vcardContent = generateVCard(data);
    const filename = generateVCardFilename(data);

    // Return vCard file with proper headers for download
    return new NextResponse(vcardContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/vcard; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    console.error('Error generating vCard:', error);
    return NextResponse.json(
      { error: 'Failed to generate vCard' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Build vCard data from query parameters
    const data: VCardData = {
      firstName: searchParams.get('firstName') || searchParams.get('fn') || '',
      lastName: searchParams.get('lastName') || searchParams.get('ln') || '',
      organization: searchParams.get('org') || undefined,
      title: searchParams.get('title') || undefined,
      email: searchParams.get('email') || undefined,
      phone: searchParams.get('phone') || undefined,
      mobile: searchParams.get('mobile') || undefined,
      website: searchParams.get('website') || searchParams.get('url') || undefined,
      note: searchParams.get('note') || undefined,
    };

    // Handle address if provided
    const street = searchParams.get('street');
    const city = searchParams.get('city');
    const state = searchParams.get('state');
    const zip = searchParams.get('zip');
    const country = searchParams.get('country');

    if (street || city || state || zip || country) {
      data.address = {
        street: street || undefined,
        city: city || undefined,
        state: state || undefined,
        zip: zip || undefined,
        country: country || undefined,
      };
    }

    // Validate required fields
    if (!data.firstName || !data.lastName) {
      return NextResponse.json(
        { error: 'firstName and lastName are required' },
        { status: 400 }
      );
    }

    // Generate vCard content
    const vcardContent = generateVCard(data);
    const filename = generateVCardFilename(data);

    // Return vCard file with proper headers for download
    return new NextResponse(vcardContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/vcard; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    console.error('Error generating vCard:', error);
    return NextResponse.json(
      { error: 'Failed to generate vCard' },
      { status: 500 }
    );
  }
}
