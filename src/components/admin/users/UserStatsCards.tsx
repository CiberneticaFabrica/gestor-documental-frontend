import React from 'react';

interface UserStatsCardsProps {
  total: number;
  activos: number;
  inactivos: number;
  roles: number;
}

const icons = {
  total: (
    <svg className="w-7 h-7 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m9-4a4 4 0 10-8 0 4 4 0 008 0zm6 4v2a2 2 0 01-2 2h-1.5M3 16v2a2 2 0 002 2h1.5" />
    </svg>
  ),
  activos: (
    <svg className="w-7 h-7 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  ),
  inactivos: (
    <svg className="w-7 h-7 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  roles: (
    <svg className="w-7 h-7 text-purple-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m9-4a4 4 0 10-8 0 4 4 0 008 0z" />
    </svg>
  ),
};

export function UserStatsCards({ total, activos, inactivos, roles }: UserStatsCardsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
      <div className="relative group bg-white dark:bg-gray-900 rounded-lg p-4 flex flex-col items-center border-2 border-blue-400 animate-border-move overflow-hidden">
        <div className="flex items-center gap-2">
          {icons.total}
          <span className="text-2xl font-bold text-blue-700 dark:text-blue-300 drop-shadow-lg">{total}</span>
        </div>
        <span className="text-xs mt-1 text-gray-500 dark:text-gray-300">Usuarios totales</span>
      </div>
      <div className="relative group bg-white dark:bg-gray-900 rounded-lg p-4 flex flex-col items-center border-2 border-green-400 animate-border-move overflow-hidden">
        <div className="flex items-center gap-2">
          {icons.activos}
          <span className="text-2xl font-bold text-green-700 dark:text-green-300 drop-shadow-lg">{activos}</span>
        </div>
        <span className="text-xs mt-1 text-gray-500 dark:text-gray-300">Activos</span>
      </div>
      <div className="relative group bg-white dark:bg-gray-900 rounded-lg p-4 flex flex-col items-center border-2 border-red-400 animate-border-move overflow-hidden">
        <div className="flex items-center gap-2">
          {icons.inactivos}
          <span className="text-2xl font-bold text-red-700 dark:text-red-300 drop-shadow-lg">{inactivos}</span>
        </div>
        <span className="text-xs mt-1 text-gray-500 dark:text-gray-300">Inactivos</span>
      </div>
      <div className="relative group bg-white dark:bg-gray-900 rounded-lg p-4 flex flex-col items-center border-2 border-purple-400 animate-border-move overflow-hidden">
        <div className="flex items-center gap-2">
          {icons.roles}
          <span className="text-2xl font-bold text-purple-700 dark:text-purple-300 drop-shadow-lg">{roles}</span>
        </div>
        <span className="text-xs mt-1 text-gray-500 dark:text-gray-300">Roles distintos</span>
      </div>
      <style jsx>{`
        @keyframes border-move {
          0% { box-shadow: 0 0 0 0 rgba(59,130,246,0.3); }
          50% { box-shadow: 0 0 0 4px rgba(59,130,246,0.15); }
          100% { box-shadow: 0 0 0 0 rgba(59,130,246,0.3); }
        }
        .animate-border-move {
          animation: border-move 2s infinite;
        }
      `}</style>
    </div>
  );
} 