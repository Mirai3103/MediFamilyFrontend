import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";

const SecuritySection = () => {
	return (
		<Card className="mt-6">
			<CardHeader>
				<CardTitle className="text-lg">Bảo mật</CardTitle>
				<CardDescription>
					Quản lý mật khẩu và các thiết lập bảo mật
				</CardDescription>
			</CardHeader>

			<CardContent>
				<div className="flex items-center justify-between">
					<div className="flex items-start gap-2">
						<Shield className="mt-0.5 h-5 w-5 text-gray-400" />
						<div>
							<p className="font-medium">Thay đổi mật khẩu</p>
							<p className="text-sm text-gray-500">
								Cập nhật mật khẩu định kỳ để bảo vệ tài khoản
								của bạn
							</p>
						</div>
					</div>
					<Button variant="outline">Thay đổi</Button>
				</div>
			</CardContent>
		</Card>
	);
};

export default SecuritySection;
