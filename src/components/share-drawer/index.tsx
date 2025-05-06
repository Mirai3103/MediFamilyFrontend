import { useState } from "react";
import { format } from "date-fns";
import dayjs from "dayjs";
import { FiShare2, FiChevronRight } from "react-icons/fi";
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
import { Textarea } from "@/components/ui/textarea";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Giả sử bạn có các component Tabs được export từ đường dẫn tương tự
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import { toast } from "sonner";
import {
	getGetAllShareProfilesQueryKey,
	useCreateShareProfile,
	useDeleteShareProfile,
	useGetAllShareProfiles,
} from "@/queries/generated/share-profile-controller/share-profile-controller";
import {
	SharePermissionDtoPermissionTypesItem,
	SharePermissionDtoResourceType,
	ShareProfileDtoShareType,
} from "@/models/generated";
import { useQueryClient } from "@tanstack/react-query";

// Schema của form
const formSchema = z.object({
	profileId: z.coerce.number().nullish(),
	accessType: z.enum(["link", "email"]),
	doctorEmail: z.string().email().optional(),
	sharedData: z
		.array(
			z.object({
				field: z.nativeEnum(SharePermissionDtoResourceType),
				permissions: z.array(
					z.nativeEnum(SharePermissionDtoPermissionTypesItem)
				),
			})
		)
		.min(1, "Chọn ít nhất một loại thông tin để chia sẻ"),
	reason: z.string().optional(),
	expiresAt: z.date(),
});
type PermissionType = SharePermissionDtoPermissionTypesItem;
type ShareFieldType = SharePermissionDtoResourceType;
type ShareFormType = z.infer<typeof formSchema>;

// Dữ liệu để hiển thị thông tin mỗi loại share
const dataFields: Record<SharePermissionDtoResourceType, string> = {
	[SharePermissionDtoResourceType.PROFILE]: "Hồ sơ y tế cơ bản",
	[SharePermissionDtoResourceType.MEDICAL_RECORD]: "Lịch sử khám bệnh",
	[SharePermissionDtoResourceType.FILE_DOCUMENT]: "Tài liệu y tế",
	[SharePermissionDtoResourceType.PRESCRIPTION]: "Đơn thuốc",
	[SharePermissionDtoResourceType.VACCINATION]: "Lịch sử tiêm ngừa",
};

// Kiểu cho mỗi record chia sẻ trong danh sách (giả sử mỗi record có các thông tin tối thiểu sau)
type ShareRecord = {
	id: number;
	shareType: ShareProfileDtoShareType;
	expiresAt: string;
	reason?: string;
	invitedEmails?: string[];
	sharedData?: { field: ShareFieldType; permissions: PermissionType[] }[];
};

