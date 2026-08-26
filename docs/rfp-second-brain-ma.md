# RFP — Piloto de Second Brain de M&A (Saeta)

> Transcripción de trabajo del documento `20260819 - Saeta_RfP_IA_MA_Brain.pdf` (Agosto 2026),
> la RFP que Saeta lanzó y que este frontend de POC ayuda a ganar. Es la fuente de verdad de
> requisitos y casos de uso — antes de construir una pantalla, comprobar aquí qué requisito o
> caso de uso cubre.

## Contactos Saeta

- Carlos Canga — Lead M&A — ccanga@saetayield.com
- Jorge Pulido — Associate M&A — jpulidovigil@masdar.ae
- Eva Corral — Head of IT — ecorral@saetayield.com
- (copia) Ubaldo Yañez — Head M&A — uyanez@saetayield.com

## Objeto de la RFP

Seleccionar un proveedor para diseñar e implantar un **piloto acotado** de un agente
especializado de M&A, integrado con el entorno corporativo de Saeta, concebido como **primer
caso de uso de una arquitectura reutilizable**. Saeta define resultados y controles; cada
proveedor propone la solución técnica.

## 1. Contexto y objetivo

Saeta opera sobre un ecosistema Microsoft y debe alinearse con la arquitectura y políticas de
Masdar (accionista principal). Principio **Microsoft-first**: se priorizan capacidades
corporativas existentes; componentes externos solo si aportan valor material y están
justificados.

Objetivo del piloto:

1. Validar, con una operación histórica cerrada y anonimizada, si un agente especializado
   mejora el análisis y seguimiento de una transacción.
2. Mantener una memoria de conocimiento útil y trazable, respetando permisos y segregación.
3. Operar con coste y esfuerzo de mantenimiento razonables.

El piloto debe demostrar que correcciones, aprobaciones y decisiones de los usuarios pueden
incorporarse de forma controlada a la memoria y mejorar resultados posteriores, respetando
siempre permisos y segregación.

## 2. Principios del piloto

| # | Principio | Aplicación |
|---|---|---|
| 1 | Piloto mínimo | Una operación histórica, un grupo limitado de usuarios, casos de uso acotados. |
| 2 | Fuentes oficiales preservadas | El agente **no modifica** contratos, modelos, informes ni otros documentos fuente. |
| 3 | Memoria derivada controlada | Conocimiento derivado separado de las fuentes, versionado, sujeto a revisión humana. Cada elemento conserva evidencia, procedencia, fecha, versión, estado de validación y relaciones. |
| 4 | Seguridad y segregación | Cada usuario accede solo a lo permitido; no hay mezcla entre operaciones. |
| 5 | Simplicidad | Minimizar capas, copias, repositorios y componentes adicionales. |
| 6 | Autonomía y portabilidad | Saeta debe poder mantener, exportar y evolucionar la solución sin depender del proveedor. |
| 7 | Coste observable | Licencias, infraestructura, consumo y servicios transparentes y medibles. |
| 8 | Reutilización por diseño | Identidad, seguridad, modelos, auditoría, costes, evaluaciones y gestión del conocimiento reutilizables. El modelo/nivel de razonamiento se adapta a la complejidad de la consulta (calidad/latencia/coste). |

Estos 8 principios son la lista de "credibilidad" que la demo tiene que transmitir visualmente:
cada pantalla debería poder señalar a uno o varios.

## 3. Alcance solicitado

### 3.1 Alcance base a cotizar

- Análisis del caso y confirmación de requisitos con M&A, Tecnología y Seguridad.
- Diseño de arquitectura del piloto + propuesta de evolución corporativa.
- Conexión a una fuente documental corporativa inicial, preferentemente **SharePoint**,
  respetando permisos.
- Arquitectura de información mínima para el espacio SharePoint del piloto (carpetas +
  metadatos + tipos documentales + convenciones de nombres + versionado + vistas + permisos).
- Consulta y análisis documental con trazabilidad de fuentes.
- Creación y actualización controlada de una memoria de conocimiento derivada.
- Pruebas funcionales, de seguridad, segregación, coste y mantenibilidad.
- Formación, documentación y transferencia al equipo de Saeta.
- Saeta pone **2 licencias M365 Copilot** a disposición del piloto.

