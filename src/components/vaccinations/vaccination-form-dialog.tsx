// vaccination-form-dialog.tsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	vaccinationFormSchema,
	VaccinationFormValues,
	defaultVaccinationValues,
} from "./vaccination-schema";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
	useCreateVaccination,
	useUpdateVaccination,
} from "@/queries/generated/vaccinations-controller/vaccinations-controller";
import dayjs from "dayjs";

interface VaccinationFormDialogProps {
	isOpen: boolean;
	onClose: () => void;
	vaccination?: any; // VaccinationDto
	profileId: number;
	onSuccess: () => void;
}

export function VaccinationFormDialog({
	isOpen,
	onClose,
	vaccination,
	profileId,
	onSuccess,
}: VaccinationFormDialogProps) {
	const isEditMode = !!vaccination?.id;
	const [isSubmitting, setIsSubmitting] = useState(false);

	const createMutation = useCreateVaccination();
	const updateMutation = useUpdateVaccination();

	const form = useForm<VaccinationFormValues>({
		resolver: zodResolver(vaccinationFormSchema),
		defaultValues: isEditMode
			? {
					...vaccination,
					isDone: vaccination.done,
					vaccinationDate: vaccination.vaccinationDate
						? dayjs(vaccination.vaccinationDate).toDate()
						: undefined,
				}
			: {
					...defaultVaccinationValues,
					profileId,
				},
	});

	const onSubmit = async (values: VaccinationFormValues) => {
		try {
			setIsSubmitting(true);

			// Định dạng ngày cho API
			const formattedValues = {
				...values,
				vaccinationDate: dayjs(values.vaccinationDate).format(),
			};

			if (isEditMode) {
				await updateMutation.mutateAsync({
					id: vaccination.id,
					data: {
						...formattedValues,
						profileId: vaccination.profileId,
						vaccinationDate: dayjs(values.vaccinationDate).format(
							"YYYY-MM-DDTHH:mm:ss"
						),
						done: values.isDone,
					} as any,
				});
			} else {
				await createMutation.mutateAsync({
					data: {
						...formattedValues,
						profileId: values.profileId,
						vaccinationDate: dayjs(values.vaccinationDate).format(
							"YYYY-MM-DDTHH:mm:ss"
						),
						done: values.isDone,
					} as any,
				});
			}

			onSuccess();
			onClose();
		} catch (error) {
			console.error("Lỗi khi lưu thông tin tiêm chủng:", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="sm:max-w-[550px]">
				<DialogHeader>
					<DialogTitle>
						{isEditMode
							? "Chỉnh sửa thông tin tiêm chủng"
							: "Thêm thông tin tiêm chủng mới"}
					</DialogTitle>
				</DialogHeader>

				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-4"
					>
						<FormField
							control={form.control}
							name="vaccineName"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Tên vắc-xin*</FormLabel>
									<FormControl>
										<Input
											placeholder="Nhập tên vắc-xin"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className="grid grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="vaccinationDate"
								render={({ field }) => (
									<FormItem className="flex flex-col">
										<FormLabel>Ngày tiêm chủng*</FormLabel>
										{/* <CalendarDatePicker
											date={{
												from: field.value,
												to: field.value,
											}}
											onDateSelect={({ from }) => {
												field.onChange(from);
											}}
											variant="outline"
											numberOfMonths={1}
											placeholder="Chọn ngày tiêm chủng"
										/> */}
										<Input
											type="date"
											value={
												field.value
													?.toISOString()
													.split("T")[0]
											}
											onChange={(e) => {
												const date = new Date(
													e.target.value
												);
												field.onChange(date);
											}}
											placeholder="Chọn ngày tiêm chủng"
										/>

										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="dose"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Liều</FormLabel>
										<FormControl>
											<Input
												placeholder="Số liều hoặc loại liều"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="batchNumber"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Số lô</FormLabel>
										<FormControl>
											<Input
												placeholder="Số lô vắc-xin"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="location"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Địa điểm</FormLabel>
										<FormControl>
											<Input
												placeholder="Địa điểm tiêm chủng"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<FormField
							control={form.control}
							name="reactions"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Phản ứng</FormLabel>
									<FormControl>
										<Textarea
											placeholder="Phản ứng sau tiêm (nếu có)"
											className="resize-none"
											rows={2}
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="notes"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Ghi chú</FormLabel>
									<FormControl>
										<Textarea
											placeholder="Ghi chú bổ sung"
											className="resize-none"
											rows={2}
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="isDone"
							render={({ field }) => (
								<FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
									<FormControl>
										<Checkbox
											checked={field.value}
											onCheckedChange={field.onChange}
										/>
									</FormControl>
									<div className="space-y-1 leading-none">
										<FormLabel>
											Đã hoàn thành tiêm chủng
										</FormLabel>
									</div>
								</FormItem>
							)}
						/>

						<DialogFooter>
							<Button
								type="button"
								variant="outline"
								onClick={onClose}
								disabled={isSubmitting}
							>
								Hủy
							</Button>
							<Button type="submit" disabled={isSubmitting}>
								{isSubmitting
									? "Đang lưu..."
									: isEditMode
										? "Cập nhật"
										: "Lưu"}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
