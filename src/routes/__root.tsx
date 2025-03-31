import { Toaster } from "@/components/ui/sonner";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { useEffect } from "react";
import useUserStore from "@/stores/authStore";

export const Route = createRootRoute({
	component: RootComponent,
});

function RootComponent() {
	const { fetchUserProfile } = useUserStore();

	useEffect(() => {
		fetchUserProfile();
	}, [fetchUserProfile]);

	return (
		<>
			<Toaster />
			<Outlet />
			<TanStackRouterDevtools position="bottom-right" />
		</>
	);
}
