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
import useAuthRedirect from "./useAuthRedirect";

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
	useAuthRedirect();
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

	const handleGoogleLogin = () => {
		window.location.href = "/oauth2/authorization/google";
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
							
							<div className="relative flex items-center justify-center w-full">
								<hr className="w-full border-gray-300" />
								<span className="absolute px-3 bg-white text-gray-500 text-sm">Hoặc</span>
							</div>
							
							<Button
								type="button"
								variant="outline"
								className="w-full flex items-center justify-center gap-2"
								onClick={handleGoogleLogin}
							>
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px">
									<path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
									<path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
									<path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
									<path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
								</svg>
								Đăng nhập với Google
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