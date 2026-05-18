import type { RankDefinition } from '../../store/types';
import { Card } from '../ui/Card';

interface HunterCardProps {
  rankDef: RankDefinition;
  level: number;
  questName: string;
  categoryIcon: string;
  categoryLabel: string;
}

export function HunterCard({
  rankDef,
  level,
  questName,
  categoryIcon,
  categoryLabel,
}: HunterCardProps) {
  // Extract RGB numbers from hex to use in opacity-based box shadows
  const hex = rankDef.color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16) || 255;
  const g = parseInt(hex.substring(2, 4), 16) || 255;
  const b = parseInt(hex.substring(4, 6), 16) || 255;
  const rgb = `${r}, ${g}, ${b}`;

  return (
    <Card elevated className="p-6 relative overflow-hidden" glow={rankDef.key}>
      {/* Dynamic CSS Injected for Ranks Aura Animations */}
      <style>{`
        @keyframes aura-pulse-${rankDef.key} {
          0% { box-shadow: 0 0 12px 2px rgba(${rgb}, 0.25); }
          50% { box-shadow: 0 0 24px 8px rgba(${rgb}, 0.65); }
          100% { box-shadow: 0 0 12px 2px rgba(${rgb}, 0.25); }
        }
        @keyframes aura-rotate-${rankDef.key} {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes aura-flare-${rankDef.key} {
          0% { transform: scale(0.95); opacity: 0.35; }
          50% { transform: scale(1.1); opacity: 0.75; }
          100% { transform: scale(0.95); opacity: 0.35; }
        }
        @keyframes aura-shockwave-${rankDef.key} {
          0% { transform: scale(0.9); opacity: 0.85; }
          100% { transform: scale(1.35); opacity: 0; }
        }
        @keyframes aura-flame-${rankDef.key} {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes aura-prismatic-${rankDef.key} {
          0% { filter: hue-rotate(0deg); }
          100% { filter: hue-rotate(360deg); }
        }

        .aura-pulse {
          animation: aura-pulse-${rankDef.key} 2.5s infinite ease-in-out;
        }
        .aura-glow {
          box-shadow: 0 0 20px 4px rgba(${rgb}, 0.5);
        }
        .aura-ring::before {
          content: '';
          position: absolute;
          inset: -3px;
          border-radius: 50%;
          padding: 2px;
          background: linear-gradient(0deg, transparent 40%, ${rankDef.color} 100%);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          animation: aura-rotate-${rankDef.key} 2s linear infinite;
        }
        .aura-flare {
          animation: aura-flare-${rankDef.key} 3s infinite ease-in-out;
          box-shadow: 0 0 25px 6px rgba(${rgb}, 0.4);
        }
        .aura-shockwave-layer {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 2px solid ${rankDef.color};
          animation: aura-shockwave-${rankDef.key} 1.6s infinite cubic-bezier(0.1, 0.8, 0.3, 1);
        }
        .aura-flame {
          background: linear-gradient(-45deg, #f97316, #ef4444, #eab308, #f97316);
          background-size: 400% 400%;
          animation: aura-flame-${rankDef.key} 3s ease infinite;
        }
        .aura-prismatic {
          animation: aura-prismatic-${rankDef.key} 6s linear infinite;
          background: linear-gradient(45deg, #ff007f, #7f00ff, #00ffff, #ff007f);
          background-size: 200% 200%;
        }
      `}</style>

      <div className="flex items-center gap-5 relative z-10 font-[family-name:var(--font-body)]">
        {/* Rank Insignia Circle with Aura Effect */}
        <div className="relative shrink-0 flex items-center justify-center w-20 h-20 rounded-full bg-white/5 border border-white/10">
          {/* Shockwave effect layers */}
          {rankDef.auraType === 'shockwave' && (
            <>
              <div className="aura-shockwave-layer" style={{ animationDelay: '0s' }} />
              <div className="aura-shockwave-layer" style={{ animationDelay: '0.8s' }} />
            </>
          )}

          {/* Core styling classes applied based on Rank auraType */}
          <div
            className={[
              'absolute inset-0 rounded-full transition-all duration-300 pointer-events-none',
              rankDef.auraType === 'pulse' ? 'aura-pulse' : '',
              rankDef.auraType === 'glow' ? 'aura-glow' : '',
              rankDef.auraType === 'ring' ? 'aura-ring' : '',
              rankDef.auraType === 'flare' ? 'aura-flare' : '',
              rankDef.auraType === 'flame' ? 'aura-flame opacity-30 blur-md' : '',
              rankDef.auraType === 'prismatic' ? 'aura-prismatic opacity-40 blur-lg' : '',
            ]
              .filter(Boolean)
              .join(' ')}
          />

          {/* Actual Rank Letter */}
          <span
            className="font-[family-name:var(--font-display)] text-4xl font-bold relative z-10 select-none tracking-tighter"
            style={{
              color: rankDef.color,
              textShadow: rankDef.key === 'SSS' 
                ? '0 0 15px rgba(255,255,255,0.8), 0 0 5px rgba(255,255,255,0.5)'
                : `0 0 10px rgba(${rgb}, 0.5)`
            }}
          >
            {rankDef.key}
          </span>
        </div>

        {/* Text Details Section */}
        <div className="flex flex-col min-w-0">
          <div className="font-[family-name:var(--font-mono)] text-xs text-[var(--text-secondary)] tracking-wider uppercase mb-1">
            RANK: {rankDef.title} / LEVEL: {level}
          </div>
          
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--text-primary)] font-bold tracking-wide truncate mb-1.5">
            {questName}
          </h2>

          <div className="flex items-center gap-1.5 text-sm text-[var(--text-secondary)]">
            <span>{categoryIcon}</span>
            <span>{categoryLabel}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
