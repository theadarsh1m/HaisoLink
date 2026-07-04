import * as React from "react";
import { Heading, Text } from "@react-email/components";
import Layout from "./Layout";
import StatusBadge from "./Components/StatusBadge";
import Button from "./Components/Button";

interface PickedUpProps {
  customerName: string;
  trackingNumber: string;
}

export default function PickedUp({
  customerName,
  trackingNumber,
}: PickedUpProps) {
  return (
    <Layout previewText="Your package has been picked up">
      <Heading className="text-2xl font-bold text-center text-gray-800 mb-6 m-0">
        Hi {customerName},
      </Heading>
      <Text className="text-base text-gray-700 text-center m-0 mb-6">
        Your package for order <strong>{trackingNumber}</strong> has been picked up successfully by our courier.
      </Text>

      <StatusBadge status="PICKED_UP" />

      <Button href={`${process.env.NEXT_PUBLIC_APP_URL}/customer/dashboard`}>
        Track Your Order
      </Button>
    </Layout>
  );
}
