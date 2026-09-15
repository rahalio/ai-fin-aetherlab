/**
 * Projects Domain Types
 *
 * Auto-generated from OpenAPI spec
 * Generator: types-generator v2.0.0
 *
 * This file re-exports types from generated OpenAPI types and adds
 * convenient type aliases for handlers (response types, etc.)
 *
 * ⚠️ DO NOT EDIT MANUALLY - this file is auto-generated
 */

import type { components, operations } from "../openapi/projects.openapi.types";

// ============================================================================
// Re-export all generated types
// ============================================================================
// Note: components and operations are exported here but should be accessed via namespace
// in main index.ts to avoid duplicate export errors (e.g., blockchain.types.components)

export type { components, operations };


// ============================================================================
// Convenient Type Aliases for Schemas
// ============================================================================

export type Project = components["schemas"]["Project"];
export type ProjectId = components["schemas"]["ProjectId"];
export type ProjectListData = components["schemas"]["ProjectListData"];
export type ProjectStatus = components["schemas"]["ProjectStatus"];
export type RiskClass = components["schemas"]["RiskClass"];
export type RiskClassGate = components["schemas"]["RiskClassGate"];
export type RiskClassGateMatrix = components["schemas"]["RiskClassGateMatrix"];
export type ScaleQuotaStatus = components["schemas"]["ScaleQuotaStatus"];
export type ProjectCreateRequest = components["schemas"]["ProjectCreateRequest"];
export type ScaleQuotaDecisionRequest = components["schemas"]["ScaleQuotaDecisionRequest"];
export type SubmitProblemFrameRequest = components["schemas"]["SubmitProblemFrameRequest"];


// ============================================================================
// Operation Input Types (Request Bodies)
// ============================================================================

// These types represent the input data for create/update operations

export type CreateProjectRequestInput = NonNullable<operations["createProject"]["requestBody"]>["content"]["application/json"];
export type SubmitProjectProblemFrameRequestInput = NonNullable<operations["submitProjectProblemFrame"]["requestBody"]>["content"]["application/json"];
export type DecideProjectScaleQuotaRequestInput = NonNullable<operations["decideProjectScaleQuota"]["requestBody"]>["content"]["application/json"];


// ============================================================================
// Operation Parameter Types (Query/Path Parameters)
// ============================================================================

// These types represent parameters for operations without request bodies.
// Aligned with get_input_schema_or_type_name for consistent naming across generators.

export type ListProjectsParams = NonNullable<operations["listProjects"]["parameters"]["query"]>;
export type GetProjectParams = operations["getProject"]["parameters"]["path"];
export type SubmitProjectProblemFrameParams = operations["submitProjectProblemFrame"]["parameters"]["path"];
export type DecideProjectScaleQuotaParams = operations["decideProjectScaleQuota"]["parameters"]["path"];


// ============================================================================
// Operation Response Types
// ============================================================================

// These types are used by handlers for type-safe response envelopes

export type ListProjectsResponse = operations["listProjects"]["responses"]["200"]["content"]["application/json"];
export type CreateProjectResponse = operations["createProject"]["responses"]["201"]["content"]["application/json"];
export type GetProjectResponse = operations["getProject"]["responses"]["200"]["content"]["application/json"];
export type SubmitProjectProblemFrameResponse = operations["submitProjectProblemFrame"]["responses"]["200"]["content"]["application/json"];
export type DecideProjectScaleQuotaResponse = operations["decideProjectScaleQuota"]["responses"]["200"]["content"]["application/json"];
export type GetRiskClassGateMatrixResponse = operations["getRiskClassGateMatrix"]["responses"]["200"]["content"]["application/json"];


