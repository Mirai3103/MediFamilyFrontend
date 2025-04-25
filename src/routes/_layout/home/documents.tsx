import MedicalDocumentsTab from "@/components/user/MedicalDocumentsTab";
import useUserStore from "@/stores/authStore";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/home/documents")({
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
									Tài liệu y tế
								</h1>
								<p className="text-gray-500 mt-1">
									Quản lý tài liệu y tế của bạn
								</p>
							</div>
						</div>

						<MedicalDocumentsTab profile={profile} />
					</div>
				</div>
			</div>
		</div>
	);
}
