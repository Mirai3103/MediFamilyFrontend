// src/pages/FamilyDetailPage.jsx
import { useState } from "react";
import { FiUserPlus } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type FamilyDTO as Family } from "@/models/generated";
import { MemberCard } from "./FamilyMemberCard";
import FamilyInfo from "./FamilyInfo";
import AddMemberForm from "./AddMemberForm";
import useUserStore from "@/stores/authStore";
import { useNavigate } from "@tanstack/react-router";
import { ShareDrawer } from "@/components/share-drawer";

interface FamilyDetailPageProps {
	family: Family;
}
const FamilyDetailPage = ({ family }: FamilyDetailPageProps) => {
	const [activeTab, setActiveTab] = useState("members");
	const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false);
	const [isEditFamilyDialogOpen, setIsEditFamilyDialogOpen] = useState(false);

	const currentUserProfileId = useUserStore(
		(state) => state.profile?.profile?.id || state.profile?.id
	);

	// Update family information
	const handleUpdateFamily = (updatedFamily: any) => {
		setIsEditFamilyDialogOpen(false);
	};
	const navigate = useNavigate();

	return (
		<div>
			<div className="flex items-center justify-between">
				<div className="mb-2">
					<h1 className="text-2xl font-bold text-gray-900">
						Gia đình: {family.familyName}
					</h1>
				</div>
			</div>

			<Tabs
				value={activeTab}
				onValueChange={setActiveTab}
				className="space-y-6"
			>
				<TabsList className="grid w-full grid-cols-2">
					<TabsTrigger value="members">Thành viên</TabsTrigger>
					<TabsTrigger value="info">Thông tin gia đình</TabsTrigger>
				</TabsList>

				<TabsContent value="members" className="space-y-6">
					{/* Thêm thành viên mới */}
					{family!.owner!.id === currentUserProfileId && (
						<div className="flex gap-x-2 justify-end">
							<ShareDrawer type="family" familyId={family.id!} />

							<Dialog
								open={isAddMemberDialogOpen}
								onOpenChange={setIsAddMemberDialogOpen}
							>
								<DialogTrigger asChild>
									<Button>
										<FiUserPlus className="mr-2 h-4 w-4" />
										Thêm thành viên
									</Button>
								</DialogTrigger>

								<AddMemberForm
									family={family}
									onClose={() =>
										setIsAddMemberDialogOpen(false)
									}
								/>
							</Dialog>
						</div>
					)}

					{/* Danh sách thành viên */}
					<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
						{(family.familyMembers || []).map((member) => (
							<MemberCard
								key={member.id}
								member={member}
								isHouseholder={member.relationship === "Chủ hộ"}
								isCurrentUserHouseholder={
									currentUserProfileId === family!.owner!.id
								}
								onViewMedicalProfile={() =>
									navigate({
										to: `/home/families/${family.id}/members/${member.id}`,
									})
								}
							/>
						))}
					</div>
				</TabsContent>

				<TabsContent value="info" className="space-y-6">
					<FamilyInfo family={family} />
				</TabsContent>
			</Tabs>

			{/* Edit Family Dialog */}
			<Dialog
				open={isEditFamilyDialogOpen}
				onOpenChange={setIsEditFamilyDialogOpen}
			>
				<DialogContent className="sm:max-w-[425px]">
					<EditFamilyForm
						family={family}
						onSubmit={handleUpdateFamily}
						onCancel={() => setIsEditFamilyDialogOpen(false)}
					/>
				</DialogContent>
			</Dialog>
		</div>
	);
};

const EditFamilyForm = ({ family, onSubmit, onCancel }) => {
	const [formData, setFormData] = useState({
		name: family.name,
		address: family.address,
		phone: family.phone,
		email: family.email,
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		onSubmit(formData);
	};

	return (
		<>
			<DialogHeader>
				<DialogTitle>Cập nhật thông tin gia đình</DialogTitle>
				<DialogDescription>
					Chỉnh sửa thông tin gia đình của bạn. Nhấn lưu khi hoàn tất.
				</DialogDescription>
			</DialogHeader>

			<form onSubmit={handleSubmit} className="space-y-4 mt-4">
				<div className="space-y-2">
					<Label htmlFor="name">Tên gọi gia đình</Label>
					<Input
						id="name"
						name="name"
						placeholder="Nhập tên gọi gia đình"
						value={formData.name}
						onChange={handleChange}
						required
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="address">Địa chỉ</Label>
					<Input
						id="address"
						name="address"
						placeholder="Nhập địa chỉ"
						value={formData.address}
						onChange={handleChange}
						required
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="phone">Số điện thoại liên hệ</Label>
					<Input
						id="phone"
						name="phone"
						placeholder="Nhập số điện thoại"
						value={formData.phone}
						onChange={handleChange}
						required
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="email">Email liên hệ</Label>
					<Input
						id="email"
						name="email"
						type="email"
						placeholder="Nhập địa chỉ email"
						value={formData.email}
						onChange={handleChange}
						required
					/>
				</div>

				<DialogFooter className="mt-6">
					<Button type="button" variant="outline" onClick={onCancel}>
						Hủy
					</Button>
					<Button type="submit">Lưu thay đổi</Button>
				</DialogFooter>
			</form>
		</>
	);
};

export default FamilyDetailPage;
