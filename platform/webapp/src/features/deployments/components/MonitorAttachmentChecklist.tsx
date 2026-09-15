import type { MonitorRow } from '../../../lib/api';

export function MonitorAttachmentChecklist({
  monitors,
  attachedIds,
}: {
  monitors: MonitorRow[];
  attachedIds?: string[];
}) {
  const attached = new Set(attachedIds ?? []);
  return (
    <ul>
      {monitors.map((m) => (
        <li key={m.monitorId}>
          {m.metric} ({m.monitorId}): {attached.has(m.monitorId) ? 'attached' : 'required'}
        </li>
      ))}
      {monitors.length === 0 && <li>No monitors — deploy will 422 (BR-5).</li>}
    </ul>
  );
}
