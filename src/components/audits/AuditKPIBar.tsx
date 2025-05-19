import React from 'react';
import { AuditLog } from '@/lib/api/services/auditoria.service';

interface AuditKPIBarProps {
  logs: AuditLog[];
}

export function AuditKPIBar({ logs }: AuditKPIBarProps) {
  const total = logs.length;
  const exito = logs.filter(l => l.resultado === 'exito').length;
  const fallo = logs.filter(l => l.resultado === 'fallo').length;
  const usuariosUnicos = new Set(logs.map(l => l.usuario_id)).size;
  const entidadesUnicas = new Set(logs.map(l => l.entidad_afectada)).size;

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      <div className="bg-white dark:bg-gray-900 rounded shadow p-4 text-center">
        <div className="text-2xl font-bold">{total}</div>
        <div className="text-xs text-gray-500">Total registros</div>
      </div>
      <div className="bg-green-50 dark:bg-green-900 rounded shadow p-4 text-center">
        <div className="text-2xl font-bold text-green-700">{exito}</div>
        <div className="text-xs text-gray-500">Éxitos</div>
      </div>
      <div className="bg-red-50 dark:bg-red-900 rounded shadow p-4 text-center">
        <div className="text-2xl font-bold text-red-700">{fallo}</div>
        <div className="text-xs text-gray-500">Fallos</div>
      </div>
      <div className="bg-white dark:bg-gray-900 rounded shadow p-4 text-center">
        <div className="text-2xl font-bold">{usuariosUnicos}</div>
        <div className="text-xs text-gray-500">Usuarios únicos</div>
      </div>
      <div className="bg-white dark:bg-gray-900 rounded shadow p-4 text-center">
        <div className="text-2xl font-bold">{entidadesUnicas}</div>
        <div className="text-xs text-gray-500">Entidades únicas</div>
      </div>
    </div>
  );
} 