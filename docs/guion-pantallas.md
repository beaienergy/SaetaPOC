# Guion de pantallas · Saeta 2nd Brain (POC frontend)

> Transcripción a Markdown del guion de pantallas original (documento de trabajo,
> agosto 2026). Es la fuente de verdad de qué pantallas y subpantallas tiene el
> frontend React del piloto M&A, y qué debe contener cada una. Se referencia
> continuamente a los casos de uso (UC-01…UC-09) y requisitos (R-01…R-20) de
> `rfp-second-brain-ma.md`, y a la terminología de `beai-proposal-summary.md`
> (Modelo, Prompt, Tools, Skills, Middleware, Long-term Memory).
>
> Nota de alcance: la RFP pide un piloto sobre una única operación histórica
> anonimizada, no una plataforma multi-operación. La estructura de "carpetas por
> cliente" del punto 4 no contradice eso: es la forma de DEMOSTRAR que la
> arquitectura es reutilizable y que hay segregación real entre operaciones,
> aunque en producción el piloto solo tenga una carpeta activa. Para la POC, 2-3
> carpetas de ejemplo son las que hacen la demo interesante (en este repo: las
> operaciones `helios`, `meridian`, `solstice` — ver `features/operations`).

## 0 · Mapa de navegación

Cada nodo con subrutas implica un segundo sidebar contextual (ver §1.3). El resto
son pantallas de una sola vista.

```
/login
/apps                                    — selector de aplicaciones
/ma                                      — "M&A Platform"
  /ma/operations                         — selector de operación / cliente (carpetas)
  /ma/operations/:id/                    — shell persistente (header + sidebar) desde aquí
    chat                                 — Chat + historial
    documents                            — Documentación (ingesta)
      documents/gaps                     — Gaps y contradicciones
      documents/knowledge                — Conocimiento base / Skills (admin)
    summary                              — Resumen de la operación
      summary/overview                   — Procesamiento interno / snapshot
      summary/key-issues                 — Key Issue List
      summary/facts                      — Hechos vs conclusiones
      summary/tracking                   — Seguimiento + Q&A vendedor/asesores
    financial-model                      — Modelo financiero
    reports                              — Informes
    analytics                            — Analítica IA (solo admin)
      analytics/cost                     — Coste y uso de modelos
      analytics/traces                   — Traza de ejecución / razonamiento
      analytics/memory                   — Long-term memory (solo admin)
  perfil / settings                      — colgados del header, no del sidebar
```

En este repo las rutas reales viven en `src/shared/config/routes.ts` (`ROUTES`) —
usa esas funciones, no construyas las URLs a mano.

## 1 · Estructura global — se repite en todo /ma/operations/:id/*

### 1.1 Header central de la aplicación
- Botón de vuelta a `/apps` (el selector de aplicaciones, no al login).
- Nombre de la operación/cliente activo, con un desplegable rápido para cambiar
  de operación sin pasar por `/ma/operations`.
- Menú de usuario: perfil, settings, logout.
- Indicador de rol (Admin / Usuario) — ver §1.5.

*(Ya implementado en `src/app/layout/Header.tsx`.)*

### 1.2 Sidebar primario
Un icono/entrada por cada bloque de negocio: Chat, Documentación, Resumen de la
operación, Modelo financiero, Informes, y Analítica IA (solo admin).

*(Ya implementado en `src/app/layout/Sidebar.tsx`.)*

### 1.3 Sidebar secundario (contextual)
Aparece cuando la sección activa tiene subpantallas: Documentación, Resumen de
la operación, Analítica IA. Mismo patrón en las tres — lista vertical de
subsecciones, la activa resaltada. No es un componente nuevo por sección, es el
mismo patrón reutilizado con distinto contenido.

*(Ya implementado como `SectionShell` en `src/shared/ui/SectionShell`, usado
desde `src/pages/DocumentsSectionLayout.tsx`, `SummarySectionLayout.tsx` y
`AnalyticsSectionLayout.tsx`.)*

