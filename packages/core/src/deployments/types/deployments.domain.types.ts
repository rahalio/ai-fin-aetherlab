/**
 * Deployments Domain Types
 *
 * Auto-generated from OpenAPI spec
 * Generator: types-generator v2.0.0
 *
 * This file re-exports types from generated OpenAPI types and adds
 * convenient type aliases for handlers (response types, etc.)
 *
 * ⚠️ DO NOT EDIT MANUALLY - this file is auto-generated
 */

import type { components, operations } from "../openapi/deployments.openapi.types";

// ============================================================================
// Domain Types Export - Domain-specific types only (excludes components/operations)
// ============================================================================
// This file exports domain-specific types for use in main index.ts
// components and operations are NOT exported here to avoid duplicate export errors
// Access components/operations via namespace: domain.types.components

// ============================================================================
// Convenient Type Aliases for Schemas
// ============================================================================

export type DeploymentApproval = components["schemas"]["DeploymentApproval"];
export type DeploymentApprovalListData = components["schemas"]["DeploymentApprovalListData"];
export type DeploymentId = components["schemas"]["DeploymentId"];
export type DeploymentStatus = components["schemas"]["DeploymentStatus"];
export type DeploymentApprovalCreateRequest = components["schemas"]["DeploymentApprovalCreateRequest"];
export type DeploymentDecisionRequest = components["schemas"]["DeploymentDecisionRequest"];
export type RollbackRequest = components["schemas"]["RollbackRequest"];
export type Deployment = operations["listDeployments"]["responses"]["200"]["content"]["application/json"]["data"];


// ============================================================================
// Operation Input Types (Request Bodies)
// ============================================================================

// These types represent the input data for create/update operations

export type RequestDeploymentRequestInput = NonNullable<operations["requestDeployment"]["requestBody"]>["content"]["application/json"];
export type DecideDeploymentRequestInput = NonNullable<operations["decideDeployment"]["requestBody"]>["content"]["application/json"];
export type RollbackDeploymentRequestInput = NonNullable<operations["rollbackDeployment"]["requestBody"]>["content"]["application/json"];


// ============================================================================
// Operation Parameter Types (Query/Path Parameters)
// ============================================================================

// These types represent parameters for operations without request bodies.
// Aligned with get_input_schema_or_type_name for consistent naming across generators.

export type ListDeploymentsParams = NonNullable<operations["listDeployments"]["parameters"]["query"]>;
export type GetDeploymentParams = operations["getDeployment"]["parameters"]["path"];
export type DecideDeploymentParams = operations["decideDeployment"]["parameters"]["path"];
export type ExecuteDeploymentParams = operations["executeDeployment"]["parameters"]["path"];
export type RetireDeploymentParams = operations["retireDeployment"]["parameters"]["path"];
export type RollbackDeploymentParams = operations["rollbackDeployment"]["parameters"]["path"];


// ============================================================================
// Operation Response Types
// ============================================================================

// These types are used by handlers for type-safe response envelopes

export type ListDeploymentsResponse = operations["listDeployments"]["responses"]["200"]["content"]["application/json"];
export type RequestDeploymentResponse = operations["requestDeployment"]["responses"]["201"]["content"]["application/json"];
export type GetDeploymentResponse = operations["getDeployment"]["responses"]["200"]["content"]["application/json"];
export type DecideDeploymentResponse = operations["decideDeployment"]["responses"]["200"]["content"]["application/json"];
export type ExecuteDeploymentResponse = operations["executeDeployment"]["responses"]["200"]["content"]["application/json"];
export type RetireDeploymentResponse = operations["retireDeployment"]["responses"]["200"]["content"]["application/json"];
export type RollbackDeploymentResponse = operations["rollbackDeployment"]["responses"]["200"]["content"]["application/json"];


