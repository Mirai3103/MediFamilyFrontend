import { useState } from "react";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetFooter,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSearchDoctors } from "@/queries/generated/doctor-controller/doctor-controller";
import { useSendRequest } from "@/queries/generated/doctor-family-controller/doctor-family-controller";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { FiSearch, FiUser, FiHeart, FiCheck, FiLoader } from "react-icons/fi";
import { useRouter } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import debounce from "lodash/debounce";

// Schema for form validation
const requestSchema = z.object({
	doctorId: z.number({
		required_error: "Vui lòng chọn bác sĩ",
	}),
	notes: z
		.string()
		.max(500, "Ghi chú không được vượt quá 500 ký tự")
		.optional(),
});

type RequestFormValues = z.infer<typeof requestSchema>;

interface AddDoctorDrawerProps {
	familyId: number;
	isOpen: boolean;
	onClose: () => void;
	onSuccess?: () => void;
}

export default function AddDoctorDrawer({
	familyId,
	isOpen,
	onSuccess,
	onClose,
}: AddDoctorDrawerProps) {
	const [searchTerm, setSearchTerm] = useState("");
	const [page, setPage] = useState(1);
	const [selectedDoctor, setSelectedDoctor] = useState<{
		id: number;
		name: string;
	} | null>(null);
	const router = useRouter();

	// Form setup
	const {
		control,
		handleSubmit,
		formState: { errors },
		setValue,
		watch,
	} = useForm<RequestFormValues>({
		resolver: zodResolver(requestSchema),
		defaultValues: {
			doctorId: undefined,
			notes: "",
		},
	});

	// Data fetching
	const {
		data: doctorsData,
		isLoading,
		refetch,
	} = useSearchDoctors(
		{
			keyword: searchTerm,
			page: page - 1,
			size: 10,
		},
		{
			query: {
				enabled: isOpen,
			},
		}
	);

	// Send request mutation
	const { mutate: sendRequest, isPending: isSending } = useSendRequest({
		mutation: {
			onSuccess: () => {
				toast.success("Đã gửi yêu cầu thành công", {
					duration: 3000,
				});
				onClose();
				router.invalidate();
				onSuccess?.();
			},
			onError: (error: any) => {
				toast.error("Gửi yêu cầu thất bại", {
					duration: 5000,
					description:
						error.response?.data?.message ||
						error.message ||
						"Đã có lỗi xảy ra",
				});
			},
		},
	});

	// Debounced search function
	const debouncedSearch = debounce((value: string) => {
		setSearchTerm(value);
		setPage(1);
	}, 500);

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		debouncedSearch(e.target.value);
	};

	const handleDoctorSelect = (doctor: any) => {
		setSelectedDoctor({
			id: doctor.id,
			name: doctor.bio || `Bác sĩ #${doctor.id}`,
		});
		setValue("doctorId", doctor.id);
	};

	const handleLoadMore = () => {
		setPage((prev) => prev + 1);
	};

	const onSubmit = (data: RequestFormValues) => {
		sendRequest({
			data: {
				doctorId: data.doctorId,
				familyId: familyId,
				notes: data.notes || "",
			},
		});
	};

	const watchedDoctorId = watch("doctorId");

	return (
		<Sheet open={isOpen} onOpenChange={onClose}>
			<SheetContent className="w-full sm:max-w-md overflow-y-auto px-4">
				<SheetHeader className="mb-6">
					<SheetTitle>Chọn bác sĩ quản lý</SheetTitle>
					<SheetDescription>
						Tìm kiếm và chọn bác sĩ quản lý cho gia đình của bạn
					</SheetDescription>
				</SheetHeader>

				<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
					<div className="space-y-4">
						{/* Search input */}
						<div className="relative">
							<FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
							<Input
								placeholder="Tìm kiếm theo tên, chuyên khoa..."
								className="pl-10"
								onChange={handleSearchChange}
							/>
						</div>

						{/* Selected doctor */}
						{selectedDoctor && (
							<div className="p-3 border rounded-md bg-muted/20 my-4">
								<div className="flex items-center">
									<Badge
										variant="outline"
										className="mr-2 bg-primary/10 text-primary"
									>
										Đã chọn
									</Badge>
									<span className="font-medium">
										{selectedDoctor.name}
									</span>
								</div>
							</div>
						)}

						{/* Doctors listing */}
						<div className="space-y-3">
							<h3 className="text-sm font-medium text-muted-foreground">
								{searchTerm
									? `Kết quả tìm kiếm cho "${searchTerm}"`
									: "Danh sách bác sĩ"}
							</h3>

							{isLoading ? (
								// Loading state
								Array(3)
									.fill(0)
									.map((_, i) => (
										<div
											key={i}
											className="flex items-center space-x-4 p-3 border rounded-md"
										>
											<Skeleton className="h-12 w-12 rounded-full" />
											<div className="space-y-2 flex-1">
												<Skeleton className="h-4 w-3/4" />
												<Skeleton className="h-3 w-1/2" />
											</div>
										</div>
									))
							) : doctorsData?.content?.length === 0 ? (
								// Empty state
								<div className="text-center py-8">
									<div className="flex justify-center mb-3">
										<FiUser className="h-10 w-10 text-muted-foreground" />
									</div>
									<h3 className="font-medium">
										Không tìm thấy bác sĩ
									</h3>
									<p className="text-sm text-muted-foreground mt-1">
										Vui lòng thử tìm kiếm với từ khóa khác
									</p>
								</div>
							) : (
								// Results
								<>
									{doctorsData?.content?.map((doctor) => (
										<div
											key={doctor.id}
											className={`flex items-center p-3 border rounded-md cursor-pointer transition-colors ${
												watchedDoctorId === doctor.id
													? "border-primary bg-primary/5"
													: "hover:bg-muted/50"
											}`}
											onClick={() =>
												handleDoctorSelect(doctor)
											}
										>
											<Avatar className="h-12 w-12 mr-4 border">
												<AvatarImage
													src={
														"https://placewaifu.com/image/300"
													}
													alt={doctor.bio || ""}
												/>
												<AvatarFallback>
													BS
												</AvatarFallback>
											</Avatar>
											<div className="flex-1">
												<div className="flex items-center justify-between">
													<p className="font-medium text-base">
														BS.{" "}
														{doctor.bio ||
															`#${doctor.id}`}
													</p>
													{watchedDoctorId ===
														doctor.id && (
														<FiCheck className="h-5 w-5 text-primary" />
													)}
												</div>
												<div className="text-sm text-muted-foreground">
													{doctor.specialty && (
														<span className="inline-flex items-center mr-2">
															<FiHeart className="h-3 w-3 mr-1" />
															{doctor.specialty}
														</span>
													)}
													{doctor.medicalFacility && (
														<span>
															{
																doctor.medicalFacility
															}
														</span>
													)}
												</div>
											</div>
										</div>
									))}

									{/* Load more button */}
									{doctorsData?.page?.totalPages &&
										page <
											doctorsData?.page?.totalPages && (
											<div className="flex justify-center mt-4">
												<Button
													type="button"
													variant="outline"
													size="sm"
													onClick={handleLoadMore}
												>
													Xem thêm
												</Button>
											</div>
										)}
								</>
							)}
						</div>

						{/* Notes textarea */}
						<div className="space-y-2 mt-4">
							<label
								htmlFor="notes"
								className="text-sm font-medium"
							>
								Ghi chú (không bắt buộc)
							</label>
							<Controller
								name="notes"
								control={control}
								render={({ field }) => (
									<Textarea
										id="notes"
										placeholder="Thêm ghi chú về lý do chọn bác sĩ này..."
										className="resize-none"
										{...field}
									/>
								)}
							/>
							{errors.notes && (
								<p className="text-sm text-destructive">
									{errors.notes.message}
								</p>
							)}
						</div>
					</div>

					<SheetFooter className="sm:justify-between gap-3 flex-row">
						<Button
							type="button"
							variant="outline"
							className="flex-1"
							onClick={onClose}
						>
							Hủy
						</Button>
						<Button
							type="submit"
							className="flex-1"
							disabled={isSending || !watchedDoctorId}
						>
							{isSending ? (
								<>
									<FiLoader className="mr-2 h-4 w-4 animate-spin" />
									Đang gửi...
								</>
							) : (
								"Gửi yêu cầu"
							)}
						</Button>
					</SheetFooter>
				</form>
			</SheetContent>
		</Sheet>
	);
}
