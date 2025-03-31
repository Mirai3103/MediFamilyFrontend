import UnAuthLayout from "@/components/layout/UnAuthLayout";
import { MultiStepRegister } from "@/components/multi-step-register";
import useAuthRedirect from "./useAuthRedirect";

export default function RegisterPage() {
	useAuthRedirect();
	return (
		<UnAuthLayout>
			<MultiStepRegister />
		</UnAuthLayout>
	);
}
