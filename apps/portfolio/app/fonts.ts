import { Inter, Roboto_Mono } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const roboto = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-roboto-mono",
});

export { inter, roboto };
