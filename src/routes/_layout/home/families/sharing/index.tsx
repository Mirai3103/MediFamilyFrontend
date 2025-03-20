import RecordSharing from "@/pages/Sharing";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/home/families/sharing/")({
	component: RouteComponent,
});

function RouteComponent() {
	return <RecordSharing />;
}
