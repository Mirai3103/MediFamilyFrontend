import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import {
	FiHome,
	FiUsers,
	FiActivity,
	FiFileText,
	FiCheckCircle,
	FiShare2,
	FiCalendar,
	FiSettings,
	FiMenu,
	FiX,
	FiBell,
	FiLogOut,
	FiUser,
	FiTerminal,
} from "react-icons/fi";
import { cn } from "@/lib/utils";
// import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
	DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/ThemeToggle";
import useUserStore from "@/stores/authStore";

interface MainLayoutProps {
	children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
	const location = useLocation();
	const navigate = useNavigate();
	const user = useUserStore((state) => state.profile);
	const logout = useUserStore((state) => state.logout);
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const ability = useUserStore((state) => state.ability);

	const menuItems = React.useMemo(() => {
		return [
			{
				path: "/home",
				label: "Tổng quan",
				icon: <FiHome className="mr-3 h-4 w-4" />,
			},
			{
				path: "/home/families",
				label: "Gia đình",
				icon: <FiUsers className="mr-3 h-4 w-4" />,
			},
			{
				path: "/home/manage-family",
				label: "Gia đình được quản lý",
				icon: <FiTerminal className="mr-3 h-4 w-4" />,
				isRender: ability?.can("manage", "Household"),
			},
			{
				path: "/home/health-profile",
				label: "Hồ sơ y tế",
				icon: <FiActivity className="mr-3 h-4 w-4" />,
			},
			{
				path: "/home/vaccination",
				label: "Tiêm ngừa",
				icon: <FiCheckCircle className="mr-3 h-4 w-4" />,
			},
			{
				path: "/home/documents",
				label: "Tài liệu",
				icon: <FiFileText className="mr-3 h-4 w-4" />,
			},
			{
				path: "/home/reminders",
				label: "Nhắc nhở",
				icon: <FiCalendar className="mr-3 h-4 w-4" />,
			},
			{
				path: "/home/share/family",
				label: "Gia đình được chia sẻ",
				icon: <FiShare2 className="mr-3 h-4 w-4" />,
			},
		].filter((item) => item.isRender !== false);
	}, [ability]);

	const handleLogout = async () => {
		await logout();
		navigate({ to: "/login" });
	};

	// Sidebar for desktop
	const DesktopSidebar = () => (
		<div className="hidden lg:flex h-screen w-64 flex-col fixed left-0 top-0 bottom-0 bg-sidebar border-r border-sidebar-border">
			{/* Logo */}
			<Link
				className="h-16 flex items-center px-6 border-b border-sidebar-border"
				to="/"
			>
				<FiActivity className="h-6 w-6 text-primary mr-2" />
				<span className="text-xl font-bold">MedFamily</span>
			</Link>

			{/* Menu items */}
			<nav className="flex-1 overflow-y-auto py-4 px-4">
				<ul className="space-y-2">
					{menuItems.map((item) => (
						<li key={item.path}>
							<Link
								to={item.path}
								className={cn(
									"flex items-center px-4 py-2.5 text-sm font-medium rounded-md transition-colors",
									location.pathname.startsWith(item.path)
										? "bg-sidebar-accent text-sidebar-accent-foreground"
										: "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
								)}
							>
								{item.icon}
								{item.label}
							</Link>
						</li>
					))}
				</ul>
			</nav>

			{/* User profile at bottom */}
			<div className="p-4 border-t border-sidebar-border">
				<Link className="flex items-center" to="/home/user-profile">
					<Avatar className="h-9 w-9">
						<AvatarImage
							src={
								user?.profile?.avatarUrl ||
								"https://placewaifu.com/image/300/300"
							}
							alt={user?.profile?.fullName!}
						/>
						<AvatarFallback>
							{user?.profile?.fullName?.charAt(0) || "U"}
						</AvatarFallback>
					</Avatar>
					<div className="ml-3 flex-1 min-w-0">
						<p className="text-sm font-medium truncate">
							{user?.profile?.fullName}
						</p>
						<p className="text-xs text-muted-foreground truncate">
							{user?.email}
						</p>
					</div>
					<Button variant="ghost" size="icon" onClick={handleLogout}>
						<FiLogOut className="h-5 w-5" />
					</Button>
				</Link>
			</div>
		</div>
	);

