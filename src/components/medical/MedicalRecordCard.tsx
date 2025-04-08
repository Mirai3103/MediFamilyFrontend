import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Edit } from "lucide-react";
import { MedicalRecordDto } from "@/models/generated/medicalRecordDto";

interface MedicalRecordCardProps {
	record: MedicalRecordDto;
	memberName: string;
}

const MedicalRecordCard = ({ record, memberName }: MedicalRecordCardProps) => {
	// Determine badge color based on record type
	const getBadgeClass = (type: string) => {
		switch (type.toLowerCase()) {
			case "check-up":
				return "bg-green-100 text-green-800 hover:bg-green-100";
			case "vaccination":
				return "bg-blue-100 text-blue-800 hover:bg-blue-100";
			case "dental":
				return "bg-purple-100 text-purple-800 hover:bg-purple-100";
			case "emergency":
				return "bg-red-100 text-red-800 hover:bg-red-100";
			default:
				return "bg-gray-100 text-gray-800 hover:bg-gray-100";
		}
	};

	return (
		<Card className="bg-white border-gray-200 transition-all hover:shadow-sm overflow-hidden">
			<CardHeader className="pb-2">
				<div className="flex justify-between items-start">
					<CardTitle className="text-lg">{record.title}</CardTitle>
					<Badge className={getBadgeClass(record.type!)}>
						{record.type}
					</Badge>
				</div>
				<div className="text-sm text-gray-500 flex justify-between items-center">
					<span>Date: {record.createdAt}</span>
					<span>For: {memberName}</span>
				</div>
			</CardHeader>
			<CardContent>
				<div className="space-y-3">
					<div className="text-sm">
						<div className="font-medium mb-1">Doctor</div>
						<div className="text-gray-600">{record.doctorName}</div>
					</div>
					<div className="text-sm">
						<div className="font-medium mb-1">Description</div>
						<div className="text-gray-600">{record.notes}</div>
					</div>
				</div>
			</CardContent>
			<CardFooter className="flex justify-between">
				<Button variant="outline" size="sm" className="text-gray-600">
					<Edit className="mr-1 h-3 w-3" />
					Edit
				</Button>
				<Button
					variant="outline"
					size="sm"
					className="text-health-blue"
				>
					<Download className="mr-1 h-3 w-3" />
					Download
				</Button>
			</CardFooter>
		</Card>
	);
};

export default MedicalRecordCard;
