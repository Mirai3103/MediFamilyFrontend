import FamilyMemberDetailPage from "@/pages/FamilyDetailPage/MemberDetail";
import { me } from "@/queries/generated/profile-controller/profile-controller";
import {
	createFileRoute,
	redirect,
	useLoaderData,
} from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/home/health-profile/")({
	async loader() {
		try {
			const member = await me();
			return { profile: member.profile! };
		} catch (error) {
			throw redirect({
				to: "/login",
			});
		}
	},
	component: RouteComponent,
});

function RouteComponent() {
	const { profile } = useLoaderData({
		from: "/_layout/home/health-profile/",
	});
	return <FamilyMemberDetailPage family={undefined} profile={profile!} />;
}
