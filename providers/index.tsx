import { NuqsAdapter } from "nuqs/adapters/next/app";
import type { ReactNode } from "react";
import { QueryProvider } from "./query-provider";
import { ThemeProvider } from "./theme-provider";

type AppProvidersProps = {
  children: ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <NuqsAdapter>
      <QueryProvider>
        <ThemeProvider>{children}</ThemeProvider>
      </QueryProvider>
    </NuqsAdapter>
  );
}
