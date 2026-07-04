import { Text } from "@react-email/components";
import * as React from "react";

interface StatusBadgeProps {
  status: string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  let bgColor = "#e2e8f0";
  let textColor = "#1e293b";

  switch (status.toUpperCase()) {
    case "CREATED":
      bgColor = "#dbeafe";
      textColor = "#1e40af";
      break;
    case "ASSIGNED":
    case "PICKED_UP":
    case "IN_TRANSIT":
    case "OUT_FOR_DELIVERY":
      bgColor = "#fef3c7";
      textColor = "#b45309";
      break;
    case "DELIVERED":
      bgColor = "#dcfce7";
      textColor = "#166534";
      break;
    case "FAILED":
    case "CANCELLED":
      bgColor = "#fee2e2";
      textColor = "#991b1b";
      break;
    case "RESCHEDULED":
      bgColor = "#f3e8ff";
      textColor = "#6b21a8";
      break;
  }

  return (
    <div className="text-center mt-4">
      <Text
        className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold uppercase tracking-wider m-0"
        style={{ backgroundColor: bgColor, color: textColor }}
      >
        {status.replace(/_/g, " ")}
      </Text>
    </div>
  );
}
