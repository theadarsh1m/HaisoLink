import * as React from "react";
import { Heading, Text, Section, Row, Column } from "@react-email/components";
import Layout from "./Layout";
import StatusBadge from "./Components/StatusBadge";
import Button from "./Components/Button";

interface DeliveryFailedProps {
  customerName: string;
  trackingNumber: string;
  failureReason: string;
  agentNotes?: string;
}

export default function DeliveryFailed({
  customerName,
  trackingNumber,
  failureReason,
  agentNotes,
}: DeliveryFailedProps) {
  return (
    <Layout previewText="Delivery attempt failed for your package">
      <Heading className="text-2xl font-bold text-center text-gray-800 mb-6 m-0">
        Hi {customerName},
      </Heading>
      <Text className="text-base text-gray-700 text-center m-0 mb-6">
        We attempted to deliver your package <strong>{trackingNumber}</strong> but unfortunately we were not able to complete the delivery.
      </Text>

      <StatusBadge status="FAILED" />

      <Section className="bg-gray-50 border border-gray-200 rounded-lg p-6 mt-8 mb-8">
        <Heading as="h3" className="text-lg font-semibold text-gray-800 m-0 mb-4 border-b border-gray-200 pb-2">
          Failure Details
        </Heading>
        
        <Row className="mb-3">
          <Column className="w-1/3">
            <Text className="text-sm font-medium text-gray-500 m-0">Reason</Text>
          </Column>
          <Column>
            <Text className="text-sm text-gray-800 m-0 font-medium">{failureReason}</Text>
          </Column>
        </Row>
        
        {agentNotes && (
          <Row className="mb-3">
            <Column className="w-1/3">
              <Text className="text-sm font-medium text-gray-500 m-0">Agent Notes</Text>
            </Column>
            <Column>
              <Text className="text-sm text-gray-800 m-0">{agentNotes}</Text>
            </Column>
          </Row>
        )}
      </Section>
      
      <Text className="text-base text-gray-700 text-center m-0 mb-6">
        Don't worry! You can easily reschedule the delivery for a time that works better for you.
      </Text>

      <Button href={`${process.env.NEXT_PUBLIC_APP_URL}/customer/dashboard`}>
        Reschedule Delivery
      </Button>
    </Layout>
  );
}
