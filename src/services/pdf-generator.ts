import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export interface PDFGenerationOptions {
  format?: 'A4' | 'Letter'
  orientation?: 'portrait' | 'landscape'
  margin?: {
    top?: number
    right?: number
    bottom?: number
    left?: number
  }
}

export interface PDFGenerationError extends Error {
  originalError?: unknown
}

export function createPDFGenerationError(message: string, originalError?: unknown): PDFGenerationError {
  const error = new Error(message) as PDFGenerationError
  error.name = 'PDFGenerationError'
  error.originalError = originalError
  return error
}

/**
 * Generuje PDF z elementu HTML
 */
export async function generatePDFFromHTMLElement(
  element: HTMLElement,
  options: PDFGenerationOptions = {}
): Promise<Blob> {
  try {
    const defaultOptions = {
      format: 'A4' as const,
      orientation: 'portrait' as const,
      margin: {
        top: 10,
        right: 10,
        bottom: 10,
        left: 10,
      },
      ...options,
    }

    // Konwertuj HTML element na canvas
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      onclone: (clonedDoc) => {
        // Usuń wszystkie <style> tagi które mogą zawierać oklch
        const styleTags = clonedDoc.querySelectorAll('style')
        styleTags.forEach((styleTag) => {
          styleTag.remove()
        })
        
        // Usuń wszystkie <link> tagi do arkuszy stylów
        const linkTags = clonedDoc.querySelectorAll('link[rel="stylesheet"]')
        linkTags.forEach((linkTag) => {
          linkTag.remove()
        })
        
        // Konwertuj wszystkie style CSS variables i oklch na hex
        const allElements = clonedDoc.querySelectorAll('*')
        allElements.forEach((el) => {
          const htmlEl = el as HTMLElement
          
          // Zastąp wszystkie właściwości style które mogą zawierać oklch
          const styleProps = [
            'color',
            'backgroundColor',
            'borderColor',
            'borderTopColor',
            'borderRightColor',
            'borderBottomColor',
            'borderLeftColor',
            'outlineColor',
            'textDecorationColor',
            'columnRuleColor',
          ]
          
          styleProps.forEach((prop) => {
            const value = htmlEl.style.getPropertyValue(prop)
            if (value && (value.includes('oklch') || value.includes('var('))) {
              if (prop === 'backgroundColor') {
                htmlEl.style.setProperty(prop, '#ffffff', 'important')
              } else {
                htmlEl.style.setProperty(prop, '#000000', 'important')
              }
            }
          })
          
          // Ustaw domyślne wartości dla wszystkich elementów
          if (!htmlEl.style.color) {
            htmlEl.style.color = '#000000'
          }
          if (!htmlEl.style.backgroundColor && htmlEl.tagName !== 'BODY' && htmlEl.tagName !== 'HTML') {
            htmlEl.style.backgroundColor = 'transparent'
          }
        })
        
        // Ustaw style dla body i html
        const body = clonedDoc.body
        if (body) {
          body.style.backgroundColor = '#ffffff'
          body.style.color = '#000000'
          body.style.margin = '0'
          body.style.padding = '0'
        }
        
        const html = clonedDoc.documentElement
        if (html) {
          html.style.backgroundColor = '#ffffff'
          html.style.color = '#000000'
        }
      },
    })

    const imgData = canvas.toDataURL('image/png')
    const imgWidth = canvas.width
    const imgHeight = canvas.height

    // Oblicz wymiary PDF
    const pdfWidth = defaultOptions.format === 'A4' ? 210 : 216 // mm
    const pdfHeight = defaultOptions.format === 'A4' ? 297 : 279 // mm
    const margin = defaultOptions.margin || { top: 10, right: 10, bottom: 10, left: 10 }
    const marginTop = margin.top ?? 10
    const marginRight = margin.right ?? 10
    const marginBottom = margin.bottom ?? 10
    const marginLeft = margin.left ?? 10
    
    const contentWidth = pdfWidth - marginLeft - marginRight
    const contentHeight = pdfHeight - marginTop - marginBottom

    // Oblicz skalę - dopasuj szerokość do dostępnej przestrzeni
    const ratio = contentWidth / imgWidth
    const scaledWidth = contentWidth
    const scaledHeight = imgHeight * ratio

    // Utwórz PDF
    const pdf = new jsPDF({
      orientation: defaultOptions.orientation,
      unit: 'mm',
      format: defaultOptions.format,
    })

    // Dodaj obraz tylko raz
    // Jeśli obraz jest większy niż jedna strona, jsPDF automatycznie go przycina
    // Nie dodajemy obrazu wielokrotnie - to powodowało duplikację
    pdf.addImage(
      imgData,
      'PNG',
      marginLeft,
      marginTop,
      scaledWidth,
      scaledHeight,
      undefined,
      'FAST'
    )

    return pdf.output('blob')
  } catch (error) {
    if (error && typeof error === 'object' && 'name' in error && error.name === 'PDFGenerationError') {
      throw error as PDFGenerationError
    }
    throw createPDFGenerationError(
      'Wystąpił błąd podczas generowania PDF',
      error
    )
  }
}

/**
 * Pobiera PDF jako plik
 */
export function downloadPDF(blob: Blob, filename: string = 'formularz-wypadku.pdf'): void {
  try {
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  } catch (error) {
    throw createPDFGenerationError('Nie udało się pobrać pliku PDF', error)
  }
}

