#!/usr/bin/env python3
"""Write Aetherlab product OpenAPI YAML (one domain + schemas file each)."""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1] / "packages" / "openapi-core" / "src"

ERR = """        '400':
          $ref: ./common/responses.yaml#/components/responses/BadRequest
        '401':
          $ref: ./common/responses.yaml#/components/responses/Unauthorized
        '404':
          $ref: ./common/responses.yaml#/components/responses/NotFound
        '422':
          $ref: ./common/responses.yaml#/components/responses/UnprocessableEntity
        default:
          $ref: ./common/responses.yaml#/components/responses/Problem
"""

ERR_NO_404 = """        '400':
          $ref: ./common/responses.yaml#/components/responses/BadRequest
        '401':
          $ref: ./common/responses.yaml#/components/responses/Unauthorized
        '422':
          $ref: ./common/responses.yaml#/components/responses/UnprocessableEntity
        default:
          $ref: ./common/responses.yaml#/components/responses/Problem
"""

SEC = """    apiKey:
      $ref: ./common/security.yaml#/components/securitySchemes/apiKey
    bearerAuth:
      $ref: ./common/security.yaml#/components/securitySchemes/bearerAuth
"""

HEADER = """openapi: 3.1.0
info:
  title: {title}
  version: 0.1.0
  description: |
    {desc}
  license:
    name: Proprietary
  x-domain: {xdomain}
servers:
  - url: https://api.aetherlab.local
    description: Local API
security:
  - apiKey: []
  - bearerAuth: []
"""


def ddb(entity: str, id_field: str) -> str:
    return f"""      x-repository: {entity}
      x-dynamodb:
        entityType: "{entity.upper()}"
        pkPatternTemplate: "{entity.upper()}#${{{id_field}}}"
        skPatternTemplate: "METADATA"
        pkPattern: entity
        usePkQuery: false
        createdAtField: createdAt
        updatedAtField: updatedAt
        softDeleteEnabled: false
"""


def envelope_pair(name: str, entity: str) -> str:
    return f"""    {name}Response:
      type: object
      required: [data]
      properties:
        data:
          $ref: '#/components/schemas/{entity}'
        meta:
          $ref: ./common/envelopes.yaml#/components/schemas/ResponseMeta
    {name}ListData:
      type: object
      required: [items]
      properties:
        items:
          type: array
          items:
            $ref: '#/components/schemas/{entity}'
        nextCursor:
          type: string
    {name}ListResponse:
      type: object
      required: [data]
      properties:
        data:
          $ref: '#/components/schemas/{name}ListData'
        meta:
          $ref: ./common/envelopes.yaml#/components/schemas/ResponseMeta
"""


def write(name: str, content: str) -> None:
    path = ROOT / name
    path.write_text(content.rstrip() + "\n", encoding="utf-8")
    print("wrote", path.relative_to(ROOT.parent.parent.parent))


