import type { Citation } from '@/shared/types/domain'
import type { ChatConversation } from '../types'

/**
 * Versión en español del contenido conversacional de `mockChat.ts` (pedido
 * explícito: "que el texto de las conversaciones del chat se pase a español
 * si el idioma está en español"). Misma estructura, mismos ids de mensaje/
 * cita/documento que la versión en inglés — solo cambia el texto, para que
 * cualquier lógica que dependa de esos ids (chips de cita, deep-link a
 * Documentación) siga funcionando igual en los dos idiomas. Los nombres de
 * fichero (`documentName`) se dejan en inglés a propósito: son los nombres
 * reales de los documentos en el data room, no se traducen en la vida real.
 */

// ---------------------------------------------------------------------------
// Sugerencias de arranque
// ---------------------------------------------------------------------------

export const MOCK_SUGGESTIONS_ES: Record<string, string[]> = {
  helios: [
    '¿Cuáles son los riesgos clave de esta operación?',
    'Resume el estado de la conexión a red en todos los emplazamientos.',
    '¿El precio del PPA cuadra con las hipótesis del modelo financiero?',
    '¿Qué problemas de tenencia de suelo debería tener en cuenta?',
    'Lista los permisos ambientales próximos a caducar.',
  ],
  meridian: [
    '¿Cuáles son los riesgos clave de esta operación?',
    'Resume las garantías de disponibilidad de O&M en todos los activos.',
    '¿Qué turbinas están fuera de garantía?',
    '¿Qué derechos de suelo hay en cada emplazamiento?',
  ],
  solstice: [
    '¿Cuáles son los riesgos clave de esta operación?',
    'Resume la fase del pipeline de desarrollo por proyecto.',
    '¿Cuál es el estado de la cola de interconexión?',
  ],
}

// ---------------------------------------------------------------------------
// Historial de conversaciones previas
// ---------------------------------------------------------------------------

