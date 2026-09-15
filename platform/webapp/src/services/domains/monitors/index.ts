/**
 * Monitors Domain
 *
 * Barrel export for monitors service, types, hooks, and view models.
 *
 * Architecture Rules:
 * - API types: re-exports from @aetherlab/core only
 * - View models: UI-only extensions (VM suffix)
 * - Service: only place that touches network
 * - Hooks: call service only (never apiClient directly)
 * - Mappers: internal to service layer (not for components)
 * - Components: domain-specific UI (not exported from barrel)
 */

// ============================================================================
// Service (runtime boundary - only place that touches network)
// ============================================================================
export { monitorsService } from './monitors.service';

// ============================================================================
// Facade (high-level API for components)
// ============================================================================
export { monitorsFacade } from './facade';

// ============================================================================
// Contracts (runtime validation)
// ============================================================================
export * from "./contracts";

// ============================================================================
// API Types (re-exports from @aetherlab/core only)
// ============================================================================
// These are immutable API contracts - never define locally
export type {
  // TODO: Add type exports from api-types
} from './monitors.api-types';

// ============================================================================
// Hooks (consolidated in hooks/ directory)
// ============================================================================
export * from './hooks';

// ============================================================================
// Components (domain-specific UI - not exported from barrel)
// ============================================================================
// Components are now in features/ directory and should be imported from there.
// This prevents cross-domain component dependencies and keeps the barrel focused.
