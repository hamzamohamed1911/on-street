"use client";

import { useLocale, useTranslations } from "next-intl";
import { parseAsStringLiteral, useQueryState } from "nuqs";
import { useEffect } from "react";
import { ZoneList } from "@/components/home/zone-list";
import { zodResolver } from "@hookform/resolvers/zod";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BOOKING_STEPS,
  DEFAULT_BOOKING_STEP,
  type BookingStep,
} from "@/lib/booking-steps";
import { getLocaleDirection } from "@/i18n/routing";
import type { ParkingZone } from "@/lib/zones";
import { cn } from "@/lib/utils/cn";
import PersonalData from "./PersonalData";
import { useForm } from "react-hook-form";

import { Form } from "@/components/ui/form";
import { useMutation } from "@tanstack/react-query";
import {
  bookingDefaultValues,
  BookingInput,
  createBookingSchema,
} from "@/lib/schemas/booking.schema";
import { submitBooking } from "@/lib/api/zones";

const stepCopy = {
  "1": {
    titleKey: "zoneTime",
    contentTitleKey: "zoneTimeTitle",
    contentDescriptionKey: "zoneTimeDescription",
  },
  "2": {
    titleKey: "personalData",
    contentTitleKey: "personalDataTitle",
    contentDescriptionKey: "personalDataDescription",
  },
  "3": {
    titleKey: "payment",
    contentTitleKey: "paymentTitle",
    contentDescriptionKey: "paymentDescription",
  },
} as const;

type BookingStepsProps = {
  zone: ParkingZone | null;
  zoneError?: string | null;
};

export function BookingSteps({ zone, zoneError }: BookingStepsProps) {
  const t = useTranslations("HomePage");
  const locale = useLocale();
  const dir = getLocaleDirection(locale);
  const [step, setStep] = useQueryState(
    "step",
    parseAsStringLiteral(BOOKING_STEPS)
      .withDefault(DEFAULT_BOOKING_STEP)
      .withOptions({
        clearOnDefault: false,
        history: "replace",
      }),
  );

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const current = new URLSearchParams(window.location.search).get("step");

    if (!current) {
      void setStep(DEFAULT_BOOKING_STEP);
    }
  }, [setStep]);

  function handleStepChange(value: string) {
    void setStep(value as BookingStep);
  }
  const schema = createBookingSchema((key) => t(key as never));
  const form = useForm<BookingInput>({
    resolver: zodResolver(schema),
    defaultValues: bookingDefaultValues,
  });

  const registerMutation = useMutation({
    mutationFn: submitBooking,
  
    onMutate: () => {
      form.clearErrors();
    },
  
    onSuccess: () => {},
  
    onError: (error) => {
      const backendErrors = error;
  
      if (!backendErrors) {
        return;
      }
  
      Object.entries(backendErrors).forEach(
        ([field, messages]) => {
          if (!Array.isArray(messages) || messages.length === 0) {
            return;
          }
  
          form.setError(field as keyof BookingInput, {
            type: "server",
            message: messages[0],
          });
        },
      );
    },
  });

  const isSubmitting = registerMutation.isPending;

  function onSubmit(values: BookingInput) {
    registerMutation.mutate(values);
  }
  return (
    <Tabs
      dir={dir}
      value={step}
      onValueChange={handleStepChange}
      className="w-full text-start"
    >
      <TabsList className="w-full gap-4 sm:gap-8">
        {BOOKING_STEPS.map((value) => {
          const copy = stepCopy[value];

          return (
            <TabsTrigger key={value} value={value} className="group min-w-0">
              <span className="text-[11px] font-medium text-muted-foreground">
                {t("stepLabel", { number: value })}
              </span>
              <span className="md:text-sm text-[10px] font-extrabold text-foreground">
                {t(copy.titleKey)}
              </span>
              <span
                className={cn(
                  "mt-1 h-1.5 w-full rounded-full bg-natural-500 transition-colors",
                  "group-data-[state=active]:bg-amber-400",
                )}
              />
            </TabsTrigger>
          );
        })}
      </TabsList>

      {BOOKING_STEPS.map((value) => {
        const copy = stepCopy[value];

        return (
          <TabsContent key={value} value={value} className="pt-1">
            <h2 className="text-lg font-extrabold text-foreground">
              {t(copy.contentTitleKey)}
            </h2>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
                noValidate
              >
                {value === "1" ? (
                  <ZoneList form={form} zone={zone} error={zoneError} />
                ) : (
                  <PersonalData isSubmitting={isSubmitting} form={form} />
                )}
              </form>
            </Form>
          </TabsContent>
        );
      })}
    </Tabs>
  );
}
