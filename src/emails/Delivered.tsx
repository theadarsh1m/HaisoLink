import * as React from "react";
import { Heading, Text, Section, Row, Column } from "@react-email/components";
import Layout from "./Layout";
import StatusBadge from "./Components/StatusBadge";
import Button from "./Components/Button";

interface DeliveredProps {
  customerName: string;
  trackingNumber: string;
  deliveryTime: string;
  recipientName: string;
  deliveryNotes?: string;
}

export default function Delivered({
  customerName,
  trackingNumber,
  deliveryTime,
  recipientName,
  deliveryNotes,
}: DeliveredProps) {
  return (
    <Layout previewText="Your package has been delivered!">
      <Heading className="text-2xl font-bold text-center text-gray-800 mb-6 m-0">
        Hi {customerName},
      </Heading>
      <Text className="text-base text-gray-700 text-center m-0 mb-6">
        Great news! Your package <strong>{trackingNumber}</strong> has been successfully delivered. Thank you for choosing HaiSoLink Logistics.
      </Text>

      <StatusBadge status="DELIVERED" />

      <Section className="bg-gray-50 border border-gray-200 rounded-lg p-6 mt-8 mb-8">
        <Heading as="h3" className="text-lg font-semibold text-gray-800 m-0 mb-4 border-b border-gray-200 pb-2">
          Proof of Delivery
        </Heading>
        
        <Row className="mb-3">
          <Column className="w-1/3">
            <Text className="text-sm font-medium text-gray-500 m-0">Delivery Time</Text>
          </Column>
          <Column>
            <Text className="text-sm text-gray-800 m-0 font-medium">{deliveryTime}</Text>
          </Column>
        </Row>
        
        <Row className="mb-3">
          <Column className="w-1/3">
            <Text className="text-sm font-medium text-gray-500 m-0">Received By</Text>
          </Column>
          <Column>
            <Text className="text-sm text-gray-800 m-0">{recipientName}</Text>
          </Column>
        </Row>

        {deliveryNotes && (
          <Row className="mb-3">
            <Column className="w-1/3">
              <Text className="text-sm font-medium text-gray-500 m-0">Notes</Text>
            </Column>
            <Column>
              <Text className="text-sm text-gray-800 m-0">{deliveryNotes}</Text>
            </Column>
          </Row>
        )}
      </Section>

      <Button href={`${process.env.NEXT_PUBLIC_APP_URL}/customer/dashboard`}>
        View Receipt
      </Button>
    </Layout>
  );
}
