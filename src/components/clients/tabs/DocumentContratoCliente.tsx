import React, { useState } from 'react';
import {
  ArrowLeft,
  Bot,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Eye,
  FileText,
  Info,
  Loader2,
  MessageSquare,
  Send,
  Shield,
  Trash2,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import { fetchDocumentStatus, fetchDocumentContent } from '@/services/common/documentService';
import { agenciaService, type ChatSession, type ChatAutoResponse, type SessionHistoryResponse } from '@/lib/api/services/agencia.service';

interface DocumentContratoClienteProps {
  documentData: any;
  onBack: () => void;
  onRefresh?: () => void;
}

export function DocumentContratoCliente({ documentData: initialDocumentData, onBack, onRefresh }: DocumentContratoClienteProps) {
  const [showFullText, setShowFullText] = useState(false);
  const [documentData, setDocumentData] = useState(initialDocumentData);
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isImageZoomed, setIsImageZoomed] = useState(false);
  
  // Estado para tabs y chat
  const [activeTab, setActiveTab] = useState<'info' | 'chat'>('info');
  const [chatMessages, setChatMessages] = useState<Array<{
    id: string;
    content: string;
    timestamp: string;
    type: 'user' | 'assistant';
    isLoading?: boolean;
    showAuthRetry?: boolean;
  }>>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>('');
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [showDocumentPreview, setShowDocumentPreview] = useState(false);
  
  // Estados para el panel de conversaciones
  const [showConversationsPanel, setShowConversationsPanel] = useState(false);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [isLoadingSessions, setIsLoadingSessions] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState<string>('');
  
  const { documento, tipo_documento, version_actual, cliente, documento_especializado, analisis_ia, historial_procesamiento, validacion } = documentData;

  const handleApprove = async () => {
    try {
      const response = await fetchDocumentStatus(documento.id, 'publicado');
      setDocumentData((prev: typeof initialDocumentData) => ({
        ...prev,
        documento: {
          ...prev.documento,
          estado: 'publicado'
        }
      }));
      toast.success("Documento aprobado", {
        description: `Actualización completada`,
      });
    } catch (error) {
      console.error('Error al aprobar el documento:', error);
      toast.error("Error al aprobar", {
        description: "No se pudo aprobar el documento. Por favor, intente nuevamente.",
      });
    }
  };

  const handleReject = async () => {
    try {
      const response = await fetchDocumentStatus(documento.id, 'rechazado');
      setDocumentData((prev: typeof initialDocumentData) => ({
        ...prev,
        documento: {
          ...prev.documento,
          estado: 'rechazado'
        }
      }));
      toast.error("Documento rechazado", {
        description: `Actualización completada`,
      });
    } catch (error) {
      console.error('Error al rechazar el documento:', error);
      toast.error("Error al rechazar", {
        description: "No se pudo rechazar el documento. Por favor, intente nuevamente.",
      });
    }
  };

  // Función para iniciar una nueva conversación o el estado inicial del chat
  const startNewConversation = () => {
    setSelectedSessionId('');
    setCurrentSessionId('');
    setChatMessages([
      {
        id: 'welcome',
        content: '¡Hola! Soy tu asistente IA para revisar documentos. ¿En qué puedo ayudarte con este contrato?',
        timestamp: new Date().toISOString(),
        type: 'assistant',
      },
    ]);
  };

  const initializeChat = () => {
    // Verificar estado de autenticación
    const sessionToken = localStorage.getItem('session_token');
    const token = localStorage.getItem('token');

    if (!sessionToken && !token) {
      console.error('Usuario no autenticado');
      setChatMessages([
        {
          id: 'auth-error',
          content: 'Debes iniciar sesión para usar el asistente IA. Por favor, inicia sesión y vuelve a intentar.',
          timestamp: new Date().toISOString(),
          type: 'assistant',
          showAuthRetry: true,
        },
      ]);
      return;
    }
    
    // Por defecto, iniciar siempre una nueva conversación la primera vez
    startNewConversation();
  };

  const sendChatMessage = async (message: string) => {
    if (!message.trim() || isChatLoading) return;

    // Verificar autenticación antes de enviar mensaje
    const sessionToken = localStorage.getItem('session_token');
    const token = localStorage.getItem('token');
    
    if (!sessionToken && !token) {
      toast.error('Debes iniciar sesión para usar el asistente IA');
      return;
    }

    const userMessageId = `user-${Date.now()}`;
    const assistantMessageId = `assistant-${Date.now()}`;

    console.log('Enviando mensaje:', { message, currentSessionId, documentId: version_actual.id });

    // Agregar mensaje del usuario
    setChatMessages(prev => [...prev, {
      id: userMessageId,
      content: message,
      timestamp: new Date().toISOString(),
      type: 'user'
    }]);

    // Agregar mensaje de carga del asistente
    setChatMessages(prev => [...prev, {
      id: assistantMessageId,
      content: '',
      timestamp: new Date().toISOString(),
      type: 'assistant',
      isLoading: true
    }]);

    setChatInput('');
    setIsChatLoading(true);

    try {
      let response: ChatAutoResponse;
      
      if (currentSessionId || selectedSessionId) {
        // Continuar sesión existente
        const sessionId = currentSessionId || selectedSessionId;
        console.log('Continuando sesión existente:', sessionId);
        response = await agenciaService.continueChatSession(
          sessionId,
          version_actual.id,
          message
        );
        setCurrentSessionId(sessionId);
      } else {
        // Crear nueva sesión
        console.log('Creando nueva sesión para documento:', version_actual.id);
        const newSessionResponse = await agenciaService.createNewChatSession(
          version_actual.id,
          message
        );
        setCurrentSessionId(newSessionResponse.session_id);
        setSelectedSessionId(newSessionResponse.session_id);
        response = newSessionResponse;
        console.log('Nueva sesión creada:', newSessionResponse.session_id);
      }

      // Actualizar mensaje del asistente
      setChatMessages(prev => prev.map(msg => 
        msg.id === assistantMessageId 
          ? {
              ...msg,
              content: response.response || 'No se recibió respuesta del asistente',
              isLoading: false
            }
          : msg
      ));

    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      
      // Manejar error de sesión inválida
      if (error && typeof error === 'object' && 'error' in error && error.error === 'Invalid session') {
        console.log('Error de sesión inválida, intentando crear nueva sesión');
        // Intentar crear nueva sesión
        try {
          const newSessionResponse = await agenciaService.createNewChatSession(
            version_actual.id,
            message
          );
          setCurrentSessionId(newSessionResponse.session_id);
          console.log('Nueva sesión creada después de error:', newSessionResponse.session_id);
          
          setChatMessages(prev => prev.map(msg => 
            msg.id === assistantMessageId 
              ? {
                  ...msg,
                  content: newSessionResponse.response || 'No se recibió respuesta del asistente',
                  isLoading: false
                }
              : msg
          ));
        } catch (retryError) {
          console.error('Error al crear nueva sesión después de error:', retryError);
          setChatMessages(prev => prev.map(msg => 
            msg.id === assistantMessageId 
              ? {
                  ...msg,
                  content: 'Lo siento, hubo un error al procesar tu mensaje. Por favor, inténtalo de nuevo.',
                  isLoading: false
                }
              : msg
          ));
          toast.error('Error al enviar mensaje');
        }
      } else {
        // Otro tipo de error
        console.error('Error desconocido al enviar mensaje:', error);
        setChatMessages(prev => prev.map(msg => 
          msg.id === assistantMessageId 
            ? {
                ...msg,
                content: 'Lo siento, hubo un error al procesar tu mensaje. Por favor, inténtalo de nuevo.',
                isLoading: false
              }
            : msg
        ));
        
        toast.error('Error al enviar mensaje');
      }
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendChatMessage(chatInput);
  };

  const handleAuthRetry = () => {
    // Limpiar tokens y redirigir al login
    localStorage.removeItem('session_token');
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    window.location.href = '/auth/login';
  };

  // Función para cargar las sesiones de chat
  const loadSessions = async () => {
    try {
      setIsLoadingSessions(true);
      const response = await agenciaService.getChatSessions();
      setSessions(response.sessions);
    } catch (error) {
      console.error('Error al cargar sesiones:', error);
      toast.error('Error al cargar las conversaciones');
    } finally {
      setIsLoadingSessions(false);
    }
  };

  // Función para cargar el historial de una sesión
  const loadSessionHistory = async (sessionId: string) => {
    try {
      setIsChatLoading(true);
      setSelectedSessionId(sessionId);
      setCurrentSessionId(sessionId);
      
      // Cargar historial de la sesión
      const historyResponse = await agenciaService.getSessionHistory(sessionId);
      
      // Convertir el historial a mensajes del chat
      const historyMessages = historyResponse.messages.map((msg: any, index: number) => ({
        id: `history-${index}`,
        content: msg.content,
        timestamp: msg.timestamp,
        type: msg.message_type === 'user' ? 'user' as const : 'assistant' as const
      }));
      
      setChatMessages(historyMessages);
      
    } catch (error) {
      console.error('Error al cargar historial de sesión:', error);
      toast.error('Error al cargar el historial de la conversación');
      setChatMessages([
        {
          id: 'error',
          content: 'Error al cargar el historial de la conversación. Por favor, inténtalo de nuevo.',
          timestamp: new Date().toISOString(),
          type: 'assistant'
        }
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleTabChange = (tab: 'info' | 'chat') => {
    setActiveTab(tab);
    
    if (tab === 'chat') {
      // No abrir el modal de preview, solo cargar los datos si no están cargados
      if (!previewData && !loading) {
        // Cargar preview sin abrir modal
        setLoading(true);
        setError(null);
        fetchDocumentContent(documentData.documento.id)
          .then(data => {
            setPreviewData(data);
          })
          .catch(err => {
            console.error('Error fetching preview:', err);
            setError('Error al cargar la previsualización');
          })
          .finally(() => {
            setLoading(false);
          });
      }
      
      // Cargar sesiones de chat
      loadSessions();
      
      // Inicializar chat solo si no hay mensajes
      if (chatMessages.length === 0) {
        initializeChat();
      }
    } else {
      // Para el tab de info, no necesitamos el preview
      setShowDocumentPreview(false);
    }
  };

  const getStatusColor = (estado: string) => {
    switch (estado?.toLowerCase()) {
      case 'publicado': return 'bg-green-100 text-green-800 border-green-200';
      case 'pendiente': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'rechazado': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRiskColor = (riesgo: string) => {
    switch (riesgo?.toLowerCase()) {
      case 'bajo': return 'text-green-600 bg-green-50';
      case 'medio': return 'text-yellow-600 bg-yellow-50';
      case 'alto': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const handlePreviewClick = async () => {
    if (showPreview) {
      setShowPreview(false);
      return;
    }

    setShowPreview(true);
    setLoading(true);
    setError(null);
    try {
      const data = await fetchDocumentContent(documentData.documento.id);
      setPreviewData(data);
    } catch (err) {
      console.error('Error fetching preview:', err);
      setError('Error al cargar la previsualización');
    } finally {
      setLoading(false);
    }
  };

  const renderPreview = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-red-500">
          <span className="mb-2">{error}</span>
          <span className="text-sm text-gray-500">Por favor, intente más tarde o contacte al administrador</span>
        </div>
      );
    }

    if (!previewData) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-gray-400">
          <span className="mb-2">No se puede previsualizar este documento</span>
          <span className="text-sm">El documento no está disponible en este momento</span>
        </div>
      );
    }

    if (previewData.mime_type.startsWith('image/')) {
      return (
        <div className="h-full flex items-center justify-center p-4">
          <img
            src={previewData.url_documento}
            alt={previewData.nombre_archivo}
            className="max-w-full max-h-full object-contain cursor-zoom-in"
            onClick={() => setIsImageZoomed(true)}
            onError={(e) => {
              console.error('Error loading image:', e);
              setError('Error al cargar la imagen');
            }}
          />
        </div>
      );
    }

    if (previewData && previewData.mime_type === 'application/pdf' && previewData.url_documento) {
      return (
        <div className="h-full">
        <iframe
          src={`https://docs.google.com/gview?url=${encodeURIComponent(previewData.url_documento)}&embedded=true`}
          style={{ width: '100%', height: '100%' }}
          frameBorder="0"
          title="Vista previa PDF"
        />
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400 p-4">
        <span className="mb-2">Formato no soportado para previsualización</span>
        <a
          href={previewData.url_documento}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:text-blue-600"
          download={previewData.nombre_archivo}
        >
          Descargar archivo
        </a>
      </div>
    );
  };

  const renderChat = () => {
    return (
      <div className="flex flex-col h-full">
        {/* Header del chat */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Bot className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Asistente IA</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedSessionId 
                    ? `Sesión activa: ${sessions.find(s => s.session_id === selectedSessionId)?.file_name || 'Documento'}`
                    : currentSessionId 
                      ? 'Sesión activa' 
                      : 'Iniciando sesión...'
                  }
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowConversationsPanel(!showConversationsPanel)}
                className="p-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 bg-white/50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600/50 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                title={showConversationsPanel ? "Ocultar conversaciones" : "Mostrar conversaciones"}
              >
                <MessageSquare className="h-5 w-5" />
              </button>
              
              {selectedSessionId && (
                <button
                  onClick={handleDeleteSession}
                  className="p-2 text-red-600 hover:text-red-800 bg-white/50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600/50 hover:bg-red-50 dark:hover:bg-gray-600 transition-colors"
                  title="Eliminar conversación"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mensajes del chat */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {isChatLoading && chatMessages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="flex items-center gap-3 text-gray-500">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Conectando con el asistente IA...</span>
              </div>
            </div>
          ) : (
            chatMessages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-3 ${
                    message.type === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                  }`}
                >
                  {message.isLoading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>El asistente está escribiendo...</span>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      {message.showAuthRetry && (
                        <button
                          onClick={handleAuthRetry}
                          className="mt-2 px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                        >
                          Iniciar Sesión
                        </button>
                      )}
                      <p className="text-xs opacity-70 mt-1">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Input del chat */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-4">
          <form onSubmit={handleChatSubmit} className="flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Escribe tu pregunta sobre el contrato..."
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              disabled={isChatLoading}
            />
            <button
              type="submit"
              disabled={!chatInput.trim() || isChatLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              title="Enviar mensaje"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    );
  };

  const handleBack = () => {
    if (onRefresh) {
      onRefresh();
    }
    onBack();
  };

  const handleDeleteSession = async () => {
    if (!selectedSessionId) {
      toast.error('Ninguna conversación seleccionada para eliminar.');
      return;
    }

    if (window.confirm('¿Estás seguro de que quieres eliminar esta conversación? Esta acción no se puede deshacer.')) {
      try {
        setIsLoadingSessions(true);
        await agenciaService.deleteChatSession(selectedSessionId);
        toast.success('Conversación eliminada con éxito');

        setSessions(prev => prev.filter(s => s.session_id !== selectedSessionId));
        startNewConversation();
      } catch (error) {
        console.error('Error al eliminar la conversación:', error);
        toast.error('No se pudo eliminar la conversación.');
      } finally {
        setIsLoadingSessions(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Panel de conversaciones */}
      {showConversationsPanel && (
        <div className="fixed left-0 top-0 h-full w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-xl z-50">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Conversaciones</h3>
              <button
                onClick={() => setShowConversationsPanel(false)}
                className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                title="Cerrar panel"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <button
              onClick={startNewConversation}
              className="w-full px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-900/30 transition-colors"
            >
              Nueva conversación
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4">
            {isLoadingSessions ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
              </div>
            ) : sessions.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">No hay conversaciones previas</p>
              </div>
            ) : (
              <div className="space-y-2">
                {sessions.map((session) => (
                  <div
                    key={session.session_id}
                    onClick={() => loadSessionHistory(session.session_id)}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedSessionId === session.session_id
                        ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800'
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {session.file_name}
                      </h4>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {session.total_messages} msgs
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                        {session.last_message.content}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>{new Date(session.created_at).toLocaleDateString()}</span>
                      <span>{session.duration_minutes}m</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Panel lateral derecho fijo para la imagen */}
      {showPreview && (
        <>
          <div className="fixed right-0 top-0 h-full w-[550px] bg-white dark:bg-gray-800 shadow-lg border-l border-gray-200 dark:border-gray-700 z-40">
            <div className="absolute top-4 left-4 z-10">
              <button
                onClick={() => setShowPreview(false)}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 bg-white dark:bg-gray-800 rounded-full shadow-sm hover:shadow-md transition-all"
                title="Cerrar vista previa"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="h-full overflow-y-auto p-6">
              {renderPreview()}
            </div>
            <div className="absolute bottom-4 right-4 z-10">
              <button
                onClick={() => window.open(`https://docs.google.com/gview?url=${encodeURIComponent(previewData.url_documento)}&embedded=true`, '_blank')}
                className="p-2 ml-2 text-blue-600 hover:text-blue-800 bg-white dark:bg-gray-800 rounded-full shadow-sm hover:shadow-md transition-all"
                title="Ver en pantalla completa"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V6a2 2 0 012-2h2M16 4h2a2 2 0 012 2v2M20 16v2a2 2 0 01-2 2h-2M8 20H6a2 2 0 01-2-2v-2" />
                </svg>
              </button>
            </div>
          </div>
          {isImageZoomed && previewData && previewData.mime_type.startsWith('image/') && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
              onClick={() => setIsImageZoomed(false)}
            >
              <div className="relative" onClick={e => e.stopPropagation()}>
                <button
                  onClick={() => setIsImageZoomed(false)}
                  className="absolute top-2 right-2 p-2 bg-white bg-opacity-80 rounded-full shadow hover:bg-opacity-100 transition"
                  title="Cerrar imagen ampliada"
                >
                  <X className="h-6 w-6 text-gray-700" />
                </button>
                <img
                  src={previewData.url_documento}
                  alt={previewData.nombre_archivo}
                  className="max-w-3xl max-h-[80vh] rounded shadow-lg"
                />
              </div>
            </div>
          )}
        </>
      )}

      {/* Contenido principal con margen derecho cuando el preview está activo */}
      <div className={`${showPreview ? 'mr-[450px]' : ''} transition-all duration-300`}>
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button onClick={handleBack} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
                  <ArrowLeft className="h-5 w-5" />
                  Volver
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Revisión de Contrato</h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Documento de Contrato • {tipo_documento?.nombre || 'Sin tipo'}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {(documento.estado === 'pendiente_revision' || documento.estado === 'rechazado') && (
                  <button onClick={handleApprove} className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Aprobar Contrato
                  </button>
                )}
                {(documento.estado === 'pendiente_revision' || documento.estado === 'publicado') && (
                  <button onClick={handleReject} className="px-4 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors">
                    Rechazar
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Tabs */}
          <div className="mb-8">
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => handleTabChange('info')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                    activeTab === 'info'
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <FileText className="h-4 w-4" />
                  Información del Contrato
                </button>
                <button
                  onClick={() => handleTabChange('chat')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                    activeTab === 'chat'
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <MessageSquare className="h-4 w-4" />
                  Consulta Agente IA
                </button>
              </nav>
            </div>
          </div>

          {/* Contenido de los tabs */}
          {activeTab === 'info' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Columna principal */}
            <div className="lg:col-span-2 space-y-8">
              {/* Información del contrato */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                        <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Información del Contrato</h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Código: {documento?.codigo || 'Sin código'}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(documento?.estado)}`}>
                      {documento?.estado?.toUpperCase() || 'SIN ESTADO'}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">Detalles del Contrato</h4>
                        {analisis_ia?.entidades_detectadas ? (
                          <div className="space-y-2 text-sm">
                            <div>
                              <span className="text-gray-600 dark:text-gray-400">Número de contrato:</span>
                              <p className="font-mono font-medium text-gray-900 dark:text-white">
                                {analisis_ia.entidades_detectadas.numero_contrato?.answer || 'No disponible'}
                              </p>
                            </div>
                            <div>
                              <span className="text-gray-600 dark:text-gray-400">Monto del préstamo:</span>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {analisis_ia.entidades_detectadas.monto_prestamo?.answer || 'No disponible'}
                              </p>
                            </div>
                            <div>
                              <span className="text-gray-600 dark:text-gray-400">Tasa de interés:</span>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {analisis_ia.entidades_detectadas.tasa_interes?.answer || 'No disponible'}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            No hay información detallada del contrato disponible.
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">Fechas Importantes</h4>
                        {analisis_ia?.entidades_detectadas ? (
                          <div className="space-y-2 text-sm">
                            <div>
                              <span className="text-gray-600 dark:text-gray-400">Fecha del contrato:</span>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {analisis_ia.entidades_detectadas.fecha_contrato?.answer || 'No disponible'}
                              </p>
                            </div>
                            <div>
                              <span className="text-gray-600 dark:text-gray-400">Plazo del préstamo:</span>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {analisis_ia.entidades_detectadas.plazo_meses?.answer || 'No disponible'} meses
                              </p>
                            </div>
                            <div>
                              <span className="text-gray-600 dark:text-gray-400">Cuota mensual:</span>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {analisis_ia.entidades_detectadas.cuota_mensual?.answer || 'No disponible'}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            No hay fechas importantes registradas para este contrato.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Análisis de IA */}
              {analisis_ia && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                          <Shield className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Análisis por IA</h2>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Procesamiento automático</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${
                          parseFloat(validacion?.confianza_extraccion || '0') < 0.5 
                            ? 'text-red-600 dark:text-red-400'
                            : parseFloat(validacion?.confianza_extraccion || '0') < 0.75
                              ? 'text-yellow-600 dark:text-yellow-400' 
                              : 'text-purple-600 dark:text-purple-400'
                        }`}>
                          {(parseFloat(validacion?.confianza_extraccion || '0') * 100).toFixed(0)}%
                        </div>
                        <div className="text-xs text-gray-500">Confianza</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900 dark:text-white">Texto Extraído</h4>
                      {analisis_ia?.texto_extraido_preview && (
                        <button onClick={() => setShowFullText(!showFullText)} className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400">
                          {showFullText ? 'Ocultar' : 'Ver completo'}
                        </button>
                      )}
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                      {analisis_ia?.texto_extraido_preview ? (
                        <p className="text-sm font-mono text-gray-700 dark:text-gray-300 leading-relaxed">
                          {showFullText 
                            ? analisis_ia.texto_extraido_full 
                            : analisis_ia.texto_extraido_preview
                          }
                        </p>
                      ) : (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          No hay texto extraído disponible para este documento.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Panel lateral */}
            <div className="space-y-6">
              {/* Acciones rápidas */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Acciones Rápidas</h3>
                <div className="space-y-3">
                  <button 
                    onClick={handlePreviewClick}
                    className={`w-full px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2 ${
                      showPreview 
                        ? 'text-red-700 bg-red-50 border border-red-200 hover:bg-red-100' 
                        : 'text-blue-700 bg-blue-50 border border-blue-200 hover:bg-blue-100'
                    }`}
                    title={showPreview ? "Ocultar imagen del documento" : "Ver imagen del documento"}
                  >
                    <Eye className="h-4 w-4" />
                    {showPreview ? 'Ocultar Imagen' : 'Ver Imagen Original'}
                  </button>
                  </div>
              </div>

              {/* Información del cliente */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Cliente</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Nombre:</span>
                    <p className="font-medium text-gray-900 dark:text-white">{cliente?.nombre || 'No disponible'}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Código:</span>
                    <p className="font-mono text-sm text-gray-900 dark:text-white">{cliente?.codigo || 'No disponible'}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Nivel de riesgo:</span>
                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ml-2 ${getRiskColor(cliente?.nivel_riesgo)}`}>
                      {cliente?.nivel_riesgo?.toUpperCase() || 'NO DISPONIBLE'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Nota importante */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-blue-900 dark:text-blue-200">Nota Importante</h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                      Revise cuidadosamente todos los términos y condiciones del contrato antes de aprobar. Una vez aprobado, este documento será vinculante para ambas partes.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          )}

          {/* Tab de Chat con IA */}
          {activeTab === 'chat' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-300px)]">
              {/* Panel de chat */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                {renderChat()}
              </div>

              {/* Panel de documento */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                      <FileText className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Documento</h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {documento?.nombre_archivo || 'Vista previa del documento'}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="h-full overflow-hidden">
                  {renderPreview()}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 