import * as React from "react";
import { Heading, Text, Section, Row, Column } from "@react-email/components";
import Layout from "./Layout";
import StatusBadge from "./Components/StatusBadge";
import Button from "./Components/Button";

interface OrderAssignedProps {
  customerName: string;
  trackingNumber: string;
  agentName: string;
  vehicleType: string;
  estimatedPickupTime: string;
}

export default function OrderAssigned({
  customerName,
  trackingNumber,
  agentName,
  vehicleType,
  estimatedPickupTime,
}: OrderAssignedProps) {
  return (
    <Layout previewText="A delivery agent has been assigned to your order">
      <Heading className="text-2xl font-bold text-center text-gray-800 mb-6 m-0">
        Hi {customerName},
      </Heading>
      <Text className="text-base text-gray-700 text-center m-0 mb-6">
        Great news! A delivery agent has been assigned to your order <strong>{trackingNumber}</strong> and will be arriving shortly.
      </Text>

      <StatusBadge status="ASSIGNED" />

      <Section className="bg-gray-50 border border-gray-200 rounded-lg p-6 mt-8 mb-8">
        <Heading as="h3" className="text-lg font-semibold text-gray-800 m-0 mb-4 border-b border-gray-200 pb-2">
          Courier Details
        </Heading>
        
        <Row className="mb-3">
          <Column className="w-1/3">
            <Text className="text-sm font-medium text-gray-500 m-0">Agent Name</Text>
          </Column>
          <Column>
            <Text className="text-sm text-gray-800 m-0 font-medium">{agentName}</Text>
          </Column>
        </Row>
        
        <Row className="mb-3">
          <Column className="w-1/3">
            <Text className="text-sm font-medium text-gray-500 m-0">Vehicle Type</Text>
          </Column>
          <Column>
            <Text className="text-sm text-gray-800 m-0">{vehicleType}</Text>
          </Column>
        </Row>

        <Row className="mb-3">
          <Column className="w-1/3">
            <Text className="text-sm font-medium text-gray-500 m-0">Est. Pickup</Text>
          </Column>
          <Column>
            <Text className="text-sm text-gray-800 m-0">{estimatedPickupTime}</Text>
          </Column>
        </Row>
      </Section>

      <Button href={`${process.env.NEXT_PUBLIC_APP_URL}/customer/dashboard`}>
        Track Courier
      </Button>
    </Layout>
  );
}
