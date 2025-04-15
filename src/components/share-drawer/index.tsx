import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { FiShare2, FiChevronRight } from "react-icons/fi";
import { Card } from "@/components/ui/card";

// Cập nhật schema để lưu trữ quyền cho từng loại thông tin
const formSchema = z.object({
	profileId: z.string().min(1, "Chọn thành viên"),
	accessType: z.enum(["link", "email"]),
	doctorEmail: z.string().email().optional(),
	sharedData: z
		.array(
			z.object({
				field: z.string(),
				permissions: z.array(z.enum(["READ", "ADD", "UPDATE"])),
			})
		)
		.min(1, "Chọn ít nhất một loại thông tin để chia sẻ"),
	reason: z.string().optional(),
	expiresAt: z.date(),
});

type ShareFormType = z.infer<typeof formSchema>;

export function ShareDrawer({
	type = "family",
}: {
	type?: "family" | "member";
}) {
	const [open, setOpen] = useState(false);

	// Danh sách các trường thông tin có thể chia sẻ
	const dataFields = [
		"Hồ sơ y tế cơ bản",
		"Lịch sử khám bệnh",
		"Đơn thuốc",
		"Lịch sử tiêm ngừa",
		"Tài liệu y tế",
	];

	const form = useForm<ShareFormType>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			accessType: "email",
			sharedData: [],
			expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 ngày mặc định
		},
	});

	const onSubmit = (values: ShareFormType) => {
		console.log("Share form values:", values);
		// TODO: Call backend API to create ShareRequest
		setOpen(false);
	};

	// Hàm kiểm tra trạng thái của checkbox
	const isFieldSelected = (fieldName: string) => {
		return form
			.watch("sharedData")
			.some((item) => item.field === fieldName);
	};

	// Hàm kiểm tra quyền của một trường
	const hasPermission = (
		fieldName: string,
		permission: "READ" | "ADD" | "UPDATE"
	) => {
		const fieldData = form
			.watch("sharedData")
			.find((item) => item.field === fieldName);
		return fieldData?.permissions.includes(permission);
	};

	// Hàm cập nhật quyền cho một trường
	const togglePermission = (
		fieldName: string,
		permission: "READ" | "ADD" | "UPDATE"
	) => {
		const currentSharedData = form.getValues("sharedData");
		const fieldIndex = currentSharedData.findIndex(
			(item) => item.field === fieldName
		);

		if (fieldIndex === -1) {
			// Nếu trường chưa được chọn, thêm mới với quyền đã chọn
			form.setValue("sharedData", [
				...currentSharedData,
				{ field: fieldName, permissions: [permission] },
			]);
		} else {
			// Nếu trường đã có, cập nhật quyền
			const fieldData = currentSharedData[fieldIndex];
			const permissionIndex = fieldData.permissions.indexOf(permission);

			let updatedPermissions;
			if (permissionIndex === -1) {
				// Thêm quyền mới
				updatedPermissions = [...fieldData.permissions, permission];
			} else {
				// Xóa quyền nếu đã tồn tại
				updatedPermissions = fieldData.permissions.filter(
					(p) => p !== permission
				);
			}

			let updatedSharedData;
			if (updatedPermissions.length === 0) {
				// Nếu không còn quyền nào, xóa trường khỏi danh sách
				updatedSharedData = currentSharedData.filter(
					(item) => item.field !== fieldName
				);
			} else {
				// Cập nhật quyền mới
				updatedSharedData = [...currentSharedData];
				updatedSharedData[fieldIndex] = {
					field: fieldName,
					permissions: updatedPermissions,
				};
			}

			form.setValue("sharedData", updatedSharedData);
		}
	};

	return (
		<Drawer open={open} onOpenChange={setOpen} direction="right">
			<DrawerTrigger asChild>
				<Button className="bg-green-400 hover:bg-green-500">
					<FiShare2 className="mr-2 h-4 w-4" />
					Chia sẻ hồ sơ y tế
				</Button>
			</DrawerTrigger>
			<DrawerContent className="!max-w-3xl">
				<DrawerHeader>
					<DrawerTitle>
						Chia sẻ hồ sơ y tế{" "}
						{type == "family" ? "toàn bộ gia đình" : "thành viên"}
					</DrawerTitle>

					<DrawerDescription>
						Chọn thông tin bạn muốn chia sẻ cho bác sĩ hoặc người
						khác.
					</DrawerDescription>
				</DrawerHeader>

				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-6 p-6 overflow-auto"
					>
						{/* <FormField
							control={form.control}
							name="profileId"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-base font-medium">
										Thành viên
									</FormLabel>
									<Select
										onValueChange={field.onChange}
										value={field.value}
									>
										<FormControl>
											<SelectTrigger className="w-full">
												<SelectValue
													placeholder="Chọn thành viên"
													className="w-full"
												/>
											</SelectTrigger>
										</FormControl>
										<SelectContent defaultValue={"0"}>
											<SelectItem value="0">
												Toàn bộ thành viên trong gia
												đình
											</SelectItem>
											{profiles.map((profile) => (
												<SelectItem
													key={profile.id}
													value={profile.id}
												>
													{profile.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/> */}

						<div>
							<FormLabel className="text-base font-medium mb-3 block">
								Thông tin và quyền chia sẻ
							</FormLabel>
							<div className="space-y-3">
								{dataFields.map((field) => (
									<Card key={field} className="p-4">
										<div className="flex items-center justify-between mb-2">
											<div className="font-medium">
												{field}
											</div>
											<div className="flex space-x-2">
												{["READ", "ADD", "UPDATE"].map(
													(perm) => (
														<div
															key={`${field}-${perm}`}
															className="flex items-center"
														>
															<Checkbox
																id={`${field}-${perm}`}
																checked={hasPermission(
																	field,
																	perm as
																		| "READ"
																		| "ADD"
																		| "UPDATE"
																)}
																onCheckedChange={() =>
																	togglePermission(
																		field,
																		perm as
																			| "READ"
																			| "ADD"
																			| "UPDATE"
																	)
																}
																className="mr-1.5"
															/>
															<label
																htmlFor={`${field}-${perm}`}
																className="text-sm"
															>
																{perm ===
																	"READ" &&
																	"Xem"}
																{perm ===
																	"ADD" &&
																	"Thêm"}
																{perm ===
																	"UPDATE" &&
																	"Sửa"}
															</label>
														</div>
													)
												)}
											</div>
										</div>
										<p className="text-sm text-gray-500">
											{field === "Hồ sơ y tế cơ bản" &&
												"Thông tin cơ bản như chiều cao, cân nặng, nhóm máu..."}
											{field === "Lịch sử khám bệnh" &&
												"Các lần khám và chẩn đoán"}
											{field === "Đơn thuốc" &&
												"Đơn thuốc và hướng dẫn sử dụng"}
											{field === "Lịch sử tiêm ngừa" &&
												"Thông tin về các mũi tiêm đã thực hiện"}
											{field === "Tài liệu y tế" &&
												"Kết quả xét nghiệm, chụp chiếu và giấy tờ y tế"}
										</p>
									</Card>
								))}
							</div>
							{form.formState.errors.sharedData && (
								<p className="text-sm text-red-500 mt-1">
									{form.formState.errors.sharedData.message}
								</p>
							)}
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="accessType"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											Phương thức chia sẻ
										</FormLabel>
										<Select
											onValueChange={field.onChange}
											value={field.value}
										>
											<FormControl>
												<SelectTrigger className="w-full">
													<SelectValue />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value="email">
													Qua email
												</SelectItem>
												<SelectItem value="link">
													Bất kì ai có đường dẫn
												</SelectItem>
											</SelectContent>
										</Select>
									</FormItem>
								)}
							/>

							{form.watch("accessType") === "email" && (
								<FormField
									control={form.control}
									name="doctorEmail"
									render={({ field }) => (
										<FormItem>
											<FormLabel>
												Email người nhận
											</FormLabel>
											<Input
												type="email"
												placeholder="Nhập email người nhận"
												{...field}
											/>
											<FormMessage />
										</FormItem>
									)}
								/>
							)}
						</div>

						<FormField
							control={form.control}
							name="expiresAt"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Thời hạn chia sẻ</FormLabel>
									<Popover>
										<PopoverTrigger asChild>
											<FormControl>
												<Button
													variant="outline"
													className="w-full md:w-auto"
												>
													{field.value
														? format(
																field.value,
																"dd/MM/yyyy"
															)
														: "Chọn ngày"}
													<FiChevronRight className="ml-2 h-4 w-4" />
												</Button>
											</FormControl>
										</PopoverTrigger>
										<PopoverContent className="w-auto p-0">
											<Calendar
												mode="single"
												selected={field.value}
												onSelect={field.onChange}
												initialFocus
												disabled={(date) =>
													date < new Date()
												}
											/>
										</PopoverContent>
									</Popover>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="reason"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										Lý do chia sẻ (tuỳ chọn)
									</FormLabel>
									<Textarea
										placeholder="Nhập lý do chia sẻ..."
										className="resize-none"
										{...field}
									/>
								</FormItem>
							)}
						/>

						<div className="flex justify-end gap-2">
							<Button
								type="button"
								variant="outline"
								onClick={() => setOpen(false)}
							>
								Hủy
							</Button>
							<Button
								type="submit"
								className="bg-green-500 hover:bg-green-600"
							>
								Tạo chia sẻ
							</Button>
						</div>
					</form>
				</Form>
			</DrawerContent>
		</Drawer>
	);
}
