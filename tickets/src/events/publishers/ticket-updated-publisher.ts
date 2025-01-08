import { Publisher, Subjects, TicketUpdatedEvent } from "@neffuke/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    readonly subject = Subjects.TicketUpdated;
}