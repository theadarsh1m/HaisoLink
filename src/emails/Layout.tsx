import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Tailwind,
} from "@react-email/components";
import * as React from "react";
import Header from "./Components/Header";
import Footer from "./Components/Footer";

interface LayoutProps {
  previewText: string;
  children: React.ReactNode;
}

export default function Layout({ previewText, children }: LayoutProps) {
  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-gray-100 font-sans text-gray-900 m-0 p-0">
          <Container className="bg-white mx-auto mt-8 mb-8 rounded-lg shadow-sm max-w-xl overflow-hidden">
            <Header />
            <div className="p-8">
              {children}
            </div>
            <Footer />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
