import {
	FiUsers,
	FiActivity,
	FiFileText,
	FiBarChart2,
	FiCheckCircle,
	FiShare2,
} from "react-icons/fi";
import { faker } from "@faker-js/faker";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UnAuthLayout from "@/components/layout/UnAuthLayout";

// Generate fake testimonials
const testimonials = Array(3)
	.fill(null)
	.map(() => ({
		name: faker.person.fullName(),
		role: faker.helpers.arrayElement([
			"Bác sĩ gia đình",
			"Phụ huynh",
			"Người dùng",
		]),
		content: faker.lorem.paragraph(2),
		avatar: `https://placewaifu.com/image/100/100?seed=${faker.number.int(100)}`,
	}));

// Generate fake features
const features = [
	{
		icon: <FiUsers className="h-10 w-10 text-primary" />,
		title: "Quản lý hồ sơ gia đình",
		description:
			"Lưu trữ và quản lý thông tin y tế của tất cả thành viên trong gia đình một cách dễ dàng.",
	},
	{
		icon: <FiActivity className="h-10 w-10 text-primary" />,
		title: "Theo dõi chỉ số sức khỏe",
		description:
			"Theo dõi chỉ số sức khỏe quan trọng như huyết áp, đường huyết, cân nặng theo thời gian.",
	},
	{
		icon: <FiFileText className="h-10 w-10 text-primary" />,
		title: "Quản lý tài liệu y tế",
		description:
			"Lưu trữ và truy cập dễ dàng các tài liệu y tế như đơn thuốc, kết quả xét nghiệm.",
	},
	{
		icon: <FiBarChart2 className="h-10 w-10 text-primary" />,
		title: "So sánh chỉ số với chuẩn",
		description:
			"So sánh các chỉ số sức khỏe với tiêu chuẩn y tế để đánh giá tình trạng sức khỏe.",
	},
	{
		icon: <FiCheckCircle className="h-10 w-10 text-primary" />,
		title: "Nhắc nhở tiêm phòng",
		description:
			"Nhận thông báo về lịch tiêm phòng và các thủ tục y tế định kỳ.",
	},
	{
		icon: <FiShare2 className="h-10 w-10 text-primary" />,
		title: "Chia sẻ hồ sơ với bác sĩ",
		description:
			"Chia sẻ hồ sơ y tế với bác sĩ một cách an toàn thông qua đường dẫn bảo mật.",
	},
];

// Generate fake team members
const team = Array(4)
	.fill(null)
	.map((_, index) => ({
		name: faker.person.fullName(),
		role: faker.helpers.arrayElement([
			"Bác sĩ y khoa",
			"Chuyên gia y tế",
			"Kỹ sư phần mềm",
			"Nhà thiết kế UI/UX",
		]),
		avatar: `https://placewaifu.com/image/150/150?seed=${index}`,
	}));

// Fake pricing plans
const pricingPlans = [
	{
		name: "Cơ bản",
		price: "Miễn phí",
		description: "Dành cho cá nhân hoặc gia đình nhỏ",
		features: [
			"Quản lý 1 hồ sơ gia đình",
			"Tối đa 5 thành viên",
			"Nhắc nhở tiêm phòng cơ bản",
			"Lưu trữ tài liệu y tế cơ bản",
			"Hỗ trợ qua email",
		],
	},
	{
		name: "Tiêu chuẩn",
		price: "199.000đ/tháng",
		description: "Dành cho gia đình lớn",
		features: [
			"Quản lý đến 3 hồ sơ gia đình",
			"Không giới hạn thành viên",
			"Nhắc nhở tiêm phòng đầy đủ",
			"Lưu trữ không giới hạn tài liệu",
			"So sánh chỉ số với tiêu chuẩn y tế",
			"Hỗ trợ 24/7",
		],
		highlighted: true,
	},
	{
		name: "Chuyên nghiệp",
		price: "399.000đ/tháng",
		description: "Dành cho nhiều gia đình",
		features: [
			"Quản lý không giới hạn hồ sơ gia đình",
			"Không giới hạn thành viên",
			"Tất cả tính năng của gói Tiêu chuẩn",
			"Phân tích dữ liệu sức khỏe nâng cao",
			"Kết nối với bác sĩ gia đình",
			"Tư vấn y tế ưu tiên",
			"Hỗ trợ 24/7 qua điện thoại",
		],
	},
];

