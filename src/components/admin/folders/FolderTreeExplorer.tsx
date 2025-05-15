"use client";
import { useState } from 'react';
import { Folder } from './FoldersAdminPage';

interface FolderTreeExplorerProps {
  folders: Folder[];
  onSelect: (folder: Folder) => void;
}

export function FolderTreeExplorer({ folders, onSelect }: FolderTreeExplorerProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev => {
      const next = new Set(prev);
      if (next.has(folderId)) {
        next.delete(folderId);
      } else {
        next.add(folderId);
      }
      return next;
    });
  };

  const renderFolder = (folder: Folder, level: number = 0) => {
    const childFolders = folders.filter(f => f.carpeta_padre_id === folder.id_carpeta);
    const isExpanded = expandedFolders.has(folder.id_carpeta);
    const hasChildren = childFolders.length > 0;

    return (
      <div key={folder.id_carpeta} className="select-none">
        <div
          className={`flex items-center gap-2 p-2 rounded-lg hover:bg-gray-700 cursor-pointer ${
            level > 0 ? 'ml-' + (level * 4) : ''
          }`}
          onClick={() => onSelect(folder)}
        >
          {hasChildren && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFolder(folder.id_carpeta);
              }}
              className="text-gray-400 hover:text-white transition-colors"
              aria-label={isExpanded ? 'Colapsar carpeta' : 'Expandir carpeta'}
            >
              <svg
                className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
          <div className="flex-1 flex items-center gap-2">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
              />
            </svg>
            <span className="text-gray-300">{folder.nombre_carpeta}</span>
          </div>
          {/* {!folder.visible && (
            <span className="text-gray-500 text-sm">(Oculto)</span>
          )} */}
        </div>
        {isExpanded && hasChildren && (
          <div className="mt-1">
            {childFolders.map(child => renderFolder(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const rootFolders = folders.filter(folder => !folder.carpeta_padre_id);

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <h3 className="text-lg font-medium text-white mb-4">Estructura de Carpetas</h3>
      <div className="space-y-1">
        {rootFolders.map(folder => renderFolder(folder))}
      </div>
    </div>
  );
} 