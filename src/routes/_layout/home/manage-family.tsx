import { useGetManagedFamilies } from "@/queries/generated/family-controller/family-controller";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import { Eye, Trash2, Check, X, MoreVertical } from "lucide-react";
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
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FamilyDoctorDtoStatus } from "@/models/generated";
import {
	useAcceptRequest,
	useDeleteRequest,
	useRejectRequest,
} from "@/queries/generated/doctor-family-controller/doctor-family-controller";

export const Route = createFileRoute("/_layout/home/manage-family")({
	component: ManageFamilyPage,
});

function ManageFamilyPage() {
	const navigate = useNavigate();
	const [page, setPage] = useState(0);
	const [size, setSize] = useState(10);
	const [search, setSearch] = useState("");
	const [status, setStatus] = useState<FamilyDoctorDtoStatus | "">("");
	const [familyToDelete, setFamilyToDelete] = useState<number | null>(null);

	const { data, isLoading, refetch } = useGetManagedFamilies({
		page,
		size,
		sort: ["createdAt,desc"],
		status: status || undefined,
		// search,
	});

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearch(e.target.value);
	};

	const handleStatusChange = (value: FamilyDoctorDtoStatus) => {
		setStatus(value);
	};

	const handleViewFamily = (id: number) => {
		navigate({
			to: "/home/families/$familyId",
			params: { familyId: id.toString() },
		});
	};

	const handlePageChange = (newPage: number) => {
		setPage(newPage);
	};
	const rejectMutation = useRejectRequest();
	const acceptMutation = useAcceptRequest();
	const deleteMutation = useDeleteRequest();

	const handleAccept = async (id: number) => {
		await acceptMutation.mutateAsync({
			requestId: id,
		});
		refetch();
	};

	const handleReject = async (id: number) => {
		await rejectMutation.mutateAsync({
			requestId: id,
		});
		refetch();
	};

	const handleDelete = async () => {
		if (familyToDelete) {
			deleteMutation.mutateAsync({
				id: familyToDelete,
			});
			setFamilyToDelete(null);
			refetch();
		}
	};

	const totalPages = data?.page?.totalPages || 0;

	return (
		<div className="container mx-auto py-6 space-y-6 bg-white min-h-[80vh] px-4 rounded-xl shadow">
			<h1 className="text-2xl font-bold">Quản lý gia đình</h1>

			<div className="flex flex-wrap gap-4">
				<div className="flex-1 min-w-[200px]">
					<Input
						placeholder="Tìm kiếm gia đình..."
						value={search}
						onChange={handleSearchChange}
						className="w-full"
					/>
				</div>
				<Select value={status} onValueChange={handleStatusChange}>
					<SelectTrigger className="w-[180px]">
						<SelectValue placeholder="Trạng thái" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="PENDING">PENDING</SelectItem>
						<SelectItem value="ACCEPTED">ACCEPTED</SelectItem>
						<SelectItem value="REJECTED">REJECTED</SelectItem>
					</SelectContent>
				</Select>
			</div>

			{isLoading ? (
				<div className="flex justify-center py-8">Loading...</div>
			) : (
				<>
					<div className="rounded-md border">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>ID</TableHead>
									<TableHead>Gia đình</TableHead>
									<TableHead>Chủ hộ</TableHead>
									<TableHead>Liên hệ</TableHead>
									<TableHead>Trạng thái</TableHead>
									<TableHead className="text-right">
										Thao tác
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{data?.content?.length === 0 ? (
									<TableRow>
										<TableCell
											colSpan={6}
											className="text-center py-6"
										>
											Không có dữ liệu
										</TableCell>
									</TableRow>
								) : (
									data?.content?.map((family) => (
										<TableRow key={family.id}>
											<TableCell>{family.id}</TableCell>
											<TableCell>
												{family.family?.familyName ||
													"-"}
											</TableCell>
											<TableCell>
												{family.family?.owner
													?.fullName || "-"}
											</TableCell>
											<TableCell>
												{family.family?.phoneNumber ||
													"-"}
											</TableCell>

											<TableCell>
												<span
													className={`px-2 py-1 rounded-full text-xs font-medium ${
														family.status ===
														"ACCEPTED"
															? "bg-green-100 text-green-800"
															: family.status ===
																  "PENDING"
																? "bg-yellow-100 text-yellow-800"
																: "bg-red-100 text-red-800"
													}`}
												>
													{family.status}
												</span>
											</TableCell>
											<TableCell className="text-right">
												<DropdownMenu>
													<DropdownMenuTrigger
														asChild
													>
														<Button
															variant="ghost"
															size="icon"
														>
															<MoreVertical className="h-4 w-4" />
														</Button>
													</DropdownMenuTrigger>
													<DropdownMenuContent align="end">
														<DropdownMenuItem
															onClick={() =>
																handleViewFamily(
																	family.familyId!
																)
															}
														>
															<Eye className="mr-2 h-4 w-4" />
															<span>
																Xem chi tiết
															</span>
														</DropdownMenuItem>

														{family.status ===
															"PENDING" && (
															<>
																<DropdownMenuItem
																	onClick={() =>
																		handleAccept(
																			family.id!
																		)
																	}
																>
																	<Check className="mr-2 h-4 w-4 text-green-600" />
																	<span>
																		Chấp
																		nhận
																	</span>
																</DropdownMenuItem>
																<DropdownMenuItem
																	onClick={() =>
																		handleReject(
																			family.id!
																		)
																	}
																>
																	<X className="mr-2 h-4 w-4 text-red-600" />
																	<span>
																		Từ chối
																	</span>
																</DropdownMenuItem>
															</>
														)}

														{(family.status ===
															"ACCEPTED" ||
															family.status ===
																"REJECTED") && (
															<DropdownMenuItem
																onClick={() =>
																	setFamilyToDelete(
																		family.id!
																	)
																}
															>
																<Trash2 className="mr-2 h-4 w-4 text-red-600" />
																<span>Xóa</span>
															</DropdownMenuItem>
														)}
													</DropdownMenuContent>
												</DropdownMenu>
											</TableCell>
										</TableRow>
									))
								)}
							</TableBody>
						</Table>
					</div>

					{/* Confirmation Dialog for Delete */}
					<AlertDialog
						open={!!familyToDelete}
						onOpenChange={(open) =>
							!open && setFamilyToDelete(null)
						}
					>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>
									Xác nhận xóa
								</AlertDialogTitle>
								<AlertDialogDescription>
									Bạn có chắc chắn muốn xóa liên kết với gia
									đình này? Hành động này không thể hoàn tác.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>Hủy</AlertDialogCancel>
								<AlertDialogAction onClick={handleDelete}>
									Xóa
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>

					{/* Pagination */}
					{totalPages > 0 && (
						<Pagination className="mt-4">
							<PaginationContent>
								<PaginationItem>
									<PaginationPrevious
										onClick={() =>
											page > 0 &&
											handlePageChange(page - 1)
										}
										className={
											page === 0
												? "pointer-events-none opacity-50"
												: ""
										}
									/>
								</PaginationItem>

								{Array.from({
									length: Math.min(5, totalPages),
								}).map((_, i) => {
									const pageToShow = i;
									const isCurrentPage = pageToShow === page;

									return (
										<PaginationItem key={i}>
											<PaginationLink
												onClick={() =>
													handlePageChange(pageToShow)
												}
												isActive={isCurrentPage}
											>
												{pageToShow + 1}
											</PaginationLink>
										</PaginationItem>
									);
								})}

								<PaginationItem>
									<PaginationNext
										onClick={() =>
											page < totalPages - 1 &&
											handlePageChange(page + 1)
										}
										className={
											page >= totalPages - 1
												? "pointer-events-none opacity-50"
												: ""
										}
									/>
								</PaginationItem>
							</PaginationContent>
						</Pagination>
					)}
				</>
			)}
		</div>
	);
}
