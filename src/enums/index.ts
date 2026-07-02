export enum OperationStatus {
  PENDING = 'pending',
  IN_REVIEW = 'in_review',
  IN_CONFERENCE = 'in_conference',
  COMPLETED = 'completed',
  APPROVED = 'approved',
  BLOCKED = 'blocked',
  CANCELLED = 'cancelled',
}

export enum DocumentType {
  INVOICE = 'invoice',
  BL = 'bl',
  CE_MERCANTE = 'ce_mercante',
  DI = 'di',
  DUIMP = 'duimp',
}

export enum ValidationStageEnum {
  DOCUMENTAL = 'documental',
  BL = 'bl',
  CE_MERCANTE = 'ce_mercante',
  NCM = 'ncm',
  BENEFICIOS = 'beneficios',
  TRIBUTACAO = 'tributacao',
}

export enum RegistrationStatusEnum {
  AUTHORIZED = 'authorized',
  NOT_AUTHORIZED = 'not_authorized',
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  BLOCKED = 'blocked',
}

export enum ApprovalStatusEnum {
  AUTHORIZED = 'authorized',
  NOT_AUTHORIZED = 'not_authorized',
  BLOCKED = 'blocked',
  PENDING = 'pending',
}

export enum RiskLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export enum ValidationResultEnum {
  APPROVED = 'approved',
  REJECTED = 'rejected',
  WARNING = 'warning',
  SKIPPED = 'skipped',
  PENDING = 'pending',
}

export enum BlockageLevelEnum {
  LEVEL_1 = 1,
  LEVEL_2 = 2,
}

export enum UserRoleEnum {
  ADMIN = 'admin',
  SUPERVISOR = 'supervisor',
  ANALYST = 'analyst',
  VIEWER = 'viewer',
}

export enum ReportFormatEnum {
  PDF = 'pdf',
  XLSX = 'xlsx',
  CSV = 'csv',
}

export enum SortOrderEnum {
  ASC = 'asc',
  DESC = 'desc',
}