# ---------- projects ----------
write(
    "projects.schemas.yaml",
    f"""openapi: 3.1.0
info:
  title: Projects schemas
  version: 0.1.0
paths: {{}}
components:
  schemas:
    ProjectId:
      type: string
      pattern: '^prj_[0-9A-HJKMNP-TV-Z]{{26}}$'
    RiskClass:
      type: string
      enum: [low, credit, aml, trading, adverse_action]
    ProjectStatus:
      type: string
      enum: [draft, framed, active, archived]
    ScaleQuotaStatus:
      type: string
      enum: [blocked, requested, granted, denied]
    ProblemFrame:
      type: object
      required: [problemStatement, businessKpi, riskClass, permittedPurpose]
      properties:
        problemStatement:
          type: string
        businessKpi:
          type: string
        kpiThreshold:
          type: number
        riskClass:
          $ref: '#/components/schemas/RiskClass'
        permittedPurpose:
          type: string
        submittedAt:
          type: string
          format: date-time
        submittedBy:
          type: string
    Project:
      type: object
      required: [projectId, name, owner, riskClass, status, createdAt, updatedAt]
      properties:
        projectId:
          $ref: '#/components/schemas/ProjectId'
        name:
          type: string
        owner:
          type: string
        riskClass:
          $ref: '#/components/schemas/RiskClass'
        status:
          $ref: '#/components/schemas/ProjectStatus'
        problemFrame:
          $ref: '#/components/schemas/ProblemFrame'
        scaleQuotaStatus:
          $ref: '#/components/schemas/ScaleQuotaStatus'
        createdAt:
          type: string
          format: date-time
        updatedAt:
          type: string
          format: date-time
    ProjectCreateRequest:
      type: object
      required: [name, owner, riskClass]
      properties:
        name:
          type: string
        owner:
          type: string
        riskClass:
          $ref: '#/components/schemas/RiskClass'
    SubmitProblemFrameRequest:
      type: object
      required: [problemStatement, businessKpi, riskClass, permittedPurpose]
      properties:
        problemStatement:
          type: string
        businessKpi:
          type: string
        kpiThreshold:
          type: number
        riskClass:
          $ref: '#/components/schemas/RiskClass'
        permittedPurpose:
          type: string
    ScaleQuotaDecisionRequest:
      type: object
      required: [decision]
      properties:
        decision:
          type: string
          enum: [granted, denied]
        notes:
          type: string
    RiskClassGate:
      type: object
      required: [riskClass, requiredArtefacts, dualControl, monitorsRequired]
      properties:
        riskClass:
          $ref: '#/components/schemas/RiskClass'
        requiredArtefacts:
          type: array
          items:
            type: string
        dualControl:
          type: boolean
        monitorsRequired:
          type: boolean
        extraChecklist:
          type: array
          items:
            type: string
    RiskClassGateMatrix:
      type: object
      required: [gates]
      properties:
        gates:
          type: array
          items:
            $ref: '#/components/schemas/RiskClassGate'
{envelope_pair('Project', 'Project')}    RiskClassGateMatrixResponse:
      type: object
      required: [data]
      properties:
        data:
          $ref: '#/components/schemas/RiskClassGateMatrix'
        meta:
          $ref: ./common/envelopes.yaml#/components/schemas/ResponseMeta
""",
)

