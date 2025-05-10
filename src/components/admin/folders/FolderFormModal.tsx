"use client";
import { useState } from 'react';
import { toast } from 'sonner';

interface FolderFormModalProps {
  onClose: () => void;
  onFolderCreated: () => void;
  parentFolderId?: string;
}

export function FolderFormModal({ onClose, onFolderCreated, parentFolderId }: FolderFormModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre_carpeta: '',
    descripcion: '',
    acceso_restringido: false,
    departamentos_autorizados: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("session_token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "https://7xb9bklzff.execute-api.us-east-1.amazonaws.com/Prod"}/folders`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            nombre_carpeta: formData.nombre_carpeta,
            descripcion: formData.descripcion,
            carpeta_padre_id: parentFolderId || null,
            politicas: {
              acceso_restringido: formData.acceso_restringido,
              departamentos_autorizados: formData.acceso_restringido 
                ? formData.departamentos_autorizados.split(',').map(d => d.trim())
                : []
            }
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Error al crear la carpeta');
      }

      toast.success('Carpeta creada exitosamente');
      onFolderCreated();
      onClose();
    } catch (error) {
      console.error('Error al crear la carpeta:', error);
      toast.error('Error al crear la carpeta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {parentFolderId ? 'Crear Subcarpeta' : 'Nueva Carpeta'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="nombre_carpeta" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Nombre de la carpeta
            </label>
            <input
              type="text"
              id="nombre_carpeta"
              value={formData.nombre_carpeta}
              onChange={(e) => setFormData({ ...formData, nombre_carpeta: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </div>

          <div>
            <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Descripción
            </label>
            <textarea
              id="descripcion"
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              rows={3}
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="acceso_restringido"
              checked={formData.acceso_restringido}
              onChange={(e) => setFormData({ ...formData, acceso_restringido: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="acceso_restringido" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Acceso restringido
            </label>
          </div>

          {formData.acceso_restringido && (
            <div>
              <label htmlFor="departamentos_autorizados" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Departamentos autorizados (separados por comas)
              </label>
              <input
                type="text"
                id="departamentos_autorizados"
                value={formData.departamentos_autorizados}
                onChange={(e) => setFormData({ ...formData, departamentos_autorizados: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Finanzas, Dirección"
              />
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50"
            >
              {loading ? 'Creando...' : 'Crear Carpeta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 