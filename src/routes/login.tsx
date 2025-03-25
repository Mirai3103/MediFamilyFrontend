import UnAuthLayout from "@/components/layout/UnAuthLayout";
import LoginPage from "@/pages/Auth/LoginPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/login")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<UnAuthLayout>
			<LoginPage />
		</UnAuthLayout>
	);
}
