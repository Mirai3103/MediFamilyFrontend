import FamiliesPage from "@/pages/FamiliesPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/home/families/")({
	component: RouteComponent,
});

function RouteComponent() {
	return <FamiliesPage />;
}
