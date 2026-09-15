/**
 * In-memory factory store for Aetherlab product domains (sandbox).
 */

import { nowIso, responseMeta, sandboxId } from './sandbox-store.js';

type Rec = Record<string, unknown>;

const projects = new Map<string, Rec>();
const models = new Map<string, Rec>();
const datasets = new Map<string, Rec>();
const grants = new Map<string, Rec>();
const jobs = new Map<string, Rec>();
const evaluations = new Map<string, Rec>();
const deployments = new Map<string, Rec>();
const monitors = new Map<string, Rec>();
const packs = new Map<string, Rec>();

function env(data: unknown, correlationId?: string) {
  return { data, ...responseMeta(correlationId) };
}

function listEnv(items: unknown[], correlationId?: string) {
  return { data: { items }, ...responseMeta(correlationId) };
}

function raw(input: unknown): Rec {
  return (input ?? {}) as Rec;
}

function notFound(kind: string, id: string): never {
  const err = new Error(`${kind} not found: ${id}`) as Error & { code: string };
  err.name = 'NotFoundError';
  err.code = 'NOT_FOUND';
  throw err;
}

function unprocessable(message: string): never {
  const err = new Error(message) as Error & { code: string };
  err.name = 'ValidationError';
  err.code = 'VALIDATION_ERROR';
  throw err;
}

const GATES = {
  gates: [
    {
      riskClass: 'low',
      requiredArtefacts: ['problem_frame'],
      dualControl: false,
      monitorsRequired: true,
    },
    {
      riskClass: 'credit',
      requiredArtefacts: ['problem_frame', 'lineage', 'business_eval'],
      dualControl: true,
      monitorsRequired: true,
      extraChecklist: ['adverse_action_notice'],
    },
    {
      riskClass: 'aml',
      requiredArtefacts: ['problem_frame', 'lineage', 'business_eval'],
      dualControl: true,
      monitorsRequired: true,
      extraChecklist: ['purpose_bound_access'],
    },
    {
      riskClass: 'trading',
      requiredArtefacts: ['problem_frame', 'lineage', 'business_eval', 'kill_switch'],
      dualControl: true,
      monitorsRequired: true,
    },
    {
      riskClass: 'adverse_action',
      requiredArtefacts: ['problem_frame', 'lineage', 'business_eval', 'explainability'],
      dualControl: true,
      monitorsRequired: true,
    },
  ],
};

