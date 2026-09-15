/**
 * Monitors Domain Types
 *
 * Auto-generated from OpenAPI spec
 * Generator: types-generator v2.0.0
 *
 * This file re-exports types from generated OpenAPI types and adds
 * convenient type aliases for handlers (response types, etc.)
 *
 * ⚠️ DO NOT EDIT MANUALLY - this file is auto-generated
 */

import type { components, operations } from "../openapi/monitors.openapi.types";

// ============================================================================
// Re-export all generated types
// ============================================================================
// Note: components and operations are exported here but should be accessed via namespace
// in main index.ts to avoid duplicate export errors (e.g., blockchain.types.components)

export type { components, operations };


// ============================================================================
// Convenient Type Aliases for Schemas
// ============================================================================

export type Monitor = components["schemas"]["Monitor"];
export type MonitorId = components["schemas"]["MonitorId"];
export type MonitorListData = components["schemas"]["MonitorListData"];
export type MonitorMetric = components["schemas"]["MonitorMetric"];
export type MonitorStatus = components["schemas"]["MonitorStatus"];
export type AcknowledgeMonitorRequest = components["schemas"]["AcknowledgeMonitorRequest"];
export type MonitorCreateRequest = components["schemas"]["MonitorCreateRequest"];


// ============================================================================
// Operation Input Types (Request Bodies)
// ============================================================================

// These types represent the input data for create/update operations

export type CreateMonitorRequestInput = NonNullable<operations["createMonitor"]["requestBody"]>["content"]["application/json"];
export type AcknowledgeMonitorRequestInput = NonNullable<operations["acknowledgeMonitor"]["requestBody"]>["content"]["application/json"];


// ============================================================================
// Operation Parameter Types (Query/Path Parameters)
// ============================================================================

// These types represent parameters for operations without request bodies.
// Aligned with get_input_schema_or_type_name for consistent naming across generators.

export type ListMonitorsParams = NonNullable<operations["listMonitors"]["parameters"]["query"]>;
export type GetMonitorParams = operations["getMonitor"]["parameters"]["path"];
export type AcknowledgeMonitorParams = operations["acknowledgeMonitor"]["parameters"]["path"];


// ============================================================================
// Operation Response Types
// ============================================================================

// These types are used by handlers for type-safe response envelopes

export type ListMonitorsResponse = operations["listMonitors"]["responses"]["200"]["content"]["application/json"];
export type CreateMonitorResponse = operations["createMonitor"]["responses"]["201"]["content"]["application/json"];
export type GetMonitorResponse = operations["getMonitor"]["responses"]["200"]["content"]["application/json"];
export type AcknowledgeMonitorResponse = operations["acknowledgeMonitor"]["responses"]["200"]["content"]["application/json"];


