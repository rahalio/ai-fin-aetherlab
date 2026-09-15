import { makeApi, Zodios, type ZodiosOptions } from '@zodios/core';
import { z } from 'zod';

const requestDeployment_Body = z
  .object({
    modelId: z.string(),
    endpointName: z.string(),
    monitorIds: z.array(z.string()),
    highRiskException: z.boolean().optional(),
  })
  .passthrough();
const decideDeployment_Body = z
  .object({
    decision: z.enum(['approved', 'rejected']),
    notes: z.string().optional(),
  })
  .passthrough();
const rollbackDeployment_Body = z
  .object({ priorDeploymentId: z.string(), attestation: z.string().optional() })
  .passthrough();
const DeploymentStatus = z.enum([
  'pending',
  'approved',
  'rejected',
  'deployed',
  'retired',
  'rolled_back',
  'blocked',
]);
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
const DeploymentId = z.string();
const DeploymentApproval = z
  .object({
    deploymentId: z.string().regex(/^dep_[0-9A-HJKMNP-TV-Z]{26}$/),
    modelId: z.string(),
    endpointName: z.string(),
    status: z.enum([
      'pending',
      'approved',
      'rejected',
      'deployed',
      'retired',
      'rolled_back',
      'blocked',
    ]),
    builderId: z.string(),
    validatorId: z.string().optional(),
    monitorIds: z.array(z.string()).optional(),
    monitorsAttached: z.boolean().optional(),
    highRiskException: z.boolean().optional(),
    rollbackOfDeploymentId: z.string().optional(),
    createdAt: z.string().datetime({ offset: true }),
    updatedAt: z.string().datetime({ offset: true }),
  })
  .passthrough();