export const MOCK_CONVERSATIONS_ES: Record<string, ChatConversation[]> = {
  helios: [
    {
      id: 'conv-helios-1',
      title: 'Riesgos clave en el portfolio Helios',
      updatedAt: '2026-08-26T09:12:00.000Z',
      messages: [
        {
          id: 'msg-helios-1-1',
          role: 'user',
          content: '¿Cuáles son los riesgos clave de esta operación?',
          createdAt: '2026-08-26T09:08:00.000Z',
        },
        {
          id: 'msg-helios-1-2',
          role: 'agent',
          content:
            'Destacan tres riesgos en el portfolio. Primero, el arrendamiento de suelo del Site 12 tiene ' +
            'una duración más corta que la vida útil restante del activo, lo que exige una cláusula de ' +
            'renovación antes de firmar. Segundo, la aprobación ambiental del Site 07 tiene condiciones ' +
            'que caducan antes de la puesta en marcha. Tercero, la escalada de precio del PPA de la ' +
            'sociedad del portfolio no cuadra del todo con las hipótesis de ingresos del modelo financiero.',
          createdAt: '2026-08-26T09:09:10.000Z',
          citations: [
            {
              id: 'cit-helios-1-1',
              documentId: 'doc-helios-land-12',
              documentName: 'Land Lease Agreement — Site 12 (Extremadura)',
              locator: 'cláusula 4.3',
              snippet:
                'Plazo inicial de 22 años desde la fecha de operación comercial, renovable de mutuo acuerdo.',
            },
            {
              id: 'cit-helios-1-2',
              documentId: 'doc-helios-eia-07',
              documentName: 'Environmental Impact Assessment — Site 07',
              locator: 'condición 6, p. 9',
              snippet: 'La condición 6 (monitorización de biodiversidad) debe renovarse 12 meses antes de la puesta en marcha.',
            },
            {
              id: 'cit-helios-1-3',
              documentId: 'doc-helios-ppa-01',
              documentName: 'Power Purchase Agreement — Portfolio Co.',
              locator: 'anexo 2, p. 14',
              snippet: 'Escalada de precio anual fija del 1,5%, con capitalización a partir del año 3.',
            },
          ],
        },
        {
          id: 'msg-helios-1-3',
          role: 'user',
          content: 'Cuéntame más sobre el problema del arrendamiento de suelo en el Site 12.',
          createdAt: '2026-08-26T09:10:40.000Z',
        },
        {
          id: 'msg-helios-1-4',
          role: 'agent',
          content:
            'El arrendamiento del Site 12 tiene un plazo inicial de 22 años desde la operación comercial, ' +
            'renovable solo de mutuo acuerdo con el propietario del terreno — no hay opción de extensión ' +
            'unilateral para el comprador. La vida útil técnica del activo está modelada a 30 años, así ' +
            'que hay un hueco de 8 años que depende de una renegociación con un tercero. Yo lo marcaría ' +
            'como Key Issue en vez de como nota, dado que afecta al valor terminal.',
          createdAt: '2026-08-26T09:11:35.000Z',
          citations: [
            {
              id: 'cit-helios-1-4',
              documentId: 'doc-helios-land-12',
              documentName: 'Land Lease Agreement — Site 12 (Extremadura)',
              locator: 'cláusula 4.3, anexo A',
              snippet: 'El arrendatario no dispone de derecho de extensión unilateral bajo este contrato.',
            },
          ],
        },
      ],
    },
    {
      id: 'conv-helios-2',
      title: 'Estado de conexión a red por emplazamiento',
      updatedAt: '2026-08-25T17:40:00.000Z',
      messages: [
        {
          id: 'msg-helios-2-1',
          role: 'user',
          content: 'Resume el estado de la conexión a red en todos los emplazamientos.',
          createdAt: '2026-08-25T17:36:00.000Z',
        },
        {
          id: 'msg-helios-2-2',
          role: 'agent',
          content:
            'REE ha concedido permisos de conexión firmes para 11 de los 12 emplazamientos del portfolio. ' +
            'El Site 09 sigue con una reserva de capacidad provisional pendiente de un estudio de refuerzo ' +
            'de red. Dos emplazamientos (04 y 08) tienen condiciones de curtailment en sus acuerdos de ' +
            'acceso que conviene señalar al equipo comercial.',
          createdAt: '2026-08-25T17:37:20.000Z',
          citations: [
            {
              id: 'cit-helios-2-1',
              documentId: 'doc-helios-grid-conn',
              documentName: 'Grid Connection Permit — REE',
              locator: 'anexo 3, p. 22',
              snippet: 'Site 09: reserva de capacidad clasificada como provisional, sujeta al estudio de refuerzo RS-2026-114.',
            },
          ],
        },
        {
          id: 'msg-helios-2-3',
          role: 'user',
          content: '¿Hay alguna condición de curtailment que debamos señalar?',
          createdAt: '2026-08-25T17:38:50.000Z',
        },
        {
          id: 'msg-helios-2-4',
          role: 'agent',
          content:
            'Sí — los acuerdos de acceso de los Sites 04 y 08 permiten a la distribuidora recortar la ' +
            'producción hasta un 5% de la generación anual esperada sin compensación. Está dentro del ' +
            'rango habitual del mercado en esta región, pero conviene reflejarlo explícitamente en el ' +
            'caso a la baja del modelo financiero si todavía no lo está.',
          createdAt: '2026-08-25T17:39:45.000Z',
          citations: [
            {
              id: 'cit-helios-2-3',
              documentId: 'doc-helios-grid-conn',
              documentName: 'Grid Connection Permit — REE',
              locator: 'cláusula 7.2',
              snippet: 'El curtailment sin compensación está limitado al 5% de la generación anual P50.',
            },
          ],
        },
      ],
    },
    {
      id: 'conv-helios-3',
      title: 'Precio del PPA frente al modelo financiero',
      updatedAt: '2026-08-24T11:05:00.000Z',
      messages: [
        {
          id: 'msg-helios-3-1',
          role: 'user',
          content: '¿El precio del PPA cuadra con las hipótesis del modelo financiero?',
          createdAt: '2026-08-24T11:02:00.000Z',
        },
        {
          id: 'msg-helios-3-2',
          role: 'agent',
          content:
            'No exactamente. El PPA fija la escalada de precio anual en 1,5% a partir del año 3, mientras ' +
            'que la pestaña de ingresos del modelo financiero asume un 2,1% desde el año 1. La diferencia ' +
            'supera el umbral de materialidad del 2% usado para este tipo de comprobación cruzada, así que ' +
            'convendría corregirlo en el modelo o explicarlo si es intencional (por ejemplo, una hipótesis ' +
            'separada de cola merchant).',
          createdAt: '2026-08-24T11:03:15.000Z',
          citations: [
            {
              id: 'cit-helios-3-1',
              documentId: 'doc-helios-ppa-01',
              documentName: 'Power Purchase Agreement — Portfolio Co.',
              locator: 'anexo 2, p. 14',
              snippet: 'Escalada de precio anual fija del 1,5%, con capitalización a partir del año 3.',
            },
            {
              id: 'cit-helios-3-2',
              documentId: 'doc-helios-fin-model',
              documentName: 'Financial Model v4.2',
              locator: "pestaña 'Revenue', celda C22",
              snippet: 'Hipótesis de escalada: 2,1% anual, aplicada desde la COD.',
            },
          ],
        },
        {
          id: 'msg-helios-3-3',
          role: 'user',
          content: '¿Y el volumen contratado?',
          createdAt: '2026-08-24T11:04:20.000Z',
        },
        {
          id: 'msg-helios-3-4',
          role: 'agent',
          content:
            'El volumen contratado es consistente — el PPA cubre el 85% de la generación P50 esperada y el ' +
            'reparto contratado/merchant del modelo coincide con esa cifra, con margen de redondeo. Ningún ' +
            'hallazgo ahí.',
          createdAt: '2026-08-24T11:04:55.000Z',
          citations: [
            {
              id: 'cit-helios-3-3',
              documentId: 'doc-helios-ppa-01',
              documentName: 'Power Purchase Agreement — Portfolio Co.',
              locator: 'cláusula 5.1',
              snippet: 'Volumen contratado: 85% de la producción anual estimada P50.',
            },
            {
              id: 'cit-helios-3-4',
              documentId: 'doc-helios-fin-model',
              documentName: 'Financial Model v4.2',
              locator: "pestaña 'Revenue', celda D22",
              snippet: 'Porcentaje contratado: 85%.',
            },
          ],
        },
      ],
    },
    {
      id: 'conv-helios-4',
      title: 'Pasivos laborales en el Site 07',
      updatedAt: '2026-08-18T10:00:00.000Z',
      messages: [
        {
          id: 'msg-helios-4-1',
          role: 'user',
          content: '¿Qué pasivos laborales existen para el equipo del Site 07?',
          createdAt: '2026-08-18T09:58:00.000Z',
        },
        {
          id: 'msg-helios-4-2',
          role: 'agent',
          content:
            'El emplazamiento tiene 4 empleados directos con contrato indefinido estándar y 30 días de ' +
            'preaviso, sin condiciones de indemnización inusuales. No tengo documentación indexada ' +
            'suficiente para confirmar si hay litigios pendientes o amenazados sobre este equipo — el ' +
            'resumen laboral no lo cubre. Sugeriría pedir al vendedor una carta de divulgación de ' +
            'litigios antes del cierre.',
          createdAt: '2026-08-18T09:59:30.000Z',
          citations: [
            {
              id: 'cit-helios-4-1',
              documentId: 'doc-helios-labor',
              documentName: 'Employment Agreements Summary',
              locator: 'anexo B, p. 3',
              snippet: 'Plantilla del Site 07: 4 FTE, contrato indefinido, 30 días de preaviso.',
            },
          ],
        },
      ],
    },
  ],
  meridian: [
    {
      id: 'conv-meridian-1',
      title: 'Garantías de disponibilidad de O&M',
      updatedAt: '2026-08-21T09:05:00.000Z',
      messages: [
        {
          id: 'msg-meridian-1-1',
          role: 'user',
          content: 'Resume las garantías de disponibilidad de O&M en todos los activos.',
          createdAt: '2026-08-21T09:01:00.000Z',
        },
        {
          id: 'msg-meridian-1-2',
          role: 'agent',
          content:
            'Cinco de los seis activos en operación tienen una garantía de disponibilidad temporal del ' +
            '97% con el fabricante de las turbinas, respaldada por un mecanismo de daños liquidados. El ' +
            'Activo 4 es la excepción — su garantía está en el 94%, por debajo del umbral del 95% que ' +
            'suele considerarse aceptable para este tipo de activo.',
          createdAt: '2026-08-21T09:02:10.000Z',
          citations: [
            {
              id: 'cit-meridian-1-1',
              documentId: 'doc-meridian-om',
              documentName: 'O&M Agreement — Turbine Supplier',
              locator: 'cláusula 3.2, p. 4',
              snippet: 'Garantía de disponibilidad: 97%, excepto el Activo 4 al 94% según el Anexo 1.',
            },
          ],
        },
        {
          id: 'msg-meridian-1-3',
          role: 'user',
          content: '¿Qué activo está por debajo del umbral del 95%?',
          createdAt: '2026-08-21T09:03:00.000Z',
        },
        {
          id: 'msg-meridian-1-4',
          role: 'agent',
          content:
            'El Activo 4. Recomendaría añadirlo como Key Issue — una garantía por debajo del umbral suele ' +
            'indicar un mecanismo de penalización más débil o una turbina con un problema técnico conocido ' +
            'detrás, y el contrato no aclara cuál de los dos.',
          createdAt: '2026-08-21T09:03:40.000Z',
          citations: [
            {
              id: 'cit-meridian-1-3',
              documentId: 'doc-meridian-om',
              documentName: 'O&M Agreement — Turbine Supplier',
              locator: 'anexo 1',
              snippet: 'Activo 4: disponibilidad garantizada 94%, tope de penalización 8% de la cuota anual de O&M.',
            },
          ],
        },
      ],
    },
    {
      id: 'conv-meridian-2',
      title: 'Huecos de garantía de turbinas por activo',
      updatedAt: '2026-08-19T14:00:00.000Z',
      messages: [
        {
          id: 'msg-meridian-2-1',
          role: 'user',
          content: '¿Qué turbinas están fuera de su periodo de garantía?',
          createdAt: '2026-08-19T13:57:00.000Z',
        },
        {
          id: 'msg-meridian-2-2',
          role: 'agent',
          content:
            'Las turbinas del Activo 2 y del Activo 5 han superado su garantía estándar de fabricante de ' +
            '2 años según sus fechas de puesta en marcha. No veo indexado ningún contrato de garantía ' +
            'extendida o de servicio completo para ninguno de los dos, así que se lee como un hueco de ' +
            'cobertura real y no como algo cubierto por otra vía — conviene confirmarlo directamente con ' +
            'el vendedor.',
          createdAt: '2026-08-19T13:58:20.000Z',
          citations: [
            {
              id: 'cit-meridian-2-1',
              documentId: 'doc-meridian-warranty',
              documentName: 'Turbine Warranty Schedule',
              locator: 'p. 2',
              snippet: 'COD Activo 2: 2023-11; COD Activo 5: 2024-02. Plazo de garantía estándar: 24 meses.',
            },
          ],
        },
      ],
    },
  ],
  solstice: [
    {
      id: 'conv-solstice-1',
      title: 'Base de valoración del pipeline',
      updatedAt: '2026-06-30T11:40:00.000Z',
      messages: [
        {
          id: 'msg-solstice-1-1',
          role: 'user',
          content: 'Resume la fase del pipeline de desarrollo por proyecto.',
          createdAt: '2026-06-30T11:36:00.000Z',
        },
        {
          id: 'msg-solstice-1-2',
          role: 'agent',
          content:
            'El registro de pipeline recoge 4 proyectos BESS en fase temprana. Tres tienen control de ' +
            'suelo confirmado y un expediente de permisos activo; el cuarto (Proyecto D) tiene control ' +
            'de suelo pero ninguna posición confirmada en la cola de interconexión en la documentación ' +
            'que tengo indexada. Según la checklist de valoración sembrada para activos preconstrucción, ' +
            'un elemento sin posición de cola no debería contarse como activo valorado todavía — yo lo ' +
            'trataría como un gap en vez de como valor de pipeline hasta que la distribuidora lo confirme.',
          createdAt: '2026-06-30T11:37:30.000Z',
          citations: [
            {
              id: 'cit-solstice-1-1',
              documentId: 'doc-solstice-pipeline',
              documentName: 'Development Pipeline Register',
              locator: 'p. 6',
              snippet: 'Proyecto D: control de suelo asegurado 2026-02; posición en cola de interconexión: pendiente de confirmación.',
            },
          ],
        },
      ],
    },
  ],
}