No es suficiente una solución que solo recupere fragmentos documentales y genere respuestas
transitorias sin una capa persistente de conocimiento derivado.

### 3.2 Fuera del alcance base (opciones separadas)

- Uso sobre operaciones activas o información no anonimizada.
- Despliegue a más áreas o usuarios.
- Integración con fuentes adicionales, datos estructurados u otros sistemas.
- Automatizaciones que envíen comunicaciones, modifiquen sistemas o actualicen documentos
  oficiales.
- Infraestructura o licencias adicionales no imprescindibles.
- Soporte gestionado posterior al periodo de estabilización.

Todo componente **imprescindible** va en el precio fijo base; solo lo **opcional** se cotiza
aparte.

## 4. Casos de uso prioritarios

| ID | Caso de uso | Resultado esperado |
|---|---|---|
| UC-01 | Consulta con fuentes | Responder preguntas sobre una operación citando la fuente concreta y respetando permisos. |
| UC-02 | Resumen de operación | Visión estructurada de perímetro, partes, hitos, estado y asuntos clave. |
| UC-03 | Key Issue List | Borrador con riesgo, evidencia, impacto, responsable, mitigación y estado; se actualiza. |
| UC-04 | Hechos e inferencias/conclusiones | Separar hechos documentados, inferencias/conclusiones, hipótesis y cuestiones pendientes. |
| UC-05 | Gaps y contradicciones | Detectar documentación pendiente, versiones incompatibles e incoherencias entre informes. |
| UC-06 | Q&A y seguimiento | Proponer preguntas para vendedor/asesores y acciones de seguimiento, **sin ejecutarlas**. |
| UC-07 | Modelo Financiero | Auditoría de consistencia (fórmulas, links, hardcodes, circularidades, consistencia entre pestañas, inputs/outputs) + set estándar de sensibilidades. Se ejecuta **sobre una copia** del modelo, con automatización externa previa. |
| UC-08 | Informes | Preparar borradores de materiales ejecutivos. |
| UC-09 | Memoria persistente | Crear y mantener conocimiento derivado reutilizable dentro de la operación, con fuentes y control de cambios. |

Estos 9 casos son el mapa funcional de la demo: cada pantalla del frontend debería
corresponder a uno o combinarlos.

## 5. Requisitos mínimos

| ID | Área | Requisito |
|---|---|---|
| R-01 | Funcional | Cubrir los casos de uso prioritarios y permitir feedback de usuarios sobre las respuestas. |
| R-02 | Trazabilidad | Vincular afirmaciones relevantes con sus fuentes, versiones y fecha de consulta. |
| R-03 | Memoria | Capa de conocimiento derivado persistente, estructurada, navegable, legible por personas, separada de fuentes oficiales y del historial de conversación. Utilizable por distintos modelos/interfaces/procesos sin reconstruirla. |
| R-04 | Ciclo de conocimiento | Registrar, comparar, aprobar, rechazar y revertir actualizaciones de memoria. Correcciones/decisiones humanas aprobadas mejoran consultas y entregables posteriores. |
| R-05 | Calidad y mantenimiento | Detectar contradicciones, duplicidades, documentos sustituidos, conocimiento obsoleto, afirmaciones sin evidencia, relaciones inconsistentes. Proponer acciones sin modificar fuentes ni publicar sin aprobar. |
| R-06 | Identidad | Respetar identidades, grupos y permisos corporativos; mínimo privilegio. |
| R-07 | Segregación | Impedir fugas o contaminación de información entre usuarios y operaciones. |
| R-08 | Datos | Detallar dónde se almacenan/procesan documentos, prompts, respuestas, índices, embeddings, cachés, logs y conocimiento derivado. |
| R-09 | Privacidad | No usar información de Saeta para entrenar modelos externos; políticas de retención y eliminación acordadas. |
| R-10 | Seguridad | Proteger frente a accesos no autorizados, extracción de información, prompt injection y documentos maliciosos. |
| R-11 | Auditoría | Registros de consultas, fuentes, respuestas, cambios, aprobaciones, acciones y errores. |
| R-12 | Arquitectura | Arquitectura sencilla, modular, integrada con el ecosistema corporativo. |
| R-13 | Terceros | Justificar cada componente externo: función, datos tratados, seguridad, coste, dependencia, alternativa. |
| R-14 | Modelos | Explicar selección/sustitución de modelos según calidad, coste, latencia y privacidad. |
| R-15 | Operación | Definir qué mantiene Saeta y qué requiere soporte del proveedor tras el piloto. |
| R-16 | Propiedad | Transferir entregables específicos: código, configuraciones, prompts, esquemas, pruebas, documentación. |
| R-17 | Coste | Desglosar servicios, licencias, infraestructura, consumo y terceros; drivers de coste. |
| R-18 | Observabilidad | Medir consumo y coste por usuario, operación o caso de uso, con límites y alertas. |
| R-19 | Escalabilidad | Estimación orientativa para ampliar usuarios, fuentes y casos de uso, separada del piloto base. |
| R-20 | Salida | Exportar datos y conocimiento; facilitar transición a Saeta u otro proveedor. |

