import { Toaster } from "@/components/ui/sonner";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { useEffect } from "react";
import useUserStore from "@/stores/authStore";
import { AbilityContext } from "@/contexts/AbilityContext";
import { createMongoAbility } from "@casl/ability";

export const Route = createRootRoute({
	component: RootComponent,
});
const EMPTY_ABILITY = createMongoAbility() as any;
function RootComponent() {
	const { fetchUserProfile, ability, profile } = useUserStore();
	useEffect(() => {
		fetchUserProfile();
	}, [fetchUserProfile]);

	console.log("profile", profile);

	return (
		<>
			<AbilityContext.Provider value={ability || EMPTY_ABILITY}>
				<Toaster />
				<Outlet />
				<TanStackRouterDevtools position="bottom-right" />
			</AbilityContext.Provider>
		</>
	);
}
