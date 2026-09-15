/**
 * Models Domain Types
 *
 * Auto-generated from OpenAPI spec
 * Generator: types-generator v2.0.0
 *
 * This file re-exports types from generated OpenAPI types and adds
 * convenient type aliases for handlers (response types, etc.)
 *
 * ⚠️ DO NOT EDIT MANUALLY - this file is auto-generated
 */

import type { components, operations } from "../openapi/models.openapi.types";

// ============================================================================
// Re-export all generated types
// ============================================================================
// Note: components and operations are exported here but should be accessed via namespace
// in main index.ts to avoid duplicate export errors (e.g., blockchain.types.components)

export type { components, operations };


// ============================================================================
// Convenient Type Aliases for Schemas
// ============================================================================

export type CloudLocus = components["schemas"]["CloudLocus"];
export type Model = components["schemas"]["Model"];
export type ModelId = components["schemas"]["ModelId"];
export type ModelListData = components["schemas"]["ModelListData"];
export type ModelStatus = components["schemas"]["ModelStatus"];
export type ForceRegisterDarkFindRequest = components["schemas"]["ForceRegisterDarkFindRequest"];
export type ModelCreateRequest = components["schemas"]["ModelCreateRequest"];
export type RetireModelRequest = components["schemas"]["RetireModelRequest"];
export type VModel = operations["listModels"]["responses"]["200"]["content"]["application/json"]["data"];


// ============================================================================
// Operation Input Types (Request Bodies)
// ============================================================================

// These types represent the input data for create/update operations

export type CreateModelRequestInput = NonNullable<operations["createModel"]["requestBody"]>["content"]["application/json"];
export type ForceRegisterDarkFindRequestInput = NonNullable<operations["forceRegisterDarkFind"]["requestBody"]>["content"]["application/json"];
export type RetireModelRequestInput = NonNullable<operations["retireModel"]["requestBody"]>["content"]["application/json"];


// ============================================================================
// Operation Parameter Types (Query/Path Parameters)
// ============================================================================

// These types represent parameters for operations without request bodies.
// Aligned with get_input_schema_or_type_name for consistent naming across generators.

export type ListModelsParams = NonNullable<operations["listModels"]["parameters"]["query"]>;
export type GetModelParams = operations["getModel"]["parameters"]["path"];
export type RetireModelParams = operations["retireModel"]["parameters"]["path"];


// ============================================================================
// Operation Response Types
// ============================================================================

// These types are used by handlers for type-safe response envelopes

export type ListModelsResponse = operations["listModels"]["responses"]["200"]["content"]["application/json"];
export type CreateModelResponse = operations["createModel"]["responses"]["201"]["content"]["application/json"];
export type GetModelResponse = operations["getModel"]["responses"]["200"]["content"]["application/json"];
export type ForceRegisterDarkFindResponse = operations["forceRegisterDarkFind"]["responses"]["201"]["content"]["application/json"];
export type RetireModelResponse = operations["retireModel"]["responses"]["200"]["content"]["application/json"];


