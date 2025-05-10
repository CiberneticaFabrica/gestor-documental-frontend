'use client';

import { useState } from 'react';
import {
  Search,
  Filter,
  Download,
  ChevronDown,
  ChevronUp,
  MoreVertical,
  Edit,
  Lock,
  Trash2,
  UserPlus,
} from 'lucide-react';
import Link from 'next/link';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: 'active' | 'inactive' | 'blocked';
  lastLogin: string;
  permissionLevel: number;
  documentsProcessed: number;
  verificationAccuracy: number;
  avatar?: string;
}

const mockUsers: User[] = [
  {
    id: 'USR001',
    name: 'Juan Pérez',
    email: 'juan.perez@example.com',
    role: 'Analista Senior',
    department: 'Operaciones',
    status: 'active',
    lastLogin: '2024-03-15 14:30',
    permissionLevel: 3,
    documentsProcessed: 245,
    verificationAccuracy: 98.5,
    avatar: 'https://ui-avatars.com/api/?name=Juan+Perez',
  },
  {
    id: 'USR002',
    name: 'María García',
    email: 'maria.garcia@example.com',
    role: 'Gestor',
    department: 'Calidad',
    status: 'active',
    lastLogin: '2024-03-15 13:45',
    permissionLevel: 2,
    documentsProcessed: 180,
    verificationAccuracy: 95.2,
    avatar: 'https://ui-avatars.com/api/?name=Maria+Garcia',
  },
  {
    id: 'USR003',
    name: 'Carlos López',
    email: 'carlos.lopez@example.com',
    role: 'Administrador',
    department: 'TI',
    status: 'blocked',
    lastLogin: '2024-03-14 16:20',
    permissionLevel: 4,
    documentsProcessed: 320,
    verificationAccuracy: 99.1,
    avatar: 'https://ui-avatars.com/api/?name=Carlos+Lopez',
  },
];

type SortField = keyof User;
type SortDirection = 'asc' | 'desc';

export function UserTable() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [showFilters, setShowFilters] = useState(false);

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredUsers = mockUsers
    .filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.department.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      const direction = sortDirection === 'asc' ? 1 : -1;

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return direction * aValue.localeCompare(bValue);
      }
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return direction * (aValue - bValue);
      }
      return 0;
    });

  const getStatusColor = (status: User['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-400';
      case 'inactive':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'blocked':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getStatusText = (status: User['status']) => {
    switch (status) {
      case 'active':
        return 'Activo';
      case 'inactive':
        return 'Inactivo';
      case 'blocked':
        return 'Bloqueado';
      default:
        return status;
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Buscar usuarios..."
            className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md flex items-center gap-2 transition-colors"
          >
            <Filter className="h-5 w-5" />
            <span>Filtros</span>
          </button>
          <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md flex items-center gap-2 transition-colors">
            <Download className="h-5 w-5" />
            <span>Exportar</span>
          </button>
          <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md flex items-center gap-2 transition-colors">
            <UserPlus className="h-5 w-5" />
            <span>Nuevo Usuario</span>
          </button>
        </div>
      </div>

      {/* Filtros avanzados */}
      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-gray-700 rounded-lg">
          <select 
            className="bg-gray-600 text-white rounded-md px-3 py-2"
            aria-label="Filtrar por departamento"
          >
            <option value="">Departamento</option>
            <option value="operaciones">Operaciones</option>
            <option value="calidad">Calidad</option>
            <option value="ti">TI</option>
          </select>
          <select 
            className="bg-gray-600 text-white rounded-md px-3 py-2"
            aria-label="Filtrar por rol"
          >
            <option value="">Rol</option>
            <option value="analista">Analista</option>
            <option value="gestor">Gestor</option>
            <option value="admin">Administrador</option>
          </select>
          <select 
            className="bg-gray-600 text-white rounded-md px-3 py-2"
            aria-label="Filtrar por estado"
          >
            <option value="">Estado</option>
            <option value="active">Activo</option>
            <option value="inactive">Inactivo</option>
            <option value="blocked">Bloqueado</option>
          </select>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-gray-400 border-b border-gray-700">
              <th
                className="pb-3 font-medium cursor-pointer"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center gap-2">
                  Usuario
                  {sortField === 'name' && (
                    sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                  )}
                </div>
              </th>
              <th
                className="pb-3 font-medium cursor-pointer"
                onClick={() => handleSort('role')}
              >
                <div className="flex items-center gap-2">
                  Rol
                  {sortField === 'role' && (
                    sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                  )}
                </div>
              </th>
              <th
                className="pb-3 font-medium cursor-pointer"
                onClick={() => handleSort('department')}
              >
                <div className="flex items-center gap-2">
                  Departamento
                  {sortField === 'department' && (
                    sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                  )}
                </div>
              </th>
              <th
                className="pb-3 font-medium cursor-pointer"
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center gap-2">
                  Estado
                  {sortField === 'status' && (
                    sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                  )}
                </div>
              </th>
              <th
                className="pb-3 font-medium cursor-pointer"
                onClick={() => handleSort('lastLogin')}
              >
                <div className="flex items-center gap-2">
                  Último Acceso
                  {sortField === 'lastLogin' && (
                    sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                  )}
                </div>
              </th>
              <th
                className="pb-3 font-medium cursor-pointer"
                onClick={() => handleSort('documentsProcessed')}
              >
                <div className="flex items-center gap-2">
                  Documentos
                  {sortField === 'documentsProcessed' && (
                    sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                  )}
                </div>
              </th>
              <th
                className="pb-3 font-medium cursor-pointer"
                onClick={() => handleSort('verificationAccuracy')}
              >
                <div className="flex items-center gap-2">
                  Precisión
                  {sortField === 'verificationAccuracy' && (
                    sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                  )}
                </div>
              </th>
              <th className="pb-3 font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="text-gray-300">
                <td className="py-4">
                  <div className="flex items-center gap-3">
                    <Link href={`/users/${user.id}`} className="flex items-center gap-3 hover:underline">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="h-8 w-8 rounded-full"
                      />
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-gray-400">{user.email}</div>
                      </div>
                    </Link>
                  </div>
                </td>
                <td className="py-4">
                  <div className="flex flex-col">
                    <span>{user.role}</span>
                    <span className="text-sm text-gray-400">
                      Nivel {user.permissionLevel}
                    </span>
                  </div>
                </td>
                <td className="py-4">{user.department}</td>
                <td className="py-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
                      user.status
                    )}`}
                  >
                    {getStatusText(user.status)}
                  </span>
                </td>
                <td className="py-4">{user.lastLogin}</td>
                <td className="py-4">{user.documentsProcessed}</td>
                <td className="py-4">{user.verificationAccuracy}%</td>
                <td className="py-4">
                  <div className="flex items-center gap-2">
                    <button
                      className="p-1 hover:bg-gray-700 rounded-md transition-colors"
                      title="Editar"
                    >
                      <Edit className="h-4 w-4 text-blue-400" />
                    </button>
                    <button
                      className="p-1 hover:bg-gray-700 rounded-md transition-colors"
                      title="Reiniciar contraseña"
                    >
                      <Lock className="h-4 w-4 text-yellow-400" />
                    </button>
                    <button
                      className="p-1 hover:bg-gray-700 rounded-md transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 className="h-4 w-4 text-red-400" />
                    </button>
                    <button
                      className="p-1 hover:bg-gray-700 rounded-md transition-colors"
                      title="Más opciones"
                    >
                      <MoreVertical className="h-4 w-4 text-gray-400" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 