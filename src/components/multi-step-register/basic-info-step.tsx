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
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

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
						<Popover>
							<PopoverTrigger asChild>
								<FormControl>
									<Button
										variant={"outline"}
										className={`w-full justify-start text-left font-normal ${
											!field.value
												? "text-muted-foreground"
												: ""
										}`}
									>
										<CalendarIcon className="mr-2 h-4 w-4" />
										{field.value ? (
											format(field.value, "dd/MM/yyyy", {
												locale: vi,
											})
										) : (
											<span>Chọn ngày sinh</span>
										)}
									</Button>
								</FormControl>
							</PopoverTrigger>
							<PopoverContent
								className="w-auto p-0"
								align="start"
							>
								<Calendar
									mode="single"
									selected={field.value}
									onSelect={field.onChange}
									disabled={(date) =>
										date > new Date() ||
										date < new Date("1900-01-01")
									}
									initialFocus
								/>
							</PopoverContent>
						</Popover>
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
