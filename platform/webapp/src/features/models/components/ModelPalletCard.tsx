import { Link } from 'react-router-dom';
import type { ModelRow } from '../../../lib/api';

export function ModelPalletCard({ model }: { model: ModelRow }) {
  const gap = model.status === 'deployed' && !model.monitorCoverage;
  const tone =
    model.status === 'retired' ? 'retired' : gap || model.orphanEndpoint ? 'warn' : 'ok';
  return (
    <Link className="card" to={`/inventory/${model.modelId}`}>
      <div className="row">
        <span className={`badge ${tone}`}>{model.status}</span>
        <span className="badge">{model.riskClass}</span>
        <span className="badge">{model.cloudLocus}</span>
      </div>
      <h2>{model.name}</h2>
      <div className="mono">{model.modelId}</div>
      <p>Monitors: {model.monitorCoverage ? 'attached' : 'missing'}</p>
      {model.endpointName && <p className="mono">{model.endpointName}</p>}
    </Link>
  );
}
