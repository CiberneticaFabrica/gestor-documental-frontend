"use client";
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { 
  User, 
  FileText, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Upload,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Building,
  Trash2
} from 'lucide-react';
import { clientService, Client, ClientRequest } from '@/lib/api/services/client.service';
import { documentService } from '@/lib/api/services/document.service';
import { expireDocumentService } from '@/lib/api/services/expiredocument.service';
import { authService } from '@/lib/api/services/auth.service';

interface RequestParams {
  action: string;
  request_type: string;
  client_id: string;
  session_id: string;
  plazo_entrega: string;
}

interface FormData {
  nombre_razon_social: string;
  email: string;
  telefono: string;
  direccion: string;
  profesion: string;
  empresa_laboral: string;
}

interface UploadedFile {
  file: File;
  id?: string;
  status: 'pending' | 'uploading' | 'success' | 'error';
  progress?: number;
  error?: string;
}

const steps = [
  { id: 1, title: 'Verificación de Sesión', icon: CheckCircle, description: 'Validar acceso seguro' },
  { id: 2, title: 'Información Personal', icon: User, description: 'Actualizar datos básicos' },
  { id: 3, title: 'Documentos Requeridos', icon: FileText, description: 'Subir documentos necesarios' },
  { id: 4, title: 'Confirmación', icon: CheckCircle, description: 'Revisar y enviar' }
];

const requiredDocuments = [
  { id: 'identificacion', name: 'Documento de identidad', required: true },
  { id: 'domicilio', name: 'Comprobante de domicilio', required: true },
  { id: 'ingresos', name: 'Comprobante de ingresos', required: false },
  { id: 'otros', name: 'Otros documentos', required: false }
];

// Componente separado para manejar los parámetros de búsqueda
function SearchParamsHandler({ onParamsReady }: { onParamsReady: (params: RequestParams) => void }) {
  const searchParams = useSearchParams();
  
  useEffect(() => {
    const params: RequestParams = {
      action: searchParams.get('action') || '',
      request_type: decodeURIComponent(searchParams.get('request_type') || ''),
      client_id: searchParams.get('client_id') || '',
      session_id: searchParams.get('session_id') || '',
      plazo_entrega: decodeURIComponent(searchParams.get('plazo_entrega') || '')
    };
    
    onParamsReady(params);
  }, [searchParams, onParamsReady]);
  
  return null;
}

