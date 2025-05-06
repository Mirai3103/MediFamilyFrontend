import { getShareProfile } from "@/queries/generated/share-profile-controller/share-profile-controller";
import useShareStore from "@/stores/shareStore";
import {
	createFileRoute,
	useLoaderData,
	useNavigate,
} from "@tanstack/react-router";
import React from "react";

export const Route = createFileRoute("/_layout/home/share/$id/")({
	loader: async (ctx) => {
		const res = await getShareProfile(ctx.params.id);
		return {
			share: res,
		};
	},
	component: RouteComponent,
});

function RouteComponent() {
	const { share } = useLoaderData({
		from: "/_layout/home/share/$id/",
	});
	const { pushShareFamilyIds, pushShareMemberIds, pushShareIds } =
		useShareStore();
	const navigate = useNavigate();
	React.useEffect(() => {
		if (share?.familyId) {
			pushShareFamilyIds([share.familyId]);
		}
		if (share?.memberId) {
			pushShareMemberIds([share.memberId]);
		}
		if (share?.id) {
			pushShareIds([share.id]);
		}

		navigate({
			to: "/home/share/family",
		});
	}, [share]);

	return <code>{JSON.stringify(share)}</code>;
}
