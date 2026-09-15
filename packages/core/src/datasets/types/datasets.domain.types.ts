/**
 * Datasets Domain Types
 *
 * Auto-generated from OpenAPI spec
 * Generator: types-generator v2.0.0
 *
 * This file re-exports types from generated OpenAPI types and adds
 * convenient type aliases for handlers (response types, etc.)
 *
 * ⚠️ DO NOT EDIT MANUALLY - this file is auto-generated
 */

import type { components, operations } from "../openapi/datasets.openapi.types";

// ============================================================================
// Domain Types Export - Domain-specific types only (excludes components/operations)
// ============================================================================
// This file exports domain-specific types for use in main index.ts
// components and operations are NOT exported here to avoid duplicate export errors
// Access components/operations via namespace: domain.types.components

// ============================================================================
// Convenient Type Aliases for Schemas
// ============================================================================

export type DatasetAccessGrant = components["schemas"]["DatasetAccessGrant"];
export type DatasetAccessGrantListData = components["schemas"]["DatasetAccessGrantListData"];
export type DatasetId = components["schemas"]["DatasetId"];
export type DatasetLineage = components["schemas"]["DatasetLineage"];
export type DatasetLineageListData = components["schemas"]["DatasetLineageListData"];
export type GrantId = components["schemas"]["GrantId"];
export type DatasetAccessGrantCreateRequest = components["schemas"]["DatasetAccessGrantCreateRequest"];
export type DatasetLineageCreateRequest = components["schemas"]["DatasetLineageCreateRequest"];
export type DatasetPurposeAttestRequest = components["schemas"]["DatasetPurposeAttestRequest"];
export type Dataset = operations["listDatasets"]["responses"]["200"]["content"]["application/json"]["data"];
export type Grant = operations["listDatasetGrants"]["responses"]["200"]["content"]["application/json"]["data"];


// ============================================================================
// Operation Input Types (Request Bodies)
// ============================================================================

// These types represent the input data for create/update operations

export type RegisterDatasetRequestInput = NonNullable<operations["registerDataset"]["requestBody"]>["content"]["application/json"];
export type CreateDatasetGrantRequestInput = NonNullable<operations["createDatasetGrant"]["requestBody"]>["content"]["application/json"];
export type AttestDatasetPurposeRequestInput = NonNullable<operations["attestDatasetPurpose"]["requestBody"]>["content"]["application/json"];


// ============================================================================
// Operation Parameter Types (Query/Path Parameters)
// ============================================================================

// These types represent parameters for operations without request bodies.
// Aligned with get_input_schema_or_type_name for consistent naming across generators.

export type ListDatasetsParams = NonNullable<operations["listDatasets"]["parameters"]["query"]>;
export type GetDatasetParams = operations["getDataset"]["parameters"]["path"];
export type ListDatasetGrantsParams = operations["listDatasetGrants"]["parameters"]["path"];
export type CreateDatasetGrantParams = operations["createDatasetGrant"]["parameters"]["path"];
export type RevokeDatasetGrantParams = operations["revokeDatasetGrant"]["parameters"]["path"];
export type AttestDatasetPurposeParams = operations["attestDatasetPurpose"]["parameters"]["path"];


// ============================================================================
// Operation Response Types
// ============================================================================

// These types are used by handlers for type-safe response envelopes

export type ListDatasetsResponse = operations["listDatasets"]["responses"]["200"]["content"]["application/json"];
export type RegisterDatasetResponse = operations["registerDataset"]["responses"]["201"]["content"]["application/json"];
export type GetDatasetResponse = operations["getDataset"]["responses"]["200"]["content"]["application/json"];
export type ListDatasetGrantsResponse = operations["listDatasetGrants"]["responses"]["200"]["content"]["application/json"];
export type CreateDatasetGrantResponse = operations["createDatasetGrant"]["responses"]["201"]["content"]["application/json"];
export type AttestDatasetPurposeResponse = operations["attestDatasetPurpose"]["responses"]["200"]["content"]["application/json"];