### 1.4 Patrón "config de agente" — reutilizable
Todo agente que trabaja en la app muestra un icono de engranaje junto a su
nombre o su salida. Al pinchar abre un modal con:
- **Prompt** — textarea editable, con botón guardar / restaurar por defecto.
- **Skills** — lista de fichas (título + texto del procedimiento): añadir,
  editar, borrar. Es el conocimiento experto sembrado de antemano ("cómo se
  construye una Key Issue List"), **no** la memoria de largo plazo.
- Chips de solo lectura para **Modelo**, **Tools** y **Middleware** — visibles,
  pero marcados "gestionado por la plataforma" y no editables desde aquí.

*(Ya implementado: `src/features/agent-config` — `<AgentConfigButton opId
agentId>` abre el modal. Los 5 `agentId` y dónde va cada uno están en §6 de
este documento.)*

### 1.5 Simulación de rol — solo POC
Sin autenticación real, un selector visible (header) tipo "Viendo como: Usuario
/ Admin" que muestre u oculte lo que en producción dependería de permisos
reales: Analítica IA completa, y dentro de Documentación, el subapartado de
Conocimiento base. Es un affordance de demo, no un control de seguridad real.

*(Ya implementado: `src/shared/stores/roleStore.ts`, siempre visible en el
header vía `SegmentedControl`. La guarda de rutas está en
`src/app/router/RequireAdmin.tsx`.)*

### 1.6 Cita / fuente
Todo texto generado por un agente debería poder señalar de qué documento sale —
chip clicable que abre el fragmento en Documentación. Debe estar presente en
**cualquier** pantalla con output de IA: es el argumento central de la RFP
(R-02).

El tipo `Citation` ya existe en `src/shared/types/domain.ts`:
```ts
interface Citation {
  id: string
  documentId: string
  documentName: string
  locator: string   // ej. "p. 12", "cláusula 4.3", "pestaña 'Sensitivities', celda C14"
  snippet?: string
}
```
Construye un componente pequeño y reutilizable (chip "[1]" clicable, con
tooltip/preview del snippet) donde haga falta — no dupliques la lógica en cada
pantalla que cite fuentes.

### 1.7 Estado insuficiente / gap
Banner + CTA reutilizable para cuando el sistema no tiene información
suficiente: mensaje corto + "Pedir intervención humana" / "Solicitar
documentación". Se usa en el resumen automático (§5.3.1) y en Gaps y
contradicciones (§5.2.1).

*(Ya implementado: `src/shared/ui/InsufficientDataBanner` — `<InsufficientDataBanner
message="..." actions={[{ label: '...', onClick: () => {} }]} />`. Úsalo tal
cual, no construyas otro.)*

## 2 · Pantalla /login
*(Ya implementado: `src/pages/LoginPage.tsx` + `src/features/auth`.)*

## 3 · Pantalla /apps — Selector de aplicaciones
*(Ya implementado: `src/features/app-selector`.)*

## 4 · Pantalla /ma/operations — Selector de operación / cliente
*(Ya implementado: `src/features/operations`. Las 3 operaciones de ejemplo
—`helios`, `meridian`, `solstice`— están en
`src/features/operations/api/mockOperations.ts`. Cualquier mock nuevo de otra
feature debe usar estos mismos IDs y mantener la coherencia: Helios es la más
rica en contenido, Meridian intermedia, Solstice más pequeña y cerrada
(`status: 'closed'`).)*

## 5 · Dentro de una operación (/ma/operations/:id/...)

### 5.1 Chat + historial — UC-01, R-02
Patrón NotebookLM: tres columnas.
- **Izquierda — historial:** conversaciones anteriores agrupadas por fecha,
  botón "nueva conversación", buscador simple.
- **Centro — hilo de chat:** mensajes usuario/agente; cada respuesta con citas
  inline (chip "[1] [2]" clicable, patrón §1.6); sugerencias de arranque
  específicas de M&A ("¿Cuáles son los riesgos clave de esta operación?").
- **Derecha — fuentes:** documentos de la operación con checkbox de inclusión
  en el contexto, resaltando qué fragmento se usó en la última respuesta.
- Cabecera con icono de config de agente (§1.4, `agentId="chat"`) — "agente de
  consulta general".
- Opcional: chip no interactivo "Modelo: enrutado automáticamente por
  coste/calidad" — conecta con R-14 sin necesidad de ser funcional.

Simula respuestas del agente con un delay (`sleep()` de `shared/lib/utils`), no
hace falta streaming token a token real, aunque un efecto de "escribiendo…" es
bienvenido si no complica el código.

**Archivos**: `src/pages/ChatPage.tsx` (ya existe como placeholder, reemplázalo)
+ todo lo que haga falta bajo `src/features/chat/` (types, mock data por
operación, componentes, store si hace falta). Namespace i18n: `chat` (en/es, ya
seedeados vacíos en `src/shared/lib/i18n/locales/{en,es}/chat.json` — reléllalos
tú, y regístralos ya están en `i18n.ts`).

### 5.2 Documentación (ingesta de conocimiento) — R-05, E-08

**Pantalla principal** (`documents`)
- Tabla de documentos: nombre, categoría (usa la taxonomía de las disciplinas de
  DD: Legal, Fiscal, Laboral, Técnica, ESG, Comercial, Financiera, Seguros,
  Laboral/RRHH, Medioambiental, Propiedad Intelectual — elige un subconjunto
  razonable, no hace falta usarlas las 11 literalmente), versión, fecha de
  subida, estado (indexado / pendiente / error).
- Zona de "subir documentos" (drag & drop, sin procesamiento real — un botón que
  simula añadir un documento mock a la lista basta).
- Panel de detalle al abrir un documento: metadatos, previsualización (mock),
  historial de versiones, quién lo subió.

**documents/gaps — 5.2.1 Gaps y contradicciones — UC-05**
- Lista de incidencias con tres tipos: documentación pendiente, versiones
  incompatibles, incoherencias entre informes.
- Cada incidencia: descripción, documentos afectados (enlazados), severidad,
  estado (abierta / resuelta / descartada).
- Usa el patrón "estado insuficiente" (§1.7) cuando la incidencia es
  documentación pendiente: botón para solicitar la subida.
- Bastan 5-6 incidencias de ejemplo por operación, dejando claro que es
  contenido de ejemplo.

**documents/knowledge — 5.2.2 Conocimiento base / Skills — solo admin**
*(Ya implementado: `src/pages/DocumentsKnowledgePage.tsx`, usa
`src/features/agent-config`. No dupliques esto.)*

**Archivos**: `src/pages/DocumentsPage.tsx` y `DocumentsGapsPage.tsx` (ya
existen como placeholders) + `src/features/documents/` (types, mock data,
componentes). Namespace i18n: `documents` — YA TIENE dos claves puestas por
`DocumentsKnowledgePage.tsx` (`knowledge.title`, `knowledge.agentsTitle`),
añade el resto sin tocar esas dos.

### 5.3 Resumen de la operación — UC-02, UC-03, UC-04, UC-06

**summary/overview — 5.3.1 Procesamiento interno / snapshot — UC-02**
- Ficha de operación generada por el sistema: perímetro, partes, hitos, estado,
  asuntos clave — cada campo con su cita de fuente (§1.6).
- Marca de "generado automáticamente" + fecha/hora del último análisis + botón
  "regenerar" (simulado, con `sleep()`).
- Si no hay documentación suficiente para un campo, usa el patrón de §1.7,
  campo por campo si hace falta.
- Icono de config de agente (`agentId="summary-overview"`).

**summary/key-issues — 5.3.2 Key Issue List — UC-03**
- Tabla: Riesgo, Evidencia (enlazada a documento), Impacto, Responsable,
  Mitigación, Estado.
- Botón "Generar borrador" (simulado) que rellena la tabla.
- Fila expandible/drawer de detalle, edición inline, badges de estado (Abierto /
  Mitigado / Escalado).
- Botón de exportar (mock) + icono de config de agente (`agentId="key-issues"`).

**summary/facts — 5.3.3 Hechos vs conclusiones — UC-04**
- Tres bloques separados visualmente: Hechos (con fuente), Inferencias
  (razonamiento del agente, marcado como tal), Hipótesis / pendientes de
  confirmar.
- Cada elemento con su cita, y acción "convertir en asunto de la Key Issue
  List" para conectar con 5.3.2 (puede ser un botón que no haga nada funcional
  más que un toast/confirmación — no hace falta compartir estado real entre
  pantallas si complica demasiado).
