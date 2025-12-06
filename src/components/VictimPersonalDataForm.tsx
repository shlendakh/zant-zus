import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { VictimPersonalData } from "@/types/victim-personal-data"
import { IdentityDocumentType, type IdentityDocumentType as IdentityDocumentTypeType } from "@/types/identity-document"

const formSchema = z.object({
  pesel: z
    .string()
    .min(1, "PESEL jest wymagany")
    .regex(/^\d+$/, "PESEL może zawierać tylko cyfry")
    .length(11, "PESEL musi składać się z dokładnie 11 cyfr"),
  dateOfBirth: z.string().min(1, "Data urodzenia jest wymagana"),
  identityDocument: z.object({
    type: z
      .string()
      .min(1, "Typ dokumentu jest wymagany")
      .refine(
        (val) => val === IdentityDocumentType.IdentityCard || val === IdentityDocumentType.Passport,
        {
          message: "Typ dokumentu jest wymagany",
        }
      ),
    number: z.string().min(1, "Numer dokumentu jest wymagany"),
  }),
  firstName: z
    .string()
    .min(1, "Imię jest wymagane")
    .regex(/^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ\s-]+$/, "Imię może zawierać tylko litery"),
  lastName: z
    .string()
    .min(1, "Nazwisko jest wymagane")
    .regex(/^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ\s-]+$/, "Nazwisko może zawierać tylko litery"),
  address: z.object({
    street: z.string().min(1, "Ulica jest wymagana"),
    houseNumber: z
      .string()
      .min(1, "Numer domu jest wymagany")
      .regex(/^\d+$/, "Numer domu może zawierać tylko cyfry"),
    apartmentNumber: z
      .string()
      .optional()
      .refine((val) => !val || /^\d+$/.test(val), {
        message: "Numer lokalu może zawierać tylko cyfry",
      }),
    postalCode: z.string().min(1, "Kod pocztowy jest wymagany"),
    city: z
      .string()
      .min(1, "Miejscowość jest wymagana")
      .regex(/^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ\s-]+$/, "Miejscowość może zawierać tylko litery"),
    country: z
      .string()
      .optional()
      .refine((val) => !val || /^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ\s-]+$/.test(val), {
        message: "Państwo może zawierać tylko litery",
      }),
  }),
  phoneNumber: z
    .string()
    .optional()
    .refine((val) => !val || /^\d+$/.test(val), {
      message: "Numer telefonu może zawierać tylko cyfry",
    }),
  placeOfBirth: z
    .string()
    .min(1, "Miejsce urodzenia jest wymagane")
    .regex(/^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ\s-]+$/, "Miejsce urodzenia może zawierać tylko litery"),
  lastResidenceAddress: z
    .object({
      street: z.string().optional(),
      houseNumber: z.string().optional(),
      apartmentNumber: z.string().optional(),
      postalCode: z.string().optional(),
      city: z.string().optional(),
    })
    .optional()
    .superRefine((data, ctx) => {
      // Jeśli obiekt nie istnieje, nie waliduj
      if (!data) return

      const hasAnyField = 
        (data.street && data.street.trim()) ||
        (data.houseNumber && data.houseNumber.trim()) ||
        (data.apartmentNumber && data.apartmentNumber.trim()) ||
        (data.postalCode && data.postalCode.trim()) ||
        (data.city && data.city.trim())

      // Jeśli wszystkie pola są puste, nie waliduj
      if (!hasAnyField) return

      // Jeśli jakiekolwiek pole jest wypełnione, waliduj wszystkie wymagane pola
      if (!data.street || !data.street.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Ulica jest wymagana",
          path: ["street"],
        })
      }

      if (!data.houseNumber || !data.houseNumber.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Numer domu jest wymagany",
          path: ["houseNumber"],
        })
      } else if (!/^\d+$/.test(data.houseNumber)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Numer domu może zawierać tylko cyfry",
          path: ["houseNumber"],
        })
      }

      if (data.apartmentNumber && data.apartmentNumber.trim() && !/^\d+$/.test(data.apartmentNumber)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Numer lokalu może zawierać tylko cyfry",
          path: ["apartmentNumber"],
        })
      }

      if (!data.postalCode || !data.postalCode.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Kod pocztowy jest wymagany",
          path: ["postalCode"],
        })
      }

      if (!data.city || !data.city.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Miejscowość jest wymagana",
          path: ["city"],
        })
      } else if (!/^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ\s-]+$/.test(data.city)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Miejscowość może zawierać tylko litery",
          path: ["city"],
        })
      }
    }),
})

