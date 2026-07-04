import { render } from "@react-email/components";
import * as React from "react";
import OrderCreated from "@/emails/OrderCreated";
import OrderAssigned from "@/emails/OrderAssigned";
import PickedUp from "@/emails/PickedUp";
import InTransit from "@/emails/InTransit";
import OutForDelivery from "@/emails/OutForDelivery";
import Delivered from "@/emails/Delivered";
import DeliveryFailed from "@/emails/DeliveryFailed";
import Rescheduled from "@/emails/Rescheduled";

export async function renderOrderCreatedHtml(props: any): Promise<string> {
  return await render(React.createElement(OrderCreated, props));
}

export async function renderOrderAssignedHtml(props: any): Promise<string> {
  return await render(React.createElement(OrderAssigned, props));
}

export async function renderPickedUpHtml(props: any): Promise<string> {
  return await render(React.createElement(PickedUp, props));
}

export async function renderInTransitHtml(props: any): Promise<string> {
  return await render(React.createElement(InTransit, props));
}

export async function renderOutForDeliveryHtml(props: any): Promise<string> {
  return await render(React.createElement(OutForDelivery, props));
}

export async function renderDeliveredHtml(props: any): Promise<string> {
  return await render(React.createElement(Delivered, props));
}

export async function renderDeliveryFailedHtml(props: any): Promise<string> {
  return await render(React.createElement(DeliveryFailed, props));
}

export async function renderRescheduledHtml(props: any): Promise<string> {
  return await render(React.createElement(Rescheduled, props));
}
