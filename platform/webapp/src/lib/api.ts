const TOKEN_KEY = 'aetherlab.token';
const ROLE_KEY = 'aetherlab.role';
const NAME_KEY = 'aetherlab.name';
const EMAIL_KEY = 'aetherlab.email';

export function getToken(): string | null {
  return sessionStorage.getItem(TOKEN_KEY);
}

export function getRole(): string {
  return sessionStorage.getItem(ROLE_KEY) ?? 'admin';
}

export function getDisplayName(): string {
  return sessionStorage.getItem(NAME_KEY) ?? 'Operator';
}

export function setSession(token: string, role: string, name: string, email = '') {
  sessionStorage.setItem(TOKEN_KEY, token);
  sessionStorage.setItem(ROLE_KEY, role);
  sessionStorage.setItem(NAME_KEY, name);
  sessionStorage.setItem(EMAIL_KEY, email);
}

export function clearSession() {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(ROLE_KEY);
  sessionStorage.removeItem(NAME_KEY);
  sessionStorage.removeItem(EMAIL_KEY);
}

export function homeForRole(role: string, email = ''): string {
  const e = email.toLowerCase();
  if (e.startsWith('ds@')) return '/frames';
  if (e.startsWith('validator@')) return '/evaluations';
  if (e.startsWith('po@')) return '/monitors';
  if (e.startsWith('security@')) return '/datasets';
  if (e.startsWith('auditor@') || role === 'viewer') return '/evidence';
  if (role === 'analyst') return '/evaluations';
  if (role === 'ops') return '/datasets';
  return '/inventory';
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  const method = (init.method ?? 'GET').toUpperCase();
  const hasBody = init.body != null && init.body !== '';
  if (hasBody) headers.set('Content-Type', 'application/json');
  const token = getToken();
  if (token) headers.set('Authorization', `Bearer ${token}`);
  else headers.set('X-API-Key', 'ddd_demo_local_dev_key');
  if (method !== 'GET' && method !== 'HEAD') {
    headers.set('Idempotency-Key', crypto.randomUUID());
  }
  const res = await fetch(path, { ...init, headers });
  const text = await res.text();
  const body = text ? JSON.parse(text) : null;
  if (!res.ok) {
    const detail = body?.detail || body?.message || res.statusText;
    throw new Error(detail);
  }
  return body as T;
}

