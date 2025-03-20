import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { registerSchema, RegisterFormValues } from "@/schemas/auth-schema";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { BasicInfoStep } from "./basic-info-step";
import { DoctorInfoStep } from "./doctor-info-step";

export function MultiStepRegister() {
	const [step, setStep] = useState(0);

	const methods = useForm<RegisterFormValues>({
		resolver: zodResolver(registerSchema),
		defaultValues: {
			username: "",
			password: "",
			email: "",
			fullName: "",
			isDoctor: false,
		},
		mode: "onChange",
	});

	const { handleSubmit, watch } = methods;
	const isDoctor = watch("isDoctor");

	const onSubmit = (data: RegisterFormValues) => {
		console.log("Form submitted:", data);
		// Thực hiện API call để đăng ký
		alert("Đăng ký thành công!");
	};

	const goToNext = async () => {
		const isValid = await methods.trigger([
			"username",
			"password",
			"email",
			"fullName",
			"dateOfBirth",
			"isDoctor",
		]);

		if (isValid) {
			setStep(1);
		}
	};

	const goToPrevious = () => {
		setStep(0);
	};

	return (
		<div className="flex items-center justify-center min-h-[80vh] bg-background p-4">
			<Card className="w-full max-w-md shadow-lg">
				<CardHeader className="space-y-1">
					<CardTitle className="text-2xl font-bold text-center">
						Đăng ký tài khoản
					</CardTitle>
					<CardDescription className="text-center">
						{step === 0
							? "Nhập thông tin tài khoản của bạn"
							: "Thông tin bác sĩ"}
					</CardDescription>
				</CardHeader>

				<FormProvider {...methods}>
					<form onSubmit={handleSubmit(onSubmit)}>
						<CardContent className="space-y-4">
							<AnimatePresence mode="wait">
								{step === 0 ? (
									<motion.div
										key="step-1"
										initial={{ opacity: 0, x: -20 }}
										animate={{ opacity: 1, x: 0 }}
										exit={{ opacity: 0, x: 20 }}
										transition={{ duration: 0.2 }}
									>
										<BasicInfoStep />
									</motion.div>
								) : (
									<motion.div
										key="step-2"
										initial={{ opacity: 0, x: 20 }}
										animate={{ opacity: 1, x: 0 }}
										exit={{ opacity: 0, x: -20 }}
										transition={{ duration: 0.2 }}
									>
										<DoctorInfoStep />
									</motion.div>
								)}
							</AnimatePresence>
						</CardContent>

						<CardFooter className="flex justify-between">
							{step === 1 ? (
								<div className="pt-2 flex justify-between w-full">
									<Button
										type="button"
										variant="outline"
										onClick={goToPrevious}
									>
										Quay lại
									</Button>
									<Button type="submit">Đăng ký</Button>
								</div>
							) : (
								<div className="pt-2 flex justify-end w-full">
									{/* Spacer */}
									{isDoctor ? (
										<Button
											type="button"
											onClick={goToNext}
										>
											Tiếp theo
										</Button>
									) : (
										<Button type="submit">Đăng ký</Button>
									)}
								</div>
							)}
						</CardFooter>
					</form>
				</FormProvider>
			</Card>
		</div>
	);
}
