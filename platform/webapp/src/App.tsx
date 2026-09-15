import { NavLink, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { FormEvent, type ReactNode, useState } from 'react';
import {
  api,
  clearSession,
  getDisplayName,
  getRole,
  getToken,
  homeForRole,
  setSession,
} from './lib/api';
import { ModelsView as ScaffoldModelsView } from './features/models/views/ModelsView';
import { ProjectsView as ScaffoldProjectsView } from './features/projects/views/ProjectsView';
import {
  DatasetsPage,
  DeploymentsPage,
  EvidencePage,
  EvaluationsPage,
  FramesPage,
  GatesPage,
  InventoryPage,
  ModelDetailPage,
  MonitorsPage,
  SpendPage,
  TrainingPage,
} from './features/factory/pages';

function LoginPage() {
  const nav = useNavigate();
  const [email, setEmail] = useState('admin@demo.local');
  const [password, setPassword] = useState('sandbox-admin-8');
  const [error, setError] = useState('');
  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    try {
      const res = await api.login(email, password);
      setSession(
        res.data.accessToken,
        res.data.operator.role,
        res.data.operator.displayName,
        email
      );
      nav(homeForRole(res.data.operator.role, email));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    }
  }
  return (
    <div className="login">
      <div className="brand">AETHERLAB</div>
      <h1>The compliant path is the fast path</h1>
      <p className="tagline">Bank AI factory control plane — not another SageMaker console.</p>
      <form className="form" onSubmit={onSubmit}>
        <label>
          Email
          <input value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label>
          Password
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        {error && <div className="error">{error}</div>}
        <button type="submit">Enter factory</button>
      </form>
      <p className="tagline">
        admin@demo.local / sandbox-admin-8 · validator@demo.local / sandbox-validator-8 ·
        ds@demo.local / sandbox-ds-8chars
      </p>
    </div>
  );
}

function Shell({ children }: { children: ReactNode }) {
  const nav = useNavigate();
  const links = [
    ['/inventory', 'Inventory'],
    ['/frames', 'Problem frames'],
    ['/datasets', 'Datasets'],
    ['/training', 'Training jobs'],
    ['/evaluations', 'Evaluations'],
    ['/deployments', 'Deployments'],
    ['/monitors', 'Monitors'],
    ['/evidence', 'Evidence packs'],
    ['/spend', 'Cloud spend'],
    ['/gates', 'Risk-class gates'],
    ['/scaffold', 'Generated stubs'],
  ];
  return (
    <div className="shell">
      <aside className="nav">
        <div className="brand">AETHERLAB</div>
        <div className="tagline">Factory floor</div>
        {links.map(([to, label]) => (
          <NavLink key={to} to={to} className={({ isActive }) => (isActive ? 'active' : '')}>
            {label}
          </NavLink>
        ))}
        <div style={{ marginTop: 24 }} className="mono">
          {getDisplayName()} · {getRole()}
        </div>
        <button
          className="ghost"
          style={{ marginTop: 8 }}
          type="button"
          onClick={() => {
            clearSession();
            nav('/login');
          }}
        >
          Sign out
        </button>
      </aside>
      <main className="main">{children}</main>
    </div>
  );
}

function Guard({ children }: { children: ReactNode }) {
  if (!getToken()) return <Navigate to="/login" replace />;
  return <Shell>{children}</Shell>;
}

export function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<Navigate to="/inventory" replace />} />
      <Route path="/inventory" element={<Guard><InventoryPage /></Guard>} />
      <Route path="/inventory/:modelId" element={<Guard><ModelDetailPage /></Guard>} />
      <Route path="/frames" element={<Guard><FramesPage /></Guard>} />
      <Route path="/datasets" element={<Guard><DatasetsPage /></Guard>} />
      <Route path="/training" element={<Guard><TrainingPage /></Guard>} />
      <Route path="/evaluations" element={<Guard><EvaluationsPage /></Guard>} />
      <Route path="/deployments" element={<Guard><DeploymentsPage /></Guard>} />
      <Route path="/monitors" element={<Guard><MonitorsPage /></Guard>} />
      <Route path="/evidence" element={<Guard><EvidencePage /></Guard>} />
      <Route path="/spend" element={<Guard><SpendPage /></Guard>} />
      <Route path="/gates" element={<Guard><GatesPage /></Guard>} />
      <Route
        path="/scaffold"
        element={
          <Guard>
            <div>
              <h1>Generated stubs</h1>
              <ScaffoldProjectsView />
              <ScaffoldModelsView />
            </div>
          </Guard>
        }
      />
    </Routes>
  );
}
