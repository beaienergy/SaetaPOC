import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { Files, AlertTriangle, BrainCircuit } from 'lucide-react'
import { SectionShell } from '@/shared/ui'
import { useRoleStore } from '@/shared/stores'
import { ROUTES } from '@/shared/config/routes'

/**
 * Documentación (guion §1.3 + §5.2): sidebar secundario con Documentos, Gaps
 * y contradicciones, y Conocimiento base (esta última solo admin — §5.2.2).
 */
export default function DocumentsSectionLayout() {
  const { t } = useTranslation('nav')
  const { opId = '' } = useParams()
  const role = useRoleStore((s) => s.role)

  return (
    <SectionShell
      title={t('documentsNav.documents')}
      items={[
        {
          key: 'documents',
          label: t('documentsNav.documents'),
          to: ROUTES.operationDocuments(opId),
          icon: <Files size={16} aria-hidden />,
          end: true,
        },
        {
          key: 'gaps',
          label: t('documentsNav.gaps'),
          to: ROUTES.operationDocumentsGaps(opId),
          icon: <AlertTriangle size={16} aria-hidden />,
        },
        ...(role === 'admin'
          ? [
              {
                key: 'knowledge',
                label: t('documentsNav.knowledge'),
                to: ROUTES.operationDocumentsKnowledge(opId),
                icon: <BrainCircuit size={16} aria-hidden />,
              },
            ]
          : []),
      ]}
    />
  )
}
