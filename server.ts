import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { google } from 'googleapis';
import { DESTINATIONS, HOTELS, FLIGHTS, TOUR_PACKAGES, REVIEWS } from './src/data.ts';
import { Booking, Itinerary } from './src/types.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Gemini SDK
// Always use GEMINI_API_KEY for the Gemini API on server-side code only
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const app = express();
app.use(express.json());

const PORT = 3000;
const DB_FILE = path.join(__dirname, 'src', 'bookings_db.json');

// Initialize local DB for persistent bookings
function loadBookings(): Booking[] {
  try {
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error('Failed to read bookings database, returning mock defaults:', err);
  }
  
  // Return some initial sample bookings for high-fidelity simulation
  const initialBookings: Booking[] = [
    {
      id: 'BK-501',
      userId: 'mock-user-id',
      userName: 'Alexandra Thornton',
      userEmail: 'ms2633547@gmail.com',
      itemType: 'tour',
      itemId: 'amalfi-escapade',
      itemName: 'Amalfi Coast Luxury Voyager',
      startDate: '2026-08-15',
      endDate: '2026-08-22',
      guestsCount: 2,
      totalPrice: 9900,
      status: 'confirmed',
      createdAt: '2026-06-20T14:22:00.000Z',
      emailSent: true,
    },
    {
      id: 'BK-502',
      userId: 'mock-user-id',
      userName: 'Maximilian Vance',
      userEmail: 'ms2633547@gmail.com',
      itemType: 'hotel',
      itemId: 'hoshinoya-kyoto',
      itemName: 'Hoshinoya Kyoto - Tsukimi Riverside Pavilion Suite',
      startDate: '2026-09-10',
      endDate: '2026-09-15',
      guestsCount: 2,
      totalPrice: 4750,
      status: 'pending',
      createdAt: '2026-06-21T02:11:00.000Z',
    }
  ];
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(initialBookings, null, 2));
  } catch (err) {
    console.warn('Could not write initial database file:', err);
  }
  return initialBookings;
}

function saveBookings(bookings: Booking[]) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(bookings, null, 2));
  } catch (err) {
    console.error('Failed to save bookings database:', err);
  }
}

// ------------------------------------------------------------------
// API ENDPOINTS
// ------------------------------------------------------------------

app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Resources catalogs
app.get('/api/destinations', (req, res) => {
  res.json(DESTINATIONS);
});

app.get('/api/packages', (req, res) => {
  res.json(TOUR_PACKAGES);
});

app.get('/api/hotels', (req, res) => {
  res.json(HOTELS);
});

app.get('/api/flights', (req, res) => {
  res.json(FLIGHTS);
});

app.get('/api/reviews', (req, res) => {
  res.json(REVIEWS);
});

// Bookings management
app.get('/api/bookings', (req, res) => {
  const bookings = loadBookings();
  res.json(bookings);
});

app.post('/api/bookings', async (req, res) => {
  const { booking, googleToken } = req.body;
  if (!booking) {
    res.status(400).json({ error: 'Invalid booking data' });
    return;
  }

  const bookings = loadBookings();
  const newBooking: Booking = {
    ...booking,
    id: `BK-${Math.floor(100 + Math.random() * 900)}`,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  // Google Workspace Integration (Sheets, Docs, Gmail)
  if (googleToken) {
    try {
      const auth = new google.auth.OAuth2();
      auth.setCredentials({ access_token: googleToken });

      // 1. Google Sheets Integration
      let sheetsUrl = '';
      try {
        const sheetsStatus = await handleGoogleSheetsLogs(newBooking, auth);
        sheetsUrl = sheetsStatus.spreadsheetUrl || '';
        newBooking.sheetsUrl = sheetsUrl;
      } catch (sheetErr) {
        console.error('Sheets log failed:', sheetErr);
      }

      // 2. Google Docs Itinerary Generation
      let docsUrl = '';
      try {
        const docsStatus = await handleGoogleDocsGeneration(newBooking, auth);
        docsUrl = docsStatus.documentUrl || '';
        newBooking.docsUrl = docsUrl;
      } catch (docErr) {
        console.error('Docs generation failed:', docErr);
      }

      // 3. Gmail Notification Email Send
      try {
        await handleGmailNotification(newBooking, auth);
        newBooking.emailSent = true;
      } catch (gmailErr) {
        console.error('Gmail delivery failed:', gmailErr);
      }

    } catch (authErr) {
      console.error('Workspace API authorization validation failed:', authErr);
    }
  }

  bookings.unshift(newBooking);
  saveBookings(bookings);
  res.status(201).json(newBooking);
});

// Admin Booking Moderation
app.put('/api/bookings/:id/status', (req, res) => {
  const { id } = req.params;
  const { status, googleToken } = req.body;

  const bookings = loadBookings();
  const bookingIndex = bookings.findIndex(b => b.id === id);

  if (bookingIndex === -1) {
     res.status(404).json({ error: 'Booking not found' });
     return;
  }

  const updatedBooking = { ...bookings[bookingIndex], status };
  bookings[bookingIndex] = updatedBooking;
  saveBookings(bookings);

  // If approved and token is sent, we can send a custom approved email!
  if (status === 'confirmed' && googleToken) {
    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: googleToken });
    sendApprovedEmail(updatedBooking, auth).catch(e => console.error('Confirmation email failed:', e));
  }

  res.json(updatedBooking);
});

