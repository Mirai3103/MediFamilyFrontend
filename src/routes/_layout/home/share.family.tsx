import { defineAbilityShare } from "@/lib/casl";
import ShareFamiliesPage from "@/pages/ShareFamiliesPage";
import { useGetShareProfilesByIds } from "@/queries/generated/share-profile-controller/share-profile-controller";
import useUserStore from "@/stores/authStore";
import { useShareIds } from "@/stores/shareStore";
import { createFileRoute } from "@tanstack/react-router";
import React from "react";

export const Route = createFileRoute("/_layout/home/share/family")({
	component: RouteComponent,
});

function RouteComponent() {
	const ids = useShareIds();
	const mergeAbility = useUserStore((state) => state.mergeAbility);
	const profile = useUserStore((state) => state.profile);
	const { data } = useGetShareProfilesByIds(
		{
			ids: ids,
		},
		{
			query: {
				enabled: !!ids && ids.length > 0,
			},
		}
	);
	React.useEffect(() => {
		if (data && profile) {
			mergeAbility(defineAbilityShare(data, profile));
		}
	}, [data, profile]);
	return <ShareFamiliesPage />;
}
