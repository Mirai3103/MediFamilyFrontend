import { ShareDrawer } from "@/components/share-drawer";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import HealthProfileTab from "@/components/user/HealthProfileTab";
import MedicalDocumentsTab from "@/components/user/MedicalDocumentsTab";
import PersonalInfoSection from "@/components/user/PersonalInfoTab/PersonalInfoSection";
import RecordTab from "@/components/user/RecordTab";
import { Can } from "@/contexts/AbilityContext";
import { FamilyDTO, ProfileDTO } from "@/models/generated";
import useUserStore from "@/stores/authStore";
import { subject } from "@casl/ability";
import { useState } from "react";
interface FamilyMemberDetailPageProps {
	profile: ProfileDTO;
	family?: FamilyDTO;
	memberId?: number;
}
export default function FamilyMemberDetailPage({
	profile,
	family,
	memberId,
}: FamilyMemberDetailPageProps) {
	const [activeTab, setActiveTab] = useState("personal");
	const ability = useUserStore((state) => state.ability);
	console.log(
		ability?.can(
			"read",
			subject("MemberDocument", {
				ownerId: family?.ownerId,
				profileId: profile.id,
			}) as any
		),
		ability?.rules,
		ability
	);

	return (
		<div className="flex-1 container py-8 px-4 sm:px-6 lg:px-8">
			<div className="space-y-6">
				<div className="flex flex-col md:flex-row items-start md:items-center md:justify-between">
					<div>
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
					{memberId && (
						<Can
							I="share"
							a={
								subject("MemberProfile", {
									ownerId: family?.ownerId,
									profileId: profile.id,
								}) as any
							}
						>
							<ShareDrawer
								familyId={family?.id!}
								memberId={memberId}
								type="member"
							/>
						</Can>
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
							<TabsTrigger value="document">
								Tài liệu y tế
							</TabsTrigger>
							<TabsTrigger value="health">
								Thông tin sức khỏe
							</TabsTrigger>
							<TabsTrigger value="record">Hồ sơ khám</TabsTrigger>
						</TabsList>
					</Tabs>
					<div className="md:col-span-3">
						{activeTab === "personal" && (
							<PersonalInfoSection
								profile={profile!}
								canRead={ability?.can(
									"read",
									subject("MemberProfile", {
										ownerId: family?.ownerId,
										profileId: profile.id,
										familyId: family?.id,
									}) as any
								)}
								canUpdate={ability?.can(
									"update",
									subject("MemberProfile", {
										ownerId: family?.ownerId,
										profileId: profile.id,
										familyId: family?.id,
									}) as any
								)}
							/>
						)}
						{activeTab === "document" && (
							<MedicalDocumentsTab
								profile={profile!}
								canRead={ability?.can(
									"read",
									subject("MemberDocument", {
										ownerId: family?.ownerId,
										profileId: profile.id,
										familyId: family?.id,
									}) as any
								)}
								canUpdate={ability?.can(
									"update",
									subject("MemberDocument", {
										ownerId: family?.ownerId,
										profileId: profile.id,
										familyId: family?.id,
									}) as any
								)}
							/>
						)}
						{activeTab === "health" && (
							<HealthProfileTab
								profile={profile!}
								canRead={ability?.can(
									"read",
									subject("MemberHealth", {
										ownerId: family?.ownerId,
										profileId: profile.id,
										familyId: family?.id,
									}) as any
								)}
								canUpdate={ability?.can(
									"update",
									subject("MemberHealth", {
										ownerId: family?.ownerId,
										profileId: profile.id,
										familyId: family?.id,
									}) as any
								)}
							/>
						)}
						{activeTab === "record" && (
							<RecordTab
								profile={profile!}
								canRead={ability?.can(
									"read",
									subject("MemberRecord", {
										ownerId: family?.ownerId,
										profileId: profile.id,
										familyId: family?.id,
									}) as any
								)}
								canUpdate={ability?.can(
									"update",
									subject("MemberRecord", {
										ownerId: family?.ownerId,
										profileId: profile.id,
										familyId: family?.id,
									}) as any
								)}
							/>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
