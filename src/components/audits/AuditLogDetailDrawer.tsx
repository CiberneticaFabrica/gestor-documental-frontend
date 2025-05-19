import React from 'react';
import { AuditLog } from '@/lib/api/services/auditoria.service';

interface AuditLogDetailDrawerProps {
  log: AuditLog | null;
  onClose: () => void;
}

export function AuditLogDetailDrawer({ log, onClose }: AuditLogDetailDrawerProps) {
  if (!log) return null;
  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-30" onClick={onClose}></div>
      {/* Drawer */}
      <div className="relative ml-auto w-full max-w-md bg-white dark:bg-gray-900 shadow-xl h-full p-6 overflow-y-auto">
        <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-900" onClick={onClose}>&times;</button>
        <h2 className="text-xl font-bold mb-4">Detalle de Log</h2>
        <div className="space-y-2 text-sm">
          <div><span className="font-semibold">ID:</span> {log.id_registro}</div>
          <div><span className="font-semibold">Fecha y hora:</span> {new Date(log.fecha_hora).toLocaleString()}</div>
          <div><span className="font-semibold">Usuario:</span> {log.nombre_usuario || log.usuario_id}</div>
          <div><span className="font-semibold">IP:</span> {log.direccion_ip}</div>
          <div><span className="font-semibold">Acción:</span> {log.accion || <span className="italic text-gray-400">(vacío)</span>}</div>
          <div><span className="font-semibold">Entidad:</span> {log.entidad_afectada || <span className="italic text-gray-400">(vacío)</span>}</div>
          <div><span className="font-semibold">Resultado:</span> <span className={`px-2 py-1 rounded text-xs ${log.resultado === 'exito' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{log.resultado}</span></div>
          <div><span className="font-semibold">Detalles:</span>
            <pre className="bg-gray-100 dark:bg-gray-800 rounded p-2 mt-1 overflow-x-auto text-xs">{JSON.stringify(log.detalles, null, 2)}</pre>
          </div>
        </div>
      </div>
    </div>
  );
} 