import { FormEvent, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { ModelPalletCard } from '../models/components';
import { FramingGate, FramedProjectTable } from '../projects/components';
import { LineageGraph } from '../datasets/components';
import { BusinessEvalPanel } from '../evaluations/components';
import { DualControlRail, MonitorAttachmentChecklist } from '../deployments/components';
import { EvidencePackExport } from '../evidencepacks/components';
import { ZombieJobKill } from '../trainingjobs/components';

export function InventoryPage() {
  const qc = useQueryClient();
  const [q, setQ] = useState('');
  const [riskClass, setRiskClass] = useState('');
  const [status, setStatus] = useState('');
  const params: Record<string, string> = {};
  if (q) params.q = q;
  if (riskClass) params.riskClass = riskClass;
  if (status) params.status = status;
  const models = useQuery({ queryKey: ['models', params], queryFn: () => api.listModels(params) });
  const items = models.data?.data.items ?? [];
  const orphans = items.filter(
    (m) => m.orphanEndpoint || (!m.monitorCoverage && m.status === 'deployed')
  );
  const [darkName, setDarkName] = useState('shadow-endpoint-find');
  return (
    <div>
      <h1>Model inventory</h1>
      {orphans.length > 0 && (
        <p className="banner scrap">Orphan / unmonitored production endpoints require action (BR-5, BR-7).</p>
      )}
      <div className="row" style={{ margin: '12px 0' }}>
        <input placeholder="Search model id or name" value={q} onChange={(e) => setQ(e.target.value)} />
        <select value={riskClass} onChange={(e) => setRiskClass(e.target.value)}>
          <option value="">all risk</option>
          <option value="aml">aml</option>
          <option value="credit">credit</option>
          <option value="low">low</option>
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">all stages</option>
          <option value="deployed">deployed</option>
          <option value="registered">registered</option>
          <option value="dark_find">dark_find</option>
          <option value="retired">retired</option>
        </select>
      </div>
      <form
        className="row"
        onSubmit={async (e) => {
          e.preventDefault();
          await api.forceRegisterDarkFind({
            name: darkName,
            cloudLocus: 'aws',
            endpointName: 'personal-account-endpoint',
            projectId: 'prj_01j00000000000000000000002',
          });
          qc.invalidateQueries({ queryKey: ['models'] });
        }}
      >
        <input value={darkName} onChange={(e) => setDarkName(e.target.value)} placeholder="Dark-find name" />
        <button type="submit">Force-register dark find</button>
      </form>
      <div className="cards">
        {items.map((m) => (
          <ModelPalletCard key={m.modelId} model={m} />
        ))}
      </div>
      {items.length === 0 && (
        <p>
          Empty factory. Frame the first model from <Link to="/frames">Problem frames</Link>.
        </p>
      )}
    </div>
  );
}

export function ModelDetailPage() {
  const qc = useQueryClient();
  const { modelId } = useParams();
  const q = useQuery({ queryKey: ['model', modelId], queryFn: () => api.getModel(modelId!) });
  const m = q.data?.data;
  if (!m) return <p>Loading…</p>;
  return (
    <div>
      <h1>{m.name}</h1>
      <p className="mono">{m.modelId}</p>
      <div className="row">
        <span className="badge ok">{m.status}</span>
        <span className="badge">{m.riskClass}</span>
        <span className="badge">{m.cloudLocus}</span>
      </div>
      <p>
        Endpoint {m.endpointName ?? '—'} · monitor coverage {String(m.monitorCoverage)}
      </p>
      {m.status !== 'retired' && (
        <button
          type="button"
          className="ghost"
          onClick={async () => {
            await api.retireModel(m.modelId);
            qc.invalidateQueries({ queryKey: ['model', modelId] });
            qc.invalidateQueries({ queryKey: ['models'] });
          }}
        >
          Retire model
        </button>
      )}
    </div>
  );
}

export function FramesPage() {
  const qc = useQueryClient();
  const projects = useQuery({ queryKey: ['projects'], queryFn: api.listProjects });
  return (
    <div>
      <h1>Problem framing gate</h1>
      <FramingGate onFramed={() => qc.invalidateQueries({ queryKey: ['projects'] })} />
      <h2 style={{ marginTop: 24 }}>Framed projects</h2>
      <FramedProjectTable projects={projects.data?.data.items ?? []} />
    </div>
  );
}

export function DatasetsPage() {
  const qc = useQueryClient();
  const datasets = useQuery({ queryKey: ['datasets'], queryFn: api.listDatasets });
  const first = datasets.data?.data.items[0];
  const grants = useQuery({
    queryKey: ['grants', first?.datasetId],
    queryFn: () => api.listGrants(first!.datasetId),
    enabled: Boolean(first),
  });
  async function grant(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!first) return;
    const form = new FormData(e.currentTarget);
    await api.createGrant(first.datasetId, {
      grantee: String(form.get('grantee') || 'ds@bank.local'),
      purpose: String(form.get('purpose') || first.purpose),
      expiresAt: new Date(Date.now() + 7 * 86400000).toISOString(),
    });
    qc.invalidateQueries({ queryKey: ['grants', first.datasetId] });
  }
  return (
    <div>
      <h1>Dataset lineage</h1>
      {(datasets.data?.data.items ?? []).map((d) => (
        <LineageGraph key={d.datasetId} dataset={d} />
      ))}
      {first && (
        <form className="form" onSubmit={grant}>
          <input name="grantee" placeholder="Grantee" defaultValue="ds@bank.local" />
          <input name="purpose" placeholder="Purpose" defaultValue={first.purpose} />
          <button type="submit">Grant expiring access</button>
          <button
            type="button"
            className="ghost"
            onClick={async () => {
              await api.attestDataset(first.datasetId, first.purpose);
              qc.invalidateQueries({ queryKey: ['datasets'] });
            }}
          >
            Attest purpose
          </button>
        </form>
      )}
      <h2>Grants</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Grantee</th>
            <th>Purpose</th>
            <th>Expires</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {(grants.data?.data.items ?? []).map((g) => (
            <tr key={g.grantId}>
              <td>{g.grantee}</td>
              <td>{g.purpose}</td>
              <td className="mono">{g.expiresAt}</td>
              <td>{g.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function TrainingPage() {
  const qc = useQueryClient();
  const jobs = useQuery({ queryKey: ['jobs'], queryFn: api.listJobs });
  const [error, setError] = useState('');
  async function launch(modelId: string) {
    setError('');
    try {
      await api.createJob({
        modelId,
        datasetId: 'dst_01j00000000000000000000001',
        computeProfile: 'p3.8xlarge',
      });
      await qc.invalidateQueries({ queryKey: ['jobs'] });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Blocked');
    }
  }
  return (
    <div>
      <h1>Training jobs</h1>
      {error && (
        <p className="banner warn">
          {error} {error.includes('framing') && <Link to="/frames">Open framing gate</Link>}
        </p>
      )}
      <div className="row">
        <button type="button" onClick={() => launch('mdl_01j00000000000000000000001')}>
          Launch gated train
        </button>
        <button type="button" className="warn" onClick={() => launch('mdl_01j00000000000000000000002')}>
          Train without problem frame
        </button>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>Job</th>
            <th>Status</th>
            <th>Cost</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {(jobs.data?.data.items ?? []).map((j) => (
            <tr key={j.trainingJobId}>
              <td className="mono">{j.trainingJobId}</td>
              <td>
                {j.status} {j.zombie ? <span className="badge scrap">zombie</span> : null}
              </td>
              <td className="mono">${j.costUsd ?? 0}</td>
              <td>
                {j.status === 'running' || j.zombie ? (
                  <button
                    type="button"
                    className="danger"
                    onClick={async () => {
                      await api.stopJob(j.trainingJobId);
                      qc.invalidateQueries({ queryKey: ['jobs'] });
                    }}
                  >
                    Kill
                  </button>
                ) : null}
                <button
                  type="button"
                  className="ghost"
                  onClick={async () => {
                    await api.registerBaseWeight(j.trainingJobId, {
                      modelZooId: 'zoo-aml-base',
                      licence: 'internal',
                      riskNotes: 'transfer-learning base for AML screen',
                    });
                    qc.invalidateQueries({ queryKey: ['jobs'] });
                  }}
                >
                  Register zoo licence
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function EvaluationsPage() {
  const qc = useQueryClient();
  const evals = useQuery({ queryKey: ['evals'], queryFn: api.listEvals });
  return (
    <div>
      <h1>Business-goal evaluations</h1>
      {(evals.data?.data.items ?? []).map((ev) => (
        <BusinessEvalPanel
          key={ev.evaluationId}
          evaluation={ev}
          onDecide={async (verdict) => {
            await api.decideEval(ev.evaluationId, verdict);
            qc.invalidateQueries({ queryKey: ['evals'] });
          }}
        />
      ))}
    </div>
  );
}

export function DeploymentsPage() {
  const qc = useQueryClient();
  const deps = useQuery({ queryKey: ['deps'], queryFn: api.listDeployments });
  const mons = useQuery({ queryKey: ['mons'], queryFn: api.listMonitors });
  const gates = useQuery({ queryKey: ['gates'], queryFn: api.gateMatrix });
  const aml = gates.data?.data.gates.find((g) => g.riskClass === 'aml');
  const [error, setError] = useState('');
  async function request(withMonitors: boolean) {
    setError('');
    try {
      await api.requestDeploy({
        modelId: 'mdl_01j00000000000000000000001',
        endpointName: 'aml-screen-prod',
        monitorIds: withMonitors ? (mons.data?.data.items.map((m) => m.monitorId) ?? []) : [],
      });
      await qc.invalidateQueries({ queryKey: ['deps'] });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Blocked');
    }
  }
  return (
    <div>
      <h1>Dual-control deployments</h1>
      <p>Validator sign-off must use a different operator than the builder (BR-4).</p>
      {aml && (
        <p className="banner warn">
          High-risk AML extra gates: {(aml.extraChecklist ?? []).join(', ')} — dual exception required
          (BR-10).
        </p>
      )}
      {error && <p className="banner scrap">{error}</p>}
      <div className="row">
        <button type="button" onClick={() => request(true)}>
          Request deploy with monitors
        </button>
        <button type="button" className="warn" onClick={() => request(false)}>
          Request deploy without monitors
        </button>
      </div>
      <h2>Monitor attachment</h2>
      <MonitorAttachmentChecklist monitors={mons.data?.data.items ?? []} />
      {(deps.data?.data.items ?? []).map((d) => (
        <div key={d.deploymentId} className="card" style={{ marginTop: 12 }}>
          <div className="row">
            <span className="badge ok">{d.status}</span>
            <span className="mono">{d.deploymentId}</span>
          </div>
          <DualControlRail deployment={d} />
          <p>Monitors {d.monitorsAttached ? 'attached' : 'missing'}</p>
          <MonitorAttachmentChecklist
            monitors={mons.data?.data.items ?? []}
            attachedIds={d.monitorIds}
          />
          {d.status === 'pending' && (
            <button
              type="button"
              onClick={async () => {
                try {
                  await api.decideDeploy(d.deploymentId, 'approved');
                  await qc.invalidateQueries({ queryKey: ['deps'] });
                } catch (err) {
                  setError(err instanceof Error ? err.message : 'Blocked');
                }
              }}
            >
              Validator sign
            </button>
          )}
          {d.status === 'approved' && (
            <button
              type="button"
              onClick={async () => {
                await api.executeDeploy(d.deploymentId);
                qc.invalidateQueries({ queryKey: ['deps'] });
              }}
            >
              Deploy
            </button>
          )}
          {d.status === 'deployed' && (
            <div className="row">
              <button
                type="button"
                className="ghost"
                onClick={async () => {
                  await api.retireDeploy(d.deploymentId);
                  qc.invalidateQueries({ queryKey: ['deps'] });
                }}
              >
                Retire
              </button>
              <button
                type="button"
                className="ghost"
                onClick={async () => {
                  await api.rollbackDeploy(d.deploymentId);
                  qc.invalidateQueries({ queryKey: ['deps'] });
                }}
              >
                Rollback
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export function MonitorsPage() {
  const nav = useNavigate();
  const qc = useQueryClient();
  const mons = useQuery({ queryKey: ['mons'], queryFn: api.listMonitors });
  return (
    <div>
      <h1>Production monitors</h1>
      <div className="cards">
        {(mons.data?.data.items ?? []).map((m) => (
          <div key={m.monitorId} className="card">
            <span className={`badge ${m.status === 'healthy' ? 'ok' : 'scrap'}`}>{m.status}</span>
            <h2>{m.metric}</h2>
            <p className="mono">{m.modelId}</p>
            <p>Threshold {m.threshold}</p>
            {m.retrainTrigger && <p>Retrain trigger armed</p>}
            <div className="row">
              <button
                type="button"
                className="ghost"
                onClick={async () => {
                  await api.ackMonitor(m.monitorId);
                  qc.invalidateQueries({ queryKey: ['mons'] });
                }}
              >
                Acknowledge drift
              </button>
              {m.status !== 'healthy' && (
                <button type="button" onClick={() => nav('/training')}>
                  Open retrain through gates
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function EvidencePage() {
  const qc = useQueryClient();
  const packs = useQuery({ queryKey: ['packs'], queryFn: api.listPacks });
  return (
    <div>
      <h1>Evidence pack studio</h1>
      <button
        type="button"
        onClick={async () => {
          await api.createPack('mdl_01j00000000000000000000001');
          qc.invalidateQueries({ queryKey: ['packs'] });
        }}
      >
        Generate pack
      </button>
      {(packs.data?.data.items ?? []).map((p) => (
        <EvidencePackExport
          key={p.evidencePackId}
          pack={p}
          onExport={async () => {
            await api.exportPack(p.evidencePackId);
            qc.invalidateQueries({ queryKey: ['packs'] });
          }}
        />
      ))}
    </div>
  );
}

export function SpendPage() {
  const qc = useQueryClient();
  const spend = useQuery({ queryKey: ['spend'], queryFn: api.spend });
  const jobs = useQuery({ queryKey: ['jobs'], queryFn: api.listJobs });
  return (
    <div>
      <h1>Cloud spend by model</h1>
      {spend.data?.data.costApiLag && (
        <p className="banner warn">Cost API lag — figures may be stale (BR-9).</p>
      )}
      <table className="table">
        <thead>
          <tr>
            <th>Model</th>
            <th>Team</th>
            <th>USD</th>
            <th>Zombies</th>
          </tr>
        </thead>
        <tbody>
          {(spend.data?.data.items ?? []).map((s) => (
            <tr key={`${s.modelId}-${s.team}`}>
              <td className="mono">{s.modelId}</td>
              <td>{s.team}</td>
              <td className="mono">{s.costUsd}</td>
              <td>{s.zombieJobCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>Zombie kill</h2>
      {(jobs.data?.data.items ?? [])
        .filter((j) => j.zombie)
        .map((j) => (
          <ZombieJobKill
            key={j.trainingJobId}
            job={j}
            onKill={async () => {
              await api.stopJob(j.trainingJobId);
              qc.invalidateQueries({ queryKey: ['jobs'] });
              qc.invalidateQueries({ queryKey: ['spend'] });
            }}
          />
        ))}
    </div>
  );
}

export function GatesPage() {
  const gates = useQuery({ queryKey: ['gates'], queryFn: api.gateMatrix });
  return (
    <div>
      <h1>Risk-class gate matrix</h1>
      {(gates.data?.data.gates ?? []).map((g) => (
        <div key={g.riskClass} className="card" style={{ marginBottom: 12 }}>
          <h2>{g.riskClass}</h2>
          <p>
            Dual control {String(g.dualControl)} · monitors required {String(g.monitorsRequired)}
          </p>
          <p>Artefacts: {g.requiredArtefacts.join(', ')}</p>
          {g.extraChecklist && g.extraChecklist.length > 0 && (
            <p>High-risk extra: {g.extraChecklist.join(', ')} — exception needs dual control.</p>
          )}
        </div>
      ))}
    </div>
  );
}
