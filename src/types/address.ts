export interface Address {
  street?: string;
  houseNumber?: string;
  apartmentNumber?: string;
  postalCode?: string;
  city?: string;
  country?: string;
}

export const CorrespondenceAddressType = {
  Address: "address",
  PosteRestante: "poste_restante",
  PostOfficeBox: "post_office_box",
  CompartmentBox: "compartment_box",
} as const

export type CorrespondenceAddressType = typeof CorrespondenceAddressType[keyof typeof CorrespondenceAddressType]

export interface CorrespondenceAddress {
  type: CorrespondenceAddressType;
  // Dla typu "address" - standardowe pola adresowe
  street?: string;
  houseNumber?: string;
  apartmentNumber?: string;
  postalCode?: string;
  city?: string;
  // Dla typu "poste_restante", "post_office_box", "compartment_box"
  postOfficePostalCode?: string; // Kod pocztowy placówki
  postOfficeName?: string; // Nazwa placówki
  // Dla typu "post_office_box", "compartment_box"
  boxNumber?: string; // Numer skrytki/przegródki
}

export interface ContactInfo {
  address: Address;
  phoneNumber?: string;
}


