import { useState } from "react";
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
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from "@/components/ui/select";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";

import { Plus, Syringe, Search } from "lucide-react";
import { format } from "date-fns";
import { useSearchVaccinations } from "@/queries/generated/vaccinations-controller/vaccinations-controller";

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

	const { data, isLoading, refetch } = useSearchVaccinations(
		{
			filter: {
				profileId,
				fromDate: fromDate ? format(fromDate, "yyyy-MM-dd") : undefined,
				toDate: toDate ? format(toDate, "yyyy-MM-dd") : undefined,
				keyword,
				sortBy,
				sortDirection,
			},
			pageable: {
				page: currentPage,
				size: pageSize,
			},
		},
		{
			query: {
				enabled: !!profileId,
			},
		}
	);

	const memberVaccinations = data?.content || [];
	const totalPages = data?.totalPages || 0;

	const handleAddVaccination = () => {
		// Implement modal opening or navigation to add vaccination form
		console.log("Add vaccination clicked");
	};

	const handleSearch = () => {
		refetch();
	};

	const clearFilters = () => {
		setKeyword("");
		setFromDate(undefined);
		setToDate(undefined);
		setSortBy("vaccinationDate");
		setSortDirection("DESC");
		setCurrentPage(0);
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
									placeholder="Search vaccinations..."
									value={keyword}
									onChange={(e) => setKeyword(e.target.value)}
									className="pl-8"
								/>
							</div>
						</div>
						<div className="flex gap-2">
							{/* <DatePicker
								placeholder="From date"
								date={fromDate}
								onDateChange={setFromDate}
								className="flex-1"
							/>
							<DatePicker
								placeholder="To date"
								date={toDate}
								onDateChange={setToDate}
								className="flex-1"
							/> */}
						</div>
						<div className="flex gap-2">
							<Select value={sortBy} onValueChange={setSortBy}>
								<SelectTrigger>
									<SelectValue placeholder="Sort by" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="vaccinationDate">
										Date
									</SelectItem>
									<SelectItem value="vaccineName">
										Vaccine Name
									</SelectItem>
								</SelectContent>
							</Select>
							<Select
								value={sortDirection}
								onValueChange={(value: "ASC" | "DESC") =>
									setSortDirection(value)
								}
							>
								<SelectTrigger>
									<SelectValue placeholder="Order" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="ASC">
										Ascending
									</SelectItem>
									<SelectItem value="DESC">
										Descending
									</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
					<div className="flex justify-between">
						<Button variant="outline" onClick={clearFilters}>
							Clear Filters
						</Button>
						<Button onClick={handleSearch}>Apply Filters</Button>
					</div>
				</CardContent>
			</Card>

			{/* Action Button */}
			<div className="flex justify-end mb-4">
				<Button onClick={handleAddVaccination}>
					<Plus className="mr-2 h-4 w-4" />
					Add Vaccination
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
										<TableHead>Vaccination</TableHead>
										<TableHead>Date Administered</TableHead>
										<TableHead>Status</TableHead>
										<TableHead>Actions</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{memberVaccinations.map((vaccination) => (
										<TableRow key={vaccination.id}>
											<TableCell className="font-medium">
												{vaccination.vaccineName}
											</TableCell>
											<TableCell>
												{vaccination.vaccinationDate}
											</TableCell>
											<TableCell></TableCell>
											<TableCell>
												<Button
													variant="ghost"
													size="sm"
												>
													Edit
												</Button>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>

							{/* Pagination */}
							{totalPages > 1 && (
								<div className="mt-4">
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
													// disabled={currentPage === 0}
												/>
											</PaginationItem>
											{Array.from({
												length: totalPages,
											}).map((_, i) => (
												<PaginationItem key={i}>
													<Button
														variant={
															currentPage === i
																? "default"
																: "outline"
														}
														size="sm"
														onClick={() =>
															setCurrentPage(i)
														}
													>
														{i + 1}
													</Button>
												</PaginationItem>
											))}
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
													// disabled={
													// 	currentPage ===
													// 	totalPages - 1
													// }
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
								No vaccinations found
							</h3>
							<p className="text-sm text-gray-500">
								Add vaccination records
							</p>
							<Button
								className="mt-4"
								onClick={handleAddVaccination}
							>
								<Plus className="mr-2 h-4 w-4" />
								Add Vaccination
							</Button>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
