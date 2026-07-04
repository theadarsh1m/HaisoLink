import * as React from "react";
import { Heading, Text, Section, Row, Column } from "@react-email/components";
import Layout from "./Layout";
import StatusBadge from "./Components/StatusBadge";
import Button from "./Components/Button";

interface OrderCreatedProps {
  customerName: string;
  trackingNumber: string;
  pickupAddress: string;
  destinationAddress: string;
  weight: string;
  totalCharges: string;
  orderDate: string;
}

export default function OrderCreated({
  customerName,
  trackingNumber,
  pickupAddress,
  destinationAddress,
  weight,
  totalCharges,
  orderDate,
}: OrderCreatedProps) {
  return (
    <Layout previewText="Your order has been created successfully">
      <Heading className="text-2xl font-bold text-center text-gray-800 mb-6 m-0">
        Hi {customerName},
      </Heading>
      <Text className="text-base text-gray-700 text-center m-0 mb-6">
        Your order <strong>{trackingNumber}</strong> has been created and confirmed. We are currently searching for an available delivery agent.
      </Text>

      <StatusBadge status="CREATED" />

      <Section className="bg-gray-50 border border-gray-200 rounded-lg p-6 mt-8 mb-8">
        <Heading as="h3" className="text-lg font-semibold text-gray-800 m-0 mb-4 border-b border-gray-200 pb-2">
          Order Summary
        </Heading>
        
        <Row className="mb-3">
          <Column className="w-1/3">
            <Text className="text-sm font-medium text-gray-500 m-0">Date</Text>
          </Column>
          <Column>
            <Text className="text-sm text-gray-800 m-0 font-medium">{orderDate}</Text>
          </Column>
        </Row>
        
        <Row className="mb-3">
          <Column className="w-1/3">
            <Text className="text-sm font-medium text-gray-500 m-0">Weight</Text>
          </Column>
          <Column>
            <Text className="text-sm text-gray-800 m-0">{weight}</Text>
          </Column>
        </Row>

        <Row className="mb-3">
          <Column className="w-1/3">
            <Text className="text-sm font-medium text-gray-500 m-0">Pickup</Text>
          </Column>
          <Column>
            <Text className="text-sm text-gray-800 m-0">{pickupAddress}</Text>
          </Column>
        </Row>

        <Row className="mb-3">
          <Column className="w-1/3">
            <Text className="text-sm font-medium text-gray-500 m-0">Destination</Text>
          </Column>
          <Column>
            <Text className="text-sm text-gray-800 m-0">{destinationAddress}</Text>
          </Column>
        </Row>

        <Row className="mt-4 pt-3 border-t border-gray-200">
          <Column className="w-1/3">
            <Text className="text-base font-bold text-gray-800 m-0">Total Charge</Text>
          </Column>
          <Column>
            <Text className="text-base font-bold text-gray-800 m-0">{totalCharges}</Text>
          </Column>
        </Row>
      </Section>

      <Button href={`${process.env.NEXT_PUBLIC_APP_URL}/customer/dashboard`}>
        Track Your Order
      </Button>
    </Layout>
  );
}
