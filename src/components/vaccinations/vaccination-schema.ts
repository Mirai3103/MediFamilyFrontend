// vaccination-schema.ts
import * as z from "zod";

export const vaccinationFormSchema = z.object({
	id: z.number().optional(),
	profileId: z.number(),
	vaccineName: z.string().min(1, { message: "Tên vắc-xin là bắt buộc" }),
	vaccinationDate: z.date({
		required_error: "Ngày tiêm chủng là bắt buộc",
	}),
	dose: z.string().optional(),
	isDone: z.boolean().default(false),
	batchNumber: z.string().optional(),
	location: z.string().optional(),
	reactions: z.string().optional(),
	notes: z.string().optional(),
});

export type VaccinationFormValues = z.infer<typeof vaccinationFormSchema>;

export const defaultVaccinationValues: Partial<VaccinationFormValues> = {
	vaccineName: "",
	isDone: false,
	dose: "",
	batchNumber: "",
	location: "",
	reactions: "",
	notes: "",
};