write(
    "projects.yaml",
    HEADER.format(
        title="Projects API",
        desc="AI factory projects, problem frames, scale quota, and risk-class gates (BR-1, BR-10).",
        xdomain="prj",
    )
    + """tags:
  - name: Projects
    description: Projects, framing, and risk-class gates
paths:
  /v1/projects:
    get:
      operationId: listProjects
      tags: [Projects]
      summary: List factory projects
"""
    + ddb("Project", "projectId")
    + """      parameters:
        - $ref: ./common/parameters.yaml#/components/parameters/Cursor
        - $ref: ./common/parameters.yaml#/components/parameters/Limit
        - name: riskClass
          in: query
          schema:
            $ref: ./projects.schemas.yaml#/components/schemas/RiskClass
        - name: status
          in: query
          schema:
            $ref: ./projects.schemas.yaml#/components/schemas/ProjectStatus
      responses:
        '200':
          description: Project list
          content:
            application/json:
              schema:
                $ref: ./projects.schemas.yaml#/components/schemas/ProjectListResponse
"""
    + ERR_NO_404
    + """    post:
      operationId: createProject
      tags: [Projects]
      summary: Register a project
"""
    + ddb("Project", "projectId")
    + """      parameters:
        - $ref: ./common/parameters.yaml#/components/parameters/IdempotencyKey
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: ./projects.schemas.yaml#/components/schemas/ProjectCreateRequest
      responses:
        '201':
          description: Created
          content:
            application/json:
              schema:
                $ref: ./projects.schemas.yaml#/components/schemas/ProjectResponse
"""
    + ERR_NO_404
    + """  /v1/projects/{projectId}:
    get:
      operationId: getProject
      tags: [Projects]
      summary: Get a project
"""
    + ddb("Project", "projectId")
    + """      parameters:
        - name: projectId
          in: path
          required: true
          schema:
            $ref: ./projects.schemas.yaml#/components/schemas/ProjectId
      responses:
        '200':
          description: Project
          content:
            application/json:
              schema:
                $ref: ./projects.schemas.yaml#/components/schemas/ProjectResponse
"""
    + ERR
    + """  /v1/projects/{projectId}/frame:
    post:
      operationId: submitProjectProblemFrame
      tags: [Projects]
      summary: Submit problem framing and business KPI (required before scale train)
"""
    + ddb("Project", "projectId")
    + """      parameters:
        - name: projectId
          in: path
          required: true
          schema:
            $ref: ./projects.schemas.yaml#/components/schemas/ProjectId
        - $ref: ./common/parameters.yaml#/components/parameters/IdempotencyKey
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: ./projects.schemas.yaml#/components/schemas/SubmitProblemFrameRequest
      responses:
        '200':
          description: Frame recorded
          content:
            application/json:
              schema:
                $ref: ./projects.schemas.yaml#/components/schemas/ProjectResponse
"""
    + ERR
    + """  /v1/projects/{projectId}/scale-quota:
    post:
      operationId: decideProjectScaleQuota
      tags: [Projects]
      summary: Grant or deny GPU scale quota after framing
"""
    + ddb("Project", "projectId")
    + """      parameters:
        - name: projectId
          in: path
          required: true
          schema:
            $ref: ./projects.schemas.yaml#/components/schemas/ProjectId
        - $ref: ./common/parameters.yaml#/components/parameters/IdempotencyKey
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: ./projects.schemas.yaml#/components/schemas/ScaleQuotaDecisionRequest
      responses:
        '200':
          description: Quota decision
          content:
            application/json:
              schema:
                $ref: ./projects.schemas.yaml#/components/schemas/ProjectResponse
"""
    + ERR
    + """  /v1/risk-class-gates:
    get:
      operationId: getRiskClassGateMatrix
      tags: [Projects]
      summary: Risk-class gate matrix (credit/AML/trading stricter than low)
      x-repository: Project
      responses:
        '200':
          description: Gate matrix
          content:
            application/json:
              schema:
                $ref: ./projects.schemas.yaml#/components/schemas/RiskClassGateMatrixResponse
"""
    + ERR_NO_404
    + """components:
  securitySchemes:
"""
    + SEC,
)

# ---------- models ----------
write(
    "models.schemas.yaml",
    f"""openapi: 3.1.0
info:
  title: Models schemas
  version: 0.1.0
paths: {{}}
components:
  schemas:
    ModelId:
      type: string
      pattern: '^mdl_[0-9A-HJKMNP-TV-Z]{{26}}$'
    ModelStatus:
      type: string
      enum: [draft, trained, evaluated, approved, deployed, retired, dark_find]
    CloudLocus:
      type: string
      description: Training/inference location still reporting into this inventory (BR-12).
      enum: [aws, azure, gcp, onprem, hybrid]
    Model:
      type: object
      required: [modelId, projectId, name, status, riskClass, createdAt, updatedAt]
      properties:
        modelId:
          $ref: '#/components/schemas/ModelId'
        projectId:
          type: string
        name:
          type: string
        status:
          $ref: '#/components/schemas/ModelStatus'
        riskClass:
          type: string
          enum: [low, credit, aml, trading, adverse_action]
        cloudLocus:
          $ref: '#/components/schemas/CloudLocus'
        endpointName:
          type: string
        monitorCoverage:
          type: boolean
        orphanEndpoint:
          type: boolean
        baseModelZooId:
          type: string
        createdAt:
          type: string
          format: date-time
        updatedAt:
          type: string
          format: date-time
        retiredAt:
          type: string
          format: date-time
    ModelCreateRequest:
      type: object
      required: [projectId, name]
      properties:
        projectId:
          type: string
        name:
          type: string
        baseModelZooId:
          type: string
        cloudLocus:
          $ref: '#/components/schemas/CloudLocus'
    ForceRegisterDarkFindRequest:
      type: object
      required: [name, cloudLocus]
      properties:
        projectId:
          type: string
        name:
          type: string
        cloudLocus:
          $ref: '#/components/schemas/CloudLocus'
        endpointName:
          type: string
        notes:
          type: string
    RetireModelRequest:
      type: object
      properties:
        attestation:
          type: string
        certifyNoOrphan:
          type: boolean
{envelope_pair('Model', 'Model')}""",
)

