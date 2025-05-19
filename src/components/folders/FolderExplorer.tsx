"use client";
import { useState, useEffect, useRef } from 'react';
import { foldersService, Folder, Document } from '@/lib/api/services/folders.service';
import { documentService } from '@/lib/api/services/document.service';

interface FolderExplorerProps {
  folders?: Folder[];
}

export function FolderExplorer({ folders = [] }: FolderExplorerProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);
  const [foldersState, setFoldersState] = useState<Folder[]>(folders ?? []);
  const [moveModalOpen, setMoveModalOpen] = useState(false);
  const [documentToMove, setDocumentToMove] = useState<Document | null>(null);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [clientFolders, setClientFolders] = useState<Folder[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Referencias para los contenedores con scroll
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);

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
    // Guardar la carpeta seleccionada anteriormente para comparación
    const previousFolder = selectedFolder;
    
    // Actualizar la carpeta seleccionada
    setSelectedFolder(folder);
    
    // Si se cambió de carpeta, desplazar el panel derecho hacia arriba
    if (previousFolder?.id_carpeta !== folder.id_carpeta && rightPanelRef.current) {
      rightPanelRef.current.scrollTop = 0;
    }
    
    // Asegurarse de que el documento sea visible en el panel derecho
    // Esto hace que el panel derecho se mantenga en la vista visible
    if (rightPanelRef.current) {
      // Hacemos scroll del panel derecho a la parte superior
      // para asegurar que los documentos sean visibles
      rightPanelRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Función para encontrar y actualizar una carpeta específica en el estado
  const findAndUpdateFolder = (
    folders: Folder[], 
    folderId: string, 
    updateFunction: (folder: Folder) => Folder
  ): Folder[] => {
    return folders.map(folder => {
      if (folder.id_carpeta === folderId) {
        return updateFunction(folder);
      }
      
      // Buscar recursivamente en subcarpetas
      if (folder.subcarpetas && folder.subcarpetas.length > 0) {
        return {
          ...folder,
          subcarpetas: findAndUpdateFolder(folder.subcarpetas, folderId, updateFunction)
        };
      }
      
      return folder;
    });
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

  const renderDocument = (document: Document) => (
    <div key={document.id_documento} className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
        />
      </svg>
      <span className="text-gray-700 dark:text-gray-200">{document.titulo}</span>
      <button
        className="ml-auto text-blue-500 hover:text-blue-700"
        onClick={() => openMoveModal(document)}
        title="Mover documento"
        disabled={isLoading}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M9 5l7 7-7 7" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  );
  
  // Sincronización de scroll entre paneles
  useEffect(() => {
    const leftPanel = leftPanelRef.current;
    const rightPanel = rightPanelRef.current;
    
    if (!leftPanel || !rightPanel) return;
    
    // Creamos un elemento para mantener los paneles alineados visualmente
    const rightPanelContainer = rightPanel.parentElement;
    
    if (!rightPanelContainer) return;
    
    // Cuando se selecciona una carpeta, aseguramos que el panel derecho esté visible
    if (selectedFolder) {
      // Calculamos la posición relativa para mantener los paneles alineados
      const leftScrollPos = leftPanel.scrollTop;
      rightPanel.style.position = 'sticky';
      rightPanel.style.top = `${leftScrollPos}px`;
    }
    
    const handleLeftScroll = () => {
      if (!selectedFolder) return;
      
      // Ajustar la posición del panel derecho para mantener la visibilidad
      const leftScrollPos = leftPanel.scrollTop;
      rightPanel.style.position = 'sticky';
      rightPanel.style.top = `${leftScrollPos}px`;
    };
    
    leftPanel.addEventListener('scroll', handleLeftScroll);
    
    return () => {
      leftPanel.removeEventListener('scroll', handleLeftScroll);
    };
  }, [selectedFolder]);

  const rootFolders = Array.isArray(foldersState)
    ? foldersState.filter(folder => !folder.carpeta_padre_id)
    : [];

  useEffect(() => {
    setIsLoading(true);
    foldersService.getFoldersWithDocuments()
      .then(data => {
        setFoldersState(Array.isArray(data) ? data : []);
        setIsLoading(false);
      })
      .catch(error => {
        console.error(error);
        setIsLoading(false);
      });
  }, []);

  // Función para encontrar la carpeta raíz del cliente al que pertenece una carpeta
  function findClientRoot(folder: Folder, folders: Folder[]): Folder | null {
    if (!folder) return null;

    // Función para buscar una carpeta por ID
    function findFolderById(id: string, allFolders: Folder[]): Folder | null {
      for (const f of allFolders) {
        if (f.id_carpeta === id) return f;
        
        const found = findFolderById(id, f.subcarpetas);
        if (found) return found;
      }
      return null;
    }

    // Función recursiva para encontrar la carpeta padre
    function findParent(currentId: string, allFolders: Folder[]): Folder | null {
      for (const f of allFolders) {
        if (f.subcarpetas.some(sf => sf.id_carpeta === currentId)) {
          return f;
        }
        const found = findParent(currentId, f.subcarpetas);
        if (found) return found;
      }
      return null;
    }

    // Determinar si la carpeta actual es de un cliente (verifica el nombre por el patrón PF-* o EM-*)
    const isClientFolder = /\((PF|EM)-\d{8}-\d{4}\)/.test(folder.nombre_carpeta);
    if (isClientFolder) {
      return folder;
    }

    // Buscar la carpeta padre y verificar si es de un cliente
    let current = folder;
    let parent = findParent(current.id_carpeta, folders);

    // Si el padre inmediato es un cliente, retornarlo
    if (parent && /\((PF|EM)-\d{8}-\d{4}\)/.test(parent.nombre_carpeta)) {
      return parent;
    }

    // Si no, buscar el padre de la carpeta actual
    if (folder.carpeta_padre_id) {
      const parentFolder = findFolderById(folder.carpeta_padre_id, folders);
      if (parentFolder && /\((PF|EM)-\d{8}-\d{4}\)/.test(parentFolder.nombre_carpeta)) {
        return parentFolder;
      }

      // Si el padre inmediato no es un cliente, busca recursivamente hacia arriba
      if (parentFolder) {
        return findClientRoot(parentFolder, folders);
      }
    }

    return null;
  }

  // Función para encontrar todas las carpetas de un cliente específico
  function findClientFolders(clientFolder: Folder): Folder[] {
    if (!clientFolder) return [];
    
    // Si es una carpeta de cliente, devuelve la carpeta del cliente
    // No incluimos sus subcarpetas aquí porque las manejaremos en renderFolderRadioList
    if (/\((PF|EM)-\d{8}-\d{4}\)/.test(clientFolder.nombre_carpeta)) {
      return [clientFolder];
    }
    
    return [clientFolder];
  }

  function openMoveModal(document: Document) {
    setDocumentToMove(document);
    
    // Encontrar la carpeta del cliente basado en la carpeta actual seleccionada
    if (selectedFolder) {
      const clientRoot = findClientRoot(selectedFolder, foldersState);
      if (clientRoot) {
        // Filtrar carpetas para mostrar solo las del cliente
        const clientFoldersFiltered = findClientFolders(clientRoot);
        setClientFolders(clientFoldersFiltered);
      } else {
        // Si no se encuentra una carpeta de cliente específica, mostrar un mensaje
        setClientFolders([]);
      }
    }
    
    setMoveModalOpen(true);
  }

  function closeMoveModal() {
    setMoveModalOpen(false);
    setDocumentToMove(null);
    setSelectedFolderId(null);
    setClientFolders([]);
  }

  function renderFolderRadioList(folders: Folder[], level = 0) {
    return folders.map(folder => {
      // Verifica si la carpeta es la carpeta del cliente (contiene el patrón PF- o EM-)
      const isClientFolder = /\((PF|EM)-\d{8}-\d{4}\)/.test(folder.nombre_carpeta);

      return (
        <div key={folder.id_carpeta}>
          {/* Si es la carpeta del cliente, no mostramos un radio button para ella, solo sus subcarpetas */}
          {isClientFolder ? (
            <div className="font-medium text-blue-700 mb-1">{folder.nombre_carpeta}</div>
          ) : (
            <label className="flex items-center gap-2 py-1 cursor-pointer" style={{ marginLeft: level * 16 }}>
              <input
                type="radio"
                name="move-folder"
                value={folder.id_carpeta}
                checked={selectedFolderId === folder.id_carpeta}
                onChange={() => setSelectedFolderId(folder.id_carpeta)}
              />
              <span>{folder.nombre_carpeta}</span>
            </label>
          )}
          
          {/* Renderiza las subcarpetas recursivamente */}
          {folder.subcarpetas && folder.subcarpetas.length > 0 && (
            <div className={isClientFolder ? "" : "ml-4"}>
              {folder.subcarpetas.map(subfolder => (
                <label key={subfolder.id_carpeta} className="flex items-center gap-2 py-1 cursor-pointer" style={{ marginLeft: level * 16 }}>
                  <input
                    type="radio"
                    name="move-folder"
                    value={subfolder.id_carpeta}
                    checked={selectedFolderId === subfolder.id_carpeta}
                    onChange={() => setSelectedFolderId(subfolder.id_carpeta)}
                  />
                  <span>{subfolder.nombre_carpeta}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      );
    });
  }

  // Función para actualizar localmente el estado después de mover un documento
  function updateFoldersAfterMove(sourceFolderId: string, targetFolderId: string, documentId: string) {
    // Buscar el documento en la carpeta de origen
    let documentToMove: Document | null = null;
    
    // 1. Crear una copia del estado actual de carpetas
    const updatedFolders = [...foldersState];
    
    // 2. Actualizar la carpeta de origen (quitar el documento)
    const foldersWithoutDoc = updatedFolders.map(folder => {
      if (folder.id_carpeta === sourceFolderId) {
        // Encontrar y guardar el documento antes de quitarlo
        documentToMove = folder.documentos.find(doc => doc.id_documento === documentId) || null;
        
        return {
          ...folder,
          documentos: folder.documentos.filter(doc => doc.id_documento !== documentId)
        };
      }
      
      // Buscar recursivamente en subcarpetas
      if (folder.subcarpetas && folder.subcarpetas.length > 0) {
        const updatedSubcarpetas = folder.subcarpetas.map(subfolder => {
          if (subfolder.id_carpeta === sourceFolderId) {
            // Encontrar y guardar el documento antes de quitarlo
            documentToMove = subfolder.documentos.find(doc => doc.id_documento === documentId) || null;
            
            return {
              ...subfolder,
              documentos: subfolder.documentos.filter(doc => doc.id_documento !== documentId)
            };
          }
          
          // Buscar más profundo recursivamente
          return {
            ...subfolder,
            subcarpetas: findAndUpdateFolder(subfolder.subcarpetas, sourceFolderId, (f) => ({
              ...f,
              documentos: f.documentos.filter(doc => doc.id_documento !== documentId)
            }))
          };
        });
        
        return { ...folder, subcarpetas: updatedSubcarpetas };
      }
      
      return folder;
    });
    
    // 3. Solo continuar si encontramos el documento
    if (!documentToMove) {
      console.error("No se encontró el documento a mover");
      return;
    }
    
    // 4. Actualizar la carpeta de destino (agregar el documento)
    const finalFolders = foldersWithoutDoc.map(folder => {
      if (folder.id_carpeta === targetFolderId) {
        return {
          ...folder,
          documentos: [...folder.documentos, {...documentToMove!, id_carpeta: targetFolderId}]
        };
      }
      
      // Buscar recursivamente en subcarpetas
      if (folder.subcarpetas && folder.subcarpetas.length > 0) {
        const updatedSubcarpetas = folder.subcarpetas.map(subfolder => {
          if (subfolder.id_carpeta === targetFolderId) {
            return {
              ...subfolder,
              documentos: [...subfolder.documentos, {...documentToMove!, id_carpeta: targetFolderId}]
            };
          }
          
          // Buscar más profundo recursivamente
          return {
            ...subfolder,
            subcarpetas: findAndUpdateFolder(subfolder.subcarpetas, targetFolderId, (f) => ({
              ...f,
              documentos: [...f.documentos, {...documentToMove!, id_carpeta: targetFolderId}]
            }))
          };
        });
        
        return { ...folder, subcarpetas: updatedSubcarpetas };
      }
      
      return folder;
    });
    
    // 5. Actualizar el estado con las carpetas modificadas
    setFoldersState(finalFolders);
    
    // 6. Si la carpeta seleccionada es la de origen, actualizamos su contenido
    if (selectedFolder && selectedFolder.id_carpeta === sourceFolderId) {
      setSelectedFolder({
        ...selectedFolder,
        documentos: selectedFolder.documentos.filter(doc => doc.id_documento !== documentId)
      });
    }
  }

  async function handleMoveDocument() {
    if (!documentToMove || !selectedFolderId || !selectedFolder) return;
    
    setIsLoading(true);
    try {
      // 1. Llamar a la API para mover el documento
      await documentService.moveDocument(documentToMove.id_documento, selectedFolderId);
      
      // 2. Actualizar localmente el estado (optimistic update)
      updateFoldersAfterMove(selectedFolder.id_carpeta, selectedFolderId, documentToMove.id_documento);
      
      // 3. Actualizar la carpeta seleccionada para reflejar el cambio inmediatamente
      if (selectedFolder) {
        setSelectedFolder({
          ...selectedFolder,
          documentos: selectedFolder.documentos.filter(doc => doc.id_documento !== documentToMove.id_documento)
        });
      }
      
      // 4. Refrescar la vista de carpetas/documentos desde el servidor para asegurar consistencia
      const updatedFolders = await foldersService.getFoldersWithDocuments();
      setFoldersState(Array.isArray(updatedFolders) ? updatedFolders : []);
      
      // 5. Cerrar el modal
      closeMoveModal();
      
      // Mostrar una notificación de éxito
      // toast.success("Documento movido correctamente"); // Descomentar si usas un sistema de toast
    } catch (e) {
      console.error('Error al mover el documento:', e);
      // Mostrar una notificación de error
      // toast.error("Error al mover el documento"); // Descomentar si usas un sistema de toast
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex h-full">
      {/* Columna de carpetas */}
      <div 
        ref={leftPanelRef}
        className="w-1/3 border-r border-gray-200 dark:border-gray-700 p-4 overflow-y-auto"
      >
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Carpetas</h3>
        <div className="space-y-1">
          {rootFolders.map(folder => renderFolder(folder))}
        </div>
      </div>

      {/* Columna de documentos - Ahora con clase sticky para mantener visibilidad */}
      <div 
        ref={rightPanelRef}
        className="w-2/3 p-4 overflow-y-auto sticky top-0"
        style={{ maxHeight: '100vh' }}
      >
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 sticky top-0 bg-white dark:bg-gray-800 z-10 py-2">
          {selectedFolder ? `Documentos en ${selectedFolder.nombre_carpeta}` : 'Seleccione una carpeta'}
        </h3>
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <svg className="animate-spin h-6 w-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : (
          selectedFolder && (
            <div className="space-y-1">
              {selectedFolder.documentos.length > 0 ? (
                selectedFolder.documentos.map((doc: Document) => renderDocument(doc))
              ) : (
                <p className="text-gray-500 dark:text-gray-400">No hay documentos en esta carpeta</p>
              )}
            </div>
          )
        )}
      </div>

      {moveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Mover a carpeta</h2>
            <div className="max-h-80 overflow-y-auto">
              {clientFolders.length > 0 ? 
                renderFolderRadioList(clientFolders) : 
                <p className="text-gray-500">No se encontraron carpetas para este cliente.</p>
              }
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button 
                onClick={closeMoveModal} 
                className="px-4 py-2 rounded bg-gray-200"
                disabled={isLoading}
              >
                Cancelar
              </button>
              <button
                onClick={handleMoveDocument}
                className="px-4 py-2 rounded bg-blue-600 text-white flex items-center gap-2"
                disabled={!selectedFolderId || isLoading}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Guardando...
                  </>
                ) : (
                  'Guardar'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}