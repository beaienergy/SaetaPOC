# Propuesta BEAI — Saeta Brain Platform (resumen de trabajo)

> Transcripción de trabajo de `SAETA_proposal_INFRA+BACKEND+ARCHITECTURE.pdf` (BEAI Energy,
> 25/08/2026), la propuesta técnica que BEAI ya envió a Saeta respondiendo a la RFP
> (`rfp-second-brain-ma.md`). **Este frontend de POC tiene que aparentar que ya es esto** — es
> el guion visual de la demo. Cuando haya que decidir cómo se ve o se comporta algo y la RFP no
> lo diga con precisión, mirar aquí primero.

## Posicionamiento

"Saeta Brain Platform": una plataforma agéntica reutilizable, de la que el piloto de M&A es
el **primer caso de uso**, no un fin en sí mismo. Mensaje de venta: "no partimos de cero" —
BEAI ya tiene esta arquitectura en producción en otros clientes (Ignis — energía renovable,
Azure-nativo; TMEIC Ports — industrial, multi-agente para tickets y KPIs). *(Nota: TMEIC Ports
es precisamente el proyecto de referencia visual `TMEIC-Ports-Frontend` de este repo — por eso
se reutiliza su estructura de login/sidebar/header: es coherente con el propio argumento de
venta de "patrón ya construido y probado".)*

## El portal "Saeta 2nd Brain"

Citado tal cual en la propuesta (slide 7, marcada `[PENDIENTE]` en el original — o sea, **la
propia BEAI dejó esto sin definir en detalle**, así que aquí hay más libertad de diseño, no
menos):

> "Una única superficie para consultar, validar y hacer crecer el conocimiento de la
> operación." El portal desde el que el equipo de M&A pregunta, revisa evidencia, aprueba
> actualizaciones de memoria y sigue el estado de cada operación.

Esto es literalmente la pantalla principal que este frontend debe construir bien, porque en la
propuesta real está pendiente de maquetar.

## Stack técnico prometido a Saeta (100% Azure, Microsoft-first)

| Capa | Tecnología prometida |
|---|---|
| Frontend | React — portal de usuario |
| Backend | FastAPI (Python) — orquestación de servicios, flows y agentes |
| IA y razonamiento | Azure OpenAI Foundry + Azure AI Document Intelligence |
| Datos y conocimiento | Azure Cosmos DB for MongoDB + Azure Blob Storage |
| Infra y seguridad | Azure Container Apps, Container Registry, Key Vault (Managed Identity), Microsoft Entra ID |
| Observabilidad | Application Insights + Log Analytics, detección de anomalías, analítica de coste/comportamiento del agente |

Arquitectura de despliegue real: frontend como única puerta pública, backend inalcanzable
desde fuera, conexión a la BD documental por *private endpoint*, secretos solo en Key Vault vía
Managed Identity. **Nada de esto aplica a esta POC** (no hay backend ni Azure real aquí), pero
es la referencia de "lo que se demuestra visualmente que ya existe": el frontend puede mostrar
badges/textos de tipo "SharePoint conectado", "Azure OpenAI", "cifrado en tránsito", etc. como
decorado creíble, sin implementarlo de verdad.

## Las 5 (+1) piezas configurables del "agente"

Argumento central de venta: no es un agente fijo, es un motor parametrizable. Un agente = 6
piezas configurables de forma independiente:

1. **Modelo** — el LLM que razona, enrutable por nombre (modelo barato para consultas simples,
   modelo potente para análisis profundo — responde a R-14).
2. **Prompt** — instrucciones/rol, versionado, referenciado por id.
3. **Tools** — acciones concretas y acotadas (nunca modifica fuente, solo propone actualización
   de memoria — sostiene el principio 2 y R-07).
