// src/pages/FamilyDetailPage.jsx
import { useState } from "react";
import { FiUsers, FiUserPlus, FiHome } from "react-icons/fi";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type Family } from "@/models/generated";
import dayjs from "dayjs";
import { MemberCard } from "./FamilyMemberCard";

interface FamilyDetailPageProps {
	family: Family;
}
const FamilyDetailPage = ({ family }: FamilyDetailPageProps) => {
	const [activeTab, setActiveTab] = useState("members");
	const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false);
	const [isEditFamilyDialogOpen, setIsEditFamilyDialogOpen] = useState(false);

	// Format date as DD/MM/YYYY
	const formatDate = (date?: string) => {
		return dayjs(date).format("DD/MM/YYYY");
	};

	// Function to calculate age from birth date
	const calculateAge = (birthDate: string) => {
		const today = new Date();
		const birth = new Date(birthDate);
		let age = today.getFullYear() - birth.getFullYear();
		const monthDiff = today.getMonth() - birth.getMonth();

		if (
			monthDiff < 0 ||
			(monthDiff === 0 && today.getDate() < birth.getDate())
		) {
			age--;
		}

		return age;
	};

	// Add a new member to the family
	const handleAddMember = (newMember: any) => {
		setIsAddMemberDialogOpen(false);
	};

	// Update family information
	const handleUpdateFamily = (updatedFamily: any) => {
		setIsEditFamilyDialogOpen(false);
	};

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
					{family.owner.id == 1 && (
						<div className="flex justify-end">
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
								<DialogContent className="sm:max-w-[425px]">
									<AddMemberForm
										onSubmit={handleAddMember}
										onCancel={() =>
											setIsAddMemberDialogOpen(false)
										}
									/>
								</DialogContent>
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
							/>
						))}
					</div>
				</TabsContent>

				<TabsContent value="info" className="space-y-6">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center">
								<FiHome className="mr-2 h-5 w-5" />
								Thông tin gia đình
							</CardTitle>
							<CardDescription>
								Chi tiết về hộ gia đình của bạn
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
								<div className="space-y-2">
									<p className="text-sm font-medium text-muted-foreground">
										Tên gọi
									</p>
									<p className="font-medium">
										{family.familyName}
									</p>
								</div>
								<div className="space-y-2">
									<p className="text-sm font-medium text-muted-foreground">
										Ngày tạo
									</p>
									<p className="font-medium">
										{formatDate(
											family.createdAt || undefined
										)}
									</p>
								</div>
								<div className="space-y-2">
									<p className="text-sm font-medium text-muted-foreground">
										Địa chỉ
									</p>
									<p className="font-medium">
										{family.address}
									</p>
								</div>
								<div className="space-y-2">
									<p className="text-sm font-medium text-muted-foreground">
										Số thành viên
									</p>
									<p className="font-medium">
										{family.familyMembers?.length}
									</p>
								</div>
								<div className="space-y-2">
									<p className="text-sm font-medium text-muted-foreground">
										Số điện thoại liên hệ
									</p>
									<p className="font-medium">
										{family.phoneNumber}
									</p>
								</div>
								<div className="space-y-2">
									<p className="text-sm font-medium text-muted-foreground">
										Email liên hệ
									</p>
									<p className="font-medium">
										{family.email}
									</p>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Thông tin chủ hộ */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center">
								<FiUsers className="mr-2 h-5 w-5" />
								Chủ hộ
							</CardTitle>
						</CardHeader>
						<CardContent>
							{(family.familyMembers || [])
								.filter(
									(member) => member.relationship === "Chủ hộ"
								)
								.map((householder) => (
									<div
										key={householder.id}
										className="flex items-center"
									>
										<Avatar className="h-10 w-10 mr-4">
											<AvatarImage
												src={
													"https://placewaifu.com/image/200"
												}
												alt={
													householder.user
														?.fullName ||
													householder.fullName
												}
											/>
											<AvatarFallback>
												{householder.user?.fullName?.charAt(
													0
												) ||
													householder.fullName?.charAt(
														0
													)}
											</AvatarFallback>
										</Avatar>
										<div>
											<p className="font-medium">
												{householder.user?.fullName ||
													householder.fullName}
											</p>
											<p className="text-sm text-muted-foreground">
												{householder.user
													?.phoneNumber ||
													householder.phoneNumber}
												{householder.user?.email ||
													householder.email}
											</p>
										</div>
									</div>
								))}
						</CardContent>
					</Card>
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

// Component for displaying a family member card

// Helper function to calculate age from birth date

// Form component for adding a new family member
const AddMemberForm = ({ onSubmit, onCancel }: any) => {
	const [formData, setFormData] = useState({
		name: "",
		relationship: "",
		gender: "",
		birthDate: "",
		phone: "",
		email: "",
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSelectChange = (name, value) => {
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		onSubmit(formData);
	};

	return (
		<>
			<DialogHeader>
				<DialogTitle>Thêm thành viên mới</DialogTitle>
				<DialogDescription>
					Nhập thông tin cá nhân của thành viên gia đình mới. Nhấn lưu
					khi hoàn tất.
				</DialogDescription>
			</DialogHeader>

			<form onSubmit={handleSubmit} className="space-y-4 mt-4">
				<div className="space-y-2">
					<Label htmlFor="name">Họ và tên</Label>
					<Input
						id="name"
						name="name"
						placeholder="Nhập họ và tên"
						value={formData.name}
						onChange={handleChange}
						required
					/>
				</div>

				<div className="grid grid-cols-2 gap-4">
					<div className="space-y-2">
						<Label htmlFor="relationship">Quan hệ với chủ hộ</Label>
						<Select
							onValueChange={(value) =>
								handleSelectChange("relationship", value)
							}
							required
						>
							<SelectTrigger id="relationship">
								<SelectValue placeholder="Chọn quan hệ" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="Vợ/Chồng">
									Vợ/Chồng
								</SelectItem>
								<SelectItem value="Con trai">
									Con trai
								</SelectItem>
								<SelectItem value="Con gái">Con gái</SelectItem>
								<SelectItem value="Cha">Cha</SelectItem>
								<SelectItem value="Mẹ">Mẹ</SelectItem>
								<SelectItem value="Anh/Chị">Anh/Chị</SelectItem>
								<SelectItem value="Em">Em</SelectItem>
								<SelectItem value="Khác">Khác</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<div className="space-y-2">
						<Label htmlFor="gender">Giới tính</Label>
						<Select
							onValueChange={(value) =>
								handleSelectChange("gender", value)
							}
							required
						>
							<SelectTrigger id="gender">
								<SelectValue placeholder="Chọn giới tính" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="Nam">Nam</SelectItem>
								<SelectItem value="Nữ">Nữ</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>

				<div className="space-y-2">
					<Label htmlFor="birthDate">Ngày sinh</Label>
					<Input
						id="birthDate"
						name="birthDate"
						type="date"
						value={formData.birthDate}
						onChange={handleChange}
						required
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="phone">Số điện thoại</Label>
					<Input
						id="phone"
						name="phone"
						placeholder="Nhập số điện thoại"
						value={formData.phone}
						onChange={handleChange}
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="email">Email</Label>
					<Input
						id="email"
						name="email"
						type="email"
						placeholder="Nhập địa chỉ email"
						value={formData.email}
						onChange={handleChange}
					/>
				</div>

				<DialogFooter className="mt-6">
					<Button type="button" variant="outline" onClick={onCancel}>
						Hủy
					</Button>
					<Button type="submit">Lưu thành viên</Button>
				</DialogFooter>
			</form>
		</>
	);
};

// Form component for editing family information
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
