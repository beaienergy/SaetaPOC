import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { Button, Collapsible, EmptyState, Input, LabeledField, Textarea } from '@/shared/ui'
import { useDisclosure } from '@/shared/hooks'
import { useAgentConfigStore, useOperationSkills } from '../store/agentConfigStore'
import type { Skill } from '../types'
import './SkillList.css'

interface Draft {
  title: string
  description: string
  procedure: string
}
const EMPTY_DRAFT: Draft = { title: '', description: '', procedure: '' }

/**
 * Lista de Skills de una operación (guion §1.4 y §5.2.2): el MISMO componente
 * en el modal de config de agente y en la pantalla de Conocimiento base — no
 * hay dos formularios distintos para lo mismo.
 */
export function SkillList({ opId, readOnly = false }: { opId: string; readOnly?: boolean }) {
  const { t } = useTranslation('agentConfig')
  const skills = useOperationSkills(opId)
  const addSkill = useAgentConfigStore((s) => s.addSkill)
  const updateSkill = useAgentConfigStore((s) => s.updateSkill)
  const removeSkill = useAgentConfigStore((s) => s.removeSkill)

  const [editingId, setEditingId] = useState<string | null>(null)
  const creating = useDisclosure()

  function startEdit(skill: Skill) {
    setEditingId(skill.id)
    creating.close()
  }

  function saveEdit(id: string, draft: Draft) {
    updateSkill(opId, id, draft)
    setEditingId(null)
  }

  function saveNew(draft: Draft) {
    addSkill(opId, draft)
    creating.close()
  }

  return (
    <div className="skill-list">
      {skills.length === 0 && !creating.isOpen && (
        <EmptyState message={t('skills.empty')} />
      )}

      {skills.map((skill) =>
        editingId === skill.id ? (
          <SkillForm
            key={skill.id}
            initial={skill}
            onCancel={() => setEditingId(null)}
            onSave={(draft) => saveEdit(skill.id, draft)}
          />
        ) : (
          <SkillCard
            key={skill.id}
            skill={skill}
            readOnly={readOnly}
            onEdit={() => startEdit(skill)}
            onDelete={() => removeSkill(opId, skill.id)}
          />
        ),
      )}

      {!readOnly &&
        (creating.isOpen ? (
          <SkillForm initial={EMPTY_DRAFT} onCancel={creating.close} onSave={saveNew} />
        ) : (
          <Button
            variant="ghost"
            size="sm"
            icon={<Plus size={15} aria-hidden />}
            onClick={() => {
              setEditingId(null)
              creating.open()
            }}
          >
            {t('skills.add')}
          </Button>
        ))}
    </div>
  )
}

function SkillCard({
  skill,
  readOnly,
  onEdit,
  onDelete,
}: {
  skill: Skill
  readOnly: boolean
  onEdit: () => void
  onDelete: () => void
}) {
  const { t } = useTranslation('agentConfig')

  return (
    <Collapsible
      title={<span className="skill-card__title">{skill.title}</span>}
      defaultOpen={false}
      flush
      className="skill-card"
    >
      <p className="skill-card__desc">{skill.description}</p>
      <p className="skill-card__procedure">{skill.procedure}</p>
      {!readOnly && (
        <div className="skill-card__actions">
          <button
            type="button"
            className="skill-card__icon-btn"
            aria-label={t('skills.edit')}
            title={t('skills.edit')}
            onClick={onEdit}
          >
            <Pencil size={14} />
          </button>
          <button
            type="button"
            className="skill-card__icon-btn"
            aria-label={t('skills.delete')}
            title={t('skills.delete')}
            onClick={onDelete}
          >
            <Trash2 size={14} />
          </button>
        </div>
      )}
    </Collapsible>
  )
}

function SkillForm({
  initial,
  onSave,
  onCancel,
}: {
  initial: Draft
  onSave: (draft: Draft) => void
  onCancel: () => void
}) {
  const { t } = useTranslation('agentConfig')
  const [draft, setDraft] = useState<Draft>(initial)
  const valid = draft.title.trim() !== '' && draft.procedure.trim() !== ''

  return (
    <div className="skill-form">
      <LabeledField label={t('skills.titleLabel')}>
        <Input
          value={draft.title}
          placeholder={t('skills.titlePlaceholder')}
          onChange={(e) => setDraft({ ...draft, title: e.target.value })}
        />
      </LabeledField>
      <LabeledField label={t('skills.descriptionLabel')}>
        <Input
          value={draft.description}
          placeholder={t('skills.descriptionPlaceholder')}
          onChange={(e) => setDraft({ ...draft, description: e.target.value })}
        />
      </LabeledField>
      <LabeledField label={t('skills.procedureLabel')}>
        <Textarea
          value={draft.procedure}
          rows={4}
          placeholder={t('skills.procedurePlaceholder')}
          onChange={(e) => setDraft({ ...draft, procedure: e.target.value })}
        />
      </LabeledField>
      <div className="skill-form__actions">
        <Button variant="primary" size="sm" disabled={!valid} onClick={() => onSave(draft)}>
          {t('skills.save')}
        </Button>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          {t('skills.cancel')}
        </Button>
      </div>
    </div>
  )
}