Requisitos con mayor peso visual para una demo de frontend: **R-02** (citas de fuente),
**R-03/R-04/R-05** (memoria derivada con ciclo de aprobación), **R-06/R-07** (identidad y
segregación — aunque sea simulada), **R-11** (traza de auditoría), **R-18** (coste por caso de
uso), **R-20** (exportación).

## 6. Entregables

| ID | Entregable |
|---|---|
| E-01 | Diseño funcional y arquitectura del piloto, con supuestos y decisiones. |
| E-02 | Piloto funcional desplegado en el entorno acordado. |
| E-03 | Configuración de la memoria derivada y de sus controles de actualización. |
| E-04 | Resultados y evidencias de las pruebas acordadas. |
| E-05 | Reporte de consumo y coste del piloto. |
| E-06 | Documentación funcional, técnica, de seguridad y administración. |
| E-07 | Código, arquitectura, configuraciones, prompts, esquemas y pruebas desarrollados específicamente. |
| E-08 | Plantilla reutilizable de organización documental para operaciones de M&A (estructura, metadatos mínimos, permisos, reglas de mantenimiento). |
| E-09 | Formación y transferencia de conocimiento. |
| E-10 | Informe final con resultados, limitaciones y hoja de ruta opcional de escalado. |

## 7. Contenido de la propuesta (orden exigido)

Resumen ejecutivo → Solución funcional y UX → Arquitectura/datos/componentes/seguridad →
Enfoque de memoria derivada y gestión de cambios → Metodología/calendario/equipo → Pruebas,
métricas y criterios de aceptación → Modelo operativo, transferencia y salida → Propuesta
económica y opciones de escalado → Respuesta a la matriz de requisitos.

Reglas de respuesta: marcar cada requisito Cumple/Parcial/No cumple con referencia; diferenciar
capacidades de hoy de futuras; identificar dependencias/supuestos/exclusiones/terceros; no
meter opcionales en el precio base sin desglose.

## 8. Propuesta económica

Precio fijo para el alcance base + precios separados por opción. Debe incluir: servicios del
piloto, licencias e infraestructura, consumo, terceros, soporte posterior, opciones de
escalado, coste de salida/exportación. Todo coste necesario para que el piloto funcione va en
el precio base; extras/aceleradores no condicionan la aceptación.

## 9. Equipo, calendario y proceso

- Equipo nominal, roles, dedicación, ubicación, actividades subcontratadas.
- Se valora experiencia en M&A o due diligence, además de IA empresarial/seguridad/gestión
  documental/Microsoft.
- Dos referencias comparables.
- **Calendario: 6-8 semanas.**

## 10. Criterios eliminatorios

- No garantizar segregación de información y respeto de permisos.
- Usar datos de Saeta para entrenamiento no autorizado.
- No revelar dónde se almacenan/procesan datos y artefactos derivados.
- Impedir la exportación del conocimiento o la transición a otro proveedor.
- Precio base que excluya componentes necesarios para operar el piloto.

## 11. Condiciones mínimas

Confidencialidad; cumplimiento de políticas de seguridad/privacidad/acceso de Saeta y Masdar;
propiedad de Saeta sobre datos, conocimiento derivado y entregables; identificación de
componentes de terceros y licencias; devolución/eliminación de información al finalizar;
cooperación en la transición; condiciones sujetas a revisión legal/compras/seguridad/privacidad.
