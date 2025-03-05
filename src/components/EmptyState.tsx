import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";

interface EmptyStateProps {
	icon?: ReactNode;
	title: string;
	description?: string;
	actionLabel?: string;
	actionUrl?: string;
	onClick?: () => void;
	className?: string;
	secondaryAction?: {
		label: string;
		url?: string;
		onClick?: () => void;
	};
}

const EmptyState: React.FC<EmptyStateProps> = ({
	icon,
	title,
	description,
	actionLabel,
	actionUrl,
	onClick,
	className,
	secondaryAction,
}) => {
	return (
		<div
			className={cn(
				"flex flex-col items-center justify-center text-center p-8 rounded-lg border border-dashed",
				className
			)}
		>
			{icon && <div className="mb-4 text-muted-foreground">{icon}</div>}
			<h3 className="text-lg font-medium">{title}</h3>
			{description && (
				<p className="mt-2 text-sm text-muted-foreground max-w-sm">
					{description}
				</p>
			)}
			{(actionLabel || secondaryAction) && (
				<div className="mt-6 flex flex-wrap gap-3 justify-center">
					{actionLabel &&
						(actionUrl ? (
							<Button asChild>
								<Link to={actionUrl}>{actionLabel}</Link>
							</Button>
						) : (
							<Button onClick={onClick}>{actionLabel}</Button>
						))}
					{secondaryAction &&
						(secondaryAction.url ? (
							<Button variant="outline" asChild>
								<Link to={secondaryAction.url}>
									{secondaryAction.label}
								</Link>
							</Button>
						) : (
							<Button
								variant="outline"
								onClick={secondaryAction.onClick}
							>
								{secondaryAction.label}
							</Button>
						))}
				</div>
			)}
		</div>
	);
};

export default EmptyState;
