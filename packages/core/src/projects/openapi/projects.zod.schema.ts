import { makeApi, Zodios, type ZodiosOptions } from '@zodios/core';
import { z } from 'zod';

const createProject_Body = z
  .object({
    name: z.string(),
    owner: z.string(),
    riskClass: z.enum(['low', 'credit', 'aml', 'trading', 'adverse_action']),
  })
  .passthrough();
const submitProjectProblemFrame_Body = z
  .object({
    problemStatement: z.string(),
    businessKpi: z.string(),
    kpiThreshold: z.number().optional(),
    riskClass: z.enum(['low', 'credit', 'aml', 'trading', 'adverse_action']),
    permittedPurpose: z.string(),
  })
  .passthrough();
const decideProjectScaleQuota_Body = z
  .object({
    decision: z.enum(['granted', 'denied']),
    notes: z.string().optional(),
  })
  .passthrough();
const RiskClass = z.enum(['low', 'credit', 'aml', 'trading', 'adverse_action']);
const ProjectStatus = z.enum(['draft', 'framed', 'active', 'archived']);
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
const ProjectId = z.string();
const ProblemFrame = z
  .object({
    problemStatement: z.string(),
    businessKpi: z.string(),
    kpiThreshold: z.number().optional(),
    riskClass: z.enum(['low', 'credit', 'aml', 'trading', 'adverse_action']),
    permittedPurpose: z.string(),
    submittedAt: z.string().datetime({ offset: true }).optional(),
    submittedBy: z.string().optional(),
  })
  .passthrough();
const ScaleQuotaStatus = z.enum(['blocked', 'requested', 'granted', 'denied']);
const Project = z
  .object({
    projectId: z.string().regex(/^prj_[0-9A-HJKMNP-TV-Z]{26}$/),
    name: z.string(),
    owner: z.string(),
    riskClass: z.enum(['low', 'credit', 'aml', 'trading', 'adverse_action']),
    status: z.enum(['draft', 'framed', 'active', 'archived']),
    problemFrame: z
      .object({
        problemStatement: z.string(),
        businessKpi: z.string(),
        kpiThreshold: z.number().optional(),
        riskClass: z.enum([
          'low',
          'credit',
          'aml',
          'trading',
          'adverse_action',
        ]),
        permittedPurpose: z.string(),
        submittedAt: z.string().datetime({ offset: true }).optional(),
        submittedBy: z.string().optional(),
      })
      .passthrough()
      .optional(),
    scaleQuotaStatus: z
      .enum(['blocked', 'requested', 'granted', 'denied'])
      .optional(),
    createdAt: z.string().datetime({ offset: true }),
    updatedAt: z.string().datetime({ offset: true }),
  })
  .passthrough();
