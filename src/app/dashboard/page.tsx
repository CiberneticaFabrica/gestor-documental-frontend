'use client';

import { FileText, Users, Clock, Upload } from 'lucide-react';

const stats = [
  { name: 'Documentos Totales', value: '1,234', icon: FileText, change: '+12%', changeType: 'increase' },
  { name: 'Usuarios Activos', value: '89', icon: Users, change: '+5%', changeType: 'increase' },
  { name: 'Documentos Pendientes', value: '23', icon: Clock, change: '-2%', changeType: 'decrease' },
  { name: 'Subidos Hoy', value: '45', icon: Upload, change: '+8%', changeType: 'increase' },
];

const recentDocuments = [
  { id: 1, name: 'Informe Financiero Q1', type: 'PDF', date: '2024-03-15', size: '2.4 MB' },
  { id: 2, name: 'Contrato de Servicios', type: 'DOCX', date: '2024-03-14', size: '1.8 MB' },
  { id: 3, name: 'Presentación Proyecto', type: 'PPTX', date: '2024-03-13', size: '4.2 MB' },
  { id: 4, name: 'Plan Estratégico', type: 'PDF', date: '2024-03-12', size: '3.1 MB' },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-400">
          Bienvenido al panel de control del Gestor Documental
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="relative overflow-hidden rounded-lg bg-gray-800 px-4 py-5 shadow sm:px-6 sm:py-6"
          >
            <dt>
              <div className="absolute rounded-md bg-blue-500/10 p-3">
                <stat.icon className="h-6 w-6 text-blue-500" aria-hidden="true" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-400">{stat.name}</p>
            </dt>
            <dd className="ml-16 flex items-baseline">
              <p className="text-2xl font-semibold text-white">{stat.value}</p>
              <p
                className={`ml-2 flex items-baseline text-sm font-semibold ${
                  stat.changeType === 'increase' ? 'text-green-500' : 'text-red-500'
                }`}
              >
                {stat.change}
              </p>
            </dd>
          </div>
        ))}
      </div>

      {/* Recent Documents */}
      <div className="rounded-lg bg-gray-800 shadow">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg font-medium leading-6 text-white">Documentos Recientes</h3>
          <p className="mt-1 text-sm text-gray-400">
            Lista de los últimos documentos subidos al sistema
          </p>
        </div>
        <div className="border-t border-gray-700">
          <ul role="list" className="divide-y divide-gray-700">
            {recentDocuments.map((doc) => (
              <li key={doc.id} className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <FileText className="h-5 w-5 text-gray-400" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-white">{doc.name}</p>
                      <p className="text-sm text-gray-400">{doc.type}</p>
                    </div>
                  </div>
                  <div className="ml-2 flex flex-shrink-0">
                    <p className="text-sm text-gray-400">{doc.date}</p>
                    <span className="ml-4 text-sm text-gray-400">{doc.size}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-lg bg-gray-800 shadow">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg font-medium leading-6 text-white">Acciones Rápidas</h3>
          <p className="mt-1 text-sm text-gray-400">
            Accede rápidamente a las funciones más utilizadas
          </p>
        </div>
        <div className="border-t border-gray-700 px-4 py-5 sm:px-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <button className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              <Upload className="mr-2 h-5 w-5" />
              Subir Documento
            </button>
            <button className="inline-flex items-center justify-center rounded-md border border-gray-700 bg-gray-800 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              <FileText className="mr-2 h-5 w-5" />
              Ver Documentos
            </button>
            <button className="inline-flex items-center justify-center rounded-md border border-gray-700 bg-gray-800 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              <Users className="mr-2 h-5 w-5" />
              Gestionar Usuarios
            </button>
            <button className="inline-flex items-center justify-center rounded-md border border-gray-700 bg-gray-800 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              <Clock className="mr-2 h-5 w-5" />
              Ver Historial
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 