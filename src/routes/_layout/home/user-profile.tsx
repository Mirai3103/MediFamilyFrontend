import UserProfile from "@/pages/UserProfile";
import { me } from "@/queries/generated/profile-controller/profile-controller";
import { createFileRoute, useLoaderData } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/home/user-profile")({
	component: RouteComponent,
	loader: async () => {
		const [profile] = await Promise.all([me()]);
		return {
			profile,
		};
	},
});

function RouteComponent() {
	const { profile } = useLoaderData({
		from: "/_layout/home/user-profile",
	});
	return <UserProfile user={profile} profile={profile.profile!} />;
}