// Analytics Counter Dashboard Summary
app.get('/api/analytics', (req, res) => {
  const bookings = loadBookings();
  const confBookings = bookings.filter(b => b.status === 'confirmed');
  const revenue = confBookings.reduce((sum, b) => sum + b.totalPrice, 0);
  
  const typeCounts = {
    tour: bookings.filter(b => b.itemType === 'tour').length,
    hotel: bookings.filter(b => b.itemType === 'hotel').length,
    flight: bookings.filter(b => b.itemType === 'flight').length,
    custom_itinerary: bookings.filter(b => b.itemType === 'custom_itinerary').length,
  };

  const statusCounts = {
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: confBookings.length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
  };

  res.json({
    revenue,
    totalBookings: bookings.length,
    byType: typeCounts,
    byStatus: statusCounts,
  });
});

// ------------------------------------------------------------------
// GEMINI ITINERARY PLANNER (AI ENGINE)
// ------------------------------------------------------------------
app.post('/api/itinerary/generate', async (req, res) => {
  const { destination, country, duration, budget, interests, groupSize } = req.body;

  if (!destination || !duration) {
     res.status(400).json({ error: 'Missing destination or duration fields' });
     return;
  }

  const prompt = `
    You are Voyago elite luxury travel concierge AI. Generate a professional high-end luxury itinerary for a vacation trip.
    
    Trip details:
    - Destination: ${destination}, ${country || ''}
    - Duration: ${duration} Days
    - Budget Tier: ${budget} (e.g. Luxury, Ultra-Exclusive, Moderate Premium)
    - Travelers Group Size: ${groupSize} People
    - Interests: ${(interests || []).join(', ')}

    Important Instruction: You MUST response ONLY with a valid stringified JSON object matching this TypeScript model:
    {
      "id": "generated_id",
      "destination": "${destination}",
      "country": "${country || ''}",
      "interests": ${JSON.stringify(interests || [])},
      "budget": "${budget}",
      "groupSize": ${groupSize},
      "duration": ${duration},
      "overview": "A compelling, gorgeously written luxury layout overview of this customized trip.",
      "dailySchedule": [
        {
          "day": 1,
          "title": "Day Title (e.g. Majestic Arrival & Cliffside Welcomes)",
          "morning": "Morning itinerary details. Focus on elite hospitality, premium private transfers, and relaxed wellness.",
          "afternoon": "Afternoon itinerary details. Bespoke guided activities, high-end yacht, or garden walk.",
          "evening": "Evening itinerary details. Twilight private dining, cocktail lounges, and night views.",
          "diningRecommend": "Name of premium Michelin-starred restaurant with description of signature dish.",
          "tips": "Personal concierge tip for day (e.g., proper velvet attire code or reservation timing window)."
        }
      ]
    }
    
    Produce EXACTLY the JSON schema representing ${duration} days. Do not include markdown wraps like \`\`\`json or trailing commentary. Double check your brackets structure. Keep the tone sophisticated, exclusive, and welcoming.
  `.trim();

  try {
     const response = await ai.models.generateContent({
       model: 'gemini-3.5-flash',
       contents: prompt,
     });

     let text = response.text || '';
     // Parse safely, removing raw markdown decorators if Gemini adds them anyway
     text = text.replace(/```json/i, '').replace(/```/i, '').trim();
     
     const itineraryParsed = JSON.parse(text);
     res.json(itineraryParsed);
  } catch (error: any) {
     console.error('Gemini itinerary generation failed:', error);
     res.status(500).json({ 
       error: 'Concierge AI itinerary planner timed out. Let\'s attempt recovery soon.',
       details: error.message 
     });
  }
});

