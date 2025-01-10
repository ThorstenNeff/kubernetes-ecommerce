import { Subjects, Publisher, PaymentCreatedEvent } from "@neffuke/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    readonly subject = Subjects.PaymentCreated;
}