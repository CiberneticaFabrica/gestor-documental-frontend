export interface Client {
    id: string;
    name: string;
    clientType: ClientType;
    identificationNumber: string;
    identificationType: IdentificationType;
    address?: string;
    email?: string;
    phone?: string;
    status: ClientStatus;
    riskLevel: RiskLevel;
    documentCompleteness: number;
    assignedTo?: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export enum ClientType {
    INDIVIDUAL = 'individual',
    COMPANY = 'company',
  }
  
  export enum IdentificationType {
    PASSPORT = 'passport',
    NATIONAL_ID = 'national_id',
    TAX_ID = 'tax_id',
    BUSINESS_REGISTRATION = 'business_registration',
  }
  
  export enum ClientStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    PENDING = 'pending',
    BLOCKED = 'blocked',
  }
  
  export enum RiskLevel {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high',
  }
  
  export interface ClientDocumentRequirement {
    id: string;
    clientId: string;
    documentType: string;
    isRequired: boolean;
    status: RequirementStatus;
    documentId?: string;
    expiryDate?: string;
    notes?: string;
    requestedAt?: string;
    completedAt?: string;
  }
  
  export enum RequirementStatus {
    PENDING = 'pending',
    SUBMITTED = 'submitted',
    APPROVED = 'approved',
    REJECTED = 'rejected',
    EXPIRED = 'expired',
  }
  
  export interface ClientActivity {
    id: string;
    clientId: string;
    activityType: ClientActivityType;
    description: string;
    performedBy: string;
    performedAt: string;
    details?: Record<string, unknown>;
  }
  
  export enum ClientActivityType {
    DOCUMENT_ADDED = 'document_added',
    DOCUMENT_UPDATED = 'document_updated',
    DOCUMENT_EXPIRED = 'document_expired',
    PROFILE_UPDATED = 'profile_updated',
    STATUS_CHANGED = 'status_changed',
    RISK_CHANGED = 'risk_changed',
    NOTE_ADDED = 'note_added',
  }