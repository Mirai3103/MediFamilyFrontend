import FamilyPage from "@/pages/FamilyDetailPage";
import { getFamily } from "@/queries/generated/family-controller/family-controller";
import { createFileRoute, useLoaderData } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/home/families/$familyId")({
	async loader(ctx) {
		console.log(ctx.params.familyId);
		return await getFamily(ctx.params.familyId);
	},
	component: RouteComponent,
});

function RouteComponent() {
	const family = useLoaderData({
		from: "/_layout/home/families/$familyId",
	});
	return <FamilyPage family={family} />;
}
