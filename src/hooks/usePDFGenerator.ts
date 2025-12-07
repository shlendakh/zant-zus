import { useState, useCallback } from 'react'
import { generatePDFFromHTMLElement, downloadPDF } from '@/services/pdf-generator'
import type { CompleteFormData } from '@/types/form-data'

export interface UsePDFGeneratorReturn {
  isGenerating: boolean
  error: string | null
  generateAndDownload: (formData: CompleteFormData, htmlElement: HTMLElement) => Promise<void>
  clearError: () => void
}

export function usePDFGenerator(): UsePDFGeneratorReturn {
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generateAndDownload = useCallback(
    async (formData: CompleteFormData, htmlElement: HTMLElement) => {
      setIsGenerating(true)
      setError(null)

      try {
        // Sprawdź czy wszystkie wymagane dane są dostępne
        if (!formData.victimData) {
          throw new Error('Brak danych osoby poszkodowanej')
        }
        if (!formData.accidentDetailsData) {
          throw new Error('Brak danych dotyczących wypadku')
        }

        const pdfBlob = await generatePDFFromHTMLElement(htmlElement, {
          format: 'A4',
          orientation: 'portrait',
          margin: {
            top: 10,
            right: 10,
            bottom: 10,
            left: 10,
          },
        })

        downloadPDF(pdfBlob, 'formularz-wypadku-PEL.pdf')
      } catch (err) {
        let errorMessage = 'Wystąpił błąd podczas generowania PDF'

        if (err && typeof err === 'object' && 'name' in err && err.name === 'PDFGenerationError') {
          errorMessage = err instanceof Error ? err.message : 'Wystąpił błąd podczas generowania PDF'
        } else if (err instanceof Error) {
          errorMessage = err.message
        }

        setError(errorMessage)
        throw err
      } finally {
        setIsGenerating(false)
      }
    },
    []
  )

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    isGenerating,
    error,
    generateAndDownload,
    clearError,
  }
}

