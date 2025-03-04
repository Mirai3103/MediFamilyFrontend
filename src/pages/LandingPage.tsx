import {
	FiHome,
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
		<div className="flex flex-col min-h-screen">
			{/* Navigation */}
			<header className="sticky top-0 z-50 w-full bg-white border-b shadow-sm">
				<div className="container flex items-center justify-between h-16 mx-auto">
					<div className="flex items-center space-x-2">
						<FiActivity className="w-8 h-8 text-primary" />
						<span className="text-xl font-bold">MedFamily</span>
					</div>

					<nav className="hidden space-x-6 md:flex">
						<a
							href="#features"
							className="text-sm font-medium hover:text-primary"
						>
							Tính năng
						</a>
						<a
							href="#pricing"
							className="text-sm font-medium hover:text-primary"
						>
							Bảng giá
						</a>
						<a
							href="#testimonials"
							className="text-sm font-medium hover:text-primary"
						>
							Đánh giá
						</a>
						<a
							href="#faq"
							className="text-sm font-medium hover:text-primary"
						>
							FAQ
						</a>
						<a
							href="#about"
							className="text-sm font-medium hover:text-primary"
						>
							Về chúng tôi
						</a>
					</nav>

					<div className="flex items-center space-x-4">
						<Button
							variant="outline"
							className="hidden sm:inline-flex"
						>
							Đăng nhập
						</Button>
						<Button>Đăng ký ngay</Button>
					</div>
				</div>
			</header>

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
									src="https://placewaifu.com/image/600/400"
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
										Theo dõi sức khỏe
									</TabsTrigger>
									<TabsTrigger value="vaccination">
										Lịch tiêm ngừa
									</TabsTrigger>
								</TabsList>

								<TabsContent value="dashboard" className="p-0">
									<img
										src="https://placewaifu.com/image/1000/600"
										alt="Dashboard preview"
										className="w-full h-auto"
									/>
								</TabsContent>

								<TabsContent value="health" className="p-0">
									<img
										src="https://placewaifu.com/image/1000/600?seed=2"
										alt="Health tracking preview"
										className="w-full h-auto"
									/>
								</TabsContent>

								<TabsContent
									value="vaccination"
									className="p-0"
								>
									<img
										src="https://placewaifu.com/image/1000/600?seed=3"
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
				<section id="about" className="py-20 bg-gray-50">
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
				</section>

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

			{/* Footer */}
			<footer className="bg-gray-900 text-white">
				<div className="container px-4 pt-16 pb-8 mx-auto">
					<div className="grid gap-10 mb-10 md:grid-cols-2 lg:grid-cols-4">
						<div>
							<div className="flex items-center mb-4 space-x-2">
								<FiActivity className="w-6 h-6 text-primary" />
								<span className="text-xl font-bold">
									MedFamily
								</span>
							</div>
							<p className="mb-4 text-gray-400">
								Quản lý hồ sơ y tế gia đình dễ dàng và an toàn.
							</p>
							<div className="flex space-x-4">
								<a
									href="#"
									className="text-gray-400 hover:text-white"
								>
									<svg
										className="w-6 h-6"
										fill="currentColor"
										viewBox="0 0 24 24"
										aria-hidden="true"
									>
										<path
											fillRule="evenodd"
											d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
											clipRule="evenodd"
										></path>
									</svg>
								</a>
								<a
									href="#"
									className="text-gray-400 hover:text-white"
								>
									<svg
										className="w-6 h-6"
										fill="currentColor"
										viewBox="0 0 24 24"
										aria-hidden="true"
									>
										<path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
									</svg>
								</a>
								<a
									href="#"
									className="text-gray-400 hover:text-white"
								>
									<svg
										className="w-6 h-6"
										fill="currentColor"
										viewBox="0 0 24 24"
										aria-hidden="true"
									>
										<path
											fillRule="evenodd"
											d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
											clipRule="evenodd"
										></path>
									</svg>
								</a>
								<a
									href="#"
									className="text-gray-400 hover:text-white"
								>
									<svg
										className="w-6 h-6"
										fill="currentColor"
										viewBox="0 0 24 24"
										aria-hidden="true"
									>
										<path
											fillRule="evenodd"
											d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z"
											clipRule="evenodd"
										></path>
									</svg>
								</a>
							</div>
						</div>

						<div>
							<h3 className="mb-6 text-lg font-semibold">
								Dịch vụ
							</h3>
							<ul className="space-y-3">
								<li>
									<a
										href="#"
										className="text-gray-400 hover:text-white"
									>
										Quản lý hồ sơ
									</a>
								</li>
								<li>
									<a
										href="#"
										className="text-gray-400 hover:text-white"
									>
										Theo dõi sức khỏe
									</a>
								</li>
								<li>
									<a
										href="#"
										className="text-gray-400 hover:text-white"
									>
										Nhắc nhở tiêm phòng
									</a>
								</li>
								<li>
									<a
										href="#"
										className="text-gray-400 hover:text-white"
									>
										Chia sẻ hồ sơ
									</a>
								</li>
								<li>
									<a
										href="#"
										className="text-gray-400 hover:text-white"
									>
										Tư vấn sức khỏe
									</a>
								</li>
							</ul>
						</div>

						<div>
							<h3 className="mb-6 text-lg font-semibold">
								Thông tin
							</h3>
							<ul className="space-y-3">
								<li>
									<a
										href="#"
										className="text-gray-400 hover:text-white"
									>
										Về chúng tôi
									</a>
								</li>
								<li>
									<a
										href="#"
										className="text-gray-400 hover:text-white"
									>
										Chính sách bảo mật
									</a>
								</li>
								<li>
									<a
										href="#"
										className="text-gray-400 hover:text-white"
									>
										Điều khoản sử dụng
									</a>
								</li>
								<li>
									<a
										href="#"
										className="text-gray-400 hover:text-white"
									>
										Hướng dẫn sử dụng
									</a>
								</li>
								<li>
									<a
										href="#"
										className="text-gray-400 hover:text-white"
									>
										Blog
									</a>
								</li>
							</ul>
						</div>

						<div>
							<h3 className="mb-6 text-lg font-semibold">
								Liên hệ
							</h3>
							<ul className="space-y-3">
								<li className="flex items-start space-x-3">
									<FiHome className="w-5 h-5 mt-1 text-gray-400" />
									<span className="text-gray-400">
										123 Đường Lê Lợi, Quận 1, TP. HCM
									</span>
								</li>
								<li className="flex items-center space-x-3">
									<svg
										className="w-5 h-5 text-gray-400"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
										></path>
									</svg>
									<span className="text-gray-400">
										info@medfamily.vn
									</span>
								</li>
								<li className="flex items-center space-x-3">
									<svg
										className="w-5 h-5 text-gray-400"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
										></path>
									</svg>
									<span className="text-gray-400">
										+84 123 456 789
									</span>
								</li>
							</ul>
						</div>
					</div>

					<div className="pt-8 mt-8 border-t border-gray-800">
						<div className="flex flex-col items-center justify-between md:flex-row">
							<p className="mb-4 text-sm text-gray-400 md:mb-0">
								&copy; {new Date().getFullYear()} MedFamily. Tất
								cả các quyền được bảo lưu.
							</p>
							<div className="flex space-x-6">
								<a
									href="#"
									className="text-sm text-gray-400 hover:text-white"
								>
									Bảo mật
								</a>
								<a
									href="#"
									className="text-sm text-gray-400 hover:text-white"
								>
									Điều khoản
								</a>
								<a
									href="#"
									className="text-sm text-gray-400 hover:text-white"
								>
									Cookie
								</a>
							</div>
						</div>
					</div>
				</div>
			</footer>
		</div>
	);
};

export default LandingPage;
