import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
	AlertCircle,
	Calendar,
	Clipboard,
	Download,
	Edit,
	FileText,
	MapPin,
	User2,
} from "lucide-react";
import { MedicalRecordDto } from "@/models/generated/medicalRecordDto";
import dayjs from "dayjs";

interface MedicalRecordCardProps {
	record: MedicalRecordDto;
}
const MedicalRecordCard = ({ record }: MedicalRecordCardProps) => {
	return (
		<Card className="bg-white border border-gray-100 py-4 pb-0 rounded-lg transition-all hover:shadow-md overflow-hidden">
			<CardHeader className="pb-3 border-b border-gray-50">
				<div className="flex justify-between items-center">
					<CardTitle className="text-xl font-semibold text-gray-800">
						{record.title}
					</CardTitle>
					{record.isFollowup && (
						<div className="flex items-center bg-amber-50 px-3 py-2 rounded-md">
							<AlertCircle className="h-4 w-4 text-amber-600 mr-2" />
							<span className="text-sm text-amber-700">
								Hẹn tái khám:{" "}
								{dayjs(record.followupDate).format(
									"DD/MM/YYYY"
								)}
							</span>
						</div>
					)}
				</div>
				<div className="flex justify-between items-center mt-2 text-sm">
					<div className="flex items-center text-gray-600">
						<Calendar className="h-4 w-4 mr-1.5" />
						{dayjs(record.visitDate).format("DD/MM/YYYY")}
					</div>
					<div className="flex items-center text-gray-600">
						<MapPin className="h-4 w-4 mr-1.5" />
						{record.medicalFacility}
					</div>
				</div>
			</CardHeader>

			<CardContent className="">
				<div className="space-y-4">
					<div className="flex items-start">
						<div className="bg-blue-50 p-2 rounded-md mr-3">
							<User2 className="h-5 w-5 text-health-blue" />
						</div>
						<div>
							<div className="font-medium text-gray-700 mb-1">
								Bác sĩ
							</div>
							<div className="text-gray-600">
								{record.doctorName || "Không rõ"}
							</div>
						</div>
					</div>

					{record.treatment && (
						<div className="flex items-start">
							<div className="bg-green-50 p-2 rounded-md mr-3">
								<Clipboard className="h-5 w-5 text-green-600" />
							</div>
							<div>
								<div className="font-medium text-gray-700 mb-1">
									Phương pháp điều trị
								</div>
								<div className="text-gray-600">
									{record.treatment}
								</div>
							</div>
						</div>
					)}

					<div className="flex items-start">
						<div className="bg-purple-50 p-2 rounded-md mr-3">
							<FileText className="h-5 w-5 text-purple-600" />
						</div>
						<div>
							<div className="font-medium text-gray-700 mb-1">
								Ghi chú
							</div>
							<div className="text-gray-600 line-clamp-3">
								{record.notes}
							</div>
						</div>
					</div>
				</div>
			</CardContent>

			<CardFooter className="flex justify-between py-3 ">
				<div className="text-xs text-gray-500">
					Cập nhật:{" "}
					{dayjs(record.updatedAt).format("DD/MM/YYYY HH:mm")}
				</div>
				<div className="flex space-x-2">
					<Button
						variant="ghost"
						size="sm"
						className="text-gray-600 hover:bg-gray-100"
					>
						<Edit className="mr-1.5 h-3.5 w-3.5" />
						Chỉnh sửa
					</Button>
					<Button
						variant="default"
						size="sm"
						className=" text-white "
					>
						<Download className="mr-1.5 h-3.5 w-3.5" />
						Tải xuống
					</Button>
				</div>
			</CardFooter>
		</Card>
	);
};

export default MedicalRecordCard;
