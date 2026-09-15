/**
 * Evaluations Domain Types
 *
 * Auto-generated from OpenAPI spec
 * Generator: types-generator v2.0.0
 *
 * This file re-exports types from generated OpenAPI types and adds
 * convenient type aliases for handlers (response types, etc.)
 *
 * ⚠️ DO NOT EDIT MANUALLY - this file is auto-generated
 */

import type { components, operations } from "../openapi/evaluations.openapi.types";

// ============================================================================
// Re-export all generated types
// ============================================================================
// Note: components and operations are exported here but should be accessed via namespace
// in main index.ts to avoid duplicate export errors (e.g., blockchain.types.components)

export type { components, operations };


// ============================================================================
// Convenient Type Aliases for Schemas
// ============================================================================

export type EvaluationId = components["schemas"]["EvaluationId"];
export type EvaluationReport = components["schemas"]["EvaluationReport"];
export type EvaluationReportListData = components["schemas"]["EvaluationReportListData"];
export type EvaluationVerdict = components["schemas"]["EvaluationVerdict"];
export type EvaluationDecisionRequest = components["schemas"]["EvaluationDecisionRequest"];
export type EvaluationReportCreateRequest = components["schemas"]["EvaluationReportCreateRequest"];
export type Evaluation = operations["listEvaluations"]["responses"]["200"]["content"]["application/json"]["data"];


// ============================================================================
// Operation Input Types (Request Bodies)
// ============================================================================

// These types represent the input data for create/update operations

export type CreateEvaluationRequestInput = NonNullable<operations["createEvaluation"]["requestBody"]>["content"]["application/json"];
export type DecideEvaluationRequestInput = NonNullable<operations["decideEvaluation"]["requestBody"]>["content"]["application/json"];


// ============================================================================
// Operation Parameter Types (Query/Path Parameters)
// ============================================================================

// These types represent parameters for operations without request bodies.
// Aligned with get_input_schema_or_type_name for consistent naming across generators.

export type ListEvaluationsParams = NonNullable<operations["listEvaluations"]["parameters"]["query"]>;
export type GetEvaluationParams = operations["getEvaluation"]["parameters"]["path"];
export type DecideEvaluationParams = operations["decideEvaluation"]["parameters"]["path"];


// ============================================================================
// Operation Response Types
// ============================================================================

// These types are used by handlers for type-safe response envelopes

export type ListEvaluationsResponse = operations["listEvaluations"]["responses"]["200"]["content"]["application/json"];
export type CreateEvaluationResponse = operations["createEvaluation"]["responses"]["201"]["content"]["application/json"];
export type GetEvaluationResponse = operations["getEvaluation"]["responses"]["200"]["content"]["application/json"];
export type DecideEvaluationResponse = operations["decideEvaluation"]["responses"]["200"]["content"]["application/json"];


