import { Button as ReactEmailButton } from "@react-email/components";
import * as React from "react";

interface ButtonProps {
  href: string;
  children: React.ReactNode;
}

export default function Button({ href, children }: ButtonProps) {
  return (
    <div className="text-center mt-6 mb-6">
      <ReactEmailButton
        href={href}
        className="bg-blue-600 text-white font-medium px-6 py-3 rounded-md text-base text-center no-underline inline-block"
      >
        {children}
      </ReactEmailButton>
    </div>
  );
}
