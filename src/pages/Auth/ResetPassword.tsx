import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
    Form,
} from "@/components/ui/form";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { toast } from "sonner";
import {
    useResetPassword,
    useVerifyResetPasswordToken,
} from "@/queries/generated/auth-controller/auth-controller";

// Password regex validation from backend requirements
const passwordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).*$/;

const resetPasswordSchema = z
	.object({
		password: z
			.string()
			.min(8, { message: "Mật khẩu phải có ít nhất 8 ký tự" })
			.max(100, { message: "Mật khẩu không được vượt quá 100 ký tự" })
			.regex(passwordRegex, {
				message:
					"Mật khẩu phải chứa ít nhất 1 chữ thường, 1 chữ hoa, 1 số và 1 ký tự đặc biệt",
			}),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Mật khẩu không khớp",
		path: ["confirmPassword"],
	});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export function ResetPassword() {
	const navigate = useNavigate();
	const search = useSearch({
		strict: false,
	});
	const [resetSuccess, setResetSuccess] = useState(false);

	// Get token from URL query parameter
	const token = (search as any).token;

	// Redirect if no token is provided
	useEffect(() => {
		if (!token) {
			toast.error("Liên kết đặt lại mật khẩu không hợp lệ", {
				duration: 3000,
			});
			navigate({ to: "/forgot-password" });
		}
	}, [token, navigate]);

	const form = useForm<ResetPasswordFormValues>({
		resolver: zodResolver(resetPasswordSchema),
		defaultValues: {
			password: "",
			confirmPassword: "",
		},
		mode: "onChange",
	});
	const { isError } = useVerifyResetPasswordToken(
		{
			token: token,
		},
		{
			query: {
				enabled: !!token,
			},
		}
	);
	React.useEffect(() => {
		if (isError) {
			toast.error("Token không hợp lệ hoặc đã hết hạn", {
				duration: 5000,
				description: "Vui lòng thử lại.",
			});
			navigate({ to: "/forgot-password" });
		}
	}, [isError, navigate]);
	const mutate = useResetPassword({
		mutation: {
			onSuccess: () => {
				setResetSuccess(true);
				toast.success("Đặt lại mật khẩu thành công", {
					duration: 5000,
					description:
						"Bạn sẽ được chuyển hướng đến trang đăng nhập.",
				});

				setTimeout(() => {
					navigate({ to: "/login" });
				}, 3000);
			},
			onError: (error) => {
				console.error("Error resetting password:", error);
				toast.error("Đặt lại mật khẩu thất bại", {
					duration: 5000,
					description:
						"Token đã hết hạn hoặc không hợp lệ. Vui lòng thử lại.",
				});
			},
		},
	});

	const onSubmit = async (data: ResetPasswordFormValues) => {
		if (!token) return;

		mutate.mutate({
			data: {
				token: token,
				password: data.password,
			},
		});
	};

	if (!token) {
		return null; // Will redirect in useEffect
	}

	return (
		<div className="flex items-center justify-center min-h-[80vh] bg-background p-4">
			<Card className="w-full max-w-md shadow-lg">
				<CardHeader className="space-y-1">
					<CardTitle className="text-2xl font-bold text-center">
						Đặt lại mật khẩu
					</CardTitle>
					<CardDescription className="text-center">
						{!resetSuccess
							? "Nhập mật khẩu mới của bạn"
							: "Mật khẩu đã được đặt lại thành công"}
					</CardDescription>
				</CardHeader>

				{!resetSuccess ? (
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)}>
							<CardContent className="space-y-4">
								<FormField
									control={form.control}
									name="password"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Mật khẩu mới</FormLabel>
											<FormControl>
												<Input
													placeholder="••••••••"
													type="password"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="confirmPassword"
									render={({ field }) => (
										<FormItem>
											<FormLabel>
												Xác nhận mật khẩu
											</FormLabel>
											<FormControl>
												<Input
													placeholder="••••••••"
													type="password"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</CardContent>

							<CardFooter className="flex flex-col space-y-4 pt-3">
								<Button
									type="submit"
									className="w-full"
									disabled={mutate.isPending}
								>
									{mutate.isPending
										? "Đang xử lý..."
										: "Đặt lại mật khẩu"}
								</Button>
							</CardFooter>
						</form>
					</Form>
				) : (
					<CardContent className="space-y-4 text-center">
						<p>Mật khẩu của bạn đã được đặt lại thành công.</p>
						<p>
							Bạn sẽ được chuyển hướng đến trang đăng nhập trong
							vài giây.
						</p>
					</CardContent>
				)}
			</Card>
		</div>
	);
}
