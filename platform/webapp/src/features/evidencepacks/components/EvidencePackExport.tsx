import type { PackRow } from '../../../lib/api';

export function EvidencePackExport({
  pack,
  onExport,
}: {
  pack: PackRow;
  onExport: () => void;
}) {
  const missing = (pack.artefacts ?? []).filter((a) => !a.present);
  return (
    <div className="card">
      <div className="mono">{pack.evidencePackId}</div>
      <p>
        Status {pack.status} · hash {pack.hash ?? '—'}
      </p>
      <ul>
        {(pack.artefacts ?? []).map((a) => (
          <li key={a.kind}>
            {a.kind}: {a.present ? 'included' : 'missing'}
          </li>
        ))}
      </ul>
      {missing.length > 0 && (
        <p className="banner warn">Incomplete artefacts listed before export (BR-8).</p>
      )}
      {pack.downloadUrl && (
        <p>
          <a href={pack.downloadUrl}>Read-only export</a>
        </p>
      )}
      <button type="button" className="ghost" onClick={onExport}>
        Export
      </button>
    </div>
  );
}
