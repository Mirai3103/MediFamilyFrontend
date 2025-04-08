import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { File } from "lucide-react";
import { MedicalRecordDto } from "@/models/generated/medicalRecordDto";

interface RecentRecordsCardProps {
	records: MedicalRecordDto[];
	setActiveTab: (tab: string) => void;
}

export function RecentRecordsCard({
	records,
	setActiveTab,
}: RecentRecordsCardProps) {
	return (
		<Card>
			<CardHeader className="pb-2">
				<CardTitle className="text-lg flex items-center">
					<File className="mr-2 h-5 w-5 text-health-blue" />
					Recent Medical Records
				</CardTitle>
			</CardHeader>
			<CardContent>
				{records.length > 0 ? (
					<ul className="space-y-3">
						{records.slice(0, 3).map((record) => (
							<li
								key={record.id}
								className="text-sm border-b pb-2 last:border-b-0"
							>
								<div className="font-medium">
									{record.title}
								</div>
								<div className="text-gray-500 flex justify-between text-xs">
									<span>{record.createdAt}</span>
									<span>{record.doctorName}</span>
								</div>
							</li>
						))}
					</ul>
				) : (
					<p className="text-sm text-gray-500 text-center py-4">
						No recent records.
					</p>
				)}
			</CardContent>
			<CardFooter>
				<Button
					variant="ghost"
					size="sm"
					className="w-full text-health-blue hover:bg-health-blue/10"
					onClick={() => setActiveTab("records")}
				>
					View All Records
				</Button>
			</CardFooter>
		</Card>
	);
}
