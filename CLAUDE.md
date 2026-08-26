# Contexto para agentes — Saeta Brain Platform (frontend de POC)

Este fichero lo lee Claude Code al abrir el proyecto. El detalle funcional está en `docs/`:
léelo antes de diseñar una pantalla nueva.

## Qué es esto y para qué sirve

BEAI Energy respondió a una RFP de Saeta Yield ("Piloto de Second Brain de M&A") con una
propuesta técnica ("Saeta Brain Platform"). Este repo **no es ese piloto** — es un frontend de
**POC/demo** que BEAI va a desplegar y entregar a Saeta con un usuario y contraseña para que lo
prueben, como parte del proceso de venta. El objetivo único de este repo es **ayudar a ganar la
RFP**: tiene que parecer, en pantalla, que la solución de la propuesta ya funciona.

Consecuencias directas de ese objetivo:

- Prioriza lo que se **ve y se toca** sobre lo que sería correcto construir en un producto real
  (backend, seguridad, persistencia). Si algo no se ve, no aporta a este repo.
- Cada pantalla debería poder señalar a un requisito (`R-01`…`R-20`) o caso de uso
  (`UC-01`…`UC-09`) de la RFP — es literalmente la checklist que un evaluador de Saeta va a usar.
- Donde la propuesta real de BEAI dejó algo pendiente o a medias (el portal, por ejemplo, está
  marcado `[PENDIENTE]` en el PDF original), aquí **no se nota**: se decide algo concreto y se
  construye completo. Ver `docs/beai-proposal-summary.md` → "Nota de honestidad".

## Fuentes de verdad — leer antes de tomar decisiones de producto

- `docs/rfp-second-brain-ma.md` — la RFP de Saeta: principios, alcance, casos de uso (UC-01 a
  UC-09), requisitos (R-01 a R-20), entregables, criterios eliminatorios, calendario.
- `docs/beai-proposal-summary.md` — la propuesta de BEAI: qué prometió, el modelo de agente
  configurable (6 piezas), la pantalla de observabilidad (coste/traza/razonamiento) y qué le
  pidió a Saeta antes de empezar.

Ambos son transcripciones de trabajo de los PDF originales que el usuario compartió en la
sesión donde se creó este repo; los PDF en sí no están en el repo. Si aparece una duda que estos
dos ficheros no resuelven, pregunta al usuario en vez de inventar un requisito.

## Naturaleza de la POC — nunca lo olvides

- **100% frontend, sin backend, sin base de datos, sin servicios externos.** No hay llamada
  real a SharePoint, Azure OpenAI, Entra ID ni nada por el estilo. Todo dato (operación de
  M&A, documentos, Key Issue List, resumen, memoria derivada, coste, trazas) es **mock
  hardcodeado** en el propio repo.
- Datos siempre **ficticios/anonimizados** — nunca inventes que son de una operación real de
  Saeta ni metas datos sensibles de verdad. Coherente con el principio 1/2 de la RFP.
- **Login con una contraseña hardcodeada tipo "admin"**, sin validación real ni backend detrás.
  Es una puerta simbólica para que el evaluador de Saeta sienta que "entra a una herramienta",
  no un mecanismo de seguridad. No hay que justificar esto con infraestructura de auth real:
  si algún día se pide seguridad de verdad, es una conversación nueva con el usuario, no una
  mejora que se hace por iniciativa propia.
- No se planea (a fecha de este documento) conectar nunca esta POC a un backend real. Si el
  usuario lo pide más adelante, es un cambio de alcance explícito — no lo asumas por defecto.

## Referencia de estilo: `../TMEIC-Ports-Frontend` — **nunca se toca**

Al lado de este repo (`SaetaPoc-front/TMEIC-Ports-Frontend`) hay un proyecto real de otro
cliente, subido **únicamente como referencia visual**. Reglas, sin excepción:

1. **No se edita nada ahí. Nunca.** Ni un typo, ni un rename, ni un `git init`. No es parte de
   este repo.
2. Se usa solo para **copiar estructura y estilo** de tres piezas concretas — login, sidebar,
   header/app-shell — adaptándolas a Saeta, no para copiar su dominio (tickets, KPIs de grúas,
   N1) ni sus textos.
