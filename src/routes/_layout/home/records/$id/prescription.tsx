import RecordPrescription from "@/pages/records/prescription";
import {
	getMedicalRecord,
	getPrescriptionByRecord,
} from "@/queries/generated/medical-record-controller/medical-record-controller";
import { createFileRoute, useLoaderData } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/home/records/$id/prescription")({
	async loader(ctx) {
		const recordId = Number(ctx.params.id);
		if (isNaN(recordId)) {
			throw new Error("Invalid record ID");
		}
		const record = await getMedicalRecord(recordId);
		const prescription = await getPrescriptionByRecord(recordId);

		return {
			record,
			prescription,
		} as {
			record: Awaited<ReturnType<typeof getMedicalRecord>>;
			prescription: Awaited<ReturnType<typeof getPrescriptionByRecord>>;
		};
	},

	component: RouteComponent,
});

function RouteComponent() {
	const { prescription, record } = useLoaderData({
		from: "/_layout/home/records/$id/prescription",
	});
	return (
		<RecordPrescription
			prescriptions={prescription.items! as any}
			record={record as never}
		/>
	); // Pass the record as a prop
}
