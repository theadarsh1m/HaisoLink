import { Img, Section } from "@react-email/components";
import * as React from "react";

export default function Header() {
  return (
    <Section className="bg-slate-900 p-6 text-center">
      <Img
        src={`${process.env.NEXT_PUBLIC_APP_URL || ""}/logo-placeholder.png`}
        width="150"
        height="40"
        alt="HaiSoLink Logo"
        className="mx-auto"
      />
    </Section>
  );
}
