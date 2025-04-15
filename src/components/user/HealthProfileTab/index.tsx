import { useState } from "react";
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { ProfileDTO } from "@/models/generated";
import HealthProfileForm from "./HealthProfileForm";
import HealthProfileDisplay from "./HealthProfileDisplay";
import { toast } from "sonner";

interface HealthProfileTabProps {
	profile: ProfileDTO;
}

const HealthProfileTab = ({ profile }: HealthProfileTabProps) => {
	const [isHealthEditMode, setIsHealthEditMode] = useState(false);

	const handleSubmitSuccess = () => {
		toast("Cập nhật thành công", {
			description: "Thông tin sức khỏe của bạn đã được cập nhật.",
		});
		setIsHealthEditMode(false);
	};

	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between pb-2">
				<div>
					<CardTitle>Hồ sơ sức khỏe</CardTitle>
					<CardDescription>
						Quản lý thông tin sức khỏe cá nhân của bạn
					</CardDescription>
				</div>

				{!isHealthEditMode && (
					<Button
						onClick={() => setIsHealthEditMode(true)}
						variant="outline"
						size="sm"
					>
						<Pencil className="mr-2 h-4 w-4" />
						Chỉnh sửa
					</Button>
				)}
			</CardHeader>

			<CardContent>
				{isHealthEditMode ? (
					<HealthProfileForm
						profile={profile}
						onSubmitSuccess={handleSubmitSuccess}
						onCancel={() => setIsHealthEditMode(false)}
					/>
				) : (
					<HealthProfileDisplay profile={profile} />
				)}
			</CardContent>

			{/* <CardFooter className="flex justify-between border-t p-4">
				<Button variant="outline" className="flex items-center">
					<PlusCircle className="mr-2 h-4 w-4" />
					Thêm lịch sử khám bệnh
				</Button>
				<Button variant="secondary">
					Xem báo cáo sức khỏe
					<ChevronRight className="ml-2 h-4 w-4" />
				</Button>
			</CardFooter> */}
		</Card>
	);
};

export default HealthProfileTab;
