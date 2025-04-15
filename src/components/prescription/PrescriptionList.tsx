// src/components/prescription/PrescriptionList.tsx
import dayjs from "dayjs";
import { Edit, Info, Pill, AlertCircle, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { PrescriptionItemDto } from "@/models/generated";

interface PrescriptionListProps {
	prescriptions: PrescriptionItemDto[];
	onOpenAddDialog: () => void;
}

export default function PrescriptionList({
	prescriptions,
	onOpenAddDialog,
}: PrescriptionListProps) {
	return (
		<div className="bg-white p-6 rounded-lg border shadow-sm">
			<div className="flex justify-between items-center mb-6">
				<div className="flex items-center">
					<Pill className="h-6 w-6 text-health-blue mr-3" />
					<h2 className="text-xl font-semibold">Danh sách thuốc</h2>
				</div>
				<div className="text-sm text-gray-500">
					{prescriptions.length} loại thuốc
				</div>
			</div>

			{prescriptions.length > 0 ? (
				<PrescriptionTable prescriptions={prescriptions} />
			) : (
				<EmptyPrescriptionState onAddClick={onOpenAddDialog} />
			)}
		</div>
	);
}

function PrescriptionTable({
	prescriptions,
}: {
	prescriptions: PrescriptionItemDto[];
}) {
	return (
		<div className="overflow-x-auto">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Tên thuốc</TableHead>
						<TableHead>Liều dùng</TableHead>
						<TableHead>Tần suất</TableHead>
						<TableHead>Thời gian</TableHead>
						<TableHead>Ngày bắt đầu</TableHead>
						<TableHead>Hướng dẫn</TableHead>
						<TableHead className="text-right">Thao tác</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{prescriptions.map((prescription) => (
						<PrescriptionRow
							key={prescription.id}
							prescription={prescription}
						/>
					))}
				</TableBody>
			</Table>
		</div>
	);
}

function PrescriptionRow({
	prescription,
}: {
	prescription: PrescriptionItemDto;
}) {
	const showDetails = () => {
		toast("Thông tin chi tiết", {
			description: (
				<div className="mt-2 space-y-2">
					<p>
						<span className="font-medium">Ghi chú:</span>{" "}
						{prescription.notes || "Không có"}
					</p>
					<p>
						<span className="font-medium">Hướng dẫn:</span>{" "}
						{prescription.instructions || "Không có"}
					</p>
				</div>
			),
		});
	};

	return (
		<TableRow>
			<TableCell className="font-medium">
				{prescription.medicationName}
			</TableCell>
			<TableCell>{prescription.dosage}</TableCell>
			<TableCell>{prescription.frequency}</TableCell>
			<TableCell>{prescription.durationInDays} ngày</TableCell>
			<TableCell>
				{dayjs(prescription.startUseDate).format("DD/MM/YYYY")}
			</TableCell>
			<TableCell className="max-w-[200px] truncate">
				{prescription.instructions || "-"}
			</TableCell>
			<TableCell className="text-right">
				<Button variant="ghost" size="sm" className="mr-1">
					<Edit className="h-4 w-4" />
				</Button>
				<Button variant="ghost" size="sm" onClick={showDetails}>
					<Info className="h-4 w-4" />
				</Button>
			</TableCell>
		</TableRow>
	);
}

function EmptyPrescriptionState({ onAddClick }: { onAddClick: () => void }) {
	return (
		<div className="text-center py-12 border rounded-lg bg-gray-50">
			<AlertCircle className="h-12 w-12 mx-auto text-gray-400 mb-3" />
			<h3 className="text-lg font-medium text-gray-600">
				Chưa có thuốc nào
			</h3>
			<p className="text-gray-500 mb-4">Thêm thuốc vào đơn này</p>
			<Button onClick={onAddClick} className="">
				<Plus className="mr-2 h-4 w-4" />
				Thêm thuốc
			</Button>
		</div>
	);
}
