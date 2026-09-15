/**
 * Evidencepacks Domain Types
 *
 * Auto-generated from OpenAPI spec
 * Generator: types-generator v2.0.0
 *
 * This file re-exports types from generated OpenAPI types and adds
 * convenient type aliases for handlers (response types, etc.)
 *
 * ⚠️ DO NOT EDIT MANUALLY - this file is auto-generated
 */

import type { components, operations } from "../openapi/evidencepacks.openapi.types";

// ============================================================================
// Domain Types Export - Domain-specific types only (excludes components/operations)
// ============================================================================
// This file exports domain-specific types for use in main index.ts
// components and operations are NOT exported here to avoid duplicate export errors
// Access components/operations via namespace: domain.types.components

// ============================================================================
// Convenient Type Aliases for Schemas
// ============================================================================

export type EvidenceArtefact = components["schemas"]["EvidenceArtefact"];
export type EvidencePack = components["schemas"]["EvidencePack"];
export type EvidencePackId = components["schemas"]["EvidencePackId"];
export type EvidencePackListData = components["schemas"]["EvidencePackListData"];
export type EvidencePackStatus = components["schemas"]["EvidencePackStatus"];
export type EvidencePackCreateRequest = components["schemas"]["EvidencePackCreateRequest"];
export type Export = operations["exportEvidencePack"]["responses"]["200"]["content"]["application/json"]["data"];


// ============================================================================
// Operation Input Types (Request Bodies)
// ============================================================================

// These types represent the input data for create/update operations

export type CreateModelEvidencePackRequestInput = NonNullable<operations["createModelEvidencePack"]["requestBody"]>["content"]["application/json"];


// ============================================================================
// Operation Parameter Types (Query/Path Parameters)
// ============================================================================

// These types represent parameters for operations without request bodies.
// Aligned with get_input_schema_or_type_name for consistent naming across generators.

export type ListEvidencePacksParams = NonNullable<operations["listEvidencePacks"]["parameters"]["query"]>;
export type GetEvidencePackParams = operations["getEvidencePack"]["parameters"]["path"];
export type ExportEvidencePackParams = operations["exportEvidencePack"]["parameters"]["path"];


// ============================================================================
// Operation Response Types
// ============================================================================

// These types are used by handlers for type-safe response envelopes

export type ListEvidencePacksResponse = operations["listEvidencePacks"]["responses"]["200"]["content"]["application/json"];
export type CreateModelEvidencePackResponse = operations["createModelEvidencePack"]["responses"]["201"]["content"]["application/json"];
export type GetEvidencePackResponse = operations["getEvidencePack"]["responses"]["200"]["content"]["application/json"];
export type ExportEvidencePackResponse = operations["exportEvidencePack"]["responses"]["200"]["content"]["application/json"];


