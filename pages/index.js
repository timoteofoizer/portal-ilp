import { useState, useEffect } from 'react';
import Head from 'next/head';

const TABS = [
  { id: 'inicio',     label: 'Início'     },
  { id: 'renda',      label: 'Renda'      },
  { id: 'patrimonio', label: 'Patrimônio' },
  { id: 'simular',    label: 'Simular'    },
  { id: 'relatorio',  label: 'Relatório'  },
];

export default function PortalILP() {
  const [tab, setTab]         = useState('inicio');
  const [cliente, setCliente] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    fetch('/api/cliente')
      .then((r) => r.json())
      .then((data) => { setCliente(data); setLoading(false); })
      .catch(() => { setError('Não foi possível carregar os dados.'); setLoading(false); });
  }, []);

  return (
    <>
      <Head>
        <title>Portal ILP — Inteligência de Longo Prazo</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div style={s.wrapper}>
        <header style={s.header}>
          <span style={s.logo}>ILP</span>
          <span style={s.logoSub}>Inteligência de Longo Prazo</span>
        </header>

        <nav style={s.nav}>
          {TABS.map((t) => (
            <button
              key={t.id}
              style={{ ...s.navBtn, ...(tab === t.id ? s.navActive : {}) }}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </nav>

        <main style={s.main}>
          {loading && <p style={s.msg}>Carregando dados...</p>}
          {error   && <p style={{ ...s.msg, color: 'var(--danger)' }}>{error}</p>}
          {!loading && !error && (
            <div style={s.card}>
              <h2 style={s.tabTitle}>{TABS.find((t) => t.id === tab)?.label}</h2>
              <p style={s.hint}>
                Cole aqui o componente <code>{tab}</code> convertido do seu React.
              </p>
              {cliente && (
                <pre style={s.pre}>{JSON.stringify(cliente, null, 2)}</pre>
              )}
            </div>
          )}
        </main>
      </div>
    </>
  );
}

const s = {
  wrapper:   { minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' },
  header:    { background: 'var(--text)', color: 'var(--gold)', padding: '16px 24px', display: 'flex', alignItems: 'baseline', gap: '12px' },
  logo:      { fontSize: '24px', fontWeight: '700', letterSpacing: '2px' },
  logoSub:   { fontSize: '13px', color: '#aaa' },
  nav:       { display: 'flex', borderBottom: '2px solid var(--border)', background: '#fff', padding: '0 16px', gap: '4px', overflowX: 'auto' },
  navBtn:    { padding: '14px 20px', border: 'none', background: 'transparent', color: 'var(--text-muted)', fontSize: '14px', fontWeight: '500', cursor: 'pointer', borderBottom: '2px solid transparent', marginBottom: '-2px', whiteSpace: 'nowrap' },
  navActive: { color: 'var(--gold)', borderBottom: '2px solid var(--gold)' },
  main:      { flex: 1, padding: '32px 24px', maxWidth: '960px', width: '100%', margin: '0 auto' },
  msg:       { textAlign: 'center', color: 'var(--text-muted)', marginTop: '60px', fontSize: '15px' },
  card:      { background: '#fff', borderRadius: '12px', border: '1px solid var(--border)', padding: '40px', textAlign: 'center' },
  tabTitle:  { fontSize: '22px', color: 'var(--gold)', marginBottom: '12px' },
  hint:      { color: 'var(--text-muted)', fontSize: '14px', marginBottom: '24px' },
  pre:       { textAlign: 'left', background: 'var(--bg)', borderRadius: '8px', padding: '16px', fontSize: '12px', overflow: 'auto', maxHeight: '300px', border: '1px solid var(--border)' },
};
