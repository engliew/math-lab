import type { Metadata } from "next";
import { Fredoka, Nunito } from "next/font/google";
import { AuthProvider } from "@/components/auth-provider";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://mathlab.engliew.xyz"),
  title: "Math Lab — primary maths practice",
  description:
    "Colourful maths practice for children ages 5–12. Preschool to Year 6, aligned with Cambridge Primary Mathematics. Register to keep your path. Twenty questions a lesson.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${nunito.variable} ${fredoka.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
