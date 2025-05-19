import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { clientService, ClientRequest } from '@/lib/api/services/client.service';
import { toast } from 'sonner';
import { AlertCircle } from 'lucide-react';

interface NewClientFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function NewClientForm({ isOpen, onClose, onSuccess }: NewClientFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState<ClientRequest>({
    tipo_cliente: 'persona_fisica',
    nombre_razon_social: '',
    documento_identificacion: '',
    datos_contacto: {
      email: '',
      telefono: '',
      direccion: ''
    },
    estado: 'activo',
    segmento: 'Premium',
    segmento_bancario: 'retail',
    nivel_riesgo: 'bajo',
    gestor_principal_id: null,
    gestor_kyc_id: null,
    preferencias_comunicacion: {
      canal_preferido: 'email',
      horario_preferido: 'mañana',
      idioma: 'español'
    },
    metadata_personalizada: {
      profesion: '',
      empresa_laboral: '',
      referido_por: ''
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null); // Reset error message on new submission
    
    try {
      await clientService.createClient(formData);
      toast.success('Cliente creado exitosamente');
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Error creating client:', error);
      // Manejo específico de errores de la API
      if (error?.originalError?.originalError?.response?.data?.error) {
        const errorMessage = error.originalError.originalError.response.data.error;
        setErrorMessage(errorMessage);
        toast.error(errorMessage);
      } else if (error?.response?.data?.message) {
        const errorMessage = error.response.data.message;
        setErrorMessage(errorMessage);
        toast.error(errorMessage);
      } else if (error?.message) {
        setErrorMessage(error.message);
        toast.error(error.message);
      } else {
        const defaultError = 'Error al crear el cliente';
        setErrorMessage(defaultError);
        toast.error(defaultError);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as Record<string, any>),
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Nuevo Cliente</DialogTitle>
          {errorMessage && (
            <div className="mt-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
              <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                <AlertCircle className="h-4 w-4" />
                <p className="text-sm font-medium">{errorMessage}</p>
              </div>
            </div>
          )}
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tipo_cliente">Tipo de Cliente</Label>
              <Select
                value={formData.tipo_cliente}
                onValueChange={(value) => setFormData(prev => ({ ...prev, tipo_cliente: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="persona_fisica">Persona Física</SelectItem>
                  <SelectItem value="empresa">Empresa</SelectItem>
                  <SelectItem value="organismo_publico">Organismo Público</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="nombre_razon_social">Nombre/Razón Social</Label>
              <Input
                id="nombre_razon_social"
                name="nombre_razon_social"
                value={formData.nombre_razon_social}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="documento_identificacion">Documento de Identificación</Label>
              <Input
                id="documento_identificacion"
                name="documento_identificacion"
                value={formData.documento_identificacion}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nivel_riesgo">Nivel de Riesgo</Label>
              <Select
                value={formData.nivel_riesgo}
                onValueChange={(value) => setFormData(prev => ({ ...prev, nivel_riesgo: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione nivel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bajo">Bajo</SelectItem>
                  <SelectItem value="medio">Medio</SelectItem>
                  <SelectItem value="alto">Alto</SelectItem>
                  <SelectItem value="muy_alto">Muy Alto</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="segmento_bancario">Segmento Bancario</Label>
              <Select
                value={formData.segmento_bancario}
                onValueChange={(value) => setFormData(prev => ({ ...prev, segmento_bancario: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione segmento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="retail">Retail</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                  <SelectItem value="privada">Privada</SelectItem>
                  <SelectItem value="empresas">Empresas</SelectItem>
                  <SelectItem value="corporativa">Corporativa</SelectItem>
                  <SelectItem value="institucional">Institucional</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="estado">Estado</Label>
              <Select
                value={formData.estado}
                onValueChange={(value) => setFormData(prev => ({ ...prev, estado: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="activo">Activo</SelectItem>
                  <SelectItem value="inactivo">Inactivo</SelectItem>
                  <SelectItem value="prospecto">Prospecto</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="datos_contacto.email">Email</Label>
              <Input
                id="datos_contacto.email"
                name="datos_contacto.email"
                type="email"
                value={formData.datos_contacto.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="datos_contacto.telefono">Teléfono</Label>
              <Input
                id="datos_contacto.telefono"
                name="datos_contacto.telefono"
                value={formData.datos_contacto.telefono}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-span-3 space-y-2">
              <Label htmlFor="datos_contacto.direccion">Dirección</Label>
              <Input
                id="datos_contacto.direccion"
                name="datos_contacto.direccion"
                value={formData.datos_contacto.direccion}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="preferencias_comunicacion.canal_preferido">Canal de Comunicación</Label>
              <Select
                value={formData.preferencias_comunicacion.canal_preferido}
                onValueChange={(value) => setFormData(prev => ({
                  ...prev,
                  preferencias_comunicacion: { ...prev.preferencias_comunicacion, canal_preferido: value }
                }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione canal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="telefono">Teléfono</SelectItem>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="preferencias_comunicacion.horario_preferido">Horario Preferido</Label>
              <Select
                value={formData.preferencias_comunicacion.horario_preferido}
                onValueChange={(value) => setFormData(prev => ({
                  ...prev,
                  preferencias_comunicacion: { ...prev.preferencias_comunicacion, horario_preferido: value }
                }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione horario" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mañana">Mañana</SelectItem>
                  <SelectItem value="tarde">Tarde</SelectItem>
                  <SelectItem value="noche">Noche</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="preferencias_comunicacion.idioma">Idioma</Label>
              <Select
                value={formData.preferencias_comunicacion.idioma}
                onValueChange={(value) => setFormData(prev => ({
                  ...prev,
                  preferencias_comunicacion: { ...prev.preferencias_comunicacion, idioma: value }
                }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione idioma" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="español">Español</SelectItem>
                  <SelectItem value="ingles">Inglés</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="metadata_personalizada.profesion">Profesión</Label>
              <Input
                id="metadata_personalizada.profesion"
                name="metadata_personalizada.profesion"
                value={formData.metadata_personalizada.profesion}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="metadata_personalizada.empresa_laboral">Empresa Laboral</Label>
              <Input
                id="metadata_personalizada.empresa_laboral"
                name="metadata_personalizada.empresa_laboral"
                value={formData.metadata_personalizada.empresa_laboral}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="metadata_personalizada.referido_por">Referido Por</Label>
              <Input
                id="metadata_personalizada.referido_por"
                name="metadata_personalizada.referido_por"
                value={formData.metadata_personalizada.referido_por}
                onChange={handleChange}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creando...' : 'Crear Cliente'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 