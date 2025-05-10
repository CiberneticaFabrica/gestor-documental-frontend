"use client";

import {
   Briefcase, CheckCircle2,   AlertTriangle, CalendarCheck, UserCheck, ShieldCheck, FileText, Activity, ClipboardList, BarChart2, BotMessageSquare, Link2
} from 'lucide-react';

const user = {
  name: 'Alfredo Gómez',
  type: 'Persona Física',
  idNumber: '01234567',
  startDate: '2018-05-10',
  photo: 'https://randomuser.me/api/portraits/men/32.jpg',
  address: 'Av. Principal 123, Ciudad',
  phones: ['+34 600 123 456'],
  email: 'alfredo.gomez@email.com',
  comms: 'Email',
  segment: 'Retail',
  risk: 'Bajo',
  riskLevel: 'Bajo',
  riskColor: 'green',
  manager: 'Laura Herrera',
  products: ['Cuenta Corriente', 'Tarjeta de Crédito'],
  docStatus: 'Completo',
  docPercent: 92,
  alerts: 1,
  lastActivity: '2024-04-01',
  status: 'Activo',
  statusColor: 'green',
  group: 'Empresas',
  kyc: 'Aprobado',
  kycDate: '2023-12-10',
  lastLogin: '2024-04-02 09:15',
};

const docChecklist = [
  { label: 'Identificación', status: 'ok', percent: 75 },
  { label: 'Domicilio', status: 'ok' },
  { label: 'Ingreso', status: 'pending' },
  { label: 'Referencia bancaria', status: 'fail' },
];

const docEvents = [
  { label: 'Abrió contrato', date: '15/04/2024' },
  { label: 'Documento de video', date: '30/03/2025' },
  { label: 'Verificación completa', date: '03/06/2025' },
];

const requiredDocs = [
  { label: 'Préstamo de ingresos', status: 'faltante' },
  { label: 'Validado', status: 'ok', date: '15/05/2025' },
];

const kpis = [
  { label: 'Tiempo de procesos', value: '8 min' },
  { label: 'Documento expira', value: '1' },
  { label: 'Validación exitosa', value: 'Escuó' },
];

const aiDetection = 'Atijular es que actualices higresso detectado que hubo detectado.';

const compliance = ['FATCA', 'PBC', 'AML'];

const relationships = [
  { name: 'Julio Vega', role: 'Miembro', product: 'Tarjeta tarjeta crédito', date: '02/05/2025' },
];

