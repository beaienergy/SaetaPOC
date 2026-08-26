import type { AuditFinding, FinancialModelData, FinancialModelFile, SensitivityRow } from '../types'

/**
 * Contenido mock del Modelo financiero (guion §5.4), keyed por operacion
 * (mismos 3 IDs que `features/operations`). Distinto entre operaciones a
 * proposito, en linea con la nota de alcance del guion: Helios es la mas rica,
 * Meridian intermedia, Solstice la mas pequena y cerrada — aqui ademas
 * Solstice no tiene una auditoria previa (ver `financialAuditStore`), para
 * demostrar el flujo "Auditar" completo en vez de solo el resultado ya hecho.
 */
export const MOCK_FINANCIAL_MODEL: Record<string, FinancialModelData> = {
  helios: {
    files: heliosFiles(),
    findings: heliosFindings(),
    sensitivities: heliosSensitivities(),
  },
  meridian: {
    files: meridianFiles(),
    findings: meridianFindings(),
    sensitivities: meridianSensitivities(),
  },
  solstice: {
    files: solsticeFiles(),
    findings: solsticeFindings(),
    sensitivities: [],
  },
}

export function getFinancialModelData(opId: string): FinancialModelData {
  return MOCK_FINANCIAL_MODEL[opId] ?? { files: [], findings: [], sensitivities: [] }
}

function heliosFiles(): FinancialModelFile[] {
  return [
    {
      id: 'fm-helios-1',
      name: 'Helios_Consolidated_Model_v14.xlsm',
      version: 'v14.2',
      updatedAt: '2026-08-19T10:30:00.000Z',
      sizeLabel: '18.4 MB',
      sheetCount: 27,
    },
    {
      id: 'fm-helios-2',
      name: 'Helios_Sensitivities_Addendum_v3.xlsx',
      version: 'v3.0',
      updatedAt: '2026-08-12T09:05:00.000Z',
      sizeLabel: '3.1 MB',
      sheetCount: 6,
    },
    {
      id: 'fm-helios-3',
      name: 'Helios_Debt_Schedule_v6.xlsx',
      version: 'v6.1',
      updatedAt: '2026-07-30T15:45:00.000Z',
      sizeLabel: '2.6 MB',
      sheetCount: 9,
    },
  ]
}

function heliosFindings(): AuditFinding[] {
  return [
    {
      id: 'af-helios-1',
      type: 'broken_formula',
      severity: 'critical',
      sheet: 'DCF',
      cell: 'F52',
      description:
        'Formula returns #REF! — a row in the capacity ramp-up schedule was deleted without ' +
        'updating the downstream cash flow build.',
      recommendation: 'Rebuild the reference to the ramp-up schedule and re-run the DCF.',
    },
    {
      id: 'af-helios-2',
      type: 'external_link',
      severity: 'high',
      sheet: 'Revenue',
      cell: 'B2',
      description:
        'Live external link to a local drive path ("C:\\Users\\...\\ppa_prices.xlsx") outside ' +
        'the data room — the working copy cannot resolve it and silently keeps a stale cached value.',
      recommendation: 'Replace with a pasted-value snapshot cited to the source PPA document.',
    },
    {
      id: 'af-helios-3',
      type: 'hardcoded_value',
      severity: 'medium',
      sheet: 'WACC',
      cell: 'C9',
      description:
        'Discount rate is typed as a static 7.8% instead of being derived from the CAPM build ' +
        'two rows above it — the two values already disagree after the latest beta update.',
      recommendation: 'Point the cell to the CAPM output or document why it is overridden.',
    },
    {
      id: 'af-helios-4',
      type: 'circularity',
      severity: 'high',
      sheet: 'DebtSchedule',
      cell: 'G40',
      description:
        'Interest expense circularly references the cash sweep on the same tab without ' +
        'iterative calculation enabled — opening the file in a clean session returns #VALUE!.',
      recommendation: 'Add a circularity breaker switch or enable iterative calc explicitly.',
    },
    {
      id: 'af-helios-5',
      type: 'cross_tab_inconsistency',
      severity: 'medium',
      sheet: 'Sensitivities',
      cell: 'C14',
      description:
        'Price escalation assumption (2.5%) does not match the escalation used on the Revenue ' +
        'tab (3.0%) — the sensitivity case is silently understating upside.',
      recommendation: 'Align both tabs to a single named assumption cell.',
    },
    {
      id: 'af-helios-6',
      type: 'hardcoded_value',
      severity: 'low',
      sheet: 'Opex',
      cell: 'D22',
      description:
        "Insurance premium is hardcoded from last year's renewal instead of linking to the " +
        'premium schedule tab added in v13.',
      recommendation: 'Link to Premiums!D8 and confirm against the latest renewal notice.',
    },
    {
      id: 'af-helios-7',
      type: 'broken_formula',
      severity: 'medium',
      sheet: 'Returns',
      cell: 'H18',
      description:
        'IRR formula still references the original date range after a row was inserted for an ' +
        'extra construction milestone — the last two cash flow periods are excluded.',
      recommendation: 'Extend the IRR range to include the newly inserted row.',
    },
    {
      id: 'af-helios-8',
      type: 'external_link',
      severity: 'low',
      sheet: 'Covers',
      cell: 'A1',
      description: 'Stale link to an old SharePoint workbook used only for the FX rate on the cover tab.',
      recommendation: 'Remove the link and paste the FX rate as a cited static value.',
    },
  ]
}

