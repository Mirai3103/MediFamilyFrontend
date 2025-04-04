import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, Calendar } from "lucide-react";
import { Profile } from "@/models/generated";
import AvatarUploadDialog from "../AvatarUploadDialog";

interface ProfileCardProps {
	profile: Profile;
}

const ProfileCard = ({ profile }: ProfileCardProps) => {
	return (
		<Card className="md:col-span-1">
			<CardContent className="pt-6">
				<div className="flex flex-col items-center text-center space-y-4">
					<div className="relative">
						<AvatarUploadDialog profile={profile} />
					</div>

					<div>
						<h2 className="text-xl font-semibold">
							{profile.fullName}
						</h2>
						<p className="text-gray-500">ID: USR123456</p>
					</div>

					<div className="w-full pt-4 border-t border-gray-200">
						<div className="flex flex-col space-y-3">
							<div className="flex items-center">
								<Mail className="h-4 w-4 text-gray-400 mr-2" />
								<span className="text-sm">{profile.email}</span>
							</div>
							<div className="flex items-center">
								<Phone className="h-4 w-4 text-gray-400 mr-2" />
								<span className="text-sm">
									{profile.phoneNumber}
								</span>
							</div>
							<div className="flex items-center">
								<Calendar className="h-4 w-4 text-gray-400 mr-2" />
								<span className="text-sm">
									{profile.dateOfBirth}
								</span>
							</div>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};

export default ProfileCard;
