'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function LandingPage() {
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    
    const clientId = searchParams.get('client_id');
    const sessionId = searchParams.get('session_id');
    const documentId = searchParams.get('document_id');
    const documentType = searchParams.get('document_type');
    const action = searchParams.get('action');

    useEffect(() => {
        if (!clientId || !documentId || !documentType) {
            toast.error('Faltan parámetros requeridos en la URL');
        }
    }, [clientId, documentId, documentType]);

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

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('client_id', clientId);
            formData.append('document_id', documentId);
            formData.append('document_type', documentType);
            if (sessionId) formData.append('session_id', sessionId);
            if (action) formData.append('action', action);

            const response = await fetch('/api/documents/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Error al subir el documento');
            }

            toast.success('Documento subido exitosamente');
            setFile(null);
        } catch (error) {
            toast.error('Error al subir el documento');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (!clientId || !documentId || !documentType) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle>Error</CardTitle>
                        <CardDescription>
                            Faltan parámetros requeridos en la URL
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Subir Documento</CardTitle>
                    <CardDescription>
                        Por favor, seleccione el documento que desea subir
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="document">Documento</Label>
                            <Input
                                id="document"
                                type="file"
                                onChange={handleFileChange}
                                accept=".pdf,.doc,.docx,.xls,.xlsx"
                                className="cursor-pointer"
                            />
                        </div>
                        <Button 
                            type="submit" 
                            className="w-full"
                            disabled={loading}
                        >
                            {loading ? 'Subiendo...' : 'Subir Documento'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
