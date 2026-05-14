import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Code, Cpu, Lock, Unlock, Zap, TrendingUp, Globe, CheckCircle } from 'lucide-react';

interface SkillNode {
  id: string;
  label: string;
  icon: any;
  status: 'locked' | 'unlocked' | 'mastered';
  xp: number;
  description: string;
  prerequisites: string[];
  path: 'cyber' | 'ai' | 'fintech';
  col: number;
  row: number;
}

const NODES: SkillNode[] = [
  // Cyber Path
  { id: 'net-basics',  label: 'Network Basics',   icon: Globe,      status: 'mastered',  xp: 200,  description: 'TCP/IP, OSI model, protocols',            prerequisites: [],             path: 'cyber',  col: 0, row: 0 },
  { id: 'linux',       label: 'Linux Mastery',    icon: Code,       status: 'mastered',  xp: 300,  description: 'Shell scripting, file permissions',        prerequisites: ['net-basics'], path: 'cyber',  col: 0, row: 1 },
  { id: 'recon',       label: 'Reconnaissance',   icon: Shield,     status: 'unlocked',  xp: 400,  description: 'OSINT, passive/active scanning',           prerequisites: ['linux'],      path: 'cyber',  col: 0, row: 2 },
  { id: 'exploit',     label: 'Exploit Dev',      icon: Zap,        status: 'locked',    xp: 600,  description: 'Buffer overflows, CVE analysis',           prerequisites: ['recon'],      path: 'cyber',  col: 0, row: 3 },
  // AI Path
  { id: 'python',      label: 'Python',           icon: Code,       status: 'mastered',  xp: 200,  description: 'Data structures, OOP, libraries',          prerequisites: [],             path: 'ai',     col: 1, row: 0 },
  { id: 'ml-basics',   label: 'ML Fundamentals',  icon: Cpu,        status: 'unlocked',  xp: 350,  description: 'Regression, classification, evaluation',   prerequisites: ['python'],     path: 'ai',     col: 1, row: 1 },
  { id: 'deep-learn',  label: 'Deep Learning',    icon: Cpu,        status: 'locked',    xp: 500,  description: 'CNNs, RNNs, transformers',                 prerequisites: ['ml-basics'],  path: 'ai',     col: 1, row: 2 },
  { id: 'ai-security', label: 'AI Security',      icon: Shield,     status: 'locked',    xp: 700,  description: 'Adversarial attacks, model hardening',     prerequisites: ['deep-learn'], path: 'ai',     col: 1, row: 3 },
  // Fintech Path
  { id: 'finance-101', label: 'Finance 101',      icon: TrendingUp, status: 'mastered',  xp: 200,  description: 'Markets, derivatives, risk models',        prerequisites: [],             path: 'fintech', col: 2, row: 0 },
  { id: 'blockchain',  label: 'Blockchain',       icon: Lock,       status: 'unlocked',  xp: 400,  description: 'Consensus algorithms, smart contracts',    prerequisites: ['finance-101'], path: 'fintech', col: 2, row: 1 },
  { id: 'defi',        label: 'DeFi Protocols',   icon: Globe,      status: 'locked',    xp: 550,  description: 'Liquidity pools, yield farming, DAOs',     prerequisites: ['blockchain'], path: 'fintech', col: 2, row: 2 },
  { id: 'quant',       label: 'Quant Trading',    icon: Zap,        status: 'locked',    xp: 750,  description: 'Algorithmic trading, backtesting',         prerequisites: ['defi'],       path: 'fintech', col: 2, row: 3 },
];

