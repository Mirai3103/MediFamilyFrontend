import React from "react";
import { AlertTriangle, Activity, FileText, HeartPulse } from "lucide-react";
import { Profile } from "@/models/generated";

interface HealthDetailCardsProps {
	profile: Profile;
}

const HealthDetailCards = ({ profile }: HealthDetailCardsProps) => {
	return (
		<div className="space-y-4 mt-6">
			<DetailCard
				icon={<HeartPulse className="mt-0.5 h-5 w-5 text-green-500" />}
				title="Số BHYT"
				content={profile.healthInsuranceNumber || "Chưa cập nhật"}
			/>

			<DetailCard
				icon={
					<AlertTriangle className="mt-0.5 h-5 w-5 text-amber-500" />
				}
				title="Dị ứng"
				content={profile.allergies || "Không có thông tin dị ứng"}
			/>

			<DetailCard
				icon={<Activity className="mt-0.5 h-5 w-5 text-red-500" />}
				title="Bệnh mãn tính"
				content={
					profile.chronicDiseases ||
					"Không có thông tin bệnh mãn tính"
				}
			/>

			{profile.notes && (
				<DetailCard
					icon={<FileText className="mt-0.5 h-5 w-5 text-gray-500" />}
					title="Ghi chú"
					content={profile.notes}
				/>
			)}
		</div>
	);
};

interface DetailCardProps {
	icon: React.ReactNode;
	title: string;
	content: string;
}

const DetailCard = ({ icon, title, content }: DetailCardProps) => (
	<div className="border rounded-lg p-4">
		<div className="flex items-start gap-2">
			{icon}
			<div>
				<p className="font-medium">{title}</p>
				<p className="text-sm mt-1">{content}</p>
			</div>
		</div>
	</div>
);

export default HealthDetailCards;
