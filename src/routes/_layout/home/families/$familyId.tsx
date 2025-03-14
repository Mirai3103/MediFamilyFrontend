import FamilyPage from "@/pages/FamilyDetailPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/home/families/$familyId")({
	component: RouteComponent,
});

function RouteComponent() {
	return <FamilyPage />;
}