- Icono de config de agente: comparte el mismo `agentId="summary-overview"`
  (decisión ya tomada — "puede compartir agente con overview").

**summary/tracking — 5.3.4 Seguimiento de la operación — UC-06**
- Lista/tablero de acciones pendientes: acción, responsable, fecha límite,
  estado.
- Subapartado (pestaña dentro de la misma vista, sin ruta propia): Preguntas
  para vendedor/asesores — banco de preguntas por tema, cada una con estado
  (pendiente / respondida), evidencia relacionada y un borrador de respuesta
  generado por el agente.
- No hay tracker de etapas de la propuesta comercial disponible en este repo
  (vivía en un documento de venta al que no tenemos acceso) — simplifica con
  una barra de estado propia (ej. badges de fase) en vez de intentar
  reconstruir algo que no se ha visto.

**Archivos**: `src/pages/SummaryOverviewPage.tsx`, `SummaryKeyIssuesPage.tsx`,
`SummaryFactsPage.tsx`, `SummaryTrackingPage.tsx` (ya existen como
placeholders) + `src/features/summary/`. Namespace i18n: `summary`.

### 5.4 Modelo financiero — UC-07
- Banner fijo y visible: "Trabajando sobre una copia — el archivo original no
  se modifica" — requisito explícito de la RFP, debe verse sin poder ignorarse.