// ------------------------------------------------------------------
// GOOGLE WORKSPACE API SERVICES HANDS
// ------------------------------------------------------------------

/**
 * Creates/appends to Voyago Master sheet.
 */
async function handleGoogleSheetsLogs(booking: Booking, auth: any): Promise<{ spreadsheetUrl?: string }> {
  const sheets = google.sheets({ version: 'v4', auth });
  const drive = google.drive({ version: 'v3', auth });

  let spreadsheetId = '';
  // Try to search if master spreadsheet already exists
  try {
    const listRes = await drive.files.list({
      q: "name = 'Voyago Bookings Master' and mimeType = 'application/vnd.google-apps.spreadsheet' and trashed = false",
      spaces: 'drive',
      fields: 'files(id, name)',
    });
    const files = listRes.data.files || [];
    if (files.length > 0 && files[0].id) {
      spreadsheetId = files[0].id;
    }
  } catch (e) {
    console.log('Voyago Bookings Master list lookup failed, creating a new sheet.', e);
  }

  // Create document if not exists
  if (!spreadsheetId) {
    const createRes = await sheets.spreadsheets.create({
      requestBody: {
        properties: {
          title: 'Voyago Bookings Master',
        },
      },
    });
    spreadsheetId = createRes.data.spreadsheetId || '';

    // Set header columns
    const headers = [[
      'Booking ID', 'Customer Name', 'Customer Email', 'Type', 'Item Reserved', 
      'Start Date', 'End Date', 'Guests Count', 'Total Price', 'Status', 'Logged On'
    ]];
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Sheet1!A1',
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: headers },
    });
  }

  // Append bookings data row
  const rowValues = [[
    booking.id,
    booking.userName,
    booking.userEmail,
    booking.itemType,
    booking.itemName,
    booking.startDate,
    booking.endDate,
    booking.guestsCount,
    booking.totalPrice,
    booking.status,
    booking.createdAt
  ]];

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: 'Sheet1!A:K',
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: rowValues },
  });

  return { spreadsheetUrl: `https://docs.google.com/spreadsheets/d/${spreadsheetId}` };
}

/**
 * Creates Google Doc itinerary certificate.
 */
async function handleGoogleDocsGeneration(booking: Booking, auth: any): Promise<{ documentUrl?: string }> {
  const docs = google.docs({ version: 'v1', auth });
  
  const createRes = await docs.documents.create({
    requestBody: {
       title: `YOYAGO Luxury Travel Certificate - ${booking.itemName} (${booking.id})`,
    },
  });

  const documentId = createRes.data.documentId || '';
  const dateFormatted = new Date(booking.createdAt).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric'
  });

  const textBody = 
`******************************************************************************
VOYAGO LUXURY CONCIERGE RESORT CERTIFICATE
******************************************************************************

Booking ID: ${booking.id}
Issue Date: ${dateFormatted}
Status: PENDING ADMIN CONFIRMATION

DEAR VALUED VOYAGE EXPLORER,
We are exceptionally pleased to certify your high-end reservation request. 
Your personalized itinerary has been customized as logged:

==============================================================================
RESERVATION ARRANGEMENTS
==============================================================================
Service Segment: ${booking.itemType.toUpperCase()}
Item Reserved:   ${booking.itemName}
Journey Departure: ${booking.startDate}
Journey Return:    ${booking.endDate}
Accompanying Guests: ${booking.guestsCount} Travelers
Grand Assessment: $${booking.totalPrice.toLocaleString()} USD

==============================================================================
CONCIERGE PREPARATION LIST
==============================================================================
Our travel masters have already initiated booking holds. We strongly recommend:
1. Confirm passports have over 6 months of validity before boarding date.
2. Direct all private driver updates to concierge@voyago.vip.
3. Access of local currencies (EUR/JPY) is assisted on arrival.

Thank you for selecting Voyago - The Crown Jewels of Global Travel Exploration.

Sincerely,
The Voyago Elite Concierge Core Team
https://voyago.vip
------------------------------------------------------------------------------`;

  await docs.documents.batchUpdate({
    documentId,
    requestBody: {
      requests: [
        {
          insertText: {
            location: { index: 1 },
            text: textBody,
          },
        },
      ],
    },
  });

  return { documentUrl: `https://docs.google.com/document/d/${documentId}` };
}

