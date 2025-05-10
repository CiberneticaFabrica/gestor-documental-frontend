"use client";
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { FolderFormModal } from './FolderFormModal';

interface Folder {
  id_carpeta: string;
  nombre_carpeta: string;
  descripcion: string;
  carpeta_padre_id: string | null;
  ruta_completa: string;
  id_propietario: string;
  fecha_creacion: string;
  fecha_modificacion: string;
  propietario_nombre: string;
  subcarpetas: Folder[];
  politicas?: {
    acceso_restringido: boolean;
    departamentos_autorizados: string[];
  };
  carpeta_padre_nombre?: string | null;
}

interface FolderDetails {
  carpeta: Folder;
  subcarpetas: Array<{
    id_carpeta: string;
    nombre_carpeta: string;
    descripcion: string;
    fecha_creacion: string;
  }>;
  estadisticas: {
    documentos_count: number;
    subcarpetas_count: number;
  };
  ruta_desglosada: string[];
}

export default function FoldersAdminPage() {
  const [showForm, setShowForm] = useState(false);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedParentId, setSelectedParentId] = useState<string | null>(null);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [showActionsMenu, setShowActionsMenu] = useState<string | null>(null);
  const [folderDetails, setFolderDetails] = useState<FolderDetails | null>(null);

  const fetchFolders = async () => {
    try {
      const token = localStorage.getItem("session_token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "https://7xb9bklzff.execute-api.us-east-1.amazonaws.com/Prod"}/folders`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error('Error al cargar las carpetas');
      
      const data = await response.json();
      console.log('Folders response:', data);
      setFolders(data.carpetas || []);
    } catch (error) {
      console.error("Error al cargar las carpetas:", error);
      toast.error("Error al cargar las carpetas");
    } finally {
      setLoading(false);
    }
  };

  const fetchFolderDetails = async (folderId: string) => {
    try {
      const token = localStorage.getItem("session_token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "https://7xb9bklzff.execute-api.us-east-1.amazonaws.com/Prod"}/folders/${folderId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error('Error al cargar los detalles de la carpeta');
      
      const data = await response.json();
      setFolderDetails(data);
    } catch (error) {
      console.error("Error al cargar los detalles de la carpeta:", error);
      toast.error("Error al cargar los detalles de la carpeta");
    }
  };

  useEffect(() => {
    fetchFolders();
  }, []);

  useEffect(() => {
    if (selectedFolderId) {
      fetchFolderDetails(selectedFolderId);
    } else {
      setFolderDetails(null);
    }
  }, [selectedFolderId]);

  const handleFolderCreated = () => {
    fetchFolders();
  };

  const handleDeleteFolder = async (folderId: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta carpeta?')) return;

    try {
      const token = localStorage.getItem("session_token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "https://7xb9bklzff.execute-api.us-east-1.amazonaws.com/Prod"}/folders/${folderId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error('Error al eliminar la carpeta');

      toast.success('Carpeta eliminada exitosamente');
      fetchFolders();
      if (selectedFolderId === folderId) {
        setSelectedFolderId(null);
      }
    } catch (error) {
      console.error('Error al eliminar la carpeta:', error);
      toast.error('Error al eliminar la carpeta');
    }
  };

  const renderFolderRow = (folder: Folder, level: number = 0): JSX.Element => {
    return (
      <>
        <tr key={folder.id_carpeta} className="hover:bg-blue-50 dark:hover:bg-gray-700">
          <td className="px-4 py-2 text-xs font-semibold text-blue-700 dark:text-blue-300">
            <div style={{ paddingLeft: `${level * 20}px` }} className="flex items-center">
              {level > 0 && <span className="mr-2">└─</span>}
              <span 
                className="cursor-pointer hover:underline"
                onClick={() => setSelectedFolderId(folder.id_carpeta)}
              >
                {folder.nombre_carpeta}
              </span>
            </div>
          </td>
          <td className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400">
            {folder.ruta_completa}
          </td>
          <td className="px-4 py-2 text-xs">{folder.descripcion || '-'}</td>
          <td className="px-4 py-2 text-xs">
            {folder.politicas?.acceso_restringido ? (
              <span className="text-red-500">Restringido</span>
            ) : (
              <span className="text-green-500">Público</span>
            )}
          </td>
          <td className="px-4 py-2">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  setSelectedParentId(folder.id_carpeta);
                  setShowForm(true);
                }}
                className="text-blue-500 hover:text-blue-700 dark:hover:text-blue-300 text-xs"
              >
                Crear Subcarpeta
              </button>
              <div className="relative">
                <button
                  onClick={() => setShowActionsMenu(showActionsMenu === folder.id_carpeta ? null : folder.id_carpeta)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  title="Acciones"
                  aria-label="Mostrar acciones"
                >
                  •••
                </button>
                {showActionsMenu === folder.id_carpeta && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10">
                    <div className="py-1">
                      <button
                        onClick={() => {
                          setSelectedFolderId(folder.id_carpeta);
                          setShowActionsMenu(null);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Ver detalles
                      </button>
                      <button
                        onClick={() => {
                          handleDeleteFolder(folder.id_carpeta);
                          setShowActionsMenu(null);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </td>
        </tr>
        {folder.subcarpetas?.map(subfolder => renderFolderRow(subfolder, level + 1))}
      </>
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-6 min-h-[80vh]">
        <div className="text-white">Cargando carpetas...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[80vh]">
      <div className="flex-1 flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Gestión de Carpetas</h1>
          <button 
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={() => {
              setSelectedParentId(null);
              setShowForm(true);
            }}
          >
            Nueva Carpeta
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-100 dark:bg-gray-900">
              <tr>
                <th className="px-4 py-2 text-xs font-semibold text-gray-500">Nombre</th>
                <th className="px-4 py-2 text-xs font-semibold text-gray-500">Ruta</th>
                <th className="px-4 py-2 text-xs font-semibold text-gray-500">Descripción</th>
                <th className="px-4 py-2 text-xs font-semibold text-gray-500">Acceso</th>
                <th className="px-4 py-2 text-xs font-semibold text-gray-500">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {folders && folders.length > 0 ? (
                folders.map(folder => renderFolderRow(folder))
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-4 text-center text-gray-500 dark:text-gray-400">
                    No hay carpetas disponibles
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {folderDetails && (
        <div className="w-96 bg-white dark:bg-gray-800 rounded-lg shadow p-4 ml-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Detalles de la Carpeta</h2>
            <button
              onClick={() => setSelectedFolderId(null)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              ✕
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Información General</h3>
              <div className="mt-2 space-y-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Nombre:</span> {folderDetails.carpeta.nombre_carpeta}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Descripción:</span> {folderDetails.carpeta.descripcion || '-'}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Ruta:</span> {folderDetails.carpeta.ruta_completa}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Propietario:</span> {folderDetails.carpeta.propietario_nombre}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Creado:</span> {new Date(folderDetails.carpeta.fecha_creacion).toLocaleString()}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Estadísticas</h3>
              <div className="mt-2 space-y-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Documentos:</span> {folderDetails.estadisticas.documentos_count}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Subcarpetas:</span> {folderDetails.estadisticas.subcarpetas_count}
                </p>
              </div>
            </div>

            {folderDetails.subcarpetas.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Subcarpetas</h3>
                <div className="mt-2 space-y-2">
                  {folderDetails.subcarpetas.map(subfolder => (
                    <div key={subfolder.id_carpeta} className="text-sm text-gray-600 dark:text-gray-400">
                      <p className="font-medium">{subfolder.nombre_carpeta}</p>
                      <p className="text-xs">{subfolder.descripcion}</p>
                      <p className="text-xs text-gray-500">
                        Creado: {new Date(subfolder.fecha_creacion).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {showForm && (
        <FolderFormModal
          onClose={() => setShowForm(false)}
          onFolderCreated={handleFolderCreated}
          parentFolderId={selectedParentId || undefined}
        />
      )}
    </div>
  );
} 