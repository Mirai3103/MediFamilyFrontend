import { createFileRoute } from "@tanstack/react-router";
import React from "react";

type Provider = "google";

export const Route = createFileRoute("/callback/$provider")({
 component: RouteComponent,
 validateSearch: (search) => {
   return {
     token: search.token as string | undefined,
   };
 },
});

function RouteComponent() {
 const { token } = Route.useSearch();
 const navigate = Route.useNavigate();
 const { provider } = Route.useParams();

 React.useEffect(() => {
   if (token) {
     localStorage.setItem("access_token", token);
     window.location.href = "/home";
   }
 }, [token]);

 return (
   <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
     <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
       <div className="flex items-center justify-center mb-6">
         <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
           </svg>
         </div>
       </div>
       
       <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Đăng nhập thất bại</h2>
       <p className="text-gray-600 text-center mb-6">
         Có lỗi xảy ra khi đăng nhập với {provider}. Vui lòng thử lại sau.
       </p>
       
       <div className="flex justify-center">
         <button
           onClick={() => navigate({ to: "/" })}
           className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center"
         >
           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
           </svg>
           Quay về trang chủ
         </button>
       </div>
     </div>
   </div>
 );
}