- Lista de modelos financieros cargados (con versión).
- Acción "Auditar" (simulada, con `sleep()`) → panel de resultados: hallazgos
  de consistencia (fórmulas rotas, links externos, valores hardcodeados,
  circularidades), cada uno con severidad y referencia a hoja/celda.
- Sección opcional de sensibilidades: tabla de asunciones y resultados por
  escenario.
- Bastan 6-8 hallazgos de ejemplo bien etiquetados por operación.
- Icono de config de agente (`agentId="financial-audit"`).

**Archivos**: `src/pages/FinancialModelPage.tsx` (ya existe como placeholder) +
`src/features/financial-model/`. Namespace i18n: `financialModel`.

### 5.5 Informes — UC-08
- Lista de plantillas disponibles (resumen ejecutivo, IC memo, informe de
  estado…).
- Flujo: elegir plantilla → elegir secciones/fuentes a incluir → "generar
  borrador" (simulado) → vista previa en editor de texto enriquecido (puede ser
  tan simple como un bloque de texto formateado, no hace falta un rich text
  editor real) con panel de citas al lado.
- Historial de versiones de informes generados. Exportar (mock: PDF / Word /
  PPT — un botón que simula la descarga o muestra un toast basta). Icono de
  config de agente (`agentId="reports"`).

**Archivos**: `src/pages/ReportsPage.tsx` (ya existe como placeholder) +
`src/features/reports/`. Namespace i18n: `reports`.

### 5.6 Analítica IA — solo admin — R-18, R-04, UC-09

**analytics/cost — 5.6.1 Coste y uso de modelos**
- Dashboard con 3-4 paneles: coste en el tiempo, coste por operación/aplicación,
  consumo por agente/modelo, tasa de éxito/error. Usa `recharts` (ya es
  dependencia del proyecto) para los gráficos.
- Filtros por operación, rango de fechas y agente (pueden ser no-funcionales o
  funcionar sobre los propios datos mock).
- Ejemplo de cifras de la propuesta de BEAI (mismo orden de magnitud, no hace
  falta copiar los números literales): coste por caso de uso — Consulta ~120,
  Resumen ~240, KIL ~420, Modelo financiero ~310 (unidad de coste arbitraria,
  indícalo).

**analytics/traces — 5.6.2 Traza de ejecución / razonamiento**
- Log expandible: cada ejecución de un flow o agente, paso a paso, con qué
  operación/aplicación la originó, qué modelo se usó en cada paso interno,
  resultado.
