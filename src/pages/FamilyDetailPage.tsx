// src/pages/FamilyDetailPage.jsx
import { useState } from "react";
import {
	FiUsers,
	FiUserPlus,
	FiEdit,
	FiMoreVertical,
	FiPhone,
	FiMail,
	FiHome,
} from "react-icons/fi";
import { faker } from "@faker-js/faker/locale/vi";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

// Giả lập dữ liệu gia đình
const generateFakeFamily = () => {
	// Thông tin gia đình
	const family = {
		id: faker.string.uuid(),
		name: "Gia đình " + faker.person.lastName(),
		address: faker.location.streetAddress() + ", " + faker.location.city(),
		phone: faker.phone.number(),
		email: faker.internet.email(),
		createdAt: faker.date.past(),
		isHouseholder: true, // Người dùng hiện tại là chủ hộ
	};

	// Danh sách thành viên
	const members = [
		{
			id: faker.string.uuid(),
			name: faker.person.fullName(),
			avatar: `https://placewaifu.com/image/100/100?seed=1`,
			relationship: "Chủ hộ",
			birthDate: faker.date.birthdate({ min: 30, max: 50, mode: "age" }),
			gender: "Nam",
			phone: faker.phone.number(),
			email: faker.internet.email(),
			isCurrentUser: true,
		},
	];

	// Thêm các thành viên khác
	const relationships = [
		"Vợ/Chồng",
		"Con trai",
		"Con gái",
		"Cha",
		"Mẹ",
		"Anh/Chị",
		"Em",
	];
	const genders = ["Nam", "Nữ"];

	for (let i = 0; i < faker.number.int({ min: 2, max: 5 }); i++) {
		const gender = faker.helpers.arrayElement(genders);
		let relationship = faker.helpers.arrayElement(relationships);

		// Điều chỉnh mối quan hệ dựa trên giới tính
		if (relationship === "Con trai" && gender === "Nữ")
			relationship = "Con gái";
		if (relationship === "Con gái" && gender === "Nam")
			relationship = "Con trai";

		members.push({
			id: faker.string.uuid(),
			name: faker.person.fullName({
				sex: gender === "Nam" ? "male" : "female",
			}),
			avatar: `https://placewaifu.com/image/100/100?seed=${i + 2}`,
			relationship: relationship,
			birthDate: faker.date.birthdate({ min: 1, max: 70, mode: "age" }),
			gender: gender,
			phone: faker.phone.number(),
			email: faker.internet.email(),
			isCurrentUser: false,
		});
	}

	return { family, members };
};

const { family, members } = generateFakeFamily();

