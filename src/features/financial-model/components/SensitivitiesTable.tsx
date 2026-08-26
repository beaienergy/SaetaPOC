import { useTranslation } from 'react-i18next'
import { Card, CardHeader } from '@/shared/ui'
import type { ScenarioKey, SensitivityRow } from '../types'
import './SensitivitiesTable.css'

const SCENARIOS: ScenarioKey[] = ['downside', 'base', 'upside']

/**
 * Seccion opcional de sensibilidades (guion §5.4): asunciones y resultados
 * por escenario. Opcional a nivel de pantalla — no todas las operaciones
 * tienen una necesariamente (Solstice no la tiene: es la operacion mas
 * ligera y cerrada, ver `mockFinancialModel.ts`).
 */
export function SensitivitiesTable({ rows }: { rows: SensitivityRow[] }) {
  const { t } = useTranslation('financialModel')

  if (rows.length === 0) return null

  const assumptions = rows.filter((r) => r.kind === 'assumption')
  const results = rows.filter((r) => r.kind === 'result')

  return (
    <Card>
      <CardHeader title={t('sensitivities.title')} subtitle={t('sensitivities.subtitle')} />
      <div className="fm-sensitivities-scroll">
        <table className="fm-sensitivities">
          <thead>
            <tr>
              <th className="u-eyebrow" />
              {SCENARIOS.map((scenario) => (
                <th key={scenario} className="u-eyebrow">
                  {t(`sensitivities.scenario.${scenario}`)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {assumptions.length > 0 && (
              <>
                <SensitivityGroupRow label={t('sensitivities.assumptions')} />
                {assumptions.map((row) => (
                  <SensitivityDataRow key={row.id} row={row} />
                ))}
              </>
            )}
            {results.length > 0 && (
              <>
                <SensitivityGroupRow label={t('sensitivities.results')} />
                {results.map((row) => (
                  <SensitivityDataRow key={row.id} row={row} />
                ))}
              </>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

function SensitivityGroupRow({ label }: { label: string }) {
  return (
    <tr className="fm-sensitivities__group-row">
      <th colSpan={SCENARIOS.length + 1} className="fm-sensitivities__group">
        {label}
      </th>
    </tr>
  )
}

function SensitivityDataRow({ row }: { row: SensitivityRow }) {
  return (
    <tr>
      <th scope="row" className="fm-sensitivities__label">
        {row.label}
      </th>
      {SCENARIOS.map((scenario) => (
        <td key={scenario} className="fm-sensitivities__value">
          {row.values[scenario]}
        </td>
      ))}
    </tr>
  )
}