type FormValues = z.infer<typeof formSchema>

interface VictimPersonalDataFormProps {
  onSubmit: (data: VictimPersonalData) => void
  defaultValues?: Partial<VictimPersonalData>
}

// Funkcja formatująca kod pocztowy do formatu xx-xxx
function formatPostalCode(value: string): string {
  // Usuń wszystkie znaki, które nie są cyframi
  const digits = value.replace(/\D/g, "")
  
  // Ogranicz do 5 cyfr
  const limitedDigits = digits.slice(0, 5)
  
  // Dodaj myślnik po 2 cyfrach
  if (limitedDigits.length <= 2) {
    return limitedDigits
  }
  return `${limitedDigits.slice(0, 2)}-${limitedDigits.slice(2)}`
}

// Funkcja formatująca PESEL - tylko cyfry, max 11
function formatPesel(value: string): string {
  // Usuń wszystkie znaki, które nie są cyframi
  const digits = value.replace(/\D/g, "")
  
  // Ogranicz do 11 cyfr
  return digits.slice(0, 11)
}

// Funkcja formatująca - tylko cyfry (bez limitu długości)
function formatDigitsOnly(value: string): string {
  // Usuń wszystkie znaki, które nie są cyframi
  return value.replace(/\D/g, "")
}

// Funkcja formatująca - tylko litery (z polskimi znakami), spacje i myślniki
function formatLettersOnly(value: string): string {
  // Pozostaw tylko litery (w tym polskie znaki), spacje i myślniki
  return value.replace(/[^a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ\s-]/g, "")
}

