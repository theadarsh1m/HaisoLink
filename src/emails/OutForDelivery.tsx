import * as React from "react";
import { Heading, Text, Section, Row, Column } from "@react-email/components";
import Layout from "./Layout";
import StatusBadge from "./Components/StatusBadge";
import Button from "./Components/Button";

interface OutForDeliveryProps {
  customerName: string;
  trackingNumber: string;
  estimatedArrival: string;
  agentName: string;
  contactNumber: string;
}

export default function OutForDelivery({
  customerName,
  trackingNumber,
  estimatedArrival,
  agentName,
  contactNumber,
}: OutForDeliveryProps) {
  return (
    <Layout previewText="Your package is out for delivery">
      <Heading className="text-2xl font-bold text-center text-gray-800 mb-6 m-0">
        Hi {customerName},
      </Heading>
      <Text className="text-base text-gray-700 text-center m-0 mb-6">
        Your package <strong>{trackingNumber}</strong> is out for delivery today! Please make sure someone is available to receive it.
      </Text>

      <StatusBadge status="OUT_FOR_DELIVERY" />

      <Section className="bg-gray-50 border border-gray-200 rounded-lg p-6 mt-8 mb-8">
        <Heading as="h3" className="text-lg font-semibold text-gray-800 m-0 mb-4 border-b border-gray-200 pb-2">
          Delivery Details
        </Heading>
        
        <Row className="mb-3">
          <Column className="w-1/3">
            <Text className="text-sm font-medium text-gray-500 m-0">Est. Arrival</Text>
          </Column>
          <Column>
            <Text className="text-sm text-gray-800 m-0 font-medium">{estimatedArrival}</Text>
          </Column>
        </Row>
        
        <Row className="mb-3">
          <Column className="w-1/3">
            <Text className="text-sm font-medium text-gray-500 m-0">Courier Name</Text>
          </Column>
          <Column>
            <Text className="text-sm text-gray-800 m-0">{agentName}</Text>
          </Column>
        </Row>

        <Row className="mb-3">
          <Column className="w-1/3">
            <Text className="text-sm font-medium text-gray-500 m-0">Contact</Text>
          </Column>
          <Column>
            <Text className="text-sm text-gray-800 m-0">{contactNumber}</Text>
          </Column>
        </Row>
      </Section>

      <Button href={`${process.env.NEXT_PUBLIC_APP_URL}/customer/dashboard`}>
        Track Your Order
      </Button>
    </Layout>
  );
}
