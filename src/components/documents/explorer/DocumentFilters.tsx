"use client";
import { useState } from 'react';

export function DocumentFilters() {
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <div className="space-y-4">
      {/* Filtros básicos */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 flex flex-wrap gap-4 items-end shadow-sm">
        <div>
          <label htmlFor="tipo" className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Tipo</label>
          <select id="tipo" className="rounded bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white px-2 py-1 border border-gray-200 dark:border-gray-700">
            <option>Todos</option>
            <option>DNI</option>
            <option>Comprobante Domicilio</option>
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Cliente</label>
          <input className="rounded bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white px-2 py-1 border border-gray-200 dark:border-gray-700" placeholder="Buscar cliente..." />
        </div>
        <div>
          <label htmlFor="estado" className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Estado</label>
          <select id="estado" className="rounded bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white px-2 py-1 border border-gray-200 dark:border-gray-700">
            <option>Todos</option>
            <option>Procesado</option>
            <option>Pendiente</option>
          </select>
        </div>
        <div>
          <label htmlFor="fecha-carga" className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Fecha de carga</label>
          <input id="fecha-carga" type="date" className="rounded bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white px-2 py-1 border border-gray-200 dark:border-gray-700" />
        </div>
        <div>
          <label htmlFor="confianza" className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Confianza</label>
          <input id="confianza" type="range" min="0" max="100" className="w-32" />
        </div>
        <div>
          <label htmlFor="validacion" className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Validación</label>
          <select id="validacion" className="rounded bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white px-2 py-1 border border-gray-200 dark:border-gray-700">
            <option>Todos</option>
            <option>Requiere validación</option>
            <option>Validado</option>
          </select>
        </div>
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          {showAdvanced ? 'Ocultar filtros avanzados' : 'Mostrar filtros avanzados'}
        </button>
      </div>

      {/* Filtros avanzados */}
      {showAdvanced && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Características del documento */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">Características del documento</h3>
              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Tipo de extracción</label>
                <select className="w-full rounded bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white px-2 py-1 border border-gray-200 dark:border-gray-700">
                  <option>Todos</option>
                  <option>Automática</option>
                  <option>Manual</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Procesador</label>
                <select className="w-full rounded bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white px-2 py-1 border border-gray-200 dark:border-gray-700">
                  <option>Todos</option>
                  <option>IdProcessor</option>
                  <option>ContractProcessor</option>
                  <option>FinancialProcessor</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Criticidad regulatoria</label>
                <select className="w-full rounded bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white px-2 py-1 border border-gray-200 dark:border-gray-700">
                  <option>Todos</option>
                  <option>Alta</option>
                  <option>Media</option>
                  <option>Baja</option>
                </select>
              </div>
            </div>

            {/* Relaciones */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">Relaciones</h3>
              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Carpeta</label>
                <select className="w-full rounded bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white px-2 py-1 border border-gray-200 dark:border-gray-700">
                  <option>Todas</option>
                  <option>Raíz</option>
                  <option>Clientes</option>
                  <option>Contratos</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Gestor asignado</label>
                <select className="w-full rounded bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white px-2 py-1 border border-gray-200 dark:border-gray-700">
                  <option>Todos</option>
                  <option>Juan Pérez</option>
                  <option>María García</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Departamento</label>
                <select className="w-full rounded bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white px-2 py-1 border border-gray-200 dark:border-gray-700">
                  <option>Todos</option>
                  <option>Legal</option>
                  <option>Finanzas</option>
                  <option>Operaciones</option>
                </select>
              </div>
            </div>

            {/* Metadatos */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">Metadatos</h3>
              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Moneda</label>
                <select className="w-full rounded bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white px-2 py-1 border border-gray-200 dark:border-gray-700">
                  <option>Todas</option>
                  <option>USD</option>
                  <option>EUR</option>
                  <option>PEN</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Rango de importe</label>
                <div className="flex gap-2">
                  <input type="number" placeholder="Min" className="w-1/2 rounded bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white px-2 py-1 border border-gray-200 dark:border-gray-700" />
                  <input type="number" placeholder="Max" className="w-1/2 rounded bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white px-2 py-1 border border-gray-200 dark:border-gray-700" />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Palabras clave</label>
                <input type="text" placeholder="Buscar en texto..." className="w-full rounded bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white px-2 py-1 border border-gray-200 dark:border-gray-700" />
              </div>
            </div>

            {/* Aspectos técnicos */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">Aspectos técnicos</h3>
              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Formato</label>
                <select className="w-full rounded bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white px-2 py-1 border border-gray-200 dark:border-gray-700">
                  <option>Todos</option>
                  <option>PDF</option>
                  <option>Imagen</option>
                  <option>Word</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Tamaño de archivo</label>
                <select className="w-full rounded bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white px-2 py-1 border border-gray-200 dark:border-gray-700">
                  <option>Todos</option>
                  <option>Pequeño (&lt; 1MB)</option>
                  <option>Mediano (1-5MB)</option>
                  <option>Grande (&gt; 5MB)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Calidad de digitalización</label>
                <select className="w-full rounded bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white px-2 py-1 border border-gray-200 dark:border-gray-700">
                  <option>Todos</option>
                  <option>Alta</option>
                  <option>Media</option>
                  <option>Baja</option>
                </select>
              </div>
            </div>

            {/* Cumplimiento */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">Cumplimiento</h3>
              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Estado de vencimiento</label>
                <select className="w-full rounded bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white px-2 py-1 border border-gray-200 dark:border-gray-700">
                  <option>Todos</option>
                  <option>Vigente</option>
                  <option>Por vencer</option>
                  <option>Caducado</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Nivel de riesgo</label>
                <select className="w-full rounded bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white px-2 py-1 border border-gray-200 dark:border-gray-700">
                  <option>Todos</option>
                  <option>Alto</option>
                  <option>Medio</option>
                  <option>Bajo</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Validaciones</label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">KYC</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">AML</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">PBC</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Histórico */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">Histórico</h3>
              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Versiones</label>
                <select className="w-full rounded bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white px-2 py-1 border border-gray-200 dark:border-gray-700">
                  <option>Todos</option>
                  <option>Única</option>
                  <option>Múltiples</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Revisiones manuales</label>
                <select className="w-full rounded bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white px-2 py-1 border border-gray-200 dark:border-gray-700">
                  <option>Todos</option>
                  <option>Sin revisiones</option>
                  <option>Con revisiones</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Última modificación</label>
                <input type="date" className="w-full rounded bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white px-2 py-1 border border-gray-200 dark:border-gray-700" />
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="mt-6 flex justify-end gap-4">
            <button className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
              Limpiar filtros
            </button>
            <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
              Aplicar filtros
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 