import type { Address } from './address';
import type { CorrespondenceAddress } from './address';
import type { ContactInfo } from './address';
import type { IdentityDocument } from './identity-document';

export interface VictimPersonalData {
  pesel?: string;
  dateOfBirth?: string;
  identityDocument: IdentityDocument;
  firstName: string;
  lastName: string;
  address: Address;
  phoneNumber?: string;
  placeOfBirth: string;
  lastResidenceAddress?: Address;
  correspondenceAddress?: CorrespondenceAddress;
  businessAddress?: ContactInfo;
  childcareAddress?: ContactInfo;
}

