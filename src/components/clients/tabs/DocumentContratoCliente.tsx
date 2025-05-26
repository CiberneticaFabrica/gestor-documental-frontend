import React, { useState } from 'react';
import { ArrowLeft, CheckCircle, AlertTriangle, Clock, User, FileText, Shield, Calendar, MapPin, Eye, Download, History, Info } from 'lucide-react';

interface DocumentContratoClienteProps {
  documentData: any;
  onBack: () => void;
}

export function DocumentContratoCliente({ documentData, onBack }: DocumentContratoClienteProps) {
  const [showFullText, setShowFullText] = useState(false);
  const { documento, tipo_documento, version_actual, cliente, documento_especializado, analisis_ia, historial_procesamiento, validacion } = documentData;

  const handleApprove = () => {
    console.log('Contrato aprobado');
  };

  const handleReject = () => {
    console.log('Contrato rechazado');
  };

  const getStatusColor = (estado: string) => {
    switch (estado.toLowerCase()) {
      case 'publicado': return 'bg-green-100 text-green-800 border-green-200';
      case 'pendiente': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'rechazado': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRiskColor = (riesgo: string) => {
    switch (riesgo.toLowerCase()) {
      case 'bajo': return 'text-green-600 bg-green-50';
      case 'medio': return 'text-yellow-600 bg-yellow-50';
      case 'alto': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={onBack} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
                <ArrowLeft className="h-5 w-5" />
                Volver
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Revisión de Contrato</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Documento de Contrato • {tipo_documento.nombre}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button onClick={handleReject} className="px-4 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors">
                Rechazar
              </button>
              <button onClick={handleApprove} className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Aprobar Contrato
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
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
                      <p className="text-sm text-gray-600 dark:text-gray-400">Código: {documento.codigo}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(documento.estado)}`}>
                    {documento.estado.toUpperCase()}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Detalles del Contrato</h4>
                      {documento_especializado?.documento_contrato ? (
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="text-gray-600 dark:text-gray-400">Tipo de contrato:</span>
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {documento_especializado.documento_contrato.tipo_contrato}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-600 dark:text-gray-400">Número de contrato:</span>
                            <p className="font-mono font-medium text-gray-900 dark:text-white">
                              {documento_especializado.documento_contrato.numero_contrato}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-600 dark:text-gray-400">Estado:</span>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {documento_especializado.documento_contrato.estado_contrato}
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
                      {documento_especializado?.documento_contrato ? (
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="text-gray-600 dark:text-gray-400">Fecha de firma:</span>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {new Date(documento_especializado.documento_contrato.fecha_firma).toLocaleDateString('es-ES')}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-600 dark:text-gray-400">Fecha de inicio:</span>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {new Date(documento_especializado.documento_contrato.fecha_inicio).toLocaleDateString('es-ES')}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-600 dark:text-gray-400">Fecha de vencimiento:</span>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {new Date(documento_especializado.documento_contrato.fecha_vencimiento).toLocaleDateString('es-ES')}
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
                        parseFloat(validacion.confianza_extraccion) < 0.5 
                          ? 'text-red-600 dark:text-red-400'
                          : parseFloat(validacion.confianza_extraccion) < 0.75
                            ? 'text-yellow-600 dark:text-yellow-400' 
                            : 'text-purple-600 dark:text-purple-400'
                      }`}>
                        {(parseFloat(validacion.confianza_extraccion) * 100).toFixed(0)}%
                      </div>
                      <div className="text-xs text-gray-500">Confianza</div>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900 dark:text-white">Texto Extraído</h4>
                    {analisis_ia?.texto_extraido && (
                      <button onClick={() => setShowFullText(!showFullText)} className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400">
                        {showFullText ? 'Ocultar' : 'Ver completo'}
                      </button>
                    )}
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                    {analisis_ia?.texto_extraido ? (
                      <p className="text-sm font-mono text-gray-700 dark:text-gray-300 leading-relaxed">
                        {showFullText 
                          ? analisis_ia.texto_extraido 
                          : `${analisis_ia.texto_extraido.substring(0, 150)}...`
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
                <button className="w-full px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors">
                  Ver Documento Original
                </button>
                <button className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
                  Descargar Contrato
                </button>
                <button className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
                  Generar Reporte
                </button>
              </div>
            </div>

            {/* Información del cliente */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Cliente</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Nombre:</span>
                  <p className="font-medium text-gray-900 dark:text-white">{cliente.nombre}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Código:</span>
                  <p className="font-mono text-sm text-gray-900 dark:text-white">{cliente.codigo}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Nivel de riesgo:</span>
                  <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ml-2 ${getRiskColor(cliente.nivel_riesgo)}`}>
                    {cliente.nivel_riesgo.toUpperCase()}
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
      </div>
    </div>
  );
} 