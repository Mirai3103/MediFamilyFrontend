import React from "react";
import { User, Mail, Phone, Calendar, MapPin, FileText } from "lucide-react";
import { Profile } from "@/models/generated";

interface PersonalInfoDisplayProps {
	profile: Profile;
}

const PersonalInfoDisplay = ({ profile }: PersonalInfoDisplayProps) => {
	return (
		<div className="space-y-6">
			<div className="grid grid-cols-1 gap-y-6">
				<InfoItem
					icon={<User className="mt-0.5 h-5 w-5 text-gray-400" />}
					label="Họ và tên"
					value={profile.fullName}
				/>

				<InfoItem
					icon={<Mail className="mt-0.5 h-5 w-5 text-gray-400" />}
					label="Email"
					value={profile.email}
				/>

				<InfoItem
					icon={<Phone className="mt-0.5 h-5 w-5 text-gray-400" />}
					label="Số điện thoại"
					value={profile.phoneNumber}
				/>

				<InfoItem
					icon={<Calendar className="mt-0.5 h-5 w-5 text-gray-400" />}
					label="Ngày sinh"
					value={profile.dateOfBirth}
				/>

				<InfoItem
					icon={<MapPin className="mt-0.5 h-5 w-5 text-gray-400" />}
					label="Địa chỉ"
					value={profile.address}
				/>

				{profile.bio && (
					<InfoItem
						icon={
							<FileText className="mt-0.5 h-5 w-5 text-gray-400" />
						}
						label="Giới thiệu"
						value={profile.bio}
					/>
				)}
			</div>
		</div>
	);
};

interface InfoItemProps {
	icon: React.ReactNode;
	label: string;
	value?: string | null;
}

const InfoItem = ({ icon, label, value }: InfoItemProps) => (
	<div className="flex items-start gap-2">
		{icon}
		<div>
			<p className="text-sm font-medium text-gray-500">{label}</p>
			<p>{value}</p>
		</div>
	</div>
);

export default PersonalInfoDisplay;