3. Tiene su propio `CLAUDE.md` — dale una lectura si quieres el porqué de sus decisiones, pero
   no lo sigas como si fuera este proyecto: fue escrito para otro cliente.

Piezas concretas dignas de imitar (rutas dentro de `TMEIC-Ports-Frontend/src`):

- **Sistema de diseño en 3 niveles** (`shared/styles/tokens.css`): primitivas de marca → nunca
  se usan directo en componentes → semánticos (`--color-bg`, `--color-primary`,
  `--color-surface`…) → escalas (espaciado, radio, tipografía, sombra, z-index). El modo
  oscuro solo re-apunta los semánticos en un bloque `[data-theme='dark']`. **Sin Tailwind**:
  CSS propio con `var(--token)` y clases BEM (`sidebar__link--active`).
- **`app/layout/AppShell.tsx`**: shell con sidebar + header + `<main>` con `Outlet`, un drawer
  para móvil y overlay al abrirlo. Estructura de clases: `shell`, `shell__sidebar`,
  `shell__main`, `shell__content`.
- **`app/layout/Sidebar.tsx`**: logo arriba (enlaza al portal), navegación agrupada por
  secciones con título, link activo vía `NavLink`, usuario (iniciales + nombre + rol) abajo.
- **`app/layout/Header.tsx`**: botón de menú (móvil), nombre de la app, espaciador, y a la
  derecha los controles (rol/tema/idioma/menú de usuario).
- **`pages/LoginPage.tsx` + `features/auth/components/LoginForm.tsx`**: pantalla partida —
  panel de marca a pantalla completa (logo, propuesta de valor en 3 puntos, red decorativa
  SVG de fondo) con una tarjeta de login centrada (email + password con icono, botón primario,
  aviso de que es un entorno de demo). Ese aviso de demo es lo único que sí conviene mantener
  literal: aquí también hay que ser honesto en pantalla de que es una demo, aunque la
  contraseña esté hardcodeada en vez de simulada por dominio de correo.
- El resto de primitivas de UI (`shared/ui/Button`, `Badge`, `Pill`, `SegmentedControl`,
  `ThemeToggle`, etc.) son un buen catálogo de qué construir si hace falta, pero no es
  obligatorio copiarlas todas — solo lo que las tres piezas de arriba necesiten.

**Branding — decisión ya tomada (2026-08-26)**: los colores de TMEIC (navy `#12233f`, azul
`#0f4c81`, rojo de marca) eran de ese cliente, no de Saeta. Saeta compartió su logo (PNG,
icono en forma de aspa/pinwheel en naranja/rojo/verde-lima/turquesa + wordmark "saetayield" en
navy oscuro). Se derivó de ahí una paleta provisional en `src/shared/styles/tokens.css`
(primitivas `--saeta-navy`, `--saeta-orange`, `--saeta-red`, `--saeta-lime`, `--saeta-teal`) —
sigue siendo provisional en el sentido de que no son hex oficiales de un manual de marca, pero
ya no hay que preguntar antes de usarlos: están centralizados en un solo fichero por si Saeta
da una guía de marca distinta más adelante. El logo real vive en
`public/brand/saeta-logo.png` — si ese fichero no existe todavía, `SaetaLogo` (`shared/ui/
SaetaLogo`) cae a un wordmark de texto, no rompe la app.

## Stack (decisión ya tomada, ver sesión 2026-08-26)

Vite + React + TypeScript, `react-router-dom`, `zustand`, `react-i18next`, `lucide-react`,
`recharts`, CSS plano con custom properties (sin Tailwind, BEM) — el mismo stack y las mismas
convenciones que `TMEIC-Ports-Frontend`, reutilizadas a propósito porque el usuario pidió
explícitamente "usa la misma librería de componentes... y el mismo stack técnico". Diferencia
deliberada: **sin `react-query` ni cliente HTTP** — esta POC no tiene backend en absoluto (ni
siquiera simulado con `isLive()` como en TMEIC), así que esa capa entera sobraba; cada acción de
agente se simula con `sleep()` (`shared/lib/utils`) + estado local o un store de Zustand.

