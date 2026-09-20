import React from 'react';
import { RiskItem, RiskSeverity, EvidenceClassification } from '../types';
import { ShieldAlert, AlertTriangle, Info, CheckCircle2, HelpCircle } from 'lucide-react';

interface RiskAuditViewProps {
  risks: RiskItem[];
}

export const RiskAuditView: React.FC<RiskAuditViewProps> = ({ risks }) => {
  const criticalCount = risks.filter(r => r.severity === 'CRITICAL').length;
  const highCount = risks.filter(r => r.severity === 'HIGH').length;

  const getSeverityBadge = (sev: RiskSeverity) => {
    switch (sev) {
      case 'CRITICAL':
        return 'bg-rose-950 text-rose-300 border-rose-800';
      case 'HIGH':
        return 'bg-amber-950 text-amber-300 border-amber-800';
      case 'MEDIUM':
        return 'bg-blue-950 text-blue-300 border-blue-800';
      default:
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  const getClassificationBadge = (cls: EvidenceClassification) => {
    switch (cls) {
      case 'EXPLICIT':
        return 'bg-emerald-950 text-emerald-300 border-emerald-800';
      case 'INFERRED':
        return 'bg-purple-950 text-purple-300 border-purple-800';
      default:
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Audit Banner */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-400" />
            <span>Deterministic Execution Audit & Risk Detection</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Automated evaluation of resource concentration, unassigned owners, tight windows, and circular dependencies.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-rose-950/80 text-rose-300 border border-rose-800 font-bold">
            {criticalCount} Critical Risk(s)
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-amber-950/80 text-amber-300 border border-amber-800 font-bold">
            {highCount} High Risk(s)
          </span>
        </div>
      </div>

      {/* Risk Cards */}
      <div className="space-y-4">
        {risks.map((risk) => (
          <div
            key={risk.id}
            className={`border rounded-2xl p-5 shadow-lg transition-all ${
              risk.severity === 'CRITICAL'
                ? 'bg-rose-950/20 border-rose-900/80 shadow-rose-950/10'
                : 'bg-slate-900/80 border-slate-800'
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full border ${getSeverityBadge(risk.severity)}`}>
                    {risk.severity} SEVERITY
                  </span>
                  <span className={`text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full border ${getClassificationBadge(risk.classification)}`}>
                    EVIDENCE: {risk.classification}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    Category: {risk.riskType}
                  </span>
                </div>

                <h4 className="text-base font-bold text-white">
                  {risk.title}
                </h4>

                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                  {risk.description}
                </p>

                {risk.evidence && (
                  <div className="text-[11px] italic text-slate-400 pl-3 border-l-2 border-slate-700">
                    Source Evidence: "{risk.evidence}"
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
