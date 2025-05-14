import { defineAbilityShare } from "@/lib/casl";
import ShareFamiliesPage from "@/pages/ShareFamiliesPage";
import {
	useGetShareProfilesByIds,
	useGetShareProfilesWithMe,
} from "@/queries/generated/share-profile-controller/share-profile-controller";
import useUserStore from "@/stores/authStore";
import { useShareIds } from "@/stores/shareStore";
import { createFileRoute } from "@tanstack/react-router";
import React from "react";

export const Route = createFileRoute("/_layout/home/share/family")({
	component: RouteComponent,
});

function RouteComponent() {
	const ids = useShareIds()|| [];
	const mergeAbility = useUserStore((state) => state.mergeAbility);
	const me = useUserStore((state) => state.profile);
	const profile = useUserStore((state) => state.profile);
	const { data: shareProfiles = [], isFetched } = useGetShareProfilesWithMe({
		query: {
			enabled: !!me?.id,
		},
	});
	const { data } = useGetShareProfilesByIds(
		{
			ids: [...ids, ...shareProfiles?.map((item) => item.id!)],
		},
		{
			query: {
				enabled:  isFetched,
			},
		}
	);
	React.useEffect(() => {
		if (data && profile) {
			mergeAbility(defineAbilityShare(data, profile));
		}
	}, [data, profile]);
	console.log("data", data);
	return (
		<ShareFamiliesPage
			allowFamilyIds={data?.map((item) => item.familyId!) || []}
		/>
	);
}
