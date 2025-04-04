import { FamilyDTO, FamilyMemberDTO } from "@/models/generated";
import FamilyMemberDetailPage from "@/pages/FamilyDetailPage/MemberDetail";
import { getFamily } from "@/queries/generated/family-controller/family-controller";
import { getFamilyMemberById } from "@/queries/generated/family-member-controller/family-member-controller";
import { createFileRoute, useLoaderData } from "@tanstack/react-router";

export const Route = createFileRoute(
	"/_layout/home/families/$familyId/members/$memberId"
)({
	async loader(ctx) {
		const p1 = getFamilyMemberById(
			Number(ctx.params.familyId),
			Number(ctx.params.memberId)
		);
		const p2 = getFamily(ctx.params.familyId);
		const [member, family] = await Promise.all([p1, p2]);
		return {
			member,
			family,
		} as {
			member: FamilyMemberDTO;
			family: FamilyDTO;
		};
	},

	component: RouteComponent,
});

function RouteComponent() {
	const { family, member } = useLoaderData({
		from: "/_layout/home/families/$familyId/members/$memberId",
	});
	return <FamilyMemberDetailPage family={family} member={member} />;
}
