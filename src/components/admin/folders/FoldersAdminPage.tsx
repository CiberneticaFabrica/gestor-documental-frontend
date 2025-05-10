"use client";
import { useState } from 'react';
import { FolderTreeExplorer } from './FolderTreeExplorer';
import { FolderFormModal } from './FolderFormModal';
import { FolderPermissionsPanel } from './FolderPermissionsPanel';
import { FolderAllowedTypesPanel } from './FolderAllowedTypesPanel';
//import { GroupManagementPanel } from './GroupManagementPanel';

export interface Folder {
  id: string;
  name: string;
  parentId: string | null;
  path: string;
  createdBy: string;
  createdAt: string;
  modifiedBy: string;
  modifiedAt: string;
  metadata?: Record<string, unknown>;
  visible: boolean;
}

const mockFolders: Folder[] = [
  { id: '1', name: 'sistema', parentId: null, path: '/sistema', createdBy: 'admin', createdAt: '2024-01-01', modifiedBy: 'admin', modifiedAt: '2024-01-01', visible: true },
  { id: '2', name: 'clientes', parentId: null, path: '/clientes', createdBy: 'admin', createdAt: '2024-01-01', modifiedBy: 'admin', modifiedAt: '2024-01-01', visible: true },
  { id: '3', name: 'retail', parentId: '2', path: '/clientes/retail', createdBy: 'admin', createdAt: '2024-01-01', modifiedBy: 'admin', modifiedAt: '2024-01-01', visible: true },
  { id: '4', name: 'activos', parentId: '3', path: '/clientes/retail/activos', createdBy: 'admin', createdAt: '2024-01-01', modifiedBy: 'admin', modifiedAt: '2024-01-01', visible: true },
  { id: '5', name: 'tipos_documento', parentId: null, path: '/tipos_documento', createdBy: 'admin', createdAt: '2024-01-01', modifiedBy: 'admin', modifiedAt: '2024-01-01', visible: true },
];

export default function FoldersAdminPage() {
  const [showForm, setShowForm] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);

  return (
    <div className="flex min-h-[80vh]">
      {/* Sidebar de carpetas */}
      <aside className="w-64 min-w-[16rem] max-w-xs bg-gray-800 dark:bg-gray-900 border-r border-gray-700 p-4">
        <FolderTreeExplorer folders={mockFolders} onSelect={setSelectedFolder} />
      </aside>
      {/* Contenido principal */}
      <main className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Gestión de Carpetas</h1>
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={() => setShowForm(true)}>Nueva carpeta</button>
        </div>
        {showForm && <FolderFormModal onClose={() => setShowForm(true)} />}
        {selectedFolder && <FolderPermissionsPanel folder={selectedFolder} />}
        {selectedFolder && <FolderAllowedTypesPanel folder={selectedFolder} />}
        {/*<GroupManagementPanel />*/}
      </main>
    </div>
  );
} 