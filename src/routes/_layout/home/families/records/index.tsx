import MemberMedicalRecord from "@/pages/RecordDetail";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/home/families/records/")({
	component: RouteComponent,
});

function RouteComponent() {
	return <MemberMedicalRecord />;
}
