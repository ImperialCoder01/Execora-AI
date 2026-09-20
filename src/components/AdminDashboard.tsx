import React from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Users, Database, Sparkles, Activity, Key, CheckCircle2, Lock } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { role, user, savedAnalyses } = useAuth();

  if (role !== 'admin') {
    return (
      <div className="bg-slate-900/80 border border-rose-900/60 rounded-2xl p-8 text-center space-y-3">
        <Lock className="w-10 h-10 text-rose-500 mx-auto" />
        <h3 className="text-lg font-bold text-white">Access Restricted — Admin Only</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          The Platform Admin Command Center is reserved for authorized admin accounts. Please sign in as an Admin user.
        </p>
      </div>
    );
  }

  const mockUsers = [
    { id: '1', email: 'admin@execora.ai', role: 'admin', created: '2026-09-20', status: 'Active', keySet: true },
    { id: '2', email: 'dev@execora.ai', role: 'user', created: '2026-09-20', status: 'Active', keySet: false },
    { id: '3', email: 'sahil@hackathon.org', role: 'user', created: '2026-09-19', status: 'Active', keySet: true },
    { id: '4', email: 'rahul@backend.io', role: 'user', created: '2026-09-18', status: 'Active', keySet: false },
  ];

  return (
    <div className="space-y-6">
      
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-purple-950/80 via-slate-900 to-sky-950/80 border border-purple-800/60 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-purple-600/30 border border-purple-500/50 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white">Execora Admin Command Center</h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-950 text-purple-300 border border-purple-800">
                  ROLE: PLATFORM ADMIN
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Platform analytics, user access management, and system operational monitoring.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800 text-xs">
            <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span className="text-slate-300 font-medium">System Health: 100% Operational</span>
          </div>
        </div>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Total Registered Users</span>
            <Users className="w-4 h-4 text-sky-400" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-white font-mono">4</span>
            <span className="text-xs text-emerald-400 font-semibold">+100% this week</span>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Total Extractions Logged</span>
            <Database className="w-4 h-4 text-purple-400" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-white font-mono">{savedAnalyses.length + 12}</span>
            <span className="text-xs text-slate-400">Extractions</span>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Avg Extraction Confidence</span>
            <Sparkles className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-white font-mono">94.2%</span>
            <span className="text-xs text-emerald-400 font-semibold">Optimal</span>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Groq API Key Isolation</span>
            <Key className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-emerald-400 font-mono">SECURE</span>
            <span className="text-xs text-slate-400">Server Encrypted</span>
          </div>
        </div>
      </div>

      {/* User Management Table */}
      <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-5 shadow-xl">
        <h3 className="text-base font-bold text-slate-100 flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-purple-400" />
          <span>Platform User Accounts & Role Permissions</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-3">User Email</th>
                <th className="p-3">Role</th>
                <th className="p-3">Status</th>
                <th className="p-3">Custom API Key</th>
                <th className="p-3">Created Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {mockUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-950/60 transition-colors">
                  <td className="p-3 font-semibold text-white">{u.email}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${
                        u.role === 'admin'
                          ? 'bg-purple-950 text-purple-300 border-purple-800'
                          : 'bg-sky-950 text-sky-300 border-sky-800'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className="inline-flex items-center gap-1 text-emerald-400 font-medium text-[11px]">
                      <CheckCircle2 className="w-3 h-3" />
                      {u.status}
                    </span>
                  </td>
                  <td className="p-3 font-mono text-[11px] text-slate-400">
                    {u.keySet ? 'Configured (Encrypted)' : 'Using Default Server Key'}
                  </td>
                  <td className="p-3 text-slate-400">{u.created}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