export function ShareDrawer({
	type = "family",
	familyId,
	memberId,
}: {
	type?: "family" | "member";
	familyId: number;
	memberId?: number;
}) {
	const [open, setOpen] = useState(false);
	// Danh sách chia sẻ (ví dụ khởi tạo rỗng, bạn có thể lấy dữ liệu từ API)
	const { data: shareList } = useGetAllShareProfiles({
		familyId: familyId,
		memberId: memberId,
	});
	const client = useQueryClient();
	const { mutate: deleteShare } = useDeleteShareProfile({
		mutation: {
			onSuccess: () => {
				toast.success("Xoá chia sẻ thành công!");
				client.invalidateQueries({
					queryKey: getGetAllShareProfilesQueryKey({
						familyId: familyId,
						memberId: memberId,
					}),
				});
			},
			onError: () => {
				toast.error("Xoá chia sẻ thất bại!");
			},
		},
	});
	// Sử dụng hook form cho form tạo chia sẻ
	const form = useForm<ShareFormType>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			accessType: "email",
			sharedData: [],
			expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 ngày mặc định
		},
	});

	const { mutate } = useCreateShareProfile({
		mutation: {
			onSuccess: () => {
				toast.success("Chia sẻ hồ sơ thành công!");
				client.invalidateQueries({
					queryKey: getGetAllShareProfilesQueryKey({
						familyId: familyId,
						memberId: memberId,
					}),
				});
				form.reset();
			},
			onError: () => {
				toast.error("Chia sẻ hồ sơ thất bại!");
			},
		},
	});

	const onSubmit = (values: ShareFormType) => {
		console.log("Share form values:", values);
		mutate({
			data: {
				invitedEmails:
					values.accessType === "email" ? [values.doctorEmail!] : [],
				expiresAt: dayjs(values.expiresAt).format(
					"YYYY-MM-DDTHH:mm:ss"
				),
				reason: values.reason,
				memberId: type === "member" ? memberId! : undefined,
				familyId: familyId,
				sharePermissions: values.sharedData.map((item) => ({
					permissionTypes: item.permissions.map(
						(perm) => perm as SharePermissionDtoPermissionTypesItem
					),
					resourceType: item.field as SharePermissionDtoResourceType,
				})),
				shareType:
					values.accessType === "link"
						? ShareProfileDtoShareType.AnyOneWithLink
						: ShareProfileDtoShareType.OnlyInvitedPeople,
			},
		});
		setOpen(false);
	};

	// Các hàm xử lý trong form tạo chia sẻ
	const isFieldSelected = (fieldName: string) =>
		form.watch("sharedData").some((item) => item.field === fieldName);

	const hasPermission = (
		fieldName: ShareFieldType,
		permission: PermissionType
	) => {
		const fieldData = form
			.watch("sharedData")
			.find((item) => item.field === fieldName);
		return fieldData?.permissions.includes(permission);
	};

	const togglePermission = (
		fieldName: ShareFieldType,
		permission: PermissionType
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
			const fieldData = currentSharedData[fieldIndex];
			const permissionIndex = fieldData.permissions.indexOf(permission);

			let updatedPermissions;
			if (permissionIndex === -1) {
				updatedPermissions = [...fieldData.permissions, permission];
			} else {
				updatedPermissions = fieldData.permissions.filter(
					(p) => p !== permission
				);
			}

			let updatedSharedData;
			if (updatedPermissions.length === 0) {
				updatedSharedData = currentSharedData.filter(
					(item) => item.field !== fieldName
				);
			} else {
				updatedSharedData = [...currentSharedData];
				updatedSharedData[fieldIndex] = {
					field: fieldName,
					permissions: updatedPermissions,
				};
			}

			form.setValue("sharedData", updatedSharedData);
		}
	};

	// Hàm xử lý xoá một share record
	const handleDeleteShare = (recordId: string) => {
		deleteShare({ id: recordId });
		toast.success("Xoá chia sẻ thành công!");
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
						{type === "family" ? "toàn bộ gia đình" : "thành viên"}
					</DrawerTitle>
					<DrawerDescription>
						Chọn thông tin bạn muốn chia sẻ hoặc xem lại danh sách
						đã chia sẻ.
					</DrawerDescription>
				</DrawerHeader>

				<Tabs defaultValue="shareList">
					<TabsList>
						<TabsTrigger value="shareList">
							Danh sách chia sẻ
						</TabsTrigger>
						<TabsTrigger value="create">Tạo chia sẻ</TabsTrigger>
					</TabsList>

					{/* Tab danh sách chia sẻ */}
					<TabsContent
						value="shareList"
						className="py-1 px-2 overflow-auto max-h-[80vh]"
					>
						{shareList?.length === 0 ? (
							<div className="flex flex-col items-center justify-center p-10  text-center">
								<div className="rounded-full bg-gray-100 p-4 mb-4">
									<FiShare2 className="h-8 w-8 text-gray-400" />
								</div>
								<h3 className="text-lg font-medium mb-1">
									Chưa có chia sẻ nào
								</h3>
								<p className="text-gray-500 max-w-md">
									Tạo chia sẻ mới để cho phép bác sĩ hoặc
									người thân xem thông tin y tế của bạn
								</p>
							</div>
						) : (
							<div className="space-y-4 ">
								{shareList?.map((record) => (
									<Card
										key={record.id}
										className="overflow-hidden border py-2 border-gray-200 hover:border-gray-300 transition-all"
									>
										<div className="flex flex-col md:flex-row">
											{/* Left section with badge and main info */}
											<div className="p-4 flex-1">
												<div className="flex items-center mb-3">
													<div
														className={`px-2 py-1 rounded-full text-xs font-medium mr-2 
                  ${
						record.shareType ===
						ShareProfileDtoShareType.AnyOneWithLink
							? "bg-blue-100 text-blue-800"
							: "bg-purple-100 text-purple-800"
					}`}
													>
														{record.shareType ===
														ShareProfileDtoShareType.AnyOneWithLink
															? "Link công khai"
															: "Qua email"}
													</div>
													<div
														className={`px-2 py-1 rounded-full text-xs font-medium
                  ${
						dayjs(record.expiresAt).isAfter(dayjs().add(5, "day"))
							? "bg-green-100 text-green-800"
							: "bg-amber-100 text-amber-800"
					}`}
													>
														Hết hạn:{" "}
														{dayjs(
															record.expiresAt
														).format("DD/MM/YYYY")}
													</div>
												</div>

												{/* Share details */}
												<div className="mb-3">
													{/* {record.reason && (
														<div className="text-sm text-gray-600 italic mb-2">
															"{record.reason}"
														</div>
													)} */}

													{record.invitedEmails &&
														record.invitedEmails
															.length > 0 && (
															<div className="flex items-center text-sm text-gray-600 mb-2">
																<span className="font-medium mr-2">
																	Người nhận:
																</span>
																{record.invitedEmails.map(
																	(
																		email,
																		index
																	) => (
																		<span
																			key={
																				index
																			}
																			className="bg-gray-100 px-2 py-1 rounded mr-1"
																		>
																			{
																				email
																			}
																		</span>
																	)
																)}
															</div>
														)}
												</div>

												{/* Shared data visualization */}
												<div>
													<div className="text-sm font-medium mb-1">
														Thông tin được chia
														sẻ:{" "}
													</div>
													<div className="text-sm font-medium mb-2 ">
														{record.memberId != null
															? "1 Thành viên: " +
																record.member
																	?.profile
																	?.fullName
															: "Toàn bộ gia đình"}
													</div>
													<div className="flex flex-wrap gap-2">
														{record.sharePermissions?.map(
															(permission) => {
																const fieldName =
																	dataFields[
																		permission
																			.resourceType!
																	];
																return (
																	<div
																		key={
																			permission.id
																		}
																		className="bg-gray-50 border border-gray-200 rounded px-2 py-1 text-sm flex items-center"
																	>
																		<span className="font-medium mr-1">
																			{
																				fieldName
																			}
																		</span>
																		<div className="flex gap-1">
																			{permission.permissionTypes!.includes(
																				SharePermissionDtoPermissionTypesItem.VIEW
																			) && (
																				<span className="bg-blue-100 text-blue-800 px-1 rounded text-xs">
																					Xem
																				</span>
																			)}
																			{permission.permissionTypes!.includes(
																				SharePermissionDtoPermissionTypesItem.EDIT
																			) && (
																				<span className="bg-amber-100 text-amber-800 px-1 rounded text-xs">
																					Sửa
																				</span>
																			)}
																			{permission.permissionTypes!.includes(
																				SharePermissionDtoPermissionTypesItem.CREATE
																			) && (
																				<span className="bg-green-100 text-green-800 px-1 rounded text-xs">
																					Thêm
																				</span>
																			)}
																		</div>
																	</div>
																);
															}
														)}
													</div>
												</div>
											</div>

											{/* Right section with actions */}
											<div className="bg-gray-50 p-4 flex flex-row md:flex-col justify-between items-center border-t md:border-t-0 md:border-l border-gray-200">
												<div className="text-xs text-gray-500">
													Tạo ngày:{" "}
													{dayjs(
														record.createdAt
													).format("DD/MM/YYYY")}
												</div>

												<div className="flex flex-col gap-2">
													{record.shareType ===
														ShareProfileDtoShareType.AnyOneWithLink && (
														<Button
															variant="outline"
															size="sm"
															className="flex items-center"
															onClick={() => {
																navigator.clipboard.writeText(
																	`${window.location.origin}/home/share/${record.id}`
																);
																toast.success(
																	"Đã sao chép đường dẫn chia sẻ!"
																);
															}}
														>
															<FiShare2 className="mr-1 h-3 w-3" />
															Sao chép link
														</Button>
													)}
													<Button
														variant="destructive"
														size="sm"
														onClick={() =>
															handleDeleteShare(
																record.id!
															)
														}
													>
														Xoá chia sẻ
													</Button>
												</div>
											</div>
										</div>
									</Card>
								))}
							</div>
						)}
					</TabsContent>

					{/* Tab tạo chia sẻ (giữ nguyên form cũ) */}
					<TabsContent
						value="create"
						className="overflow-auto max-h-[80vh]"
					>
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit)}
								className="space-y-6 p-6 overflow-auto"
							>
								<div>
									<FormLabel className="text-base font-medium mb-3 block">
										Thông tin và quyền chia sẻ
									</FormLabel>
									<div className="space-y-3">
										{Object.keys(dataFields).map(
											(field: any) => (
												<Card
													key={field}
													className="p-4 gap-2"
												>
													<div className="flex items-center justify-between mb-2">
														<div className="font-medium">
															{dataFields[field!]}
														</div>
														<div className="flex space-x-2">
															{Object.values(
																SharePermissionDtoPermissionTypesItem
															).map((perm) => (
																<div
																	key={`${field}-${perm}`}
																	className="flex items-center"
																>
																	<Checkbox
																		id={`${field}-${perm}`}
																		checked={hasPermission(
																			field,
																			perm as PermissionType
																		)}
																		onCheckedChange={() =>
																			togglePermission(
																				field,
																				perm as PermissionType
																			)
																		}
																		className="mr-1.5"
																	/>
																	<label
																		htmlFor={`${field}-${perm}`}
																		className="text-sm"
																	>
																		{perm ===
																			SharePermissionDtoPermissionTypesItem.VIEW &&
																			"Xem"}
																		{perm ===
																			SharePermissionDtoPermissionTypesItem.CREATE &&
																			"Thêm"}
																		{perm ===
																			SharePermissionDtoPermissionTypesItem.EDIT &&
																			"Sửa"}
																	</label>
																</div>
															))}
														</div>
													</div>
													<p className="text-sm text-gray-500">
														{field ===
															SharePermissionDtoResourceType.PROFILE &&
															"Thông tin cơ bản như chiều cao, cân nặng, nhóm máu..."}
														{field ===
															SharePermissionDtoResourceType.MEDICAL_RECORD &&
															"Các lần khám và chẩn đoán"}
														{field ===
															SharePermissionDtoResourceType.PRESCRIPTION &&
															"Đơn thuốc và hướng dẫn sử dụng"}
														{field ===
															SharePermissionDtoResourceType.VACCINATION &&
															"Thông tin về các mũi tiêm đã thực hiện"}
														{field ===
															SharePermissionDtoResourceType.FILE_DOCUMENT &&
															"Kết quả xét nghiệm, chụp chiếu và giấy tờ y tế"}
													</p>
												</Card>
											)
										)}
									</div>
									{form.formState.errors.sharedData && (
										<p className="text-sm text-red-500 mt-1">
											{
												form.formState.errors.sharedData
													.message
											}
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
													onValueChange={
														field.onChange
													}
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
															Bất kì ai có đường
															dẫn
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
											<FormLabel>
												Thời hạn chia sẻ
											</FormLabel>
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
														onSelect={
															field.onChange
														}
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
					</TabsContent>
				</Tabs>
			</DrawerContent>
		</Drawer>
	);
}
