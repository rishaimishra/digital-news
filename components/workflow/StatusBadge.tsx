import { ArticleStatus } from "@prisma/client"
import { cn } from "@/lib/utils"

interface StatusBadgeProps {
  status: ArticleStatus
  className?: string
}

const statusConfig: Record<ArticleStatus, { label: string; className: string }> = {
  DRAFT: {
    label: "Draft",
    className: "bg-gray-100 text-gray-800 border-gray-200",
  },
  SUBMITTED: {
    label: "Submitted",
    className: "bg-blue-100 text-blue-800 border-blue-200",
  },
  APPROVED: {
    label: "Approved",
    className: "bg-green-100 text-green-800 border-green-200",
  },
  PUBLISHED: {
    label: "Published",
    className: "bg-purple-100 text-purple-800 border-purple-200",
  },
  REJECTED: {
    label: "Rejected",
    className: "bg-red-100 text-red-800 border-red-200",
  },
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status]

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  )
}

