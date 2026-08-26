# Saeta 2nd Brain — POC frontend

Demo de frontend para el piloto de M&A de Saeta ("Saeta 2nd Brain"), construida por BEAI Energy
para ayudar a ganar la RFP `Saeta_RfP_IA_MA_Brain`. **100% frontend, sin backend, sin base de
datos.** Todo el contenido (documentos, chat, Key Issue List, modelo financiero, memoria a largo
plazo, coste...) es mock hardcodeado en el propio repo.

No hay ninguna llamada real a SharePoint, Azure OpenAI, Entra ID ni a ningún servicio externo, y
el login no tiene backend detrás — es una demo desplegable como sitio estático, con una única
credencial hardcodeada como puerta simbólica (ver [Credenciales de acceso](#credenciales-de-acceso)).

## Qué enseña

Un agente de IA especializado en due diligence de M&A que responde citando fuentes, mantiene un
resumen estructurado de la operación, una Key Issue List, detecta gaps y contradicciones, audita
un modelo financiero (sobre una copia, nunca sobre el original), redacta informes, y — la pieza
central del argumento de venta — aprende de su propio uso mediante una memoria a largo plazo que
solo crece con aprobación humana explícita (usar → aprender → aprobar → mejorar).

La demo incluye 3 operaciones de ejemplo, ficticias y anonimizadas, con contenido distinto entre
sí para demostrar segregación real: **Project Helios** (portfolio solar, en curso, la más
completa), **Project Meridian** (plataforma eólica, en curso), **Project Solstice** (pipeline de
almacenamiento en baterías, cerrada).

El detalle pantalla por pantalla está en [`docs/guion-pantallas.md`](docs/guion-pantallas.md); el
contexto de negocio (RFP de Saeta y resumen de la propuesta de BEAI) está en
[`docs/rfp-second-brain-ma.md`](docs/rfp-second-brain-ma.md) y
[`docs/beai-proposal-summary.md`](docs/beai-proposal-summary.md).

## Arranque en local

Requiere **Node.js 20 o 22** (LTS). Si no lo tienes instalado: <https://nodejs.org> o, en
Windows, `winget install OpenJS.NodeJS.LTS`.

```bash
npm install
npm run dev
```

Se abre en `http://localhost:5173`, en el **login**. Desde ahí: selector de aplicaciones → "M&A
Platform" → selector de operación → elige cualquiera de las 3.

### Credenciales de acceso

```
Email:      admin@saeta.com
Contraseña: saeta
```

Es una credencial hardcodeada en el propio frontend (`src/features/auth/api/authApi.ts`), no
seguridad real — no hay backend que la valide. Sirve como puerta simbólica para que quien pruebe
la demo sienta que "entra a una herramienta".

### Antes de dar algo por terminado

```bash
npm run typecheck
npm run lint
npm run build
```

> **Aviso**: esta POC se construyó en una máquina sin Node.js instalado, así que ningún comando
> de esta sección se ha podido ejecutar todavía durante la construcción — todo el código se
> escribió leyendo con cuidado las firmas de los componentes en vez de verificar con el
> compilador. Es muy probable que la primera pasada de `typecheck`/`lint`/`build` encuentre algo
> que corregir. Corre estos tres comandos y arregla lo que salte antes de enseñar la demo.

## Cómo cambiar de rol o de idioma

- **Idioma**: selector ES/EN en el header (arranca en inglés — requisito de la RFP).
- **Rol Admin/Usuario**: selector siempre visible en el header de cada operación. Es un
  affordance de demo (guion §1.5), no seguridad real: cambia qué se ve (Analítica IA completa,
  Conocimiento base) para poder enseñar las dos vistas sin dos cuentas distintas.

## Estructura

```
src/
  app/        # composición: router, layout del shell de operación, providers
  pages/      # un fichero fino por ruta — resuelve :opId y delega en la feature
  features/   # una carpeta por bloque de negocio (auth, operations, chat, documents,
              # summary, financial-model, reports, analytics, agent-config...)
  shared/     # kit de UI, tokens de diseño, i18n, hooks, utilidades — sin lógica de negocio
```

Capas: `app → pages → features → shared`, cada una importa solo hacia la derecha. Una feature se
consume solo por su barrel (`features/x/index.ts`).

Ver [`CLAUDE.md`](CLAUDE.md) para las decisiones de producto/marca ya tomadas y las convenciones
técnicas completas (sistema de diseño, i18n, mocking sin backend).

## Logo de Saeta

`public/brand/saeta-logo.png` — si el fichero no está presente, la app cae automáticamente a un
wordmark de texto ("Saeta 2nd Brain") en su lugar, así que la ausencia del logo no rompe nada.