const FamilyDetailPage = () => {
	const [familyData, setFamilyData] = useState(family);
	const [membersData, setMembersData] = useState(members);
	const [activeTab, setActiveTab] = useState("members");
	const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false);
	const [isEditFamilyDialogOpen, setIsEditFamilyDialogOpen] = useState(false);

	// Format date as DD/MM/YYYY
	const formatDate = (date: string) => {
		return new Date(date).toLocaleDateString("vi-VN");
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
		// In a real app, you would send this to your API
		const memberWithId = {
			...newMember,
			id: faker.string.uuid(),
			isCurrentUser: false,
			avatar: `https://placewaifu.com/image/100/100?seed=${membersData.length + 1}`,
		};

		setMembersData([...membersData, memberWithId]);
		setIsAddMemberDialogOpen(false);
	};

	// Update family information
	const handleUpdateFamily = (updatedFamily: any) => {
		// In a real app, you would send this to your API
		setFamilyData({
			...familyData,
			...updatedFamily,
		});
		setIsEditFamilyDialogOpen(false);
	};

	return (
		<div>
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
					{familyData.isHouseholder && (
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
						{membersData.map((member) => (
							<MemberCard
								key={member.id}
								member={member}
								isHouseholder={familyData.isHouseholder}
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
										{familyData.name}
									</p>
								</div>
								<div className="space-y-2">
									<p className="text-sm font-medium text-muted-foreground">
										Ngày tạo
									</p>
									<p className="font-medium">
										{formatDate(familyData.createdAt)}
									</p>
								</div>
								<div className="space-y-2">
									<p className="text-sm font-medium text-muted-foreground">
										Địa chỉ
									</p>
									<p className="font-medium">
										{familyData.address}
									</p>
								</div>
								<div className="space-y-2">
									<p className="text-sm font-medium text-muted-foreground">
										Số thành viên
									</p>
									<p className="font-medium">
										{membersData.length} người
									</p>
								</div>
								<div className="space-y-2">
									<p className="text-sm font-medium text-muted-foreground">
										Số điện thoại liên hệ
									</p>
									<p className="font-medium">
										{familyData.phone}
									</p>
								</div>
								<div className="space-y-2">
									<p className="text-sm font-medium text-muted-foreground">
										Email liên hệ
									</p>
									<p className="font-medium">
										{familyData.email}
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
							{membersData
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
												src={householder.avatar}
												alt={householder.name}
											/>
											<AvatarFallback>
												{householder.name.charAt(0)}
											</AvatarFallback>
										</Avatar>
										<div>
											<p className="font-medium">
												{householder.name}
											</p>
											<p className="text-sm text-muted-foreground">
												{householder.phone} •{" "}
												{householder.email}
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
						family={familyData}
						onSubmit={handleUpdateFamily}
						onCancel={() => setIsEditFamilyDialogOpen(false)}
					/>
				</DialogContent>
			</Dialog>
		</div>
	);
};

// Component for displaying a family member card
const MemberCard = ({ member, isHouseholder }: any) => {
	// Calculate age from birth date
	const age = calculateAge(member.birthDate);

	return (
		<Card className="overflow-hidden">
			<CardHeader className="p-0">
				<div className="relative h-32 bg-gradient-to-r from-primary/10 to-primary/20">
					{member.isCurrentUser && (
						<Badge className="absolute top-2 right-2">Bạn</Badge>
					)}
					<div className="absolute -bottom-10 left-4">
						<Avatar className="h-20 w-20 border-4 border-background">
							<AvatarImage
								src={member.avatar}
								alt={member.name}
							/>
							<AvatarFallback>
								{member.name.split(" ").pop().charAt(0)}
							</AvatarFallback>
						</Avatar>
					</div>
				</div>
			</CardHeader>
			<CardContent className="pt-12 pb-4">
				<div className="flex justify-between items-start">
					<div>
						<h3 className="font-semibold text-lg leading-none">
							{member.name}
						</h3>
						<p className="text-sm text-muted-foreground mt-1">
							{member.relationship}
						</p>
					</div>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" size="icon">
								<FiMoreVertical className="h-4 w-4" />
								<span className="sr-only">Thêm tùy chọn</span>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem>
								<FiEdit className="mr-2 h-4 w-4" />
								Xem hồ sơ y tế
							</DropdownMenuItem>
							{isHouseholder && !member.isCurrentUser && (
								<>
									<DropdownMenuSeparator />
									<DropdownMenuItem>
										<FiEdit className="mr-2 h-4 w-4" />
										Chỉnh sửa thông tin
									</DropdownMenuItem>
								</>
							)}
						</DropdownMenuContent>
					</DropdownMenu>
				</div>

				<div className="grid grid-cols-2 gap-2 mt-4">
					<div className="space-y-1">
						<p className="text-xs text-muted-foreground">Tuổi</p>
						<p className="text-sm">{age} tuổi</p>
					</div>
					<div className="space-y-1">
						<p className="text-xs text-muted-foreground">
							Giới tính
						</p>
						<p className="text-sm">{member.gender}</p>
					</div>
					<div className="space-y-1 col-span-2">
						<p className="text-xs text-muted-foreground">
							Ngày sinh
						</p>
						<p className="text-sm">
							{new Date(member.birthDate).toLocaleDateString(
								"vi-VN"
							)}
						</p>
					</div>
				</div>
			</CardContent>
			<CardFooter className="border-t px-6 py-3 bg-muted/10">
				<div className="w-full">
					<div className="flex items-center">
						<FiPhone className="h-3 w-3 mr-1 text-muted-foreground" />
						<p className="text-xs truncate">{member.phone}</p>
					</div>
					<div className="flex items-center mt-1">
						<FiMail className="h-3 w-3 mr-1 text-muted-foreground" />
						<p className="text-xs truncate">{member.email}</p>
					</div>
				</div>
			</CardFooter>
		</Card>
	);
};

// Helper function to calculate age from birth date
const calculateAge = (birthDate) => {
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
