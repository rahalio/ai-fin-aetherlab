import { makeApi, Zodios, type ZodiosOptions } from '@zodios/core';
import { z } from 'zod';

const Problem = z
  .object({
    type: z.string().url(),
    title: z.string(),
    status: z.number().int(),
    detail: z.string(),
    instance: z.string().url(),
    code: z.string(),
  })
  .partial()
  .passthrough();
const EvidencePackId = z.string();
const EvidencePackStatus = z.enum(['draft', 'complete', 'exported']);
const EvidenceArtefact = z
  .object({
    kind: z.enum(['lineage', 'approvals', 'metrics', 'incidents']),
    present: z.boolean(),
    uri: z.string().optional(),
  })
  .passthrough();
const EvidencePack = z
  .object({
    evidencePackId: z.string().regex(/^evp_[0-9A-HJKMNP-TV-Z]{26}$/),
    modelId: z.string(),
    status: z.enum(['draft', 'complete', 'exported']),
    artefacts: z.array(
      z
        .object({
          kind: z.enum(['lineage', 'approvals', 'metrics', 'incidents']),
          present: z.boolean(),
          uri: z.string().optional(),
        })
        .passthrough()
    ),
    hash: z.string().optional(),
    downloadUrl: z.string().url().optional(),
    shareExpiresAt: z.string().datetime({ offset: true }).optional(),
    createdAt: z.string().datetime({ offset: true }),
    updatedAt: z.string().datetime({ offset: true }),
  })
  .passthrough();
const EvidencePackListData = z
  .object({
    items: z.array(
      z
        .object({
          evidencePackId: z.string().regex(/^evp_[0-9A-HJKMNP-TV-Z]{26}$/),
          modelId: z.string(),
          status: z.enum(['draft', 'complete', 'exported']),
          artefacts: z.array(
            z
              .object({
                kind: z.enum(['lineage', 'approvals', 'metrics', 'incidents']),
                present: z.boolean(),
                uri: z.string().optional(),
              })
              .passthrough()
          ),
          hash: z.string().optional(),
          downloadUrl: z.string().url().optional(),
          shareExpiresAt: z.string().datetime({ offset: true }).optional(),
          createdAt: z.string().datetime({ offset: true }),
          updatedAt: z.string().datetime({ offset: true }),
        })
        .passthrough()
    ),
    nextCursor: z.string().optional(),
  })
  .passthrough();
const ResponseMeta = z
  .object({
    requestId: z.string().uuid(),
    correlationId: z.string(),
    generatedAt: z.string().datetime({ offset: true }),
  })
  .partial()
  .passthrough();
const EvidencePackListResponse = z
  .object({
    data: z
      .object({
        items: z.array(
          z
            .object({
              evidencePackId: z.string().regex(/^evp_[0-9A-HJKMNP-TV-Z]{26}$/),
              modelId: z.string(),
              status: z.enum(['draft', 'complete', 'exported']),
              artefacts: z.array(
                z
                  .object({
                    kind: z.enum([
                      'lineage',
                      'approvals',
                      'metrics',
                      'incidents',
                    ]),
                    present: z.boolean(),
                    uri: z.string().optional(),
                  })
                  .passthrough()
              ),
              hash: z.string().optional(),
              downloadUrl: z.string().url().optional(),
              shareExpiresAt: z.string().datetime({ offset: true }).optional(),
              createdAt: z.string().datetime({ offset: true }),
              updatedAt: z.string().datetime({ offset: true }),
            })
            .passthrough()
        ),
        nextCursor: z.string().optional(),
      })
      .passthrough(),
    meta: z
      .object({
        requestId: z.string().uuid(),
        correlationId: z.string(),
        generatedAt: z.string().datetime({ offset: true }),
      })
      .partial()
      .passthrough()
      .optional(),
  })
  .passthrough();
const EvidencePackCreateRequest = z
  .object({ modelId: z.string() })
  .passthrough();
const EvidencePackResponse = z
  .object({
    data: z
      .object({
        evidencePackId: z.string().regex(/^evp_[0-9A-HJKMNP-TV-Z]{26}$/),
        modelId: z.string(),
        status: z.enum(['draft', 'complete', 'exported']),
        artefacts: z.array(
          z
            .object({
              kind: z.enum(['lineage', 'approvals', 'metrics', 'incidents']),
              present: z.boolean(),
              uri: z.string().optional(),
            })
            .passthrough()
        ),
        hash: z.string().optional(),
        downloadUrl: z.string().url().optional(),
        shareExpiresAt: z.string().datetime({ offset: true }).optional(),
        createdAt: z.string().datetime({ offset: true }),
        updatedAt: z.string().datetime({ offset: true }),
      })
      .passthrough(),
    meta: z
      .object({
        requestId: z.string().uuid(),
        correlationId: z.string(),
        generatedAt: z.string().datetime({ offset: true }),
      })
      .partial()
      .passthrough()
      .optional(),
  })
  .passthrough();

