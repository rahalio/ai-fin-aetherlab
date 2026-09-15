/**
 * Trainingjobs Domain Types
 *
 * Auto-generated from OpenAPI spec
 * Generator: types-generator v2.0.0
 *
 * This file re-exports types from generated OpenAPI types and adds
 * convenient type aliases for handlers (response types, etc.)
 *
 * ⚠️ DO NOT EDIT MANUALLY - this file is auto-generated
 */

import type { components, operations } from "../openapi/trainingjobs.openapi.types";

// ============================================================================
// Re-export all generated types
// ============================================================================
// Note: components and operations are exported here but should be accessed via namespace
// in main index.ts to avoid duplicate export errors (e.g., blockchain.types.components)

export type { components, operations };


// ============================================================================
// Convenient Type Aliases for Schemas
// ============================================================================

export type BaseWeightNote = components["schemas"]["BaseWeightNote"];
export type SpendReport = components["schemas"]["SpendReport"];
export type SpendRow = components["schemas"]["SpendRow"];
export type TrainingJob = components["schemas"]["TrainingJob"];
export type TrainingJobId = components["schemas"]["TrainingJobId"];
export type TrainingJobListData = components["schemas"]["TrainingJobListData"];
export type TrainingJobStatus = components["schemas"]["TrainingJobStatus"];
export type RegisterBaseWeightRequest = components["schemas"]["RegisterBaseWeightRequest"];
export type TrainingJobCreateRequest = components["schemas"]["TrainingJobCreateRequest"];
export type Spend = operations["listCloudSpend"]["responses"]["200"]["content"]["application/json"]["data"];


// ============================================================================
// Operation Input Types (Request Bodies)
// ============================================================================

// These types represent the input data for create/update operations

export type CreateTrainingJobRequestInput = NonNullable<operations["createTrainingJob"]["requestBody"]>["content"]["application/json"];
export type RegisterTrainingJobBaseWeightRequestInput = NonNullable<operations["registerTrainingJobBaseWeight"]["requestBody"]>["content"]["application/json"];


// ============================================================================
// Operation Parameter Types (Query/Path Parameters)
// ============================================================================

// These types represent parameters for operations without request bodies.
// Aligned with get_input_schema_or_type_name for consistent naming across generators.

export type ListTrainingJobsParams = NonNullable<operations["listTrainingJobs"]["parameters"]["query"]>;
export type GetTrainingJobParams = operations["getTrainingJob"]["parameters"]["path"];
export type StopTrainingJobParams = operations["stopTrainingJob"]["parameters"]["path"];
export type RegisterTrainingJobBaseWeightParams = operations["registerTrainingJobBaseWeight"]["parameters"]["path"];
export type ListCloudSpendParams = NonNullable<operations["listCloudSpend"]["parameters"]["query"]>;


// ============================================================================
// Operation Response Types
// ============================================================================

// These types are used by handlers for type-safe response envelopes

export type ListTrainingJobsResponse = operations["listTrainingJobs"]["responses"]["200"]["content"]["application/json"];
export type CreateTrainingJobResponse = operations["createTrainingJob"]["responses"]["201"]["content"]["application/json"];
export type GetTrainingJobResponse = operations["getTrainingJob"]["responses"]["200"]["content"]["application/json"];
export type StopTrainingJobResponse = operations["stopTrainingJob"]["responses"]["200"]["content"]["application/json"];
export type RegisterTrainingJobBaseWeightResponse = operations["registerTrainingJobBaseWeight"]["responses"]["200"]["content"]["application/json"];
export type ListCloudSpendResponse = operations["listCloudSpend"]["responses"]["200"]["content"]["application/json"];


