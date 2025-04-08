// src/components/medical/tabs/RecordsTabContent.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, Plus, Search } from "lucide-react";
import MedicalRecordCard from "@/components/medical/MedicalRecordCard"; // Assuming this exists
import type { Member } from "./sampleMedicalData";
import { MedicalRecordDto } from "@/models/generated/medicalRecordDto";

interface RecordsTabContentProps {
	memberRecords: MedicalRecordDto[];
	memberData: Member;
}

export function RecordsTabContent({
	memberRecords: initialRecords,
	memberData,
}: RecordsTabContentProps) {
	const [searchTerm, setSearchTerm] = useState("");

	// Filter records based on search term
	const filteredRecords = initialRecords;

	return (
		<div className="space-y-4">
			<div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
				<div className="relative w-full sm:w-auto sm:flex-grow max-w-sm">
					<Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
					<Input
						type="search"
						placeholder="Search records by title, type, doctor..."
						className="pl-8 w-full"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
				</div>
				<Button className="flex-shrink-0">
					<Plus className="mr-2 h-4 w-4" />
					Add Record {/* Add onClick handler */}
				</Button>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{filteredRecords.length > 0 ? (
					filteredRecords.map((record) => (
						<MedicalRecordCard
							key={record.id}
							record={record}
							// Pass member name or 'Family' based on record.memberId
							memberName={
								record.profileId === null
									? `${memberData.relation === "Father" || memberData.relation === "Mother" ? "Family" : memberData.name}`
									: memberData.name
							}
						/>
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
							Add a new record for {memberData.name}.
						</p>
						<Button className="mt-4 bg-health-blue hover:bg-health-blue/90">
							<Plus className="mr-2 h-4 w-4" />
							Add New Record {/* Add onClick handler */}
						</Button>
					</div>
				)}
			</div>
		</div>
	);
}