const ProjectListData = z
  .object({
    items: z.array(
      z
        .object({
          projectId: z.string().regex(/^prj_[0-9A-HJKMNP-TV-Z]{26}$/),
          name: z.string(),
          owner: z.string(),
          riskClass: z.enum([
            'low',
            'credit',
            'aml',
            'trading',
            'adverse_action',
          ]),
          status: z.enum(['draft', 'framed', 'active', 'archived']),
          problemFrame: z
            .object({
              problemStatement: z.string(),
              businessKpi: z.string(),
              kpiThreshold: z.number().optional(),
              riskClass: z.enum([
                'low',
                'credit',
                'aml',
                'trading',
                'adverse_action',
              ]),
              permittedPurpose: z.string(),
              submittedAt: z.string().datetime({ offset: true }).optional(),
              submittedBy: z.string().optional(),
            })
            .passthrough()
            .optional(),
          scaleQuotaStatus: z
            .enum(['blocked', 'requested', 'granted', 'denied'])
            .optional(),
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
const ProjectListResponse = z
  .object({
    data: z
      .object({
        items: z.array(
          z
            .object({
              projectId: z.string().regex(/^prj_[0-9A-HJKMNP-TV-Z]{26}$/),
              name: z.string(),
              owner: z.string(),
              riskClass: z.enum([
                'low',
                'credit',
                'aml',
                'trading',
                'adverse_action',
              ]),
              status: z.enum(['draft', 'framed', 'active', 'archived']),
              problemFrame: z
                .object({
                  problemStatement: z.string(),
                  businessKpi: z.string(),
                  kpiThreshold: z.number().optional(),
                  riskClass: z.enum([
                    'low',
                    'credit',
                    'aml',
                    'trading',
                    'adverse_action',
                  ]),
                  permittedPurpose: z.string(),
                  submittedAt: z.string().datetime({ offset: true }).optional(),
                  submittedBy: z.string().optional(),
                })
                .passthrough()
                .optional(),
              scaleQuotaStatus: z
                .enum(['blocked', 'requested', 'granted', 'denied'])
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
  .passthrough();
const ProjectCreateRequest = z
  .object({
    name: z.string(),
    owner: z.string(),
    riskClass: z.enum(['low', 'credit', 'aml', 'trading', 'adverse_action']),
  })
  .passthrough();
const ProjectResponse = z
  .object({
    data: z
      .object({
        projectId: z.string().regex(/^prj_[0-9A-HJKMNP-TV-Z]{26}$/),
        name: z.string(),
        owner: z.string(),
        riskClass: z.enum([
          'low',
          'credit',
          'aml',
          'trading',
          'adverse_action',
        ]),
        status: z.enum(['draft', 'framed', 'active', 'archived']),
        problemFrame: z
          .object({
            problemStatement: z.string(),
            businessKpi: z.string(),
            kpiThreshold: z.number().optional(),
            riskClass: z.enum([
              'low',
              'credit',
              'aml',
              'trading',
              'adverse_action',
            ]),
            permittedPurpose: z.string(),
            submittedAt: z.string().datetime({ offset: true }).optional(),
            submittedBy: z.string().optional(),
          })
          .passthrough()
          .optional(),
        scaleQuotaStatus: z
          .enum(['blocked', 'requested', 'granted', 'denied'])
          .optional(),
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
const SubmitProblemFrameRequest = z
  .object({
    problemStatement: z.string(),
    businessKpi: z.string(),
    kpiThreshold: z.number().optional(),
    riskClass: z.enum(['low', 'credit', 'aml', 'trading', 'adverse_action']),
    permittedPurpose: z.string(),
  })
  .passthrough();
const ScaleQuotaDecisionRequest = z
  .object({
    decision: z.enum(['granted', 'denied']),
    notes: z.string().optional(),
  })
  .passthrough();
const RiskClassGate = z
  .object({
    riskClass: z.enum(['low', 'credit', 'aml', 'trading', 'adverse_action']),
    requiredArtefacts: z.array(z.string()),
    dualControl: z.boolean(),
    monitorsRequired: z.boolean(),
    extraChecklist: z.array(z.string()).optional(),
  })
  .passthrough();
const RiskClassGateMatrix = z
  .object({
    gates: z.array(
      z
        .object({
          riskClass: z.enum([
            'low',
            'credit',
            'aml',
            'trading',
            'adverse_action',
          ]),
          requiredArtefacts: z.array(z.string()),
          dualControl: z.boolean(),
          monitorsRequired: z.boolean(),
          extraChecklist: z.array(z.string()).optional(),
        })
        .passthrough()
    ),
  })
  .passthrough();
const RiskClassGateMatrixResponse = z
  .object({
    data: z
      .object({
        gates: z.array(
          z
            .object({
              riskClass: z.enum([
                'low',
                'credit',
                'aml',
                'trading',
                'adverse_action',
              ]),
              requiredArtefacts: z.array(z.string()),
              dualControl: z.boolean(),
              monitorsRequired: z.boolean(),
              extraChecklist: z.array(z.string()).optional(),
            })
            .passthrough()
        ),
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
  createProject_Body,
  submitProjectProblemFrame_Body,
  decideProjectScaleQuota_Body,
  RiskClass,
  ProjectStatus,
  Problem,
  ProjectId,
  ProblemFrame,
  ScaleQuotaStatus,
  Project,
  ProjectListData,
  ResponseMeta,
  ProjectListResponse,
  ProjectCreateRequest,
  ProjectResponse,
  SubmitProblemFrameRequest,
  ScaleQuotaDecisionRequest,
  RiskClassGate,
  RiskClassGateMatrix,
  RiskClassGateMatrixResponse,
};

const endpoints = makeApi([
  {
    method: 'get',
    path: '/v1/projects',
    alias: 'listProjects',
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
        name: 'riskClass',
        type: 'Query',
        schema: z
          .enum(['low', 'credit', 'aml', 'trading', 'adverse_action'])
          .optional(),
      },
      {
        name: 'status',
        type: 'Query',
        schema: z.enum(['draft', 'framed', 'active', 'archived']).optional(),
      },
    ],
    response: z
      .object({
        data: z
          .object({
            items: z.array(
              z
                .object({
                  projectId: z.string().regex(/^prj_[0-9A-HJKMNP-TV-Z]{26}$/),
                  name: z.string(),
                  owner: z.string(),
                  riskClass: z.enum([
                    'low',
                    'credit',
                    'aml',
                    'trading',
                    'adverse_action',
                  ]),
                  status: z.enum(['draft', 'framed', 'active', 'archived']),
                  problemFrame: z
                    .object({
                      problemStatement: z.string(),
                      businessKpi: z.string(),
                      kpiThreshold: z.number().optional(),
                      riskClass: z.enum([
                        'low',
                        'credit',
                        'aml',
                        'trading',
                        'adverse_action',
                      ]),
                      permittedPurpose: z.string(),
                      submittedAt: z
                        .string()
                        .datetime({ offset: true })
                        .optional(),
                      submittedBy: z.string().optional(),
                    })
                    .passthrough()
                    .optional(),
                  scaleQuotaStatus: z
                    .enum(['blocked', 'requested', 'granted', 'denied'])
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
        status: 400,
        description: `Malformed request`,
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
    method: 'post',
    path: '/v1/projects',
    alias: 'createProject',
    requestFormat: 'json',
    parameters: [
      {
        name: 'body',
        type: 'Body',
        schema: createProject_Body,
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
            projectId: z.string().regex(/^prj_[0-9A-HJKMNP-TV-Z]{26}$/),
            name: z.string(),
            owner: z.string(),
            riskClass: z.enum([
              'low',
              'credit',
              'aml',
              'trading',
              'adverse_action',
            ]),
            status: z.enum(['draft', 'framed', 'active', 'archived']),
            problemFrame: z
              .object({
                problemStatement: z.string(),
                businessKpi: z.string(),
                kpiThreshold: z.number().optional(),
                riskClass: z.enum([
                  'low',
                  'credit',
                  'aml',
                  'trading',
                  'adverse_action',
                ]),
                permittedPurpose: z.string(),
                submittedAt: z.string().datetime({ offset: true }).optional(),
                submittedBy: z.string().optional(),
              })
              .passthrough()
              .optional(),
            scaleQuotaStatus: z
              .enum(['blocked', 'requested', 'granted', 'denied'])
              .optional(),
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
        status: 400,
        description: `Malformed request`,
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
    path: '/v1/projects/:projectId',
    alias: 'getProject',
    requestFormat: 'json',
    parameters: [
      {
        name: 'projectId',
        type: 'Path',
        schema: z.string().regex(/^prj_[0-9A-HJKMNP-TV-Z]{26}$/),
      },
    ],
    response: z
      .object({
        data: z
          .object({
            projectId: z.string().regex(/^prj_[0-9A-HJKMNP-TV-Z]{26}$/),
            name: z.string(),
            owner: z.string(),
            riskClass: z.enum([
              'low',
              'credit',
              'aml',
              'trading',
              'adverse_action',
            ]),
            status: z.enum(['draft', 'framed', 'active', 'archived']),
            problemFrame: z
              .object({
                problemStatement: z.string(),
                businessKpi: z.string(),
                kpiThreshold: z.number().optional(),
                riskClass: z.enum([
                  'low',
                  'credit',
                  'aml',
                  'trading',
                  'adverse_action',
                ]),
                permittedPurpose: z.string(),
                submittedAt: z.string().datetime({ offset: true }).optional(),
                submittedBy: z.string().optional(),
              })
              .passthrough()
              .optional(),
            scaleQuotaStatus: z
              .enum(['blocked', 'requested', 'granted', 'denied'])
              .optional(),
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
        status: 400,
        description: `Malformed request`,
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
  {
    method: 'post',
    path: '/v1/projects/:projectId/frame',
    alias: 'submitProjectProblemFrame',
    requestFormat: 'json',
    parameters: [
      {
        name: 'body',
        type: 'Body',
        schema: submitProjectProblemFrame_Body,
      },
      {
        name: 'projectId',
        type: 'Path',
        schema: z.string().regex(/^prj_[0-9A-HJKMNP-TV-Z]{26}$/),
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
            projectId: z.string().regex(/^prj_[0-9A-HJKMNP-TV-Z]{26}$/),
            name: z.string(),
            owner: z.string(),
            riskClass: z.enum([
              'low',
              'credit',
              'aml',
              'trading',
              'adverse_action',
            ]),
            status: z.enum(['draft', 'framed', 'active', 'archived']),
            problemFrame: z
              .object({
                problemStatement: z.string(),
                businessKpi: z.string(),
                kpiThreshold: z.number().optional(),
                riskClass: z.enum([
                  'low',
                  'credit',
                  'aml',
                  'trading',
                  'adverse_action',
                ]),
                permittedPurpose: z.string(),
                submittedAt: z.string().datetime({ offset: true }).optional(),
                submittedBy: z.string().optional(),
              })
              .passthrough()
              .optional(),
            scaleQuotaStatus: z
              .enum(['blocked', 'requested', 'granted', 'denied'])
              .optional(),
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
        status: 400,
        description: `Malformed request`,
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
  {
    method: 'post',
    path: '/v1/projects/:projectId/scale-quota',
    alias: 'decideProjectScaleQuota',
    requestFormat: 'json',
    parameters: [
      {
        name: 'body',
        type: 'Body',
        schema: decideProjectScaleQuota_Body,
      },
      {
        name: 'projectId',
        type: 'Path',
        schema: z.string().regex(/^prj_[0-9A-HJKMNP-TV-Z]{26}$/),
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
            projectId: z.string().regex(/^prj_[0-9A-HJKMNP-TV-Z]{26}$/),
            name: z.string(),
            owner: z.string(),
            riskClass: z.enum([
              'low',
              'credit',
              'aml',
              'trading',
              'adverse_action',
            ]),
            status: z.enum(['draft', 'framed', 'active', 'archived']),
            problemFrame: z
              .object({
                problemStatement: z.string(),
                businessKpi: z.string(),
                kpiThreshold: z.number().optional(),
                riskClass: z.enum([
                  'low',
                  'credit',
                  'aml',
                  'trading',
                  'adverse_action',
                ]),
                permittedPurpose: z.string(),
                submittedAt: z.string().datetime({ offset: true }).optional(),
                submittedBy: z.string().optional(),
              })
              .passthrough()
              .optional(),
            scaleQuotaStatus: z
              .enum(['blocked', 'requested', 'granted', 'denied'])
              .optional(),
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
        status: 400,
        description: `Malformed request`,
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
  {
    method: 'get',
    path: '/v1/risk-class-gates',
    alias: 'getRiskClassGateMatrix',
    requestFormat: 'json',
    response: z
      .object({
        data: z
          .object({
            gates: z.array(
              z
                .object({
                  riskClass: z.enum([
                    'low',
                    'credit',
                    'aml',
                    'trading',
                    'adverse_action',
                  ]),
                  requiredArtefacts: z.array(z.string()),
                  dualControl: z.boolean(),
                  monitorsRequired: z.boolean(),
                  extraChecklist: z.array(z.string()).optional(),
                })
                .passthrough()
            ),
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
        status: 400,
        description: `Malformed request`,
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
]);

export const api: any = new Zodios(
  'https://api.ddd-codegen-starter.local/v1',
  endpoints
);

export function createApiClient(baseUrl: string, options?: ZodiosOptions): any {
  return new Zodios(baseUrl, endpoints, options);
}
