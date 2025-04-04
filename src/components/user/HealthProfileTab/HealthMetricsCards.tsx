import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Activity, Ruler } from "lucide-react";
import { Profile } from "@/models/generated";

interface HealthMetricsCardsProps {
	profile: Profile;
}

const HealthMetricsCards = ({ profile }: HealthMetricsCardsProps) => {
	const getBMIStatus = () => {
		if (!profile.height || !profile.weight) return "Chưa có thông tin";

		const heightInMeters = profile.height / 100;
		const bmi = profile.weight / (heightInMeters * heightInMeters);

		if (bmi < 18.5) return `${bmi.toFixed(1)} - Thiếu cân`;
		if (bmi < 25) return `${bmi.toFixed(1)} - Bình thường`;
		if (bmi < 30) return `${bmi.toFixed(1)} - Thừa cân`;
		return `${bmi.toFixed(1)} - Béo phì`;
	};

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
			<MetricCard
				icon={<Heart className="h-5 w-5 text-red-500 mr-2" />}
				label="Nhóm máu"
				value={profile.bloodType || "Chưa cập nhật"}
			/>

			<MetricCard
				icon={<Activity className="h-5 w-5 text-blue-500 mr-2" />}
				label="Chỉ số BMI"
				value={getBMIStatus()}
			/>

			<MetricCard
				icon={<Ruler className="h-5 w-5 text-indigo-500 mr-2" />}
				label="Chiều cao"
				value={
					profile.height ? `${profile.height} cm` : "Chưa cập nhật"
				}
			/>

			<MetricCard
				icon={<Activity className="h-5 w-5 text-green-500 mr-2" />}
				label="Cân nặng"
				value={
					profile.weight ? `${profile.weight} kg` : "Chưa cập nhật"
				}
			/>
		</div>
	);
};

interface MetricCardProps {
	icon: React.ReactNode;
	label: string;
	value: string;
}

const MetricCard = ({ icon, label, value }: MetricCardProps) => (
	<Card className="bg-gray-50 border-0">
		<CardContent className="p-4">
			<div className="flex items-center justify-between">
				<div className="flex items-center">
					{icon}
					<p className="font-medium">{label}</p>
				</div>
				<p className="font-semibold">{value}</p>
			</div>
		</CardContent>
	</Card>
);

export default HealthMetricsCards;
