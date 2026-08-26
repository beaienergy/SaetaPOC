export { DocumentsTable } from './components/DocumentsTable'
export { UploadDocumentModal } from './components/UploadDocumentModal'
export { DocumentDetailModal } from './components/DocumentDetailModal'
export { GapCard } from './components/GapCard'
export { CategoryBadge, DocumentStatusBadge } from './components/DocumentBadges'
export { GapSeverityBadge, GapStatusBadge, GapTypeIcon, GapTypeLabel } from './components/GapBadges'

export { useDocuments, useGaps, useDocumentById, useDocumentsStore } from './store/documentsStore'

export type {
  DdCategory,
  DocumentStatus,
  DocumentVersionEntry,
  KbDocument,
  GapType,
  GapStatus,
  AffectedDocumentRef,
  GapIssue,
} from './types'
