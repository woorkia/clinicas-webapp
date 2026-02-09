"use client";

import { Plus, Edit2, Trash2, FolderOpen, Save, X, Check, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { getCategories, saveCategory, deleteCategory, saveService, deleteService } from "@/app/admin/automation/actions";

interface Service {
    id: number;
    name: string;
    duration: number; // minutes
    price: number;
}

interface Category {
    id: number;
    name: string;
    services: Service[];
}

export function ServiceCatalog() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Edit States
    const [editingCategory, setEditingCategory] = useState<number | null>(null);
    const [editingService, setEditingService] = useState<number | null>(null);

    // Temp values for edits
    const [tempName, setTempName] = useState("");
    const [tempService, setTempService] = useState<Partial<Service>>({});

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setIsLoading(true);
        const data = await getCategories();
        setCategories(data as any);
        setIsLoading(false);
    };

    // --- Actions ---

    const handleAddCategory = async () => {
        const result = await saveCategory(null, "Nueva Categoría");
        if (result.success) {
            await loadData();
        }
    };

    const handleDeleteCategory = async (id: number) => {
        if (confirm("¿Estás seguro de borrar esta categoría y todos sus servicios?")) {
            const result = await deleteCategory(id);
            if (result.success) {
                await loadData();
            }
        }
    };

    const startEditCategory = (id: number, currentName: string) => {
        setEditingCategory(id);
        setTempName(currentName);
    };

    const handleSaveCategory = async (id: number) => {
        const result = await saveCategory(id, tempName);
        if (result.success) {
            setEditingCategory(null);
            await loadData();
        }
    };

    const handleAddService = async (catId: number) => {
        const result = await saveService({
            name: "Nuevo Servicio",
            duration: 30,
            price: 0,
            categoryId: catId
        });
        if (result.success) {
            await loadData();
        }
    };

    const handleDeleteService = async (srvId: number) => {
        if (confirm("¿Borrar servicio?")) {
            const result = await deleteService(srvId);
            if (result.success) {
                await loadData();
            }
        }
    };

    const startEditService = (service: Service) => {
        setEditingService(service.id);
        setTempService({ ...service });
    };

    const handleSaveService = async (catId: number) => {
        if (!tempService.name) return;

        const result = await saveService({
            id: editingService!,
            name: tempService.name,
            duration: tempService.duration || 30,
            price: tempService.price || 0,
            categoryId: catId
        });

        if (result.success) {
            setEditingService(null);
            await loadData();
        }
    };

    if (isLoading) {
        return (
            <div className="p-12 flex flex-col items-center justify-center text-gray-500 gap-4">
                <Loader2 className="animate-spin" size={32} />
                <p className="text-sm font-medium">Cargando catálogo...</p>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">Catálogo de Servicios</h2>
                    <p className="text-sm text-gray-500">
                        Gestiona categorías, precios y duraciones. El bot usará esta info.
                    </p>
                </div>
                <button
                    onClick={handleAddCategory}
                    className="flex items-center gap-2 px-3 py-1.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm"
                >
                    <Plus size={16} />
                    Nueva Categoría
                </button>
            </div>


            <div className="space-y-6">
                {categories.map((category) => (
                    <div key={category.id} className="border border-border rounded-lg overflow-hidden bg-white shadow-sm">
                        {/* Category Header */}
                        <div className="bg-gray-50 px-4 py-3 border-b border-border flex items-center justify-between">
                            <div className="flex items-center gap-3 flex-1">
                                <FolderOpen size={18} className="text-blue-500" />

                                {editingCategory === category.id ? (
                                    <div className="flex items-center gap-2">
                                        <input
                                            autoFocus
                                            type="text"
                                            value={tempName}
                                            onChange={(e) => setTempName(e.target.value)}
                                            className="text-sm font-medium px-2 py-1 border border-primary rounded focus:outline-none"
                                        />
                                        <button onClick={() => handleSaveCategory(category.id)} className="p-1 text-green-600 hover:bg-green-100 rounded">
                                            <Check size={16} />
                                        </button>
                                        <button onClick={() => setEditingCategory(null)} className="p-1 text-red-500 hover:bg-red-100 rounded">
                                            <X size={16} />
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <h3 className="font-medium text-gray-900">{category.name}</h3>
                                        <span className="text-xs px-2 py-0.5 bg-white border border-gray-200 rounded-full text-gray-500">
                                            {category.services.length} servicios
                                        </span>
                                    </>
                                )}
                            </div>

                            <div className="flex items-center gap-1">
                                {editingCategory !== category.id && (
                                    <>
                                        <button onClick={() => startEditCategory(category.id, category.name)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors" title="Editar Nombre">
                                            <Edit2 size={16} />
                                        </button>
                                        <button onClick={() => handleDeleteCategory(category.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Borrar Categoría">
                                            <Trash2 size={16} />
                                        </button>
                                        <div className="w-px h-4 bg-gray-300 mx-2"></div>
                                    </>
                                )}
                                <button onClick={() => handleAddService(category.id)} className="flex items-center gap-1.5 text-xs font-medium text-primary bg-primary/10 px-2.5 py-1.5 rounded-md hover:bg-primary/20 transition-colors">
                                    <Plus size={14} />
                                    Añadir Servicio
                                </button>
                            </div>
                        </div>

                        {/* Services List */}
                        <div className="divide-y divide-gray-100">
                            {category.services.length === 0 && (
                                <div className="p-8 text-center text-gray-400 text-sm">
                                    No hay servicios en esta categoría.
                                </div>
                            )}

                            {category.services.map((service) => (
                                <div key={service.id} className="px-4 py-3 flex items-center justify-between hover:bg-gray-50/50 transition-colors group">

                                    {editingService === service.id ? (
                                        <div className="flex items-center gap-3 w-full bg-blue-50/50 -m-2 p-2 rounded-lg border border-blue-100">
                                            <input
                                                type="text"
                                                placeholder="Nombre del servicio"
                                                value={tempService.name}
                                                onChange={(e) => setTempService({ ...tempService, name: e.target.value })}
                                                className="flex-1 text-sm px-2 py-1 border border-gray-300 rounded focus:border-primary focus:outline-none"
                                            />
                                            <div className="flex items-center gap-1 text-sm text-gray-600">
                                                <input
                                                    type="number"
                                                    placeholder="Min"
                                                    value={tempService.duration}
                                                    onChange={(e) => setTempService({ ...tempService, duration: Number(e.target.value) })}
                                                    className="w-16 px-2 py-1 border border-gray-300 rounded focus:border-primary focus:outline-none"
                                                />
                                                <span>min</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-sm text-gray-600">
                                                <span>€</span>
                                                <input
                                                    type="number"
                                                    placeholder="Precio"
                                                    value={tempService.price}
                                                    onChange={(e) => setTempService({ ...tempService, price: Number(e.target.value) })}
                                                    className="w-20 px-2 py-1 border border-gray-300 rounded focus:border-primary focus:outline-none"
                                                />
                                            </div>
                                            <button onClick={() => handleSaveService(category.id)} className="p-1.5 bg-green-500 text-white rounded hover:bg-green-600 shadow-sm">
                                                <Save size={14} />
                                            </button>
                                            <button onClick={() => setEditingService(null)} className="p-1.5 bg-gray-200 text-gray-600 rounded hover:bg-gray-300">
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">{service.name}</p>
                                                <p className="text-xs text-gray-500 flex items-center gap-2 mt-0.5">
                                                    <span className="bg-gray-100 px-1.5 rounded text-gray-600">{service.duration} min</span>
                                                    <span>•</span>
                                                    <span className="font-medium text-gray-700">{service.price > 0 ? `€${service.price}` : "Consultar"}</span>
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => startEditService(service)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md">
                                                    <Edit2 size={14} />
                                                </button>
                                                <button onClick={() => handleDeleteService(service.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md">
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
