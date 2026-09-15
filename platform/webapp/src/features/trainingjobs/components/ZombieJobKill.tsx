import type { JobRow } from '../../../lib/api';

export function ZombieJobKill({ job, onKill }: { job: JobRow; onKill: () => void }) {
  return (
    <div className="row scrap-pulse">
      <span className="badge scrap">zombie</span>
      <span className="mono">{job.trainingJobId}</span>
      <span className="mono">${job.costUsd ?? 0}</span>
      <button type="button" className="danger" onClick={onKill}>
        Kill GPU job
      </button>
    </div>
  );
}