// ---------------------------------------------------------------------------
// Banco de respuestas (para preguntas libres / sugerencias no históricas)
// ---------------------------------------------------------------------------

interface QaEntry {
  keywords: string[]
  content: string
  citations: Citation[]
}

export const MOCK_QA_ES: Record<string, QaEntry[]> = {
  helios: [
    {
      keywords: ['riesgo clave', 'riesgo principal', 'riesgos'],
      content:
        'Destacan tres riesgos en el portfolio: el arrendamiento de suelo del Site 12 con una duración ' +
        'menor que la vida útil del activo, las condiciones de la aprobación ambiental del Site 07 que ' +
        'caducan antes de la puesta en marcha, y una escalada de precio del PPA que no cuadra del todo ' +
        'con las hipótesis de ingresos del modelo financiero.',
      citations: [
        {
          id: 'cit-helios-qa-risk-1',
          documentId: 'doc-helios-land-12',
          documentName: 'Land Lease Agreement — Site 12 (Extremadura)',
          locator: 'cláusula 4.3',
          snippet: 'Plazo inicial de 22 años desde la fecha de operación comercial, renovable de mutuo acuerdo.',
        },
        {
          id: 'cit-helios-qa-risk-2',
          documentId: 'doc-helios-eia-07',
          documentName: 'Environmental Impact Assessment — Site 07',
          locator: 'condición 6, p. 9',
          snippet: 'La condición 6 (monitorización de biodiversidad) debe renovarse 12 meses antes de la puesta en marcha.',
        },
      ],
    },
    {
      keywords: ['conexión a red', 'estado de conexión', 'conexion a red'],
      content:
        'REE ha concedido permisos de conexión firmes para 11 de los 12 emplazamientos. El Site 09 ' +
        'sigue con una reserva de capacidad provisional pendiente de un estudio de refuerzo de red, y ' +
        'los Sites 04 y 08 tienen condiciones de curtailment que conviene señalar al equipo comercial.',
      citations: [
        {
          id: 'cit-helios-qa-grid-1',
          documentId: 'doc-helios-grid-conn',
          documentName: 'Grid Connection Permit — REE',
          locator: 'anexo 3, p. 22',
          snippet: 'Site 09: reserva de capacidad clasificada como provisional, sujeta al estudio de refuerzo RS-2026-114.',
        },
      ],
    },
    {
      keywords: ['precio del ppa', 'precio ppa', 'hipótesis del modelo financiero', 'hipotesis del modelo financiero'],
      content:
        'No exactamente — el PPA fija la escalada de precio anual en 1,5% a partir del año 3, mientras ' +
        'que la pestaña de ingresos del modelo financiero asume un 2,1% desde el año 1. Esa diferencia ' +
        'supera el umbral de materialidad del 2% usado para esta comprobación cruzada y convendría ' +
        'conciliarla o explicarla.',
      citations: [
        {
          id: 'cit-helios-qa-ppa-1',
          documentId: 'doc-helios-ppa-01',
          documentName: 'Power Purchase Agreement — Portfolio Co.',
          locator: 'anexo 2, p. 14',
          snippet: 'Escalada de precio anual fija del 1,5%, con capitalización a partir del año 3.',
        },
        {
          id: 'cit-helios-qa-ppa-2',
          documentId: 'doc-helios-fin-model',
          documentName: 'Financial Model v4.2',
          locator: "pestaña 'Revenue', celda C22",
          snippet: 'Hipótesis de escalada: 2,1% anual, aplicada desde la COD.',
        },
      ],
    },
    {
      keywords: ['tenencia de suelo', 'derechos de suelo', 'problema de suelo'],
      content:
        'La tenencia de suelo está confirmada por un arrendamiento o título de propiedad registrado en ' +
        '11 de los 12 emplazamientos. El Site 12 es la excepción: su arrendamiento dura menos que la ' +
        'vida útil restante del activo y no tiene derecho de extensión unilateral para el comprador — yo ' +
        'lo trataría como Key Issue en vez de como nota.',
      citations: [
        {
          id: 'cit-helios-qa-land-1',
          documentId: 'doc-helios-land-12',
          documentName: 'Land Lease Agreement — Site 12 (Extremadura)',
          locator: 'cláusula 4.3, anexo A',
          snippet: 'El arrendatario no dispone de derecho de extensión unilateral bajo este contrato.',
        },
      ],
    },
    {
      keywords: ['permiso ambiental', 'permisos próximos a caducar', 'permisos proximos a caducar', 'ambiental'],
      content:
        'La mayoría de las aprobaciones ambientales están vigentes. La que hay que vigilar es el Site ' +
        '07: la condición 6 de su estudio de impacto (monitorización de biodiversidad) debe renovarse 12 ' +
        'meses antes de la puesta en marcha, y esa ventana se acerca.',
      citations: [
        {
          id: 'cit-helios-qa-env-1',
          documentId: 'doc-helios-eia-07',
          documentName: 'Environmental Impact Assessment — Site 07',
          locator: 'condición 6, p. 9',
          snippet: 'La condición 6 (monitorización de biodiversidad) debe renovarse 12 meses antes de la puesta en marcha.',
        },
      ],
    },
    {
      keywords: ['empleo', 'laboral', 'pasivos laborales', 'plantilla'],
      content:
        'El Site 07 tiene 4 empleados directos con contrato indefinido estándar y 30 días de preaviso. ' +
        'No tengo documentación indexada suficiente para confirmar litigios pendientes o amenazados para ' +
        'este equipo — sugeriría pedir al vendedor una carta de divulgación de litigios antes del cierre.',
      citations: [
        {
          id: 'cit-helios-qa-labor-1',
          documentId: 'doc-helios-labor',
          documentName: 'Employment Agreements Summary',
          locator: 'anexo B, p. 3',
          snippet: 'Plantilla del Site 07: 4 FTE, contrato indefinido, 30 días de preaviso.',
        },
      ],
    },
  ],
  meridian: [
    {
      keywords: ['riesgo clave', 'riesgo principal'],
      content:
        'Los riesgos principales ahora mismo: la garantía de disponibilidad de O&M del Activo 4 está por ' +
        'debajo del umbral habitual del 95%, y las turbinas de los Activos 2 y 5 están fuera de la ' +
        'garantía del fabricante sin cobertura extendida indexada.',
      citations: [
        {
          id: 'cit-meridian-qa-risk-1',
          documentId: 'doc-meridian-om',
          documentName: 'O&M Agreement — Turbine Supplier',
          locator: 'anexo 1',
          snippet: 'Activo 4: disponibilidad garantizada 94%, tope de penalización 8% de la cuota anual de O&M.',
        },
        {
          id: 'cit-meridian-qa-risk-2',
          documentId: 'doc-meridian-warranty',
          documentName: 'Turbine Warranty Schedule',
          locator: 'p. 2',
          snippet: 'COD Activo 2: 2023-11; COD Activo 5: 2024-02. Plazo de garantía estándar: 24 meses.',
        },
      ],
    },
    {
      keywords: ['garantía de disponibilidad', 'garantia de disponibilidad', 'disponibilidad de o&m'],
      content:
        'Cinco de los seis activos tienen una garantía de disponibilidad temporal del 97%. El Activo 4 ' +
        'es la excepción, con un 94%, por debajo del umbral del 95% que suele considerarse aceptable ' +
        'para este tipo de activo.',
      citations: [
        {
          id: 'cit-meridian-qa-avail-1',
          documentId: 'doc-meridian-om',
          documentName: 'O&M Agreement — Turbine Supplier',
          locator: 'cláusula 3.2, p. 4',
          snippet: 'Garantía de disponibilidad: 97%, excepto el Activo 4 al 94% según el Anexo 1.',
        },
      ],
    },
    {
      keywords: ['garantía', 'garantia'],
      content:
        'Las turbinas de los Activos 2 y 5 han superado su garantía de fabricante estándar de 24 meses y ' +
        'no veo indexado ningún contrato de garantía extendida o servicio completo para ninguna — un ' +
        'hueco de cobertura real que conviene confirmar con el vendedor.',
      citations: [
        {
          id: 'cit-meridian-qa-warranty-1',
          documentId: 'doc-meridian-warranty',
          documentName: 'Turbine Warranty Schedule',
          locator: 'p. 2',
          snippet: 'COD Activo 2: 2023-11; COD Activo 5: 2024-02. Plazo de garantía estándar: 24 meses.',
        },
      ],
    },
    {
      keywords: ['derecho de suelo', 'servidumbre'],
      content:
        'Las servidumbres están registradas en los seis emplazamientos. A una de ellas (Activo 3) le ' +
        'falta la firma del propietario en la última enmienda — algo administrativo más que sustantivo, ' +
        'pero conviene resolverlo antes de firmar.',
      citations: [
        {
          id: 'cit-meridian-qa-land-1',
          documentId: 'doc-meridian-land',
          documentName: 'Land Easement Register',
          locator: 'entrada 3',
          snippet: 'Firma de la enmienda: pendiente de ejecución por el propietario.',
        },
      ],
    },
  ],
  solstice: [
    {
      keywords: ['riesgo clave', 'riesgo principal'],
      content:
        'Para un pipeline en preconstrucción, el riesgo principal es la confirmación de fase: el ' +
        'Proyecto D tiene control de suelo pero ninguna posición confirmada en la cola de interconexión ' +
        'en la documentación indexada, así que no debería contarse todavía como pipeline valorado.',
      citations: [
        {
          id: 'cit-solstice-qa-risk-1',
          documentId: 'doc-solstice-pipeline',
          documentName: 'Development Pipeline Register',
          locator: 'p. 6',
          snippet: 'Proyecto D: control de suelo asegurado 2026-02; posición en cola de interconexión: pendiente de confirmación.',
        },
      ],
    },
    {
      keywords: ['pipeline de desarrollo', 'fase del pipeline', 'pipeline'],
      content:
        'El registro recoge 4 proyectos BESS en fase temprana. Tres tienen control de suelo confirmado ' +
        'y un expediente de permisos activo; el Proyecto D tiene control de suelo pero ninguna posición ' +
        'confirmada en la cola de interconexión todavía.',
      citations: [
        {
          id: 'cit-solstice-qa-pipeline-1',
          documentId: 'doc-solstice-pipeline',
          documentName: 'Development Pipeline Register',
          locator: 'p. 6',
          snippet: 'Proyecto D: control de suelo asegurado 2026-02; posición en cola de interconexión: pendiente de confirmación.',
        },
      ],
    },
    {
      keywords: ['interconexión', 'interconexion', 'cola'],
      content:
        'Tres proyectos tienen una carta confirmada de posición en la cola de interconexión por parte ' +
        'de la distribuidora. El Proyecto D no — ese es el único punto abierto que señalaría antes de ' +
        'tratar el pipeline completo como valorado.',
      citations: [
        {
          id: 'cit-solstice-qa-queue-1',
          documentId: 'doc-solstice-interconnection',
          documentName: 'Interconnection Queue Position Letters',
          locator: 'resumen, p. 1',
          snippet: '3 de 4 proyectos tienen una carta de posición en cola ejecutada, a fecha de la última actualización del portfolio.',
        },
      ],
    },
  ],
}

export const FALLBACK_ANSWERS_ES: Record<string, string> = {
  helios:
    'No he encontrado una coincidencia directa para eso en la documentación indexada de Project ' +
    'Helios. Prueba a preguntar sobre la conexión a red, la tenencia de suelo, el PPA frente al modelo ' +
    'financiero, o los pasivos laborales — o reformula la pregunta.',
  meridian:
    'No he encontrado una coincidencia directa para eso en la documentación indexada de Project ' +
    'Meridian. Prueba a preguntar sobre las garantías de disponibilidad de O&M, las garantías de las ' +
    'turbinas, o los derechos de suelo — o reformula la pregunta.',
  solstice:
    'Project Solstice está cerrada y solo tiene un conjunto pequeño de documentos indexados. No tengo ' +
    'información fundamentada para responder a eso — prueba a preguntar sobre el pipeline de ' +
    'desarrollo o el estado de la cola de interconexión, o solicita la documentación que falta.',
}

export const DEFAULT_FALLBACK_ES =
  'No tengo suficiente documentación indexada para responder a eso en esta operación. Considera ' +
  'solicitar el documento que falta en vez de adivinar.'