// Generate fake FAQ questions
const faqs = [
	{
		question: "Dữ liệu của tôi có được bảo mật không?",
		answer: "Có, chúng tôi sử dụng công nghệ mã hóa tiên tiến để bảo vệ dữ liệu của bạn. Chúng tôi tuân thủ các quy định về bảo mật thông tin y tế và không chia sẻ dữ liệu của bạn với bất kỳ bên thứ ba nào mà không có sự đồng ý của bạn.",
	},
	{
		question: "Làm thế nào để chia sẻ hồ sơ với bác sĩ?",
		answer: "Bạn có thể dễ dàng chia sẻ hồ sơ y tế với bác sĩ thông qua tính năng 'Chia sẻ hồ sơ'. Hệ thống sẽ tạo một đường dẫn bảo mật có thời hạn mà bạn có thể gửi cho bác sĩ của mình.",
	},
	{
		question: "Tôi có thể quản lý hồ sơ y tế cho nhiều gia đình không?",
		answer: "Có, tùy thuộc vào gói dịch vụ bạn đăng ký. Gói Cơ bản cho phép quản lý 1 hồ sơ gia đình, gói Tiêu chuẩn cho phép quản lý đến 3 hồ sơ, và gói Chuyên nghiệp không giới hạn số lượng hồ sơ gia đình.",
	},
	{
		question: "Hệ thống có hỗ trợ nhắc nhở tiêm phòng cho trẻ em không?",
		answer: "Có, hệ thống của chúng tôi cung cấp tính năng nhắc nhở tiêm phòng cho mọi lứa tuổi, bao gồm cả lịch tiêm chủng cho trẻ em theo khuyến cáo của Bộ Y tế.",
	},
	{
		question: "Tôi có thể truy cập hệ thống từ điện thoại di động không?",
		answer: "Có, hệ thống của chúng tôi được thiết kế để hoạt động trên mọi thiết bị bao gồm máy tính, máy tính bảng và điện thoại di động.",
	},
];