function heliosSensitivities(): SensitivityRow[] {
  return [
    { id: 'sr-helios-1', label: 'Power price escalation', kind: 'assumption', values: { downside: '1.0%', base: '2.5%', upside: '4.0%' } },
    { id: 'sr-helios-2', label: 'Discount rate (WACC)', kind: 'assumption', values: { downside: '8.5%', base: '7.8%', upside: '7.0%' } },
    { id: 'sr-helios-3', label: 'Portfolio availability', kind: 'assumption', values: { downside: '96.0%', base: '98.0%', upside: '99.0%' } },
    { id: 'sr-helios-4', label: 'Equity IRR', kind: 'result', values: { downside: '7.2%', base: '10.4%', upside: '13.9%' } },
    { id: 'sr-helios-5', label: 'MOIC', kind: 'result', values: { downside: '1.4x', base: '1.8x', upside: '2.3x' } },
    { id: 'sr-helios-6', label: 'NPV (EUR m)', kind: 'result', values: { downside: '42', base: '96', upside: '158' } },
  ]
}

function meridianFiles(): FinancialModelFile[] {
  return [
    {
      id: 'fm-meridian-1',
      name: 'Meridian_LBO_Model_v9.xlsx',
      version: 'v9.1',
      updatedAt: '2026-08-14T11:20:00.000Z',
      sizeLabel: '11.7 MB',
      sheetCount: 19,
    },
    {
      id: 'fm-meridian-2',
      name: 'Meridian_OM_Cost_Buildup_v2.xlsx',
      version: 'v2.0',
      updatedAt: '2026-08-02T08:40:00.000Z',
      sizeLabel: '1.9 MB',
      sheetCount: 5,
    },
  ]
}

function meridianFindings(): AuditFinding[] {
  return [
    {
      id: 'af-meridian-1',
      type: 'circularity',
      severity: 'critical',
      sheet: 'DebtSchedule',
      cell: 'K30',
      description:
        'Circular reference between the DSCR covenant check and the refinancing trigger cell — ' +
        'the model resolves it only because Excel keeps a cached iteration from a previous open.',
      recommendation: 'Break the loop by moving the trigger check to a separate calc tab.',
    },
    {
      id: 'af-meridian-2',
      type: 'broken_formula',
      severity: 'high',
      sheet: 'Opex',
      cell: 'F15',
      description: 'Formula returns #DIV/0! when the availability factor input is left blank for an asset.',
      recommendation: 'Add a default availability factor and an explicit error guard.',
    },
    {
      id: 'af-meridian-3',
      type: 'hardcoded_value',
      severity: 'medium',
      sheet: 'Revenue',
      cell: 'C40',
      description: 'Merchant price for 2031 onwards is hardcoded flat instead of following the forward curve.',
      recommendation: 'Extend the forward curve reference through the full model horizon.',
    },
    {
      id: 'af-meridian-4',
      type: 'external_link',
      severity: 'medium',
      sheet: 'Inputs',
      cell: 'B5',
      description: 'Link to an external market price curve file that is not present anywhere in the data room.',
      recommendation: 'Request the source file or replace with a cited static snapshot.',
    },
    {
      id: 'af-meridian-5',
      type: 'cross_tab_inconsistency',
      severity: 'high',
      sheet: 'Sensitivities',
      cell: 'D22',
      description: 'Turbine count used in the sensitivity case (5) does not match the Assets tab (6 operating assets).',
      recommendation: 'Recalculate the sensitivity case against the current Assets tab.',
    },
    {
      id: 'af-meridian-6',
      type: 'hardcoded_value',
      severity: 'low',
      sheet: 'Capex',
      cell: 'E9',
      description: 'Refurbishment capex for year 12 is a hardcoded flat number, not tied to the maintenance plan.',
      recommendation: 'Link to the refurbishment schedule once available.',
    },
    {
      id: 'af-meridian-7',
      type: 'broken_formula',
      severity: 'low',
      sheet: 'Summary',
      cell: 'B60',
      description: 'SUM range excludes the last row after a new cost line was inserted above the total.',
      recommendation: 'Extend the SUM range or convert the block to a table for auto-expansion.',
    },
  ]
}

