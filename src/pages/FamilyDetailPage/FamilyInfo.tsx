import { useState } from "react";
import { FiUsers, FiHome, FiEdit2, FiTrash2, FiUserPlus } from "react-icons/fi";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import {
	FamilyDoctorDtoStatus,
	type FamilyDTO as Family,
} from "@/models/generated";
import dayjs from "dayjs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	useDeleteFamily,
	useUpdateFamily,
} from "@/queries/generated/family-controller/family-controller";
import { toast } from "sonner";
import { useNavigate, useRouter } from "@tanstack/react-router";
import {
	useDeleteRequest,
	useGetDoctorByFamily,
} from "@/queries/generated/doctor-family-controller/doctor-family-controller";
import AddDoctorDrawer from "@/components/AddDoctorDrawer";
import { Can } from "@/contexts/AbilityContext";
import { subject } from "@casl/ability";

// Zod schema based on the provided validation annotations
const familySchema = z.object({
	familyName: z
		.string()
		.min(3, { message: "Tên gia đình phải có từ 3 đến 255 ký tự" })
		.max(255, { message: "Tên gia đình phải có từ 3 đến 255 ký tự" }),
	address: z
		.string()
		.min(1, { message: "Địa chỉ không được để trống" })
		.max(500, { message: "Địa chỉ không được vượt quá 500 ký tự" }),
	phoneNumber: z
		.string()
		.min(1, { message: "Số điện thoại không được để trống" })
		.regex(/^(\+84|0)[3|5|7|8|9][0-9]{8}$/, {
			message: "Số điện thoại không hợp lệ",
		}),
	email: z
		.string()
		.min(1, { message: "Email không được để trống" })
		.max(100, { message: "Email không được vượt quá 100 ký tự" })
		.email({ message: "Email không hợp lệ" }),
});

type FamilyFormValues = z.infer<typeof familySchema>;

interface FamilyInfoProps {
	family: Family;
}