	// Mobile header and navigation
	const MobileHeader = () => (
		<header className="lg:hidden sticky top-0 z-40 h-16 flex items-center justify-between px-4 border-b bg-background border-border">
			{/* Logo and menu button */}
			<div className="flex items-center">
				<Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
					<SheetTrigger asChild>
						<Button variant="ghost" size="icon" className="mr-2">
							<FiMenu className="h-5 w-5" />
						</Button>
					</SheetTrigger>
					<SheetContent side="left" className="w-72 p-0">
						{/* Mobile sidebar content */}
						<Link
							className="h-16 flex items-center px-6 border-b border-border"
							to="/"
						>
							<FiActivity className="h-6 w-6 text-primary mr-2" />
							<span className="text-xl font-bold">MedFamily</span>
							<Button
								variant="ghost"
								size="icon"
								className="ml-auto"
								onClick={() => setSidebarOpen(false)}
							>
								<FiX className="h-5 w-5" />
							</Button>
						</Link>

						{/* User profile */}
						<div className="p-4 border-b border-border">
							<div className="flex items-center">
								<Avatar className="h-10 w-10">
									<AvatarImage
										src={
											user?.profile?.avatarUrl ||
											"https://placewaifu.com/image/300/300"
										}
										alt={user?.profile?.fullName!}
									/>
									<AvatarFallback>
										{user?.profile?.fullName?.charAt(0) ||
											"U"}
									</AvatarFallback>
								</Avatar>
								<div className="ml-3 flex-1 min-w-0">
									<p className="text-sm font-medium truncate">
										{user?.profile?.fullName}
									</p>
									<p className="text-xs text-muted-foreground truncate">
										{user?.email}
									</p>
								</div>
							</div>
						</div>

						{/* Menu items */}
						<nav className="flex-1 overflow-y-auto py-4 px-4">
							<ul className="space-y-2">
								{menuItems.map((item) => (
									<li key={item.path}>
										<Link
											to={item.path}
											onClick={() =>
												setSidebarOpen(false)
											}
											className={cn(
												"flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors",
												location.pathname.startsWith(
													item.path
												)
													? "bg-accent text-accent-foreground"
													: "text-foreground hover:bg-accent/50 hover:text-accent-foreground"
											)}
										>
											{item.icon}
											{item.label}
										</Link>
									</li>
								))}
							</ul>
						</nav>

						{/* Logout button */}
						<div className="p-4 border-t border-border">
							<Button
								variant="outline"
								className="w-full flex items-center justify-center"
								onClick={handleLogout}
							>
								<FiLogOut className="mr-2 h-4 w-4" />
								Đăng xuất
							</Button>
						</div>
					</SheetContent>
				</Sheet>

				<Link to="/" className="flex items-center">
					<FiActivity className="h-6 w-6 text-primary mr-2" />
					<span className="text-xl font-bold">MedFamily</span>
				</Link>
			</div>

			{/* Actions */}
			<div className="flex items-center">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant="ghost"
							size="icon"
							className="relative"
						>
							<FiBell className="h-5 w-5" />
							<span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary"></span>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-80">
						<div className="flex items-center justify-between px-4 py-2 border-b">
							<span className="font-medium">Thông báo</span>
							<Button variant="ghost" size="sm">
								Đánh dấu đã đọc
							</Button>
						</div>
						<div className="max-h-80 overflow-y-auto">
							<div className="py-2 px-4 border-b">
								<p className="text-sm font-medium">
									Nhắc nhở tiêm ngừa
								</p>
								<p className="text-xs text-muted-foreground mt-1">
									Bé An có lịch tiêm ngừa vào ngày mai
								</p>
								<p className="text-xs text-muted-foreground mt-1">
									1 giờ trước
								</p>
							</div>
							{/* Có thể thêm các thông báo khác ở đây */}
						</div>
						<div className="p-2 text-center border-t">
							<Button
								variant="ghost"
								size="sm"
								className="w-full"
							>
								Xem tất cả
							</Button>
						</div>
					</DropdownMenuContent>
				</DropdownMenu>

				<ThemeToggle className="ml-2" />

				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" size="icon" className="ml-2">
							<Avatar className="h-8 w-8">
								<AvatarImage
									src={
										user?.profile?.avatarUrl ||
										"https://placewaifu.com/image/300/300"
									}
									alt={user?.profile?.fullName}
								/>
								<AvatarFallback>
									{user?.profile?.fullName?.charAt(0) || "U"}
								</AvatarFallback>
							</Avatar>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<Link to="/home/user-profile">
							<DropdownMenuItem>
								<FiUser className="mr-2 h-4 w-4" />
								Hồ sơ
							</DropdownMenuItem>
						</Link>
						<Link to="/home/user-profile">
							<DropdownMenuItem>
								<FiSettings className="mr-2 h-4 w-4" />
								Cài đặt
							</DropdownMenuItem>
						</Link>
						<DropdownMenuSeparator />
						<DropdownMenuItem onClick={handleLogout}>
							<FiLogOut className="mr-2 h-4 w-4" />
							Đăng xuất
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</header>
	);

	return (
		<>
			{/* Desktop sidebar */}
			<DesktopSidebar />

			{/* Mobile Header */}
			<MobileHeader />

			{/* Main content */}
			<div className="lg:pl-64 min-h-screen bg-background">
				<main className="p-4 md:p-6 max-w-7xl mx-auto">{children}</main>
			</div>
		</>
	);
};

export default MainLayout;
