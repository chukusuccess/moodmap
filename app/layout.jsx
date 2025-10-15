import {
  Inter,
  Montserrat,
  Lora,
  Josefin_Slab,
  Cardo,
  Caveat,
  Playfair_Display,
  Lexend,
  Love_Light,
  Lovers_Quarrel,
} from "next/font/google";
import "./globals.css";
import { AntThemeProvider } from "./contexts/ThemeProvider";
import { ThemeProvider } from "./contexts/DarkModeProvider";
import { Suspense } from "react";
import { Spin } from "antd";
import AppNavbar from "./components/AppNav";

export const lexend = Lexend({
  subsets: ["latin", "latin-ext", "vietnamese"],
});

export const inter = Inter({ subsets: ["latin"], weight: ["variable"] });
export const montserrat = Montserrat({
  subsets: ["cyrillic"],
  weight: ["variable"],
});
export const lora = Lora({ subsets: ["cyrillic"], weight: ["variable"] });
export const cardo = Cardo({ subsets: ["greek"], weight: ["400", "700"] });
export const caveat = Caveat({ subsets: ["cyrillic"], weight: ["variable"] });
export const josephine = Josefin_Slab({
  subsets: ["latin"],
  weight: ["variable"],
});
export const playfair = Playfair_Display({
  subsets: ["cyrillic", "latin", "latin-ext", "vietnamese"],
  weight: ["variable"],
});
export const loveLight = Love_Light({
  subsets: ["latin", "latin-ext", "vietnamese"],
  weight: ["400"],
});
export const loversQuarrel = Lovers_Quarrel({
  subsets: ["latin", "latin-ext", "vietnamese"],
  weight: ["400"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Mood Map</title>
        <meta
          name="description"
          content="Global mood distribution across the globe daily."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="utf-8" />
      </head>
      <body
        className={`${lexend.className} antialiased flex flex-col items-center noscroll`}
      >
        <AntThemeProvider>
          <Suspense
            fallback={
              <div className="w-screen h-screen flex items-center justify-center">
                <Spin />
              </div>
            }
          >
            <ThemeProvider>
              <AppNavbar />
              <span className="mb-16" />
              {children}
            </ThemeProvider>
          </Suspense>
        </AntThemeProvider>
      </body>
    </html>
  );
}
