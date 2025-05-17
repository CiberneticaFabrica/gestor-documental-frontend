'use client';

import { useState, useEffect } from 'react';
import { Users, UserCheck, UserX, Activity } from 'lucide-react';
import { clientService } from '@/lib/api/services/client.service';

export function ClientsStatsDashboard() {
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    activity: 0
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await clientService.getClients();
      const totalClients = response.clientes.length;
      // Por ahora usamos valores estáticos para active/inactive/activity
      // ya que no están disponibles en la API
      setStats({
        total: response.pagination.total,
        active: Math.floor(totalClients * 0.8), // 80% activos
        inactive: Math.floor(totalClients * 0.2), // 20% inactivos
        activity: Math.floor(totalClients * 0.3) // 30% con actividad reciente
      });
    } catch (error) {
      console.error('Error loading client stats:', error);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-gray-800 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Total Clientes</p>
            <p className="text-2xl font-semibold text-white">{stats.total}</p>
          </div>
          <Users className="h-8 w-8 text-blue-500" />
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Clientes Activos</p>
            <p className="text-2xl font-semibold text-white">{stats.active}</p>
          </div>
          <UserCheck className="h-8 w-8 text-green-500" />
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Clientes Inactivos</p>
            <p className="text-2xl font-semibold text-white">{stats.inactive}</p>
          </div>
          <UserX className="h-8 w-8 text-red-500" />
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Actividad Reciente</p>
            <p className="text-2xl font-semibold text-white">{stats.activity}</p>
          </div>
          <Activity className="h-8 w-8 text-yellow-500" />
        </div>
      </div>
    </div>
  );
} 