/**
 * Sends booking confirmation mail via Gmail on behalf of the client.
 */
async function handleGmailNotification(booking: Booking, auth: any): Promise<void> {
  const gmail = google.gmail({ version: 'v1', auth });

  const rawMessage = [
    `To: ${booking.userEmail}`,
    `Subject: Voyago Luxury Itinerary Confirmed - ${booking.id}`,
    `Content-Type: text/html; charset=utf-8`,
    `MIME-Version: 1.0`,
    ``,
    `<div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #dfdfdf; border-radius: 4px; color: #1e293b; background-color: #ffffff;">`,
    `  <div style="text-align: center; border-bottom: 2px solid #0f172a; padding-bottom: 15px; margin-bottom: 25px;">`,
    `    <h1 style="color: #0f172a; margin: 0; font-size: 28px; letter-spacing: 2px; font-weight: 300;">V O Y A G O</h1>`,
    `    <p style="color: #d4af37; margin: 5px 0 0 0; text-transform: uppercase; font-size: 11px; letter-spacing: 3px;">The Crown Jewels of Travel</p>`,
    `  </div>`,
    `  <p style="font-size: 16px; line-height: 1.6;">Dear <strong>${booking.userName}</strong>,</p>`,
    `  <p style="font-size: 15px; line-height: 1.6; color: #475569;">We have received your requested reservation and launched the luxury drafting sequence. Below is your luxurious voyage confirmation voucher:</p>`,
    `  <div style="background-color: #f8fafc; border-left: 4px solid #d4af37; padding: 20px; border-radius: 4px; margin: 25px 0;">`,
    `    <table style="width: 100%; border-collapse: collapse; font-size: 14px;">`,
    `      <tr><td style="padding: 6px 0; color: #64748b;">Reservation ID</td><td style="padding: 6px 0; font-weight: bold; text-align: right;">${booking.id}</td></tr>`,
    `      <tr><td style="padding: 6px 0; color: #64748b;">Package Name</td><td style="padding: 6px 0; font-weight: bold; text-align: right; color: #0f172a;">${booking.itemName}</td></tr>`,
    `      <tr><td style="padding: 6px 0; color: #64748b;">Departure Date</td><td style="padding: 6px 0; text-align: right;">${booking.startDate}</td></tr>`,
    `      <tr><td style="padding: 6px 0; color: #64748b;">Return Date</td><td style="padding: 6px 0; text-align: right;">${booking.endDate}</td></tr>`,
    `      <tr><td style="padding: 6px 0; color: #64748b;">Total Price</td><td style="padding: 6px 0; font-weight: bold; text-align: right; color: #b45309;">$${booking.totalPrice.toLocaleString()} USD</td></tr>`,
    `      <tr><td style="padding: 6px 0; color: #64748b;">Booking Status</td><td style="padding: 6px 0; text-align: right;"><span style="background-color: #fef3c7; color: #92400e; padding: 3px 8px; border-radius: 12px; font-size: 11px; font-weight: bold;">PENDING APPROVAL</span></td></tr>`,
    `    </table>`,
    `  </div>`,
    `  <p style="font-size: 14px; line-height: 1.6; color: #64748b;">We have initialized custom travel files for you. In 15 minutes, your personal digital itinerary, generated through our master planners and stored securely in Google Docs, will sync automatically. You can review the booking updates in real time using the Master Logs spreadsheet.</p>`,
    `  <div style="text-align: center; margin: 30px 0 10px 0;">`,
    `    <a href="https://voyago.vip" style="background-color: #0f172a; color: #ffffff; padding: 12px 24px; text-decoration: none; font-size: 14px; font-weight: bold; border-radius: 4px; border: 1px solid #0f172a; letter-spacing: 1px;">LAUNCH CONCIERGE PANEL</a>`,
    `  </div>`,
    `  <p style="font-size: 13px; color: #94a3b8; text-align: center; margin-top: 40px; border-top: 1px solid #f1f5f9; padding-top: 20px;">This luxurious service notification email is generated by your Voyago Application workspace portal.</p>`,
    `</div>`
  ].join('\n');

  const b64Safe = Buffer.from(rawMessage)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  await gmail.users.messages.send({
    userId: 'me',
    requestBody: { raw: b64Safe },
  });
}

