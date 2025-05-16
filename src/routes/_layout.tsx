import MainLayout from "@/components/layout/MainLayout";
import useUserStore from "@/stores/authStore";
import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useGetManagedFamilies } from "@/queries/generated/family-controller/family-controller";
import { defineAbilityForDoctor } from "@/lib/casl";

export const Route = createFileRoute("/_layout")({
	component: RouteComponent,
});

function RouteComponent() {
	const {
		isAuthenticated,
		isLoading,
		fetchUserProfile,
		mergeAbility,
		profile,
	} = useUserStore();
	const navigate = useNavigate();

	useEffect(() => {
		// Kiểm tra xác thực khi component được mount
		fetchUserProfile();
	}, [fetchUserProfile]);

	useEffect(() => {
		// Chuyển hướng sang trang login nếu không xác thực và không còn loading
		if (!isLoading && !isAuthenticated) {
			navigate({ to: "/login?redirectTo=" + window.location.pathname });
		}
	}, [isLoading, isAuthenticated, navigate]);

	const { data } = useGetManagedFamilies(
		{
			page: 0,
			size: 1000,
			sort: ["createdAt,desc"],
			status: "ACCEPTED",

			// search,
		},
		{
			query: {
				enabled: profile?.role == "ROLE_DOCTOR",
			},
		}
	);
	React.useEffect(() => {
		if (data && data.content && profile) {
			setTimeout(() => {
				mergeAbility(
					defineAbilityForDoctor(
						data!.content!.map((item) => item.familyId!)
					)
				);
			}, 1000);
		}
	}, [data, profile]);

	if (isLoading) {
		return (
			<div className="fixed inset-0 flex items-center justify-center bg-background">
				<motion.div
					initial={{ opacity: 0, scale: 0.9 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 0.3 }}
					className="flex flex-col items-center space-y-4"
				>
					<motion.div
						animate={{ rotate: 360 }}
						transition={{
							duration: 1.5,
							repeat: Infinity,
							ease: "linear",
						}}
					>
						<Loader2 className="w-12 h-12 text-primary" />
					</motion.div>
					<p className="text-lg text-muted-foreground">
						Đang tải dữ liệu...
					</p>
				</motion.div>
			</div>
		);
	}

	return (
		<MainLayout>
			<Outlet />
		</MainLayout>
	);
}
