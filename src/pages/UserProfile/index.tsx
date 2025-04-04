import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileCard from "@/components/user/ProfileCard";
import PersonalInfoTab from "@/components/user/PersonalInfoTab";
import HealthProfileTab from "@/components/user/HealthProfileTab";
import { Profile, User as IUser } from "@/models/generated";

export interface UserProfileProps {
	user: IUser;
	profile: Profile;
}

const UserProfile = ({ user, profile }: UserProfileProps) => {
	const [activeTab, setActiveTab] = useState("personal");

	return (
		<div className="flex-1 container py-8 px-4 sm:px-6 lg:px-8">
			<div className="space-y-6">
				<div className="flex flex-col md:flex-row items-start md:items-center md:justify-between">
					<h1 className="text-2xl font-bold">Hồ sơ của tôi</h1>
					<Tabs
						defaultValue="personal"
						value={activeTab}
						onValueChange={setActiveTab}
						className="mt-4 md:mt-0"
					>
						<TabsList>
							<TabsTrigger value="personal">
								Thông tin cá nhân
							</TabsTrigger>
							<TabsTrigger value="health">
								Hồ sơ sức khỏe
							</TabsTrigger>
						</TabsList>
					</Tabs>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
					<ProfileCard profile={profile} />

					<div className="md:col-span-3">
						{activeTab === "personal" && (
							<PersonalInfoTab profile={profile} />
						)}
						{activeTab === "health" && (
							<HealthProfileTab profile={profile} />
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default UserProfile;
