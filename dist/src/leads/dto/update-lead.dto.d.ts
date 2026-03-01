declare enum LeadStatus {
    NEW = "NEW",
    IN_PROGRESS = "IN_PROGRESS",
    DONE = "DONE",
    CANCELED = "CANCELED"
}
export declare class UpdateLeadDto {
    status?: LeadStatus;
    adminComment?: string;
}
export {};
