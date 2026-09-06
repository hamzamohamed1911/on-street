import { Almarai } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const almarai = Almarai({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "700", "800"],
  variable: "--font-almarai",
  display: "swap",
});

export default function RootNotFoundPage() {
  return (
    <html lang="ar" dir="rtl" className={`${almarai.variable} h-full`}>
      <body className={`${almarai.className} min-h-full antialiased`}>
        <section className="relative min-h-dvh px-4 py-8 sm:px-6 sm:py-10">
          <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 pt-8">
            <div className="flex w-full max-w-md flex-col items-center gap-6">
              <div className="w-full rounded-xl bg-natural-25 p-5 shadow-lg md:p-6">
                <div className="flex flex-col items-center py-4 text-center">
                  <p className="text-xs font-bold tracking-[0.2em] text-primary-500 uppercase">
                    Error 404
                  </p>
                  <p
                    className="mt-2 bg-linear-to-b from-primary-500 to-secondary-500 bg-clip-text text-6xl font-extrabold text-transparent sm:text-7xl"
                    aria-hidden
                  >
                    404
                  </p>
                  <h1 className="mt-3 text-lg font-extrabold text-natural-1000 sm:text-xl">
                    Page not found
                  </h1>
                  <p className="mt-2 max-w-sm text-sm leading-relaxed text-natural-900">
                    The page you are looking for does not exist or may have been
                    moved.
                  </p>
                  <Link
                    href="/"
                    className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-primary-500 px-6 text-sm font-bold text-natural-25 transition-colors hover:bg-primary-500/90"
                  >
                    Back to home
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </body>
    </html>
  );
}
