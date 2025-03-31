import UserProfile from "@/pages/UserProfile";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/home/user-profile")({
	component: RouteComponent,
});

function RouteComponent() {
	return <UserProfile />;
}
