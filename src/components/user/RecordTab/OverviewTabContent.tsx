import type {
	Medication,
	Appointment,
	VitalReading,
} from "./sampleMedicalData";
import { RecentRecordsCard } from "./overview/RecentRecordsCard";
import { CurrentMedicationsCard } from "./overview/CurrentMedicationsCard";
import { LatestVitalsCard } from "./overview/LatestVitalsCard";
import { UpcomingAppointmentsSection } from "./overview/UpcomingAppointmentsSection";
import { MedicalRecordDto } from "@/models/generated/medicalRecordDto";

interface OverviewTabContentProps {
	memberRecords: MedicalRecordDto[];
	memberMedications: Medication[];
	memberAppointments: Appointment[];
	memberVitals: VitalReading[];
	setActiveTab: (tab: string) => void;
}

export function OverviewTabContent({
	memberRecords,
	memberMedications,
	memberAppointments,
	memberVitals,
	setActiveTab,
}: OverviewTabContentProps) {
	const latestVitals =
		memberVitals.length > 0 ? memberVitals[memberVitals.length - 1] : null;

	return (
		<div className="space-y-4">
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				<RecentRecordsCard
					records={memberRecords}
					setActiveTab={setActiveTab}
				/>
				<CurrentMedicationsCard
					medications={memberMedications}
					setActiveTab={setActiveTab}
				/>
				<LatestVitalsCard
					latestVitals={latestVitals}
					setActiveTab={setActiveTab}
				/>
			</div>
			<UpcomingAppointmentsSection appointments={memberAppointments} />
		</div>
	);
}