const DeploymentApprovalListData = z
  .object({
    items: z.array(
      z
        .object({
          deploymentId: z.string().regex(/^dep_[0-9A-HJKMNP-TV-Z]{26}$/),
          modelId: z.string(),
          endpointName: z.string(),
          status: z.enum([
            'pending',
            'approved',
            'rejected',
            'deployed',
            'retired',
            'rolled_back',
            'blocked',
          ]),
          builderId: z.string(),
          validatorId: z.string().optional(),
          monitorIds: z.array(z.string()).optional(),
          monitorsAttached: z.boolean().optional(),
          highRiskException: z.boolean().optional(),
          rollbackOfDeploymentId: z.string().optional(),
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
const DeploymentApprovalListResponse = z
  .object({
    data: z
      .object({
        items: z.array(
          z
            .object({
              deploymentId: z.string().regex(/^dep_[0-9A-HJKMNP-TV-Z]{26}$/),
              modelId: z.string(),
              endpointName: z.string(),
              status: z.enum([
                'pending',
                'approved',
                'rejected',
                'deployed',
                'retired',
                'rolled_back',
                'blocked',
              ]),
              builderId: z.string(),
              validatorId: z.string().optional(),
              monitorIds: z.array(z.string()).optional(),
              monitorsAttached: z.boolean().optional(),
              highRiskException: z.boolean().optional(),
              rollbackOfDeploymentId: z.string().optional(),
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
const DeploymentApprovalCreateRequest = z
  .object({
    modelId: z.string(),
    endpointName: z.string(),
    monitorIds: z.array(z.string()),
    highRiskException: z.boolean().optional(),
  })
  .passthrough();
const DeploymentApprovalResponse = z
  .object({
    data: z
      .object({
        deploymentId: z.string().regex(/^dep_[0-9A-HJKMNP-TV-Z]{26}$/),
        modelId: z.string(),
        endpointName: z.string(),
        status: z.enum([
          'pending',
          'approved',
          'rejected',
          'deployed',
          'retired',
          'rolled_back',
          'blocked',
        ]),
        builderId: z.string(),
        validatorId: z.string().optional(),
        monitorIds: z.array(z.string()).optional(),
        monitorsAttached: z.boolean().optional(),
        highRiskException: z.boolean().optional(),
        rollbackOfDeploymentId: z.string().optional(),
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
const DeploymentDecisionRequest = z
  .object({
    decision: z.enum(['approved', 'rejected']),
    notes: z.string().optional(),
  })
  .passthrough();
const RollbackRequest = z
  .object({ priorDeploymentId: z.string(), attestation: z.string().optional() })
  .passthrough();

export const schemas: any = {
  requestDeployment_Body,
  decideDeployment_Body,
  rollbackDeployment_Body,
  DeploymentStatus,
  Problem,
  DeploymentId,
  DeploymentApproval,
  DeploymentApprovalListData,
  ResponseMeta,
  DeploymentApprovalListResponse,
  DeploymentApprovalCreateRequest,
  DeploymentApprovalResponse,
  DeploymentDecisionRequest,
  RollbackRequest,
};

const endpoints = makeApi([
  {
    method: 'get',
    path: '/v1/deployments',
    alias: 'listDeployments',
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
        name: 'status',
        type: 'Query',
        schema: z
          .enum([
            'pending',
            'approved',
            'rejected',
            'deployed',
            'retired',
            'rolled_back',
            'blocked',
          ])
          .optional(),
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
                  deploymentId: z
                    .string()
                    .regex(/^dep_[0-9A-HJKMNP-TV-Z]{26}$/),
                  modelId: z.string(),
                  endpointName: z.string(),
                  status: z.enum([
                    'pending',
                    'approved',
                    'rejected',
                    'deployed',
                    'retired',
                    'rolled_back',
                    'blocked',
                  ]),
                  builderId: z.string(),
                  validatorId: z.string().optional(),
                  monitorIds: z.array(z.string()).optional(),
                  monitorsAttached: z.boolean().optional(),
                  highRiskException: z.boolean().optional(),
                  rollbackOfDeploymentId: z.string().optional(),
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
    path: '/v1/deployments',
    alias: 'requestDeployment',
    requestFormat: 'json',
    parameters: [
      {
        name: 'body',
        type: 'Body',
        schema: requestDeployment_Body,
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
            deploymentId: z.string().regex(/^dep_[0-9A-HJKMNP-TV-Z]{26}$/),
            modelId: z.string(),
            endpointName: z.string(),
            status: z.enum([
              'pending',
              'approved',
              'rejected',
              'deployed',
              'retired',
              'rolled_back',
              'blocked',
            ]),
            builderId: z.string(),
            validatorId: z.string().optional(),
            monitorIds: z.array(z.string()).optional(),
            monitorsAttached: z.boolean().optional(),
            highRiskException: z.boolean().optional(),
            rollbackOfDeploymentId: z.string().optional(),
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
    path: '/v1/deployments/:deploymentId',
    alias: 'getDeployment',
    requestFormat: 'json',
    parameters: [
      {
        name: 'deploymentId',
        type: 'Path',
        schema: z.string().regex(/^dep_[0-9A-HJKMNP-TV-Z]{26}$/),
      },
    ],
    response: z
      .object({
        data: z
          .object({
            deploymentId: z.string().regex(/^dep_[0-9A-HJKMNP-TV-Z]{26}$/),
            modelId: z.string(),
            endpointName: z.string(),
            status: z.enum([
              'pending',
              'approved',
              'rejected',
              'deployed',
              'retired',
              'rolled_back',
              'blocked',
            ]),
            builderId: z.string(),
            validatorId: z.string().optional(),
            monitorIds: z.array(z.string()).optional(),
            monitorsAttached: z.boolean().optional(),
            highRiskException: z.boolean().optional(),
            rollbackOfDeploymentId: z.string().optional(),
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
    path: '/v1/deployments/:deploymentId/decision',
    alias: 'decideDeployment',
    requestFormat: 'json',
    parameters: [
      {
        name: 'body',
        type: 'Body',
        schema: decideDeployment_Body,
      },
      {
        name: 'deploymentId',
        type: 'Path',
        schema: z.string().regex(/^dep_[0-9A-HJKMNP-TV-Z]{26}$/),
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
            deploymentId: z.string().regex(/^dep_[0-9A-HJKMNP-TV-Z]{26}$/),
            modelId: z.string(),
            endpointName: z.string(),
            status: z.enum([
              'pending',
              'approved',
              'rejected',
              'deployed',
              'retired',
              'rolled_back',
              'blocked',
            ]),
            builderId: z.string(),
            validatorId: z.string().optional(),
            monitorIds: z.array(z.string()).optional(),
            monitorsAttached: z.boolean().optional(),
            highRiskException: z.boolean().optional(),
            rollbackOfDeploymentId: z.string().optional(),
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
  {
    method: 'post',
    path: '/v1/deployments/:deploymentId/deploy',
    alias: 'executeDeployment',
    requestFormat: 'json',
    parameters: [
      {
        name: 'deploymentId',
        type: 'Path',
        schema: z.string().regex(/^dep_[0-9A-HJKMNP-TV-Z]{26}$/),
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
            deploymentId: z.string().regex(/^dep_[0-9A-HJKMNP-TV-Z]{26}$/),
            modelId: z.string(),
            endpointName: z.string(),
            status: z.enum([
              'pending',
              'approved',
              'rejected',
              'deployed',
              'retired',
              'rolled_back',
              'blocked',
            ]),
            builderId: z.string(),
            validatorId: z.string().optional(),
            monitorIds: z.array(z.string()).optional(),
            monitorsAttached: z.boolean().optional(),
            highRiskException: z.boolean().optional(),
            rollbackOfDeploymentId: z.string().optional(),
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
  {
    method: 'post',
    path: '/v1/deployments/:deploymentId/retire',
    alias: 'retireDeployment',
    requestFormat: 'json',
    parameters: [
      {
        name: 'deploymentId',
        type: 'Path',
        schema: z.string().regex(/^dep_[0-9A-HJKMNP-TV-Z]{26}$/),
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
            deploymentId: z.string().regex(/^dep_[0-9A-HJKMNP-TV-Z]{26}$/),
            modelId: z.string(),
            endpointName: z.string(),
            status: z.enum([
              'pending',
              'approved',
              'rejected',
              'deployed',
              'retired',
              'rolled_back',
              'blocked',
            ]),
            builderId: z.string(),
            validatorId: z.string().optional(),
            monitorIds: z.array(z.string()).optional(),
            monitorsAttached: z.boolean().optional(),
            highRiskException: z.boolean().optional(),
            rollbackOfDeploymentId: z.string().optional(),
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
  {
    method: 'post',
    path: '/v1/deployments/:deploymentId/rollback',
    alias: 'rollbackDeployment',
    requestFormat: 'json',
    parameters: [
      {
        name: 'body',
        type: 'Body',
        schema: rollbackDeployment_Body,
      },
      {
        name: 'deploymentId',
        type: 'Path',
        schema: z.string().regex(/^dep_[0-9A-HJKMNP-TV-Z]{26}$/),
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
            deploymentId: z.string().regex(/^dep_[0-9A-HJKMNP-TV-Z]{26}$/),
            modelId: z.string(),
            endpointName: z.string(),
            status: z.enum([
              'pending',
              'approved',
              'rejected',
              'deployed',
              'retired',
              'rolled_back',
              'blocked',
            ]),
            builderId: z.string(),
            validatorId: z.string().optional(),
            monitorIds: z.array(z.string()).optional(),
            monitorsAttached: z.boolean().optional(),
            highRiskException: z.boolean().optional(),
            rollbackOfDeploymentId: z.string().optional(),
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