function seed() {
  if (projects.size > 0) return;
  const now = nowIso();
  const projectId = 'prj_01j00000000000000000000001';
  const modelId = 'mdl_01j00000000000000000000001';
  const datasetId = 'dst_01j00000000000000000000001';
  const jobId = 'trn_01j00000000000000000000001';
  const evalId = 'evl_01j00000000000000000000001';
  const monId = 'mon_01j00000000000000000000001';
  const depId = 'dep_01j00000000000000000000001';
  const packId = 'evp_01j00000000000000000000001';

  projects.set(projectId, {
    projectId,
    name: 'AML transaction screening',
    owner: 'platform-ml',
    riskClass: 'aml',
    status: 'framed',
    scaleQuotaStatus: 'granted',
    problemFrame: {
      problemStatement: 'Reduce false positives in AML alerting without missing SARs.',
      businessKpi: 'precision_at_alert',
      kpiThreshold: 0.72,
      riskClass: 'aml',
      permittedPurpose: 'aml_surveillance',
      submittedAt: now,
      submittedBy: 'ds@bank.local',
    },
    createdAt: now,
    updatedAt: now,
  });

  datasets.set(datasetId, {
    datasetId,
    projectId,
    sourceSystem: 'core-banking-txn',
    extractedAt: now,
    purpose: 'aml_surveillance',
    locationUri: 's3://governed-lake/aml/txn/',
    residency: 'eu-central-1',
    qualityNotes: 'hashed party ids',
    createdAt: now,
    updatedAt: now,
  });

  models.set(modelId, {
    modelId,
    projectId,
    name: 'aml-screen-v3',
    status: 'deployed',
    riskClass: 'aml',
    cloudLocus: 'aws',
    endpointName: 'aml-screen-prod',
    monitorCoverage: true,
    orphanEndpoint: false,
    createdAt: now,
    updatedAt: now,
  });

  jobs.set(jobId, {
    trainingJobId: jobId,
    modelId,
    datasetId,
    projectId,
    status: 'running',
    computeProfile: 'p3.8xlarge',
    costUsd: 1840,
    team: 'platform-ml',
    zombie: true,
    createdAt: now,
    updatedAt: now,
  });

  evaluations.set(evalId, {
    evaluationId: evalId,
    modelId,
    declaredKpi: 'precision_at_alert',
    observedKpiValue: 0.78,
    businessGoalMet: true,
    techMetrics: { auc: 0.91 },
    verdict: 'passed',
    notes: 'Business KPI met; AUC secondary only.',
    createdAt: now,
    updatedAt: now,
  });

  monitors.set(monId, {
    monitorId: monId,
    modelId,
    endpointName: 'aml-screen-prod',
    metric: 'business_kpi',
    threshold: 0.72,
    status: 'healthy',
    retrainTrigger: true,
    createdAt: now,
    updatedAt: now,
  });
  monitors.set('mon_01j00000000000000000000002', {
    monitorId: 'mon_01j00000000000000000000002',
    modelId,
    endpointName: 'aml-screen-prod',
    metric: 'precision_at_alert',
    threshold: 0.72,
    status: 'drifting',
    retrainTrigger: true,
    createdAt: now,
    updatedAt: now,
  });

  deployments.set(depId, {
    deploymentId: depId,
    modelId,
    endpointName: 'aml-screen-prod',
    status: 'deployed',
    builderId: 'ds@bank.local',
    validatorId: 'mrm@bank.local',
    monitorIds: [monId],
    monitorsAttached: true,
    createdAt: now,
    updatedAt: now,
  });

  packs.set(packId, {
    evidencePackId: packId,
    modelId,
    status: 'complete',
    artefacts: [
      { kind: 'lineage', present: true },
      { kind: 'approvals', present: true },
      { kind: 'metrics', present: true },
      { kind: 'incidents', present: true },
    ],
    hash: 'sha256:demo',
    createdAt: now,
    updatedAt: now,
  });

  const draftProjectId = 'prj_01j00000000000000000000002';
  const shadowModelId = 'mdl_01j00000000000000000000002';
  projects.set(draftProjectId, {
    projectId: draftProjectId,
    name: 'Unframed shadow experiment',
    owner: 'rogue-lab',
    riskClass: 'aml',
    status: 'draft',
    scaleQuotaStatus: 'blocked',
    createdAt: now,
    updatedAt: now,
  });
  models.set(shadowModelId, {
    modelId: shadowModelId,
    projectId: draftProjectId,
    name: 'shadow-gpu-v0',
    status: 'registered',
    riskClass: 'aml',
    cloudLocus: 'aws',
    monitorCoverage: false,
    orphanEndpoint: false,
    createdAt: now,
    updatedAt: now,
  });
}

seed();

