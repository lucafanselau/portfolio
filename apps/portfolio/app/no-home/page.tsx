import { Rust404 } from "@components/rust-404";
import { Rust404Instructions } from "@components/rust-404-instructions";

export default function NotFound() {
	return (
		<main
			className={"space-y-2 flex-1 flex flex-col items-center justify-center"}
		>
			<Rust404 />
			<Rust404Instructions />
		</main>
	);
}
