import { VaccinationsTabContent } from "@/components/user/RecordTab/VaccinationsTabContent";
import useUserStore from "@/stores/authStore";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/home/vaccination")({
	component: RouteComponent,
});

function RouteComponent() {
	const { profile } = useUserStore();
	const profileId = profile?.id || profile?.profile?.id;
	if (!profileId) {
		return <div>Loading...</div>;
	}

	return (
		<div className="flex flex-col min-h-screen">
			<div className="flex-grow">
				<div className="container py-6">
					<div className="flex flex-col space-y-6">
						<div className="flex items-center justify-between">
							<div>
								<h1 className="text-2xl font-bold text-gray-900">
									Thông tin tiêm chủng
								</h1>
								<p className="text-gray-500 mt-1">
									Quản lý thông tin tiêm chủng của bạn
								</p>
							</div>
						</div>

						<VaccinationsTabContent profileId={profileId!} />
					</div>
				</div>
			</div>
		</div>
	);
}
