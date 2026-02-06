'use server';

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { createGoogleCalendarEvent } from "@/lib/google-calendar";

export async function createBooking(data: {
    serviceId: number;
    serviceName: string;
    servicePrice: string;
    serviceDuration: string;
    date: Date;
    time: string;
    clientName: string;
    clientPhone: string;
    notes?: string;
}) {
    try {
        console.log("Creating booking with data:", data);

        // 1. Parse price (remove currency symbol if present)
        const priceValue = parseFloat(data.servicePrice.replace(/[^0-9.]/g, '')) || 0;
        const durationValue = parseInt(data.serviceDuration.replace(/[^0-9]/g, '')) || 30;

        // 2. Find or Create Client
        let client = await prisma.client.findUnique({
            where: { phone: data.clientPhone },
        });

        if (!client) {
            console.log("Client not found, creating new client...");
            client = await prisma.client.create({
                data: {
                    name: data.clientName,
                    phone: data.clientPhone,
                    // We can add email later if needed
                },
            });
        } else {
            console.log("Client found:", client.id);
            // Optional: Update name if provided and different? 
            // For now, let's keep the existing record mainly to avoid overwrites.
        }

        // 3. Create Appointment
        // Combine date and time into a single DateTime object
        const [hours, minutes] = data.time.split(':').map(Number);
        const appointmentDate = new Date(data.date);
        appointmentDate.setHours(hours, minutes, 0, 0);

        // 3.5 CRITICAL: Check if this slot is already taken (prevent double booking)
        const existingAppointment = await prisma.appointment.findFirst({
            where: {
                date: appointmentDate,
                status: 'CONFIRMED',
            },
        });

        if (existingAppointment) {
            console.log("Slot already booked:", appointmentDate);
            return {
                success: false,
                error: "Este horario ya está reservado. Por favor, elige otra hora."
            };
        }

        const appointment = await prisma.appointment.create({
            data: {
                date: appointmentDate,
                status: "CONFIRMED",
                serviceName: data.serviceName,
                servicePrice: priceValue,
                duration: durationValue,
                clientId: client.id,
                notes: data.notes
            },
        });

        console.log("Appointment created:", appointment.id);

        // 4. Sync with Google Calendar
        // We do this asynchronously (fire and forget) or await it. 
        // Since we want to ensure it's logged, we'll await but catch errors inside the helper.
        try {
            await createGoogleCalendarEvent({
                serviceName: data.serviceName,
                clientName: data.clientName,
                clientPhone: data.clientPhone,
                date: appointmentDate,
                durationMinutes: durationValue,
                notes: data.notes
            });
        } catch (calendarError) {
            // Just to be extra safe, though helper handles it.
            console.error("Calendar sync failed (non-fatal):", calendarError);
        }

        // 5. Revalidate paths so the admin panel updates immediately
        revalidatePath('/(admin)/calendar');
        revalidatePath('/(admin)/dashboard');
        revalidatePath('/(admin)/clients');

        return { success: true, appointmentId: appointment.id };

    } catch (error) {
        console.error("Error creating booking:", error);
        return { success: false, error: "Failed to create booking" };
    }
}

export async function getAvailableSlots(dateStr: string) {
    try {
        const queryDate = new Date(dateStr);
        const startOfDay = new Date(queryDate.setHours(0, 0, 0, 0));
        const endOfDay = new Date(queryDate.setHours(23, 59, 59, 999));

        const appointments = await prisma.appointment.findMany({
            where: {
                date: {
                    gte: startOfDay,
                    lte: endOfDay,
                },
                status: 'CONFIRMED',
            },
        });

        // Generate all possible slots (9:00 to 19:30, 30 min interval)
        const allSlots = [
            "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
            "12:00", "12:30", "13:00", "13:30", "16:00", "16:30",
            "17:00", "17:30", "18:00", "18:30", "19:00", "19:30"
        ];

        // Filter out booked slots
        const bookedTimes = appointments.map(appt => {
            const d = new Date(appt.date);
            const hours = d.getHours().toString().padStart(2, '0');
            const minutes = d.getMinutes().toString().padStart(2, '0');
            return `${hours}:${minutes}`;
        });

        const availableSlots = allSlots.filter(slot => !bookedTimes.includes(slot));

        return availableSlots;

    } catch (error) {
        console.error("Error fetching slots:", error);
        return [];
    }
}
