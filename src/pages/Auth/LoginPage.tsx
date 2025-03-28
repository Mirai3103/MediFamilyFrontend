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
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";
import { useLogin } from "@/queries/generated/auth-controller/auth-controller";
import { Link } from "@tanstack/react-router";

const loginSchema = z.object({
	email: z.string().email({ message: "Email không hợp lệ" }),
	password: z
		.string()
		.min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
	const navigate = useNavigate();
	const { mutateAsync, isPending } = useLogin();

	const form = useForm<LoginFormValues>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: "",
			password: "",
		},
		mode: "onChange",
	});

	const onSubmit = (data: LoginFormValues) => {
		console.log("Login form submitted:", data);
		mutateAsync({
			data: {
				username: data.email,
				password: data.password,
			},
		})
			.then((data) => {
				localStorage.setItem("access_token", data.token?.token || "");
				toast.success("Đăng nhập thành công", {
					duration: 3000,
				});
				navigate({
					to: "/home/families",
				});
			})
			.catch((e) => {
				toast.error("Đăng nhập thất bại", {
					duration: 5000,
					description:
						e.response?.data.message ||
						e.message ||
						"Vui lòng kiểm tra lại thông tin đăng nhập",
				});
				if (e.response?.status === 401) {
					form.setError("email", {
						type: "validate",
						message: "Email hoặc mật khẩu không đúng",
					});
					form.setError("password", {
						type: "validate",
						message: "Email hoặc mật khẩu không đúng",
					});
				}
			});
	};

	return (
		<div className="flex items-center justify-center min-h-[80vh] bg-background p-4">
			<Card className="w-full max-w-md shadow-lg">
				<CardHeader className="space-y-1">
					<CardTitle className="text-2xl font-bold text-center">
						Đăng nhập
					</CardTitle>
					<CardDescription className="text-center">
						Nhập thông tin đăng nhập của bạn
					</CardDescription>
				</CardHeader>

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

							<FormField
								control={form.control}
								name="password"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Mật khẩu</FormLabel>
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

							<div className="text-right">
								<Link
									to="/forgot-password"
									className="text-sm text-primary hover:underline"
								>
									Quên mật khẩu?
								</Link>
							</div>
						</CardContent>

						<CardFooter className="flex flex-col space-y-4">
							<Button
								disabled={isPending}
								type="submit"
								className="w-full"
							>
								Đăng nhập
							</Button>

							<div className="text-center text-sm">
								Chưa có tài khoản?{" "}
								<Link
									to="/register"
									className="text-primary hover:underline"
								>
									Đăng ký
								</Link>
							</div>
						</CardFooter>
					</form>
				</Form>
			</Card>
		</div>
	);
}
