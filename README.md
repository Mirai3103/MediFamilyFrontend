# MediFamily - Frontend

## Giới thiệu

MediFamily là ứng dụng quản lý hồ sơ y tế gia đình, giúp theo dõi sức khỏe của các thành viên trong gia đình một cách dễ dàng và hiệu quả. Đây là phần frontend của hệ thống, được xây dựng bằng React và sử dụng Vite để phát triển.

## Công nghệ sử dụng

- **React 19** - Thư viện UI chính
- **Vite** - Công cụ build và phát triển
- **Tailwind CSS** - Framework CSS tiện dụng
- **Zod** - Xử lý validation schema
- **React Hook Form** - Quản lý form
- **TanStack Router** - Quản lý routing
- **TanStack Query** - Quản lý state server
- **Radix UI** - Các component UI nâng cao
- **Zustand** - Quản lý state cục bộ
- **Axios** - Gọi API

## Cấu trúc dự án
```
.
├── components.json
├── index.html
├── orval.config.ts
├── package.json
├── src
│   ├── components
│   │   ├── layout
│   │   ├── medical
│   │   ├── multi-step-register
│   │   ├── ui
│   ├── hooks
│   ├── lib
│   ├── pages
│   ├── routes
│   ├── schemas
│   ├── stores
│   └── style.css
├── tsconfig.json
└── vite.config.ts
```

## Hướng dẫn cài đặt

### 1. Cài đặt dependencies
```sh
npm install
```

### 2. Chạy dự án ở môi trường phát triển
```sh
npm run dev
```

### 3. Build production
```sh
npm run build
```

### 4. Chạy bản build
```sh
npm run serve
```

## Tạo API client từ OpenAPI spec
```sh
npm run gen-api
```

## Liên hệ
Nếu có bất kỳ vấn đề nào, vui lòng tạo issue trên repository của dự án.

