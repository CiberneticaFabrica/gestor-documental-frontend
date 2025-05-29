'use client';
import { useEffect, useState } from 'react';
import { auditoriaService, ClientsDocumentsActivityResponse } from '@/lib/api/services/auditoria.service';
import ActivitySidebarFilters from '@/components/audits/ActivitySidebarFilters';
import ClientCard from '@/components/audits/ClientCard';

export default function DocumentosPage() {
    const [data, setData] = useState<ClientsDocumentsActivityResponse | null>(null);
    const [filters, setFilters] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        auditoriaService.getClientsDocumentsActivity(filters)
            .then(setData)
            .finally(() => setLoading(false));
    }, [filters]);

    return (
        <div className="flex min-h-screen">
            {/* Sidebar de filtros */}
            <ActivitySidebarFilters filters={filters} setFilters={setFilters} />

            {/* Contenido principal */}
            <div className="flex-1 p-6 overflow-y-auto">
                <h1 className="text-2xl font-bold mb-6">Actividad de Documentos por Cliente</h1>
                {loading && <div>Cargando...</div>}
                {!loading && data && data.clientes.map(cliente => (
                    <ClientCard key={cliente.id_cliente} cliente={cliente} />
                ))}
            </div>
        </div>
    );
}
