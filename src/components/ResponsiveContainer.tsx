import React from "react";
import { cn } from "@/lib/utils";

interface ResponsiveContainerProps {
	children: React.ReactNode;
	className?: string;
	noPadding?: boolean;
}

export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
	children,
	className,
	noPadding = false,
}) => {
	return (
		<div
			className={cn(
				"w-full mx-auto",
				!noPadding && "px-4 sm:px-6 md:px-8",
				"max-w-7xl",
				className
			)}
		>
			{children}
		</div>
	);
};

export default ResponsiveContainer;
