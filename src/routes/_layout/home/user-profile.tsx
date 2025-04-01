import UserProfile from "@/pages/UserProfile";
import { getMyHealthProfile } from "@/queries/generated/health-profile-controller/health-profile-controller";
import { me } from "@/queries/generated/user-controller/user-controller";
import { createFileRoute, useLoaderData } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/home/user-profile")({
	component: RouteComponent,
	loader: async () => {
		const [profile, healthProfile] = await Promise.all([
			me(),
			getMyHealthProfile(),
		]);
		return {
			profile,
			healthProfile,
		};
	},
});

function RouteComponent() {
	const { healthProfile, profile } = useLoaderData({
		from: "/_layout/home/user-profile",
	});
	return <UserProfile healthProfile={healthProfile} profile={profile} />;
}
