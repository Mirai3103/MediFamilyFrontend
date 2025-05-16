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
	const ids = useShareIds() || [];
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
				enabled: isFetched,
			},
		}
	);
	React.useEffect(() => {
		if (data && profile) {
			console.log("Ability merge");
			mergeAbility(defineAbilityShare(data, profile));
		}
	}, [data, profile]);
	console.log(
		"total allow family",
		data?.map((item) => item.familyId!),
		data,
		isFetched,
		!!me?.id,
		me
	);
	return (
		<ShareFamiliesPage
			allowFamilyIds={data?.map((item) => item.familyId!) || []}
		/>
	);
}
