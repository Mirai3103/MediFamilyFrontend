// components/register-steps/basic-info-step.tsx
import { useFormContext } from "react-hook-form";
import { RegisterFormValues } from "@/schemas/auth-schema";
import { Input } from "@/components/ui/input";
import {
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";

export function BasicInfoStep() {
	const {
		control,
		formState: { errors },
	} = useFormContext<RegisterFormValues>();

	return (
		<div className="space-y-4">
			<FormField
				control={control}
				name="fullName"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Họ và tên</FormLabel>
						<FormControl>
							<Input
								placeholder="Nhập họ tên đầy đủ"
								{...field}
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
			<FormField
				control={control}
				name="email"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Email</FormLabel>
						<FormControl>
							<Input
								type="email"
								placeholder="example@example.com"
								{...field}
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={control}
				name="password"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Mật khẩu</FormLabel>
						<FormControl>
							<Input
								type="password"
								placeholder="********"
								{...field}
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={control}
				name="dateOfBirth"
				render={({ field }) => (
					<FormItem className="flex flex-col">
						<FormLabel>Ngày sinh</FormLabel>
						<FormControl>
							<Input
								type="date"
								max={new Date().toISOString().split("T")[0]}
								min="1900-01-01"
								value={
									field.value
										? new Date(field.value)
												.toISOString()
												.split("T")[0]
										: ""
								}
								onChange={(e) => {
									const val = e.target.value;
									field.onChange(
										val ? new Date(val) : undefined
									);
								}}
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={control}
				name="isDoctor"
				render={({ field }) => (
					<FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
						<FormControl>
							<Checkbox
								checked={field.value}
								onCheckedChange={field.onChange}
							/>
						</FormControl>
						<div className="space-y-1 leading-none">
							<FormLabel>Tôi là bác sĩ</FormLabel>
						</div>
					</FormItem>
				)}
			/>
		</div>
	);
}
