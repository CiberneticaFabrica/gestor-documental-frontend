export interface Document {
    id: string;
    title: string;
    description?: string;
    documentType: string;
    clientId?: string;
    folderId?: string;
    status: DocumentStatus;
    tags?: string[];
    metadata: Record<string, unknown>;
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    updatedBy?: string;
    expiryDate?: string;
    confidentiality: ConfidentialityLevel;
    currentVersionId: string;
    versionCount: number;
  }
  
  export enum DocumentStatus {
    DRAFT = 'draft',
    PENDING_REVIEW = 'pending_review',
    APPROVED = 'approved',
    REJECTED = 'rejected',
    EXPIRED = 'expired',
    ARCHIVED = 'archived',
  }
  
  export enum ConfidentialityLevel {
    PUBLIC = 'public',
    INTERNAL = 'internal',
    CONFIDENTIAL = 'confidential',
    RESTRICTED = 'restricted',
  }
  
  export interface DocumentVersion {
    id: string;
    documentId: string;
    versionNumber: number;
    fileName: string;
    fileSize: number;
    fileType: string;
    fileUrl: string;
    createdAt: string;
    createdBy: string;
    comments?: string;
  }
  
  export interface DocumentHistoryEvent {
    id: string;
    documentId: string;
    eventType: DocumentEventType;
    timestamp: string;
    userId: string;
    userName: string;
    details: Record<string, unknown>;
  }
  
  export enum DocumentEventType {
    CREATED = 'created',
    UPDATED = 'updated',
    VERSION_ADDED = 'version_added',
    STATUS_CHANGED = 'status_changed',
    MOVED = 'moved',
    SHARED = 'shared',
    DOWNLOADED = 'downloaded',
    REVIEWED = 'reviewed',
  }
  
  export interface Folder {
    id: string;
    name: string;
    description?: string;
    parentId?: string;
    path: string[];
    documentCount: number;
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    updatedBy?: string;
  }
  
  export interface DocumentSearchParams {
    query?: string;
    documentType?: string[];
    status?: DocumentStatus[];
    confidentiality?: ConfidentialityLevel[];
    clientId?: string;
    folderId?: string;
    createdBy?: string;
    createdDateFrom?: string;
    createdDateTo?: string;
    expiryDateFrom?: string;
    expiryDateTo?: string;
    tags?: string[];
    metadata?: Record<string, unknown>;
    sortBy?: string;
    sortDirection?: 'asc' | 'desc';
    page?: number;
    limit?: number;
  }