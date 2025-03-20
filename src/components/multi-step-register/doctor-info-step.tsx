// components/register-steps/doctor-info-step.tsx
import { useFormContext } from "react-hook-form";
import { RegisterFormValues } from "@/schemas/auth-schema";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from "@/components/ui/form";

export function DoctorInfoStep() {
	const { control } = useFormContext<RegisterFormValues>();

	return (
		<div className="space-y-4">
			<FormField
				control={control}
				name="specialty"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Chuyên khoa</FormLabel>
						<FormControl>
							<Input
								placeholder="Ví dụ: Nội khoa, Tim mạch,..."
								{...field}
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={control}
				name="licenseNumber"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Số giấy phép hành nghề</FormLabel>
						<FormControl>
							<Input placeholder="Nhập số giấy phép" {...field} />
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={control}
				name="medicalFacility"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Cơ sở y tế</FormLabel>
						<FormControl>
							<Input
								placeholder="Tên bệnh viện/phòng khám"
								{...field}
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={control}
				name="bio"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Giới thiệu</FormLabel>
						<FormControl>
							<Textarea
								placeholder="Giới thiệu về kinh nghiệm và chuyên môn của bạn"
								className="resize-none min-h-[100px]"
								{...field}
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
		</div>
	);
}
