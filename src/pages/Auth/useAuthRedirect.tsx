import useUserStore from "@/stores/authStore";
import { useNavigate } from "@tanstack/react-router";
import React from "react";

export default function useAuthRedirect() {
	const isAuthenticated = useUserStore((state) => state.isAuthenticated);
	const navigate = useNavigate();
	React.useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		let redirectTo = params.get("redirectTo") || "/home";

		if (isAuthenticated) {
			navigate({
				to: redirectTo,
			});
		}
	}, [isAuthenticated, navigate]);
}
