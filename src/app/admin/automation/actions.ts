'use server';

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// --- CATEGORIES ---

export async function getCategories() {
    try {
        return await prisma.category.findMany({
            include: {
                services: {
                    orderBy: { name: 'asc' }
                }
            },
            orderBy: { name: 'asc' }
        });
    } catch (error) {
        console.error("Error fetching categories:", error);
        return [];
    }
}

export async function saveCategory(id: number | null, name: string) {
    try {
        if (id) {
            await prisma.category.update({
                where: { id },
                data: { name }
            });
        } else {
            await prisma.category.create({
                data: { name }
            });
        }
        revalidatePath('/admin/automation');
        revalidatePath('/book');
        return { success: true };
    } catch (error) {
        console.error("Error saving category:", error);
        return { success: false };
    }
}

export async function deleteCategory(id: number) {
    try {
        // Cascade delete is handled by app logic or DB schema if set
        // For safety, Prisma often requires explicit relation cleaning or schema config
        await prisma.service.deleteMany({ where: { categoryId: id } });
        await prisma.category.delete({ where: { id } });

        revalidatePath('/admin/automation');
        revalidatePath('/book');
        return { success: true };
    } catch (error) {
        console.error("Error deleting category:", error);
        return { success: false };
    }
}

// --- SERVICES ---

export async function saveService(data: {
    id?: number;
    name: string;
    duration: number;
    price: number;
    categoryId: number;
}) {
    try {
        if (data.id) {
            await prisma.service.update({
                where: { id: data.id },
                data: {
                    name: data.name,
                    duration: data.duration,
                    price: data.price,
                    categoryId: data.categoryId
                }
            });
        } else {
            await prisma.service.create({
                data: {
                    name: data.name,
                    duration: data.duration,
                    price: data.price,
                    categoryId: data.categoryId
                }
            });
        }
        revalidatePath('/admin/automation');
        revalidatePath('/book');
        return { success: true };
    } catch (error) {
        console.error("Error saving service:", error);
        return { success: false };
    }
}

export async function deleteService(id: number) {
    try {
        await prisma.service.delete({ where: { id } });
        revalidatePath('/admin/automation');
        revalidatePath('/book');
        return { success: true };
    } catch (error) {
        console.error("Error deleting service:", error);
        return { success: false };
    }
}

// --- CLINIC SETTINGS ---

export async function getClinicSettings() {
    try {
        let settings = await prisma.clinicSettings.findFirst();
        if (!settings) {
            // Create default settings if none exist
            settings = await prisma.clinicSettings.create({
                data: {} // Uses schema defaults
            });
        }
        return settings;
    } catch (error) {
        console.error("Error fetching settings:", error);
        return null;
    }
}

export async function updateClinicSettings(data: {
    name?: string;
    logoUrl?: string;
    address?: string;
    phone?: string;
    assistantName?: string;
    isBotActive?: boolean;
}) {
    try {
        const settings = await prisma.clinicSettings.findFirst();
        if (settings) {
            await prisma.clinicSettings.update({
                where: { id: settings.id },
                data
            });
        } else {
            await prisma.clinicSettings.create({ data });
        }
        revalidatePath('/admin/automation');
        revalidatePath('/book');
        return { success: true };
    } catch (error) {
        console.error("Error updating settings:", error);
        return { success: false };
    }
}