**Idioma — decisión ya tomada**: interfaz **bilingüe** inglés/español con **inglés por
defecto**, contra lo que decía la primera versión de este documento. Es un requisito explícito y
no negociable de la RFP de Saeta ("interfaz en inglés como idioma principal"), confirmado
directamente por el usuario. `react-i18next`, un namespace JSON por feature en
`shared/lib/i18n/locales/{en,es}/`, igual que en TMEIC-Ports-Frontend — la regla "los dos
idiomas o ninguno" se mantiene.

## Mapa funcional

La fuente de verdad detallada, pantalla por pantalla, es **`docs/guion-pantallas.md`** — un
documento de guion de pantallas específico (no solo la RFP en bruto) que el usuario compartió en
la sesión del 2026-08-26 y que ya incorpora las decisiones de esta sección. Léelo antes de tocar
cualquier pantalla nueva; lo que sigue aquí es solo el resumen de alto nivel.

- Login → **selector de aplicaciones multi-app** (`/apps`, dos tarjetas: "M&A Platform" activa y
  "Next Applications" deshabilitada) → selector de operación/carpeta (`/ma/operations`, 2-3
  operaciones de ejemplo con datos distintos entre sí, para demostrar segregación real) → shell
  de la operación. **Es multi-app a propósito** (contra lo que decía la primera versión de este
  documento): el propio guion lo pide como forma de contar visualmente la historia de "un
  núcleo, muchos casos de uso" del principio 8 de la RFP, no como scope creep.
- Vista de operación con, como mínimo: chat con fuentes citadas (UC-01), resumen estructurado
  (UC-02), Key Issue List (UC-03), hechos/inferencias/hipótesis (UC-04), gaps y contradicciones
  (UC-05), seguimiento + preguntas para vendedor/asesores (UC-06), auditoría de modelo
  financiero (UC-07, mock, "sobre una copia"), borradores de informes (UC-08).
- Memoria persistente / conocimiento derivado (UC-09): en Analítica IA → Long-term memory, con
  versión, procedencia, estado (propuesto/aprobado/rechazado/revertido) y quién decidió — es el
  requisito visualmente más importante de toda la RFP (R-03, R-04, R-05), y la propia pantalla
  más importante de la POC según el guion.
- Observabilidad: coste por caso de uso + traza de ejecución + razonamiento del agente —
  inspirado literalmente en la propuesta de BEAI (`docs/beai-proposal-summary.md`, sección de
  observabilidad).
- Patrón "config de agente" reutilizable (Prompt + Skills editables, Modelo/Tools/Middleware de
  solo lectura) — un icono de engranaje en cada pantalla con salida de agente, ver §6 del guion
  para qué `agentId` va en cada una. Ya implementado en `src/features/agent-config`.
- Simulador de rol Admin/Usuario (guion §1.5), siempre visible en el header — afecta a Analítica
  IA completa y al subapartado de Conocimiento base dentro de Documentación.

## Reglas de comportamiento

1. **`../TMEIC-Ports-Frontend` es de solo lectura, siempre.** Si una tarea parece requerir
   tocar algo ahí, para y pregunta — seguramente el fichero correcto está en este repo.
2. **Nunca añadas backend, base de datos, o llamada de red real** (a un LLM, a SharePoint, a
   Azure, a lo que sea) sin que el usuario lo pida de forma explícita. El valor de esta POC es
   que se pueda desplegar como sitio estático, sin infraestructura.
3. **No inventes branding.** Ante ambigüedad de color/logo/nombre de producto, pregunta antes
   de fijarlo — es fácil que cueste deshacer luego.
4. **Los datos son de mentira, y hay que decirlo con dignidad**, no ocultarlo mal: sigue el
   ejemplo del `login-form__hint` de TMEIC (avisar con una frase discreta de que es un entorno
   de demo) en vez de fingir un backend que no existe con literales sueltos por el código.
5. **Cada pantalla nueva se justifica contra la RFP.** Si no responde a un UC o un R, probablemente
   no hace falta para ganar la propuesta.
6. Antes de dar algo por terminado, compila (`npm run build` o el script que se establezca) y
   **compruébalo en el navegador** — un frontend de demo se juzga por cómo se ve, no solo por
   si compila. **Aviso (2026-08-26): esta máquina de desarrollo no tiene Node.js instalado.**
   No se ha podido ejecutar `npm install`, `npm run build`, `npm run typecheck` ni `npm run dev`
   en ningún momento de la construcción inicial de esta POC — todo el código se escribió leyendo
   con cuidado las firmas de los componentes de `shared/ui` en vez de verificar con el
   compilador. **Es el primer paso pendiente**: instalar Node.js, correr `npm install` y las
   cuatro comprobaciones, y arreglar lo que salte, antes de dar la POC por lista para enseñar.
