# 360Ace VCard - Digital Contact Card Generator

A modern, state-of-the-art web application for creating digital contact cards (vCards) with QR codes. Built with the latest web technologies for optimal performance and user experience.

## Features

- **Digital vCard Generation**: Create vCard 3.0 format files for maximum mobile compatibility
- **QR Code Generation**: Automatically generate scannable QR codes containing contact information
- **Modern UI**: Beautiful, animated interface built with Framer Motion
- **Mobile Optimized**: Works seamlessly on iOS and Android devices
- **Instant Download**: One-click download that auto-saves contacts on mobile devices
- **Easy Sharing**: Share contact information via URL or QR code
- **Docker Ready**: Fully containerized for easy deployment

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **QR Generation**: qrcode library
- **Deployment**: Docker & docker-compose
- **Runtime**: Node.js 20 Alpine

## Quick Start

### Using Docker Compose (Recommended)

1. Clone the repository:
```bash
git clone <repository-url>
cd 360ace-vcard
```

2. Build and run with Docker Compose:
```bash
docker-compose up -d
```

3. Access the application at `http://localhost:3000`

### Manual Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open `http://localhost:3000` in your browser

## Docker Commands

### Build the Docker image:
```bash
docker build -t 360ace-vcard .
```

### Run the container:
```bash
docker run -p 3000:3000 360ace-vcard
```

### Using docker-compose:
```bash
# Start the application
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the application
docker-compose down

# Rebuild and restart
docker-compose up -d --build
```

## API Endpoints

### POST /api/vcard
Generate and download a vCard file.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "organization": "360Ace Inc.",
  "title": "CEO",
  "email": "john@360ace.com",
  "phone": "+1 (555) 123-4567",
  "mobile": "+1 (555) 987-6543",
  "website": "https://360ace.com",
  "note": "Additional information"
}
```

**Response:** vCard file download (.vcf)

### GET /api/vcard
Generate vCard via URL parameters.

**Example:**
```
http://localhost:3000/api/vcard?firstName=John&lastName=Doe&email=john@example.com&phone=+15551234567
```

### POST /api/qr
Generate QR code containing vCard data.

**Request Body:** Same as POST /api/vcard

**Response:**
```json
{
  "qrCode": "data:image/png;base64,...",
  "vcard": "BEGIN:VCARD\nVERSION:3.0\n..."
}
```

### GET /api/qr
Generate QR code via URL parameters.

**Parameters:**
- All vCard parameters (firstName, lastName, etc.)
- `format`: Output format (`dataurl`, `png`, or `svg`) - default: `dataurl`

**Examples:**
```
# Get QR code as JSON
http://localhost:3000/api/qr?firstName=John&lastName=Doe&email=john@example.com

# Get QR code as PNG image
http://localhost:3000/api/qr?firstName=John&lastName=Doe&format=png

# Get QR code as SVG
http://localhost:3000/api/qr?firstName=John&lastName=Doe&format=svg
```

## Usage Examples

### Embedding in a Website

**Direct Download Link:**
```html
<a href="https://yourdomain.com/api/vcard?firstName=John&lastName=Doe&email=john@example.com">
  Download Contact
</a>
```

**QR Code Image:**
```html
<img src="https://yourdomain.com/api/qr?firstName=John&lastName=Doe&email=john@example.com&format=png"
     alt="Scan to save contact" />
```

### Using as QR Code

1. Generate a QR code using the web interface
2. Download the QR code image
3. Print on business cards, flyers, or display on screens
4. Users can scan with their phone camera to instantly save the contact

### Sharing via URL

Generate a shareable URL for your vCard:
```
https://yourdomain.com/api/vcard?firstName=John&lastName=Doe&org=360Ace&email=john@360ace.com&phone=+15551234567
```

Anyone clicking this link will automatically download the vCard file.

## vCard 3.0 Compatibility

This application uses vCard 3.0 format for maximum compatibility:
- ✅ iOS (all versions)
- ✅ Android (all versions)
- ✅ Most contact management applications

Note: vCard 4.0 has limited mobile support, which is why we use 3.0.

## Project Structure

```
360ace-vcard/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── vcard/route.ts    # vCard generation API
│   │   │   └── qr/route.ts        # QR code generation API
│   │   ├── page.tsx               # Main landing page
│   │   ├── layout.tsx             # Root layout
│   │   └── globals.css            # Global styles
│   ├── components/
│   │   ├── VCardForm.tsx          # Contact form component
│   │   └── VCardResult.tsx        # QR code display component
│   └── lib/
│       ├── vcard.ts               # vCard generation utility
│       └── types.ts               # TypeScript types
├── public/                         # Static assets
├── Dockerfile                      # Docker configuration
├── docker-compose.yaml             # Docker Compose configuration
├── package.json                    # Dependencies
└── README.md                       # This file
```

## Environment Variables

No environment variables are required for basic functionality. The application works out of the box.

## Production Deployment

### Docker Deployment

1. Build the production image:
```bash
docker build -t 360ace-vcard:latest .
```

2. Run in production:
```bash
docker run -d -p 80:3000 --name vcard-app 360ace-vcard:latest
```

### Cloud Deployment

This application can be deployed to:
- AWS ECS/EKS
- Google Cloud Run
- Azure Container Instances
- DigitalOcean App Platform
- Any platform supporting Docker containers

Simply push the Docker image to your container registry and deploy.

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Android)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Support

For issues, questions, or suggestions, please open an issue in the repository.

---

Built with ❤️ using Next.js, TypeScript, and Framer Motion
