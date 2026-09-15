import type { EvalRow } from '../../../lib/api';

export function BusinessEvalPanel({
  evaluation,
  onDecide,
}: {
  evaluation: EvalRow;
  onDecide: (verdict: string) => void;
}) {
  const aucOnly = !evaluation.businessGoalMet && Boolean(evaluation.techMetrics?.auc);
  return (
    <div className="card">
      <div className="row">
        <span className={`badge ${evaluation.verdict === 'passed' ? 'ok' : 'warn'}`}>
          {evaluation.verdict}
        </span>
        <span className="mono">{evaluation.modelId}</span>
      </div>
      <p>
        Declared KPI <b>{evaluation.declaredKpi}</b> vs observed {evaluation.observedKpiValue} · goal
        met {String(evaluation.businessGoalMet)}
      </p>
      <p>Tech metrics (secondary) {JSON.stringify(evaluation.techMetrics)}</p>
      {aucOnly && <p className="banner warn">AUC-only cannot pass deploy eligibility (BR-3).</p>}
      {evaluation.verdict === 'pending' && (
        <div className="row">
          <button type="button" onClick={() => onDecide('passed')} disabled={!evaluation.businessGoalMet}>
            Pass for deploy
          </button>
          <button type="button" className="danger" onClick={() => onDecide('failed')}>
            Fail
          </button>
        </div>
      )}
    </div>
  );
}
