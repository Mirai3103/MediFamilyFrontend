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
import { Profile } from "@/models/generated";
import PersonalInfoForm from "./PersonalInfoForm";
import PersonalInfoDisplay from "./PersonalInfoDisplay";
import { toast } from "sonner";

interface PersonalInfoSectionProps {
	profile: Profile;
}

const PersonalInfoSection = ({ profile }: PersonalInfoSectionProps) => {
	const [isEditMode, setIsEditMode] = useState(false);

	const handleSubmitSuccess = () => {
		toast("Cập nhật thành công", {
			description: "Thông tin cá nhân của bạn đã được cập nhật.",
		});
		setIsEditMode(false);
	};

	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between pb-2">
				<div>
					<CardTitle>Thông tin cá nhân</CardTitle>
					<CardDescription>
						Quản lý thông tin cá nhân của bạn
					</CardDescription>
				</div>

				{!isEditMode && (
					<Button
						onClick={() => setIsEditMode(true)}
						variant="outline"
						size="sm"
					>
						<Pencil className="mr-2 h-4 w-4" />
						Chỉnh sửa
					</Button>
				)}
			</CardHeader>

			<CardContent>
				{isEditMode ? (
					<PersonalInfoForm
						profile={profile}
						onSubmitSuccess={handleSubmitSuccess}
						onCancel={() => setIsEditMode(false)}
					/>
				) : (
					<PersonalInfoDisplay profile={profile} />
				)}
			</CardContent>
		</Card>
	);
};

export default PersonalInfoSection;
