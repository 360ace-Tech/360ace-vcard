import { VCardData } from './types';

/**
 * Generates a vCard 3.0 formatted string from contact data
 * vCard 3.0 is used for maximum mobile compatibility (iOS and Android)
 */
export function generateVCard(data: VCardData): string {
  const lines: string[] = [];

  // vCard 3.0 header
  lines.push('BEGIN:VCARD');
  lines.push('VERSION:3.0');

  // Name (required)
  const fullName = `${data.firstName} ${data.lastName}`.trim();
  lines.push(`FN:${escapeVCardValue(fullName)}`);
  lines.push(`N:${escapeVCardValue(data.lastName)};${escapeVCardValue(data.firstName)};;;`);

  // Organization and title
  if (data.organization) {
    lines.push(`ORG:${escapeVCardValue(data.organization)}`);
  }

  if (data.title) {
    lines.push(`TITLE:${escapeVCardValue(data.title)}`);
  }

  // Contact information
  if (data.email) {
    lines.push(`EMAIL;TYPE=INTERNET:${escapeVCardValue(data.email)}`);
  }

  if (data.phone) {
    lines.push(`TEL;TYPE=WORK,VOICE:${escapeVCardValue(data.phone)}`);
  }

  if (data.mobile) {
    lines.push(`TEL;TYPE=CELL:${escapeVCardValue(data.mobile)}`);
  }

  if (data.website) {
    lines.push(`URL:${escapeVCardValue(data.website)}`);
  }

  // Address
  if (data.address) {
    const addr = data.address;
    const addressLine = `ADR;TYPE=WORK:;;${escapeVCardValue(addr.street || '')};${escapeVCardValue(addr.city || '')};${escapeVCardValue(addr.state || '')};${escapeVCardValue(addr.zip || '')};${escapeVCardValue(addr.country || '')}`;
    lines.push(addressLine);
  }

  // Photo (base64 encoded)
  if (data.photo) {
    lines.push(`PHOTO;ENCODING=b;TYPE=JPEG:${data.photo}`);
  }

  // Note
  if (data.note) {
    lines.push(`NOTE:${escapeVCardValue(data.note)}`);
  }

  // Timestamp
  const now = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  lines.push(`REV:${now}`);

  // vCard footer
  lines.push('END:VCARD');

  return lines.join('\r\n');
}

/**
 * Escapes special characters in vCard values
 */
function escapeVCardValue(value: string): string {
  if (!value) return '';
  return value
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');
}

/**
 * Generates a filename for the vCard
 */
export function generateVCardFilename(data: VCardData): string {
  const name = `${data.firstName}_${data.lastName}`.replace(/\s+/g, '_');
  return `${name}.vcf`;
}
