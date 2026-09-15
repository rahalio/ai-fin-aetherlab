export interface IntegrationEventTypeDefinition {
  type?: string;
  domain?: string;
  aggregateType?: string;
  description?: string;
  defaultDeliveryMode?: string;
}
