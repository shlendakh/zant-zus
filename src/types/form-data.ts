import type { VictimPersonalData } from './victim-personal-data'
import type { ApplicantData } from './applicant-data'
import type { AccidentDetailsData } from './accident-details-data'

export interface CompleteFormData {
  victimData: VictimPersonalData | null
  applicantData: ApplicantData | null
  accidentDetailsData: AccidentDetailsData | null
}

