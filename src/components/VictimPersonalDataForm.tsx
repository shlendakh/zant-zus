import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { VictimPersonalData } from "@/types/victim-personal-data"

const formSchema = z.object({
  pesel: z.string().optional(),
  dateOfBirth: z.string().optional(),
  identityDocument: z
    .object({
      type: z.string(),
      number: z.string(),
    })
    .optional(),
  firstName: z.string().min(1, "Imię jest wymagane"),
  lastName: z.string().min(1, "Nazwisko jest wymagane"),
  address: z.object({
    street: z.string().min(1, "Ulica jest wymagana"),
    houseNumber: z.string().min(1, "Numer domu jest wymagany"),
    apartmentNumber: z.string().optional(),
    postalCode: z.string().min(1, "Kod pocztowy jest wymagany"),
    city: z.string().min(1, "Miejscowość jest wymagana"),
    country: z.string().optional(),
  }),
  phoneNumber: z.string().optional(),
  placeOfBirth: z.string().min(1, "Miejsce urodzenia jest wymagane"),
})

type FormValues = z.infer<typeof formSchema>

interface VictimPersonalDataFormProps {
  onSubmit: (data: VictimPersonalData) => void
  defaultValues?: Partial<VictimPersonalData>
}

export function VictimPersonalDataForm({
  onSubmit,
  defaultValues,
}: VictimPersonalDataFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pesel: defaultValues?.pesel || "",
      dateOfBirth: defaultValues?.dateOfBirth || "",
      identityDocument: defaultValues?.identityDocument || {
        type: "",
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
    },
  })

  function handleSubmit(values: FormValues) {
    const data: VictimPersonalData = {
      ...(values.pesel && values.pesel.trim() && { pesel: values.pesel }),
      ...(values.dateOfBirth && values.dateOfBirth.trim() && { dateOfBirth: values.dateOfBirth }),
      ...(values.identityDocument && 
          values.identityDocument.type && 
          values.identityDocument.number && {
        identityDocument: {
          type: values.identityDocument.type,
          number: values.identityDocument.number,
        },
      }),
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
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Dane podstawowe */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Dane podstawowe</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Imię</FormLabel>
                      <FormControl>
                        <Input placeholder="Jan" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nazwisko</FormLabel>
                      <FormControl>
                        <Input placeholder="Kowalski" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="pesel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>PESEL</FormLabel>
                      <FormControl>
                        <Input placeholder="12345678901" {...field} />
                      </FormControl>
                      <FormDescription>Opcjonalne</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data urodzenia</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormDescription>Opcjonalne</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="placeOfBirth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Miejsce urodzenia</FormLabel>
                      <FormControl>
                        <Input placeholder="Warszawa" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Numer telefonu</FormLabel>
                      <FormControl>
                        <Input placeholder="+48 123 456 789" {...field} />
                      </FormControl>
                      <FormDescription>Opcjonalne</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Dokument tożsamości */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Dokument tożsamości</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="identityDocument.type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Typ dokumentu</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Wybierz typ dokumentu" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="dowód">Dowód osobisty</SelectItem>
                          <SelectItem value="paszport">Paszport</SelectItem>
                          <SelectItem value="prawo_jazdy">
                            Prawo jazdy
                          </SelectItem>
                          <SelectItem value="inny">Inny</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>Opcjonalne</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="identityDocument.number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Numer dokumentu</FormLabel>
                      <FormControl>
                        <Input placeholder="ABC123456" {...field} />
                      </FormControl>
                      <FormDescription>Opcjonalne</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Adres */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Adres</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="address.street"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ulica</FormLabel>
                      <FormControl>
                        <Input placeholder="ul. Przykładowa" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address.houseNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Numer domu</FormLabel>
                      <FormControl>
                        <Input placeholder="12" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address.apartmentNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Numer lokalu</FormLabel>
                      <FormControl>
                        <Input placeholder="5" {...field} />
                      </FormControl>
                      <FormDescription>Opcjonalne</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address.postalCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kod pocztowy</FormLabel>
                      <FormControl>
                        <Input placeholder="00-000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address.city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Miejscowość</FormLabel>
                      <FormControl>
                        <Input placeholder="Warszawa" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address.country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Państwo</FormLabel>
                      <FormControl>
                        <Input placeholder="Polska" {...field} />
                      </FormControl>
                      <FormDescription>Opcjonalne</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit">Zapisz</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

