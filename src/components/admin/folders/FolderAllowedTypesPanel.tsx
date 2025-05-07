"use client";
import { useState } from 'react';
import { Folder } from './FoldersAdminPage';

interface DocumentType {
  id: string;
  name: string;
  description: string;
  required: boolean;
  allowedExtensions: string[];
}

const mockDocumentTypes: DocumentType[] = [
  {
    id: '1',
    name: 'DNI',
    description: 'Documento Nacional de Identidad',
    required: true,
    allowedExtensions: ['.pdf', '.jpg', '.png']
  },
  {
    id: '2',
    name: 'RUC',
    description: 'Registro Único de Contribuyentes',
    required: true,
    allowedExtensions: ['.pdf']
  },
  {
    id: '3',
    name: 'Declaración Jurada',
    description: 'Declaración jurada de ingresos',
    required: false,
    allowedExtensions: ['.pdf', '.doc', '.docx']
  }
];

interface FolderAllowedTypesPanelProps {
  folder: Folder;
}

export function FolderAllowedTypesPanel({ folder }: FolderAllowedTypesPanelProps) {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTypes = mockDocumentTypes.filter(type =>
    type.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    type.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleTypeToggle = (typeId: string) => {
    setSelectedTypes(prev =>
      prev.includes(typeId)
        ? prev.filter(id => id !== typeId)
        : [...prev, typeId]
    );
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-white">
          Tipos de Documento Permitidos - {folder.name}
        </h2>
        <div className="relative">
          <label htmlFor="documentTypeSearch" className="sr-only">
            Buscar tipo de documento
          </label>
          <input
            id="documentTypeSearch"
            type="text"
            placeholder="Buscar tipo de documento..."
            className="bg-gray-700 text-white px-4 py-2 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Buscar tipo de documento"
          />
        </div>
      </div>

      <div className="space-y-4">
        {filteredTypes.map(type => (
          <div
            key={type.id}
            className="bg-gray-700 rounded-lg p-4 flex items-center justify-between"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-white font-medium">{type.name}</h3>
                {type.required && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
                    Requerido
                  </span>
                )}
              </div>
              <p className="text-gray-300 text-sm mt-1">{type.description}</p>
              <div className="flex gap-2 mt-2">
                {type.allowedExtensions.map(ext => (
                  <span
                    key={ext}
                    className="bg-gray-600 text-gray-300 text-xs px-2 py-1 rounded"
                  >
                    {ext}
                  </span>
                ))}
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={selectedTypes.includes(type.id)}
                onChange={() => handleTypeToggle(type.id)}
                aria-label={`Permitir ${type.name} en ${folder.name}`}
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-end gap-4">
        <button
          className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
          onClick={() => setSelectedTypes([])}
          aria-label="Limpiar selección de tipos de documento"
        >
          Limpiar selección
        </button>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          onClick={() => {
            // TODO: Implement save functionality
            console.log('Selected types:', selectedTypes);
          }}
          aria-label="Guardar cambios en tipos de documento permitidos"
        >
          Guardar cambios
        </button>
      </div>
    </div>
  );
} 