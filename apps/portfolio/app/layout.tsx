import "./globals.css";
import { Inter, Roboto_Mono } from "next/font/google";
import type { Metadata } from "next/types";
import { Header } from "@components/header";
import { cn } from "@ui/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const roboto = Roboto_Mono({
	subsets: ["latin"],
	variable: "--font-roboto-mono",
});

export const metadata: Metadata = {
	title: "guythat.codes",
	description: "Portfolio website of Luca Fanselau - Software Engineer",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" className={cn(inter.variable, roboto.variable)}>
			<body
				className={
					"bg-background text-foreground w-screen font-sans flex justify-center pb-[env(safe-area-inset-bottom)]"
				}
			>
				{/* Main Column */}
				<div
					className={"main container flex flex-col space-y-2 flex-1 h-full p-4"}
				>
					<Header />
					{children}
				</div>
				<div
					className={
						"overflow-hidden absolute w-full h-full top-0 left-0 -z-10"
					}
				>
					<span
						className={
							"absolute top-16 rotate-[6deg] -right-[200px] rounded-full bg-gradient-to-b h-[85vh] w-[400px] from-green-300 to-blue-500 via-cyan-600 opacity-80 blur-3xl filter"
						}
					/>
				</div>
			</body>
		</html>
	);
}
