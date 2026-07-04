import * as React from "react";
import { Heading, Text, Section, Row, Column } from "@react-email/components";
import Layout from "./Layout";
import StatusBadge from "./Components/StatusBadge";
import Button from "./Components/Button";

interface RescheduledProps {
  customerName: string;
  trackingNumber: string;
  newDeliveryDate: string;
}

export default function Rescheduled({
  customerName,
  trackingNumber,
  newDeliveryDate,
}: RescheduledProps) {
  return (
    <Layout previewText="Your delivery has been rescheduled">
      <Heading className="text-2xl font-bold text-center text-gray-800 mb-6 m-0">
        Hi {customerName},
      </Heading>
      <Text className="text-base text-gray-700 text-center m-0 mb-6">
        Your package <strong>{trackingNumber}</strong> has been successfully rescheduled for a new delivery date.
      </Text>

      <StatusBadge status="RESCHEDULED" />

      <Section className="bg-gray-50 border border-gray-200 rounded-lg p-6 mt-8 mb-8">
        <Heading as="h3" className="text-lg font-semibold text-gray-800 m-0 mb-4 border-b border-gray-200 pb-2">
          New Schedule
        </Heading>
        
        <Row>
          <Column className="w-1/3">
            <Text className="text-sm font-medium text-gray-500 m-0">Delivery Date</Text>
          </Column>
          <Column>
            <Text className="text-sm text-gray-800 m-0 font-medium">{newDeliveryDate}</Text>
          </Column>
        </Row>
      </Section>
      
      <Text className="text-base text-gray-700 text-center m-0 mb-6">
        We will automatically assign a new courier for your updated delivery date and notify you once they are on the way.
      </Text>

      <Button href={`${process.env.NEXT_PUBLIC_APP_URL}/customer/dashboard`}>
        Track Your Order
      </Button>
    </Layout>
  );
}
