import React, { useState } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { CountryCode } from "libphonenumber-js/core";

import { useTranslations } from "next-intl";
import { PhoneInputField } from "./phone-input-field";
import { BookingInput } from "@/lib/schemas/booking.schema";
import { UseFormReturn } from "react-hook-form";
import { Input } from "../ui/input";
import Image from "next/image";

type PersonalDataProps = {
  form: UseFormReturn<BookingInput>;
  isSubmitting: boolean;
};

const PersonalData = ({ form, isSubmitting }: PersonalDataProps) => {
  type Country = CountryCode;
  const DEFAULT_COUNTRY: Country = "SA";
  const t = useTranslations("HomePage");
  const [country, setCountry] = useState<Country>(DEFAULT_COUNTRY);

  return (
    <div className="flex flex-col gap-4">
      <p>Enter your personal details to proceed to the last step.</p>
      <FormField
        control={form.control}
        name="phone"
        render={({ field }) => (
          <FormItem>
            <div className="flex gap-1 items-center justify-start">
              <FormLabel className="font-semibold">
                {t("contact-information")}
              </FormLabel>
              <span className="text-red-500 text-2xl">*</span>
            </div>
            <FormControl>
              <PhoneInputField
                country={country}
                phoneCountry={form.watch("phone_country")}
                phoneNumber={field.value}
                onPhoneCountryChange={(nextPhoneCountry, nextCountry) => {
                  setCountry(nextCountry);
                  form.setValue("phone_country", nextPhoneCountry, {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                }}
                onPhoneNumberChange={field.onChange}
                disabled={isSubmitting}
                placeholder={t("phone-placeholder")}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="phone"
        render={({ field }) => (
          <FormItem>
            <div className="flex gap-1 items-center justify-start">
              <FormLabel className="font-semibold">
                {t("plate-number")}
              </FormLabel>
              <span className="text-red-500 text-2xl">*</span>
            </div>
            <p className="text-xs text-muted-foreground">{t("plate-order")}</p>
            <FormControl>
              <Input className="w-auto" />
            </FormControl>
            <div className="w-fit flex flex-col gap-2 items-center justify-center border-black rounded-xl max-w-xs p-2 border-2">
              <Image
                alt="saudi arabia"
                width={20}
                height={20}
                src="/icons/Saudi_Arabia.svg"
              />
              <p className="text-[6px]">السعودية</p>
              <span className="flex flex-col text-[8px]">
                <span>K</span>
                <span>S</span>
                <span>A</span>
              </span>
              <span className="bg-black rounded-full size-2"></span>
            </div>

            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default PersonalData;
