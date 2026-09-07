"use client";

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

const PersonalData = ({
  form,
  isSubmitting,
}: PersonalDataProps) => {
  type Country = CountryCode;

  const DEFAULT_COUNTRY: Country = "SA";

  const t = useTranslations("HomePage");

  const [country, setCountry] =
    useState<Country>(DEFAULT_COUNTRY);

  // Plate UI states
  const [numbers, setNumbers] = useState("");
  const [letters, setLetters] = useState("");

  return (
    <div className="flex flex-col gap-4">
      <p>
        Enter your personal details to proceed to the last step.
      </p>

      {/* Phone */}
      <FormField
        control={form.control}
        name="phone"
        render={({ field }) => (
          <FormItem>
            <div className="flex items-center justify-start gap-1">
              <FormLabel className="font-semibold">
                {t("contact-information")}
              </FormLabel>

              <span className="text-2xl text-red-500">
                *
              </span>
            </div>

            <FormControl>
              <PhoneInputField
                country={country}
                phoneCountry={form.watch("phone_country")}
                phoneNumber={field.value}
                onPhoneCountryChange={(
                  nextPhoneCountry,
                  nextCountry,
                ) => {
                  setCountry(nextCountry);

                  form.setValue(
                    "phone_country",
                    nextPhoneCountry,
                    {
                      shouldValidate: true,
                      shouldDirty: true,
                    },
                  );
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

      {/* Plate */}
      <FormField
        control={form.control}
        name="plate"
        render={() => (
          <FormItem>
            <div className="flex items-center justify-start gap-1">
              <FormLabel className="font-semibold">
                {t("plate-number")}
              </FormLabel>

              <span className="text-2xl text-red-500">
                *
              </span>
            </div>

            <p className="text-xs text-muted-foreground">
              {t("plate-order")}
            </p>

            <FormControl>
              <div className="flex w-fit overflow-hidden rounded-xl border-2 border-black">
                {/* Main plate */}
                <div className="grid w-90 grid-cols-2 grid-rows-2">
                  {/* Numbers Input */}
                  <div className="flex items-center justify-center border-b-2 border-r-2 border-black">
                    <Input
                      value={numbers}
                      onChange={(e) => {
                        const value =
                          e.target.value.replace(/\D/g, "");

                        setNumbers(value);

                        form.setValue(
                          "plate",
                          `${value}${letters}`,
                          {
                            shouldValidate: true,
                            shouldDirty: true,
                          },
                        );
                      }}
                      inputMode="numeric"
                      maxLength={4}
                      placeholder="...."
                      disabled={isSubmitting}
                      className="h-full w-full border-0 text-center text-2xl shadow-none focus-visible:ring-0"
                    />
                  </div>

                  {/* Letters Input */}
                  <div className="flex items-center justify-center border-b-2 border-black">
                    <Input
                      value={letters}
                      onChange={(e) => {
                        const value =
                          e.target.value
                            .replace(/[^a-zA-Z]/g, "")
                            .toUpperCase();

                        setLetters(value);

                        form.setValue(
                          "plate",
                          `${numbers}${value}`,
                          {
                            shouldValidate: true,
                            shouldDirty: true,
                          },
                        );
                      }}
                      maxLength={3}
                      placeholder="A A A"
                      disabled={isSubmitting}
                      className="h-full w-full border-0 text-center text-2xl shadow-none focus-visible:ring-0"
                    />
                  </div>

                  {/* Numbers Result */}
                  <div className="flex items-center justify-center border-r-2 border-black text-2xl text-gray-300">
                    {numbers || "0000"}
                  </div>

                  {/* Letters Result */}
                  <div className="flex items-center justify-center text-2xl text-gray-300">
                    {letters || "AAA"}
                  </div>
                </div>

                {/* Saudi Section */}
                <div className="flex w-13.75 flex-col items-center justify-center gap-1 border-l-2 border-black py-2">
                  <Image
                    alt="saudi arabia"
                    width={25}
                    height={25}
                    src="/icons/Saudi_Arabia.svg"
                  />

                  <p className="text-[7px] font-semibold">
                    السعودية
                  </p>

                  <span className="flex flex-col items-center text-[10px] leading-3">
                    <span>K</span>
                    <span>S</span>
                    <span>A</span>
                  </span>

                  <span className="size-2 rounded-full bg-black dark:bg-white" />
                </div>
              </div>
            </FormControl>

            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default PersonalData;