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
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import type { AccidentDetailsData } from "@/types/accident-details-data"

const formSchema = z.object({
  accidentDate: z.string().min(1, "Data wypadku jest wymagana"),
  accidentTime: z.string().min(1, "Godzina wypadku jest wymagana"),
  accidentLocation: z.string().min(1, "Miejsce wypadku jest wymagane"),
  plannedWorkStartTime: z.string().optional(),
  plannedWorkEndTime: z.string().optional(),
  injuryTypes: z.string().min(1, "Rodzaj urazów jest wymagany"),
  accidentDescription: z.string().min(1, "Opis wypadku jest wymagany"),
  medicalFacilityName: z.string().optional(),
  medicalFacilityAddress: z.string().optional(),
  investigationAuthorityName: z.string().optional(),
  investigationAuthorityAddress: z.string().optional(),
  occurredDuringMachineOperation: z.boolean(),
  machineWasOperational: z.boolean().optional(),
  usedAccordingToManufacturerRules: z.boolean().optional(),
  machineOperationDescription: z.string().optional(),
  hasCertificateOrDeclaration: z.boolean().optional(),
  registeredInFixedAssetsRegistry: z.boolean().optional(),
})

type FormValues = z.infer<typeof formSchema>

interface AccidentDetailsFormProps {
  onSubmit: (data: AccidentDetailsData) => void
  defaultValues?: Partial<AccidentDetailsData>
}

