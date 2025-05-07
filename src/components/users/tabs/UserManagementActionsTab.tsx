'use client';

import { FilePlus, Bell, CalendarCheck, FileText, ShieldCheck, RefreshCcw, AlertTriangle, CheckCircle2, MessageSquare, Send, User, StickyNote, Settings2 } from 'lucide-react';
import { useState } from 'react';

const quickActions = [
  { label: 'Solicitar documento', icon: <FilePlus className="h-4 w-4" />, color: 'blue' },
  { label: 'Enviar recordatorio', icon: <Bell className="h-4 w-4" />, color: 'yellow' },
  { label: 'Programar verificación', icon: <CalendarCheck className="h-4 w-4" />, color: 'green' },
  { label: 'Generar informe documental', icon: <FileText className="h-4 w-4" />, color: 'purple' },
];

const complianceActions = [
  { label: 'Actualizar nivel de riesgo', icon: <ShieldCheck className="h-4 w-4" />, color: 'blue' },
  { label: 'Programar revisión KYC', icon: <RefreshCcw className="h-4 w-4" />, color: 'green' },
  { label: 'Marcar para auditoría especial', icon: <AlertTriangle className="h-4 w-4" />, color: 'red' },
  { label: 'Validación extraordinaria', icon: <CheckCircle2 className="h-4 w-4" />, color: 'yellow' },
];

const communicationTemplates = [
  { id: 1, name: 'Solicitud de documento', content: 'Por favor, adjunte el documento requerido para continuar con el proceso.' },
  { id: 2, name: 'Recordatorio de vencimiento', content: 'Le recordamos que uno de sus documentos está próximo a vencer.' },
  { id: 3, name: 'Notificación de validación', content: 'Su documentación ha sido validada exitosamente.' },
];

const mockMessages = [
  { date: '2024-04-01', to: 'Cliente', subject: 'Recordatorio de vencimiento', status: 'Enviado' },
  { date: '2024-03-28', to: 'Gestor', subject: 'Solicitud de revisión', status: 'Leído' },
  { date: '2024-03-25', to: 'Cliente', subject: 'Solicitud de documento', status: 'Enviado' },
];

const mockNotes = [
  { date: '2024-04-01', author: 'Gestor', note: 'Cliente envió documentación incompleta. Se solicitó corrección.' },
  { date: '2024-03-28', author: 'Auditor', note: 'Caso marcado para revisión especial por inconsistencias.' },
  { date: '2024-03-20', author: 'Gestor', note: 'Documentación validada sin observaciones.' },
];

export function UserManagementActionsTab() {
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const [notes, setNotes] = useState(mockNotes);
  const [newNote, setNewNote] = useState('');

  const handleSendMessage = () => {
    // Aquí iría la lógica real de envío
    setMessage('');
    setSelectedTemplate(null);
    // Notificación visual, etc.
  };

  const handleAddNote = () => {
    if (newNote.trim()) {
      setNotes([{ date: new Date().toISOString().slice(0, 10), author: 'Gestor', note: newNote }, ...notes]);
      setNewNote('');
    }
  };

  return (
    <div className="space-y-8">
      {/* Acciones rápidas */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 shadow">
        <div className="font-semibold text-gray-700 dark:text-gray-200 mb-4 flex items-center gap-2">
          <Settings2 className="h-4 w-4 text-blue-500" /> Acciones rápidas
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action, i) => (
            <button key={i} className={`flex flex-col items-center justify-center p-3 rounded-lg shadow-sm bg-${action.color}-100 dark:bg-${action.color}-900/40 text-${action.color}-700 dark:text-${action.color}-300 font-semibold hover:scale-105 transition-transform`}>
              {action.icon}
              <span className="mt-2 text-xs text-center">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Gestión de cumplimiento */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 shadow">
        <div className="font-semibold text-gray-700 dark:text-gray-200 mb-4 flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-blue-500" /> Gestión de cumplimiento
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {complianceActions.map((action, i) => (
            <button key={i} className={`flex flex-col items-center justify-center p-3 rounded-lg shadow-sm bg-${action.color}-100 dark:bg-${action.color}-900/40 text-${action.color}-700 dark:text-${action.color}-300 font-semibold hover:scale-105 transition-transform`}>
              {action.icon}
              <span className="mt-2 text-xs text-center">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Comunicación */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 shadow space-y-4">
        <div className="font-semibold text-gray-700 dark:text-gray-200 mb-2 flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-blue-500" /> Comunicación
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 space-y-2">
            <label htmlFor="template-select" className="block text-xs font-semibold mb-1">Plantilla</label>
            <select
              id="template-select"
              className="w-full rounded border-gray-300 dark:bg-gray-900 dark:text-gray-200"
              value={selectedTemplate ?? ''}
              onChange={e => {
                const id = Number(e.target.value);
                setSelectedTemplate(id);
                const template = communicationTemplates.find(t => t.id === id);
                setMessage(template ? template.content : '');
              }}
            >
              <option value="">Seleccionar plantilla...</option>
              {communicationTemplates.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
            <textarea
              className="w-full mt-2 rounded border-gray-300 dark:bg-gray-900 dark:text-gray-200"
              rows={3}
              placeholder="Escribe tu mensaje..."
              value={message}
              onChange={e => setMessage(e.target.value)}
            />
            <div className="flex gap-2 mt-2">
              <button className="flex items-center gap-1 px-3 py-1 rounded bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition" onClick={handleSendMessage}>
                <Send className="h-3 w-3" /> Enviar al cliente
              </button>
              <button className="flex items-center gap-1 px-3 py-1 rounded bg-gray-600 text-white text-xs font-semibold hover:bg-gray-700 transition">
                <User className="h-3 w-3" /> Notificar gestor
              </button>
            </div>
          </div>
          <div className="flex-1">
            <div className="font-semibold text-xs mb-2">Registro de comunicaciones</div>
            <div className="space-y-2">
              {mockMessages.map((msg, i) => (
                <div key={i} className="flex items-center gap-2 p-2 rounded bg-white dark:bg-gray-700/50 shadow-sm">
                  <MessageSquare className="h-4 w-4 text-blue-500" />
                  <div className="flex-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold">{msg.subject}</span>
                      <span className="text-gray-400">{msg.date}</span>
                    </div>
                    <div className="text-xs text-gray-500">Para: {msg.to}</div>
                  </div>
                  <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${msg.status === 'Leído' ? 'bg-green-100 text-green-700 dark:bg-green-900/60 dark:text-green-300' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300'}`}>{msg.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Notas internas */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 shadow space-y-4">
        <div className="font-semibold text-gray-700 dark:text-gray-200 mb-2 flex items-center gap-2">
          <StickyNote className="h-4 w-4 text-blue-500" /> Notas internas
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <textarea
              className="w-full rounded border-gray-300 dark:bg-gray-900 dark:text-gray-200"
              rows={2}
              placeholder="Agregar nueva nota..."
              value={newNote}
              onChange={e => setNewNote(e.target.value)}
            />
            <button className="mt-2 px-3 py-1 rounded bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition" onClick={handleAddNote}>
              Agregar nota
            </button>
          </div>
          <div className="flex-1">
            <div className="font-semibold text-xs mb-2">Histórico de notas</div>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {notes.map((note, i) => (
                <div key={i} className="p-2 rounded bg-white dark:bg-gray-700/50 shadow-sm">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-semibold">{note.author}</span>
                    <span className="text-gray-400">{note.date}</span>
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-300">{note.note}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 