export default function FamilyInfo({ family }: FamilyInfoProps) {
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [isRemoveDoctorDialogOpen, setIsRemoveDoctorDialogOpen] =
		useState(false);
	const [isOpenAddDoctor, setIsOpenAddDoctor] = useState(false);
	const router = useRouter();
	const navigate = useNavigate();
	const householder = (family.familyMembers || []).find(
		(member) => member.relationship === "Chủ hộ"
	);
	const { data: doctorOfFamily, refetch: refetchDoctorOfFamily } =
		useGetDoctorByFamily(
			{
				familyId: family.id!,
			},
			{
				query: {
					enabled: !!family.id,
				},
			}
		);
	const form = useForm<FamilyFormValues>({
		resolver: zodResolver(familySchema),
		defaultValues: {
			familyName: family.familyName || "",
			address: family.address || "",
			phoneNumber: family.phoneNumber || "",
			email: family.email || "",
		},
	});
	const { mutate: deleteFamily, isPending: isDeleting } = useDeleteFamily({
		mutation: {
			onSuccess: () => {
				toast.success("Đã xoá gia đình", {
					duration: 3000,
				});
				setIsDeleteDialogOpen(false);
				navigate({
					to: "/home/families",
				});
			},
			onError: (error: any) => {
				toast.error("Xoá gia đình thất bại", {
					duration: 5000,
					description:
						error.response?.data?.message ||
						error.message ||
						"Đã có lỗi xảy ra",
				});
			},
		},
	});
	const { mutate: editFamily, isPending: isSubmitting } = useUpdateFamily({
		mutation: {
			onSuccess: () => {
				toast.success("Đã cập nhật thông tin gia đình", {
					duration: 3000,
				});
				setIsEditModalOpen(false);
				router.invalidate();
			},
			onError: (error: any) => {
				toast.error("Cập nhật thông tin gia đình thất bại", {
					duration: 5000,
					description:
						error.response?.data?.message ||
						error.message ||
						"Đã có lỗi xảy ra",
				});
			},
		},
	});

	const handleEditSubmit = async (values: FamilyFormValues) => {
		if (isSubmitting) return;
		editFamily({
			id: family.id + "",
			data: {
				...values,
			},
		});
	};

	const handleDelete = () => {
		if (isDeleting) return;
		deleteFamily({
			id: family.id + "",
		});
	};

	const { mutateAsync: removeDoctor, isPending: isRemovingDoctor } =
		useDeleteRequest({
			mutation: {
				onSuccess: () => {
					toast.success("Đã xoá bác sĩ quản lý khỏi gia đình", {
						duration: 3000,
					});
					setIsRemoveDoctorDialogOpen(false);
					router.invalidate();
					refetchDoctorOfFamily();
				},
				onError: (error: any) => {
					toast.error("Xoá bác sĩ quản lý thất bại", {
						duration: 5000,
						description:
							error.response?.data?.message ||
							error.message ||
							"Đã có lỗi xảy ra",
					});
				},
			},
		});

	const handleRemoveDoctor = () => {
		if (isRemovingDoctor || !doctorOfFamily) return;
		removeDoctor({
			id: doctorOfFamily.id!,
		});
	};

	return (
		<>
			<Card className="overflow-hidden">
				<CardHeader>
					<div className="flex items-center justify-between">
						<CardTitle className="flex items-center">
							<FiHome className="mr-2 h-5 w-5" />
							Thông tin gia đình
						</CardTitle>
						<div className="flex gap-2">
							<Can
								I="update"
								a={
									subject("FamilyProfile", {
										...family,
									}) as any
								}
							>
								<Button
									variant="outline"
									size="sm"
									className="flex items-center gap-1"
									onClick={() => setIsEditModalOpen(true)}
								>
									<FiEdit2 className="h-4 w-4" />
									Sửa
								</Button>
							</Can>
							<Can
								I="delete"
								a={
									subject("FamilyProfile", {
										...family,
									}) as any
								}
							>
								<Button
									variant="destructive"
									size="sm"
									className="flex items-center gap-1"
									onClick={() => setIsDeleteDialogOpen(true)}
								>
									<FiTrash2 className="h-4 w-4" />
									Xoá
								</Button>
							</Can>
						</div>
					</div>
					<CardDescription>
						Chi tiết về hộ gia đình của bạn
					</CardDescription>
				</CardHeader>
				<CardContent className="pt-6">
					<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
						<div className="space-y-5">
							<div>
								<p className="text-sm font-medium text-muted-foreground mb-1">
									Tên gọi
								</p>
								<p className="font-medium">
									{family.familyName}
								</p>
							</div>
							<div>
								<p className="text-sm font-medium text-muted-foreground mb-1">
									Ngày tạo
								</p>
								<p className="font-medium">
									{dayjs(
										family.createdAt || undefined
									).format("DD/MM/YYYY")}
								</p>
							</div>
							<div>
								<p className="text-sm font-medium text-muted-foreground mb-1">
									Địa chỉ
								</p>
								<p className="font-medium">{family.address}</p>
							</div>
						</div>
						<div className="space-y-5">
							<div>
								<p className="text-sm font-medium text-muted-foreground mb-1">
									Số thành viên
								</p>
								<p className="font-medium">
									{family.familyMembers?.length || 0}
								</p>
							</div>
							<div>
								<p className="text-sm font-medium text-muted-foreground mb-1">
									Số điện thoại liên hệ
								</p>
								<p className="font-medium">
									{family.phoneNumber || "—"}
								</p>
							</div>
							<div>
								<p className="text-sm font-medium text-muted-foreground mb-1">
									Email liên hệ
								</p>
								<p className="font-medium">
									{family.email || "—"}
								</p>
							</div>
						</div>
					</div>

					<Separator className="my-6" />

					{/* Chủ hộ section */}
					<div className="mb-6">
						<div className="flex items-center mb-4">
							<FiUsers className="mr-2 h-5 w-5" />
							<h3 className="font-semibold text-lg">Chủ hộ</h3>
						</div>

						{householder ? (
							<div className="flex items-center p-3 bg-muted/20 rounded-lg">
								<Avatar className="h-12 w-12 mr-4 border">
									<AvatarImage
										src={"https://placewaifu.com/image/200"}
										alt={
											householder.profile?.fullName || ""
										}
									/>
									<AvatarFallback>
										{householder.profile?.fullName?.charAt(
											0
										) || "U"}
									</AvatarFallback>
								</Avatar>
								<div className="flex-1">
									<p className="font-medium text-base">
										{householder.profile?.fullName ||
											"Chưa cập nhật"}
									</p>
									<p className="text-sm text-muted-foreground">
										{householder.profile?.phoneNumber}
										{householder.profile?.phoneNumber &&
											householder.profile?.email &&
											" • "}
										{householder.profile?.email}
									</p>
								</div>
							</div>
						) : (
							<p className="text-muted-foreground italic">
								Chưa có thông tin chủ hộ
							</p>
						)}
					</div>

					{/* New Doctor section */}
					<div>
						<div className="flex items-center justify-between mb-4">
							<div className="flex items-center justify-between w-full">
								<div className="flex items-center">
									<FiUserPlus className="mr-2 h-5 w-5" />
									<h3 className="font-semibold text-lg">
										Bác sĩ quản lý
									</h3>
								</div>
								<div>
									{doctorOfFamily && (
										// delete doctor button
										<Can
											I="manage"
											an={
												subject("FamilyDoctor", {
													...family,
												}) as any
											}
										>
											<Button
												variant="destructive"
												size="sm"
												className="flex items-center gap-1"
												onClick={() =>
													setIsRemoveDoctorDialogOpen(
														true
													)
												}
											>
												<FiTrash2 className="h-4 w-4" />
												Gỡ bỏ bác sĩ
											</Button>
										</Can>
									)}
								</div>
							</div>
							{!doctorOfFamily && (
								<>
									<Button
										variant="outline"
										size="sm"
										className="flex items-center gap-1"
										onClick={() => setIsOpenAddDoctor(true)}
									>
										<FiUserPlus className="h-4 w-4" />
										Thêm bác sĩ
									</Button>
									<AddDoctorDrawer
										familyId={family.id!}
										isOpen={isOpenAddDoctor}
										onClose={() =>
											setIsOpenAddDoctor(false)
										}
										onSuccess={() =>
											refetchDoctorOfFamily()
										}
									/>
								</>
							)}
						</div>

						{doctorOfFamily ? (
							<div className="p-3 bg-muted/20 rounded-lg">
								<div className="flex items-center">
									<Avatar className="h-12 w-12 mr-4 border">
										<AvatarImage
											src={
												"https://placewaifu.com/image/300"
											}
											alt={
												doctorOfFamily.doctor?.bio || ""
											}
										/>
										<AvatarFallback>BS</AvatarFallback>
									</Avatar>
									<div className="flex-1">
										<p className="font-medium text-base">
											BS.{" "}
											{doctorOfFamily.doctor?.bio || ""}
										</p>
										<p className="text-sm text-muted-foreground">
											{doctorOfFamily.doctor?.specialty ||
												""}
											{doctorOfFamily.doctor?.specialty &&
												" • "}
											Số giấy phép:{" "}
											{doctorOfFamily.doctor
												?.licenseNumber || ""}
										</p>
									</div>
								</div>
								<div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-2">
									<div>
										<p className="text-xs font-medium text-muted-foreground">
											Cơ sở y tế
										</p>
										<p className="text-sm">
											{doctorOfFamily.doctor
												?.medicalFacility || "—"}
										</p>
									</div>
									<div>
										<p className="text-xs font-medium text-muted-foreground">
											Ngày bắt đầu quản lý
										</p>
										<p className="text-sm">
											{doctorOfFamily.createdAt
												? dayjs(
														doctorOfFamily.createdAt
													).format("DD/MM/YYYY")
												: "—"}
										</p>
									</div>
									{doctorOfFamily.status && (
										<div>
											<p className="text-xs font-medium text-muted-foreground">
												Trạng thái
											</p>
											<div
												className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
													doctorOfFamily.status ===
													FamilyDoctorDtoStatus.ACCEPTED
														? "bg-green-100 text-green-800"
														: doctorOfFamily.status ===
															  "PENDING"
															? "bg-yellow-100 text-yellow-800"
															: "bg-gray-100 text-gray-800"
												}`}
											>
												{doctorOfFamily.status ===
												FamilyDoctorDtoStatus.ACCEPTED
													? "Đang hoạt động"
													: doctorOfFamily.status ===
														  "PENDING"
														? "Chờ xác nhận"
														: doctorOfFamily.status}
											</div>
										</div>
									)}
									{doctorOfFamily.notes && (
										<div>
											<p className="text-xs font-medium text-muted-foreground">
												Ghi chú
											</p>
											<p className="text-sm">
												{doctorOfFamily.notes}
											</p>
										</div>
									)}
								</div>
							</div>
						) : (
							<p className="text-muted-foreground italic">
								Chưa có bác sĩ quản lý cho gia đình này
							</p>
						)}
					</div>
				</CardContent>
			</Card>

			{/* Edit Modal */}
			<Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
				<DialogContent className="sm:max-w-[500px]">
					<DialogHeader>
						<DialogTitle>Chỉnh sửa thông tin gia đình</DialogTitle>
						<DialogDescription>
							Cập nhật thông tin chi tiết về gia đình của bạn
						</DialogDescription>
					</DialogHeader>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(handleEditSubmit)}
							className="space-y-4"
						>
							<FormField
								control={form.control}
								name="familyName"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Tên gia đình</FormLabel>
										<FormControl>
											<Input
												{...field}
												placeholder="Nhập tên gia đình"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="address"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Địa chỉ</FormLabel>
										<FormControl>
											<Input
												{...field}
												placeholder="Nhập địa chỉ"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="phoneNumber"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											Số điện thoại liên hệ
										</FormLabel>
										<FormControl>
											<Input
												{...field}
												placeholder="Nhập số điện thoại"
												type="tel"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email</FormLabel>
										<FormControl>
											<Input
												{...field}
												placeholder="Nhập email"
												type="email"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<DialogFooter>
								<Button
									type="button"
									variant="outline"
									onClick={() => setIsEditModalOpen(false)}
								>
									Huỷ bỏ
								</Button>
								<Button type="submit" disabled={isSubmitting}>
									{isSubmitting
										? "Đang lưu..."
										: "Lưu thay đổi"}
								</Button>
							</DialogFooter>
						</form>
					</Form>
				</DialogContent>
			</Dialog>

			{/* Delete Confirmation Dialog */}
			<AlertDialog
				open={isDeleteDialogOpen}
				onOpenChange={setIsDeleteDialogOpen}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							Xác nhận xoá gia đình
						</AlertDialogTitle>
						<AlertDialogDescription>
							Bạn có chắc chắn muốn xoá gia đình "
							{family.familyName}"? Hành động này không thể hoàn
							tác và tất cả dữ liệu liên quan sẽ bị xoá vĩnh viễn.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Huỷ bỏ</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleDelete}
							disabled={isDeleting}
							className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
						>
							{isDeleting ? "Đang xoá..." : "Xoá gia đình"}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			{/* Remove Doctor Confirmation Dialog */}
			<AlertDialog
				open={isRemoveDoctorDialogOpen}
				onOpenChange={setIsRemoveDoctorDialogOpen}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							Xác nhận gỡ bỏ bác sĩ quản lý
						</AlertDialogTitle>
						<AlertDialogDescription>
							Bạn có chắc chắn muốn gỡ bỏ bác sĩ "
							{doctorOfFamily?.doctor?.bio || ""}" khỏi gia đình
							của bạn? Hành động này sẽ huỷ bỏ liên kết giữa bác
							sĩ và gia đình.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Huỷ bỏ</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleRemoveDoctor}
							disabled={isRemovingDoctor}
							className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
						>
							{isRemovingDoctor
								? "Đang gỡ bỏ..."
								: "Gỡ bỏ bác sĩ"}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