4. **Skills** — procedimientos de dominio empaquetados y reutilizables ("cómo se construye una
   Key Issue List", "cómo se detecta una contradicción").
5. **Middleware** — reglas transversales antes/después de cada paso (guardrails, cita
   obligatoria, validación humana, filtro de datos personales).
6. **Long-term memory** — memoria persistente entre conversaciones, separada de la memoria de
   trabajo (historial de chat) y de las fuentes oficiales; ciclo usar → aprender → mejorar,
   siempre con aprobación humana antes de incorporar (R-04).

Otras piezas de la arquitectura de configuración (menos relevantes para el frontend, más para
el discurso): **Servicio** (operación de negocio invocable), **Aplicación** (conjunto de
funcionalidades — M&A hoy, otro caso de uso mañana reutilizando el resto), **Integración**
(conexión a sistema externo referenciada por nombre, ej. SharePoint), **Model deployment**
(conexión a un modelo concreto), **Flow** (cadena de servicios declarada por configuración,
ej. ingesta → extracción → cruce con checklist → borrador de Key Issue List con evidencia).

## Observabilidad como argumento de venta (slide 22 — inspiración directa para una pantalla)

"Todo lo que hace el sistema es observable: no solo qué respondió el agente, sino cuánto
costó, qué camino siguió y cómo razonó para llegar ahí." Tres bloques mostrados lado a lado:

- **Coste por caso de uso** — gráfico de barras (ejemplo: Consulta 120, Resumen 240, KIL 420,
  Modelo 310, en alguna unidad de coste).
- **Traza de ejecución** — lista de pasos con timestamps/orden: entrada → autenticación →
  flow ingesta → flow extracción → agente KIL borrador.
- **Razonamiento del agente** — lista de turnos con tokens y qué tool/middleware disparó cada
  uno (turno 1 · modelo · 1.240 tk, turno 1 · tool: conocimiento, turno 2 · middleware: cita…).

Esta es probablemente la pantalla con más "wow" para un evaluador técnico — vale la pena
construirla con cuidado, aunque los números sean inventados/mock.

## Lo que BEAI pide a Saeta antes de empezar (fase 0)

Documentación de 2-3 casos de uso reales (para dimensionar), checklist conjunta de "gaps" a
detectar, plantillas de referencia (Key Issue List, resumen de operación, modelo financiero).
Accesos: interlocutor único de M&A, validación de Tecnología/Seguridad, operación histórica
anonimizada, acceso API a SharePoint, altas en Entra ID, aprobación de dónde se almacenan
datos, las 2 licencias M365 Copilot activas.

**Relevancia para esta POC**: como esos insumos reales probablemente no van a estar
disponibles antes de construir la demo, los datos de ejemplo (operación de M&A, Key Issue
List, resumen de operación, modelo financiero) deben ser **ficticios pero verosímiles**,
inventados por Claude/el equipo, coherentes con el principio 1 y 2 de la RFP (operación
anonimizada, fuentes no modificadas).

## Calendario (8 semanas, 4 sprints) — no aplica a esta POC salvo como ambientación

Fase 0 (1-2 semanas, fuera del plazo) → Sprint 1 fundaciones (conexión SharePoint, ingesta,
identidad, primer esquema de memoria) → Sprint 2 casos base y memoria viva (UC-01, UC-02,
UC-03, ciclo crear·comparar·aprobar) → Sprint 3 cobertura y guardarraíles (UC-04, UC-05,
UC-06, UC-07, UC-08, enrutado de modelos) → Sprint 4 pruebas/cierre/transferencia. Cada sprint
termina con una demo a M&A. Puede ser útil como ambientación de producto (p.ej. una pantalla de
"estado del piloto" con estas fases), pero no es una guía de desarrollo real de este repo.

## Nota de honestidad sobre el estado de la propuesta real

Varias piezas de la propuesta real de BEAI están explícitamente pendientes en el PDF original
(el portal marcado `[PENDIENTE]`, notas tipo "a incorporar por Joaquín", "zona reservada — no
rellenar con contenido provisional"). Esta POC de frontend, en cambio, **sí debe mostrarse
completa y pulida** — es una demo, no un documento de trabajo: donde la propuesta real dejó un
hueco, aquí se rellena con una decisión de diseño concreta y coherente con el resto de la RFP,
no con un placeholder visible.
