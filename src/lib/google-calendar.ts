import { google } from 'googleapis';

const SCOPES = ['https://www.googleapis.com/auth/calendar.events'];

export async function createGoogleCalendarEvent(appointment: {
    serviceName: string;
    clientName: string;
    clientPhone: string;
    date: Date;
    durationMinutes: number;
    notes?: string;
    description?: string;
}) {
    try {
        // 1. Check for credentials
        if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY || !process.env.GOOGLE_CALENDAR_ID) {
            console.warn('Google Calendar credentials missing. Skipping calendar event creation.');
            return null;
        }

        // 2. Authenticate
        console.log("Initializing Google Auth...");
        console.log("Email:", process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL);
        console.log("Key length:", process.env.GOOGLE_PRIVATE_KEY.length);

        // Replace literal \n with actual newline characters
        const privateKey = process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n');

        console.log("Processed Key Start:", privateKey.substring(0, 20));
        console.log("Processed Key Length:", privateKey.length);
        console.log("Contains BEGIN PRIVATE KEY:", privateKey.includes('BEGIN PRIVATE KEY'));

        console.log("Processed Key End:", privateKey.slice(-25).replace(/\n/g, ' '));

        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
                private_key: privateKey,
            },
            scopes: ['https://www.googleapis.com/auth/calendar'],
        });

        // Test auth client creation
        const client = await auth.getClient();
        console.log("Auth Client created:", client ? "Yes" : "No");

        const calendar = google.calendar({ version: 'v3', auth: client as any });

        // 3. Prepare event times
        const startTime = new Date(appointment.date);
        const endTime = new Date(startTime.getTime() + appointment.durationMinutes * 60000);



        // 4. Create event resource
        const event = {
            summary: `${appointment.serviceName} - ${appointment.clientName}`,
            description: `
        Cliente: ${appointment.clientName}
        Teléfono: ${appointment.clientPhone}
        Servicio: ${appointment.serviceName}
        Notas: ${appointment.notes || 'Ninguna'}
        ${appointment.description || ''}
      `.trim(),
            start: {
                dateTime: startTime.toISOString(),
                timeZone: 'Europe/Madrid', // Adjust if needed
            },
            end: {
                dateTime: endTime.toISOString(),
                timeZone: 'Europe/Madrid',
            },
        };

        // 5. Insert event
        const response = await calendar.events.insert({
            calendarId: process.env.GOOGLE_CALENDAR_ID,
            requestBody: event,
        });

        console.log('Google Calendar API response:', response.status, response.data.htmlLink);
        return response.data;

    } catch (error) {
        console.error('Error creating Google Calendar event:', error);
        // We do NOT throw here because we don't want to break the booking flow if calendar fails
        return null;
    }
}
