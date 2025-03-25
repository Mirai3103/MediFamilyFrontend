import RegisterPage from "@/pages/Auth/RegisterPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/register")({
	component: RouteComponent,
});

function RouteComponent() {
	return <RegisterPage />;
}
