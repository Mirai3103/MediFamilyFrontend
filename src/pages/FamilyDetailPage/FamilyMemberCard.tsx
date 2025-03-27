import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
	DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { Family, FamilyMemberGender } from "@/models/generated";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import dayjs from "dayjs";
import {
	FiEdit,
	FiMail,
	FiPhone,
	FiMoreVertical,
	FiCalendar,
	FiUser,
	FiHeart,
	FiMapPin,
	FiFileText,
} from "react-icons/fi";

interface MemberCardProps {
	member: NonNullable<Family["familyMembers"]>[0];
	isHouseholder: boolean;
	onViewMedicalProfile?: () => void;
	onEditMember?: () => void;
}

export const MemberCard = ({
	member,
	isHouseholder,
	onViewMedicalProfile,
	onEditMember,
}: MemberCardProps) => {
	const age = calculateAge(member.user?.dateOfBirth || member.dateOfBirth!);
	const fullName = member.user?.fullName || member.fullName;
	const email = member.user?.email || member.email;
	const phoneNumber = member.user?.phoneNumber || member.phoneNumber;
	const dateOfBirth = member.user?.dateOfBirth || member.dateOfBirth;
	const gender = member.gender;
	const relationship = member.relationship;
	const address = member.user?.address || "Chưa cập nhật";
	const avatarUrl = "https://placewaifu.com/image/200";

	// Lấy chữ cái đầu của họ tên để làm avatar fallback
	const getInitials = (name: string) => {
		return (
			name
				?.split(" ")
				.map((word) => word.charAt(0))
				.join("")
				.toUpperCase() || "?"
		);
	};

	// Định dạng gender để hiển thị thân thiện hơn
	const formatGender = (gender: FamilyMemberGender) => {
		if (!gender) return "Chưa cập nhật";
		switch (gender.toUpperCase()) {
			case "MALE":
				return "Nam";
			case "FEMALE":
				return "Nữ";
			default:
				return gender;
		}
	};

	// Định dạng relationship để hiển thị thân thiện hơn
	const formatRelationship = (relationship: string) => {
		if (!relationship) return "";

		const relationshipMap = {
			"Chủ hộ": "Chủ hộ",
			SPOUSE: "Vợ/Chồng",
			CHILD: "Con",
			PARENT: "Bố/Mẹ",
			SIBLING: "Anh/Chị/Em",
			GRANDPARENT: "Ông/Bà",
			OTHER: "Khác",
		};

		return relationshipMap[relationship.toUpperCase()] || relationship;
	};

	return (
		<Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
			<CardHeader className="p-0">
				<div className="relative h-28 bg-gradient-to-br from-primary/20 to-primary/40">
					{isHouseholder && (
						<Badge className="absolute top-2 right-2 bg-primary text-white">
							Chủ hộ
						</Badge>
					)}
					<div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
						<Avatar className="h-24 block w-24 border-4 border-background rounded-full overflow-hidden shadow-sm">
							<AvatarImage
								width={96}
								height={96}
								src={avatarUrl}
								alt={fullName}
								className="object-cover"
							/>
							<AvatarFallback className="bg-primary/10 text-primary text-lg font-medium">
								{getInitials(fullName || "unknown")}
							</AvatarFallback>
						</Avatar>
					</div>
				</div>
			</CardHeader>

			<CardContent className="pt-10 pb-3 text-center">
				<div className="space-y-1 mb-4">
					<h3 className="font-semibold text-lg">
						{fullName || "Chưa cập nhật"}
					</h3>
					<p className="text-sm text-muted-foreground">
						{formatRelationship(relationship)}
					</p>
				</div>

				<div className="grid grid-cols-2 gap-4 mt-6 text-left">
					<div className="flex items-center gap-2">
						<div className="bg-primary/10 p-2 rounded-full">
							<FiUser className="h-4 w-4 text-primary" />
						</div>
						<div>
							<p className="text-xs text-muted-foreground">
								Tuổi & Giới tính
							</p>
							<p className="text-sm font-medium">
								{age} tuổi • {formatGender(gender!)}
							</p>
						</div>
					</div>

					<div className="flex items-center gap-2">
						<div className="bg-primary/10 p-2 rounded-full">
							<FiCalendar className="h-4 w-4 text-primary" />
						</div>
						<div>
							<p className="text-xs text-muted-foreground">
								Ngày sinh
							</p>
							<p className="text-sm font-medium">
								{dateOfBirth
									? dayjs(dateOfBirth).format("DD/MM/YYYY")
									: "Chưa cập nhật"}
							</p>
						</div>
					</div>

					<div className="flex items-center gap-2 col-span-2">
						<div className="bg-primary/10 p-2 rounded-full">
							<FiMapPin className="h-4 w-4 text-primary" />
						</div>
						<div className="w-full">
							<p className="text-xs text-muted-foreground">
								Địa chỉ
							</p>
							<p className="text-sm font-medium truncate">
								{address}
							</p>
						</div>
					</div>
				</div>
			</CardContent>

			<CardFooter className="border-t px-4 py-3 bg-muted/5 flex flex-col gap-2">
				<div className="w-full flex items-center justify-between">
					<div className="flex items-center gap-2">
						<FiPhone className="h-4 w-4 text-primary" />
						<Tooltip>
							<TooltipTrigger asChild>
								<p className="text-sm truncate max-w-[150px]">
									{phoneNumber || "Chưa cập nhật"}
								</p>
							</TooltipTrigger>
							<TooltipContent>
								<p>{phoneNumber || "Chưa cập nhật"}</p>
							</TooltipContent>
						</Tooltip>
					</div>

					<div className="flex items-center gap-2">
						<FiMail className="h-4 w-4 text-primary" />
						<Tooltip>
							<TooltipTrigger asChild>
								<p className="text-sm truncate max-w-[150px]">
									{email || "Chưa cập nhật"}
								</p>
							</TooltipTrigger>
							<TooltipContent>
								<p>{email || "Chưa cập nhật"}</p>
							</TooltipContent>
						</Tooltip>
					</div>
				</div>

				<div className="w-full flex justify-between mt-1">
					<Button
						variant="outline"
						size="sm"
						className="flex-1 mr-1"
						onClick={onViewMedicalProfile}
					>
						<FiFileText className="h-3.5 w-3.5 mr-1" />
						Hồ sơ y tế
					</Button>

					{isHouseholder && (
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="outline"
									size="sm"
									className="px-2"
								>
									<FiMoreVertical className="h-3.5 w-3.5" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuItem onClick={onEditMember}>
									<FiEdit className="mr-2 h-4 w-4" />
									Chỉnh sửa thông tin
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem className="text-destructive">
									<FiHeart className="mr-2 h-4 w-4" />
									Xóa thành viên
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					)}
				</div>
			</CardFooter>
		</Card>
	);
};

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
