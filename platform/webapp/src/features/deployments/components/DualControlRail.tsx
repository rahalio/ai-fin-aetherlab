import type { DeployRow } from '../../../lib/api';

export function DualControlRail({ deployment }: { deployment: DeployRow }) {
  const same = Boolean(
    deployment.builderId && deployment.validatorId && deployment.builderId === deployment.validatorId
  );
  return (
    <div className="row">
      <span className="badge">builder {deployment.builderId ?? 'open'}</span>
      <span className="badge ok">validator {deployment.validatorId ?? 'open slot'}</span>
      {same && <span className="badge scrap">same-user blocked (BR-4)</span>}
    </div>
  );
}
