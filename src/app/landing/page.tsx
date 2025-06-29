'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Suspense } from 'react';
import { documentService } from '@/lib/api/services/document.service';
import { clientService } from '@/lib/api/services/client.service';
import { User, Clock, FileText, CheckCircle, AlertTriangle, Calendar, Shield, Building, Upload } from 'lucide-react';
import { authService } from '@/lib/api/services/auth.service';

export default function LandingPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <CardTitle>Cargando...</CardTitle>
                        <CardDescription>
                            Preparando su portal de documentos
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>
        }>
            <LandingPageContent />
        </Suspense>
    );
}

function LandingPageContent() {
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [clientData, setClientData] = useState<any>(null);
    const [sessionInfo, setSessionInfo] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    
    const clientId = searchParams.get('client_id');
    const sessionId = searchParams.get('session_id');
    const documentId = searchParams.get('document_id');
    const documentType = searchParams.get('document_type');
    const action = searchParams.get('action');

    // Login automático
    async function performAutoLogin() {
        try {
            const credentials = { username: "admin", password: "marck321" };
            const response = await authService.login(credentials);
            localStorage.setItem('session_token', response.session_token);
            if (response.expires_at) {
                localStorage.setItem('expires_at', response.expires_at);
            }
        } catch (error) {
            toast.error('Error de autenticación automática');
            throw error;
        }
    }

    // Cargar información del cliente y verificar sesión
    useEffect(() => {
        const loadData = async () => {
            if (!clientId || !documentId || !documentType) {
                setError('Faltan parámetros requeridos en la URL');
                return;
            }
            setLoading(true);
            try {
                await performAutoLogin();
                // Cargar información del cliente
                const clientDetail = await clientService.getClientDetail(clientId);
                setClientData(clientDetail.cliente);

                // Verificar sesión (simulado - ajustar según tu lógica de sesiones)
                if (sessionId) {
                    const sessionExpiry = new Date(Date.now() + 30 * 60 * 1000); // 30 minutos
                    setSessionInfo({
                        id: sessionId,
                        expiresAt: sessionExpiry,
                        timeRemaining: Math.floor((sessionExpiry.getTime() - Date.now()) / 1000 / 60)
                    });
                }
            } catch (err) {
                console.error('Error loading data:', err);
                setError('Error al cargar la información del cliente');
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [clientId, documentId, documentType, sessionId]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) {
            toast.error('Por favor seleccione un documento');
            return;
        }

        if (!clientId || !documentId || !documentType) {
            toast.error('Faltan parámetros requeridos');
            return;
        }

        setUploading(true);
        try {
            await performAutoLogin();
            // Usar el servicio de documentos para subir una nueva versión
            const result = await documentService.uploadDocumentVersion({
                id_cliente: clientId,
                parent_document_id: documentId,
                filename: file.name,
                titulo: `${documentType} - Renovación`,
                file: file,
                comentario: `Renovación de ${documentType} - ${action || 'actualización'}`
            });

            setUploadSuccess(true);
            toast.success('¡Documento subido exitosamente!', {
                description: 'Su documento ha sido procesado correctamente.',
            });
        } catch (error) {
            console.error('Error uploading:', error);
            toast.error('Error al subir el documento', {
                description: 'Por favor, intente nuevamente o contacte soporte.',
            });
        } finally {
            setUploading(false);
        }
    };

    const formatTimeRemaining = (minutes: number) => {
        if (minutes <= 0) return 'Sesión expirada';
        if (minutes < 60) return `${minutes} min`;
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}h ${mins}min`;
    };

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center p-4">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <div className="mx-auto mb-4 p-3 bg-red-100 rounded-full">
                            <AlertTriangle className="h-8 w-8 text-red-600" />
                        </div>
                        <CardTitle className="text-red-600">Error</CardTitle>
                        <CardDescription className="text-red-500">
                            {error}
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <CardTitle>Cargando información...</CardTitle>
                        <CardDescription>
                            Preparando su portal de documentos
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>
        );
    }

    if (uploadSuccess) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <div className="mx-auto mb-4 p-3 bg-green-100 rounded-full">
                            <CheckCircle className="h-12 w-12 text-green-600" />
                        </div>
                        <CardTitle className="text-green-600">¡Documento Subido Exitosamente!</CardTitle>
                        <CardDescription className="text-green-600">
                            Gracias por actualizar su documentación. Su documento ha sido procesado y está siendo revisado.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="text-center space-y-4">
                        <div className="bg-white rounded-lg p-4 border border-green-200">
                            <div className="flex items-center justify-center gap-2 mb-2">
                                <FileText className="h-5 w-5 text-green-600" />
                                <span className="font-medium text-green-800">Documento Procesado</span>
                            </div>
                            <p className="text-sm text-green-700">
                                {file?.name}
                            </p>
                        </div>
                        <div className="text-sm text-gray-600">
                            <p>Recibirá una notificación cuando su documento sea aprobado.</p>
                            <p className="mt-2">Puede cerrar esta ventana.</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
            <div className="max-w-4xl mx-auto">
                {/* Header con información del cliente */}
                {clientData && (
                    <Card className="mb-6 border-0 shadow-lg">
                        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                                        <User className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-white">{clientData.nombre_razon_social}</CardTitle>
                                        <CardDescription className="text-blue-100">
                                            Cliente: {clientData.codigo_cliente}
                                        </CardDescription>
                                    </div>
                                </div>
                                {sessionInfo && (
                                    <div className="flex items-center gap-2 text-blue-100">
                                        <Clock className="h-4 w-4" />
                                        <span className="text-sm">
                                            Sesión: {formatTimeRemaining(sessionInfo.timeRemaining)}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="flex items-center gap-3">
                                    <Building className="h-5 w-5 text-gray-400" />
                                    <div>
                                        <p className="text-sm text-gray-600">Segmento</p>
                                        <p className="font-medium">{clientData.segmento_bancario}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Shield className="h-5 w-5 text-gray-400" />
                                    <div>
                                        <p className="text-sm text-gray-600">Nivel de Riesgo</p>
                                        <p className="font-medium capitalize">{clientData.nivel_riesgo}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Calendar className="h-5 w-5 text-gray-400" />
                                    <div>
                                        <p className="text-sm text-gray-600">Estado</p>
                                        <p className="font-medium capitalize">{clientData.estado_documental}</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Formulario de subida */}
                <Card className="border-0 shadow-lg">
                    <CardHeader className="bg-white border-b">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Upload className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                                <CardTitle>Actualización de Documento</CardTitle>
                    <CardDescription>
                                    {documentType} • {action === 'renewal' ? 'Renovación' : 'Actualización'}
                    </CardDescription>
                            </div>
                        </div>
                </CardHeader>
                    <CardContent className="p-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                                <Label htmlFor="document" className="text-base font-medium">
                                    Seleccione su documento
                                </Label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                            <Input
                                id="document"
                                type="file"
                                onChange={handleFileChange}
                                        accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.gif,.bmp,.tiff,.webp"
                                        className="cursor-pointer border-0 bg-transparent"
                                    />
                                    <p className="text-sm text-gray-500 mt-2">
                                        Formatos aceptados: PDF, Word, Excel, PNG, JPG, GIF, BMP, TIFF, WebP
                                    </p>
                                </div>
                                {file && (
                                    <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                                        <FileText className="h-4 w-4 text-blue-600" />
                                        <span className="text-sm font-medium text-blue-800">
                                            {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                        </span>
                                    </div>
                                )}
                        </div>
                            
                        <Button 
                            type="submit" 
                                className="w-full py-3 text-base font-medium"
                                disabled={uploading || !file}
                            >
                                {uploading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Subiendo documento...
                                    </>
                                ) : (
                                    'Subir Documento'
                                )}
                        </Button>
                    </form>
                </CardContent>
            </Card>

                {/* Información adicional */}
                <Card className="mt-6 border-0 shadow-sm bg-blue-50">
                    <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <h4 className="text-sm font-medium text-blue-900">Información Importante</h4>
                                <p className="text-sm text-blue-700 mt-1">
                                    Asegúrese de que el documento sea legible y esté actualizado. 
                                    El procesamiento puede tomar unos minutos.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
