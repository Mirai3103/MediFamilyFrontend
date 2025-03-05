import React from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { FiChevronLeft } from "react-icons/fi";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
	title: string;
	description?: string;
	backUrl?: string;
	backLabel?: string;
	actions?: React.ReactNode;
	className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
	title,
	description,
	backUrl,
	backLabel = "Quay lại",
	actions,
	className,
}) => {
	return (
		<div className={cn("mb-6 space-y-4", className)}>
			{backUrl && (
				<div>
					<Button
						variant="ghost"
						size="sm"
						asChild
						className="gap-1 pl-0 text-muted-foreground hover:text-foreground"
					>
						<Link to={backUrl}>
							<FiChevronLeft className="h-4 w-4" />
							{backLabel}
						</Link>
					</Button>
				</div>
			)}

			<div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
				<div className="space-y-1">
					<h1 className="text-2xl font-bold tracking-tight md:text-3xl">
						{title}
					</h1>
					{description && (
						<p className="text-muted-foreground">{description}</p>
					)}
				</div>
				{actions && <div className="flex gap-2">{actions}</div>}
			</div>
		</div>
	);
};

export default PageHeader;