export function AccidentDetailsForm({
  onSubmit,
  defaultValues,
}: AccidentDetailsFormProps) {
  const [dateCalendarOpen, setDateCalendarOpen] = useState(false)
  const [occurredDuringMachineOperation, setOccurredDuringMachineOperation] = useState(
    defaultValues?.occurredDuringMachineOperation || false
  )

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      accidentDate: defaultValues?.accidentDate || "",
      accidentTime: defaultValues?.accidentTime || "",
      accidentLocation: defaultValues?.accidentLocation || "",
      plannedWorkStartTime: defaultValues?.plannedWorkStartTime || "",
      plannedWorkEndTime: defaultValues?.plannedWorkEndTime || "",
      injuryTypes: defaultValues?.injuryTypes || "",
      accidentDescription: defaultValues?.accidentDescription || "",
      medicalFacilityName: defaultValues?.medicalFacilityName || "",
      medicalFacilityAddress: defaultValues?.medicalFacilityAddress || "",
      investigationAuthorityName: defaultValues?.investigationAuthorityName || "",
      investigationAuthorityAddress: defaultValues?.investigationAuthorityAddress || "",
      occurredDuringMachineOperation: defaultValues?.occurredDuringMachineOperation || false,
      machineWasOperational: defaultValues?.machineWasOperational || false,
      usedAccordingToManufacturerRules: defaultValues?.usedAccordingToManufacturerRules || false,
      machineOperationDescription: defaultValues?.machineOperationDescription || "",
      hasCertificateOrDeclaration: defaultValues?.hasCertificateOrDeclaration || false,
      registeredInFixedAssetsRegistry: defaultValues?.registeredInFixedAssetsRegistry || false,
    },
  })

  function handleSubmit(values: FormValues) {
    const data: AccidentDetailsData = {
      accidentDate: values.accidentDate,
      accidentTime: values.accidentTime,
      accidentLocation: values.accidentLocation,
      plannedWorkStartTime: values.plannedWorkStartTime,
      plannedWorkEndTime: values.plannedWorkEndTime,
      injuryTypes: values.injuryTypes,
      accidentDescription: values.accidentDescription,
      medicalFacilityName: values.medicalFacilityName,
      medicalFacilityAddress: values.medicalFacilityAddress,
      investigationAuthorityName: values.investigationAuthorityName,
      investigationAuthorityAddress: values.investigationAuthorityAddress,
      occurredDuringMachineOperation: values.occurredDuringMachineOperation,
      machineWasOperational: values.machineWasOperational,
      usedAccordingToManufacturerRules: values.usedAccordingToManufacturerRules,
      machineOperationDescription: values.machineOperationDescription,
      hasCertificateOrDeclaration: values.hasCertificateOrDeclaration,
      registeredInFixedAssetsRegistry: values.registeredInFixedAssetsRegistry,
    }
    onSubmit(data)
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Opis wypadku</CardTitle>
        <CardDescription>
          Prosimy o jak najbardziej szczegółowe uzupełnienie danych odnośnie wypadku. Pozwoli nam to na szybszą weryfikację sprawy.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-1">Informacje, które dotyczą Twojego wypadku</h3>
              </div>

              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <FormField
                  control={form.control}
                  name="accidentDate"
                  render={({ field }) => (
                    <FormItem className="w-full md:flex-1">
                      <FormLabel>Data wypadku</FormLabel>
                      <Popover open={dateCalendarOpen} onOpenChange={setDateCalendarOpen}>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                              {field.value ? (
                                format(new Date(field.value), "dd.MM.yyyy")
                              ) : (
                                <span>Wybierz datę</span>
                              )}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value ? new Date(field.value) : undefined}
                            onSelect={(date) => {
                              if (date) {
                                field.onChange(format(date, "yyyy-MM-dd"))
                                setDateCalendarOpen(false)
                              }
                            }}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="accidentTime"
                  render={({ field }) => (
                    <FormItem className="w-full md:flex-1">
                      <FormLabel>Godzina wypadku</FormLabel>
                      <FormControl>
                        <Input type="time" className="w-full" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="accidentLocation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Miejsce wypadku</FormLabel>
                    <FormControl>
                      <Input placeholder="np. ul. Przykładowa 12, Warszawa" className="w-full" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <FormField
                  control={form.control}
                  name="plannedWorkStartTime"
                  render={({ field }) => (
                    <FormItem className="w-full md:flex-1">
                      <FormLabel>
                        Godzina rozpoczęcia pracy <span className="text-muted-foreground">(opcjonalnie)</span>
                      </FormLabel>
                      <FormControl>
                        <Input type="time" className="w-full" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="plannedWorkEndTime"
                  render={({ field }) => (
                    <FormItem className="w-full md:flex-1">
                      <FormLabel>
                        Godzina zakończenia pracy <span className="text-muted-foreground">(opcjonalnie)</span>
                      </FormLabel>
                      <FormControl>
                        <Input type="time" className="w-full" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="injuryTypes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rodzaj urazów jakich doznałeś wskutek wypadku</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Opisz rodzaj urazów..."
                        className="w-full min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="accidentDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Szczegółowy opis w jakich okolicznościach i z jakiej przyczyny doszło do wypadku, a także opis miejsca, w którym wydarzył się wypadek</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Opisz szczegółowo okoliczności wypadku..."
                        className="w-full min-h-[150px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="border-t border-border pt-6 space-y-4">
                <h3 className="text-lg font-semibold">Pierwsza pomoc medyczna</h3>
                <FormField
                  control={form.control}
                  name="medicalFacilityName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Nazwa placówki służby zdrowia <span className="text-muted-foreground">(opcjonalnie)</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="np. Szpital Miejski" className="w-full" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="medicalFacilityAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Adres placówki służby zdrowia <span className="text-muted-foreground">(opcjonalnie)</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="np. ul. Przykładowa 12, Warszawa" className="w-full" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="border-t border-border pt-6 space-y-4">
                <h3 className="text-lg font-semibold">Postępowanie w sprawie wypadku</h3>
                <FormField
                  control={form.control}
                  name="investigationAuthorityName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Nazwa organu prowadzącego postępowanie <span className="text-muted-foreground">(opcjonalnie)</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="np. Komenda Policji, Prokuratura" className="w-full" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="investigationAuthorityAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Adres organu prowadzącego postępowanie <span className="text-muted-foreground">(opcjonalnie)</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="np. ul. Przykładowa 12, Warszawa" className="w-full" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="border-t border-border pt-6 space-y-4">
                <div className="flex flex-row items-start space-x-3 space-y-0">
                  <FormField
                    control={form.control}
                    name="occurredDuringMachineOperation"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={(checked) => {
                              field.onChange(checked === true)
                              setOccurredDuringMachineOperation(checked === true)
                            }}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="cursor-pointer">
                            Czy Twój wypadek powstał podczas obsługi maszyn, urządzeń?
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                {occurredDuringMachineOperation && (
                  <div className="space-y-4 pl-7">
                    <div className="flex flex-row items-start space-x-3 space-y-0">
                      <FormField
                        control={form.control}
                        name="machineWasOperational"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value || false}
                                onCheckedChange={(checked) => {
                                  field.onChange(checked === true)
                                }}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="cursor-pointer">
                                Maszyna/urządzenie były sprawne
                              </FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="flex flex-row items-start space-x-3 space-y-0">
                      <FormField
                        control={form.control}
                        name="usedAccordingToManufacturerRules"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value || false}
                                onCheckedChange={(checked) => {
                                  field.onChange(checked === true)
                                }}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="cursor-pointer">
                                Używałeś maszyny/urządzenia zgodnie z zasadami producenta
                              </FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="machineOperationDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Opisz w jaki sposób używałeś maszyny/urządzenia</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Opisz sposób użycia maszyny/urządzenia..."
                              className="w-full min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex flex-row items-start space-x-3 space-y-0">
                      <FormField
                        control={form.control}
                        name="hasCertificateOrDeclaration"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value || false}
                                onCheckedChange={(checked) => {
                                  field.onChange(checked === true)
                                }}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="cursor-pointer">
                                Maszyna/urządzenie posiadają atest/deklarację zgodności
                              </FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="flex flex-row items-start space-x-3 space-y-0">
                      <FormField
                        control={form.control}
                        name="registeredInFixedAssetsRegistry"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value || false}
                                onCheckedChange={(checked) => {
                                  field.onChange(checked === true)
                                }}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="cursor-pointer">
                                Maszyna/urządzenie zostały wpisane do ewidencji środków trwałych
                              </FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                )}
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

