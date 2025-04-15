// src/pages/RecordPrescription.tsx
import { useState } from "react";

import BackButton from "@/components/BackButton";

interface PrescriptionFormProps {
	record: MedicalRecordDto;
	prescriptions: PrescriptionItemDto[];
}

export default function RecordPrescription({
	record: medicalRecord,
	prescriptions,
}: PrescriptionFormProps) {
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [prescriptionItems, setPrescriptionItems] =
		useState<PrescriptionItemDto[]>(prescriptions);

	const handleAddPrescription = (newPrescription: PrescriptionItemDto) => {
		setPrescriptionItems([...prescriptionItems, newPrescription]);
	};

	return (
		<div className="container max-w-6xl mx-auto py-8">
			<div className="mb-6">
				<BackButton />

				<PageHeader
					title="Đơn thuốc"
					description="Quản lý đơn thuốc cho lần khám"
					action={
						<AddPrescriptionDialog
							open={isDialogOpen}
							onOpenChange={setIsDialogOpen}
							onAdd={handleAddPrescription}
							existingPrescriptions={prescriptionItems}
						/>
					}
				/>
			</div>

			<MedicalRecordCard record={medicalRecord} />

			<PrescriptionList
				prescriptions={prescriptionItems}
				onOpenAddDialog={() => setIsDialogOpen(true)}
			/>
		</div>
	);
}

// src/components/layout/PageHeader.tsx
import { ReactNode } from "react";
import { MedicalRecordDto, PrescriptionItemDto } from "@/models/generated";
import AddPrescriptionDialog from "@/components/prescription/AddPrescriptionDialog";
import PrescriptionList from "@/components/prescription/PrescriptionList";
import MedicalRecordCard from "./MedicalRecordCard";

interface PageHeaderProps {
	title: string;
	description?: string;
	action?: ReactNode;
}

function PageHeader({ title, description, action }: PageHeaderProps) {
	return (
		<div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
			<div>
				<h1 className="text-3xl font-bold text-gray-800">{title}</h1>
				{description && <p className="text-gray-500">{description}</p>}
			</div>
			{action && <div>{action}</div>}
		</div>
	);
}
