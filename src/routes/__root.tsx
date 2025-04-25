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

function RootComponent() {
	const { fetchUserProfile, ability } = useUserStore();
	useEffect(() => {
		fetchUserProfile();
	}, [fetchUserProfile]);

	return (
		<>
			<AbilityContext.Provider value={ability || createMongoAbility()}>
				<Toaster />
				<Outlet />
				<TanStackRouterDevtools position="bottom-right" />
			</AbilityContext.Provider>
		</>
	);
}
