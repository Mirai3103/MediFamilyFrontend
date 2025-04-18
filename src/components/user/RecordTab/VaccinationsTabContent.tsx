import { useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
	Table,
	TableHeader,
	TableBody,
	TableHead,
	TableRow,
	TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";

import {
	Plus,
	Syringe,
	Search,
	Edit,
	ArrowUpDown,
	ArrowUp,
	ArrowDown,
	Trash2,
} from "lucide-react";
import {
	useDeleteVaccination,
	useSearchVaccinations,
} from "@/queries/generated/vaccinations-controller/vaccinations-controller";
import dayjs from "dayjs";
import { Badge } from "@/components/ui/badge";
import { CalendarDatePicker } from "@/components/calendar-date-picker";
import { toast } from "sonner";
import { VaccinationFormDialog } from "@/components/vaccinations/vaccination-form-dialog";
import { ConfirmationDialog } from "@/components/vaccinations/vaccination-confirmation-dialog";

interface VaccinationsTabContentProps {
	profileId: number;
}

export function VaccinationsTabContent({
	profileId,
}: VaccinationsTabContentProps) {
	// State for search and filters
	const [keyword, setKeyword] = useState("");
	const [fromDate, setFromDate] = useState<Date | undefined>(undefined);
	const [toDate, setToDate] = useState<Date | undefined>(undefined);
	const [sortBy, setSortBy] = useState("vaccinationDate");
	const [sortDirection, setSortDirection] = useState<"ASC" | "DESC">("DESC");
	const [currentPage, setCurrentPage] = useState(0);
	const pageSize = 20;
	const [formDialogOpen, setFormDialogOpen] = useState(false);
	const [selectedVaccination, setSelectedVaccination] = useState<any | null>(
		null
	);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [vaccinationToDelete, setVaccinationToDelete] = useState<any | null>(
		null
	);
	const deleteMutation = useDeleteVaccination();
	// Apply filters state
	const [appliedFilters, setAppliedFilters] = useState({
		keyword: "",
		fromDate: undefined as Date | undefined,
		toDate: undefined as Date | undefined,
		sortBy: "vaccinationDate",
		sortDirection: "DESC" as "ASC" | "DESC",
	});
	const handleAddVaccination = () => {
		setSelectedVaccination(null);
		setFormDialogOpen(true);
	};

	const handleEditVaccination = (vaccination: any) => {
		setSelectedVaccination(vaccination);
		setFormDialogOpen(true);
	};

	const handleOpenDeleteDialog = (vaccination: any) => {
		setVaccinationToDelete(vaccination);
		setDeleteDialogOpen(true);
	};

	const handleDeleteVaccination = async () => {
		if (!vaccinationToDelete) return;

		try {
			await deleteMutation.mutateAsync({ id: vaccinationToDelete.id });
			toast("Vắcxin đã được xóa thành công");
			refetch();
		} catch (error) {
			toast.error("Xóa vắc xin không thành công", {
				description: "Vui lòng thử lại sau.",
			});
		} finally {
			setDeleteDialogOpen(false);
			setVaccinationToDelete(null);
		}
	};
	const handleFormSuccess = () => {
		refetch();
		toast(
			selectedVaccination
				? "Cập nhật vắc xin thành công"
				: "Thêm vắc xin thành công"
		);
	};

	const { data, isLoading, refetch } = useSearchVaccinations(
		{
			profileId,
			fromDate: appliedFilters.fromDate
				? dayjs(appliedFilters.fromDate)
						.startOf("day")
						.toISOString()
						.replace("Z", "")
				: undefined,
			toDate: appliedFilters.toDate
				? dayjs(appliedFilters.toDate)
						.endOf("day")
						.toISOString()
						.replace("Z", "")
				: undefined,
			keyword: appliedFilters.keyword,
			sortBy: appliedFilters.sortBy,
			sortDirection: appliedFilters.sortDirection,
			page: currentPage,
			size: pageSize,
		},
		{
			query: {
				enabled: !!profileId,
			},
		}
	);

	const memberVaccinations = data?.content || [];
	const totalPages = data?.page?.totalPages || 0;

	const handleApplyFilters = () => {
		setAppliedFilters({
			keyword,
			fromDate,
			toDate,
			sortBy,
			sortDirection,
		});
		setCurrentPage(0);
		refetch();
	};

	const clearFilters = () => {
		setKeyword("");
		setFromDate(undefined);
		setToDate(undefined);
		setSortBy("vaccinationDate");
		setSortDirection("DESC");
		setCurrentPage(0);

		// Also update applied filters and trigger refetch
		setAppliedFilters({
			keyword: "",
			fromDate: undefined,
			toDate: undefined,
			sortBy: "vaccinationDate",
			sortDirection: "DESC",
		});
		refetch();
	};

	const handleSortByHeader = useCallback(
		(column: string) => {
			if (appliedFilters.sortBy === column) {
				// Toggle sort direction if already sorting by this column
				const newDirection =
					appliedFilters.sortDirection === "ASC" ? "DESC" : "ASC";
				setAppliedFilters((prev) => ({
					...prev,
					sortDirection: newDirection,
				}));
				setSortDirection(newDirection);
			} else {
				// Set new sort column with default DESC direction
				setAppliedFilters((prev) => ({
					...prev,
					sortBy: column,
					sortDirection: "DESC",
				}));
				setSortBy(column);
				setSortDirection("DESC");
			}
			refetch();
		},
		[appliedFilters.sortBy, appliedFilters.sortDirection, refetch]
	);

	const renderSortIcon = (column: string) => {
		if (appliedFilters.sortBy !== column) {
			return <ArrowUpDown className="ml-1 h-4 w-4" />;
		}
		return appliedFilters.sortDirection === "ASC" ? (
			<ArrowUp className="ml-1 h-4 w-4" />
		) : (
			<ArrowDown className="ml-1 h-4 w-4" />
		);
	};

	return (
		<div className="space-y-4">
			{/* Search and Filter Section */}
			<Card>
				<CardContent className="pt-6">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
						<div>
							<div className="relative">
								<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
								<Input
									placeholder="Tìm kiếm theo tên vắc xin, địa điểm,..."
									value={keyword}
									onChange={(e) => setKeyword(e.target.value)}
									className="pl-8"
								/>
							</div>
						</div>
						<div className="flex justify-end gap-2">
							<CalendarDatePicker
								date={{
									from: fromDate,
									to: toDate,
								}}
								onDateSelect={({ from, to }) => {
									setFromDate(from);
									setToDate(to);
								}}
								className=""
								id="date-range-from"
								placeholder="Khoảng thời gian"
							/>
						</div>
					</div>
					<div className="flex justify-end gap-2">
						<Button variant="outline" onClick={clearFilters}>
							Xóa bộ lọc
						</Button>
						<Button onClick={handleApplyFilters}>
							Áp dụng bộ lọc
						</Button>
					</div>
				</CardContent>
			</Card>

			{/* Action Button */}
			<div className="flex justify-end mb-4">
				<Button onClick={handleAddVaccination}>
					<Plus className="mr-2 h-4 w-4" />
					Tạo lịch tiêm
				</Button>
			</div>

			{/* Data Display */}
			<Card>
				<CardContent className="pt-6">
					{isLoading ? (
						<div className="text-center py-10">
							Loading vaccination records...
						</div>
					) : memberVaccinations.length > 0 ? (
						<>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>#Id</TableHead>
										<TableHead
											className="cursor-pointer"
											onClick={() =>
												handleSortByHeader(
													"vaccineName"
												)
											}
										>
											<div className="flex items-center">
												Tên vắc xin
												{renderSortIcon("vaccineName")}
											</div>
										</TableHead>
										<TableHead>Địa điểm</TableHead>
										<TableHead
											className="cursor-pointer"
											onClick={() =>
												handleSortByHeader(
													"vaccinationDate"
												)
											}
										>
											<div className="flex items-center">
												Ngày tiêm
												{renderSortIcon(
													"vaccinationDate"
												)}
											</div>
										</TableHead>
										<TableHead>Trạng thái</TableHead>
										<TableHead>Hành động</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{memberVaccinations.map((vaccination) => (
										<TableRow key={vaccination.id}>
											<TableCell className="font-medium">
												{vaccination.id}
											</TableCell>
											<TableCell className="font-medium">
												{vaccination.vaccineName}
											</TableCell>
											<TableCell className="truncate">
												{vaccination.location}
											</TableCell>
											<TableCell>
												{dayjs(
													vaccination.vaccinationDate
												).format("DD/MM/YYYY HH:mm")}
											</TableCell>
											<TableCell>
												<VaccinationStatusCell
													date={
														vaccination.vaccinationDate!
													}
													done={vaccination.done!}
												/>
											</TableCell>
											<TableCell>
												<div className="flex space-x-2">
													<Button
														variant="ghost"
														size="sm"
														onClick={() =>
															handleEditVaccination(
																vaccination
															)
														}
													>
														<Edit className="h-4 w-4 text-yellow-500" />
													</Button>
													<Button
														variant="ghost"
														size="sm"
														onClick={() =>
															handleOpenDeleteDialog(
																vaccination
															)
														}
													>
														<Trash2 className="h-4 w-4 text-red-500" />
													</Button>
												</div>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>

							{/* Pagination */}
							{totalPages > 1 && (
								<div className="mt-4 flex justify-center">
									<Pagination>
										<PaginationContent>
											<PaginationItem>
												<PaginationPrevious
													onClick={() =>
														setCurrentPage((prev) =>
															Math.max(
																0,
																prev - 1
															)
														)
													}
												/>
											</PaginationItem>

											{/* Render visible page numbers */}
											{Array.from({
												length: Math.min(5, totalPages),
											}).map((_, i) => {
												let pageNumber;

												// Calculate which page numbers to show
												if (totalPages <= 5) {
													pageNumber = i;
												} else if (currentPage < 3) {
													pageNumber = i;
												} else if (
													currentPage >
													totalPages - 4
												) {
													pageNumber =
														totalPages - 5 + i;
												} else {
													pageNumber =
														currentPage - 2 + i;
												}

												return (
													<PaginationItem
														key={pageNumber}
													>
														<Button
															variant={
																currentPage ===
																pageNumber
																	? "default"
																	: "outline"
															}
															size="sm"
															onClick={() =>
																setCurrentPage(
																	pageNumber
																)
															}
														>
															{pageNumber + 1}
														</Button>
													</PaginationItem>
												);
											})}

											<PaginationItem>
												<PaginationNext
													onClick={() =>
														setCurrentPage((prev) =>
															Math.min(
																totalPages - 1,
																prev + 1
															)
														)
													}
												/>
											</PaginationItem>
										</PaginationContent>
									</Pagination>
								</div>
							)}
						</>
					) : (
						<div className="text-center py-10">
							<Syringe className="h-12 w-12 mx-auto text-gray-300 mb-3" />
							<h3 className="text-lg font-medium text-gray-600">
								Không tìm thấy lịch tiêm nào
							</h3>
							<p className="text-sm text-gray-500">
								Vui lòng thêm lịch tiêm mới để theo dõi sức khoẻ
								của bạn.
							</p>
							<Button
								className="mt-4"
								onClick={handleAddVaccination}
							>
								<Plus className="mr-2 h-4 w-4" />
								Tạo lịch tiêm
							</Button>
						</div>
					)}
				</CardContent>
			</Card>
			{/* Form Dialog */}
			{formDialogOpen && (
				<VaccinationFormDialog
					isOpen={formDialogOpen}
					onClose={() => setFormDialogOpen(false)}
					vaccination={selectedVaccination}
					profileId={profileId}
					onSuccess={handleFormSuccess}
				/>
			)}

			{/* Delete Confirmation Dialog */}
			{deleteDialogOpen && vaccinationToDelete && (
				<ConfirmationDialog
					isOpen={deleteDialogOpen}
					onClose={() => setDeleteDialogOpen(false)}
					onConfirm={handleDeleteVaccination}
					title="Xác nhận xoá lịch tiêm"
					description={`Bạn có chắc chắn muốn xóa lịch tiêm ${vaccinationToDelete.vaccineName} không?`}
					isLoading={deleteMutation.isPending}
				/>
			)}
		</div>
	);
}

const VaccinationStatusCell: React.FC<{
	date: string;
	done: boolean;
}> = ({ date, done }) => {
	const isOverdue = dayjs(date).isBefore(dayjs()) && !done;

	if (done) {
		return <Badge variant="default">Đã tiêm</Badge>;
	}

	if (isOverdue) {
		return <Badge variant="destructive">Trễ hạn tiêm</Badge>;
	}

	return <Badge variant="secondary">Chưa tiêm</Badge>;
};
