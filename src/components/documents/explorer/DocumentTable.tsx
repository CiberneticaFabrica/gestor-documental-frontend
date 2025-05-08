import { FileText, Eye, Download, Send, Archive, Clock, CheckCircle, AlertCircle, Tag, ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import React from 'react';

type Document = {
  id: string;
  thumbnail: string;
  type: string;
  typeIcon: string;
  client: string;
  uploadDate: string;
  status: string;
  confidence: number;
  expiry: string;
  processor: string;
  processingTime: number;
  versions: number;
  entities: number;
  validationStatus: 'pending' | 'completed' | 'rejected';
  validator: string;
  qualityScore: number;
  criticalFields: number;
  biometricScore?: number;
  inconsistencies: number;
  documentType?: string;
  amount?: number;
  currency?: string;
  signers?: number;
  signingStatus?: 'pending' | 'completed';
  regulatoryCategory: 'KYC' | 'AML' | 'PBC';
  criticality: 'high' | 'medium' | 'low';
  complianceStatus: 'complete' | 'partial' | 'pending';
  riskLevel: 'high' | 'medium' | 'low';
  lastViewed: string;
  downloads: number;
  lastUpdate: string;
  comments: number;
  pendingActions: number;
  size: number;
  pages: number;
  dpi: number;
  hash: string;
  format: string;
  folderPath: string;
  tags: string[];
  relatedDocs: number;
  workflow: string;
  priority: number;
};

interface DocumentTableProps {
  documents: Document[];
  onSelect: (doc: Document) => void;
}

export function DocumentTable({ documents, onSelect }: DocumentTableProps) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [previewDoc, setPreviewDoc] = useState<Document | null>(null);

  const toggleRow = (docId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(docId)) {
      newExpanded.delete(docId);
    } else {
      newExpanded.add(docId);
    }
    setExpandedRows(newExpanded);
  };

  return (
    <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
      {/* Modal de previsualización */}
      {previewDoc && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg w-3/4 h-3/4 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Previsualización: {previewDoc.type}</h3>
              <button 
                onClick={() => setPreviewDoc(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <div className="flex-1 overflow-auto">
              <img src={previewDoc.thumbnail} alt="preview" className="w-full h-full object-contain" />
            </div>
          </div>
        </div>
      )}

      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-100 dark:bg-gray-900">
          <tr>
            <th className="px-4 py-2 text-xs font-semibold text-gray-700 dark:text-gray-500"></th>
            <th className="px-4 py-2 text-xs font-semibold text-gray-700 dark:text-gray-500">ID</th>
            <th className="px-4 py-2 text-xs font-semibold text-gray-700 dark:text-gray-500">Miniatura</th>
            <th className="px-4 py-2 text-xs font-semibold text-gray-700 dark:text-gray-500">Tipo</th>
            <th className="px-4 py-2 text-xs font-semibold text-gray-700 dark:text-gray-500">Cliente</th>
            <th className="px-4 py-2 text-xs font-semibold text-gray-700 dark:text-gray-500">Estado</th>
            <th className="px-4 py-2 text-xs font-semibold text-gray-700 dark:text-gray-500">Confianza</th>
            <th className="px-4 py-2 text-xs font-semibold text-gray-700 dark:text-gray-500">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {documents.map((doc) => (
            <React.Fragment key={doc.id}>
              <tr key={doc.id} className="hover:bg-blue-50 dark:hover:bg-gray-700 cursor-pointer" onClick={() => onSelect(doc)}>
                <td className="px-4 py-2">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleRow(doc.id);
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    {expandedRows.has(doc.id) ? 
                      <ChevronDown className="h-4 w-4" /> : 
                      <ChevronRight className="h-4 w-4" />
                    }
                  </button>
                </td>
                <td className="px-4 py-2 text-xs font-mono text-gray-900 dark:text-white">{doc.id}</td>
                <td className="px-4 py-2">
                  <img src={doc.thumbnail} alt="thumb" className="h-8 w-8 rounded object-cover" />
                </td>
                <td className="px-4 py-2 flex items-center gap-2 text-gray-900 dark:text-white">
                  <FileText className="h-4 w-4 text-blue-500" />{doc.type}
                </td>
                <td className="px-4 py-2 text-xs text-gray-900 dark:text-white">{doc.client}</td>
                <td className="px-4 py-2">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${
                    doc.validationStatus === 'completed' ? 'bg-green-100 text-green-700' :
                    doc.validationStatus === 'rejected' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {doc.validationStatus === 'completed' ? <CheckCircle className="h-3 w-3 mr-1" /> :
                     doc.validationStatus === 'rejected' ? <AlertCircle className="h-3 w-3 mr-1" /> :
                     <Clock className="h-3 w-3 mr-1" />}
                    {doc.validationStatus}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-2 rounded-full bg-blue-500" style={{ width: `${doc.confidence}%` }} />
                  </div>
                </td>
                <td className="px-4 py-2 flex gap-2">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setPreviewDoc(doc);
                    }}
                    className="text-blue-500 hover:text-blue-700" 
                    title="Previsualizar"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button className="text-blue-500 hover:text-blue-700" title="Ver"><Eye className="h-4 w-4" /></button>
                  <button className="text-green-500 hover:text-green-700" title="Descargar"><Download className="h-4 w-4" /></button>
                  <button className="text-yellow-500 hover:text-yellow-700" title="Enviar"><Send className="h-4 w-4" /></button>
                  <button className="text-gray-500 hover:text-gray-700" title="Archivar"><Archive className="h-4 w-4" /></button>
                </td>
              </tr>
              {expandedRows.has(doc.id) && (
                <tr className="bg-gray-50 dark:bg-gray-800">
                  <td colSpan={8} className="px-4 py-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {/* Procesamiento */}
                      <div className="space-y-2">
                        <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300">Procesamiento</h4>
                        <div className="text-sm text-gray-900 dark:text-gray-100">
                          <p>Procesador: {doc.processor}</p>
                          <p>Tiempo: {doc.processingTime}ms</p>
                          <p>Versiones: {doc.versions}</p>
                          <p>Entidades: {doc.entities}</p>
                        </div>
                      </div>

                      {/* Calidad */}
                      <div className="space-y-2">
                        <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300">Calidad</h4>
                        <div className="text-sm text-gray-900 dark:text-gray-100">
                          <p>Puntuación: {doc.qualityScore}%</p>
                          <p>Campos críticos: {doc.criticalFields}</p>
                          <p>Inconsistencias: {doc.inconsistencies}</p>
                        </div>
                      </div>

                      {/* Cumplimiento */}
                      <div className="space-y-2">
                        <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300">Cumplimiento</h4>
                        <div className="text-sm text-gray-900 dark:text-gray-100">
                          <p>Categoría: {doc.regulatoryCategory}</p>
                          <p>Criticidad: {doc.criticality}</p>
                          <p>Estado: {doc.complianceStatus}</p>
                          <p>Riesgo: {doc.riskLevel}</p>
                        </div>
                      </div>

                      {/* Técnicos */}
                      <div className="space-y-2">
                        <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300">Técnicos</h4>
                        <div className="text-sm text-gray-900 dark:text-gray-100">
                          <p>Tamaño: {doc.size}KB</p>
                          <p>Páginas: {doc.pages}</p>
                          <p>Formato: {doc.format}</p>
                          <p>DPI: {doc.dpi}</p>
                        </div>
                      </div>

                      {/* Contexto */}
                      <div className="space-y-2">
                        <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300">Contexto</h4>
                        <div className="text-sm text-gray-900 dark:text-gray-100">
                          <p>Carpeta: {doc.folderPath}</p>
                          <p>Relacionados: {doc.relatedDocs}</p>
                          <p>Flujo: {doc.workflow}</p>
                          <p>Prioridad: {doc.priority}</p>
                        </div>
                      </div>

                      {/* Etiquetas */}
                      <div className="space-y-2">
                        <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300">Etiquetas</h4>
                        <div className="flex flex-wrap gap-1">
                          {doc.tags?.map((tag, i) => (
                            <span key={i} className="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-gray-100 text-gray-700">
                              <Tag className="h-3 w-3 mr-0.5" />
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
} 