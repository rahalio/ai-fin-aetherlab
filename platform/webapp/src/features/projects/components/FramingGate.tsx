import { FormEvent, useState } from 'react';
import { api, getDisplayName, type ProjectRow } from '../../../lib/api';

export function FramingGate({ onFramed }: { onFramed: () => void }) {
  const [name, setName] = useState('New framed use-case');
  const [kpi, setKpi] = useState('precision_at_alert');
  const [statement, setStatement] = useState('');
  const [purpose, setPurpose] = useState('aml_surveillance');
  const [riskClass, setRiskClass] = useState('aml');
  const [error, setError] = useState('');

  async function createAndFrame(e: FormEvent) {
    e.preventDefault();
    setError('');
    try {
      const created = await api.createProject({ name, owner: getDisplayName(), riskClass });
      await api.submitFrame(created.data.projectId, {
        problemStatement: statement || name,
        businessKpi: kpi,
        riskClass,
        permittedPurpose: purpose,
      });
      await api.decideQuota(created.data.projectId, 'granted');
      onFramed();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed');
    }
  }

  return (
    <form className="form" onSubmit={createAndFrame}>
      <p className="tagline">KPI + permitted purpose required before GPU scale quota (BR-1).</p>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Project name" />
      <textarea
        value={statement}
        onChange={(e) => setStatement(e.target.value)}
        placeholder="Problem statement"
      />
      <input value={kpi} onChange={(e) => setKpi(e.target.value)} placeholder="Business KPI" />
      <select value={riskClass} onChange={(e) => setRiskClass(e.target.value)}>
        <option value="low">low</option>
        <option value="credit">credit</option>
        <option value="aml">aml</option>
        <option value="trading">trading</option>
        <option value="adverse_action">adverse_action</option>
      </select>
      <input value={purpose} onChange={(e) => setPurpose(e.target.value)} placeholder="Permitted purpose" />
      {error && <div className="error">{error}</div>}
      <button type="submit">Submit frame + grant scale quota</button>
    </form>
  );
}

export function FramedProjectTable({ projects }: { projects: ProjectRow[] }) {
  return (
    <table className="table">
      <thead>
        <tr>
          <th>Name</th>
          <th>KPI</th>
          <th>Quota</th>
        </tr>
      </thead>
      <tbody>
        {projects.map((p) => (
          <tr key={p.projectId}>
            <td>{p.name}</td>
            <td>{p.problemFrame?.businessKpi ?? '—'}</td>
            <td>{p.scaleQuotaStatus}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
