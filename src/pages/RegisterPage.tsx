import UnAuthLayout from "@/components/layout/UnAuthLayout";
import { MultiStepRegister } from "@/components/multi-step-register";

export default function RegisterPage() {
	return (
		<UnAuthLayout>
			<MultiStepRegister />
		</UnAuthLayout>
	);
}