export function UserGeneralInfoTab() {
  return (
    <div className="">
      {/* Header corporativo compacto */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 p-6 bg-gradient-to-r from-blue-900/90 to-blue-700/90 rounded-t-xl">
        <div className="flex items-center gap-4">
          <img src={user.photo} alt={user.name} className="h-16 w-16 rounded-full object-cover border-4 border-blue-500 shadow" />
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl font-bold text-white">{user.name}</span>
              <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-900/60 dark:text-green-300`}>{user.status}</span>
            </div>
            <div className="text-blue-200 text-xs font-mono">{user.type} &bull; ID: {user.idNumber}</div>
            <div className="text-blue-200 text-xs font-mono">Grupo: {user.group}</div>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-blue-100 mt-4 md:mt-0">
          <div className="flex items-center gap-2"><CalendarCheck className="h-4 w-4" />Inicio: <span className="font-semibold text-white">{user.startDate}</span></div>
          <div className="flex items-center gap-2"><UserCheck className="h-4 w-4" />Gestor: <span className="font-semibold text-white">{user.manager}</span></div>
          <div className="flex items-center gap-2"><Briefcase className="h-4 w-4" />Segmento: <span className="font-semibold text-white">{user.segment}</span></div>
          <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4" />Riesgo: <span className="font-semibold text-white">{user.riskLevel}</span></div>
        </div>
      </div>

      {/* Grid de cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-4 sm:p-6 bg-gray-50 dark:bg-gray-900 rounded-b-xl">
        {/* Completitud documental */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow flex flex-col gap-2">
          <div className="flex items-center gap-2 font-semibold text-gray-700 dark:text-gray-200 mb-2"><ClipboardList className="h-4 w-4" /> Completitud documental</div>
          {docChecklist.map((doc, i) => (
            <div key={i} className="flex items-center gap-2 text-xs">
              {doc.status === 'ok' && <CheckCircle2 className="h-4 w-4 text-green-500" />}
              {doc.status === 'pending' && <AlertTriangle className="h-4 w-4 text-yellow-500" />}
              {doc.status === 'fail' && <AlertTriangle className="h-4 w-4 text-red-500" />}
              <span>{doc.label}</span>
              {doc.percent && <span className="ml-auto font-semibold text-gray-700 dark:text-gray-200">{doc.percent}%</span>}
            </div>
          ))}
        </div>
        {/* Actividad documental */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow flex flex-col gap-2">
          <div className="flex items-center gap-2 font-semibold text-gray-700 dark:text-gray-200 mb-2"><Activity className="h-4 w-4" /> Actividad documental</div>
          {docEvents.map((ev, i) => (
            <div key={i} className="flex justify-between text-xs">
              <span>{ev.label}</span>
              <span className="text-gray-400">{ev.date}</span>
            </div>
          ))}
        </div>
        {/* Documentos requeridos */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow flex flex-col gap-2">
          <div className="flex items-center gap-2 font-semibold text-gray-700 dark:text-gray-200 mb-2"><FileText className="h-4 w-4" /> Documentos requeridos</div>
          {requiredDocs.map((doc, i) => (
            <div key={i} className="flex items-center gap-2 text-xs">
              {doc.status === 'ok' && <CheckCircle2 className="h-4 w-4 text-green-500" />}
              {doc.status === 'faltante' && <AlertTriangle className="h-4 w-4 text-red-500" />}
              <span>{doc.label}</span>
              {doc.date && <span className="ml-auto text-gray-400">{doc.date}</span>}
            </div>
          ))}
        </div>
        {/* Indicadores */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow flex flex-col gap-2">
          <div className="flex items-center gap-2 font-semibold text-gray-700 dark:text-gray-200 mb-2"><BarChart2 className="h-4 w-4" /> Indicadores</div>
          {kpis.map((kpi, i) => (
            <div key={i} className="flex justify-between text-xs">
              <span>{kpi.label}</span>
              <span className="font-semibold text-gray-700 dark:text-gray-200">{kpi.value}</span>
            </div>
          ))}
        </div>
        {/* Detección IA */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow flex flex-col gap-2">
          <div className="flex items-center gap-2 font-semibold text-gray-700 dark:text-gray-200 mb-2"><BotMessageSquare className="h-4 w-4" /> Detección IA</div>
          <div className="text-xs text-gray-600 dark:text-gray-300">{aiDetection}</div>
        </div>
        {/* Riesgos y cumplimiento */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow flex flex-col gap-2">
          <div className="flex items-center gap-2 font-semibold text-gray-700 dark:text-gray-200 mb-2"><ShieldCheck className="h-4 w-4" /> Riesgos y cumplimiento</div>
          <div className="flex flex-wrap gap-2">
            {compliance.map((c, i) => (
              <span key={i} className="inline-block px-2 py-0.5 rounded text-xs font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300">{c}</span>
            ))}
            <span className="inline-block px-2 py-0.5 rounded text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-900/60 dark:text-green-300">Cumple</span>
          </div>
        </div>
        {/* Relacionamiento */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow flex flex-col gap-2">
          <div className="flex items-center gap-2 font-semibold text-gray-700 dark:text-gray-200 mb-2"><Link2 className="h-4 w-4" /> Relacionamiento</div>
          {relationships.map((rel, i) => (
            <div key={i} className="flex flex-col text-xs">
              <span className="font-semibold">{rel.name} <span className="text-gray-400 font-normal">{rel.role}</span></span>
              <span className="text-gray-600 dark:text-gray-300">{rel.product}</span>
              <span className="text-gray-400">{rel.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 