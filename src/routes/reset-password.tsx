import UnAuthLayout from "@/components/layout/UnAuthLayout";
import { ResetPassword } from "@/pages/Auth/ResetPassword";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/reset-password")({
	component: RouteComponent,
	validateSearch: (search: { token?: string }) => {
		if (!search.token) {
			throw redirect({
        to: '/forgot-password',
      })
		}
	},
});

function RouteComponent() {
	return (
		<UnAuthLayout>
			<ResetPassword />
		</UnAuthLayout>
	);
}
