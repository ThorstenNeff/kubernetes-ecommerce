import { Publisher, ExpirationCompleteEvent, Subjects } from "@neffuke/common"

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    readonly subject = Subjects.ExpirationComplete;
}