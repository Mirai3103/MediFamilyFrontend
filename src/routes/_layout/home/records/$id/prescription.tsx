import RecordPrescription from "@/pages/records/prescription";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/home/records/$id/prescription")({
	component: RouteComponent,
});

function RouteComponent() {
	return <RecordPrescription />;
}