const PATH_META = {
  cyber:   { label: 'Ethical Hacker',    color: 'text-red-400',    bg: 'bg-red-500/10',    border: 'border-red-500/30',    glow: 'shadow-red-500/20' },
  ai:      { label: 'AI Engineer',       color: 'text-blue-400',   bg: 'bg-blue-500/10',   border: 'border-blue-500/30',   glow: 'shadow-blue-500/20' },
  fintech: { label: 'Fintech Analyst',   color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', glow: 'shadow-emerald-500/20' },
};

const STATUS_STYLES = {
  mastered:  { ring: 'border-emerald-500/60', bg: 'bg-emerald-500/20', icon: 'text-emerald-400', glow: 'shadow-[0_0_20px_rgba(16,185,129,0.3)]' },
  unlocked:  { ring: 'border-blue-500/60',    bg: 'bg-blue-500/10',    icon: 'text-blue-400',    glow: 'shadow-[0_0_15px_rgba(59,130,246,0.2)]' },
  locked:    { ring: 'border-white/10',       bg: 'bg-slate-900/60',   icon: 'text-slate-600',   glow: '' },
};

export const SkillTree: React.FC = () => {
  const [selected, setSelected] = useState<SkillNode | null>(null);
  const [activePath, setActivePath] = useState<'all' | 'cyber' | 'ai' | 'fintech'>('all');

  const filtered = activePath === 'all' ? NODES : NODES.filter(n => n.path === activePath);

  return (
    <div className="h-full flex flex-col gap-4">
      {/* Path filter */}
      <div className="flex gap-2 flex-wrap">
        {(['all', 'cyber', 'ai', 'fintech'] as const).map(p => (
          <button key={p} onClick={() => setActivePath(p)}
            className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${activePath === p ? 'bg-white/10 border-white/30 text-white' : 'border-white/10 text-slate-500 hover:text-white hover:border-white/20'}`}>
            {p === 'all' ? '🌌 All Paths' : p === 'cyber' ? '🛡️ Ethical Hacker' : p === 'ai' ? '🤖 AI Engineer' : '💹 Fintech Analyst'}
          </button>
        ))}
      </div>

      <div className="flex gap-6 flex-1 overflow-auto">
        {/* Tree grid */}
        <div className="flex-1 min-w-0">
          {/* Column headers */}
          <div className={`grid gap-6 mb-4 ${activePath === 'all' ? 'grid-cols-3' : 'grid-cols-1'}`}>
            {(activePath === 'all' ? (['cyber', 'ai', 'fintech'] as const) : [activePath]).map(path => (
              <div key={path} className={`text-center px-4 py-2 rounded-2xl ${PATH_META[path].bg} border ${PATH_META[path].border}`}>
                <p className={`text-xs font-bold ${PATH_META[path].color}`}>{PATH_META[path].label}</p>
              </div>
            ))}
          </div>

          {/* Nodes by row */}
          {[0, 1, 2, 3].map(row => (
            <div key={row} className={`grid gap-6 mb-4 ${activePath === 'all' ? 'grid-cols-3' : 'grid-cols-1'}`}>
              {(activePath === 'all' ? (['cyber', 'ai', 'fintech'] as const) : [activePath]).map(path => {
                const node = filtered.find(n => n.path === path && n.row === row);
                if (!node) return <div key={path} />;
                const s = STATUS_STYLES[node.status];
                return (
                  <motion.div key={node.id} whileHover={node.status !== 'locked' ? { scale: 1.05 } : {}}
                    onClick={() => node.status !== 'locked' && setSelected(node === selected ? null : node)}
                    className={`relative p-4 rounded-2xl border cursor-pointer transition-all ${s.bg} ${s.ring} ${s.glow} ${node.status === 'locked' ? 'opacity-50 cursor-not-allowed' : ''} ${selected?.id === node.id ? 'ring-2 ring-white/30' : ''}`}>
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl bg-black/20 ${s.icon}`}>
                        {node.status === 'mastered' ? <CheckCircle size={18} /> : node.status === 'locked' ? <Lock size={18} /> : <Unlock size={18} />}
                      </div>
                      <div>
                        <p className={`text-xs font-bold ${node.status === 'locked' ? 'text-slate-600' : 'text-white'}`}>{node.label}</p>
                        <p className="text-[10px] text-slate-500">{node.xp} XP</p>
                      </div>
                    </div>
                    {node.status === 'mastered' && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center">
                        <CheckCircle size={10} className="text-white" />
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Detail panel */}
        {selected && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            className="w-56 flex-shrink-0 p-5 bg-white/5 border border-white/10 rounded-2xl self-start sticky top-0">
            <div className={`p-3 rounded-xl ${STATUS_STYLES[selected.status].bg} mb-3 w-fit`}>
              <selected.icon size={20} className={STATUS_STYLES[selected.status].icon} />
            </div>
            <h4 className="text-white font-bold text-sm mb-1">{selected.label}</h4>
            <p className="text-[10px] text-slate-500 mb-3">{selected.description}</p>
            <div className="flex items-center gap-2 mb-4">
              <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-lg ${PATH_META[selected.path].bg} ${PATH_META[selected.path].color}`}>
                {PATH_META[selected.path].label}
              </span>
            </div>
            <div className="text-xs text-slate-400 mb-2">XP Reward: <span className="text-white font-bold">{selected.xp}</span></div>
            <div className="text-xs text-slate-400 mb-4">Status: <span className={`font-bold ${STATUS_STYLES[selected.status].icon}`}>{selected.status}</span></div>
            {selected.status === 'unlocked' && (
              <button className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-colors">
                Start Learning
              </button>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};