- Inspiración directa (propuesta BEAI, slide 22): pasos tipo "entrada →
  autenticación → flow ingesta → flow extracción → agente KIL borrador", y
  turnos de razonamiento con tokens y qué tool/middleware disparó cada uno
  ("turno 1 · modelo · 1.240 tk", "turno 1 · tool: conocimiento", "turno 2 ·
  middleware: cita…").
- Demuestra que el consumo interno del razonamiento es tan visible como
  cualquier llamada directa.

**analytics/memory — 5.6.3 Long-term Memory — solo admin — R-04**
- **La pantalla más importante de la POC** (según el propio guion): el único
  sitio donde se ve en pantalla el ciclo completo "usar → aprender → aprobar →
  mejorar".
- Aquí, NO en Documentación: esta es la memoria que crece con el uso real, no
  el conocimiento sembrado de antemano (eso es `features/agent-config`,
  Skills).
- Lista de propuestas de actualización de memoria generadas por el uso de los
  agentes: qué se propone añadir/cambiar, qué agente/conversación lo originó,
  evidencia.
- Vista de comparación (antes/después, tipo diff) para cada propuesta.
- Acciones: Aprobar / Rechazar / Revertir, con registro de quién y cuándo —
  aunque sea mock, debe quedar visible el trazo de auditoría.

**Archivos**: `src/pages/AnalyticsCostPage.tsx`, `AnalyticsTracesPage.tsx`,
`AnalyticsMemoryPage.tsx` (ya existen como placeholders) +
`src/features/analytics/`. Namespace i18n: `analytics`.

## 6 · Dónde aparece el botón de config de agente

| Pantalla | `agentId` | Agente configurable |
|---|---|---|
| Chat (§5.1) | `chat` | Agente de consulta / Q&A general |
| Resumen — overview (§5.3.1) | `summary-overview` | Agente de análisis y estructuración de la operación |
| Resumen — Key Issue List (§5.3.2) | `key-issues` | Agente generador de KIL |
| Resumen — Hechos vs conclusiones (§5.3.3) | `summary-overview` | Comparte config con overview (decisión ya tomada) |
| Modelo financiero (§5.4) | `financial-audit` | Agente de auditoría de consistencia |
| Informes (§5.5) | `reports` | Agente redactor de informes |

Todos abren el mismo modal reutilizable (`<AgentConfigButton opId={opId}
agentId="...">`, de `src/features/agent-config`) — no construyas un modal
nuevo, ya existe y está terminado.

## Convenciones técnicas del repo (léelas antes de escribir código)

- Capas: `app → pages → features → shared`. Una capa solo importa hacia la
  derecha. Una feature se consume solo por su barrel (`features/x/index.ts`),
  nunca por su interior. Ninguna feature/página importa de `@/app`.
- CSS propio con `var(--token)` de `shared/styles/tokens.css`, clases estilo
  BEM. Nada de Tailwind, nada de colores literales (`#hex` o `rgb()` sueltos).
- Todo texto visible pasa por i18n (`react-i18next`), un namespace por
  feature, en `shared/lib/i18n/locales/{es,en}/<namespace>.json`. Los dos
  idiomas o ninguno — si añades una clave, añádela en los dos ficheros.
- Sin backend real: usa `sleep()` de `@/shared/lib/utils` para simular
  latencia en acciones de agente ("generar", "auditar", "regenerar"). No hay
  `react-query`; un `useState` local + `sleep()` es suficiente.
- IDs de operación: `'helios' | 'meridian' | 'solstice'` — ya definidos en
  `src/features/operations/api/mockOperations.ts`. Cualquier mock nuevo va
  keyed por estos mismos IDs, `Record<string, T[]>` o similar.
- No toques: `src/app/**`, `src/shared/**` (salvo que falte algo imprescindible
  y no haya otra forma — en ese caso hazlo mínimo y documenta por qué),
  `src/features/auth`, `src/features/app-selector`, `src/features/operations`,
  `src/features/agent-config`, ni las páginas/archivos de otras features que no
  sean la tuya.
- El proyecto NO tiene Node.js instalado en esta máquina de desarrollo — no se
  puede compilar ni comprobar en el navegador ahora mismo. Escribe con especial
  cuidado de sintaxis y tipos (revisa las firmas de los componentes de
  `shared/ui` leyendo su código fuente antes de usarlos).
