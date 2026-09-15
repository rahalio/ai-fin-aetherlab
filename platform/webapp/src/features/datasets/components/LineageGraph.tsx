import type { DatasetRow } from '../../../lib/api';

export function LineageGraph({ dataset }: { dataset: DatasetRow }) {
  return (
    <div className="card lineage">
      <div className="row">
        <span className="badge">{dataset.sourceSystem}</span>
        <span aria-hidden>→</span>
        <span className="badge">extract {dataset.extractedAt ?? '—'}</span>
        <span aria-hidden>→</span>
        <span className="badge ok">{dataset.purpose}</span>
        <span aria-hidden>→</span>
        <span className="mono">{dataset.locationUri}</span>
      </div>
      <p className="mono">{dataset.datasetId}</p>
      <p>Residency {dataset.residency ?? '—'}</p>
    </div>
  );
}
