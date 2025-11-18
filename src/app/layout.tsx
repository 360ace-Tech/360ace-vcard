import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '360Ace VCard - Digital Contact Card Generator',
  description: 'Create and share your digital contact card with QR code. Save contacts instantly on any mobile device.',
  keywords: 'vcard, digital contact, QR code, contact card, business card, vcf',
  openGraph: {
    title: '360Ace VCard - Digital Contact Card Generator',
    description: 'Create and share your digital contact card with QR code.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
