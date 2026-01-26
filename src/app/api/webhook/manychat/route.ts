import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        console.log("Webhook received:", body);

        // Expected Body Format from ManyChat:
        // {
        //   "phone": "+34600...",
        //   "name": "Juan Perez",
        //   "action": "book_appointment",
        //   "date": "2026-02-15T10:00:00Z",
        //   "service": "BMS NAZAR"
        // }

        const { phone, name, action, date, service } = body;

        if (!phone) {
            return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
        }

        // 1. Find or Create Client
        let client = await prisma.client.findUnique({
            where: { phone: phone },
        });

        if (!client) {
            client = await prisma.client.create({
                data: {
                    name: name || "Cliente WhatsApp",
                    phone: phone,
                    tags: "New Lead",
                },
            });
        }

        // 2. Handle Booking Action
        if (action === "book_appointment" && date && service) {

            // Check for conflicts (Simplified logic)
            const existingAppointment = await prisma.appointment.findFirst({
                where: {
                    date: new Date(date),
                },
            });

            if (existingAppointment) {
                return NextResponse.json({
                    status: 'error',
                    message: 'Slot unavailable'
                }, { status: 409 });
            }

            // Create Appointment
            const appointment = await prisma.appointment.create({
                data: {
                    date: new Date(date),
                    serviceName: service, // Mapped from "service" in JSON to "serviceName" in DB
                    servicePrice: 0, // Default value, ideally fetched from ServiceCatalog
                    clientId: client.id,
                    status: "CONFIRMED"
                },
            });

            return NextResponse.json({
                status: 'success',
                message: 'Appointment booked',
                appointmentId: appointment.id
            });
        }

        return NextResponse.json({ status: 'success', message: 'Data received' });

    } catch (error) {
        console.error("Webhook Error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
