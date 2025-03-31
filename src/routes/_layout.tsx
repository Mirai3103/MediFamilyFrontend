import MainLayout from "@/components/layout/MainLayout";
import useUserStore from "@/stores/authStore";
import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/_layout")({
	component: RouteComponent,
});

function RouteComponent() {
	const { isAuthenticated, isLoading, fetchUserProfile } = useUserStore();
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
