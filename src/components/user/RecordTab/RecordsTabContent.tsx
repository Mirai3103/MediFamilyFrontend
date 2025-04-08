// src/components/medical/tabs/RecordsTabContent.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, Plus, Search, X } from "lucide-react";
import MedicalRecordCard from "@/components/medical/MedicalRecordCard";
import { MedicalRecordDto } from "@/models/generated/medicalRecordDto";
import { FamilyMemberDTO } from "@/models/generated";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";
import RecordForm from "./forms/RecordForm";
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
import { Link } from "@tanstack/react-router";

// Define the form schema with Zod

interface RecordsTabContentProps {
	memberRecords: MedicalRecordDto[];
	memberData: FamilyMemberDTO;
}

export function RecordsTabContent({
	memberRecords: initialRecords,
	memberData,
}: RecordsTabContentProps) {
	const [searchTerm, setSearchTerm] = useState("");
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
	const [type, setType] = useState<"add" | "edit">("add");

	// React Hook Form setup with Zod validation

	// Filter records based on search term
	const filteredRecords = searchTerm
		? initialRecords.filter(
				(record) =>
					record.title
						?.toLowerCase()
						.includes(searchTerm.toLowerCase()) ||
					record.medicalFacility
						?.toLowerCase()
						.includes(searchTerm.toLowerCase()) ||
					record.doctorName
						?.toLowerCase()
						.includes(searchTerm.toLowerCase()) ||
					record.diagnosis
						?.toLowerCase()
						.includes(searchTerm.toLowerCase())
			)
		: initialRecords;

	return (
		<div className="space-y-4">
			<div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
				<div className="relative w-full sm:w-auto sm:flex-grow max-w-sm">
					<Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
					<Input
						type="search"
						placeholder="Tìm kiếm hồ sơ khám bằng tên bác sĩ, cơ sở khám, hoặc triệu chứng,..."
						className="pl-8 w-full"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
				</div>
				<AlertDialog
					open={isAlertDialogOpen}
					onOpenChange={setIsAlertDialogOpen}
				>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>
								Bạn đã thêm hồ sơ khám này thành công
							</AlertDialogTitle>
							<AlertDialogDescription>
								Bạn có muốn kê đơn thuốc cho hồ sơ này không?
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>Không</AlertDialogCancel>
							<AlertDialogAction asChild>
								<Link
									to="/home/records/$id/prescription"
									params={{ id: "123" }}
								>
									Có
								</Link>
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
				<Drawer
					open={isDrawerOpen}
					onOpenChange={setIsDrawerOpen}
					direction="right"
				>
					<DrawerTrigger asChild>
						<Button className="flex-shrink-0 ">
							<Plus className="mr-2 h-4 w-4" />
							Thêm hồ sơ khám
						</Button>
					</DrawerTrigger>
					<DrawerContent className="!max-w-3xl ">
						<div className="mx-auto w-full max-w-3xl">
							<DrawerHeader>
								<div className="flex justify-between items-center">
									<div>
										<DrawerTitle className="text-2xl font-bold text-gray-800">
											Thêm hồ sơ khám mới
										</DrawerTitle>
										<DrawerDescription className="text-gray-500">
											Hồ sơ khám cho{" "}
											{memberData.profile?.fullName ||
												"bệnh nhân"}
										</DrawerDescription>
									</div>
									<DrawerClose asChild>
										<Button variant="ghost" size="icon">
											<X className="h-5 w-5" />
										</Button>
									</DrawerClose>
								</div>
							</DrawerHeader>

							<div className="px-4 py-2">
								<RecordForm
									type={type}
									onDone={(isSuccess) => {
										setIsDrawerOpen(false);
										if (isSuccess && type === "add") {
											setIsAlertDialogOpen(true);
										}
									}}
									profileId={
										memberData.profile?.id ||
										memberData.profileId
									}
								/>
							</div>
						</div>
					</DrawerContent>
				</Drawer>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{filteredRecords.length > 0 ? (
					filteredRecords.map((record) => (
						<MedicalRecordCard key={record.id} record={record} />
					))
				) : (
					<div className="col-span-1 md:col-span-2 text-center py-10 bg-white rounded-lg border">
						<FileText className="h-12 w-12 mx-auto text-gray-300 mb-3" />
						<h3 className="text-lg font-medium text-gray-600">
							No medical records found{" "}
							{searchTerm && "matching your search"}
						</h3>
						<p className="text-sm text-gray-500">
							{searchTerm
								? "Try a different search term or "
								: ""}
							Add a new record for {memberData.profile?.fullName}
						</p>
						<Button
							className="mt-4 "
							onClick={() => setIsDrawerOpen(true)}
						>
							<Plus className="mr-2 h-4 w-4" />
							Thêm hồ sơ khám
						</Button>
					</div>
				)}
			</div>
		</div>
	);
}
