import { Hr, Section, Text, Link } from "@react-email/components";
import * as React from "react";

export default function Footer() {
  return (
    <Section className="px-8 pb-8 pt-4 bg-gray-50 text-center">
      <Hr className="border-gray-200 my-4" />
      <Text className="text-sm text-gray-500 m-0">
        If you have any questions, please reply to this email or contact our support team at{" "}
        <Link href="mailto:support@haisolink.com" className="text-blue-600 underline">
          support@haisolink.com
        </Link>
      </Text>
      <Text className="text-xs text-gray-400 mt-2">
        © {new Date().getFullYear()} HaiSoLink Logistics. All rights reserved.
      </Text>
    </Section>
  );
}