/**
 * Sends booking approved email on behalf of admin.
 */
async function sendApprovedEmail(booking: Booking, auth: any): Promise<void> {
  const gmail = google.gmail({ version: 'v1', auth });

  const rawMessage = [
    `To: ${booking.userEmail}`,
    `Subject: Voyago Booking Confirmed! Yacht & Resorts Hold Finalized - ${booking.id}`,
    `Content-Type: text/html; charset=utf-8`,
    `MIME-Version: 1.0`,
    ``,
    `<div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #dfdfdf; border-radius: 4px; color: #1e293b; background-color: #ffffff;">`,
    `  <div style="text-align: center; border-bottom: 2px solid #22c55e; padding-bottom: 15px; margin-bottom: 25px;">`,
    `    <h1 style="color: #0f172a; margin: 0; font-size: 28px; letter-spacing: 2px; font-weight: 300;">V O Y A G O</h1>`,
    `    <p style="color: #22c55e; margin: 5px 0 0 0; text-transform: uppercase; font-size: 11px; letter-spacing: 3px;">APPROVED & VIP RESERVATION CONFIRMED</p>`,
    `  </div>`,
    `  <p style="font-size: 16px; line-height: 1.6;">Dear <strong>${booking.userName}</strong>,</p>`,
    `  <p style="font-size: 15px; line-height: 1.6; color: #475569;">Awesome news! Our deluxe concierge team has verified all luxury slots, hotels, and charters. Your Voyago trip status is now <strong>CONFIRMED</strong>!</p>`,
    `  <div style="background-color: #f0fdf4; border-left: 4px solid #22c55e; padding: 20px; border-radius: 4px; margin: 25px 0;">`,
    `    <table style="width: 100%; border-collapse: collapse; font-size: 14px;">`,
    `      <tr><td style="padding: 6px 0; color: #64748b;">Reservation ID</td><td style="padding: 6px 0; font-weight: bold; text-align: right;">${booking.id}</td></tr>`,
    `      <tr><td style="padding: 6px 0; color: #64748b;">Reserved Item</td><td style="padding: 6px 0; font-weight: bold; text-align: right; color: #15803d;">${booking.itemName}</td></tr>`,
    `      <tr><td style="padding: 6px 0; color: #64748b;">Travel Dates</td><td style="padding: 6px 0; text-align: right;">${booking.startDate} &mdash; ${booking.endDate}</td></tr>`,
    `      <tr><td style="padding: 6px 0; color: #64748b;">Status</td><td style="padding: 6px 0; text-align: right;"><span style="background-color: #dcfce7; color: #15803d; padding: 3px 8px; border-radius: 12px; font-size: 11px; font-weight: bold;">APPROVED BY ADMIN</span></td></tr>`,
    `    </table>`,
    `  </div>`,
    `  <p style="font-size: 14px; line-height: 1.6; color: #64748b;">Your flight reservations and elite concierge contacts have been updated on the Voyago Master logs spreadsheet.</p>`,
    `  <p>Warmest regards,<br><strong>Voyago Concierge Team</strong></p>`,
    `</div>`
  ].join('\n');

  const b64Safe = Buffer.from(rawMessage)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  await gmail.users.messages.send({
    userId: 'me',
    requestBody: { raw: b64Safe },
  });
}


// Vite middleware set up for development environment
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Voyago server running on http://localhost:${PORT}`);
  });
}

startServer();
