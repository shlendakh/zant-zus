export const IdentityDocumentType = {
  IdentityCard: "identity_card",
  Passport: "passport",
} as const

export type IdentityDocumentType = typeof IdentityDocumentType[keyof typeof IdentityDocumentType]

export interface IdentityDocument {
  type: IdentityDocumentType;
  number: string;
}

