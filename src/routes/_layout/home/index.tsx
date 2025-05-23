import Overview from "@/pages/Overview";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/home/")({
	component: RouteComponent,
});

function RouteComponent() {
	return <Overview />;
}
