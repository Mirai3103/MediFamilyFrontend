// src/components/medical/RecordTabContainer.tsx
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Input } from "@/components/ui/input"; // Search moved to RecordsTabContent
import { Clipboard, Syringe } from "lucide-react";

// Import the new tab content components
import { RecordsTabContent } from "./RecordsTabContent";

import { ProfileDTO } from "@/models/generated";
import { useGetAllMedicalRecords } from "@/queries/generated/medical-record-controller/medical-record-controller";
import { VaccinationsTabContent } from "./VaccinationsTabContent";

interface RecordTabContainerProps {
	profile: ProfileDTO;
	canRead?: boolean;
	canUpdate?: boolean;
}

export function RecordTabContainer({
	profile,
	canRead = true,
	canUpdate = true,
}: RecordTabContainerProps) {
	const { data: records = [] } = useGetAllMedicalRecords(profile?.id!, {
		query: {
			enabled: !!profile?.id,
		},
	});

	const [activeTab, setActiveTab] = useState("records");
	if (!canRead)
		return (
			<div className="text-center text-muted-foreground">
				Không có quyền truy cập vào lịch sử khám bệnh này
			</div>
		);
	return (
		<div className="flex-grow p-4 md:p-6 lg:p-8 bg-white rounded-2xl shadow-sm">
			<Tabs
				value={activeTab}
				onValueChange={setActiveTab}
				className="space-y-4"
			>
				<div className="overflow-x-auto pb-2">
					<TabsList className="bg-gray-100 border border-gray-200">
						{/* <TabsTrigger
							value="overview"
							className="data-[state=active]:bg-white data-[state=active]:text-health-blue data-[state=active]:shadow-sm"
						>
							<FileText className="mr-1.5 h-4 w-4" />
							Overview
						</TabsTrigger> */}
						<TabsTrigger
							value="records"
							className="data-[state=active]:bg-white data-[state=active]:text-health-blue data-[state=active]:shadow-sm"
						>
							<Clipboard className="mr-1.5 h-4 w-4" />
							Records
						</TabsTrigger>
						{/* <TabsTrigger
							value="medications"
							className="data-[state=active]:bg-white data-[state=active]:text-health-blue data-[state=active]:shadow-sm"
						>
							<Pill className="mr-1.5 h-4 w-4" />
							Medications
						</TabsTrigger> */}
						<TabsTrigger
							value="vaccinations"
							className="data-[state=active]:bg-white data-[state=active]:text-health-blue data-[state=active]:shadow-sm"
						>
							<Syringe className="mr-1.5 h-4 w-4" />
							Vaccinations
						</TabsTrigger>
						{/* <TabsTrigger
							value="vitals"
							className="data-[state=active]:bg-white data-[state=active]:text-health-blue data-[state=active]:shadow-sm"
						>
							<HeartPulse className="mr-1.5 h-4 w-4" />
							Vitals
						</TabsTrigger> */}
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
						profile={profile!}
					/>
				</TabsContent>

				<TabsContent value="medications">
					{/* <MedicationsTabContent
						memberMedications={memberMedications}
					/> */}
				</TabsContent>

				<TabsContent value="vaccinations">
					<VaccinationsTabContent profileId={profile?.id!} />
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
