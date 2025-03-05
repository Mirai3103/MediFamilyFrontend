import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { faker } from "@faker-js/faker";
import {
	BarChart,
	CalendarDays,
	Clock,
	FileText,
	Heart,
	Mail,
	Plus,
	Share2,
	Stethoscope,
	Thermometer,
	User,
	UserPlus,
	Users,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

// Tạo dữ liệu mẫu với Faker
// Thành viên gia đình
const familyMembers = Array(4)
	.fill(null)
	.map((_, index) => {
		const gender = index < 2 ? "male" : "female";
		const relationship =
			index === 0 ? "Chủ hộ" : index === 1 ? "Vợ/Chồng" : "Con";

		return {
			id: index,
			name: faker.person.fullName({ sex: gender }),
			avatar: `https://placewaifu.com/image/100/100?seed=${index}`,
			dob: faker.date.birthdate({
				min: index > 1 ? 5 : 25,
				max: index > 1 ? 15 : 50,
				mode: "age",
			}),
			relationship,
			hasUpcomingAppointment: index === 2,
			appointmentDate: index === 2 ? faker.date.soon({ days: 7 }) : null,
			healthStatus:
				index === 3 ? "alert" : index === 1 ? "caution" : "normal",
			alerts: index === 3 ? 2 : index === 1 ? 1 : 0,
		};
	});

// Lịch sử khám gần đây
const recentMedicalHistory = Array(3)
	.fill(null)
	.map((_, index) => {
		const memberId = Math.floor(Math.random() * 4);
		const member = familyMembers[memberId];

		return {
			id: index,
			memberId: memberId,
			memberName: member.name,
			memberAvatar: member.avatar,
			date: faker.date.recent({ days: 60 }),
			doctorName: faker.person.fullName(),
			facility: faker.company.name() + " Medical Center",
			diagnosis: faker.helpers.arrayElement([
				"Viêm họng cấp",
				"Cúm mùa",
				"Đau lưng",
				"Kiểm tra định kỳ",
				"Đau đầu",
				"Dị ứng theo mùa",
			]),
			status: faker.helpers.arrayElement([
				"completed",
				"pending",
				"ongoing",
			]),
		};
	});

// Nhắc nhở sắp tới
const upcomingReminders = Array(4)
	.fill(null)
	.map((_, index) => {
		const memberId = Math.floor(Math.random() * 4);
		const member = familyMembers[memberId];
		const today = new Date();
		const daysToAdd = Math.floor(Math.random() * 14) + 1;
		const reminderDate = new Date(today);
		reminderDate.setDate(today.getDate() + daysToAdd);

		return {
			id: index,
			memberId: memberId,
			memberName: member.name,
			memberAvatar: member.avatar,
			date: reminderDate,
			type: faker.helpers.arrayElement([
				"appointment",
				"medication",
				"vaccination",
				"checkup",
			]),
			title: faker.helpers.arrayElement([
				"Khám định kỳ",
				"Tiêm ngừa cúm",
				"Lịch tái khám",
				"Kiểm tra huyết áp",
				"Bổ sung thuốc",
			]),
			priority: faker.helpers.arrayElement(["high", "medium", "low"]),
		};
	})
	.sort((a, b) => a.date - b.date);

// Lịch tiêm ngừa sắp tới
const upcomingVaccinations = Array(3)
	.fill(null)
	.map((_, index) => {
		const isChild = Math.random() > 0.5;
		const memberId = isChild ? 2 : 3;
		const member = familyMembers[memberId];
		const today = new Date();
		const daysToAdd = Math.floor(Math.random() * 30) + 1;
		const vaccinationDate = new Date(today);
		vaccinationDate.setDate(today.getDate() + daysToAdd);

		return {
			id: index,
			memberId: memberId,
			memberName: member.name,
			memberAvatar: member.avatar,
			date: vaccinationDate,
			vaccine: faker.helpers.arrayElement([
				"Vaccine cúm mùa",
				"Vaccine COVID-19 (mũi nhắc)",
				"Vaccine sởi-quai bị-rubella",
				"Vaccine viêm gan B",
				"Vaccine HPV",
			]),
			facility: faker.company.name() + " Medical Center",
			dose: faker.helpers.arrayElement(["Mũi 1", "Mũi 2", "Mũi nhắc"]),
		};
	})
	.sort((a, b) => a.date - b.date);

// Chỉ số sức khỏe gần đây
const recentHealthMetrics = [
	{
		id: 0,
		memberId: 0,
		memberName: familyMembers[0].name,
		type: "Huyết áp",
		value: "130/85",
		unit: "mmHg",
		date: faker.date.recent({ days: 7 }),
		status: "caution",
		change: "up",
	},
	{
		id: 1,
		memberId: 0,
		memberName: familyMembers[0].name,
		type: "Đường huyết",
		value: "95",
		unit: "mg/dL",
		date: faker.date.recent({ days: 5 }),
		status: "normal",
		change: "stable",
	},
	{
		id: 2,
		memberId: 1,
		memberName: familyMembers[1].name,
		type: "Cân nặng",
		value: "65",
		unit: "kg",
		date: faker.date.recent({ days: 10 }),
		status: "normal",
		change: "down",
	},
	{
		id: 3,
		memberId: 3,
		memberName: familyMembers[3].name,
		type: "Nhiệt độ",
		value: "38.2",
		unit: "°C",
		date: faker.date.recent({ days: 2 }),
		status: "alert",
		change: "up",
	},
];

const Overview = () => {
	const [activeTab, setActiveTab] = useState("overview");

	// Format ngày tháng
	const formatDate = (date) => {
		return new Intl.DateTimeFormat("vi-VN", {
			year: "numeric",
			month: "2-digit",
			day: "2-digit",
		}).format(date);
	};

	// Format thời gian
	const formatTime = (date) => {
		return new Intl.DateTimeFormat("vi-VN", {
			hour: "2-digit",
			minute: "2-digit",
		}).format(date);
	};

	// Xác định màu trạng thái
	const getStatusColor = (status) => {
		switch (status) {
			case "alert":
				return "health-status-alert";
			case "warning":
				return "health-status-warning";
			case "caution":
				return "health-status-caution";
			case "normal":
				return "health-status-normal";
			case "info":
				return "health-status-info";
			default:
				return "text-gray-500";
		}
	};

	// Xác định biểu tượng thay đổi
	const getChangeIcon = (change) => {
		switch (change) {
			case "up":
				return <div className="text-red-500">↑</div>;
			case "down":
				return <div className="text-green-500">↓</div>;
			default:
				return <div className="text-gray-500">→</div>;
		}
	};

	// Xác định màu ưu tiên
	const getPriorityColor = (priority) => {
		switch (priority) {
			case "high":
				return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
			case "medium":
				return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
			case "low":
				return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
			default:
				return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
		}
	};

	// Xác định biểu tượng loại nhắc nhở
	const getReminderTypeIcon = (type) => {
		switch (type) {
			case "appointment":
				return <CalendarDays className="w-4 h-4" />;
			case "medication":
				return <FileText className="w-4 h-4" />;
			case "vaccination":
				return <Thermometer className="w-4 h-4" />;
			case "checkup":
				return <Stethoscope className="w-4 h-4" />;
			default:
				return <Clock className="w-4 h-4" />;
		}
	};

	return (
		<div className="container py-6">
			<div className="flex items-center justify-between mb-6">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">
						Tổng quan
					</h1>
					<p className="text-muted-foreground">
						Quản lý hồ sơ y tế gia đình của bạn tại một nơi
					</p>
				</div>
				<div className="flex items-center gap-2">
					<Button variant="outline">
						<Share2 className="w-4 h-4 mr-2" />
						Chia sẻ hồ sơ
					</Button>
					<Button>
						<Plus className="w-4 h-4 mr-2" />
						Thêm dữ liệu mới
					</Button>
				</div>
			</div>

			<Tabs
				defaultValue="overview"
				className="w-full"
				onValueChange={setActiveTab}
			>
				<TabsList className="mb-4">
					<TabsTrigger value="overview">Tổng quan</TabsTrigger>
					<TabsTrigger value="family">Gia đình</TabsTrigger>
					<TabsTrigger value="reminders">Nhắc nhở</TabsTrigger>
					<TabsTrigger value="health">Chỉ số sức khỏe</TabsTrigger>
				</TabsList>

				<TabsContent value="overview" className="space-y-6">
					{/* Phần thống kê nhanh */}
					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
						<Card>
							<CardHeader className="flex flex-row items-center justify-between pb-2">
								<CardTitle className="text-sm font-medium">
									Thành viên gia đình
								</CardTitle>
								<Users className="w-4 h-4 text-muted-foreground" />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">
									{familyMembers.length}
								</div>
								<p className="text-xs text-muted-foreground">
									{
										familyMembers.filter(
											(m) => m.relationship === "Con"
										).length
									}{" "}
									trẻ em
								</p>
							</CardContent>
						</Card>
						<Card>
							<CardHeader className="flex flex-row items-center justify-between pb-2">
								<CardTitle className="text-sm font-medium">
									Lịch sử khám bệnh
								</CardTitle>
								<FileText className="w-4 h-4 text-muted-foreground" />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">
									{recentMedicalHistory.length}
								</div>
								<p className="text-xs text-muted-foreground">
									{
										recentMedicalHistory.filter(
											(h) => h.status === "pending"
										).length
									}{" "}
									đang chờ kết quả
								</p>
							</CardContent>
						</Card>
						<Card>
							<CardHeader className="flex flex-row items-center justify-between pb-2">
								<CardTitle className="text-sm font-medium">
									Nhắc nhở sắp tới
								</CardTitle>
								<Clock className="w-4 h-4 text-muted-foreground" />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">
									{upcomingReminders.length}
								</div>
								<p className="text-xs text-muted-foreground">
									{
										upcomingReminders.filter(
											(r) => r.priority === "high"
										).length
									}{" "}
									ưu tiên cao
								</p>
							</CardContent>
						</Card>
						<Card>
							<CardHeader className="flex flex-row items-center justify-between pb-2">
								<CardTitle className="text-sm font-medium">
									Cảnh báo sức khỏe
								</CardTitle>
								<Heart className="w-4 h-4 text-muted-foreground" />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">
									{familyMembers.reduce(
										(acc, member) => acc + member.alerts,
										0
									)}
								</div>
								<p className="text-xs text-muted-foreground">
									Cần kiểm tra
								</p>
							</CardContent>
						</Card>
					</div>

					{/* Các thành viên gia đình */}
					<Card>
						<CardHeader>
							<div className="flex items-center justify-between">
								<CardTitle>Thành viên gia đình</CardTitle>
								<Button size="sm" variant="outline">
									<UserPlus className="w-4 h-4 mr-2" />
									Thêm thành viên
								</Button>
							</div>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{familyMembers.map((member) => (
									<div
										key={member.id}
										className="flex items-center justify-between p-3 border rounded-lg"
									>
										<div className="flex items-center gap-3">
											<Avatar>
												<AvatarImage
													src={member.avatar}
													alt={member.name}
												/>
												<AvatarFallback>
													{member.name.charAt(0)}
												</AvatarFallback>
											</Avatar>
											<div>
												<p className="font-medium">
													{member.name}
												</p>
												<p className="text-sm text-muted-foreground">
													{formatDate(member.dob)} ·{" "}
													{member.relationship}
												</p>
											</div>
										</div>
										<div className="flex items-center gap-2">
											{member.alerts > 0 && (
												<Badge
													variant="outline"
													className={`rounded-full ${getStatusColor(member.healthStatus)}`}
												>
													{member.alerts} cảnh báo
												</Badge>
											)}
											{member.hasUpcomingAppointment && (
												<Badge
													variant="outline"
													className="text-primary"
												>
													Lịch hẹn{" "}
													{formatDate(
														member.appointmentDate
													)}
												</Badge>
											)}
											<Button
												variant="ghost"
												size="icon"
												asChild
											>
												<Link
													to={`/family-members/${member.id}`}
												>
													<User className="w-4 h-4" />
													<span className="sr-only">
														Xem chi tiết
													</span>
												</Link>
											</Button>
										</div>
									</div>
								))}
							</div>
						</CardContent>
					</Card>

					<div className="grid gap-6 md:grid-cols-2">
						{/* Nhắc nhở sắp tới */}
						<Card>
							<CardHeader>
								<CardTitle>Nhắc nhở sắp tới</CardTitle>
								<CardDescription>
									Các nhắc nhở trong 14 ngày tới
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="space-y-3">
									{upcomingReminders
										.slice(0, 3)
										.map((reminder) => (
											<div
												key={reminder.id}
												className="flex items-start justify-between p-3 border rounded-lg"
											>
												<div className="flex items-start gap-3">
													<div
														className={`p-2 rounded-full ${getPriorityColor(
															reminder.priority
														)}`}
													>
														{getReminderTypeIcon(
															reminder.type
														)}
													</div>
													<div>
														<p className="font-medium">
															{reminder.title}
														</p>
														<div className="flex items-center gap-1 mt-1">
															<Avatar className="w-4 h-4">
																<AvatarImage
																	src={
																		reminder.memberAvatar
																	}
																	alt={
																		reminder.memberName
																	}
																/>
																<AvatarFallback>
																	{reminder.memberName.charAt(
																		0
																	)}
																</AvatarFallback>
															</Avatar>
															<span className="text-xs text-muted-foreground">
																{
																	reminder.memberName
																}
															</span>
														</div>
													</div>
												</div>
												<div className="text-sm text-right">
													<p>
														{formatDate(
															reminder.date
														)}
													</p>
													<p className="text-xs text-muted-foreground">
														{formatTime(
															reminder.date
														)}
													</p>
												</div>
											</div>
										))}
									{upcomingReminders.length > 3 && (
										<Button
											variant="ghost"
											className="w-full"
											asChild
										>
											<Link to="/reminders">
												Xem tất cả (
												{upcomingReminders.length})
											</Link>
										</Button>
									)}
								</div>
							</CardContent>
						</Card>

						{/* Lịch sử khám gần đây */}
						<Card>
							<CardHeader>
								<CardTitle>Lịch sử khám gần đây</CardTitle>
								<CardDescription>
									Các lần khám bệnh gần đây của gia đình
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="space-y-3">
									{recentMedicalHistory
										.slice(0, 3)
										.map((history) => (
											<div
												key={history.id}
												className="flex items-start justify-between p-3 border rounded-lg"
											>
												<div className="flex items-start gap-3">
													<Avatar>
														<AvatarImage
															src={
																history.memberAvatar
															}
															alt={
																history.memberName
															}
														/>
														<AvatarFallback>
															{history.memberName.charAt(
																0
															)}
														</AvatarFallback>
													</Avatar>
													<div>
														<p className="font-medium">
															{history.diagnosis}
														</p>
														<p className="text-sm text-muted-foreground">
															{history.memberName}{" "}
															· {history.facility}
														</p>
													</div>
												</div>
												<div className="text-sm text-right">
													<div className="flex items-center gap-1">
														{history.status ===
														"completed" ? (
															<Badge
																variant="outline"
																className="text-green-600"
															>
																Hoàn thành
															</Badge>
														) : history.status ===
														  "pending" ? (
															<Badge
																variant="outline"
																className="text-yellow-600"
															>
																Chờ kết quả
															</Badge>
														) : (
															<Badge
																variant="outline"
																className="text-blue-600"
															>
																Đang xử lý
															</Badge>
														)}
													</div>
													<p className="mt-1 text-xs text-muted-foreground">
														{formatDate(
															history.date
														)}
													</p>
												</div>
											</div>
										))}
									<Button
										variant="ghost"
										className="w-full"
										asChild
									>
										<Link to="/medical-history">
											Xem tất cả lịch sử khám
										</Link>
									</Button>
								</div>
							</CardContent>
						</Card>
					</div>

					<div className="grid gap-6 md:grid-cols-2">
						{/* Lịch tiêm ngừa sắp tới */}
						<Card>
							<CardHeader>
								<CardTitle>Lịch tiêm ngừa sắp tới</CardTitle>
								<CardDescription>
									Các mũi tiêm ngừa được lên lịch
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="space-y-3">
									{upcomingVaccinations
										.slice(0, 3)
										.map((vaccination) => (
											<div
												key={vaccination.id}
												className="flex items-start justify-between p-3 border rounded-lg"
											>
												<div className="flex items-start gap-3">
													<div className="p-2 bg-blue-100 rounded-full text-blue-800 dark:bg-blue-900 dark:text-blue-200">
														<Thermometer className="w-4 h-4" />
													</div>
													<div>
														<p className="font-medium">
															{
																vaccination.vaccine
															}
															<span className="ml-2 text-xs font-normal text-muted-foreground">
																{
																	vaccination.dose
																}
															</span>
														</p>
														<div className="flex items-center gap-1 mt-1">
															<Avatar className="w-4 h-4">
																<AvatarImage
																	src={
																		vaccination.memberAvatar
																	}
																	alt={
																		vaccination.memberName
																	}
																/>
																<AvatarFallback>
																	{vaccination.memberName.charAt(
																		0
																	)}
																</AvatarFallback>
															</Avatar>
															<span className="text-xs text-muted-foreground">
																{
																	vaccination.memberName
																}{" "}
																·{" "}
																{
																	vaccination.facility
																}
															</span>
														</div>
													</div>
												</div>
												<div className="text-sm text-right">
													<p>
														{formatDate(
															vaccination.date
														)}
													</p>
													<p className="text-xs text-muted-foreground">
														{Math.ceil(
															(vaccination.date -
																new Date()) /
																(1000 *
																	60 *
																	60 *
																	24)
														)}{" "}
														ngày nữa
													</p>
												</div>
											</div>
										))}
									<Button
										variant="ghost"
										className="w-full"
										asChild
									>
										<Link to="/vaccinations">
											Xem tất cả lịch tiêm ngừa
										</Link>
									</Button>
								</div>
							</CardContent>
						</Card>

						{/* Chỉ số sức khỏe gần đây */}
						<Card>
							<CardHeader>
								<CardTitle>Chỉ số sức khỏe gần đây</CardTitle>
								<CardDescription>
									Các chỉ số sức khỏe được cập nhật gần đây
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="space-y-3">
									{recentHealthMetrics.map((metric) => (
										<div
											key={metric.id}
											className="flex items-center justify-between p-3 border rounded-lg"
										>
											<div className="flex items-center gap-3">
												<div
													className={`p-2 rounded-full ${
														metric.status ===
														"alert"
															? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
															: metric.status ===
																  "caution"
																? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
																: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
													}`}
												>
													{metric.type ===
													"Huyết áp" ? (
														<Heart className="w-4 h-4" />
													) : metric.type ===
													  "Đường huyết" ? (
														<BarChart className="w-4 h-4" />
													) : metric.type ===
													  "Cân nặng" ? (
														<User className="w-4 h-4" />
													) : (
														<Thermometer className="w-4 h-4" />
													)}
												</div>
												<div>
													<div className="flex items-center gap-2">
														<p className="font-medium">
															{metric.type}
														</p>
														<p className="text-xs font-normal text-muted-foreground">
															{metric.memberName}
														</p>
													</div>
													<div className="flex items-center gap-1 mt-1">
														<p
															className={`text-sm font-medium ${getStatusColor(metric.status)}`}
														>
															{metric.value}{" "}
															{metric.unit}
														</p>
														{getChangeIcon(
															metric.change
														)}
													</div>
												</div>
											</div>
											<div className="text-sm text-right">
												<p className="text-xs text-muted-foreground">
													{formatDate(metric.date)}
												</p>
											</div>
										</div>
									))}
									<Button
										variant="ghost"
										className="w-full"
										asChild
									>
										<Link to="/health-metrics">
											Xem tất cả chỉ số sức khỏe
										</Link>
									</Button>
								</div>
							</CardContent>
						</Card>
					</div>
				</TabsContent>

				<TabsContent value="family" className="space-y-4">
					<Card>
						<CardHeader>
							<div className="flex items-center justify-between">
								<CardTitle>Quản lý gia đình</CardTitle>
								<div className="flex gap-2">
									<Button variant="outline" size="sm">
										<Mail className="w-4 h-4 mr-2" />
										Mời thành viên
									</Button>
									<Button size="sm">
										<UserPlus className="w-4 h-4 mr-2" />
										Thêm thành viên
									</Button>
								</div>
							</div>
							<CardDescription>
								Quản lý thông tin các thành viên trong gia đình
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{familyMembers.map((member) => (
									<div
										key={member.id}
										className="flex items-center justify-between p-4 border rounded-lg"
									>
										<div className="flex items-center gap-4">
											<Avatar className="w-12 h-12">
												<AvatarImage
													src={member.avatar}
													alt={member.name}
												/>
												<AvatarFallback>
													{member.name.charAt(0)}
												</AvatarFallback>
											</Avatar>
											<div>
												<div className="flex items-center gap-2">
													<p className="text-lg font-medium">
														{member.name}
													</p>
													{member.relationship ===
														"Chủ hộ" && (
														<Badge variant="secondary">
															Chủ hộ
														</Badge>
													)}
												</div>
												<div className="flex items-center gap-2 mt-1">
													<p className="text-sm text-muted-foreground">
														{formatDate(member.dob)}{" "}
														(
														{new Date().getFullYear() -
															member.dob.getFullYear()}{" "}
														tuổi)
													</p>
													<span className="text-muted-foreground">
														•
													</span>
													<p className="text-sm text-muted-foreground">
														{member.relationship}
													</p>
												</div>
											</div>
										</div>
										<div className="flex items-center gap-2">
											{member.alerts > 0 && (
												<Badge
													variant="outline"
													className={`rounded-full ${getStatusColor(member.healthStatus)}`}
												>
													{member.alerts} cảnh báo
												</Badge>
											)}
											<Button
												variant="outline"
												size="sm"
												asChild
											>
												<Link
													to={`/family-members/${member.id}`}
												>
													Chi tiết
												</Link>
											</Button>
										</div>
									</div>
								))}
							</div>
						</CardContent>
						<CardFooter className="flex justify-between border-t bg-muted/10 px-6 py-4">
							<div className="text-sm text-muted-foreground">
								{familyMembers.length} thành viên
							</div>
							<Button variant="outline" size="sm">
								<UserPlus className="w-4 h-4 mr-2" />
								Thêm thành viên
							</Button>
						</CardFooter>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
};

export default Overview;