7. Este repo puede acabar siendo visible para gente ajena a BEAI (es lo que se entrega al
   cliente). No metas aquí URLs, credenciales o datos internos reales de BeAI ni de Saeta —
   solo lo estrictamente necesario para la demo, y siempre ficticio.

## Estado actual (actualizado 2026-08-26)

Primera construcción completa hecha en una sesión (ver `docs/guion-pantallas.md` para el detalle
pantalla por pantalla). El `.gitgnore` con el nombre mal escrito ya se corrigió; no hay ningún
commit todavía en este repo, solo el working tree.

**Base/spine construida directamente (no delegada), completa**: scaffold de Vite/TS/ESLint/
Prettier, sistema de diseño (`shared/styles/tokens.css` con paleta Saeta), kit de UI copiado y
adaptado de TMEIC-Ports-Frontend (`shared/ui/*`, más `SectionShell` y `SaetaLogo` nuevos), i18n
bilingüe con 12 namespaces, routing completo (`app/router/router.tsx`) con guarda de admin
(`RequireAdmin`), login (`pages/LoginPage.tsx`), selector de apps (`features/app-selector`),
selector de operación con 3 operaciones mock (`features/operations`: `helios`/`meridian`/
`solstice`), roles (`shared/stores/roleStore.ts`), y el patrón completo de config de agente
(`features/agent-config`, con su modal, las Skills y los 5 `agentId` del guion §6) — incluye
también la pantalla `documents/knowledge` (§5.2.2), construida junto con agent-config porque
comparte su componente `SkillList`.

**Los 6 bloques de contenido restantes ya están completos**: `chat`, `documents` + `gaps` +
`knowledge`, el grupo `summary` (overview/key-issues/facts/tracking), `financial-model`,
`reports`, y el grupo `analytics` (cost/traces/memory). Se repartieron en paralelo a 6 subagentes
con un briefing apuntando a `docs/guion-pantallas.md`; 5 de los 6 agotaron el límite de sesión de
la API a mitad de trabajo (`chat`, `documents`, `summary`, `reports`, `analytics` — solo
`financial-model` llegó a terminar solo). Se revisó el estado que dejó cada uno y se completó a
mano lo que faltaba: en `summary` faltaban las pantallas de Hechos vs conclusiones y Seguimiento
enteras; en `reports` faltaba la pantalla que ensamblaba los componentes ya construidos; en
`analytics` faltaban la pantalla de Trazas (los componentes ya existían, solo faltaba
ensamblarlos) y **toda** la pantalla de Long-term Memory (la más importante de la POC según el
propio guion) — construida desde cero sobre el store y los tipos que el agente sí había dejado
listos. También se rellenaron los namespaces de i18n que se habían quedado vacíos
(`summary.json`, `reports.json`, `analytics.json`, en/es) y se crearon los barrels que faltaban.

Un aviso que sobrevivió sin incidente: dos agentes (`documents` y `summary`) recibieron
instrucciones de construir el patrón "estado insuficiente" (guion §1.7) con salidas distintas por
si ya existía uno (`documents` podía subirlo a `shared/ui`, `summary` debía caer a una versión
local si no lo encontraba) — el agente de `documents` sí construyó
`shared/ui/InsufficientDataBanner` (mejor diseño que el borrador inicial de esta sesión, que
sobrescribió sin problema) y `summary` cayó correctamente a su propio `InsufficientDataNote`
local: cero solapamiento real, tal y como se había previsto al reparar el reparto de trabajo.

**Siguiente paso, sin excepción**: instalar Node.js, correr
`npm install && npm run typecheck && npm run lint && npm run build`, arreglar lo que salte (muy
probable en una primera pasada, dado que nada se ha compilado nunca), y probar la demo completa
en el navegador — operación por operación, pantalla por pantalla — antes de darla por lista para
enseñar a Saeta. También falta copiar el logo real a `public/brand/saeta-logo.png` (hoy cae a un
wordmark de texto).
