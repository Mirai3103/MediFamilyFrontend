import FamilyPage from "@/pages/FamilyPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/home/family")({
	component: RouteComponent,
});

function RouteComponent() {
	return <FamilyPage />;
}
