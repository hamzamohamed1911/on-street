"use client";

import { useLocale, useTranslations } from "next-intl";
import { parseAsStringLiteral, useQueryState } from "nuqs";
import { useEffect } from "react";
import { ZoneList } from "@/components/home/zone-list";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BOOKING_STEPS,
  DEFAULT_BOOKING_STEP,
  type BookingStep,
} from "@/lib/booking-steps";
import { getLocaleDirection } from "@/i18n/routing";
import { cn } from "@/lib/utils/cn";

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
  qrId: string;
};

export function BookingSteps({ qrId }: BookingStepsProps) {
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
              <span className="text-sm font-extrabold text-foreground">
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
            {value === "1" ? (
              <ZoneList qrId={qrId} />
            ) : (
              <p className="mt-2 max-w-xl text-xs leading-relaxed text-muted-foreground">
                {t(copy.contentDescriptionKey)}
              </p>
            )}
          </TabsContent>
        );
      })}
    </Tabs>
  );
}
