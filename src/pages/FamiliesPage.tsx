import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Plus, Search, Loader2 } from "lucide-react";
import { Link } from "@tanstack/react-router";
import {
	getGetMyFamilyQueryKey,
	useCreateFamily,
	useGetMyFamily,
} from "@/queries/generated/family-controller/family-controller";
import dayjs from "dayjs";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
	DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { CreateFamilyRequest } from "@/models/generated";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";

const createFamilyRequestSchema = z.object({
	familyName: z
		.string()
		.min(3, { message: "Tên gia đình phải có ít nhất 3 ký tự." })
		.max(255, { message: "Tên gia đình không được vượt quá 255 ký tự." }),

	address: z
		.string()
		.max(500, { message: "Địa chỉ không được vượt quá 500 ký tự." }),

	phoneNumber: z
		.string()
		.regex(/^(\+84|0)[3|5|7|8|9][0-9]{8}$/, {
			message:
				"Số điện thoại không hợp lệ. Vui lòng nhập số điện thoại Việt Nam hợp lệ.",
		}),

	email: z
		.string()
		.email({ message: "Email không hợp lệ." })
		.max(100, { message: "Email không được vượt quá 100 ký tự." }),
});

const FamiliesPage = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
	const { data, isLoading, isError } = useGetMyFamily();
	const queryClient = useQueryClient();
	const { mutate: createFamily, isPending: isCreateFamilyPending } =
		useCreateFamily({
			mutation: {
				onSuccess: () => {
					queryClient.invalidateQueries({
						queryKey: getGetMyFamilyQueryKey(),
					});
					toast.success("Thành công", {
						description: "Gia đình đã được tạo thành công",
					});
					setIsCreateModalOpen(false);
					reset();
				},
				onError: (error: any) => {
					toast.error("Lỗi", {
						description:
							error.message ||
							"Không thể tạo gia đình. Vui lòng thử lại.",
					});
				},
			},
		});
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isValid },
	} = useForm<CreateFamilyRequest>({
		resolver: zodResolver(createFamilyRequestSchema),
		mode: "onChange",
	});

	const onSubmit = async (data: any) => {
		createFamily({
			data: data,
		});
	};

	const filteredFamilies = React.useMemo(() => {
		if (!data) {
			return [];
		}
		return data?.filter((family) =>
			family.familyName.toLowerCase().includes(searchTerm.toLowerCase())
		);
	}, [data, searchTerm]);

	return (
		<div className="flex flex-col min-h-screen">
			<div className="flex-grow">
				<div className="container py-6">
					<div className="flex flex-col space-y-6">
						<div className="flex items-center justify-between">
							<div>
								<h1 className="text-2xl font-bold text-gray-900">
									Gia đình
								</h1>
								<p className="text-gray-500 mt-1">
									Quản lý và theo dõi thông tin gia đình của
									bạn
								</p>
							</div>
							<Button onClick={() => setIsCreateModalOpen(true)}>
								<Plus className="mr-2 h-4 w-4" />
								Tạo gia đình mới
							</Button>
						</div>

						<div className="flex items-center space-x-2">
							<div className="relative flex-grow">
								<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
								<Input
									placeholder="Tìm kiếm gia đình..."
									className="pl-8 bg-white"
									value={searchTerm}
									onChange={(e) =>
										setSearchTerm(e.target.value)
									}
								/>
							</div>
						</div>

						{isLoading ? (
							<div className="flex flex-col items-center justify-center py-12">
								<Loader2 className="h-12 w-12 animate-spin text-health-blue mb-4" />
								<p className="text-gray-500">
									Đang tải dữ liệu gia đình...
								</p>
							</div>
						) : isError ? (
							<div className="flex flex-col items-center justify-center bg-red-50 p-6 rounded-lg">
								<p className="text-red-600 font-medium">
									Đã xảy ra lỗi khi tải dữ liệu
								</p>
								<Button
									variant="outline"
									className="mt-4"
									onClick={() =>
										queryClient.invalidateQueries({
											queryKey: getGetMyFamilyQueryKey(),
										})
									}
								>
									Thử lại
								</Button>
							</div>
						) : filteredFamilies.length === 0 ? (
							<div className="flex flex-col items-center justify-center bg-gray-50 p-10 rounded-lg">
								{searchTerm ? (
									<>
										<p className="text-gray-600 mb-2">
											Không tìm thấy gia đình nào phù hợp
										</p>
										<p className="text-gray-500 text-sm">
											Hãy thử tìm kiếm với từ khóa khác
										</p>
									</>
								) : (
									<>
										<p className="text-gray-600 mb-2">
											Bạn chưa có gia đình nào
										</p>
										<Button
											onClick={() =>
												setIsCreateModalOpen(true)
											}
											className="mt-4 bg-health-blue hover:bg-health-blue/90"
										>
											<Plus className="mr-2 h-4 w-4" />
											Tạo gia đình mới
										</Button>
									</>
								)}
							</div>
						) : (
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
								{filteredFamilies.map((family) => (
									<Card
										key={family.id}
										className="bg-white border border-gray-200 py-2 gap-y-2 rounded-lg shadow-sm hover:shadow-md transition-all overflow-hidden"
									>
										<div className="bg-health-blue/10 px-6 py-4 border-b border-gray-100">
											<div className="flex justify-between items-center">
												<CardTitle className="text-xl text-health-blue font-semibold truncate">
													{family.familyName}
												</CardTitle>
												<div className="bg-green-100 text-green-700 text-xs font-medium px-2.5 py-1 rounded-full">
													Active
												</div>
											</div>
											<CardDescription className="mt-1 text-sm text-gray-500">
												Cập nhật:{" "}
												{dayjs(
													family.updatedAt ||
														undefined
												).format("DD/MM/YYYY")}
											</CardDescription>
										</div>

										<CardContent className="">
											<div className="flex items-center mb-2">
												<div className="w-10 h-10 bg-health-blue/20 rounded-full flex items-center justify-center mr-3">
													<span className="text-health-blue font-bold">
														{family.owner?.fullName?.charAt(
															0
														) || "?"}
													</span>
												</div>
												<div>
													<div className="text-sm font-medium">
														Chủ hộ
													</div>
													<div className="text-sm text-gray-700">
														{family.owner
															?.fullName ||
															"Chưa có thông tin"}
													</div>
												</div>
											</div>

											<div className="grid grid-cols-2 gap-3 mb-4">
												<div className="bg-gray-50 rounded-md p-2">
													<div className="text-xs text-gray-500 mb-1">
														Thành viên
													</div>
													<div className="flex items-center">
														<span className="text-lg font-semibold">
															{5}
														</span>
														<span className="text-xs text-gray-500 ml-1">
															người
														</span>
													</div>
												</div>

												<div className="bg-gray-50 rounded-md p-2">
													<div className="text-xs text-gray-500 mb-1">
														Lịch hẹn
													</div>
													<div className="flex items-center">
														<div className="h-2 w-2 rounded-full bg-green-500 mr-1.5"></div>
														<span className="text-sm font-medium text-green-700">
															Đang hoạt động
														</span>
													</div>
												</div>
											</div>

											<Separator className="my-3" />

											<div className="space-y-2.5">
												{family.address && (
													<div className="flex items-start">
														<svg
															xmlns="http://www.w3.org/2000/svg"
															className="h-4 w-4 text-gray-400 mt-0.5 mr-2 flex-shrink-0"
															fill="none"
															viewBox="0 0 24 24"
															stroke="currentColor"
														>
															<path
																strokeLinecap="round"
																strokeLinejoin="round"
																strokeWidth={2}
																d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
															/>
														</svg>
														<span className="text-sm text-gray-600 leading-tight">
															{family.address}
														</span>
													</div>
												)}

												{family.phoneNumber && (
													<div className="flex items-center">
														<svg
															xmlns="http://www.w3.org/2000/svg"
															className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0"
															fill="none"
															viewBox="0 0 24 24"
															stroke="currentColor"
														>
															<path
																strokeLinecap="round"
																strokeLinejoin="round"
																strokeWidth={2}
																d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
															/>
														</svg>
														<span className="text-sm text-gray-600">
															{family.phoneNumber}
														</span>
													</div>
												)}

												{family.email && (
													<div className="flex items-center">
														<svg
															xmlns="http://www.w3.org/2000/svg"
															className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0"
															fill="none"
															viewBox="0 0 24 24"
															stroke="currentColor"
														>
															<path
																strokeLinecap="round"
																strokeLinejoin="round"
																strokeWidth={2}
																d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
															/>
														</svg>
														<span className="text-sm text-gray-600 truncate">
															{family.email}
														</span>
													</div>
												)}
											</div>
										</CardContent>

										<CardFooter className="px-5 py-1  border-t border-gray-100">
											<Button
												variant="default"
												className="w-full  text-white"
												asChild
											>
												<Link
													to={
														"/home/families/" +
														family.id
													}
												>
													<span className="flex items-center justify-center">
														Xem chi tiết
														<svg
															xmlns="http://www.w3.org/2000/svg"
															className="h-4 w-4 ml-1.5"
															fill="none"
															viewBox="0 0 24 24"
															stroke="currentColor"
														>
															<path
																strokeLinecap="round"
																strokeLinejoin="round"
																strokeWidth={2}
																d="M14 5l7 7m0 0l-7 7m7-7H3"
															/>
														</svg>
													</span>
												</Link>
											</Button>
										</CardFooter>
									</Card>
								))}
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Create Family Modal */}
			<Dialog
				open={isCreateModalOpen}
				onOpenChange={(open) => {
					if (!open && !isCreateFamilyPending) {
						setIsCreateModalOpen(false);
						reset();
					}
				}}
			>
				<DialogContent className="sm:max-w-xl">
					<DialogHeader>
						<DialogTitle>Tạo gia đình mới</DialogTitle>
					</DialogHeader>

					<form onSubmit={handleSubmit(onSubmit)}>
						<div className="grid gap-4 py-4">
							<div className="grid grid-cols-4 items-center gap-4">
								<Label
									htmlFor="familyName"
									className="text-right"
								>
									Tên gia đình{" "}
									<span className="text-red-500">*</span>
								</Label>
								<div className="col-span-3">
									<Input
										id="familyName"
										{...register("familyName")}
										className="col-span-3"
										disabled={isCreateFamilyPending}
										placeholder="Nhập tên gia đình"
									/>
									{errors.familyName && (
										<p className="text-sm text-red-500 mt-1">
											{errors.familyName.message}
										</p>
									)}
								</div>
							</div>

							<div className="grid grid-cols-4 items-center gap-4">
								<Label htmlFor="address" className="text-right">
									Địa chỉ{" "}
									<span className="text-red-500">*</span>
								</Label>
								<div className="col-span-3">
									<Input
										id="address"
										{...register("address")}
										disabled={isCreateFamilyPending}
										placeholder="Nhập địa chỉ"
									/>
									{errors.address && (
										<p className="text-sm text-red-500 mt-1">
											{errors.address.message}
										</p>
									)}
								</div>
							</div>

							<div className="grid grid-cols-4 items-center gap-4">
								<Label
									htmlFor="phoneNumber"
									className="text-right"
								>
									Số điện thoại{" "}
									<span className="text-red-500">*</span>
								</Label>
								<div className="col-span-3">
									<Input
										id="phoneNumber"
										{...register("phoneNumber")}
										disabled={isCreateFamilyPending}
										placeholder="VD: 0901234567"
									/>
									{errors.phoneNumber && (
										<p className="text-sm text-red-500 mt-1">
											{errors.phoneNumber.message}
										</p>
									)}
								</div>
							</div>

							<div className="grid grid-cols-4 items-center gap-4">
								<Label htmlFor="email" className="text-right">
									Email{" "}
									<span className="text-red-500">*</span>
								</Label>
								<div className="col-span-3">
									<Input
										id="email"
										type="email"
										{...register("email")}
										disabled={isCreateFamilyPending}
										placeholder="example@email.com"
									/>
									{errors.email && (
										<p className="text-sm text-red-500 mt-1">
											{errors.email.message}
										</p>
									)}
								</div>
							</div>
						</div>

						<DialogFooter>
							<DialogClose asChild>
								<Button
									type="button"
									variant="outline"
									disabled={isCreateFamilyPending}
								>
									Hủy
								</Button>
							</DialogClose>
							<Button
								type="submit"
								disabled={isCreateFamilyPending || !isValid}
							>
								{isCreateFamilyPending ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Đang tạo...
									</>
								) : (
									"Tạo gia đình"
								)}
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default FamiliesPage;
