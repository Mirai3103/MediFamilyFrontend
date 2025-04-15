// src/components/navigation/BackButton.tsx
import { ArrowLeft } from "lucide-react";
import { useRouter } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export default function BackButton() {
	const { history } = useRouter();

	return (
		<Button variant="ghost" className="mb-4" onClick={() => history.back()}>
			<ArrowLeft className="mr-2 h-4 w-4" />
			Quay lại
		</Button>
	);
}
