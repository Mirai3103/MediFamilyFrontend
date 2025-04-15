// src/components/prescription/AddPrescriptionDialog.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus } from "lucide-react";
import { toast } from "sonner";
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
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/date-picker";
import { PrescriptionItemDto } from "@/models/generated";

// Form schema
const prescriptionFormSchema = z.object({
	medicationName: z
		.string()
		.min(2, { message: "Tên thuốc phải có ít nhất 2 ký tự" })
		.max(200),
	dosage: z
		.string()
		.min(1, { message: "Liều dùng không được để trống" })
		.max(100),
	frequency: z
		.string()
		.min(1, { message: "Tần suất sử dụng không được để trống" })
		.max(100),
	durationInDays: z
		.number()
		.min(1, { message: "Số ngày sử dụng phải lớn hơn hoặc bằng 1" }),
	startUseDate: z.date({ required_error: "Vui lòng chọn ngày bắt đầu" }),
	instructions: z.string().max(500).optional(),
	notes: z.string().max(1000).optional(),
});

type PrescriptionFormValues = z.infer<typeof prescriptionFormSchema>;

interface AddPrescriptionDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onAdd: (prescription: PrescriptionItemDto) => void;
	existingPrescriptions: PrescriptionItemDto[];
}

export default function AddPrescriptionDialog({
	open,
	onOpenChange,
	onAdd,
	existingPrescriptions,
}: AddPrescriptionDialogProps) {
	// Form setup
	const form = useForm<PrescriptionFormValues>({
		resolver: zodResolver(prescriptionFormSchema),
		defaultValues: {
			medicationName: "",
			dosage: "",
			frequency: "",
			durationInDays: 1,
			startUseDate: new Date(),
			instructions: "",
			notes: "",
		},
	});

	const onSubmit = (values: PrescriptionFormValues) => {
		// Add new prescription
		const newPrescription = {
			id: Math.max(0, ...existingPrescriptions.map((p) => p.id!)) + 1,
			...values,
		};

		onAdd(newPrescription as any);
		onOpenChange(false);
		form.reset();

		toast("Thêm thuốc thành công", {
			description: "Thuốc đã được thêm vào đơn thuốc",
		});
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogTrigger asChild>
				<Button>
					<Plus className="mr-2 h-4 w-4" />
					Thêm thuốc
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[600px]">
				<DialogHeader>
					<DialogTitle>Thêm thuốc mới</DialogTitle>
					<DialogDescription>
						Điền thông tin chi tiết về thuốc được kê trong đơn.
					</DialogDescription>
				</DialogHeader>

				<PrescriptionForm
					form={form}
					onSubmit={onSubmit}
					onCancel={() => onOpenChange(false)}
				/>
			</DialogContent>
		</Dialog>
	);
}

interface PrescriptionFormProps {
	form: ReturnType<typeof useForm<PrescriptionFormValues>>;
	onSubmit: (values: PrescriptionFormValues) => void;
	onCancel: () => void;
}

function PrescriptionForm({ form, onSubmit, onCancel }: PrescriptionFormProps) {
	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="space-y-4 py-4"
			>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{/* Medication Name */}
					<FormField
						control={form.control}
						name="medicationName"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Tên thuốc</FormLabel>
								<FormControl>
									<Input
										placeholder="Nhập tên thuốc"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Dosage */}
					<FormField
						control={form.control}
						name="dosage"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Liều dùng</FormLabel>
								<FormControl>
									<Input
										placeholder="VD: 5mg, 10ml..."
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Frequency */}
					<FormField
						control={form.control}
						name="frequency"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Tần suất sử dụng</FormLabel>
								<FormControl>
									<Input
										placeholder="VD: 1 viên/ngày, 2 lần/ngày..."
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Duration */}
					<FormField
						control={form.control}
						name="durationInDays"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Thời gian sử dụng (ngày)</FormLabel>
								<FormControl>
									<Input
										type="number"
										min={1}
										placeholder="Số ngày sử dụng"
										{...field}
										onChange={(e) =>
											field.onChange(
												parseInt(e.target.value)
											)
										}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Start Date */}
					<FormField
						control={form.control}
						name="startUseDate"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Ngày bắt đầu</FormLabel>
								<FormControl>
									<DatePicker
										date={field.value}
										onSelect={field.onChange}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				{/* Instructions */}
				<FormField
					control={form.control}
					name="instructions"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Hướng dẫn sử dụng</FormLabel>
							<FormControl>
								<Textarea
									placeholder="VD: Uống sau bữa ăn, uống với nhiều nước..."
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* Notes */}
				<FormField
					control={form.control}
					name="notes"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Ghi chú</FormLabel>
							<FormControl>
								<Textarea
									placeholder="Ghi chú thêm về thuốc này nếu cần"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<DialogFooter>
					<Button type="button" variant="outline" onClick={onCancel}>
						Hủy
					</Button>
					<Button type="submit">Thêm thuốc</Button>
				</DialogFooter>
			</form>
		</Form>
	);
}
