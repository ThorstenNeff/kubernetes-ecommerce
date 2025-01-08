import { Publisher, OrderCancelledEvent, Subjects } from "@neffuke/common"

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    readonly subject = Subjects.OrderCancelled;
}