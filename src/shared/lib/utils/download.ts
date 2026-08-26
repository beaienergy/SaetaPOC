// Descargar un fichero generado en el navegador.
//
// Estaba escrito tres veces —el informe del chat, el CSV de una respuesta y el del
// registro de auditoría— y las tres iguales: crear un Blob, una URL, un `<a>`
// invisible, pulsarlo y liberar la URL. Tres copias de un baile que nadie mira, y
// en el que se puede olvidar justo la línea que importa.
//
// Esa línea es el BOM del CSV: sin él, Excel en español abre el fichero como
// Latin-1 y destroza todas las tildes. Una de las tres copias lo tenía y las otras
// dos no, que es exactamente lo que pasa con el código duplicado — no diverge de
// golpe, diverge en el detalle que solo se nota cuando el cliente abre el fichero.

/** El BOM, como secuencia de escape: escrito literal es un carácter invisible. */
const BOM = '\uFEFF'

/** Descarga un contenido de texto como fichero. */
export function downloadFile(filename: string, content: string, mime: string): void {
  const url = URL.createObjectURL(new Blob([content], { type: `${mime};charset=utf-8` }))
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  // Sin esto, el blob se queda en memoria hasta que se recarga la página. Con un
  // registro grande exportado varias veces, se nota.
  URL.revokeObjectURL(url)
}

/**
 * Descarga un CSV con el BOM por delante.
 *
 * El BOM no es opcional: es lo que hace que Excel lo abra como UTF-8. Va aquí y no
 * en cada sitio que exporta, porque es la clase de detalle que se olvida al copiar.
 */
export const downloadCsv = (filename: string, csv: string): void =>
  downloadFile(filename, `${BOM}${csv}`, 'text/csv')
