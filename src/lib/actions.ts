"use server";

import { prisma } from "./prisma";
import { revalidatePath } from "next/cache";

// --- SETTINGS ---
export async function getClinicSettings() {
  try {
    let settings = await prisma.clinicSettings.findFirst();
    if (!settings) {
      settings = await prisma.clinicSettings.create({
        data: {
          name: "Clínica Demo",
          headerText: "Saca tu mejor sonrisa con nosotros 😎",
          address: "Calle Ejemplo 123",
          primaryColor: "#3b82f6",
        },
      });
    }
    return settings;
  } catch (error) {
    console.error("Error fetching clinic settings:", error);
    return null;
  }
}

export async function updateClinicSettings(data: any) {
  try {
    const settings = await prisma.clinicSettings.findFirst();
    if (settings) {
      await prisma.clinicSettings.update({
        where: { id: settings.id },
        data,
      });
    } else {
      await prisma.clinicSettings.create({ data });
    }
    revalidatePath("/admin/automation");
    revalidatePath("/book");
    return { success: true };
  } catch (error) {
    console.error("Error updating clinic settings:", error);
    return { success: false, error: "Error al actualizar la configuración" };
  }
}

// --- CATEGORIES & SERVICES ---
export async function getCategories() {
  try {
    return await prisma.category.findMany({
      include: {
        services: true,
      },
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export async function createCategory(name: string) {
  try {
    const category = await prisma.category.create({
      data: { name },
    });
    revalidatePath("/admin/automation");
    return { success: true, category };
  } catch (error) {
    return { success: false, error: "Error al crear categoría" };
  }
}

export async function deleteCategory(id: string) {
  try {
    await prisma.category.delete({ where: { id } });
    revalidatePath("/admin/automation");
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

export async function createService(data: {
  name: string;
  price: number;
  duration: number;
  categoryId: string;
}) {
  try {
    const service = await prisma.service.create({
      data,
    });
    revalidatePath("/admin/automation");
    revalidatePath("/book");
    return { success: true, service };
  } catch (error) {
    return { success: false, error: "Error al crear servicio" };
  }
}

export async function deleteService(id: string) {
  try {
    await prisma.service.delete({ where: { id } });
    revalidatePath("/admin/automation");
    revalidatePath("/book");
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

// --- APPOINTMENTS ---
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