function meridianSensitivities(): SensitivityRow[] {
  return [
    { id: 'sr-meridian-1', label: 'Merchant price vs. curve', kind: 'assumption', values: { downside: '-10%', base: 'flat', upside: '+8%' } },
    { id: 'sr-meridian-2', label: 'Availability guarantee', kind: 'assumption', values: { downside: '93.0%', base: '95.0%', upside: '97.0%' } },
    { id: 'sr-meridian-3', label: 'Equity IRR', kind: 'result', values: { downside: '6.1%', base: '9.8%', upside: '12.5%' } },
    { id: 'sr-meridian-4', label: 'NPV (EUR m)', kind: 'result', values: { downside: '18', base: '54', upside: '88' } },
  ]
}

function solsticeFiles(): FinancialModelFile[] {
  return [
    {
      id: 'fm-solstice-1',
      name: 'Solstice_Pipeline_Valuation_v2.xlsx',
      version: 'v2.0',
      updatedAt: '2026-06-25T14:10:00.000Z',
      sizeLabel: '2.2 MB',
      sheetCount: 8,
    },
  ]
}

function solsticeFindings(): AuditFinding[] {
  return [
    {
      id: 'af-solstice-1',
      type: 'hardcoded_value',
      severity: 'medium',
      sheet: 'Pipeline',
      cell: 'C11',
      description: 'Development cost is hardcoded per project instead of being derived from the per-MW cost formula used elsewhere.',
      recommendation: 'Replace with the per-MW formula used on the other pipeline rows.',
    },
    {
      id: 'af-solstice-2',
      type: 'external_link',
      severity: 'low',
      sheet: 'Inputs',
      cell: 'A3',
      description: "Link to an analyst's personal drive for the BESS cost curve, not part of the data room.",
      recommendation: 'Replace with a cited value from the vendor quote in the data room.',
    },
    {
      id: 'af-solstice-3',
      type: 'broken_formula',
      severity: 'medium',
      sheet: 'Valuation',
      cell: 'F9',
      description: 'NPV formula skips the discount factor for one project row, overstating its present value.',
      recommendation: 'Reapply the standard discount factor formula to the affected row.',
    },
    {
      id: 'af-solstice-4',
      type: 'cross_tab_inconsistency',
      severity: 'low',
      sheet: 'Summary',
      cell: 'B14',
      description: 'Total pipeline capacity shown here does not match the sum on the Assets tab.',
      recommendation: 'Recompute the summary total from the Assets tab instead of typing it separately.',
    },
    {
      id: 'af-solstice-5',
      type: 'hardcoded_value',
      severity: 'low',
      sheet: 'Capex',
      cell: 'D6',
      description: 'BESS unit cost is hardcoded from a single vendor quote with no reference cell.',
      recommendation: 'Add a source reference and revisit once a second quote is available.',
    },
    {
      id: 'af-solstice-6',
      type: 'circularity',
      severity: 'medium',
      sheet: 'Valuation',
      cell: 'G21',
      description: 'Development fee references the post-fee IRR it is meant to be computed from.',
      recommendation: 'Base the fee on a fixed development cost basis instead of the resulting IRR.',
    },
  ]
}