export function VictimPersonalDataForm({
  onSubmit,
  defaultValues,
}: VictimPersonalDataFormProps) {
  const [calendarOpen, setCalendarOpen] = useState(false)
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pesel: defaultValues?.pesel || "",
      dateOfBirth: defaultValues?.dateOfBirth || "",
      identityDocument: defaultValues?.identityDocument || {
        type: IdentityDocumentType.IdentityCard,
        number: "",
      },
      firstName: defaultValues?.firstName || "",
      lastName: defaultValues?.lastName || "",
      address: {
        street: defaultValues?.address?.street || "",
        houseNumber: defaultValues?.address?.houseNumber || "",
        apartmentNumber: defaultValues?.address?.apartmentNumber || "",
        postalCode: defaultValues?.address?.postalCode || "",
        city: defaultValues?.address?.city || "",
        country: defaultValues?.address?.country || "",
      },
      phoneNumber: defaultValues?.phoneNumber || "",
      placeOfBirth: defaultValues?.placeOfBirth || "",
      lastResidenceAddress: defaultValues?.lastResidenceAddress || {
        street: "",
        houseNumber: "",
        apartmentNumber: "",
        postalCode: "",
        city: "",
      },
    },
  })

  function handleSubmit(values: FormValues) {
    const data: VictimPersonalData = {
      pesel: values.pesel,
      dateOfBirth: values.dateOfBirth,
      identityDocument: {
        type: values.identityDocument.type as IdentityDocumentTypeType,
        number: values.identityDocument.number,
      },
      firstName: values.firstName,
      lastName: values.lastName,
      address: {
        street: values.address.street,
        houseNumber: values.address.houseNumber,
        postalCode: values.address.postalCode,
        city: values.address.city,
        ...(values.address.apartmentNumber && values.address.apartmentNumber.trim() && {
          apartmentNumber: values.address.apartmentNumber,
        }),
        ...(values.address.country && values.address.country.trim() && {
          country: values.address.country,
        }),
      },
      ...(values.phoneNumber && values.phoneNumber.trim() && { phoneNumber: values.phoneNumber }),
      placeOfBirth: values.placeOfBirth,
      ...(values.lastResidenceAddress && 
        (values.lastResidenceAddress.street?.trim() || 
         values.lastResidenceAddress.houseNumber?.trim() || 
         values.lastResidenceAddress.apartmentNumber?.trim() || 
         values.lastResidenceAddress.postalCode?.trim() || 
         values.lastResidenceAddress.city?.trim()) && {
        lastResidenceAddress: {
          street: values.lastResidenceAddress.street!,
          houseNumber: values.lastResidenceAddress.houseNumber!,
          postalCode: values.lastResidenceAddress.postalCode!,
          city: values.lastResidenceAddress.city!,
          ...(values.lastResidenceAddress.apartmentNumber && values.lastResidenceAddress.apartmentNumber.trim() && {
            apartmentNumber: values.lastResidenceAddress.apartmentNumber,
          }),
        },
      }),
    }
    onSubmit(data)
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Dane osoby poszkodowanej</CardTitle>
        <CardDescription>
          Wypełnij formularz danymi osoby poszkodowanej
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
            {/* Dane podstawowe */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-1">Dane osobowe</h3>
                <p className="text-sm text-muted-foreground">
                  Podstawowe informacje o osobie poszkodowanej
                </p>
              </div>
              
              {/* PESEL - pierwszy */}
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <FormField
                  control={form.control}
                  name="pesel"
                  render={({ field }) => (
                    <FormItem className="w-full md:w-[calc(50%-12px)]">
                      <FormLabel>PESEL</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="12345678901" 
                          maxLength={11}
                          className="w-full"
                          {...field}
                          onChange={(e) => {
                            const formatted = formatPesel(e.target.value)
                            field.onChange(formatted)
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Dokument tożsamości - typ, numer */}
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <FormField
                  control={form.control}
                  name="identityDocument.type"
                  render={({ field }) => (
                    <FormItem className="w-full md:flex-1">
                      <FormLabel>Typ dokumentu</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Wybierz typ" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={IdentityDocumentType.IdentityCard}>Dowód osobisty</SelectItem>
                          <SelectItem value={IdentityDocumentType.Passport}>Paszport</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="identityDocument.number"
                  render={({ field }) => (
                    <FormItem className="w-full md:flex-1">
                      <FormLabel>Numer dokumentu</FormLabel>
                      <FormControl>
                        <Input placeholder="ABC 123456" className="w-full" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Imię i Nazwisko */}
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem className="w-full md:flex-1">
                      <FormLabel>Imię</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Jan" 
                          className="w-full" 
                          {...field}
                          onChange={(e) => {
                            const formatted = formatLettersOnly(e.target.value)
                            field.onChange(formatted)
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem className="w-full md:flex-1">
                      <FormLabel>Nazwisko</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Kowalski" 
                          className="w-full" 
                          {...field}
                          onChange={(e) => {
                            const formatted = formatLettersOnly(e.target.value)
                            field.onChange(formatted)
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Data urodzenia i Miejsce urodzenia */}
              <div className="flex flex-col md:flex-row gap-6 items-start mt-6">
                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem className="w-full md:flex-1 flex flex-col">
                      <FormLabel>Data urodzenia</FormLabel>
                      <FormControl>
                        <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full h-10 justify-between text-left font-normal bg-background hover:bg-background border border-input rounded-md px-3 py-2 text-base md:text-sm transition-colors shadow-none focus-visible:outline-none focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-0",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              <span>
                                {field.value ? (
                                  format(new Date(field.value), "dd.MM.yyyy")
                                ) : (
                                  <span className="text-muted-foreground">Wybierz datę</span>
                                )}
                              </span>
                              <CalendarIcon className="ml-2 h-4 w-4 text-primary flex-shrink-0" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value ? new Date(field.value) : undefined}
                              onSelect={(date) => {
                                field.onChange(date ? format(date, "yyyy-MM-dd") : "")
                                setCalendarOpen(false)
                              }}
                              disabled={(date) =>
                                date > new Date() || date < new Date("1900-01-01")
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="placeOfBirth"
                  render={({ field }) => (
                    <FormItem className="w-full md:flex-[3]">
                      <FormLabel>Miejsce urodzenia</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Warszawa" 
                          className="w-full" 
                          {...field}
                          onChange={(e) => {
                            const formatted = formatLettersOnly(e.target.value)
                            field.onChange(formatted)
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Numer telefonu - opcjonalnie */}
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem className="w-full md:w-[calc(50%-12px)]">
                      <FormLabel>
                        Numer telefonu <span className="text-muted-foreground">(opcjonalnie)</span>
                      </FormLabel>
                      <FormControl>
                        <Input 
                          type="tel"
                          placeholder="+48 123 456 789"
                          className="w-full"
                          {...field}
                          onChange={(e) => {
                            const formatted = formatDigitsOnly(e.target.value)
                            field.onChange(formatted)
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="border-t border-border pt-6">
              {/* Adres */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-1">Adres zamieszkania</h3>
                  <p className="text-sm text-muted-foreground">
                    Pełny adres osoby poszkodowanej
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-6 items-start">
                    <FormField
                      control={form.control}
                      name="address.street"
                      render={({ field }) => (
                        <FormItem className="w-full md:flex-[2]">
                          <FormLabel>Ulica</FormLabel>
                          <FormControl>
                            <Input placeholder="ul. Przykładowa" className="w-full" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="address.houseNumber"
                      render={({ field }) => (
                        <FormItem className="w-full md:flex-1">
                          <FormLabel>Nr domu</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="12" 
                              className="w-full" 
                              {...field}
                              onChange={(e) => {
                                const formatted = formatDigitsOnly(e.target.value)
                                field.onChange(formatted)
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="address.apartmentNumber"
                      render={({ field }) => (
                        <FormItem className="w-full md:flex-1">
                          <FormLabel>
                            Nr lokalu <span className="text-muted-foreground">(opcjonalnie)</span>
                          </FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="5" 
                              className="w-full" 
                              {...field}
                              onChange={(e) => {
                                const formatted = formatDigitsOnly(e.target.value)
                                field.onChange(formatted)
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-6 items-start">
                    <FormField
                      control={form.control}
                      name="address.postalCode"
                      render={({ field }) => (
                        <FormItem className="w-full md:flex-1">
                          <FormLabel>Kod pocztowy</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="00-000" 
                              maxLength={6}
                              className="w-full"
                              {...field}
                              onChange={(e) => {
                                const formatted = formatPostalCode(e.target.value)
                                field.onChange(formatted)
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="address.city"
                      render={({ field }) => (
                        <FormItem className="w-full md:flex-1">
                          <FormLabel>Miejscowość</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Warszawa" 
                              className="w-full" 
                              {...field}
                              onChange={(e) => {
                                const formatted = formatLettersOnly(e.target.value)
                                field.onChange(formatted)
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="address.country"
                    render={({ field }) => (
                      <FormItem className="w-full md:w-[calc(50%-12px)]">
                        <FormLabel>
                          Państwo <span className="text-muted-foreground">(opcjonalnie)</span>
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Polska" 
                            className="w-full" 
                            {...field}
                            onChange={(e) => {
                              const formatted = formatLettersOnly(e.target.value)
                              field.onChange(formatted)
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-6">
              {/* Adres ostatniego miejsca zamieszkania w Polsce / adres miejsca pobytu */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-1">Adres ostatniego miejsca zamieszkania w Polsce / adres miejsca pobytu</h3>
                  <p className="text-sm text-muted-foreground">
                    Jeżeli nie masz adresu zamieszkania, podaj adres miejsca pobytu lub adres ostatniego miejsca zamieszkania w Polsce
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-6 items-start">
                    <FormField
                      control={form.control}
                      name="lastResidenceAddress.street"
                      render={({ field }) => (
                        <FormItem className="w-full md:flex-[2]">
                          <FormLabel>Ulica</FormLabel>
                          <FormControl>
                            <Input placeholder="ul. Przykładowa" className="w-full" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastResidenceAddress.houseNumber"
                      render={({ field }) => (
                        <FormItem className="w-full md:flex-1">
                          <FormLabel>Nr domu</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="12" 
                              className="w-full" 
                              {...field}
                              onChange={(e) => {
                                const formatted = formatDigitsOnly(e.target.value)
                                field.onChange(formatted)
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastResidenceAddress.apartmentNumber"
                      render={({ field }) => (
                        <FormItem className="w-full md:flex-1">
                          <FormLabel>
                            Nr lokalu <span className="text-muted-foreground">(opcjonalnie)</span>
                          </FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="5" 
                              className="w-full" 
                              {...field}
                              onChange={(e) => {
                                const formatted = formatDigitsOnly(e.target.value)
                                field.onChange(formatted)
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-6 items-start">
                    <FormField
                      control={form.control}
                      name="lastResidenceAddress.postalCode"
                      render={({ field }) => (
                        <FormItem className="w-full md:flex-1">
                          <FormLabel>Kod pocztowy</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="00-000" 
                              maxLength={6}
                              className="w-full"
                              {...field}
                              onChange={(e) => {
                                const formatted = formatPostalCode(e.target.value)
                                field.onChange(formatted)
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastResidenceAddress.city"
                      render={({ field }) => (
                        <FormItem className="w-full md:flex-1">
                          <FormLabel>Miejscowość</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Warszawa" 
                              className="w-full" 
                              {...field}
                              onChange={(e) => {
                                const formatted = formatLettersOnly(e.target.value)
                                field.onChange(formatted)
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit" size="lg" className="w-full sm:w-auto min-w-[120px]">
                Zapisz
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

