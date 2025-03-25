// schemas/auth-schema.ts
import { z } from "zod";

// Schema cho bước đăng ký cơ bản
export const baseUserSchema = z.object({
	password: z
		.string()
		.min(8, "Mật khẩu phải có ít nhất 8 ký tự")
		.regex(
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
			"Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số"
		),
	email: z.string().email("Email không hợp lệ"),
	fullName: z.string().min(2, "Họ tên phải có ít nhất 2 ký tự"),
	dateOfBirth: z.date({
		required_error: "Vui lòng chọn ngày sinh",
	}),
	isDoctor: z.boolean().default(false),
});

// Schema cho thông tin bác sĩ
export const doctorSchema = z.object({
	specialty: z.string().min(2, "Vui lòng nhập chuyên khoa"),
	licenseNumber: z.string().min(5, "Số giấy phép không hợp lệ"),
	medicalFacility: z.string().min(2, "Vui lòng nhập cơ sở y tế"),
	bio: z.string().min(10, "Giới thiệu phải có ít nhất 10 ký tự"),
});

// Schema kết hợp
export const registerSchema = z.discriminatedUnion("isDoctor", [
	baseUserSchema.extend({ isDoctor: z.literal(false) }),
	baseUserSchema.extend({ isDoctor: z.literal(true) }).merge(doctorSchema),
]);

export type RegisterFormValues = z.infer<typeof registerSchema>;
