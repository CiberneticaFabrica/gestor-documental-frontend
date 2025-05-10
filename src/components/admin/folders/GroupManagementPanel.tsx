"use client";
import { useState } from 'react';

interface Group {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  createdAt: string;
}

const mockGroups: Group[] = [
  {
    id: '1',
    name: 'Administradores',
    description: 'Grupo con acceso total al sistema',
    memberCount: 5,
    createdAt: '2024-01-01'
  },
  {
    id: '2',
    name: 'Revisores',
    description: 'Grupo para revisión de documentos',
    memberCount: 12,
    createdAt: '2024-01-01'
  },
  {
    id: '3',
    name: 'Usuarios',
    description: 'Grupo de usuarios estándar',
    memberCount: 50,
    createdAt: '2024-01-01'
  }
];

/*
-export function GroupManagementPanel() {
  const [showForm, setShowForm] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredGroups = mockGroups.filter(group =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-white">Gestión de Grupos</h2>
        <div className="flex gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar grupo..."
              className="bg-gray-700 text-white px-4 py-2 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            onClick={() => setShowForm(true)}
          >
            Nuevo Grupo
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredGroups.map(group => (
          <div
            key={group.id}
            className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors cursor-pointer"
            onClick={() => setSelectedGroup(group)}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-medium">{group.name}</h3>
                <p className="text-gray-300 text-sm mt-1">{group.description}</p>
                <div className="flex gap-4 mt-2">
                  <span className="text-gray-400 text-sm">
                    {group.memberCount} miembros
                  </span>
                  <span className="text-gray-400 text-sm">
                    Creado: {new Date(group.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  className="text-gray-400 hover:text-white transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    // TODO: Implement edit functionality
                    console.log('Edit group:', group.id);
                  }}
                  aria-label={`Editar grupo ${group.name}`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  className="text-gray-400 hover:text-white transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    // TODO: Implement delete functionality
                    console.log('Delete group:', group.id);
                  }}
                  aria-label={`Eliminar grupo ${group.name}`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div> 

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-white">Nuevo Grupo</h3>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Cerrar modal"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <p className="text-gray-300">Formulario de grupo en desarrollo...</p>
          </div>
        </div>
      )}
    </div>
  );
} 
  */