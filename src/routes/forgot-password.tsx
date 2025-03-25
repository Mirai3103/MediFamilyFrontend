import UnAuthLayout from "@/components/layout/UnAuthLayout";
import { ForgotPassword } from "@/pages/Auth/ForgotPassword";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/forgot-password")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<UnAuthLayout>
			<ForgotPassword />
		</UnAuthLayout>
	);
}
