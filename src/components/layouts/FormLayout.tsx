import { VictimPersonalDataForm } from '../VictimPersonalDataForm'
import type { VictimPersonalData } from '@/types/victim-personal-data'

export function FormLayout() {
  const handleSubmit = (data: VictimPersonalData) => {
    console.log('Form data:', data)
    // Tutaj możesz dodać logikę zapisu danych
  }

  return (
    <div className="w-full space-y-6">
      <VictimPersonalDataForm onSubmit={handleSubmit} />
    </div>
  )
}

