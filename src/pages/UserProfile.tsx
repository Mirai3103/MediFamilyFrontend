import React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	CardFooter,
} from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	Pencil,
	User,
	Mail,
	Phone,
	Calendar,
	MapPin,
	Shield,
	Heart,
	Ruler,
	Activity,
	AlertTriangle,
	FileText,
	PlusCircle,
	ChevronRight,
	HeartPulse,
} from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Profile, User as IUser } from "@/models/generated";
import { useUpdateMyAvatar } from "@/queries/generated/profile-controller/profile-controller";
import { useBoolean } from "usehooks-ts";

const profileFormSchema = z.object({
	fullName: z.string().min(2, { message: "Họ tên phải có ít nhất 2 ký tự" }),
	email: z.string().email({ message: "Email không hợp lệ" }),
	phone: z.string().min(10, { message: "Số điện thoại không hợp lệ" }),
	dateOfBirth: z.string().optional(),
	address: z.string().optional(),
	bio: z.string().optional(),
});

const healthProfileSchema = z.object({
	bloodType: z
		.string()
		.regex(/^(A|B|AB|O)[+-]$/, {
			message: "Nhóm máu phải có định dạng hợp lệ (A+, B-, AB+, O-,...)",
		})
		.optional(),
	height: z
		.number()
		.min(0, { message: "Chiều cao phải là số dương" })
		.max(300, { message: "Chiều cao không được vượt quá 300cm" })
		.optional(),
	weight: z
		.number()
		.min(0, { message: "Cân nặng phải là số dương" })
		.max(500, { message: "Cân nặng không được vượt quá 500kg" })
		.optional(),
	allergies: z
		.string()
		.max(1000, {
			message: "Thông tin dị ứng không được vượt quá 1000 ký tự",
		})
		.optional(),
	chronicDiseases: z
		.string()
		.max(1000, {
			message: "Thông tin bệnh mãn tính không được vượt quá 1000 ký tự",
		})
		.optional(),
	notes: z
		.string()
		.max(2000, { message: "Ghi chú không được vượt quá 2000 ký tự" })
		.optional(),
	healthInsuranceNumber: z
		.string()
		.min(10, { message: "Số BHYT phải có ít nhất 10 ký tự" })
		.max(15, { message: "Số BHYT không được vượt quá 15 ký tự" }),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;
type HealthProfileValues = z.infer<typeof healthProfileSchema>;
export interface UserProfileProps {
	user: IUser;
	profile: Profile;
}
const UserProfile = ({ user, profile }: UserProfileProps) => {
	const [isEditMode, setIsEditMode] = useState(false);
	const [isHealthEditMode, setIsHealthEditMode] = useState(false);
	const [avatarUrl, setAvatarUrl] = useState<string | null>(
		() => profile.avatarUrl!
	);
	const {
		toggle: toggleOpenAvatarDialog,
		setValue: setValueAvatarDialog,
		value: openAvatarDialog,
	} = useBoolean(false);
	const [avatarFile, setAvatarFile] = useState<File | null>(null);
	const [activeTab, setActiveTab] = useState("personal");

	// Mock user data
	const defaultValues: ProfileFormValues = {
		email: profile.email || "",
		fullName: profile.fullName || "",
		phone: profile.phoneNumber || "",
		address: profile.address,
		bio: profile.bio || "",
		dateOfBirth: profile.dateOfBirth,
	};

	// Mock health data
	const defaultHealthValues: HealthProfileValues = {
		bloodType: profile.bloodType || "",
		height: profile.height || 0,
		weight: profile.weight || 0,
		allergies: profile.allergies || "Không có",
		chronicDiseases: profile.chronicDiseases || "Không có",
		notes: profile.notes || "Không có",
		healthInsuranceNumber: profile.healthInsuranceNumber || "",
	};

	const form = useForm<ProfileFormValues>({
		resolver: zodResolver(profileFormSchema),
		defaultValues,
	});

	const healthForm = useForm<HealthProfileValues>({
		resolver: zodResolver(healthProfileSchema),
		defaultValues: defaultHealthValues,
	});

	const onSubmit = (data: ProfileFormValues) => {
		console.log("Updated profile data:", data);

		toast("Cập nhật thành công", {
			description: "Thông tin cá nhân của bạn đã được cập nhật.",
		});

		setIsEditMode(false);
	};

	const onHealthSubmit = (data: HealthProfileValues) => {
		console.log("Updated health profile data:", data);

		toast("Cập nhật thành công", {
			description: "Thông tin sức khỏe của bạn đã được cập nhật.",
		});

		setIsHealthEditMode(false);
	};

	const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		setAvatarFile(file || null);
		if (file) {
			const url = URL.createObjectURL(file);
			setAvatarUrl(url);
		}
	};
	const { mutate: updateAvatar, isPending: isUpdatingAvatar } =
		useUpdateMyAvatar({
			mutation: {
				onError: (error) => {
					toast.error("Cập nhật ảnh đại diện thất bại", {
						description: error.message,
					});
					setAvatarUrl(profile.avatarUrl || null);
					toggleOpenAvatarDialog();
				},
				onSuccess: (e) => {
					toast.success("Cập nhật ảnh đại diện thành công", {
						description: "Ảnh đại diện của bạn đã được cập nhật.",
					});
					setAvatarUrl(e.avatarUrl || null);
					toggleOpenAvatarDialog();
				},
			},
		});
	const handleSaveAvatar = () => {
		if (!avatarFile) return;
		updateAvatar({
			data: {
				file: avatarFile!,
			},
		});
	};

	const getBMIStatus = () => {
		if (!defaultHealthValues.height || !defaultHealthValues.weight)
			return "Chưa có thông tin";

		const heightInMeters = defaultHealthValues.height / 100;
		const bmi =
			defaultHealthValues.weight / (heightInMeters * heightInMeters);

		if (bmi < 18.5) return `${bmi.toFixed(1)} - Thiếu cân`;
		if (bmi < 25) return `${bmi.toFixed(1)} - Bình thường`;
		if (bmi < 30) return `${bmi.toFixed(1)} - Thừa cân`;
		return `${bmi.toFixed(1)} - Béo phì`;
	};

	return (
		<div className="flex-1 container py-8 px-4 sm:px-6 lg:px-8">
			<div className="space-y-6">
				<div className="flex flex-col md:flex-row items-start md:items-center md:justify-between">
					<h1 className="text-2xl font-bold">Hồ sơ của tôi</h1>
					<Tabs
						defaultValue="personal"
						value={activeTab}
						onValueChange={setActiveTab}
						className="mt-4 md:mt-0"
					>
						<TabsList>
							<TabsTrigger value="personal">
								Thông tin cá nhân
							</TabsTrigger>
							<TabsTrigger value="health">
								Hồ sơ sức khỏe
							</TabsTrigger>
						</TabsList>
					</Tabs>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
					{/* Profile card - always visible */}
					<Card className="md:col-span-1">
						<CardContent className="pt-6">
							<div className="flex flex-col items-center text-center space-y-4">
								<div className="relative">
									<Avatar className="h-24 w-24">
										<AvatarImage
											src={avatarUrl!}
											alt={defaultValues.fullName}
										/>
										<AvatarFallback className="text-lg">
											{defaultValues.fullName
												.split(" ")
												.map((name) => name[0])
												.join("")
												.slice(0, 2)
												.toUpperCase()}
										</AvatarFallback>
									</Avatar>

									<Dialog
										open={openAvatarDialog}
										onOpenChange={setValueAvatarDialog}
									>
										<DialogTrigger asChild>
											<Button
												size="icon"
												variant="outline"
												className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full"
											>
												<Pencil className="h-4 w-4" />
											</Button>
										</DialogTrigger>
										<DialogContent>
											<DialogHeader>
												<DialogTitle>
													Thay đổi ảnh đại diện
												</DialogTitle>
												<DialogDescription>
													Chọn một ảnh mới từ thiết bị
													của bạn.
												</DialogDescription>
											</DialogHeader>
											<Input
												type="file"
												accept="image/*"
												onChange={handleAvatarChange}
												className="mt-4"
											/>
											<DialogFooter className="mt-4">
												<Button
													type="submit"
													disabled={isUpdatingAvatar}
													onClick={handleSaveAvatar}
												>
													Lưu thay đổi
												</Button>
											</DialogFooter>
										</DialogContent>
									</Dialog>
								</div>

								<div>
									<h2 className="text-xl font-semibold">
										{defaultValues.fullName}
									</h2>
									<p className="text-gray-500">
										ID: USR123456
									</p>
								</div>

								<div className="w-full pt-4 border-t border-gray-200">
									<div className="flex flex-col space-y-3">
										<div className="flex items-center">
											<Mail className="h-4 w-4 text-gray-400 mr-2" />
											<span className="text-sm">
												{defaultValues.email}
											</span>
										</div>
										<div className="flex items-center">
											<Phone className="h-4 w-4 text-gray-400 mr-2" />
											<span className="text-sm">
												{defaultValues.phone}
											</span>
										</div>
										<div className="flex items-center">
											<Calendar className="h-4 w-4 text-gray-400 mr-2" />
											<span className="text-sm">
												{defaultValues.dateOfBirth}
											</span>
										</div>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Main content area based on active tab */}
					<div className="md:col-span-3">
						{activeTab === "personal" && (
							<>
								<Card>
									<CardHeader className="flex flex-row items-center justify-between pb-2">
										<div>
											<CardTitle>
												Thông tin cá nhân
											</CardTitle>
											<CardDescription>
												Quản lý thông tin cá nhân của
												bạn
											</CardDescription>
										</div>
										{!isEditMode && (
											<Button
												onClick={() =>
													setIsEditMode(true)
												}
												variant="outline"
												size="sm"
											>
												<Pencil className="mr-2 h-4 w-4" />
												Chỉnh sửa
											</Button>
										)}
									</CardHeader>

									<CardContent>
										{isEditMode ? (
											<Form {...form}>
												<form
													onSubmit={form.handleSubmit(
														onSubmit
													)}
													className="space-y-6"
												>
													<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
														<FormField
															control={
																form.control
															}
															name="fullName"
															render={({
																field,
															}) => (
																<FormItem>
																	<FormLabel>
																		Họ và
																		tên
																	</FormLabel>
																	<FormControl>
																		<Input
																			placeholder="Họ và tên"
																			{...field}
																		/>
																	</FormControl>
																	<FormMessage />
																</FormItem>
															)}
														/>

														<FormField
															control={
																form.control
															}
															name="email"
															render={({
																field,
															}) => (
																<FormItem>
																	<FormLabel>
																		Email
																	</FormLabel>
																	<FormControl>
																		<Input
																			placeholder="Email"
																			{...field}
																		/>
																	</FormControl>
																	<FormMessage />
																</FormItem>
															)}
														/>

														<FormField
															control={
																form.control
															}
															name="phone"
															render={({
																field,
															}) => (
																<FormItem>
																	<FormLabel>
																		Số điện
																		thoại
																	</FormLabel>
																	<FormControl>
																		<Input
																			placeholder="Số điện thoại"
																			{...field}
																		/>
																	</FormControl>
																	<FormMessage />
																</FormItem>
															)}
														/>

														<FormField
															control={
																form.control
															}
															name="dateOfBirth"
															render={({
																field,
															}) => (
																<FormItem>
																	<FormLabel>
																		Ngày
																		sinh
																	</FormLabel>
																	<FormControl>
																		<Input
																			type="date"
																			{...field}
																		/>
																	</FormControl>
																	<FormMessage />
																</FormItem>
															)}
														/>

														<FormField
															control={
																form.control
															}
															name="address"
															render={({
																field,
															}) => (
																<FormItem className="md:col-span-2">
																	<FormLabel>
																		Địa chỉ
																	</FormLabel>
																	<FormControl>
																		<Input
																			placeholder="Địa chỉ"
																			{...field}
																		/>
																	</FormControl>
																	<FormMessage />
																</FormItem>
															)}
														/>

														<FormField
															control={
																form.control
															}
															name="bio"
															render={({
																field,
															}) => (
																<FormItem className="md:col-span-2">
																	<FormLabel>
																		Giới
																		thiệu
																	</FormLabel>
																	<FormControl>
																		<Textarea
																			placeholder="Giới thiệu về bản thân"
																			className="resize-none"
																			{...field}
																		/>
																	</FormControl>
																	<FormMessage />
																</FormItem>
															)}
														/>
													</div>

													<div className="flex justify-end gap-4">
														<Button
															type="button"
															variant="outline"
															onClick={() =>
																setIsEditMode(
																	false
																)
															}
														>
															Hủy
														</Button>
														<Button type="submit">
															Lưu thay đổi
														</Button>
													</div>
												</form>
											</Form>
										) : (
											<div className="space-y-6">
												<div className="grid grid-cols-1 gap-y-6">
													<div className="flex items-start gap-2">
														<User className="mt-0.5 h-5 w-5 text-gray-400" />
														<div>
															<p className="text-sm font-medium text-gray-500">
																Họ và tên
															</p>
															<p>
																{
																	defaultValues.fullName
																}
															</p>
														</div>
													</div>

													<div className="flex items-start gap-2">
														<Mail className="mt-0.5 h-5 w-5 text-gray-400" />
														<div>
															<p className="text-sm font-medium text-gray-500">
																Email
															</p>
															<p>
																{
																	defaultValues.email
																}
															</p>
														</div>
													</div>

													<div className="flex items-start gap-2">
														<Phone className="mt-0.5 h-5 w-5 text-gray-400" />
														<div>
															<p className="text-sm font-medium text-gray-500">
																Số điện thoại
															</p>
															<p>
																{
																	defaultValues.phone
																}
															</p>
														</div>
													</div>

													<div className="flex items-start gap-2">
														<Calendar className="mt-0.5 h-5 w-5 text-gray-400" />
														<div>
															<p className="text-sm font-medium text-gray-500">
																Ngày sinh
															</p>
															<p>
																{
																	defaultValues.dateOfBirth
																}
															</p>
														</div>
													</div>

													<div className="flex items-start gap-2">
														<MapPin className="mt-0.5 h-5 w-5 text-gray-400" />
														<div>
															<p className="text-sm font-medium text-gray-500">
																Địa chỉ
															</p>
															<p>
																{
																	defaultValues.address
																}
															</p>
														</div>
													</div>

													{defaultValues.bio && (
														<div className="flex items-start gap-2">
															<FileText className="mt-0.5 h-5 w-5 text-gray-400" />
															<div>
																<p className="text-sm font-medium text-gray-500">
																	Giới thiệu
																</p>
																<p className="mt-1">
																	{
																		defaultValues.bio
																	}
																</p>
															</div>
														</div>
													)}
												</div>
											</div>
										)}
									</CardContent>
								</Card>

								<Card className="mt-6">
									<CardHeader>
										<CardTitle className="text-lg">
											Bảo mật
										</CardTitle>
										<CardDescription>
											Quản lý mật khẩu và các thiết lập
											bảo mật
										</CardDescription>
									</CardHeader>
									<CardContent>
										<div className="flex items-center justify-between">
											<div className="flex items-start gap-2">
												<Shield className="mt-0.5 h-5 w-5 text-gray-400" />
												<div>
													<p className="font-medium">
														Thay đổi mật khẩu
													</p>
													<p className="text-sm text-gray-500">
														Cập nhật mật khẩu định
														kỳ để bảo vệ tài khoản
														của bạn
													</p>
												</div>
											</div>
											<Button variant="outline">
												Thay đổi
											</Button>
										</div>
									</CardContent>
								</Card>
							</>
						)}

						{activeTab === "health" && (
							<Card>
								<CardHeader className="flex flex-row items-center justify-between pb-2">
									<div>
										<CardTitle>Hồ sơ sức khỏe</CardTitle>
										<CardDescription>
											Quản lý thông tin sức khỏe cá nhân
											của bạn
										</CardDescription>
									</div>
									{!isHealthEditMode && (
										<Button
											onClick={() =>
												setIsHealthEditMode(true)
											}
											variant="outline"
											size="sm"
										>
											<Pencil className="mr-2 h-4 w-4" />
											Chỉnh sửa
										</Button>
									)}
								</CardHeader>

								<CardContent>
									{isHealthEditMode ? (
										<Form {...healthForm}>
											<form
												onSubmit={healthForm.handleSubmit(
													onHealthSubmit
												)}
												className="space-y-6"
											>
												<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
													<FormField
														control={
															healthForm.control
														}
														name="bloodType"
														render={({ field }) => (
															<FormItem>
																<FormLabel>
																	Nhóm máu
																</FormLabel>
																<FormControl>
																	<Input
																		placeholder="Ví dụ: A+, B-, O+, AB-"
																		{...field}
																	/>
																</FormControl>
																<FormMessage />
															</FormItem>
														)}
													/>

													<div className="grid grid-cols-2 gap-4">
														<FormField
															control={
																healthForm.control
															}
															name="height"
															render={({
																field,
															}) => (
																<FormItem>
																	<FormLabel>
																		Chiều
																		cao (cm)
																	</FormLabel>
																	<FormControl>
																		<Input
																			type="number"
																			placeholder="Chiều cao"
																			{...field}
																			onChange={(
																				e
																			) =>
																				field.onChange(
																					parseFloat(
																						e
																							.target
																							.value
																					)
																				)
																			}
																		/>
																	</FormControl>
																	<FormMessage />
																</FormItem>
															)}
														/>

														<FormField
															control={
																healthForm.control
															}
															name="weight"
															render={({
																field,
															}) => (
																<FormItem>
																	<FormLabel>
																		Cân nặng
																		(kg)
																	</FormLabel>
																	<FormControl>
																		<Input
																			type="number"
																			placeholder="Cân nặng"
																			{...field}
																			onChange={(
																				e
																			) =>
																				field.onChange(
																					parseFloat(
																						e
																							.target
																							.value
																					)
																				)
																			}
																		/>
																	</FormControl>
																	<FormMessage />
																</FormItem>
															)}
														/>
													</div>
													<FormField
														control={
															healthForm.control
														}
														name="healthInsuranceNumber"
														render={({ field }) => (
															<FormItem className="md:col-span-2">
																<FormLabel>
																	Số BHYT
																</FormLabel>
																<FormControl>
																	<Textarea
																		placeholder="Số BHYT"
																		className="resize-none"
																		{...field}
																	/>
																</FormControl>
																<FormMessage />
															</FormItem>
														)}
													/>

													<FormField
														control={
															healthForm.control
														}
														name="allergies"
														render={({ field }) => (
															<FormItem className="md:col-span-2">
																<FormLabel>
																	Dị ứng
																</FormLabel>
																<FormControl>
																	<Textarea
																		placeholder="Liệt kê các dị ứng của bạn"
																		className="resize-none"
																		{...field}
																	/>
																</FormControl>
																<FormMessage />
															</FormItem>
														)}
													/>

													<FormField
														control={
															healthForm.control
														}
														name="chronicDiseases"
														render={({ field }) => (
															<FormItem className="md:col-span-2">
																<FormLabel>
																	Bệnh mãn
																	tính
																</FormLabel>
																<FormControl>
																	<Textarea
																		placeholder="Liệt kê các bệnh mãn tính của bạn"
																		className="resize-none"
																		{...field}
																	/>
																</FormControl>
																<FormMessage />
															</FormItem>
														)}
													/>

													<FormField
														control={
															healthForm.control
														}
														name="notes"
														render={({ field }) => (
															<FormItem className="md:col-span-2">
																<FormLabel>
																	Ghi chú
																</FormLabel>
																<FormControl>
																	<Textarea
																		placeholder="Thông tin bổ sung về sức khỏe của bạn"
																		className="resize-none"
																		{...field}
																	/>
																</FormControl>
																<FormMessage />
															</FormItem>
														)}
													/>
												</div>

												<div className="flex justify-end gap-4">
													<Button
														type="button"
														variant="outline"
														onClick={() =>
															setIsHealthEditMode(
																false
															)
														}
													>
														Hủy
													</Button>
													<Button type="submit">
														Lưu thay đổi
													</Button>
												</div>
											</form>
										</Form>
									) : (
										<div className="space-y-6">
											<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
												<Card className="bg-gray-50 border-0">
													<CardContent className="p-4">
														<div className="flex items-center justify-between">
															<div className="flex items-center">
																<Heart className="h-5 w-5 text-red-500 mr-2" />
																<p className="font-medium">
																	Nhóm máu
																</p>
															</div>
															<p className="font-semibold">
																{defaultHealthValues.bloodType ||
																	"Chưa cập nhật"}
															</p>
														</div>
													</CardContent>
												</Card>

												<Card className="bg-gray-50 border-0">
													<CardContent className="p-4">
														<div className="flex items-center justify-between">
															<div className="flex items-center">
																<Activity className="h-5 w-5 text-blue-500 mr-2" />
																<p className="font-medium">
																	Chỉ số BMI
																</p>
															</div>
															<p className="font-semibold">
																{getBMIStatus()}
															</p>
														</div>
													</CardContent>
												</Card>

												<Card className="bg-gray-50 border-0">
													<CardContent className="p-4">
														<div className="flex items-center justify-between">
															<div className="flex items-center">
																<Ruler className="h-5 w-5 text-indigo-500 mr-2" />
																<p className="font-medium">
																	Chiều cao
																</p>
															</div>
															<p className="font-semibold">
																{defaultHealthValues.height
																	? `${defaultHealthValues.height} cm`
																	: "Chưa cập nhật"}
															</p>
														</div>
													</CardContent>
												</Card>

												<Card className="bg-gray-50 border-0">
													<CardContent className="p-4">
														<div className="flex items-center justify-between">
															<div className="flex items-center">
																<Activity className="h-5 w-5 text-green-500 mr-2" />
																<p className="font-medium">
																	Cân nặng
																</p>
															</div>
															<p className="font-semibold">
																{defaultHealthValues.weight
																	? `${defaultHealthValues.weight} kg`
																	: "Chưa cập nhật"}
															</p>
														</div>
													</CardContent>
												</Card>
											</div>

											<div className="space-y-4 mt-6">
												<div className="border rounded-lg p-4">
													<div className="flex items-start gap-2">
														<HeartPulse className="mt-0.5 h-5 w-5 text-green-500" />
														<div>
															<p className="font-medium">
																Số BHYT
															</p>
															<p className="text-sm mt-1">
																{profile.healthInsuranceNumber ||
																	"Chưa cập nhật"}
															</p>
														</div>
													</div>
												</div>
												<div className="border rounded-lg p-4">
													<div className="flex items-start gap-2">
														<AlertTriangle className="mt-0.5 h-5 w-5 text-amber-500" />
														<div>
															<p className="font-medium">
																Dị ứng
															</p>
															<p className="text-sm mt-1">
																{defaultHealthValues.allergies ||
																	"Không có thông tin dị ứng"}
															</p>
														</div>
													</div>
												</div>

												<div className="border rounded-lg p-4">
													<div className="flex items-start gap-2">
														<Activity className="mt-0.5 h-5 w-5 text-red-500" />
														<div>
															<p className="font-medium">
																Bệnh mãn tính
															</p>
															<p className="text-sm mt-1">
																{defaultHealthValues.chronicDiseases ||
																	"Không có thông tin bệnh mãn tính"}
															</p>
														</div>
													</div>
												</div>

												{defaultHealthValues.notes && (
													<div className="border rounded-lg p-4">
														<div className="flex items-start gap-2">
															<FileText className="mt-0.5 h-5 w-5 text-gray-500" />
															<div>
																<p className="font-medium">
																	Ghi chú
																</p>
																<p className="text-sm mt-1">
																	{
																		defaultHealthValues.notes
																	}
																</p>
															</div>
														</div>
													</div>
												)}
											</div>
										</div>
									)}
								</CardContent>

								<CardFooter className="flex justify-between border-t p-4">
									<Button
										variant="outline"
										className="flex items-center"
									>
										<PlusCircle className="mr-2 h-4 w-4" />
										Thêm lịch sử khám bệnh
									</Button>
									<Button variant="secondary">
										Xem báo cáo sức khỏe
										<ChevronRight className="ml-2 h-4 w-4" />
									</Button>
								</CardFooter>
							</Card>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default UserProfile;
