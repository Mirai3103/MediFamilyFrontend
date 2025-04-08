// src/components/medical/RecordTabContainer.tsx
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input"; // Search moved to RecordsTabContent
import { Link } from "@tanstack/react-router"; // Assuming you use TanStack Router
import { FileText, Pill, Clipboard, HeartPulse, Syringe } from "lucide-react";

// Import the new tab content components
import { OverviewTabContent } from "./OverviewTabContent";
import { RecordsTabContent } from "./RecordsTabContent";
import { MedicationsTabContent } from "./MedicationsTabContent";
import { VaccinationsTabContent } from "./VaccinationsTabContent";
import { VitalsTabContent } from "./VitalsTabContent";

// Import data and types
import {
	medicalRecordsData,
	type FamilyData,
	type Member,
} from "./sampleMedicalData";
import { faker } from "@faker-js/faker/locale/vi";
import { MedicalRecordDto } from "@/models/generated/medicalRecordDto";

// --- Helper function to get data (Replace with actual data fetching/prop passing) ---
// In a real app, familyId and memberId would likely come from URL params or props
const getCurrentMemberData = (
	familyId: number,
	memberId: number
): { familyData: FamilyData | null; memberData: Member | null } => {
	const familyData =
		medicalRecordsData[familyId as keyof typeof medicalRecordsData] || null;
	if (!familyData) {
		return { familyData: null, memberData: null };
	}
	const memberData =
		familyData.members.find((m) => m.id === memberId) || null;
	return { familyData, memberData };
};
// --- End Helper ---
const medicalRecordTypes = [
	"check-up",
	"vaccination",
	"dental",
	"emergency",
	"surgery",
	"physical",
];

const generateFakeMedicalRecords = (count: number): MedicalRecordDto[] => {
	const records: MedicalRecordDto[] = [];

	for (let i = 0; i < count; i++) {
		const recordType = faker.helpers.arrayElement(medicalRecordTypes);
		const isFollowup = faker.datatype.boolean();

		const record: MedicalRecordDto = {
			id: faker.number.int({ min: 1, max: 1000 }),
			title: `Visit for ${recordType}`,
			profileId: faker.number.int({ min: 1, max: 10 }),
			visitDate: faker.date.past().toISOString(),
			medicalFacility: faker.company.name() + " Medical Center",
			doctorName: `Dr. ${faker.person.lastName()}`,
			diagnosis: faker.lorem.words({ min: 3, max: 8 }),
			treatment: faker.lorem.paragraph(),
			type: recordType,
			notes: faker.lorem.sentences({ min: 1, max: 3 }),
			isFollowup: isFollowup,
			followupDate: isFollowup
				? faker.date.future().toISOString()
				: undefined,
			createdAt: faker.date.past().toISOString(),
			updatedAt: faker.date.recent().toISOString(),
		} as MedicalRecordDto;

		records.push(record);
	}

	return records;
};

const memberRecords: MedicalRecordDto[] = generateFakeMedicalRecords(10);
// Renamed from RecordTab for clarity
export function RecordTabContainer() {
	// Simulating getting IDs (replace with actual mechanism)
	const familyId = 1;
	const memberId = 101;

	const [activeTab, setActiveTab] = useState("overview");
	// const [searchTerm, setSearchTerm] = useState(""); // Search state moved to RecordsTabContent

	// Get family and member data
	const { familyData, memberData } = getCurrentMemberData(familyId, memberId);

	// --- Loading / Not Found States ---
	if (!familyData) {
		return (
			<div className="min-h-screen flex flex-col items-center justify-center p-4">
				<h2 className="text-2xl mb-4 text-center">
					Family Record Not Found
				</h2>
				<p className="text-gray-600 mb-6 text-center">
					Could not load data for the specified family.
				</p>
				<Button asChild variant="outline">
					<Link to="/families">Return to Families List</Link>
				</Button>
			</div>
		);
	}

	if (!memberData) {
		return (
			<div className="min-h-screen flex flex-col items-center justify-center p-4">
				<h2 className="text-2xl mb-4 text-center">
					Family Member Not Found
				</h2>
				<p className="text-gray-600 mb-6 text-center">
					Could not find the specified member within the family
					record.
				</p>
				<Button asChild variant="outline">
					{/* Adjust link as needed */}
					<Link to={`/families/${familyId}`}>Return to Family</Link>
				</Button>
			</div>
		);
	}
	// --- End Loading / Not Found States ---

	// --- Filter Data for the selected member ---

	const memberMedications = familyData.medications.filter(
		(med) =>
			med.forMember === memberData.name || med.forMember === "All members"
	);

	const memberAppointments = familyData.appointments.filter(
		(appointment) => appointment.forMember === memberData.name
	);

	const memberVaccinations = familyData.vaccinations.filter(
		(vaccination) => vaccination.forMember === memberData.name
	);

	const memberVitalsData = familyData.vitals.find(
		(v) => v.memberId === memberId
	);
	const memberVitals = memberVitalsData ? memberVitalsData.readings : [];
	// --- End Data Filtering ---

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
					<OverviewTabContent
						memberRecords={memberRecords}
						memberMedications={memberMedications}
						memberAppointments={memberAppointments}
						memberVitals={memberVitals}
						setActiveTab={setActiveTab}
					/>
				</TabsContent>

				<TabsContent value="records">
					<RecordsTabContent
						memberRecords={memberRecords}
						memberData={memberData}
					/>
				</TabsContent>

				<TabsContent value="medications">
					<MedicationsTabContent
						memberMedications={memberMedications}
					/>
				</TabsContent>

				<TabsContent value="vaccinations">
					<VaccinationsTabContent
						memberVaccinations={memberVaccinations}
					/>
				</TabsContent>

				<TabsContent value="vitals">
					<VitalsTabContent
						memberVitals={memberVitals}
						memberData={memberData}
					/>
				</TabsContent>
			</Tabs>
		</div>
	);
}

// Make sure to export the main container
export default RecordTabContainer;
