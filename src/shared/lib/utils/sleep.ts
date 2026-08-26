/**
 * Espera `ms` milisegundos. Con `signal`, la espera es cancelable: rechaza con
 * el motivo del abort en cuanto se cancela, en vez de dejar el temporizador
 * corriendo. Lo usan la latencia simulada de las APIs mock, el streaming del
 * asistente y el progreso de la ingesta del KB.
 */
export const sleep = (ms: number, signal?: AbortSignal): Promise<void> =>
  new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(signal.reason)
      return
    }
    const timer = setTimeout(() => {
      signal?.removeEventListener('abort', onAbort)
      resolve()
    }, ms)
    function onAbort() {
      clearTimeout(timer)
      reject(signal?.reason)
    }
    signal?.addEventListener('abort', onAbort, { once: true })
  })
