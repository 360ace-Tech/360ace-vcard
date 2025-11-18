import { NextRequest, NextResponse } from 'next/server';
import QRCode from 'qrcode';
import { generateVCard } from '@/lib/vcard';
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

    // Generate QR code as data URL
    const qrCodeDataUrl = await QRCode.toDataURL(vcardContent, {
      errorCorrectionLevel: 'M',
      type: 'image/png',
      width: 400,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    });

    return NextResponse.json({
      qrCode: qrCodeDataUrl,
      vcard: vcardContent,
    });
  } catch (error) {
    console.error('Error generating QR code:', error);
    return NextResponse.json(
      { error: 'Failed to generate QR code' },
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

    // Determine format (default to PNG data URL)
    const format = searchParams.get('format') || 'dataurl';

    if (format === 'svg') {
      // Generate QR code as SVG
      const qrCodeSvg = await QRCode.toString(vcardContent, {
        type: 'svg',
        errorCorrectionLevel: 'M',
        width: 400,
        margin: 2,
      });

      return new NextResponse(qrCodeSvg, {
        status: 200,
        headers: {
          'Content-Type': 'image/svg+xml',
          'Cache-Control': 'public, max-age=3600',
        },
      });
    } else if (format === 'png') {
      // Generate QR code as PNG buffer
      const qrCodeBuffer = await QRCode.toBuffer(vcardContent, {
        errorCorrectionLevel: 'M',
        type: 'png',
        width: 400,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      });

      return new NextResponse(new Uint8Array(qrCodeBuffer), {
        status: 200,
        headers: {
          'Content-Type': 'image/png',
          'Cache-Control': 'public, max-age=3600',
        },
      });
    } else {
      // Return as JSON with data URL (default)
      const qrCodeDataUrl = await QRCode.toDataURL(vcardContent, {
        errorCorrectionLevel: 'M',
        type: 'image/png',
        width: 400,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      });

      return NextResponse.json({
        qrCode: qrCodeDataUrl,
        vcard: vcardContent,
      });
    }
  } catch (error) {
    console.error('Error generating QR code:', error);
    return NextResponse.json(
      { error: 'Failed to generate QR code' },
      { status: 500 }
    );
  }
}