export const schemas: any = {
  Problem,
  EvidencePackId,
  EvidencePackStatus,
  EvidenceArtefact,
  EvidencePack,
  EvidencePackListData,
  ResponseMeta,
  EvidencePackListResponse,
  EvidencePackCreateRequest,
  EvidencePackResponse,
};

const endpoints = makeApi([
  {
    method: 'get',
    path: '/v1/evidence-packs',
    alias: 'listEvidencePacks',
    requestFormat: 'json',
    parameters: [
      {
        name: 'cursor',
        type: 'Query',
        schema: z.string().optional(),
      },
      {
        name: 'limit',
        type: 'Query',
        schema: z.number().int().gte(1).lte(200).optional().default(50),
      },
      {
        name: 'modelId',
        type: 'Query',
        schema: z.string().optional(),
      },
    ],
    response: z
      .object({
        data: z
          .object({
            items: z.array(
              z
                .object({
                  evidencePackId: z
                    .string()
                    .regex(/^evp_[0-9A-HJKMNP-TV-Z]{26}$/),
                  modelId: z.string(),
                  status: z.enum(['draft', 'complete', 'exported']),
                  artefacts: z.array(
                    z
                      .object({
                        kind: z.enum([
                          'lineage',
                          'approvals',
                          'metrics',
                          'incidents',
                        ]),
                        present: z.boolean(),
                        uri: z.string().optional(),
                      })
                      .passthrough()
                  ),
                  hash: z.string().optional(),
                  downloadUrl: z.string().url().optional(),
                  shareExpiresAt: z
                    .string()
                    .datetime({ offset: true })
                    .optional(),
                  createdAt: z.string().datetime({ offset: true }),
                  updatedAt: z.string().datetime({ offset: true }),
                })
                .passthrough()
            ),
            nextCursor: z.string().optional(),
          })
          .passthrough(),
        meta: z
          .object({
            requestId: z.string().uuid(),
            correlationId: z.string(),
            generatedAt: z.string().datetime({ offset: true }),
          })
          .partial()
          .passthrough()
          .optional(),
      })
      .passthrough(),
    errors: [
      {
        status: 401,
        description: `Missing or invalid API key`,
        schema: z
          .object({
            type: z.string().url(),
            title: z.string(),
            status: z.number().int(),
            detail: z.string(),
            instance: z.string().url(),
            code: z.string(),
          })
          .partial()
          .passthrough(),
      },
    ],
  },
  {
    method: 'post',
    path: '/v1/evidence-packs',
    alias: 'createModelEvidencePack',
    requestFormat: 'json',
    parameters: [
      {
        name: 'body',
        type: 'Body',
        schema: z.object({ modelId: z.string() }).passthrough(),
      },
      {
        name: 'Idempotency-Key',
        type: 'Header',
        schema: z.string().min(1).max(128),
      },
    ],
    response: z
      .object({
        data: z
          .object({
            evidencePackId: z.string().regex(/^evp_[0-9A-HJKMNP-TV-Z]{26}$/),
            modelId: z.string(),
            status: z.enum(['draft', 'complete', 'exported']),
            artefacts: z.array(
              z
                .object({
                  kind: z.enum([
                    'lineage',
                    'approvals',
                    'metrics',
                    'incidents',
                  ]),
                  present: z.boolean(),
                  uri: z.string().optional(),
                })
                .passthrough()
            ),
            hash: z.string().optional(),
            downloadUrl: z.string().url().optional(),
            shareExpiresAt: z.string().datetime({ offset: true }).optional(),
            createdAt: z.string().datetime({ offset: true }),
            updatedAt: z.string().datetime({ offset: true }),
          })
          .passthrough(),
        meta: z
          .object({
            requestId: z.string().uuid(),
            correlationId: z.string(),
            generatedAt: z.string().datetime({ offset: true }),
          })
          .partial()
          .passthrough()
          .optional(),
      })
      .passthrough(),
    errors: [
      {
        status: 401,
        description: `Missing or invalid API key`,
        schema: z
          .object({
            type: z.string().url(),
            title: z.string(),
            status: z.number().int(),
            detail: z.string(),
            instance: z.string().url(),
            code: z.string(),
          })
          .partial()
          .passthrough(),
      },
      {
        status: 422,
        description: `Semantically invalid request (e.g. PACK_EMPTY)`,
        schema: z
          .object({
            type: z.string().url(),
            title: z.string(),
            status: z.number().int(),
            detail: z.string(),
            instance: z.string().url(),
            code: z.string(),
          })
          .partial()
          .passthrough(),
      },
    ],
  },
  {
    method: 'get',
    path: '/v1/evidence-packs/:evidencePackId',
    alias: 'getEvidencePack',
    requestFormat: 'json',
    parameters: [
      {
        name: 'evidencePackId',
        type: 'Path',
        schema: z.string().regex(/^evp_[0-9A-HJKMNP-TV-Z]{26}$/),
      },
    ],
    response: z
      .object({
        data: z
          .object({
            evidencePackId: z.string().regex(/^evp_[0-9A-HJKMNP-TV-Z]{26}$/),
            modelId: z.string(),
            status: z.enum(['draft', 'complete', 'exported']),
            artefacts: z.array(
              z
                .object({
                  kind: z.enum([
                    'lineage',
                    'approvals',
                    'metrics',
                    'incidents',
                  ]),
                  present: z.boolean(),
                  uri: z.string().optional(),
                })
                .passthrough()
            ),
            hash: z.string().optional(),
            downloadUrl: z.string().url().optional(),
            shareExpiresAt: z.string().datetime({ offset: true }).optional(),
            createdAt: z.string().datetime({ offset: true }),
            updatedAt: z.string().datetime({ offset: true }),
          })
          .passthrough(),
        meta: z
          .object({
            requestId: z.string().uuid(),
            correlationId: z.string(),
            generatedAt: z.string().datetime({ offset: true }),
          })
          .partial()
          .passthrough()
          .optional(),
      })
      .passthrough(),
    errors: [
      {
        status: 401,
        description: `Missing or invalid API key`,
        schema: z
          .object({
            type: z.string().url(),
            title: z.string(),
            status: z.number().int(),
            detail: z.string(),
            instance: z.string().url(),
            code: z.string(),
          })
          .partial()
          .passthrough(),
      },
      {
        status: 404,
        description: `Resource not found`,
        schema: z
          .object({
            type: z.string().url(),
            title: z.string(),
            status: z.number().int(),
            detail: z.string(),
            instance: z.string().url(),
            code: z.string(),
          })
          .partial()
          .passthrough(),
      },
    ],
  },
  {
    method: 'post',
    path: '/v1/evidence-packs/:evidencePackId/export',
    alias: 'exportEvidencePack',
    requestFormat: 'json',
    parameters: [
      {
        name: 'evidencePackId',
        type: 'Path',
        schema: z.string().regex(/^evp_[0-9A-HJKMNP-TV-Z]{26}$/),
      },
      {
        name: 'Idempotency-Key',
        type: 'Header',
        schema: z.string().min(1).max(128),
      },
    ],
    response: z
      .object({
        data: z
          .object({
            evidencePackId: z.string().regex(/^evp_[0-9A-HJKMNP-TV-Z]{26}$/),
            modelId: z.string(),
            status: z.enum(['draft', 'complete', 'exported']),
            artefacts: z.array(
              z
                .object({
                  kind: z.enum([
                    'lineage',
                    'approvals',
                    'metrics',
                    'incidents',
                  ]),
                  present: z.boolean(),
                  uri: z.string().optional(),
                })
                .passthrough()
            ),
            hash: z.string().optional(),
            downloadUrl: z.string().url().optional(),
            shareExpiresAt: z.string().datetime({ offset: true }).optional(),
            createdAt: z.string().datetime({ offset: true }),
            updatedAt: z.string().datetime({ offset: true }),
          })
          .passthrough(),
        meta: z
          .object({
            requestId: z.string().uuid(),
            correlationId: z.string(),
            generatedAt: z.string().datetime({ offset: true }),
          })
          .partial()
          .passthrough()
          .optional(),
      })
      .passthrough(),
    errors: [
      {
        status: 401,
        description: `Missing or invalid API key`,
        schema: z
          .object({
            type: z.string().url(),
            title: z.string(),
            status: z.number().int(),
            detail: z.string(),
            instance: z.string().url(),
            code: z.string(),
          })
          .partial()
          .passthrough(),
      },
      {
        status: 404,
        description: `Resource not found`,
        schema: z
          .object({
            type: z.string().url(),
            title: z.string(),
            status: z.number().int(),
            detail: z.string(),
            instance: z.string().url(),
            code: z.string(),
          })
          .partial()
          .passthrough(),
      },
      {
        status: 422,
        description: `Semantically invalid request (e.g. PACK_EMPTY)`,
        schema: z
          .object({
            type: z.string().url(),
            title: z.string(),
            status: z.number().int(),
            detail: z.string(),
            instance: z.string().url(),
            code: z.string(),
          })
          .partial()
          .passthrough(),
      },
    ],
  },
]);

export const api: any = new Zodios(
  'https://api.ddd-codegen-starter.local/v1',
  endpoints
);

export function createApiClient(baseUrl: string, options?: ZodiosOptions): any {
  return new Zodios(baseUrl, endpoints, options);
}
