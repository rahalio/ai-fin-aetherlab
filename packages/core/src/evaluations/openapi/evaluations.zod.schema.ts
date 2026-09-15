import { makeApi, Zodios, type ZodiosOptions } from '@zodios/core';
import { z } from 'zod';

const createEvaluation_Body = z
  .object({
    modelId: z.string(),
    declaredKpi: z.string(),
    observedKpiValue: z.number().optional(),
    businessGoalMet: z.boolean(),
    techMetrics: z.record(z.number()),
    notes: z.string().optional(),
    artefactUri: z.string().optional(),
  })
  .passthrough();
const decideEvaluation_Body = z
  .object({
    verdict: z.enum(['passed', 'failed']),
    notes: z.string().optional(),
    requestRetrain: z.boolean().optional(),
  })
  .passthrough();
const EvaluationVerdict = z.enum(['pending', 'passed', 'failed']);
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
const EvaluationId = z.string();
const EvaluationReport = z
  .object({
    evaluationId: z.string().regex(/^evl_[0-9A-HJKMNP-TV-Z]{26}$/),
    modelId: z.string(),
    declaredKpi: z.string(),
    observedKpiValue: z.number().optional(),
    businessGoalMet: z.boolean(),
    techMetrics: z.record(z.number()).optional(),
    notes: z.string().optional(),
    artefactUri: z.string().optional(),
    verdict: z.enum(['pending', 'passed', 'failed']),
    validatorId: z.string().optional(),
    createdAt: z.string().datetime({ offset: true }),
    updatedAt: z.string().datetime({ offset: true }),
  })
  .passthrough();
const EvaluationReportListData = z
  .object({
    items: z.array(
      z
        .object({
          evaluationId: z.string().regex(/^evl_[0-9A-HJKMNP-TV-Z]{26}$/),
          modelId: z.string(),
          declaredKpi: z.string(),
          observedKpiValue: z.number().optional(),
          businessGoalMet: z.boolean(),
          techMetrics: z.record(z.number()).optional(),
          notes: z.string().optional(),
          artefactUri: z.string().optional(),
          verdict: z.enum(['pending', 'passed', 'failed']),
          validatorId: z.string().optional(),
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
const EvaluationReportListResponse = z
  .object({
    data: z
      .object({
        items: z.array(
          z
            .object({
              evaluationId: z.string().regex(/^evl_[0-9A-HJKMNP-TV-Z]{26}$/),
              modelId: z.string(),
              declaredKpi: z.string(),
              observedKpiValue: z.number().optional(),
              businessGoalMet: z.boolean(),
              techMetrics: z.record(z.number()).optional(),
              notes: z.string().optional(),
              artefactUri: z.string().optional(),
              verdict: z.enum(['pending', 'passed', 'failed']),
              validatorId: z.string().optional(),
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
const EvaluationReportCreateRequest = z
  .object({
    modelId: z.string(),
    declaredKpi: z.string(),
    observedKpiValue: z.number().optional(),
    businessGoalMet: z.boolean(),
    techMetrics: z.record(z.number()),
    notes: z.string().optional(),
    artefactUri: z.string().optional(),
  })
  .passthrough();
const EvaluationReportResponse = z
  .object({
    data: z
      .object({
        evaluationId: z.string().regex(/^evl_[0-9A-HJKMNP-TV-Z]{26}$/),
        modelId: z.string(),
        declaredKpi: z.string(),
        observedKpiValue: z.number().optional(),
        businessGoalMet: z.boolean(),
        techMetrics: z.record(z.number()).optional(),
        notes: z.string().optional(),
        artefactUri: z.string().optional(),
        verdict: z.enum(['pending', 'passed', 'failed']),
        validatorId: z.string().optional(),
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
const EvaluationDecisionRequest = z
  .object({
    verdict: z.enum(['passed', 'failed']),
    notes: z.string().optional(),
    requestRetrain: z.boolean().optional(),
  })
  .passthrough();

export const schemas: any = {
  createEvaluation_Body,
  decideEvaluation_Body,
  EvaluationVerdict,
  Problem,
  EvaluationId,
  EvaluationReport,
  EvaluationReportListData,
  ResponseMeta,
  EvaluationReportListResponse,
  EvaluationReportCreateRequest,
  EvaluationReportResponse,
  EvaluationDecisionRequest,
};

const endpoints = makeApi([
  {
    method: 'get',
    path: '/v1/evaluations',
    alias: 'listEvaluations',
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
      {
        name: 'verdict',
        type: 'Query',
        schema: z.enum(['pending', 'passed', 'failed']).optional(),
      },
    ],
    response: z
      .object({
        data: z
          .object({
            items: z.array(
              z
                .object({
                  evaluationId: z
                    .string()
                    .regex(/^evl_[0-9A-HJKMNP-TV-Z]{26}$/),
                  modelId: z.string(),
                  declaredKpi: z.string(),
                  observedKpiValue: z.number().optional(),
                  businessGoalMet: z.boolean(),
                  techMetrics: z.record(z.number()).optional(),
                  notes: z.string().optional(),
                  artefactUri: z.string().optional(),
                  verdict: z.enum(['pending', 'passed', 'failed']),
                  validatorId: z.string().optional(),
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
    path: '/v1/evaluations',
    alias: 'createEvaluation',
    requestFormat: 'json',
    parameters: [
      {
        name: 'body',
        type: 'Body',
        schema: createEvaluation_Body,
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
            evaluationId: z.string().regex(/^evl_[0-9A-HJKMNP-TV-Z]{26}$/),
            modelId: z.string(),
            declaredKpi: z.string(),
            observedKpiValue: z.number().optional(),
            businessGoalMet: z.boolean(),
            techMetrics: z.record(z.number()).optional(),
            notes: z.string().optional(),
            artefactUri: z.string().optional(),
            verdict: z.enum(['pending', 'passed', 'failed']),
            validatorId: z.string().optional(),
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
    path: '/v1/evaluations/:evaluationId',
    alias: 'getEvaluation',
    requestFormat: 'json',
    parameters: [
      {
        name: 'evaluationId',
        type: 'Path',
        schema: z.string().regex(/^evl_[0-9A-HJKMNP-TV-Z]{26}$/),
      },
    ],
    response: z
      .object({
        data: z
          .object({
            evaluationId: z.string().regex(/^evl_[0-9A-HJKMNP-TV-Z]{26}$/),
            modelId: z.string(),
            declaredKpi: z.string(),
            observedKpiValue: z.number().optional(),
            businessGoalMet: z.boolean(),
            techMetrics: z.record(z.number()).optional(),
            notes: z.string().optional(),
            artefactUri: z.string().optional(),
            verdict: z.enum(['pending', 'passed', 'failed']),
            validatorId: z.string().optional(),
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
    path: '/v1/evaluations/:evaluationId/decision',
    alias: 'decideEvaluation',
    requestFormat: 'json',
    parameters: [
      {
        name: 'body',
        type: 'Body',
        schema: decideEvaluation_Body,
      },
      {
        name: 'evaluationId',
        type: 'Path',
        schema: z.string().regex(/^evl_[0-9A-HJKMNP-TV-Z]{26}$/),
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
            evaluationId: z.string().regex(/^evl_[0-9A-HJKMNP-TV-Z]{26}$/),
            modelId: z.string(),
            declaredKpi: z.string(),
            observedKpiValue: z.number().optional(),
            businessGoalMet: z.boolean(),
            techMetrics: z.record(z.number()).optional(),
            notes: z.string().optional(),
            artefactUri: z.string().optional(),
            verdict: z.enum(['pending', 'passed', 'failed']),
            validatorId: z.string().optional(),
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
