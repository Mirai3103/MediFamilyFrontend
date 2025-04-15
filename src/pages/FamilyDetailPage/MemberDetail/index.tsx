import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import HealthProfileTab from "@/components/user/HealthProfileTab";
import PersonalInfoSection from "@/components/user/PersonalInfoTab/PersonalInfoSection";
import RecordTab from "@/components/user/RecordTab";
import { FamilyDTO, ProfileDTO } from "@/models/generated";
import { useState } from "react";
interface FamilyMemberDetailPageProps {
	profile: ProfileDTO;
	family?: FamilyDTO;
}
export default function FamilyMemberDetailPage({
	profile,
	family,
}: FamilyMemberDetailPageProps) {
	const [activeTab, setActiveTab] = useState("personal");

	return (
		<div className="flex-1 container py-8 px-4 sm:px-6 lg:px-8">
			<div className="space-y-6">
				<div className="flex flex-col md:flex-row items-start md:items-center md:justify-between">
					{family && (
						<h1 className="text-2xl font-bold">
							Hồ sơ của thành viên <i>{profile?.fullName}</i>{" "}
							trong gia đình <i>{family.familyName}</i>
						</h1>
					)}
					{!family && (
						<h1 className="text-2xl font-bold">
							Hồ sơ của <i>{profile?.fullName}</i>
						</h1>
					)}
				</div>
				<div className="flex flex-col gap-y-2">
					<Tabs
						defaultValue="personal"
						value={activeTab}
						onValueChange={setActiveTab}
						className="mt-4 md:mt-0 w-full"
					>
						<TabsList className="w-full">
							<TabsTrigger value="personal">
								Thông tin cá nhân
							</TabsTrigger>
							<TabsTrigger value="health">
								Thông tin sức khỏe
							</TabsTrigger>
							<TabsTrigger value="record">Hồ sơ khám</TabsTrigger>
						</TabsList>
					</Tabs>
					<div className="md:col-span-3">
						{activeTab === "personal" && (
							<PersonalInfoSection profile={profile!} />
						)}
						{activeTab === "health" && (
							<HealthProfileTab profile={profile!} />
						)}
						{activeTab === "record" && (
							<RecordTab profile={profile!} />
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