function InformationRequestPageContent() {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [clientInfo, setClientInfo] = useState<Client | null>(null);
  const [requestParams, setRequestParams] = useState<RequestParams | null>(null);
  const [formData, setFormData] = useState<FormData>({
    nombre_razon_social: '',
    email: '',
    telefono: '',
    direccion: '',
    profesion: '',
    empresa_laboral: ''
  });
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // Función para hacer login automático
  const performAutoLogin = async () => {
    try {
      const credentials = {
        username: "admin",
        password: "marck321"
      };
      
      const response = await authService.login(credentials);
      
      // Guardar el token en localStorage para que las llamadas a la API lo usen
      localStorage.setItem('session_token', response.session_token);
      if (response.expires_at) {
        localStorage.setItem('expires_at', response.expires_at);
      }
      
      return response.session_token;
    } catch (error: any) {
      console.error('Error en auto login:', error);
      throw new Error('Error al autenticar: ' + (error.message || 'Credenciales inválidas'));
    }
  };

  // Manejar parámetros cuando estén listos
  const handleParamsReady = (params: RequestParams) => {
    setRequestParams(params);
    
    // Validar parámetros requeridos
    if (!params.client_id || !params.session_id) {
      setError('Enlace inválido. Faltan parámetros requeridos.');
      setLoading(false);
      return;
    }

    // Cargar información real del cliente
    loadClientData(params.client_id, params.session_id);
  };

  const loadClientData = async (clientId: string, sessionId: string) => {
    try {
      setLoading(true);
      
      // Hacer login automático para obtener token válido
      await performAutoLogin();
      
      // Ahora usar los servicios normales con el token obtenido
      const clientDetail = await clientService.getClientDetail(clientId);
      const client = clientDetail.cliente;
      
      setClientInfo(client);
      
      // Prellenar formulario con datos existentes
      setFormData({
        nombre_razon_social: client.nombre_razon_social,
        email: client.datos_contacto.email,
        telefono: client.datos_contacto.telefono,
        direccion: client.datos_contacto.direccion,
        profesion: client.metadata_personalizada.profesion,
        empresa_laboral: client.metadata_personalizada.empresa_laboral
      });
      
    } catch (err: any) {
      console.error('Error loading client data:', err);
      setError(err.message || 'Error al cargar la información del cliente');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFormChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;
    
    const newFiles: UploadedFile[] = Array.from(files).map(file => ({
      file,
      status: 'pending'
    }));
    
    setUploadedFiles(prev => [...prev, ...newFiles]);
  };

  // Función para manejar drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files);
    }
  };

  // Función para abrir el selector de archivos
  const openFileSelector = () => {
    const input = document.getElementById('file-upload') as HTMLInputElement;
    if (input) {
      input.click();
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Función para subir un documento individual (para testing)
  const uploadSingleFile = async (index: number) => {
    const fileData = uploadedFiles[index];
    if (!fileData || fileData.status !== 'pending') {
      toast.error('Archivo no disponible para subir');
      return;
    }

    try {
      await uploadFile(fileData, index);
      toast.success(`Archivo ${fileData.file.name} subido correctamente`);
    } catch (error: any) {
      toast.error(`Error al subir ${fileData.file.name}: ${error.message}`);
    }
  };

  const uploadFile = async (fileData: UploadedFile, originalIndex: number): Promise<string> => {
    if (!clientInfo?.id_cliente) {
      throw new Error('Cliente no encontrado');
    }
    
    console.log('Iniciando subida de archivo:', fileData.file.name);
    
    // Actualizar estado a uploading usando el índice original
    setUploadedFiles(prev => prev.map((f, i) => 
      i === originalIndex ? { ...f, status: 'uploading', progress: 0 } : f
    ));

    try {
      console.log('Llamando a documentService.uploadDocument con:', {
        id_cliente: clientInfo.id_cliente,
        filename: fileData.file.name,
        titulo: `Documento - ${fileData.file.name}`,
        file: fileData.file
      });

      const result = await documentService.uploadDocument({
        id_cliente: clientInfo.id_cliente,
        filename: fileData.file.name,
        titulo: `Documento - ${fileData.file.name}`,
        file: fileData.file
      });

      console.log('Resultado de subida:', result);

      // Actualizar estado a success usando el índice original
      setUploadedFiles(prev => prev.map((f, i) => 
        i === originalIndex ? { ...f, status: 'success', id: result.id_documento } : f
      ));

      return result.id_documento;
    } catch (error: any) {
      console.error('Error en uploadFile:', error);
      
      // Actualizar estado a error usando el índice original
      setUploadedFiles(prev => prev.map((f, i) => 
        i === originalIndex ? { ...f, status: 'error', error: error.message } : f
      ));
      throw error;
    }
  };

  const handleSubmit = async () => {
    if (!clientInfo?.id_cliente) {
      toast.error('Error: Cliente no encontrado');
      return;
    }

    setSubmitting(true);
    
    try {
      console.log('Iniciando proceso de envío...');
      
      // Paso 1: Actualizar información del cliente
      const updateData: Partial<ClientRequest> = {
        nombre_razon_social: formData.nombre_razon_social,
        datos_contacto: {
          email: formData.email,
          telefono: formData.telefono,
          direccion: formData.direccion,
        },
        metadata_personalizada: {
          profesion: formData.profesion,
          empresa_laboral: formData.empresa_laboral,
          referido_por: clientInfo.metadata_personalizada.referido_por
        }
      };

      console.log('Actualizando información del cliente...');
      await clientService.updateClient(clientInfo.id_cliente, updateData);
      toast.success('Información del cliente actualizada');

      // Paso 2: Subir documentos
      const pendingFiles = uploadedFiles.filter(f => f.status === 'pending');
      console.log('Archivos pendientes de subir:', pendingFiles.length);
      
      if (pendingFiles.length > 0) {
        // Crear un mapa de archivos pendientes con sus índices originales
        const uploadPromises = pendingFiles.map((fileData) => {
          const originalIndex = uploadedFiles.findIndex(f => f === fileData);
          console.log(`Subiendo archivo ${fileData.file.name} con índice original ${originalIndex}`);
          return uploadFile(fileData, originalIndex);
        });

        await Promise.all(uploadPromises);
        toast.success('Documentos subidos correctamente');
      }

      // Paso 3: Notificar completado
      console.log('Enviando notificación de completado...');
      await expireDocumentService.sendInformationRequest(clientInfo.id_cliente);
      toast.success('Solicitud completada exitosamente');

      setCurrentStep(4);
    } catch (error: any) {
      console.error('Error submitting:', error);
      toast.error(error.message || 'Error al procesar la solicitud');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Verificando acceso...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Error de Acceso</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Intentar Nuevamente
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Actualización de Información
          </h1>
          <p className="text-gray-600">
            {requestParams?.request_type} - Plazo: {requestParams?.plazo_entrega}
          </p>
        </div>

        {/* Progress Bar */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    currentStep >= step.id 
                      ? 'bg-blue-600 border-blue-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-400'
                  }`}>
                    {currentStep > step.id ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <step.icon className="w-5 h-5" />
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-16 h-0.5 mx-2 ${
                      currentStep > step.id ? 'bg-blue-600' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <Progress value={(currentStep / steps.length) * 100} className="w-full" />
          </CardContent>
        </Card>

        {/* Step Content */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {(() => { const Icon = steps[currentStep - 1].icon; return <Icon className="w-5 h-5" />; })()}
              {steps[currentStep - 1].title}
            </CardTitle>
            <p className="text-gray-600">{steps[currentStep - 1].description}</p>
          </CardHeader>
          <CardContent>
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-green-800">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">Sesión Verificada</span>
                  </div>
                  <p className="text-green-700 mt-2">
                    Acceso autorizado para: <strong>{clientInfo?.nombre_razon_social}</strong>
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span>{clientInfo?.datos_contacto.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{clientInfo?.datos_contacto.telefono}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{clientInfo?.datos_contacto.direccion}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>Cliente desde: {clientInfo?.fecha_alta}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    {clientInfo?.tipo_cliente === 'persona_juridica' ? 
                      <Building className="w-4 h-4" /> : 
                      <User className="w-4 h-4" />
                    }
                    <span>Tipo: {clientInfo?.tipo_cliente.replace('_', ' ')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>Nivel de riesgo: </span>
                    <Badge variant={clientInfo?.nivel_riesgo === 'alto' ? 'destructive' : clientInfo?.nivel_riesgo === 'medio' ? 'secondary' : 'default'}>
                      {clientInfo?.nivel_riesgo}
                    </Badge>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                <p className="text-gray-600 mb-4">
                  Por favor, actualice la siguiente información si ha cambiado:
                </p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre Completo
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.nombre_razon_social}
                      onChange={(e) => handleFormChange('nombre_razon_social', e.target.value)}
                      placeholder="Nombre Completo"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.email}
                      onChange={(e) => handleFormChange('email', e.target.value)}
                      placeholder="Correo electrónico"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.telefono}
                      onChange={(e) => handleFormChange('telefono', e.target.value)}
                      placeholder="Teléfono"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Dirección
                    </label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                      value={formData.direccion}
                      onChange={(e) => handleFormChange('direccion', e.target.value)}
                      placeholder="Dirección"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Profesión
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.profesion}
                      onChange={(e) => handleFormChange('profesion', e.target.value)}
                      placeholder="Profesión u ocupación"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Empresa Laboral
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.empresa_laboral}
                      onChange={(e) => handleFormChange('empresa_laboral', e.target.value)}
                      placeholder="Empresa donde trabaja"
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-4">
                <p className="text-gray-600 mb-4">
                  Suba los documentos requeridos para completar su actualización:
                </p>
                
                {/* Dropzone */}
                <div 
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={openFileSelector}
                >
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 mb-2">Arrastre documentos aquí o haga clic para seleccionar</p>
                  <p className="text-sm text-gray-500 mb-4">PDF, JPG, PNG hasta 10MB</p>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileUpload(e.target.files)}
                    className="hidden"
                    id="file-upload"
                    aria-label="Seleccionar archivos para subir"
                  />
                  <Button 
                    variant="outline" 
                    className="bg-blue-50 hover:bg-blue-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      openFileSelector();
                    }}
                  >
                    Seleccionar Archivos
                  </Button>
                </div>

                {/* Documentos requeridos */}
                <div className="space-y-2">
                  {requiredDocuments.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">{doc.name}</span>
                      </div>
                      <Badge variant={doc.required ? "outline" : "secondary"}>
                        {doc.required ? 'Requerido' : 'Opcional'}
                      </Badge>
                    </div>
                  ))}
                </div>

                {/* Archivos subidos */}
                {uploadedFiles.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900">Archivos seleccionados:</h4>
                    {uploadedFiles.map((fileData, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2 flex-1">
                          <FileText className="w-4 h-4 text-gray-400" />
                          <div className="flex-1">
                            <span className="text-sm font-medium">{fileData.file.name}</span>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <span>{(fileData.file.size / 1024 / 1024).toFixed(2)} MB</span>
                              {fileData.error && (
                                <span className="text-red-500">Error: {fileData.error}</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {fileData.status === 'pending' && (
                            <>
                              <Badge variant="outline">Pendiente</Badge>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => uploadSingleFile(index)}
                                className="text-blue-600 hover:text-blue-700"
                              >
                                <Upload className="w-3 h-3" />
                              </Button>
                            </>
                          )}
                          {fileData.status === 'uploading' && (
                            <>
                              <Badge variant="secondary">Subiendo...</Badge>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                            </>
                          )}
                          {fileData.status === 'success' && (
                            <Badge variant="default" className="bg-green-100 text-green-800">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Subido
                            </Badge>
                          )}
                          {fileData.status === 'error' && (
                            <>
                              <Badge variant="destructive">Error</Badge>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => uploadSingleFile(index)}
                                className="text-blue-600 hover:text-blue-700"
                              >
                                <Upload className="w-3 h-3" />
                              </Button>
                            </>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {currentStep === 4 && (
              <div className="text-center space-y-4">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                <h3 className="text-xl font-semibold text-gray-900">
                  ¡Información Actualizada!
                </h3>
                <p className="text-gray-600">
                  Su información ha sido enviada exitosamente. Recibirá una confirmación por email.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800 text-sm">
                    <strong>Próximo paso:</strong> Nuestro equipo revisará su información y se pondrá en contacto si es necesario.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        {currentStep < 4 && (
          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Anterior
            </Button>
            <Button
              onClick={currentStep === 3 ? handleSubmit : handleNext}
              disabled={submitting}
              className="flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Procesando...
                </>
              ) : (
                <>
                  {currentStep === 3 ? 'Enviar Información' : 'Siguiente'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function InformationRequestPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando...</p>
          </CardContent>
        </Card>
      </div>
    }>
      <SearchParamsHandler onParamsReady={(params) => {
        // Este callback se ejecutará cuando los parámetros estén listos
      }} />
      <InformationRequestPageContent />
    </Suspense>
  );
} 