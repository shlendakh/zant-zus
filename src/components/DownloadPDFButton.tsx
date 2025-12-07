import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2, Download, AlertCircle } from 'lucide-react'
import { usePDFGenerator } from '@/hooks/usePDFGenerator'
import { AccidentReportPDF } from './pdf/AccidentReportPDF'
import { createRoot } from 'react-dom/client'
import type { CompleteFormData } from '@/types/form-data'

interface DownloadPDFButtonProps {
  formData: CompleteFormData
  disabled?: boolean
}

export function DownloadPDFButton({ formData, disabled }: DownloadPDFButtonProps) {
  const { isGenerating, error, generateAndDownload, clearError } = usePDFGenerator()
  const [showError, setShowError] = useState(false)

  const handleDownload = async () => {
    try {
      setShowError(false)
      clearError()

      // Utwórz tymczasowy kontener dla PDF - całkowicie wyizolowany od globalnych stylów
      const container = document.createElement('div')
      container.style.position = 'absolute'
      container.style.left = '-9999px'
      container.style.top = '-9999px'
      container.style.width = '210mm'
      container.style.backgroundColor = '#ffffff'
      container.style.color = '#000000'
      container.style.fontFamily = 'Arial, sans-serif'
      container.style.fontSize = '11pt'
      container.style.lineHeight = '1.4'
      container.style.margin = '0'
      container.style.padding = '0'
      container.style.border = 'none'
      container.style.outline = 'none'
      container.style.boxShadow = 'none'
      container.style.textShadow = 'none'
      container.setAttribute('data-pdf-container', 'true')
      document.body.appendChild(container)

      // Renderuj komponent PDF
      const root = createRoot(container)
      root.render(<AccidentReportPDF formData={formData} />)

      // Poczekaj na renderowanie - zwiększamy czas aby upewnić się że wszystko się wyrenderowało
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Znajdź element PDF content - upewnij się że jest tylko jeden
      const pdfContent = container.querySelector('#pdf-content')
      if (!pdfContent) {
        throw new Error('Nie znaleziono zawartości PDF')
      }

      // Sprawdź czy nie ma duplikatów
      const allPdfContents = container.querySelectorAll('#pdf-content')
      if (allPdfContents.length > 1) {
        console.warn('Znaleziono duplikaty zawartości PDF, usuwam dodatkowe')
        for (let i = 1; i < allPdfContents.length; i++) {
          allPdfContents[i].remove()
        }
      }

      // Generuj PDF z kontenera - używamy tylko pierwszego elementu
      await generateAndDownload(formData, pdfContent as HTMLElement)

      // Usuń kontener
      root.unmount()
      document.body.removeChild(container)
    } catch (err) {
      setShowError(true)
      console.error('Błąd podczas generowania PDF:', err)
    }
  }

  const canDownload = 
    !disabled && 
    !isGenerating && 
    formData.victimData !== null && 
    formData.accidentDetailsData !== null

  return (
    <div className="space-y-2">
      <Button
        onClick={handleDownload}
        disabled={!canDownload || isGenerating}
        size="lg"
        className="w-full sm:w-auto min-w-[200px]"
      >
        {isGenerating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generowanie PDF...
          </>
        ) : (
          <>
            <Download className="mr-2 h-4 w-4" />
            Pobierz PDF
          </>
        )}
      </Button>

      {(error || showError) && (
        <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-md">
          <AlertCircle className="h-4 w-4" />
          <span>{error || 'Wystąpił błąd podczas generowania PDF'}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              clearError()
              setShowError(false)
            }}
            className="ml-auto h-auto p-1"
          >
            ✕
          </Button>
        </div>
      )}

      {!canDownload && !isGenerating && (
        <p className="text-sm text-muted-foreground">
          {!formData.victimData && !formData.accidentDetailsData
            ? 'Wypełnij wszystkie wymagane formularze, aby pobrać PDF'
            : !formData.victimData
            ? 'Wypełnij formularz danych osoby poszkodowanej'
            : 'Wypełnij formularz opisu wypadku'}
        </p>
      )}
    </div>
  )
}

