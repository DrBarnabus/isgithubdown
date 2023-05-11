import "~/styles/globals.scss";

import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata = {
  title: "Is GitHub Down?",
  description: "A quick answer to a burning question, Is GitHub Down?",
  viewport: 'width=device-width, initial-scale=1'
};

type PageProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: PageProps) {
  return (
    <html lang="en" className={inter.className}>
      <body>{children}</body>
    </html>
  );
}