write(
    "models.yaml",
    HEADER.format(
        title="Models API",
        desc="Model inventory including multi-cloud locus and dark-find registration (BR-7, BR-12).",
        xdomain="mdl",
    )
    + """tags:
  - name: Models
    description: Model inventory
paths:
  /v1/models:
    get:
      operationId: listModels
      tags: [Models]
      summary: List models
"""
    + ddb("Model", "modelId")
    + """      parameters:
        - $ref: ./common/parameters.yaml#/components/parameters/Cursor
        - $ref: ./common/parameters.yaml#/components/parameters/Limit
        - name: status
          in: query
          schema:
            $ref: ./models.schemas.yaml#/components/schemas/ModelStatus
        - name: riskClass
          in: query
          schema:
            type: string
        - name: cloudLocus
          in: query
          schema:
            $ref: ./models.schemas.yaml#/components/schemas/CloudLocus
        - name: monitorCoverage
          in: query
          schema:
            type: boolean
        - name: q
          in: query
          description: Search by model id or name
          schema:
            type: string
      responses:
        '200':
          description: Models
          content:
            application/json:
              schema:
                $ref: ./models.schemas.yaml#/components/schemas/ModelListResponse
"""
    + ERR_NO_404
    + """    post:
      operationId: createModel
      tags: [Models]
      summary: Register a model
"""
    + ddb("Model", "modelId")
    + """      parameters:
        - $ref: ./common/parameters.yaml#/components/parameters/IdempotencyKey
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: ./models.schemas.yaml#/components/schemas/ModelCreateRequest
      responses:
        '201':
          description: Created
          content:
            application/json:
              schema:
                $ref: ./models.schemas.yaml#/components/schemas/ModelResponse
"""
    + ERR_NO_404
    + """  /v1/models/{modelId}:
    get:
      operationId: getModel
      tags: [Models]
      summary: Get a model
"""
    + ddb("Model", "modelId")
    + """      parameters:
        - name: modelId
          in: path
          required: true
          schema:
            $ref: ./models.schemas.yaml#/components/schemas/ModelId
      responses:
        '200':
          description: Model
          content:
            application/json:
              schema:
                $ref: ./models.schemas.yaml#/components/schemas/ModelResponse
"""
    + ERR
    + """  /v1/models/dark-finds:
    post:
      operationId: forceRegisterDarkFind
      tags: [Models]
      summary: Force-register a model found outside the factory inventory
"""
    + ddb("Model", "modelId")
    + """      parameters:
        - $ref: ./common/parameters.yaml#/components/parameters/IdempotencyKey
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: ./models.schemas.yaml#/components/schemas/ForceRegisterDarkFindRequest
      responses:
        '201':
          description: Registered
          content:
            application/json:
              schema:
                $ref: ./models.schemas.yaml#/components/schemas/ModelResponse
"""
    + ERR_NO_404
    + """  /v1/models/{modelId}/retire:
    post:
      operationId: retireModel
      tags: [Models]
      summary: Retire a model (first-class; orphans are a control fail)
"""
    + ddb("Model", "modelId")
    + """      parameters:
        - name: modelId
          in: path
          required: true
          schema:
            $ref: ./models.schemas.yaml#/components/schemas/ModelId
        - $ref: ./common/parameters.yaml#/components/parameters/IdempotencyKey
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: ./models.schemas.yaml#/components/schemas/RetireModelRequest
      responses:
        '200':
          description: Retired
          content:
            application/json:
              schema:
                $ref: ./models.schemas.yaml#/components/schemas/ModelResponse
"""
    + ERR
    + """components:
  securitySchemes:
"""
    + SEC,
)

print("projects+models written")
