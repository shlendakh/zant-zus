import type { Address } from './address';
import type { IdentityDocument } from './identity-document';

export interface LastResidenceAddress {
  street: string;
  houseNumber: string;
  apartmentNumber?: string;
  postalCode: string;
  city: string;
}

export interface LastResidenceAddressForm {
  street?: string;
  houseNumber?: string;
  apartmentNumber?: string;
  postalCode?: string;
  city?: string;
}

export interface VictimPersonalData {
  pesel?: string;
  dateOfBirth?: string;
  identityDocument?: IdentityDocument;
  firstName: string;
  lastName: string;
  address: Address;
  phoneNumber?: string;
  placeOfBirth: string;
  lastResidenceAddress?: LastResidenceAddress;
}