export const factoryOps = {
  listProjects(input: unknown) {
    const q = raw(input);
    let items = [...projects.values()];
    if (q.riskClass) items = items.filter((p) => p.riskClass === q.riskClass);
    if (q.status) items = items.filter((p) => p.status === q.status);
    return listEnv(items, String(q.correlationId ?? ''));
  },
  createProject(input: unknown) {
    const q = raw(input);
    const projectId = String(q.id ?? sandboxId('prj'));
    const now = nowIso();
    const item = {
      projectId,
      name: q.name,
      owner: q.owner,
      riskClass: q.riskClass,
      status: 'draft',
      scaleQuotaStatus: 'blocked',
      createdAt: now,
      updatedAt: now,
    };
    projects.set(projectId, item);
    return env(item, String(q.correlationId ?? ''));
  },
  getProject(input: unknown) {
    const q = raw(input);
    const id = String(q.projectId ?? q.id ?? '');
    const item = projects.get(id);
    if (!item) notFound('Project', id);
    return env(item, String(q.correlationId ?? ''));
  },
  submitProjectProblemFrame(input: unknown) {
    const q = raw(input);
    const id = String(q.projectId ?? '');
    const item = projects.get(id);
    if (!item) notFound('Project', id);
    const now = nowIso();
    item.problemFrame = {
      problemStatement: q.problemStatement,
      businessKpi: q.businessKpi,
      kpiThreshold: q.kpiThreshold,
      riskClass: q.riskClass ?? item.riskClass,
      permittedPurpose: q.permittedPurpose,
      submittedAt: now,
    };
    item.status = 'framed';
    item.scaleQuotaStatus = 'requested';
    item.updatedAt = now;
    return env(item, String(q.correlationId ?? ''));
  },
  decideProjectScaleQuota(input: unknown) {
    const q = raw(input);
    const id = String(q.projectId ?? '');
    const item = projects.get(id);
    if (!item) notFound('Project', id);
    if (!item.problemFrame) unprocessable('Problem frame and business KPI required before scale quota (BR-1)');
    item.scaleQuotaStatus = q.decision === 'denied' ? 'denied' : 'granted';
    item.status = 'active';
    item.updatedAt = nowIso();
    return env(item, String(q.correlationId ?? ''));
  },
  getRiskClassGateMatrix(input: unknown) {
    return env(GATES, String(raw(input).correlationId ?? ''));
  },

  listModels(input: unknown) {
    const q = raw(input);
    let items = [...models.values()];
    if (q.status) items = items.filter((m) => m.status === q.status);
    if (q.riskClass) items = items.filter((m) => m.riskClass === q.riskClass);
    if (q.cloudLocus) items = items.filter((m) => m.cloudLocus === q.cloudLocus);
    if (q.monitorCoverage === true || q.monitorCoverage === 'true') {
      items = items.filter((m) => m.monitorCoverage === true);
    }
    if (q.q) {
      const s = String(q.q).toLowerCase();
      items = items.filter(
        (m) =>
          String(m.modelId).toLowerCase().includes(s) ||
          String(m.name).toLowerCase().includes(s)
      );
    }
    return listEnv(items, String(q.correlationId ?? ''));
  },
  createModel(input: unknown) {
    const q = raw(input);
    const modelId = String(q.id ?? sandboxId('mdl'));
    const now = nowIso();
    const item = {
      modelId,
      projectId: q.projectId,
      name: q.name,
      status: 'draft',
      riskClass: projects.get(String(q.projectId))?.riskClass ?? 'low',
      cloudLocus: q.cloudLocus ?? 'aws',
      baseModelZooId: q.baseModelZooId,
      monitorCoverage: false,
      orphanEndpoint: false,
      createdAt: now,
      updatedAt: now,
    };
    models.set(modelId, item);
    return env(item, String(q.correlationId ?? ''));
  },
  getModel(input: unknown) {
    const q = raw(input);
    const id = String(q.modelId ?? q.id ?? '');
    const item = models.get(id);
    if (!item) notFound('Model', id);
    return env(item, String(q.correlationId ?? ''));
  },
  forceRegisterDarkFind(input: unknown) {
    const q = raw(input);
    const modelId = String(q.id ?? sandboxId('mdl'));
    const now = nowIso();
    const item = {
      modelId,
      projectId: q.projectId,
      name: q.name,
      status: 'dark_find',
      riskClass: 'low',
      cloudLocus: q.cloudLocus,
      endpointName: q.endpointName,
      monitorCoverage: false,
      orphanEndpoint: Boolean(q.endpointName),
      createdAt: now,
      updatedAt: now,
    };
    models.set(modelId, item);
    return env(item, String(q.correlationId ?? ''));
  },
  retireModel(input: unknown) {
    const q = raw(input);
    const id = String(q.modelId ?? '');
    const item = models.get(id);
    if (!item) notFound('Model', id);
    item.status = 'retired';
    item.retiredAt = nowIso();
    item.updatedAt = item.retiredAt;
    return env(item, String(q.correlationId ?? ''));
  },

  listDatasets(input: unknown) {
    const q = raw(input);
    let items = [...datasets.values()];
    if (q.projectId) items = items.filter((d) => d.projectId === q.projectId);
    return listEnv(items, String(q.correlationId ?? ''));
  },
  registerDataset(input: unknown) {
    const q = raw(input);
    const datasetId = String(q.id ?? sandboxId('dst'));
    const now = nowIso();
    const item = {
      datasetId,
      projectId: q.projectId,
      sourceSystem: q.sourceSystem,
      extractedAt: q.extractedAt ?? now,
      purpose: q.purpose,
      locationUri: q.locationUri,
      residency: q.residency,
      qualityNotes: q.qualityNotes,
      createdAt: now,
      updatedAt: now,
    };
    datasets.set(datasetId, item);
    return env(item, String(q.correlationId ?? ''));
  },
  getDataset(input: unknown) {
    const q = raw(input);
    const id = String(q.datasetId ?? q.id ?? '');
    const item = datasets.get(id);
    if (!item) notFound('Dataset', id);
    return env(item, String(q.correlationId ?? ''));
  },
  listDatasetGrants(input: unknown) {
    const q = raw(input);
    const items = [...grants.values()].filter((g) => g.datasetId === q.datasetId);
    return listEnv(items, String(q.correlationId ?? ''));
  },
  createDatasetGrant(input: unknown) {
    const q = raw(input);
    const grantId = sandboxId('grn');
    const item = {
      grantId,
      datasetId: q.datasetId,
      grantee: q.grantee,
      purpose: q.purpose,
      expiresAt: q.expiresAt,
      status: 'active',
    };
    grants.set(grantId, item);
    return env(item, String(q.correlationId ?? ''));
  },
  revokeDatasetGrant(input: unknown) {
    const q = raw(input);
    const grant = grants.get(String(q.grantId ?? ''));
    if (grant) grant.status = 'revoked';
    return undefined;
  },
  attestDatasetPurpose(input: unknown) {
    const q = raw(input);
    const item = datasets.get(String(q.datasetId ?? ''));
    if (!item) notFound('Dataset', String(q.datasetId));
    item.purpose = q.purpose ?? item.purpose;
    item.updatedAt = nowIso();
    return env(item, String(q.correlationId ?? ''));
  },

  listTrainingJobs(input: unknown) {
    const q = raw(input);
    let items = [...jobs.values()];
    if (q.modelId) items = items.filter((j) => j.modelId === q.modelId);
    if (q.status) items = items.filter((j) => j.status === q.status);
    if (q.zombie === true || q.zombie === 'true') items = items.filter((j) => j.zombie);
    return listEnv(items, String(q.correlationId ?? ''));
  },
  createTrainingJob(input: unknown) {
    const q = raw(input);
    const model = models.get(String(q.modelId ?? ''));
    const project = model ? projects.get(String(model.projectId)) : undefined;
    if (!project?.problemFrame) {
      unprocessable('Scale train blocked: register problem framing and business KPI first (BR-1)');
    }
    if (project.scaleQuotaStatus !== 'granted') {
      unprocessable('Scale train blocked: GPU quota not granted');
    }
    if (!datasets.get(String(q.datasetId ?? ''))) {
      unprocessable('Training blocked: dataset lineage missing (BR-2)');
    }
    const trainingJobId = String(q.id ?? sandboxId('trn'));
    const now = nowIso();
    const item = {
      trainingJobId,
      modelId: q.modelId,
      datasetId: q.datasetId,
      projectId: project.projectId,
      status: 'queued',
      computeProfile: q.computeProfile,
      costUsd: 0,
      team: q.team ?? 'platform-ml',
      zombie: false,
      baseWeight: q.baseWeight,
      createdAt: now,
      updatedAt: now,
    };
    jobs.set(trainingJobId, item);
    if (model) {
      model.status = 'trained';
      model.updatedAt = now;
    }
    return env(item, String(q.correlationId ?? ''));
  },
  getTrainingJob(input: unknown) {
    const q = raw(input);
    const id = String(q.trainingJobId ?? q.id ?? '');
    const item = jobs.get(id);
    if (!item) notFound('TrainingJob', id);
    return env(item, String(q.correlationId ?? ''));
  },
  stopTrainingJob(input: unknown) {
    const q = raw(input);
    const id = String(q.trainingJobId ?? '');
    const item = jobs.get(id);
    if (!item) notFound('TrainingJob', id);
    item.status = 'stopped';
    item.zombie = false;
    item.stoppedAt = nowIso();
    item.updatedAt = item.stoppedAt;
    return env(item, String(q.correlationId ?? ''));
  },
  registerTrainingJobBaseWeight(input: unknown) {
    const q = raw(input);
    const item = jobs.get(String(q.trainingJobId ?? ''));
    if (!item) notFound('TrainingJob', String(q.trainingJobId));
    item.baseWeight = {
      modelZooId: q.modelZooId,
      licence: q.licence,
      riskNotes: q.riskNotes,
    };
    item.updatedAt = nowIso();
    return env(item, String(q.correlationId ?? ''));
  },
  listCloudSpend(input: unknown) {
    const q = raw(input);
    const byKey = new Map<string, Rec>();
    for (const job of jobs.values()) {
      if (q.team && job.team !== q.team) continue;
      const key = `${job.modelId}:${job.team}`;
      const row = byKey.get(key) ?? {
        modelId: job.modelId,
        team: job.team,
        costUsd: 0,
        zombieJobCount: 0,
      };
      row.costUsd = Number(row.costUsd) + Number(job.costUsd ?? 0);
      if (job.zombie) row.zombieJobCount = Number(row.zombieJobCount) + 1;
      byKey.set(key, row);
    }
    return env({ items: [...byKey.values()], costApiLag: false }, String(q.correlationId ?? ''));
  },

  listEvaluations(input: unknown) {
    const q = raw(input);
    let items = [...evaluations.values()];
    if (q.modelId) items = items.filter((e) => e.modelId === q.modelId);
    if (q.verdict) items = items.filter((e) => e.verdict === q.verdict);
    return listEnv(items, String(q.correlationId ?? ''));
  },
  createEvaluation(input: unknown) {
    const q = raw(input);
    if (!q.declaredKpi) unprocessable('Business KPI artefact required (BR-3)');
    const evaluationId = String(q.id ?? sandboxId('evl'));
    const now = nowIso();
    const item = {
      evaluationId,
      modelId: q.modelId,
      declaredKpi: q.declaredKpi,
      observedKpiValue: q.observedKpiValue,
      businessGoalMet: q.businessGoalMet,
      techMetrics: q.techMetrics,
      notes: q.notes,
      artefactUri: q.artefactUri,
      verdict: 'pending',
      createdAt: now,
      updatedAt: now,
    };
    evaluations.set(evaluationId, item);
    return env(item, String(q.correlationId ?? ''));
  },
  getEvaluation(input: unknown) {
    const q = raw(input);
    const id = String(q.evaluationId ?? q.id ?? '');
    const item = evaluations.get(id);
    if (!item) notFound('Evaluation', id);
    return env(item, String(q.correlationId ?? ''));
  },
  decideEvaluation(input: unknown) {
    const q = raw(input);
    const item = evaluations.get(String(q.evaluationId ?? ''));
    if (!item) notFound('Evaluation', String(q.evaluationId));
    if (!item.declaredKpi) unprocessable('AUC-only cannot pass; business KPI required (BR-3)');
    if (q.verdict === 'passed' && !item.businessGoalMet) {
      unprocessable('Cannot pass: declared business goal not met (BR-3)');
    }
    item.verdict = q.verdict;
    item.notes = q.notes ?? item.notes;
    item.updatedAt = nowIso();
    const model = models.get(String(item.modelId));
    if (model && q.verdict === 'passed') {
      model.status = 'evaluated';
      model.updatedAt = nowIso();
    }
    return env(item, String(q.correlationId ?? ''));
  },

  listDeployments(input: unknown) {
    const q = raw(input);
    let items = [...deployments.values()];
    if (q.status) items = items.filter((d) => d.status === q.status);
    if (q.modelId) items = items.filter((d) => d.modelId === q.modelId);
    return listEnv(items, String(q.correlationId ?? ''));
  },
  requestDeployment(input: unknown) {
    const q = raw(input);
    const monitorIds = (q.monitorIds as string[] | undefined) ?? [];
    if (!monitorIds.length) unprocessable('Deployment blocked: monitors must be attached (BR-5)');
    const builderId = String(q.createdByActorId ?? q.builderId ?? 'builder');
    const deploymentId = String(q.id ?? sandboxId('dep'));
    const now = nowIso();
    const item = {
      deploymentId,
      modelId: q.modelId,
      endpointName: q.endpointName,
      status: 'pending',
      builderId,
      monitorIds,
      monitorsAttached: true,
      highRiskException: Boolean(q.highRiskException),
      createdAt: now,
      updatedAt: now,
    };
    deployments.set(deploymentId, item);
    return env(item, String(q.correlationId ?? ''));
  },
  getDeployment(input: unknown) {
    const q = raw(input);
    const id = String(q.deploymentId ?? q.id ?? '');
    const item = deployments.get(id);
    if (!item) notFound('Deployment', id);
    return env(item, String(q.correlationId ?? ''));
  },
  decideDeployment(input: unknown) {
    const q = raw(input);
    const item = deployments.get(String(q.deploymentId ?? ''));
    if (!item) notFound('Deployment', String(q.deploymentId));
    const validatorId = String(q.createdByActorId ?? q.validatorId ?? 'validator');
    if (validatorId === item.builderId) {
      unprocessable('Dual control failed: builder cannot be validator (BR-4)');
    }
    item.validatorId = validatorId;
    item.status = q.decision === 'rejected' ? 'rejected' : 'approved';
    item.updatedAt = nowIso();
    return env(item, String(q.correlationId ?? ''));
  },
  executeDeployment(input: unknown) {
    const q = raw(input);
    const item = deployments.get(String(q.deploymentId ?? ''));
    if (!item) notFound('Deployment', String(q.deploymentId));
    if (item.status !== 'approved') unprocessable('Deploy requires validator approval');
    if (!item.monitorsAttached) unprocessable('Deployment blocked: monitors missing (BR-5)');
    item.status = 'deployed';
    item.updatedAt = nowIso();
    const model = models.get(String(item.modelId));
    if (model) {
      model.status = 'deployed';
      model.endpointName = item.endpointName;
      model.monitorCoverage = true;
      model.updatedAt = nowIso();
    }
    return env(item, String(q.correlationId ?? ''));
  },
  retireDeployment(input: unknown) {
    const q = raw(input);
    const item = deployments.get(String(q.deploymentId ?? ''));
    if (!item) notFound('Deployment', String(q.deploymentId));
    item.status = 'retired';
    item.updatedAt = nowIso();
    return env(item, String(q.correlationId ?? ''));
  },
  rollbackDeployment(input: unknown) {
    const q = raw(input);
    const item = deployments.get(String(q.deploymentId ?? ''));
    if (!item) notFound('Deployment', String(q.deploymentId));
    item.status = 'rolled_back';
    item.rollbackOfDeploymentId = q.priorDeploymentId;
    item.updatedAt = nowIso();
    return env(item, String(q.correlationId ?? ''));
  },

  listMonitors(input: unknown) {
    const q = raw(input);
    let items = [...monitors.values()];
    if (q.modelId) items = items.filter((m) => m.modelId === q.modelId);
    if (q.status) items = items.filter((m) => m.status === q.status);
    return listEnv(items, String(q.correlationId ?? ''));
  },
  createMonitor(input: unknown) {
    const q = raw(input);
    const monitorId = String(q.id ?? sandboxId('mon'));
    const now = nowIso();
    const item = {
      monitorId,
      modelId: q.modelId,
      endpointName: q.endpointName,
      metric: q.metric,
      threshold: q.threshold,
      status: 'healthy',
      alertRouting: q.alertRouting,
      retrainTrigger: q.retrainTrigger ?? true,
      createdAt: now,
      updatedAt: now,
    };
    monitors.set(monitorId, item);
    const model = models.get(String(q.modelId));
    if (model) model.monitorCoverage = true;
    return env(item, String(q.correlationId ?? ''));
  },
  getMonitor(input: unknown) {
    const q = raw(input);
    const id = String(q.monitorId ?? q.id ?? '');
    const item = monitors.get(id);
    if (!item) notFound('Monitor', id);
    return env(item, String(q.correlationId ?? ''));
  },
  acknowledgeMonitor(input: unknown) {
    const q = raw(input);
    const item = monitors.get(String(q.monitorId ?? ''));
    if (!item) notFound('Monitor', String(q.monitorId));
    item.lastAcknowledgedAt = nowIso();
    item.status = 'healthy';
    item.updatedAt = item.lastAcknowledgedAt;
    return env(item, String(q.correlationId ?? ''));
  },

  listEvidencePacks(input: unknown) {
    const q = raw(input);
    let items = [...packs.values()];
    if (q.modelId) items = items.filter((p) => p.modelId === q.modelId);
    return listEnv(items, String(q.correlationId ?? ''));
  },
  createModelEvidencePack(input: unknown) {
    const q = raw(input);
    const evidencePackId = String(q.id ?? sandboxId('evp'));
    const now = nowIso();
    const item = {
      evidencePackId,
      modelId: q.modelId,
      status: 'complete',
      artefacts: [
        { kind: 'lineage', present: true },
        { kind: 'approvals', present: true },
        { kind: 'metrics', present: true },
        { kind: 'incidents', present: true },
      ],
      createdAt: now,
      updatedAt: now,
    };
    packs.set(evidencePackId, item);
    return env(item, String(q.correlationId ?? ''));
  },
  getEvidencePack(input: unknown) {
    const q = raw(input);
    const id = String(q.evidencePackId ?? q.id ?? '');
    const item = packs.get(id);
    if (!item) notFound('EvidencePack', id);
    return env(item, String(q.correlationId ?? ''));
  },
  exportEvidencePack(input: unknown) {
    const q = raw(input);
    const item = packs.get(String(q.evidencePackId ?? ''));
    if (!item) notFound('EvidencePack', String(q.evidencePackId));
    item.status = 'exported';
    item.hash = `sha256:${String(item.evidencePackId).slice(-8)}`;
    item.downloadUrl = `https://api.aetherlab.local/v1/evidence-packs/${item.evidencePackId}/download`;
    item.shareExpiresAt = new Date(Date.now() + 86400000).toISOString();
    item.updatedAt = nowIso();
    return env(item, String(q.correlationId ?? ''));
  },
};
