import { useState } from 'react'
import { VictimPersonalDataForm } from '../VictimPersonalDataForm'
import { ApplicantDataForm } from '../ApplicantDataForm'
import { StepIndicator } from '../StepIndicator'
import type { VictimPersonalData } from '@/types/victim-personal-data'
import type { ApplicantData } from '@/types/applicant-data'

const steps = [
  { number: 1, label: 'Dane osoby poszkodowanej' },
  { number: 2, label: 'Dane osoby zgłaszającej' },
  { number: 3, label: 'Opis wypadku' },
]

export function FormLayout() {
  const [currentStep, setCurrentStep] = useState(1)
  const [victimData, setVictimData] = useState<VictimPersonalData | null>(null)
  const [applicantData, setApplicantData] = useState<ApplicantData | null>(null)

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
        <div className="w-full max-w-4xl mx-auto">
          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Opis wypadku</h2>
            <p className="text-muted-foreground">
              Formularz opisu wypadku będzie tutaj
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