const LandingPage = () => {
	return (
		<UnAuthLayout>
			<main className="flex-grow">
				{/* Hero Section */}
				<section className="relative py-20 overflow-hidden bg-gray-50">
					<div className="container flex flex-col items-center px-4 py-16 mx-auto md:flex-row">
						<div className="flex flex-col items-start mb-16 text-left lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 md:mb-0">
							<h1 className="mb-8 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
								Quản lý hồ sơ y tế{" "}
								<span className="text-primary">gia đình</span>{" "}
								dễ dàng và an toàn
							</h1>
							<p className="mb-8 text-base leading-relaxed text-gray-700">
								Nền tảng quản lý hồ sơ y tế toàn diện giúp bạn
								theo dõi, cập nhật và chia sẻ thông tin sức khỏe
								của cả gia đình một cách đơn giản và bảo mật.
							</p>
							<div className="flex flex-col space-y-4 sm:items-center sm:justify-center sm:flex-row sm:space-y-0 sm:space-x-4">
								<Button size="lg" className="px-8">
									Đăng ký miễn phí
								</Button>
								<Button
									size="lg"
									variant="outline"
									className="px-8"
								>
									Tìm hiểu thêm
								</Button>
							</div>
							<div className="flex items-center mt-8">
								<Badge variant="outline" className="mr-2">
									Mới
								</Badge>
								<span className="text-sm text-gray-600">
									Tính năng chia sẻ hồ sơ với bác sĩ an toàn!
								</span>
							</div>
						</div>
						<div className="w-full md:w-1/2">
							<div className="relative w-full h-auto overflow-hidden rounded-lg shadow-xl">
								<img
									src="http://s3ui.huuhoang.id.vn/api/v1/download-shared-object/aHR0cDovLzEyNy4wLjAuMTo5MDAwL2ZhbWlseS1oZWFsdGgvaW1hZ2UlMjAlMjgxJTI5LmpwZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPU1DNUNFMzkwMVYyWERSUERJWTM1JTJGMjAyNTA1MTYlMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjUwNTE2VDA3MTkzN1omWC1BbXotRXhwaXJlcz00MzE5OSZYLUFtei1TZWN1cml0eS1Ub2tlbj1leUpoYkdjaU9pSklVelV4TWlJc0luUjVjQ0k2SWtwWFZDSjkuZXlKaFkyTmxjM05MWlhraU9pSk5RelZEUlRNNU1ERldNbGhFVWxCRVNWa3pOU0lzSW1WNGNDSTZNVGMwTnpReU16RTJOU3dpY0dGeVpXNTBJam9pYUc5aFozaDRiR3dpZlEuVXgtLWxmUGJuX3BXaE5jQTc2dTBteDhuOFZJM3Facm9zWENnY0huaUlJNWd0WnozTXZEVi0yWGI3d0VHX0duajhIcnMycmViUk1SVnhJOUx2TXB4UUEmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0JnZlcnNpb25JZD1udWxsJlgtQW16LVNpZ25hdHVyZT1hYjc4ZGM0NDVlNTc2NzY2MDBjMjEzYTkxNTc5ZjA1YTUxMjZjMDM1OWVmNTkzOTFiMTc3YjYyMDhkMjVlNmI4"
									alt="Ứng dụng quản lý hồ sơ y tế gia đình"
									className="object-cover w-full h-full"
								/>
							</div>
						</div>
					</div>
				</section>

				{/* Stats Section */}
				{/* <section className="py-12 bg-white">
					<div className="container px-4 mx-auto">
						<div className="grid grid-cols-2 gap-8 md:grid-cols-4">
							<div className="flex flex-col items-center justify-center">
								<span className="text-4xl font-bold text-primary">
									10k+
								</span>
								<span className="mt-2 text-sm text-gray-600">
									Người dùng
								</span>
							</div>
							<div className="flex flex-col items-center justify-center">
								<span className="text-4xl font-bold text-primary">
									500+
								</span>
								<span className="mt-2 text-sm text-gray-600">
									Bác sĩ tham gia
								</span>
							</div>
							<div className="flex flex-col items-center justify-center">
								<span className="text-4xl font-bold text-primary">
									99.9%
								</span>
								<span className="mt-2 text-sm text-gray-600">
									Thời gian hoạt động
								</span>
							</div>
							<div className="flex flex-col items-center justify-center">
								<span className="text-4xl font-bold text-primary">
									4.9/5
								</span>
								<span className="mt-2 text-sm text-gray-600">
									Đánh giá
								</span>
							</div>
						</div>
					</div>
				</section> */}

				{/* Features Section */}
				<section id="features" className="py-20 bg-gray-50">
					<div className="container px-4 mx-auto">
						<div className="max-w-2xl mx-auto mb-16 text-center">
							<h2 className="text-3xl font-bold">
								Tính năng nổi bật
							</h2>
							<p className="mt-4 text-gray-600">
								MedFamily cung cấp đầy đủ các công cụ để bạn
								quản lý sức khỏe cho cả gia đình
							</p>
						</div>
						<div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
							{features.map((feature, index) => (
								<Card
									key={index}
									className="transition-all duration-300 hover:shadow-lg"
								>
									<CardHeader>
										<div className="mb-2">
											{feature.icon}
										</div>
										<CardTitle>{feature.title}</CardTitle>
									</CardHeader>
									<CardContent>
										<p className="text-gray-600">
											{feature.description}
										</p>
									</CardContent>
								</Card>
							))}
						</div>
					</div>
				</section>

				{/* How It Works */}
				<section className="py-20 bg-white">
					<div className="container px-4 mx-auto">
						<div className="max-w-2xl mx-auto mb-16 text-center">
							<h2 className="text-3xl font-bold">
								Cách thức hoạt động
							</h2>
							<p className="mt-4 text-gray-600">
								Quản lý hồ sơ y tế gia đình chưa bao giờ dễ dàng
								đến thế
							</p>
						</div>

						<div className="relative">
							<div className="absolute hidden w-px h-full bg-gray-200 left-1/2 md:block"></div>

							<div className="space-y-12">
								{/* Step 1 */}
								<div className="relative flex flex-col items-center md:flex-row">
									<div className="flex items-center justify-center w-10 h-10 mb-4 text-white rounded-full bg-primary md:absolute md:left-1/2 md:-ml-5 md:mb-0">
										1
									</div>
									<div className="w-full md:w-1/2 md:pr-16 md:text-right">
										<h3 className="text-xl font-bold">
											Đăng ký tài khoản
										</h3>
										<p className="mt-2 text-gray-600">
											Tạo tài khoản và thiết lập hồ sơ gia
											đình với các thành viên
										</p>
									</div>
									<div className="hidden w-full md:block md:w-1/2 md:pl-16"></div>
								</div>

								{/* Step 2 */}
								<div className="relative flex flex-col items-center md:flex-row">
									<div className="flex items-center justify-center w-10 h-10 mb-4 text-white rounded-full bg-primary md:absolute md:left-1/2 md:-ml-5 md:mb-0">
										2
									</div>
									<div className="hidden w-full md:block md:w-1/2 md:pr-16"></div>
									<div className="w-full md:w-1/2 md:pl-16">
										<h3 className="text-xl font-bold">
											Thêm thông tin y tế
										</h3>
										<p className="mt-2 text-gray-600">
											Lưu trữ thông tin sức khỏe, lịch sử
											khám bệnh, tiêm ngừa và tài liệu y
											tế
										</p>
									</div>
								</div>

								{/* Step 3 */}
								<div className="relative flex flex-col items-center md:flex-row">
									<div className="flex items-center justify-center w-10 h-10 mb-4 text-white rounded-full bg-primary md:absolute md:left-1/2 md:-ml-5 md:mb-0">
										3
									</div>
									<div className="w-full md:w-1/2 md:pr-16 md:text-right">
										<h3 className="text-xl font-bold">
											Theo dõi chỉ số sức khỏe
										</h3>
										<p className="mt-2 text-gray-600">
											Cập nhật và theo dõi các chỉ số sức
											khỏe như cân nặng, huyết áp, đường
											huyết
										</p>
									</div>
									<div className="hidden w-full md:block md:w-1/2 md:pl-16"></div>
								</div>

								{/* Step 4 */}
								<div className="relative flex flex-col items-center md:flex-row">
									<div className="flex items-center justify-center w-10 h-10 mb-4 text-white rounded-full bg-primary md:absolute md:left-1/2 md:-ml-5 md:mb-0">
										4
									</div>
									<div className="hidden w-full md:block md:w-1/2 md:pr-16"></div>
									<div className="w-full md:w-1/2 md:pl-16">
										<h3 className="text-xl font-bold">
											Chia sẻ với bác sĩ
										</h3>
										<p className="mt-2 text-gray-600">
											Chia sẻ hồ sơ y tế với bác sĩ gia
											đình thông qua đường dẫn an toàn
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* Dashboard Preview */}
				<section className="py-20 bg-gray-50">
					<div className="container px-4 mx-auto">
						<div className="max-w-2xl mx-auto mb-16 text-center">
							<h2 className="text-3xl font-bold">
								Trải nghiệm nền tảng
							</h2>
							<p className="mt-4 text-gray-600">
								Giao diện thân thiện và dễ sử dụng cho mọi đối
								tượng người dùng
							</p>
						</div>

						<div className="relative overflow-hidden bg-white rounded-lg shadow-xl">
							<Tabs defaultValue="dashboard">
								<TabsList className="grid w-full grid-cols-3">
									<TabsTrigger value="dashboard">
										Bảng điều khiển
									</TabsTrigger>
									<TabsTrigger value="health">
										Chia sẻ hồ sơ sức khỏe
									</TabsTrigger>
									<TabsTrigger value="vaccination">
										Lịch tiêm ngừa
									</TabsTrigger>
								</TabsList>

								<TabsContent value="dashboard" className="p-0">
									<img
										src="http://s3ui.huuhoang.id.vn/api/v1/download-shared-object/aHR0cDovLzEyNy4wLjAuMTo5MDAwL2ZhbWlseS1oZWFsdGgvU2NyZWVuc2hvdCUyMDIwMjUtMDUtMTYlMjAxNDIwMzQucG5nP1gtQW16LUFsZ29yaXRobT1BV1M0LUhNQUMtU0hBMjU2JlgtQW16LUNyZWRlbnRpYWw9TUM1Q0UzOTAxVjJYRFJQRElZMzUlMkYyMDI1MDUxNiUyRnVzLWVhc3QtMSUyRnMzJTJGYXdzNF9yZXF1ZXN0JlgtQW16LURhdGU9MjAyNTA1MTZUMDcyMzM2WiZYLUFtei1FeHBpcmVzPTQzMTk5JlgtQW16LVNlY3VyaXR5LVRva2VuPWV5SmhiR2NpT2lKSVV6VXhNaUlzSW5SNWNDSTZJa3BYVkNKOS5leUpoWTJObGMzTkxaWGtpT2lKTlF6VkRSVE01TURGV01saEVVbEJFU1Zrek5TSXNJbVY0Y0NJNk1UYzBOelF5TXpFMk5Td2ljR0Z5Wlc1MElqb2lhRzloWjNoNGJHd2lmUS5VeC0tbGZQYm5fcFdoTmNBNzZ1MG14OG44VkkzcVpyb3NYQ2djSG5pSUk1Z3RaejNNdkRWLTJYYjd3RUdfR25qOEhyczJyZWJSTVJWeEk5THZNcHhRQSZYLUFtei1TaWduZWRIZWFkZXJzPWhvc3QmdmVyc2lvbklkPW51bGwmWC1BbXotU2lnbmF0dXJlPTgwYjRmMGFhOWI4MGZjNTg3NDc1MDhlYmE4NGJlOWNkYzdhMzM4M2ExZTQ2N2UyZGMyODBjOWJiMmVmMmYwNjE"
										alt="Dashboard preview"
										className="w-full h-auto"
									/>
								</TabsContent>

								<TabsContent value="health" className="p-0">
									<img
										src="http://s3ui.huuhoang.id.vn/api/v1/download-shared-object/aHR0cDovLzEyNy4wLjAuMTo5MDAwL2ZhbWlseS1oZWFsdGgvU2NyZWVuc2hvdCUyMDIwMjUtMDUtMTYlMjAxNDIxMTkucG5nP1gtQW16LUFsZ29yaXRobT1BV1M0LUhNQUMtU0hBMjU2JlgtQW16LUNyZWRlbnRpYWw9TUM1Q0UzOTAxVjJYRFJQRElZMzUlMkYyMDI1MDUxNiUyRnVzLWVhc3QtMSUyRnMzJTJGYXdzNF9yZXF1ZXN0JlgtQW16LURhdGU9MjAyNTA1MTZUMDcyNDE4WiZYLUFtei1FeHBpcmVzPTQzMjAwJlgtQW16LVNlY3VyaXR5LVRva2VuPWV5SmhiR2NpT2lKSVV6VXhNaUlzSW5SNWNDSTZJa3BYVkNKOS5leUpoWTJObGMzTkxaWGtpT2lKTlF6VkRSVE01TURGV01saEVVbEJFU1Zrek5TSXNJbVY0Y0NJNk1UYzBOelF5TXpFMk5Td2ljR0Z5Wlc1MElqb2lhRzloWjNoNGJHd2lmUS5VeC0tbGZQYm5fcFdoTmNBNzZ1MG14OG44VkkzcVpyb3NYQ2djSG5pSUk1Z3RaejNNdkRWLTJYYjd3RUdfR25qOEhyczJyZWJSTVJWeEk5THZNcHhRQSZYLUFtei1TaWduZWRIZWFkZXJzPWhvc3QmdmVyc2lvbklkPW51bGwmWC1BbXotU2lnbmF0dXJlPWI0M2JmYmU4MGM5MDE4YzJhMThjZDk4ZDRmYmQ1YTNkMWFmODFkMDBjMGEyYWUyZjU5NzI0YTM5Nzk1ZjRhZTA"
										alt="Health tracking preview"
										className="w-full h-auto"
									/>
								</TabsContent>

								<TabsContent
									value="vaccination"
									className="p-0"
								>
									<img
										src="http://s3ui.huuhoang.id.vn/api/v1/download-shared-object/aHR0cDovLzEyNy4wLjAuMTo5MDAwL2ZhbWlseS1oZWFsdGgvU2NyZWVuc2hvdCUyMDIwMjUtMDUtMTYlMjAxNDIxMDMucG5nP1gtQW16LUFsZ29yaXRobT1BV1M0LUhNQUMtU0hBMjU2JlgtQW16LUNyZWRlbnRpYWw9TUM1Q0UzOTAxVjJYRFJQRElZMzUlMkYyMDI1MDUxNiUyRnVzLWVhc3QtMSUyRnMzJTJGYXdzNF9yZXF1ZXN0JlgtQW16LURhdGU9MjAyNTA1MTZUMDcyNDA4WiZYLUFtei1FeHBpcmVzPTQzMjAwJlgtQW16LVNlY3VyaXR5LVRva2VuPWV5SmhiR2NpT2lKSVV6VXhNaUlzSW5SNWNDSTZJa3BYVkNKOS5leUpoWTJObGMzTkxaWGtpT2lKTlF6VkRSVE01TURGV01saEVVbEJFU1Zrek5TSXNJbVY0Y0NJNk1UYzBOelF5TXpFMk5Td2ljR0Z5Wlc1MElqb2lhRzloWjNoNGJHd2lmUS5VeC0tbGZQYm5fcFdoTmNBNzZ1MG14OG44VkkzcVpyb3NYQ2djSG5pSUk1Z3RaejNNdkRWLTJYYjd3RUdfR25qOEhyczJyZWJSTVJWeEk5THZNcHhRQSZYLUFtei1TaWduZWRIZWFkZXJzPWhvc3QmdmVyc2lvbklkPW51bGwmWC1BbXotU2lnbmF0dXJlPThhMTAwMTJmMGNiZTZlYTQ3NzIzNDkyZGUwNDA0YTMzNGQzMjliMGZkMGQ1ODZhZDM2ZTM4NThmNGNhN2EwM2I"
										alt="Vaccination schedule preview"
										className="w-full h-auto"
									/>
								</TabsContent>
							</Tabs>
						</div>
					</div>
				</section>

				{/* Testimonials */}
				<section id="testimonials" className="py-20 bg-white">
					<div className="container px-4 mx-auto">
						<div className="max-w-2xl mx-auto mb-16 text-center">
							<h2 className="text-3xl font-bold">
								Người dùng nói gì về chúng tôi
							</h2>
							<p className="mt-4 text-gray-600">
								Hàng ngàn gia đình đã tin tưởng sử dụng
								MedFamily để quản lý hồ sơ y tế
							</p>
						</div>

						<div className="grid gap-8 md:grid-cols-3">
							{testimonials.map((testimonial, index) => (
								<Card
									key={index}
									className="transition-all duration-300 hover:shadow-lg"
								>
									<CardHeader>
										<div className="flex items-center space-x-4">
											<Avatar>
												<AvatarImage
													src={testimonial.avatar}
													alt={testimonial.name}
												/>
												<AvatarFallback>
													{testimonial.name.charAt(0)}
												</AvatarFallback>
											</Avatar>
											<div>
												<CardTitle className="text-lg">
													{testimonial.name}
												</CardTitle>
												<CardDescription>
													{testimonial.role}
												</CardDescription>
											</div>
										</div>
									</CardHeader>
									<CardContent>
										<p className="text-gray-600">
											"{testimonial.content}"
										</p>
									</CardContent>
								</Card>
							))}
						</div>
					</div>
				</section>

				{/* Pricing */}
				{/* <section id="pricing" className="py-20 bg-gray-50">
					<div className="container px-4 mx-auto">
						<div className="max-w-2xl mx-auto mb-16 text-center">
							<h2 className="text-3xl font-bold">
								Bảng giá dịch vụ
							</h2>
							<p className="mt-4 text-gray-600">
								Lựa chọn gói dịch vụ phù hợp với nhu cầu của gia
								đình bạn
							</p>
						</div>

						<div className="grid gap-8 lg:grid-cols-3">
							{pricingPlans.map((plan, index) => (
								<Card
									key={index}
									className={`transition-all duration-300 hover:shadow-lg ${plan.highlighted ? "border-primary shadow-md" : ""}`}
								>
									<CardHeader>
										<CardTitle className="text-xl">
											{plan.name}
										</CardTitle>
										<div className="mt-4">
											<span className="text-3xl font-bold">
												{plan.price}
											</span>
											{plan.price !== "Miễn phí" && (
												<span className="text-gray-500 text-sm">
													/tháng
												</span>
											)}
										</div>
										<CardDescription className="mt-2">
											{plan.description}
										</CardDescription>
									</CardHeader>
									<CardContent>
										<ul className="space-y-3">
											{plan.features.map(
												(feature, idx) => (
													<li
														key={idx}
														className="flex items-center"
													>
														<FiCheckCircle className="w-5 h-5 mr-2 text-green-500" />
														<span className="text-gray-600">
															{feature}
														</span>
													</li>
												)
											)}
										</ul>
									</CardContent>
									<CardFooter>
										<Button
											className={`w-full ${plan.highlighted ? "" : "bg-gray-800 hover:bg-gray-900"}`}
										>
											{plan.price === "Miễn phí"
												? "Đăng ký ngay"
												: "Dùng thử 14 ngày"}
										</Button>
									</CardFooter>
								</Card>
							))}
						</div>
					</div>
				</section> */}

				{/* FAQ */}
				<section id="faq" className="py-20 bg-white">
					<div className="container px-4 mx-auto">
						<div className="max-w-2xl mx-auto mb-16 text-center">
							<h2 className="text-3xl font-bold">
								Câu hỏi thường gặp
							</h2>
							<p className="mt-4 text-gray-600">
								Giải đáp những thắc mắc phổ biến về dịch vụ của
								chúng tôi
							</p>
						</div>

						<div className="max-w-3xl mx-auto space-y-6">
							{faqs.map((faq, index) => (
								<div
									key={index}
									className="p-6 bg-gray-50 rounded-lg"
								>
									<h3 className="mb-3 text-lg font-medium">
										{faq.question}
									</h3>
									<p className="text-gray-600">
										{faq.answer}
									</p>
								</div>
							))}
						</div>
					</div>
				</section>

				{/* Team */}
				{/* <section id="about" className="py-20 bg-gray-50">
					<div className="container px-4 mx-auto">
						<div className="max-w-2xl mx-auto mb-16 text-center">
							<h2 className="text-3xl font-bold">
								Đội ngũ của chúng tôi
							</h2>
							<p className="mt-4 text-gray-600">
								Những chuyên gia đứng sau MedFamily
							</p>
						</div>

						<div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
							{team.map((member, index) => (
								<div key={index} className="text-center">
									<div className="relative w-48 h-48 mx-auto mb-4 overflow-hidden rounded-full">
										<img
											src={member.avatar}
											alt={member.name}
											className="w-full h-full object-cover"
										/>
									</div>
									<h3 className="text-lg font-medium">
										{member.name}
									</h3>
									<p className="text-gray-600">
										{member.role}
									</p>
								</div>
							))}
						</div>
					</div>
				</section> */}

				{/* CTA */}
				<section className="py-20 text-white bg-primary">
					<div className="container px-4 mx-auto text-center">
						<h2 className="mb-6 text-3xl font-bold">
							Bắt đầu quản lý hồ sơ y tế gia đình ngay hôm nay
						</h2>
						<p className="max-w-2xl mx-auto mb-8 text-white/90">
							Đăng ký miễn phí và trải nghiệm cách quản lý hồ sơ y
							tế gia đình hiện đại, tiện lợi và an toàn.
						</p>
						<div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
							<Button
								size="lg"
								className="px-8 text-primary bg-white hover:bg-gray-100"
							>
								Đăng ký miễn phí
							</Button>
							<Button
								size="lg"
								variant="outline"
								className="px-8 text-white border-white hover:bg-white/10"
							>
								Liên hệ tư vấn
							</Button>
						</div>
					</div>
				</section>
			</main>
		</UnAuthLayout>
	);
};

export default LandingPage;
