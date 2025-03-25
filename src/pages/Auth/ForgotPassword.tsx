import { useState } from "react";
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
import { useNavigate } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";

const forgotPasswordSchema = z.object({
	email: z.string().email({ message: "Email không hợp lệ" }),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export function ForgotPassword() {
	const navigate = useNavigate();
	const [submitted, setSubmitted] = useState(false);

	const form = useForm<ForgotPasswordFormValues>({
		resolver: zodResolver(forgotPasswordSchema),
		defaultValues: {
			email: "",
		},
		mode: "onChange",
	});

	const onSubmit = (data: ForgotPasswordFormValues) => {
		console.log("Forgot password form submitted:", data);
		setSubmitted(true);
	};

	return (
		<div className="flex items-center justify-center min-h-[80vh] bg-background p-4">
			<Card className="w-full max-w-md shadow-lg">
				<CardHeader className="space-y-1">
					<CardTitle className="text-2xl font-bold text-center">
						Quên mật khẩu
					</CardTitle>
					<CardDescription className="text-center">
						{!submitted
							? "Nhập email của bạn để nhận hướng dẫn đặt lại mật khẩu"
							: "Vui lòng kiểm tra email của bạn"}
					</CardDescription>
				</CardHeader>

				{!submitted ? (
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)}>
							<CardContent className="space-y-4">
								<FormField
									control={form.control}
									name="email"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Email</FormLabel>
											<FormControl>
												<Input
													placeholder="example@email.com"
													type="email"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</CardContent>

							<CardFooter className="flex flex-col space-y-4 pt-3">
								<Button type="submit" className="w-full">
									Gửi yêu cầu
								</Button>

								<div className="text-center text-sm">
									<Link
										to="/login"
										className="text-primary hover:underline"
									>
										Quay lại đăng nhập
									</Link>
								</div>
							</CardFooter>
						</form>
					</Form>
				) : (
					<>
						<CardContent className="space-y-4 text-center ">
							<p>
								Chúng tôi đã gửi email hướng dẫn đặt lại mật
								khẩu đến địa chỉ email của bạn.
							</p>
							<p>
								Vui lòng kiểm tra hộp thư đến và làm theo hướng
								dẫn để đặt lại mật khẩu.
							</p>
						</CardContent>

						<CardFooter className="flex flex-col space-y-4">
							<Button asChild className="w-full">
								<Link to="/login">Quay lại đăng nhập</Link>
							</Button>
						</CardFooter>
					</>
				)}
			</Card>
		</div>
	);
}
