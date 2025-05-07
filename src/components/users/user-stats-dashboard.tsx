'use client';

import { useState } from 'react';
import { Users, UserCheck, UserX, Activity } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const activityData = [
  { time: '00:00', users: 4 },
  { time: '04:00', users: 2 },
  { time: '08:00', users: 8 },
  { time: '12:00', users: 12 },
  { time: '16:00', users: 15 },
  { time: '20:00', users: 10 },
];

const roleDistribution = [
  { name: 'Analistas', value: 40 },
  { name: 'Gestores', value: 30 },
  { name: 'Administradores', value: 20 },
  { name: 'Otros', value: 10 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export function UserStatsDashboard() {
  const [timeRange, setTimeRange] = useState('24h');

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Tarjetas de métricas */}
      <div className="bg-gray-800 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Total Usuarios</p>
            <p className="text-2xl font-semibold text-white">150</p>
          </div>
          <Users className="h-8 w-8 text-blue-500" />
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Usuarios Activos</p>
            <p className="text-2xl font-semibold text-white">120</p>
          </div>
          <UserCheck className="h-8 w-8 text-green-500" />
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Usuarios Inactivos</p>
            <p className="text-2xl font-semibold text-white">30</p>
          </div>
          <UserX className="h-8 w-8 text-red-500" />
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Actividad Actual</p>
            <p className="text-2xl font-semibold text-white">45</p>
          </div>
          <Activity className="h-8 w-8 text-yellow-500" />
        </div>
      </div>

      {/* Gráfico de actividad */}
      <div className="col-span-1 md:col-span-2 bg-gray-800 rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-white">Actividad de Usuarios</h3>
          <div className="flex gap-2">
            <button
              onClick={() => setTimeRange('24h')}
              className={`px-3 py-1 rounded-md text-sm ${
                timeRange === '24h'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-700 text-gray-300'
              }`}
            >
              24h
            </button>
            <button
              onClick={() => setTimeRange('7d')}
              className={`px-3 py-1 rounded-md text-sm ${
                timeRange === '7d'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-700 text-gray-300'
              }`}
            >
              7d
            </button>
            <button
              onClick={() => setTimeRange('30d')}
              className={`px-3 py-1 rounded-md text-sm ${
                timeRange === '30d'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-700 text-gray-300'
              }`}
            >
              30d
            </button>
          </div>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={activityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="time" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: 'none',
                  borderRadius: '0.375rem',
                  color: '#F3F4F6',
                }}
              />
              <Line
                type="monotone"
                dataKey="users"
                stroke="#3B82F6"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Distribución de roles */}
      <div className="col-span-1 md:col-span-2 bg-gray-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-white mb-4">Distribución por Roles</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={roleDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {roleDistribution.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: 'none',
                  borderRadius: '0.375rem',
                  color: '#F3F4F6',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
} 