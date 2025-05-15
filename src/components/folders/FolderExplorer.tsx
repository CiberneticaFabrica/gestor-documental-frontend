"use client";
import { useState, useEffect } from 'react';
import { foldersService, Folder, Document } from '@/lib/api/services/folders.service';

interface FolderExplorerProps {
  folders?: Folder[];
}

export function FolderExplorer({ folders = [] }: FolderExplorerProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);
  const [foldersState, setFoldersState] = useState<Folder[]>(folders ?? []);

  const getTotalDocuments = (folder: Folder): number => {
    const directDocuments = folder.documentos?.length || 0;
    const subfolderDocuments = folder.subcarpetas?.reduce(
      (total, subfolder) => total + getTotalDocuments(subfolder),
      0
    ) || 0;
    return directDocuments + subfolderDocuments;
  };

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

  const handleFolderClick = (folder: Folder) => {
    setSelectedFolder(folder);
  };

  const renderFolder = (folder: Folder, level: number = 0) => {
    const isExpanded = expandedFolders.has(folder.id_carpeta);
    const hasChildren = folder.subcarpetas.length > 0;
    const isSelected = selectedFolder?.id_carpeta === folder.id_carpeta;
    const totalDocuments = getTotalDocuments(folder);

    return (
      <div key={folder.id_carpeta} className="select-none">
        <div
          className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer ${
            isSelected 
              ? 'bg-blue-100 dark:bg-blue-900' 
              : 'hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
          onClick={() => handleFolderClick(folder)}
        >
          {hasChildren && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFolder(folder.id_carpeta);
              }}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
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
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
            />
          </svg>
          <span className="text-gray-700 dark:text-gray-200">{folder.nombre_carpeta}</span>
          {totalDocuments > 0 && (
            <span className="ml-2 px-2 py-0.5 text-xs bg-gray-200 dark:bg-gray-700 rounded-full">
              {totalDocuments}
            </span>
          )}
        </div>
        {isExpanded && hasChildren && (
          <div className="mt-1 ml-4">
            {folder.subcarpetas.map((child: Folder) => renderFolder(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const renderDocument = (document: Document) => {
    return (
      <div
        key={document.id_documento}
        className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
      >
        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
          />
        </svg>
        <span className="text-gray-700 dark:text-gray-200">{document.titulo}</span>
      </div>
    );
  };

  const rootFolders = Array.isArray(foldersState)
    ? foldersState.filter(folder => !folder.carpeta_padre_id)
    : [];

  useEffect(() => {
    foldersService.getFoldersWithDocuments()
      .then(data => setFoldersState(Array.isArray(data) ? data : []))
      .catch(console.error);
  }, []);

  return (
    <div className="flex h-full">
      {/* Columna de carpetas */}
      <div className="w-1/3 border-r border-gray-200 dark:border-gray-700 p-4 overflow-y-auto">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Carpetas</h3>
        <div className="space-y-1">
          {rootFolders.map(folder => renderFolder(folder))}
        </div>
      </div>

      {/* Columna de documentos */}
      <div className="w-2/3 p-4 overflow-y-auto">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          {selectedFolder ? `Documentos en ${selectedFolder.nombre_carpeta}` : 'Seleccione una carpeta'}
        </h3>
        {selectedFolder && (
          <div className="space-y-1">
            {selectedFolder.documentos.length > 0 ? (
              selectedFolder.documentos.map((doc: Document) => renderDocument(doc))
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No hay documentos en esta carpeta</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 