export const api = {
  login: (email: string, password: string) =>
    request<{ data: { accessToken: string; operator: { displayName: string; role: string } } }>(
      '/v0/auth/login',
      { method: 'POST', body: JSON.stringify({ email, password }) }
    ),
  listModels: (params: Record<string, string> = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request<{ data: { items: ModelRow[] } }>(`/v1/models${qs ? `?${qs}` : ''}`);
  },
  getModel: (id: string) => request<{ data: ModelRow }>(`/v1/models/${id}`),
  forceRegisterDarkFind: (body: object) =>
    request<{ data: ModelRow }>('/v1/models/dark-finds', { method: 'POST', body: JSON.stringify(body) }),
  retireModel: (id: string) =>
    request<{ data: ModelRow }>(`/v1/models/${id}/retire`, { method: 'POST' }),
  listProjects: () => request<{ data: { items: ProjectRow[] } }>('/v1/projects'),
  getProject: (id: string) => request<{ data: ProjectRow }>(`/v1/projects/${id}`),
  createProject: (body: object) =>
    request<{ data: ProjectRow }>('/v1/projects', { method: 'POST', body: JSON.stringify(body) }),
  submitFrame: (projectId: string, body: object) =>
    request<{ data: ProjectRow }>(`/v1/projects/${projectId}/frame`, {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  decideQuota: (projectId: string, decision: string) =>
    request<{ data: ProjectRow }>(`/v1/projects/${projectId}/scale-quota`, {
      method: 'POST',
      body: JSON.stringify({ decision }),
    }),
  gateMatrix: () => request<{ data: { gates: GateRow[] } }>('/v1/risk-class-gates'),
  listDatasets: () => request<{ data: { items: DatasetRow[] } }>('/v1/datasets'),
  listGrants: (id: string) =>
    request<{ data: { items: GrantRow[] } }>(`/v1/datasets/${id}/grants`),
  createGrant: (id: string, body: object) =>
    request<{ data: GrantRow }>(`/v1/datasets/${id}/grants`, {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  revokeGrant: (datasetId: string, grantId: string) =>
    request<unknown>(`/v1/datasets/${datasetId}/grants/${grantId}`, { method: 'DELETE' }),
  attestDataset: (id: string, purpose: string) =>
    request<{ data: DatasetRow }>(`/v1/datasets/${id}/attest`, {
      method: 'POST',
      body: JSON.stringify({ purpose }),
    }),
  listJobs: () => request<{ data: { items: JobRow[] } }>('/v1/training-jobs'),
  createJob: (body: object) =>
    request<{ data: JobRow }>('/v1/training-jobs', { method: 'POST', body: JSON.stringify(body) }),
  stopJob: (id: string) =>
    request<{ data: JobRow }>(`/v1/training-jobs/${id}/stop`, { method: 'POST' }),
  registerBaseWeight: (id: string, body: object) =>
    request<{ data: JobRow }>(`/v1/training-jobs/${id}/base-weight`, {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  spend: () => request<{ data: { items: SpendRow[]; costApiLag: boolean } }>('/v1/spend'),
  listEvals: () => request<{ data: { items: EvalRow[] } }>('/v1/evaluations'),
  createEval: (body: object) =>
    request<{ data: EvalRow }>('/v1/evaluations', { method: 'POST', body: JSON.stringify(body) }),
  decideEval: (id: string, verdict: string) =>
    request<{ data: EvalRow }>(`/v1/evaluations/${id}/decision`, {
      method: 'POST',
      body: JSON.stringify({ verdict }),
    }),
  listDeployments: () => request<{ data: { items: DeployRow[] } }>('/v1/deployments'),
  requestDeploy: (body: object) =>
    request<{ data: DeployRow }>('/v1/deployments', { method: 'POST', body: JSON.stringify(body) }),
  decideDeploy: (id: string, decision: string) =>
    request<{ data: DeployRow }>(`/v1/deployments/${id}/decision`, {
      method: 'POST',
      body: JSON.stringify({ decision }),
    }),
  executeDeploy: (id: string) =>
    request<{ data: DeployRow }>(`/v1/deployments/${id}/deploy`, { method: 'POST' }),
  retireDeploy: (id: string) =>
    request<{ data: DeployRow }>(`/v1/deployments/${id}/retire`, { method: 'POST' }),
  rollbackDeploy: (id: string, priorDeploymentId?: string) =>
    request<{ data: DeployRow }>(`/v1/deployments/${id}/rollback`, {
      method: 'POST',
      body: JSON.stringify({ priorDeploymentId }),
    }),
  listMonitors: () => request<{ data: { items: MonitorRow[] } }>('/v1/monitors'),
  createMonitor: (body: object) =>
    request<{ data: MonitorRow }>('/v1/monitors', { method: 'POST', body: JSON.stringify(body) }),
  ackMonitor: (id: string) =>
    request<{ data: MonitorRow }>(`/v1/monitors/${id}/acknowledge`, {
      method: 'POST',
      body: JSON.stringify({ notes: 'acked' }),
    }),
  listPacks: () => request<{ data: { items: PackRow[] } }>('/v1/evidence-packs'),
  createPack: (modelId: string) =>
    request<{ data: PackRow }>('/v1/evidence-packs', {
      method: 'POST',
      body: JSON.stringify({ modelId }),
    }),
  exportPack: (id: string) =>
    request<{ data: PackRow }>(`/v1/evidence-packs/${id}/export`, { method: 'POST' }),
};

export type ModelRow = {
  modelId: string;
  projectId?: string;
  name: string;
  status: string;
  riskClass?: string;
  cloudLocus?: string;
  endpointName?: string;
  monitorCoverage?: boolean;
  orphanEndpoint?: boolean;
};
export type ProjectRow = {
  projectId: string;
  name: string;
  owner: string;
  riskClass: string;
  status: string;
  scaleQuotaStatus?: string;
  problemFrame?: {
    problemStatement: string;
    businessKpi: string;
    permittedPurpose: string;
  };
};
export type DatasetRow = {
  datasetId: string;
  projectId: string;
  sourceSystem: string;
  purpose: string;
  locationUri: string;
  extractedAt?: string;
  residency?: string;
};
export type GrantRow = {
  grantId: string;
  grantee: string;
  purpose: string;
  expiresAt: string;
  status: string;
};
export type JobRow = {
  trainingJobId: string;
  modelId: string;
  status: string;
  costUsd?: number;
  zombie?: boolean;
  team?: string;
  computeProfile?: string;
};
export type SpendRow = {
  modelId: string;
  team: string;
  costUsd: number;
  zombieJobCount: number;
};
export type EvalRow = {
  evaluationId: string;
  modelId: string;
  declaredKpi: string;
  observedKpiValue?: number;
  businessGoalMet: boolean;
  techMetrics?: Record<string, number>;
  verdict: string;
  notes?: string;
};
export type DeployRow = {
  deploymentId: string;
  modelId: string;
  endpointName: string;
  status: string;
  builderId?: string;
  validatorId?: string;
  monitorIds?: string[];
  monitorsAttached?: boolean;
};
export type MonitorRow = {
  monitorId: string;
  modelId: string;
  metric: string;
  threshold: number;
  status: string;
  retrainTrigger?: boolean;
};
export type PackRow = {
  evidencePackId: string;
  modelId: string;
  status: string;
  artefacts?: { kind: string; present: boolean }[];
  hash?: string;
  downloadUrl?: string;
};
export type GateRow = {
  riskClass: string;
  requiredArtefacts: string[];
  dualControl: boolean;
  monitorsRequired: boolean;
  extraChecklist?: string[];
};
