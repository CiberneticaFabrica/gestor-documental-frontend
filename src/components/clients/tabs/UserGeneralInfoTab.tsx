"use client";

import {
   Briefcase, CheckCircle2, AlertTriangle, CalendarCheck, UserCheck, ShieldCheck, FileText, Activity, ClipboardList, BarChart2, MessageSquare, Link2
} from 'lucide-react';
import { type ClientDetailResponse } from '@/lib/api/services/client.service';

interface UserGeneralInfoTabProps {
  clientData: ClientDetailResponse;
}

export function UserGeneralInfoTab({ clientData }: UserGeneralInfoTabProps) {
  const { cliente, estadisticas, actividad_reciente, vista_cache } = clientData;

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'activo':
        return 'bg-green-50 text-green-700 dark:bg-green-900/40 dark:text-green-300';
      case 'inactivo':
        return 'bg-red-50 text-red-700 dark:bg-red-900/40 dark:text-red-300';
      case 'pendiente':
        return 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300';
      default:
        return 'bg-gray-50 text-gray-700 dark:bg-gray-900/40 dark:text-gray-300';
    }
  };

  const docChecklist = [
    { label: 'Identificación', status: cliente.documento_identificacion ? 'ok' : 'pending' },
    { label: 'Domicilio', status: cliente.datos_contacto.direccion ? 'ok' : 'pending' },
    { label: 'Email', status: cliente.datos_contacto.email ? 'ok' : 'pending' },
    { label: 'Teléfono', status: cliente.datos_contacto.telefono ? 'ok' : 'pending' },
  ];

  const docEvents = actividad_reciente.map(actividad => ({
    label: actividad.accion === 'crear' ? 'Cliente creado' : actividad.accion,
    date: new Date(actividad.fecha_hora).toLocaleDateString('es-ES')
  }));

  const requiredDocs = cliente.documentos_pendientes.map(doc => ({
    label: `Documento pendiente`,
    status: 'faltante',
    date: new Date(doc.fecha_solicitud).toLocaleDateString('es-ES')
  }));

  const kpis = [
    { label: 'Documentos completos', value: vista_cache.kpis_cliente.documentos_completos },
    { label: 'Documentos pendientes', value: vista_cache.kpis_cliente.documentos_pendientes },
    { label: 'Días hasta próxima revisión', value: vista_cache.kpis_cliente.dias_hasta_proxima_revision },
  ];

  const compliance = ['FATCA', 'PBC', 'AML'];

  return (
    <>
      {/* Header corporativo compacto */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 p-6 bg-gradient-to-r from-blue-900 to-blue-700 rounded-t-xl">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-blue-400 flex items-center justify-center text-white text-2xl font-bold border-4 border-blue-300 shadow">
            {cliente.nombre_razon_social.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl font-bold text-white">{cliente.nombre_razon_social}</span>
              <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${getStatusColor(cliente.estado)}`}>
                {cliente.estado}
              </span>
            </div>
            <div className="text-blue-100 text-sm font-mono">{cliente.tipo_cliente} &bull; ID: {cliente.documento_identificacion}</div>
            {/* <div className="text-blue-100 text-sm font-mono">Segmento: {cliente.segmento}</div> */}
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-[16px] text-blue-100 mt-4 md:mt-0">
          <div className="flex items-center gap-2"><CalendarCheck className="h-4 w-4" />Inicio: <span className="font-semibold text-white">{cliente.fecha_alta}</span></div>
          <div className="flex items-center gap-2"><UserCheck className="h-4 w-4" />Gestor: <span className="font-semibold text-white">{cliente.gestor_principal_nombre}</span></div>
          <div className="flex items-center gap-2"><Briefcase className="h-4 w-4" />Segmento: <span className="font-semibold text-white">{cliente.segmento_bancario}</span></div>
          <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4" />Riesgo: <span className="font-semibold text-white">{cliente.nivel_riesgo}</span></div>
        </div>
      </div>

      {/* Grid de cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {/* Completitud documental */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow flex flex-col gap-2 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 font-semibold text-gray-900 dark:text-gray-100 mb-2">
            <ClipboardList className="h-4 w-4" /> Completitud documental
          </div>
          {docChecklist.map((doc, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              {doc.status === 'ok' && <CheckCircle2 className="h-4 w-4 text-green-500" />}
              {doc.status === 'pending' && <AlertTriangle className="h-4 w-4 text-yellow-500" />}
              {doc.status === 'fail' && <AlertTriangle className="h-4 w-4 text-red-500" />}
              <span>{doc.label}</span>
            </div>
          ))}
        </div>

        {/* Actividad documental */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow flex flex-col gap-2 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 font-semibold text-gray-900 dark:text-gray-100 mb-2">
            <Activity className="h-4 w-4" /> Actividad documental
          </div>
          {docEvents.map((ev, i) => (
            <div key={i} className="flex justify-between text-sm text-gray-700 dark:text-gray-300">
              <span>{ev.label}</span>
              <span className="text-gray-500 dark:text-gray-400">{ev.date}</span>
            </div>
          ))}
        </div>

        {/* Documentos requeridos */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow flex flex-col gap-2 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 font-semibold text-gray-900 dark:text-gray-100 mb-2">
            <FileText className="h-4 w-4" /> Documentos requeridos
          </div>
          {requiredDocs.map((doc, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              {doc.status === 'ok' && <CheckCircle2 className="h-4 w-4 text-green-500" />}
              {doc.status === 'faltante' && <AlertTriangle className="h-4 w-4 text-red-500" />}
              <span>{doc.label}</span>
              {doc.date && <span className="ml-auto text-gray-500 dark:text-gray-400">{doc.date}</span>}
            </div>
          ))}
        </div>

        {/* Indicadores */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow flex flex-col gap-2 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 font-semibold text-gray-900 dark:text-gray-100 mb-2">
            <BarChart2 className="h-4 w-4" /> Indicadores
          </div>
          {kpis.map((kpi, i) => (
            <div key={i} className="flex justify-between text-sm text-gray-700 dark:text-gray-300">
              <span>{kpi.label}</span>
              <span className="font-semibold text-gray-900 dark:text-gray-100">{kpi.value}</span>
            </div>
          ))}
        </div>

        {/* Riesgos y cumplimiento */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow flex flex-col gap-2 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 font-semibold text-gray-900 dark:text-gray-100 mb-2">
            <ShieldCheck className="h-4 w-4" /> Riesgos y cumplimiento
          </div>
          <div className="flex flex-wrap gap-2">
            {compliance.map((c, i) => (
              <span key={i} className="inline-block px-2 py-0.5 rounded text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                {c}
              </span>
            ))}
            <span className="inline-block px-2 py-0.5 rounded text-xs font-semibold bg-green-50 text-green-700 dark:bg-green-900/40 dark:text-green-300">
              {cliente.nivel_riesgo}
            </span>
          </div>
        </div>

        {/* Metadatos personalizados */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow flex flex-col gap-2 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 font-semibold text-gray-900 dark:text-gray-100 mb-2">
            <Briefcase className="h-4 w-4" /> Información adicional
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-700 dark:text-gray-300">
              <span className="text-gray-500 dark:text-gray-400">Profesión</span>
              <span>{cliente.metadata_personalizada.profesion || 'No especificada'}</span>
            </div>
            <div className="flex justify-between text-gray-700 dark:text-gray-300">
              <span className="text-gray-500 dark:text-gray-400">Referido por</span>
              <span>{cliente.metadata_personalizada.referido_por || 'No especificado'}</span>
            </div>
            <div className="flex justify-between text-gray-700 dark:text-gray-300">
              <span className="text-gray-500 dark:text-gray-400">Empresa laboral</span>
              <span>{cliente.metadata_personalizada.empresa_laboral || 'No especificada'}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 