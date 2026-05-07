import { Link } from 'react-router-dom';
import { useAppState } from '../../state/AppState';
import { PageHeader } from '../../components/ui/PageHeader';
import { DisclaimerBanner } from '../../components/ui/Disclaimer';
import { Trash, Download } from '../../components/ui/Icons';
import { ltdResult, soleTraderResult } from '../../lib/tax';
import { formatGBP } from '../../lib/format';

export function SavedScenarios() {
  const { state, deleteScenario } = useAppState();
  const list = state.scenarios;

  const exportMd = () => {
    const md = renderMarkdown(list);
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tax-lab-scenarios-${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Section 6"
        title="Your saved scenarios"
        description="Snapshots from the Cash Flow Lab and pre-built library, kept locally in your browser."
        pageId="scenarios/saved"
        actions={
          list.length > 0 ? (
            <button className="btn-secondary" onClick={exportMd}>
              <Download className="h-4 w-4" /> Export Markdown
            </button>
          ) : null
        }
      />
      <DisclaimerBanner compact />

      {list.length === 0 ? (
        <div className="card-pad text-center text-sm text-ink-500 dark:text-ink-400">
          No saved scenarios yet. Open the{' '}
          <Link className="underline" to="/lab">
            Cash Flow Lab
          </Link>{' '}
          and use "Save scenario" to start.
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {list.map((s) => {
            const sole = soleTraderResult(s.inputs.revenue, s.inputs.costs);
            const ltd = ltdResult({
              revenue: s.inputs.revenue,
              costs: s.inputs.costs,
              ownerSalary: s.inputs.ownerSalary,
              desiredCash: s.inputs.desiredCash,
              pensionContribution: s.inputs.pensionContribution,
              rdEligibleSpend: s.inputs.rdEligibleSpend,
            });
            return (
              <div key={s.id} className="card-pad">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-semibold">{s.name}</div>
                    <div className="text-xs text-ink-500 dark:text-ink-400">
                      Updated {new Date(s.updatedAt).toLocaleString()}
                    </div>
                  </div>
                  <button
                    className="text-ink-400 hover:text-danger-500"
                    onClick={() => {
                      if (confirm(`Delete scenario "${s.name}"?`)) deleteScenario(s.id);
                    }}
                    aria-label="Delete scenario"
                  >
                    <Trash className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                  <Item label="Revenue" v={formatGBP(s.inputs.revenue)} />
                  <Item label="Costs" v={formatGBP(s.inputs.costs)} />
                  <Item label="Cash needed" v={formatGBP(s.inputs.desiredCash)} />
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <Item
                    label="Sole trader net"
                    v={formatGBP(sole.netToOwner)}
                    tone="net"
                  />
                  <Item
                    label="Ltd owner net"
                    v={formatGBP(ltd.ownerTotalNet)}
                    tone="net"
                  />
                  <Item
                    label="Sole trader tax"
                    v={formatGBP(sole.totalTax)}
                    tone="tax"
                  />
                  <Item
                    label="Ltd retained"
                    v={formatGBP(ltd.companyRetained)}
                    tone="retain"
                  />
                </div>

                {s.notes && (
                  <p className="mt-3 whitespace-pre-wrap text-xs text-ink-700 dark:text-ink-300">
                    {s.notes}
                  </p>
                )}

                <div className="mt-3">
                  <Link
                    to={`/scenarios/${s.id}`}
                    className="btn-secondary !py-1 !px-2 text-xs"
                  >
                    View detail
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Item({
  label,
  v,
  tone,
}: {
  label: string;
  v: string;
  tone?: 'net' | 'tax' | 'retain';
}) {
  return (
    <div className="rounded border border-ink-200 p-2 dark:border-ink-700">
      <div className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400">
        {label}
      </div>
      <div
        className={
          'font-mono text-sm ' +
          (tone === 'net'
            ? 'text-accent-700 dark:text-accent-300'
            : tone === 'tax'
            ? 'text-danger-500'
            : tone === 'retain'
            ? 'text-yellow-700 dark:text-yellow-300'
            : '')
        }
      >
        {v}
      </div>
    </div>
  );
}

function renderMarkdown(list: ReturnType<typeof useAppState>['state']['scenarios']) {
  if (list.length === 0) return '# Saved scenarios\n\n_None yet._\n';
  const lines: string[] = ['# Saved scenarios', ''];
  for (const s of list) {
    lines.push(`## ${s.name}`);
    lines.push(`_Saved ${new Date(s.updatedAt).toISOString()}_`);
    lines.push('');
    lines.push('| Input | Value |');
    lines.push('| --- | --- |');
    Object.entries(s.inputs).forEach(([k, v]) => {
      lines.push(`| ${k} | ${Array.isArray(v) ? v.join(', ') : String(v)} |`);
    });
    lines.push('');
    if (s.notes) {
      lines.push('### Notes');
      lines.push(s.notes);
      lines.push('');
    }
    lines.push('---');
    lines.push('');
  }
  return lines.join('\n');
}
