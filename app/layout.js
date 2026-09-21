import { Literata, Karla } from "next/font/google";
import "./globals.css";

const literata = Literata({
  variable: "--font-voz",
  subsets: ["latin"],
});

const karla = Karla({
  variable: "--font-cuerpo",
  subsets: ["latin"],
});

export const metadata = {
  title: "Encuentra tu carrera compatible",
  description: "Test vocacional completo + datos reales del mercado laboral peruano.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="es"
      className={`${literata.variable} ${karla.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
