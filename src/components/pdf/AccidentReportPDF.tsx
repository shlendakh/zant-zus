import type { CompleteFormData } from '@/types/form-data'
import { format } from 'date-fns'

interface AccidentReportPDFProps {
  formData: CompleteFormData
}

export function AccidentReportPDF({ formData }: AccidentReportPDFProps) {
  const { victimData, applicantData, accidentDetailsData } = formData

  const formatDate = (dateString?: string) => {
    if (!dateString) return ''
    try {
      return format(new Date(dateString), 'dd.MM.yyyy')
    } catch {
      return dateString
    }
  }

  const formatAddress = (address?: {
    street?: string
    houseNumber?: string
    apartmentNumber?: string
    postalCode?: string
    city?: string
    country?: string
  }) => {
    if (!address) return ''
    const parts = []
    if (address.street) parts.push(address.street)
    if (address.houseNumber) parts.push(address.houseNumber)
    if (address.apartmentNumber) parts.push(`/${address.apartmentNumber}`)
    if (address.postalCode || address.city) {
      parts.push(`${address.postalCode || ''} ${address.city || ''}`.trim())
    }
    if (address.country) parts.push(address.country)
    return parts.join(', ')
  }

  const formatDocumentType = (type?: string) => {
    if (type === 'identity_card') return 'Dowód osobisty'
    if (type === 'passport') return 'Paszport'
    return type || ''
  }

  return (
    <div
      id="pdf-content"
      style={{
        fontFamily: 'Arial, sans-serif',
        fontSize: '11pt',
        lineHeight: '1.4',
        color: '#000000',
        backgroundColor: '#ffffff',
        padding: '20px',
        maxWidth: '210mm',
        margin: '0 auto',
      }}
    >
      {/* Nagłówek */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '16pt', fontWeight: 'bold', marginBottom: '10px', color: '#000000' }}>
          ZGŁOSZENIE WYPADKU PRZY PRACY
        </h1>
        <p style={{ fontSize: '10pt', color: '#666666' }}>
          Formularz PEL - ZUS
        </p>
      </div>

      {/* Sekcja 1: Dane osoby poszkodowanej */}
      {victimData && (
        <div style={{ marginBottom: '25px', padding: '15px' }}>
          <h2 style={{ fontSize: '14pt', fontWeight: 'bold', marginBottom: '15px', borderBottom: '1px solid #000000', paddingBottom: '5px', color: '#000000' }}>
            DANE OSOBY POSZKODOWANEJ
          </h2>

          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '10px' }}>
            <tbody>
              {victimData.pesel && (
                <tr>
                  <td style={{ padding: '5px', width: '30%', fontWeight: 'bold' }}>PESEL:</td>
                  <td style={{ padding: '5px', borderBottom: '1px solid #000000', color: '#000000' }}>{victimData.pesel}</td>
                </tr>
              )}
                 {victimData.identityDocument && (
                <tr>
                  <td style={{ padding: '5px', fontWeight: 'bold' }}>Rodzaj, seria i numer dokumentu tożsamości:</td>
                  <td style={{ padding: '5px', borderBottom: '1px solid #000000', color: '#000000' }}>
                    {formatDocumentType(victimData.identityDocument.type)} {victimData.identityDocument.number}
                  </td>
                </tr>
              )}
              {victimData.firstName && (
                <tr>
                  <td style={{ padding: '5px', fontWeight: 'bold' }}>Imię:</td>
                  <td style={{ padding: '5px', borderBottom: '1px solid #000000', color: '#000000' }}>{victimData.firstName}</td>
                </tr>
              )}
              {victimData.lastName && (
                <tr>
                  <td style={{ padding: '5px', fontWeight: 'bold' }}>Nazwisko:</td>
                  <td style={{ padding: '5px', borderBottom: '1px solid #000000', color: '#000000' }}>{victimData.lastName}</td>
                </tr>
              )}
                {victimData.dateOfBirth && (
                <tr>
                  <td style={{ padding: '5px', fontWeight: 'bold' }}>Data urodzenia:</td>
                  <td style={{ padding: '5px', borderBottom: '1px solid #000000', color: '#000000' }}>{formatDate(victimData.dateOfBirth)}</td>
                </tr>
              )}
              {victimData.placeOfBirth && (
                <tr>
                  <td style={{ padding: '5px', fontWeight: 'bold' }}>Miejsce urodzenia:</td>
                  <td style={{ padding: '5px', borderBottom: '1px solid #000000', color: '#000000' }}>{victimData.placeOfBirth}</td>
                </tr>
              )}
              {victimData.phoneNumber && (
                <tr>
                  <td style={{ padding: '5px', fontWeight: 'bold' }}>Numer telefonu:</td>
                  <td style={{ padding: '5px', borderBottom: '1px solid #000000', color: '#000000' }}>{victimData.phoneNumber}</td>
                </tr>
              )}
              {victimData.address && formatAddress(victimData.address) && (
                <tr>
                  <td style={{ padding: '5px', fontWeight: 'bold' }}>Adres zamieszkania:</td>
                  <td style={{ padding: '5px', borderBottom: '1px solid #000000', color: '#000000' }}>
                    {formatAddress(victimData.address)}
                  </td>
                </tr>
              )}
              {victimData.lastResidenceAddress && formatAddress(victimData.lastResidenceAddress) && (
                <tr>
                  <td style={{ padding: '5px', fontWeight: 'bold' }}>Adres ostatniego miejsca zamieszkania:</td>
                  <td style={{ padding: '5px', borderBottom: '1px solid #000000', color: '#000000' }}>
                    {formatAddress(victimData.lastResidenceAddress)}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Sekcja 2: Dane osoby zgłaszającej - tylko jeśli są różne od osoby poszkodowanej */}
      {applicantData && 
       applicantData.firstName && 
       applicantData.lastName &&
       (applicantData.firstName !== victimData?.firstName || applicantData.lastName !== victimData?.lastName) && (
        <div style={{ marginBottom: '25px', padding: '15px' }}>
          <h2 style={{ fontSize: '14pt', fontWeight: 'bold', marginBottom: '15px', borderBottom: '1px solid #000000', paddingBottom: '5px', color: '#000000' }}>
            DANE OSOBY ZGŁASZAJĄCEJ
          </h2>

          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '10px' }}>
            <tbody>
              {applicantData.pesel && (
                <tr>
                  <td style={{ padding: '5px', width: '30%', fontWeight: 'bold' }}>PESEL:</td>
                  <td style={{ padding: '5px', borderBottom: '1px solid #000000', color: '#000000' }}>{applicantData.pesel}</td>
                </tr>
              )}
              {applicantData.firstName && (
                <tr>
                  <td style={{ padding: '5px', fontWeight: 'bold' }}>Imię:</td>
                  <td style={{ padding: '5px', borderBottom: '1px solid #000000', color: '#000000' }}>{applicantData.firstName}</td>
                </tr>
              )}
              {applicantData.lastName && (
                <tr>
                  <td style={{ padding: '5px', fontWeight: 'bold' }}>Nazwisko:</td>
                  <td style={{ padding: '5px', borderBottom: '1px solid #000000', color: '#000000' }}>{applicantData.lastName}</td>
                </tr>
              )}
              {applicantData.address && formatAddress(applicantData.address) && (
                <tr>
                  <td style={{ padding: '5px', fontWeight: 'bold' }}>Adres:</td>
                  <td style={{ padding: '5px', borderBottom: '1px solid #000000', color: '#000000' }}>
                    {formatAddress(applicantData.address)}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Sekcja 3: Opis wypadku */}
      {accidentDetailsData && (
        <div style={{ marginBottom: '25px', padding: '15px' }}>
          <h2 style={{ fontSize: '14pt', fontWeight: 'bold', marginBottom: '15px', borderBottom: '1px solid #000000', paddingBottom: '5px', color: '#000000' }}>
            OPIS WYPADKU
          </h2>

          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '10px' }}>
            <tbody>
              <tr>
                <td style={{ padding: '5px', width: '30%', fontWeight: 'bold' }}>Data wypadku:</td>
                <td style={{ padding: '5px', borderBottom: '1px solid #000' }}>
                  {formatDate(accidentDetailsData.accidentDate)}
                </td>
              </tr>
              <tr>
                <td style={{ padding: '5px', fontWeight: 'bold' }}>Godzina wypadku:</td>
                <td style={{ padding: '5px', borderBottom: '1px solid #000' }}>
                  {accidentDetailsData.accidentTime || '-'}
                </td>
              </tr>
              <tr>
                <td style={{ padding: '5px', fontWeight: 'bold' }}>Miejsce wypadku:</td>
                <td style={{ padding: '5px', borderBottom: '1px solid #000' }}>
                  {accidentDetailsData.accidentLocation}
                </td>
              </tr>
              {accidentDetailsData.plannedWorkStartTime && (
                <tr>
                  <td style={{ padding: '5px', fontWeight: 'bold' }}>Planowana godzina rozpoczęcia pracy:</td>
                  <td style={{ padding: '5px', borderBottom: '1px solid #000' }}>
                    {accidentDetailsData.plannedWorkStartTime}
                  </td>
                </tr>
              )}
              {accidentDetailsData.plannedWorkEndTime && (
                <tr>
                  <td style={{ padding: '5px', fontWeight: 'bold' }}>Planowana godzina zakończenia pracy:</td>
                  <td style={{ padding: '5px', borderBottom: '1px solid #000' }}>
                    {accidentDetailsData.plannedWorkEndTime}
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div style={{ marginTop: '15px', marginBottom: '15px' }}>
            <p style={{ fontWeight: 'bold', marginBottom: '5px', color: '#000000' }}>Rodzaj urazów:</p>
            <div style={{ border: '1px solid #000000', padding: '10px', minHeight: '50px', color: '#000000', backgroundColor: '#ffffff' }}>
              {accidentDetailsData.injuryTypes || '-'}
            </div>
          </div>

          <div style={{ marginTop: '15px', marginBottom: '15px' }}>
            <p style={{ fontWeight: 'bold', marginBottom: '5px', color: '#000000' }}>Szczegółowy opis wypadku:</p>
            <div style={{ border: '1px solid #000000', padding: '10px', minHeight: '100px', color: '#000000', backgroundColor: '#ffffff' }}>
              {accidentDetailsData.accidentDescription || '-'}
            </div>
          </div>

          {accidentDetailsData.medicalFacilityName && (
            <div style={{ marginTop: '15px' }}>
              <p style={{ fontWeight: 'bold', marginBottom: '5px' }}>Placówka służby zdrowia:</p>
              <p>{accidentDetailsData.medicalFacilityName}</p>
              {accidentDetailsData.medicalFacilityAddress && (
                <p>{accidentDetailsData.medicalFacilityAddress}</p>
              )}
            </div>
          )}

          {accidentDetailsData.investigationAuthorityName && (
            <div style={{ marginTop: '15px' }}>
              <p style={{ fontWeight: 'bold', marginBottom: '5px' }}>Organ prowadzący postępowanie:</p>
              <p>{accidentDetailsData.investigationAuthorityName}</p>
              {accidentDetailsData.investigationAuthorityAddress && (
                <p>{accidentDetailsData.investigationAuthorityAddress}</p>
              )}
            </div>
          )}

          {accidentDetailsData.occurredDuringMachineOperation && (
            <div style={{ marginTop: '15px', border: '1px solid #ddd', padding: '10px' }}>
              <p style={{ fontWeight: 'bold', marginBottom: '10px' }}>Informacje o maszynie/urządzeniu:</p>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  <tr>
                    <td style={{ padding: '5px', fontWeight: 'bold' }}>Maszyna/urządzenie sprawne:</td>
                    <td style={{ padding: '5px' }}>
                      {accidentDetailsData.machineWasOperational ? 'Tak' : 'Nie'}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: '5px', fontWeight: 'bold' }}>Używane zgodnie z zasadami producenta:</td>
                    <td style={{ padding: '5px' }}>
                      {accidentDetailsData.usedAccordingToManufacturerRules ? 'Tak' : 'Nie'}
                    </td>
                  </tr>
                  {accidentDetailsData.machineOperationDescription && (
                    <tr>
                      <td colSpan={2} style={{ padding: '5px' }}>
                        <p style={{ fontWeight: 'bold' }}>Opis użycia:</p>
                        <p>{accidentDetailsData.machineOperationDescription}</p>
                      </td>
                    </tr>
                  )}
                  <tr>
                    <td style={{ padding: '5px', fontWeight: 'bold' }}>Posiada atest/deklarację zgodności:</td>
                    <td style={{ padding: '5px' }}>
                      {accidentDetailsData.hasCertificateOrDeclaration ? 'Tak' : 'Nie'}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: '5px', fontWeight: 'bold' }}>Wpisane do ewidencji środków trwałych:</td>
                    <td style={{ padding: '5px' }}>
                      {accidentDetailsData.registeredInFixedAssetsRegistry ? 'Tak' : 'Nie'}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Stopka */}
        <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '2px solid #000000', textAlign: 'center', fontSize: '9pt', color: '#666666' }}>
          <p style={{ color: '#666666' }}>Wygenerowano: {format(new Date(), 'dd.MM.yyyy HH:mm')}</p>
        </div>
    </div>
  )
}

