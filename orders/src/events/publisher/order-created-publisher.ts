import { Publisher, OrderCreatedEvent, Subjects } from "@neffuke/common"

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    readonly subject = Subjects.OrderCreated;
}