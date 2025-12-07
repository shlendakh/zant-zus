import { useState } from 'react'
import { VictimPersonalDataForm } from '../VictimPersonalDataForm'
import { ApplicantDataForm } from '../ApplicantDataForm'
import { AccidentDetailsForm } from '../AccidentDetailsForm'
import { StepIndicator } from '../StepIndicator'
import type { VictimPersonalData } from '@/types/victim-personal-data'
import type { ApplicantData } from '@/types/applicant-data'
import type { AccidentDetailsData } from '@/types/accident-details-data'

const steps = [
  { number: 1, label: 'Dane osoby poszkodowanej' },
  { number: 2, label: 'Dane osoby zgłaszającej' },
  { number: 3, label: 'Opis wypadku' },
]

export function FormLayout() {
  const [currentStep, setCurrentStep] = useState(1)
  const [victimData, setVictimData] = useState<VictimPersonalData | null>(null)
  const [applicantData, setApplicantData] = useState<ApplicantData | null>(null)
  const [accidentDetailsData, setAccidentDetailsData] = useState<AccidentDetailsData | null>(null)

  const handleVictimDataSubmit = (data: VictimPersonalData) => {
    console.log('Victim data:', data)
    setVictimData(data)
    setCurrentStep(2)
  }

  const handleApplicantDataSubmit = (data: ApplicantData) => {
    console.log('Applicant data:', data)
    setApplicantData(data)
    setCurrentStep(3)
  }

  const handleApplicantDataSkip = () => {
    setCurrentStep(3)
  }

  const handleAccidentDetailsSubmit = (data: AccidentDetailsData) => {
    console.log('Accident details data:', data)
    setAccidentDetailsData(data)
    // Tutaj można dodać logikę zapisu wszystkich danych lub przejścia do następnego kroku
  }

  const handleStepClick = (step: number) => {
    // Można przejść tylko do wcześniejszych etapów lub aktualnego
    if (step <= currentStep) {
      setCurrentStep(step)
    }
  }

  return (
    <div className="w-full space-y-6">
      <StepIndicator
        currentStep={currentStep}
        steps={steps}
        onStepClick={handleStepClick}
      />
      
      {currentStep === 1 && (
        <VictimPersonalDataForm
          onSubmit={handleVictimDataSubmit}
          defaultValues={victimData || undefined}
        />
      )}
      
      {currentStep === 2 && (
        <ApplicantDataForm
          onSubmit={handleApplicantDataSubmit}
          defaultValues={applicantData || undefined}
          victimData={victimData || undefined}
          onSkip={handleApplicantDataSkip}
        />
      )}
      
      {currentStep === 3 && (
        <AccidentDetailsForm
          onSubmit={handleAccidentDetailsSubmit}
          defaultValues={accidentDetailsData || undefined}
        />
      )}
    </div>
  )
}

