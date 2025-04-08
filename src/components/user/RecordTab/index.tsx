// src/components/medical/RecordTabContainer.tsx
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Input } from "@/components/ui/input"; // Search moved to RecordsTabContent
import { FileText, Pill, Clipboard, HeartPulse, Syringe } from "lucide-react";

// Import the new tab content components
import { RecordsTabContent } from "./RecordsTabContent";

import { FamilyMemberDTO } from "@/models/generated";
import { useGetAllMedicalRecords } from "@/queries/generated/medical-record-controller/medical-record-controller";

interface RecordTabContainerProps {
	member: FamilyMemberDTO;
}

// Renamed from RecordTab for clarity
export function RecordTabContainer({ member }: RecordTabContainerProps) {
	// Simulating getting IDs (replace with actual mechanism)
	const { data: records = [] } = useGetAllMedicalRecords(
		member?.profile?.id!,
		{
			query: {
				enabled: !!member?.profile?.id,
			},
		}
	);
	const familyId = 1;
	const memberId = 101;

	const [activeTab, setActiveTab] = useState("overview");

	return (
		// Use a neutral background for the container, let tabs/cards handle specific bg
		<div className="flex-grow p-4 md:p-6 lg:p-8 bg-white rounded-2xl shadow-sm">
			<Tabs
				value={activeTab}
				onValueChange={setActiveTab}
				className="space-y-4"
			>
				{/* Consider styling the TabsList wrapper if needed */}
				<div className="overflow-x-auto pb-2">
					<TabsList className="bg-gray-100 border border-gray-200">
						<TabsTrigger
							value="overview"
							className="data-[state=active]:bg-white data-[state=active]:text-health-blue data-[state=active]:shadow-sm"
						>
							<FileText className="mr-1.5 h-4 w-4" />
							Overview
						</TabsTrigger>
						<TabsTrigger
							value="records"
							className="data-[state=active]:bg-white data-[state=active]:text-health-blue data-[state=active]:shadow-sm"
						>
							<Clipboard className="mr-1.5 h-4 w-4" />
							Records
						</TabsTrigger>
						<TabsTrigger
							value="medications"
							className="data-[state=active]:bg-white data-[state=active]:text-health-blue data-[state=active]:shadow-sm"
						>
							<Pill className="mr-1.5 h-4 w-4" />
							Medications
						</TabsTrigger>
						<TabsTrigger
							value="vaccinations"
							className="data-[state=active]:bg-white data-[state=active]:text-health-blue data-[state=active]:shadow-sm"
						>
							<Syringe className="mr-1.5 h-4 w-4" />
							Vaccinations
						</TabsTrigger>
						<TabsTrigger
							value="vitals"
							className="data-[state=active]:bg-white data-[state=active]:text-health-blue data-[state=active]:shadow-sm"
						>
							<HeartPulse className="mr-1.5 h-4 w-4" />
							Vitals
						</TabsTrigger>
						{/* Add other tabs like Appointments if needed */}
					</TabsList>
				</div>

				{/* Render Tab Content Components */}
				<TabsContent value="overview">
					{/* <OverviewTabContent
						memberRecords={records!}
						memberMedications={memberMedications}
						memberAppointments={memberAppointments}
						memberVitals={memberVitals}
						setActiveTab={setActiveTab}
					/> */}
				</TabsContent>

				<TabsContent value="records">
					<RecordsTabContent
						memberRecords={records}
						memberData={member}
					/>
				</TabsContent>

				<TabsContent value="medications">
					{/* <MedicationsTabContent
						memberMedications={memberMedications}
					/> */}
				</TabsContent>

				<TabsContent value="vaccinations">
					{/* <VaccinationsTabContent
						memberVaccinations={memberVaccinations}
					/> */}
				</TabsContent>

				<TabsContent value="vitals">
					{/* <VitalsTabContent
						memberVitals={memberVitals}
						memberData={memberData}
					/> */}
				</TabsContent>
			</Tabs>
		</div>
	);
}

// Make sure to export the main container
export default RecordTabContainer;
