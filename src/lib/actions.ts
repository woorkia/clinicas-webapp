"use server";

import { prisma } from "./prisma";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// --- SETTINGS ---
export async function getClinicSettings() {
  try {
    let settings = await prisma.clinicSettings.findFirst();
    if (!settings) {
      settings = await prisma.clinicSettings.create({
        data: {
          name: "Clínica Demo",
          address: "Calle Ejemplo 123",
          phone: "+34 600 000 000",
          assistantName: "Ana (IA Clínica)",
          isBotActive: true
        },
      });
    }
    return settings;
  } catch (error) {
    console.error("Error fetching clinic settings:", error);
    return null;
  }
}

export async function validateAdminLogin(username: string, password: string) {
  try {
    const settings = (await prisma.clinicSettings.findFirst()) as any;
    if (!settings) {
      // Fallback for first run if DB is somehow empty but middleware triggered
      return { success: username === "admin" && password === "admin123" };
    }
    
    if (settings.adminUsername === username && settings.adminPassword === password) {
      return { success: true };
    }
    
    return { success: false, error: "Credenciales incorrectas" };
  } catch (error) {
    console.error("Error validating login:", error);
    return { success: false, error: "Error de servidor" };
  }
}

export async function updateClinicSettings(data: {
  name?: string;
  address?: string;
  phone?: string;
  assistantName?: string;
  isBotActive?: boolean;
  availability?: any;
  appointmentRules?: any;
  adminUsername?: string;
  adminPassword?: string;
}) {
  try {
    const settings = await prisma.clinicSettings.findFirst();
    if (settings) {
      await prisma.clinicSettings.update({
        where: { id: settings.id },
        data,
      });
    } else {
      await prisma.clinicSettings.create({ data: { ...data, id: 1 } });
    }
    revalidatePath("/admin/automation");
    revalidatePath("/book");
    return { success: true };
  } catch (error) {
    console.error("Error updating clinic settings:", error);
    return { success: false, error: "Error al actualizar la configuración" };
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete('auth_session');
  redirect('/login');
}

// --- CATEGORIES & SERVICES ---
export async function getCategories() {
  try {
    return await prisma.category.findMany({
      include: {
        services: true,
      },
      orderBy: { id: 'asc' }
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export async function deleteCategory(id: number) {
  try {
    await prisma.category.delete({ where: { id } });
    revalidatePath("/admin/automation");
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

export async function saveCategory(id: number | null, name: string) {
  try {
    let category;
    if (id) {
      category = await prisma.category.update({
        where: { id },
        data: { name },
      });
    } else {
      category = await prisma.category.create({
        data: { name },
      });
    }
    revalidatePath("/admin/automation");
    return { success: true, category };
  } catch (error: any) {
    console.error("Error saving category:", error);
    return { success: false, error: "Error: " + (error.message || String(error)) };
  }
}

export async function deleteService(id: number) {
  try {
    await prisma.service.delete({ where: { id } });
    revalidatePath("/admin/automation");
    revalidatePath("/book");
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

export async function saveService(data: {
  id?: number;
  name: string;
  price: number;
  duration: number;
  categoryId: number;
}) {
  try {
    if (data.id) {
      await prisma.service.update({
        where: { id: data.id },
        data: {
          name: data.name,
          price: data.price,
          duration: data.duration,
          categoryId: data.categoryId,
        },
      });
    } else {
      await prisma.service.create({
        data: {
          name: data.name,
          price: data.price,
          duration: data.duration,
          categoryId: data.categoryId,
        },
      });
    }
    revalidatePath("/admin/automation");
    revalidatePath("/book");
    return { success: true };
  } catch (error: any) {
    console.error("Error saving service:", error);
    return { success: false, error: "Error: " + (error.message || String(error)) };
  }
}

// --- CLIENTS ---
export async function saveClient(data: {
  id?: string;
  name: string;
  phone: string;
  email?: string | null;
}) {
  try {
    let client;
    if (data.id) {
      client = await prisma.client.update({
        where: { id: data.id },
        data: {
          name: data.name,
          phone: data.phone,
          email: data.email,
        },
      });
    } else {
      client = await prisma.client.create({
        data: {
          name: data.name,
          phone: data.phone,
          email: data.email,
        },
      });
    }
    revalidatePath("/admin/clients");
    return { success: true, client };
  } catch (error: any) {
    console.error("Error saving client:", error);
    return { success: false, error: "Error: " + (error.message || String(error)) };
  }
}

export async function getClients() {
  try {
    return await prisma.client.findMany({
      orderBy: { name: 'asc' }
    });
  } catch (error) {
    console.error("Error fetching clients:", error);
    return [];
  }
}

// --- APPOINTMENTS ---
export async function saveAppointment(data: {
  clientId: string;
  serviceName: string;
  date: Date;
  duration: number;
  price: number;
  notes?: string;
}) {
  try {
    await prisma.appointment.create({
      data: {
        clientId: data.clientId,
        serviceName: data.serviceName,
        date: data.date,
        duration: data.duration,
        servicePrice: data.price,
        notes: data.notes,
        status: "CONFIRMED"
      }
    });
    revalidatePath("/admin/calendar");
    revalidatePath("/admin");
    return { success: true };
  } catch (error: any) {
    console.error("Error saving appointment:", error);
    return { success: false, error: "Error: " + (error.message || String(error)) };
  }
}

export async function getAppointments(start: Date, end: Date) {
  try {
    return await prisma.appointment.findMany({
      where: {
        date: {
          gte: start,
          lte: end
        }
      },
      include: {
        client: true
      }
    });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return [];
  }
}
export async function getDashboardStats() {
  try {
    const [appointmentsCount, clientsCount] = await Promise.all([
      prisma.appointment.count(),
      prisma.client.count(),
    ]);

    const recentAppointments = await prisma.appointment.findMany({
      take: 5,
      orderBy: { date: "asc" },
      where: {
        date: { gte: new Date() },
      },
      include: {
        client: true,
      },
    });

    return {
      totalAppointments: appointmentsCount,
      totalClients: clientsCount,
      recentAppointments,
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return {
      totalAppointments: 0,
      totalClients: 0,
      recentAppointments: [],
    };
  }
}

// --- CLIENT ACTIONS ---
export async function getClientHistory(clientId: string) {
  try {
    return await prisma.appointment.findMany({
      where: { clientId },
      orderBy: { date: 'desc' }
    });
  } catch (error) {
    console.error("Error fetching client history:", error);
    return [];
  }
}
