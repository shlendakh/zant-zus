export interface AccidentDetailsData {
  accidentDate: string
  accidentTime: string
  accidentLocation: string
  plannedWorkStartTime?: string
  plannedWorkEndTime?: string
  injuryTypes: string
  accidentDescription: string
  medicalFacilityName?: string
  medicalFacilityAddress?: string
  investigationAuthorityName?: string
  investigationAuthorityAddress?: string
  occurredDuringMachineOperation: boolean
  machineWasOperational?: boolean
  usedAccordingToManufacturerRules?: boolean
  machineOperationDescription?: string
  hasCertificateOrDeclaration?: boolean
  registeredInFixedAssetsRegistry?: boolean
}

