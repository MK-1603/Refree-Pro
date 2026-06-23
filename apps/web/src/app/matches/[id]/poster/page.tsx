'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toPng } from 'html-to-image';
import { ChevronLeft, Download, Share2, Calendar, MapPin, Trophy, Users, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

const S = (obj: React.CSSProperties): React.CSSProperties => obj;

// Jersey Team Logo Icon
function TeamLogo({ name, color, size = 44 }: { name: string; color?: string; size?: number }) {
  const initials = (name || 'FC').substring(0, 3).toUpperCase();
  const bgColor = color || 'rgba(255,255,255,0.1)';
  return (
    <div style={S({ position: 'relative', width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center', filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.5))' })}>
      <svg viewBox="0 0 24 24" width="100%" height="100%" style={S({ position: 'absolute', inset: 0 })}>
        <path 
          d="M6.5 2C8 2 8.5 3.5 12 3.5C15.5 3.5 16 2 17.5 2C19 2 22 5 22 5L20 8.5L18 7.5V20C18 21.1046 17.1046 22 16 22H8C6.89543 22 6 21.1046 6 20V7.5L4 8.5L2 5C2 5 5 2 6.5 2Z" 
          fill={bgColor} 
          stroke="rgba(255,255,255,0.4)" 
          strokeWidth="0.8" 
        />
      </svg>
    </div>
  );
}

function EventItem({ event, accent }: { event: any; accent: string }) {
  const isGoal = event.eventType === 'goal';
  const isYellow = event.cardType === 'yellow';
  const isRed = event.cardType === 'red';
  const isSub = event.eventType === 'sub';
  
  const icon = isGoal ? '⚽' : isYellow ? <div style={{width:16,height:22,background:'#fbbf24',borderRadius:2}}/> : isRed ? <div style={{width:16,height:22,background:'#ef4444',borderRadius:2}}/> : '🔄';
  const name = isSub ? `${event.playerIn || 'Sub'} IN` : (event.playerName || 'Unknown');
  const label = isGoal ? 'GOAL' : isYellow ? 'YELLOW CARD' : isRed ? 'RED CARD' : 'SUBSTITUTION IN';
  const labelColor = isGoal ? accent : isYellow ? '#fbbf24' : isRed ? '#ef4444' : '#10b981';

  return (
    <div style={S({ display: 'flex', alignItems: 'center', gap: 12 })}>
       <div style={S({ fontSize: 20, width: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' })}>{icon}</div>
       <div style={S({ display: 'flex', flexDirection: 'column' })}>
         <span style={S({ fontSize: 16, fontWeight: 500, color: '#fff' })}>{name}</span>
         <span style={S({ fontSize: 11, fontWeight: 700, color: labelColor, letterSpacing: '0.05em', textTransform: 'uppercase' })}>{label}</span>
       </div>
    </div>
  );
}

function StatItem({ icon, count, label }: { icon: React.ReactNode; count: number; label: string }) {
  return (
    <div style={S({ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 })}>
       <div style={S({ display: 'flex', alignItems: 'center', gap: 12 })}>
         <span style={S({ fontSize: 32, display: 'flex', alignItems:'center' })}>{icon}</span>
         <span style={S({ fontSize: 42, fontWeight: 900, color: '#fff', lineHeight: 1 })}>{count}</span>
       </div>
       <span style={S({ fontSize: 11, fontWeight: 600, color: '#fff', letterSpacing: '0.1em' })}>{label}</span>
    </div>
  );
}

function InfoBlock({ icon, label, value, accent }: { icon: React.ReactNode; label: string; value: string; accent: string }) {
  return (
    <div style={S({ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 })}>
       {icon}
       <div style={S({ display: 'flex', flexDirection: 'column' })}>
         <span style={S({ fontSize: 11, fontWeight: 800, color: accent, letterSpacing: '0.05em' })}>{label}</span>
         <span style={S({ fontSize: 13, fontWeight: 600, color: '#fff' })}>{value}</span>
       </div>
    </div>
  );
}

function MasterPoster({ match, events, bgImage, accentColor }: { match: any; events: any[]; bgImage: string | null; accentColor: string }) {
  const active   = events.filter(e => !e.isUndone);
  const goalsA   = active.filter(e => e.eventType === 'goal' && e.team === 'team_a').length;
  const goalsB   = active.filter(e => e.eventType === 'goal' && e.team === 'team_b').length;
  const scoreA   = match.scoreA ?? goalsA;
  const scoreB   = match.scoreB ?? goalsB;
  const yellows  = active.filter(e => e.cardType === 'yellow').length;
  const reds     = active.filter(e => e.cardType === 'red').length;
  const winner   = scoreA > scoreB ? match.teamA : scoreB > scoreA ? match.teamB : 'DRAW';

  const timelineEvents = [...active]
    .filter(e => e.eventType === 'goal' || e.cardType || e.eventType === 'sub')
    .sort((a, b) => a.minute - b.minute)
    .slice(0, 7); // Show up to 7 events cleanly

  const hasEvents = timelineEvents.length > 0;

  return (
    <div style={S({ width: 540, height: 960, backgroundColor: '#050505', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', fontFamily: 'system-ui, -apple-system, Helvetica, Arial, sans-serif' })}>
      
      {/* Background Image / Gradient */}
      <div style={S({ position: 'absolute', inset: 0, zIndex: 0 })}>
        {bgImage ? (
          <>
            <img src={bgImage} style={S({ width: '100%', height: '100%', objectFit: 'cover' })} alt="bg" crossOrigin="anonymous" 
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
                (e.target as HTMLImageElement).parentElement!.style.background = 'radial-gradient(circle at 50% 30%, #1a1a2e 0%, #050505 100%)';
              }} 
            />
            <div style={S({ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 30%, rgba(0,0,0,0.8) 100%)' })} />
          </>
        ) : (
          <div style={S({ width: '100%', height: '100%', background: 'radial-gradient(circle at 50% 30%, #1a1a2e 0%, #050505 100%)' })} />
        )}
      </div>

      {/* Ornate Gold Frame */}
      <div style={S({ position: 'absolute', inset: 16, border: `2px solid ${accentColor}`, pointerEvents: 'none', zIndex: 10 })}>
        {/* Corner Accents */}
        <div style={S({ position: 'absolute', top: -4, left: -4, width: 20, height: 20, borderTop: `6px solid ${accentColor}`, borderLeft: `6px solid ${accentColor}` })} />
        <div style={S({ position: 'absolute', top: -4, right: -4, width: 20, height: 20, borderTop: `6px solid ${accentColor}`, borderRight: `6px solid ${accentColor}` })} />
        <div style={S({ position: 'absolute', bottom: -4, left: -4, width: 20, height: 20, borderBottom: `6px solid ${accentColor}`, borderLeft: `6px solid ${accentColor}` })} />
        <div style={S({ position: 'absolute', bottom: -4, right: -4, width: 20, height: 20, borderBottom: `6px solid ${accentColor}`, borderRight: `6px solid ${accentColor}` })} />
        
        {/* Footer Text Cutout */}
        <div style={S({ position: 'absolute', bottom: -12, left: '50%', transform: 'translateX(-50%)', backgroundColor: '#050505', padding: '0 16px', color: '#fff', fontSize: 12, letterSpacing: '0.3em', fontWeight: 600, whiteSpace: 'nowrap' })}>
          EVERY <span style={{ color: accentColor }}>DECISION</span> MATTERS
        </div>
      </div>

      {/* Content Layer */}
      <div style={S({ flex: 1, padding: '36px', position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column' })}>
        
        {/* TOP HEADER */}
        <div style={S({ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 })}>
            {/* Date */}
            <div style={S({ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, opacity: 0.8 })}>
              <Calendar size={20} color="#fff" />
              <span style={S({ fontSize: 12, color: '#fff', letterSpacing: '0.1em' })}>{match.matchDate || '22 JUNE 2026'}</span>
            </div>

            {/* Center: Competition */}
            <div style={S({ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 })}>
              <Trophy size={24} color={accentColor} />
              <span style={S({ fontSize: 20, fontWeight: 900, color: '#fff', letterSpacing: '0.05em' })}>{match.competition || 'CHAMPIONS LEAGUE'}</span>
              <div style={S({ display: 'flex', alignItems: 'center', gap: 12 })}>
                <div style={S({ width: 40, height: 1, backgroundColor: accentColor })} />
                <span style={S({ fontSize: 13, fontWeight: 800, color: accentColor, letterSpacing: '0.15em' })}>MATCHDAY {match.matchday || '12'}</span>
                <div style={S({ width: 40, height: 1, backgroundColor: accentColor })} />
              </div>
            </div>

            {/* Venue */}
            <div style={S({ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, opacity: 0.8 })}>
              <MapPin size={20} color="#fff" />
              <span style={S({ fontSize: 12, color: '#fff', letterSpacing: '0.1em', maxWidth: 100, textAlign: 'center' })}>{match.venue || 'ELITE STADIUM'}</span>
            </div>
        </div>

        {/* SCORE BOARD CONTAINER */}
        <div style={S({ position: 'relative', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.1)', borderTop: `2px solid rgba(255,255,255,0.3)`, borderRadius: 16, padding: '36px 16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 16 })}>
            {/* FULL TIME BADGE */}
            <div style={S({ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', border: `1px solid ${accentColor}`, borderRadius: 20, padding: '4px 32px', background: '#050505', color: accentColor, fontSize: 14, fontWeight: 800, letterSpacing: '0.1em' })}>
              FULL TIME
            </div>

            {/* Team A */}
            <div style={S({ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 })}>
              <TeamLogo name={match.teamA} color={match.teamAColor} size={84} />
              <span style={S({ fontSize: 16, fontWeight: 800, color: '#fff', textAlign: 'center', textTransform: 'uppercase', lineHeight: 1.2 })}>{match.teamA}</span>
            </div>

            {/* Score */}
            <div style={S({ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', margin: '0 24px' })}>
              <div style={S({ fontSize: 80, fontWeight: 900, color: '#fff', display: 'flex', alignItems: 'center', gap: 20, lineHeight: 1 })}>
                <span>{scoreA}</span>
                <span style={S({ color: 'rgba(255,255,255,0.3)', fontSize: 60 })}>-</span>
                <span>{scoreB}</span>
              </div>
              
              <div style={S({ display: 'flex', alignItems: 'center', gap: 12, marginTop: 16 })}>
                <Activity size={28} color="#fff" />
                <div style={S({ display: 'flex', flexDirection: 'column' })}>
                  <span style={S({ fontSize: 16, fontWeight: 900, color: '#fff', letterSpacing: '0.05em' })}>REFEREE <span style={{color: accentColor}}>PRO</span></span>
                  <span style={S({ fontSize: 7, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.1em' })}>MANAGE | TRACK | REFEREE</span>
                </div>
              </div>
            </div>

            {/* Team B */}
            <div style={S({ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 })}>
              <TeamLogo name={match.teamB} color={match.teamBColor} size={84} />
              <span style={S({ fontSize: 16, fontWeight: 800, color: '#fff', textAlign: 'center', textTransform: 'uppercase', lineHeight: 1.2 })}>{match.teamB}</span>
            </div>
        </div>

        {/* WINNER / DRAW PILL */}
        <div style={S({ display: 'flex', justifyContent: 'center', marginTop: 16 })}>
            <div style={S({ border: `1px solid ${accentColor}`, background: 'rgba(0,0,0,0.8)', padding: '12px 48px', borderRadius: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, boxShadow: `0 0 20px ${accentColor}22` })}>
              {winner === 'DRAW' ? (
                <>
                  <span style={S({ fontSize: 14, fontWeight: 800, color: accentColor, letterSpacing: '0.1em' })}>FULL TIME RESULT</span>
                  <span style={S({ fontSize: 26, fontWeight: 900, color: accentColor, textTransform: 'uppercase' })}>MATCH DRAWN</span>
                </>
              ) : (
                <>
                  <div style={S({ display: 'flex', alignItems: 'center', gap: 8 })}>
                    <Trophy size={18} color={accentColor} />
                    <span style={S({ fontSize: 14, fontWeight: 800, color: accentColor, letterSpacing: '0.1em' })}>WINNER</span>
                  </div>
                  <span style={S({ fontSize: 26, fontWeight: 900, color: accentColor, textTransform: 'uppercase' })}>{winner}</span>
                </>
              )}
            </div>
        </div>

        {/* MATCH TIMELINE */}
        {hasEvents && (
        <fieldset style={S({ marginTop: 24, border: '1px solid rgba(255,255,255,0.2)', borderRadius: 8, padding: '16px 16px 24px', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' })}>
            <legend style={S({ textAlign: 'center', padding: '0 16px', fontSize: 14, fontWeight: 800, color: '#fff', letterSpacing: '0.1em' })}>
              MATCH TIMELINE
            </legend>
            
            {/* Columns Header */}
            <div style={S({ display: 'flex', justifyContent: 'space-between', marginBottom: 24 })}>
              <div style={S({ flex: 1, textAlign: 'center', borderBottom: `2px solid ${match.teamAColor || '#ef4444'}`, paddingBottom: 6, color: '#fff', fontWeight: 800, fontSize: 13, textTransform: 'uppercase' })}>{match.teamA}</div>
              <div style={S({ width: 60 })} /> {/* gap for center line */}
              <div style={S({ flex: 1, textAlign: 'center', borderBottom: `2px solid ${match.teamBColor || '#10b981'}`, paddingBottom: 6, color: '#fff', fontWeight: 800, fontSize: 13, textTransform: 'uppercase' })}>{match.teamB}</div>
            </div>

            {/* Timeline Body */}
            <div style={S({ position: 'relative', display: 'flex', flexDirection: 'column', gap: 20 })}>
              {/* Center Line */}
              <div style={S({ position: 'absolute', top: -10, bottom: -20, left: '50%', transform: 'translateX(-50%)', width: 1, background: 'rgba(255,255,255,0.2)' })} />

              {timelineEvents.map((e, i) => {
                const isA = e.team === 'team_a';
                return (
                  <div key={i} style={S({ display: 'flex', alignItems: 'center', width: '100%' })}>
                    {/* Left Side */}
                    <div style={S({ flex: 1, display: 'flex', justifyContent: isA ? 'flex-start' : 'flex-end', paddingRight: 24 })}>
                        {isA && <EventItem event={e} accent={accentColor} />}
                    </div>
                    
                    {/* Center Circle */}
                    <div style={S({ width: 36, height: 36, borderRadius: 18, border: `1px solid ${accentColor}`, background: '#050505', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 })}>
                        <span style={S({ color: '#fff', fontSize: 14, fontWeight: 800 })}>{e.minute}'</span>
                    </div>

                    {/* Right Side */}
                    <div style={S({ flex: 1, display: 'flex', justifyContent: isA ? 'flex-end' : 'flex-start', paddingLeft: 24 })}>
                        {!isA && <EventItem event={e} accent={accentColor} />}
                    </div>
                  </div>
                );
              })}
            </div>
        </fieldset>
        )}

        <div style={S({ flex: 1 })} />

        {/* MATCH STATISTICS */}
        <fieldset style={S({ border: '1px solid rgba(255,255,255,0.2)', borderRadius: 8, padding: '16px 16px 24px', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', marginBottom: 24 })}>
            <legend style={S({ textAlign: 'center', padding: '0 16px', fontSize: 14, fontWeight: 800, color: accentColor, letterSpacing: '0.1em' })}>
              MATCH STATISTICS
            </legend>
            
            <div style={S({ display: 'flex', justifyContent: 'space-around', alignItems: 'center' })}>
              <StatItem icon="⚽" count={goalsA + goalsB} label="GOALS" />
              <div style={S({ width: 1, height: 40, background: 'rgba(255,255,255,0.1)' })} />
              <StatItem icon={<div style={{width:20,height:24,background:'#fbbf24',borderRadius:2}}/>} count={yellows} label="YELLOW CARDS" />
              <div style={S({ width: 1, height: 40, background: 'rgba(255,255,255,0.1)' })} />
              <StatItem icon={<div style={{width:20,height:24,background:'#ef4444',borderRadius:2}}/>} count={reds} label="RED CARDS" />
              <div style={S({ width: 1, height: 40, background: 'rgba(255,255,255,0.1)' })} />
              <StatItem icon="🔄" count={active.filter(e => e.eventType==='sub').length} label="SUBSTITUTIONS" />
            </div>
        </fieldset>



      </div>
    </div>
  );
}

export default function PosterPage({ params }: { params: Promise<{ id: string }> }) {
  const [match, setMatch]     = useState<any>(null);
  const [events, setEvents]   = useState<any[]>([]);
  const [exporting, setExp]   = useState(false);
  const [scale, setScale]     = useState(0.85);
  const [bgIndex, setBgIndex] = useState(1);
  const [accent, setAccent]   = useState<string>('#d4af37'); // Default to Gold
  const posterRef  = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router     = useRouter();

  useEffect(() => {
    params.then(async ({ id }) => {
      const [mr, er] = await Promise.all([fetch(`/api/matches/${id}`), fetch(`/api/matches/${id}/events`)]);
      const d = await mr.json();
      setMatch(d.match);
      setEvents(await er.json());
    });
  }, [params]);

  useEffect(() => {
    const calc = () => {
      const availableW = window.innerWidth - 32;
      const availableH = window.innerHeight - 250;
      // We increased base resolution from 360x640 to 540x960 for much crisper graphics
      setScale(Math.min(availableW / 540, availableH / 960, 1));
    };
    calc();
    window.addEventListener('resize', calc);
    return () => window.removeEventListener('resize', calc);
  }, []);

  const doExport = async () => {
    if (!posterRef.current) return;
    setExp(true);
    try {
      const url = await toPng(posterRef.current, { pixelRatio: 2, cacheBust: true }); // 540x960 * 2 = 1080x1920 (perfect 9:16)
      Object.assign(document.createElement('a'), {
        href: url, download: `refree-pro-match-result.png`
      }).click();
    } catch { alert('Failed to generate poster.'); }
    setExp(false);
  };

  const doShare = async () => {
    if (!posterRef.current) return;
    try {
      const url  = await toPng(posterRef.current, { pixelRatio: 2, cacheBust: true });
      const blob = await (await fetch(url)).blob();
      const file = new File([blob], 'refree-pro.png', { type: 'image/png' });
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: 'Refree Pro' });
      } else { doExport(); }
    } catch { /* silent */ }
  };

  if (!match) return (
    <div className="h-[100dvh] flex items-center justify-center bg-background">
      <div className="w-8 h-8 rounded-full border-2 border-foreground/10 border-t-foreground animate-spin" />
    </div>
  );

  const colors = ['#d4af37', '#3b82f6', '#10b981', '#ef4444', '#a855f7', '#ffffff'];

  return (
    <div className="fixed inset-0 bg-background flex flex-col overflow-hidden">
      {/* Header */}
      <div className="shrink-0 px-4 pt-5 pb-4 border-b border-border/10 flex items-center gap-3 bg-background/95 backdrop-blur-xl z-10">
        <button onClick={() => router.back()} className="w-9 h-9 rounded-full border border-border/40 bg-foreground/5 flex items-center justify-center hover:bg-foreground/10 active:scale-95 transition-all shrink-0">
          <ChevronLeft size={18} strokeWidth={2.5} />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-[16px] font-black truncate">Poster Builder</h1>
          <p className="text-[10px] text-muted-foreground font-medium truncate">Premium Match Result</p>
        </div>
        
        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button onClick={doShare} className="w-9 h-9 rounded-full bg-foreground/5 border border-border/40 flex items-center justify-center hover:bg-foreground/10 active:scale-95 transition-all">
            <Share2 size={16} />
          </button>
          <button onClick={doExport} disabled={exporting} className="h-9 px-4 rounded-full bg-foreground text-background text-[12px] font-black flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all disabled:opacity-60">
            {exporting ? <svg className="animate-spin w-3 h-3" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg> : <Download size={14} />}
            {exporting ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      {/* Background Selector & Theme Controls */}
      <div className="shrink-0 flex flex-col border-b border-border/10 z-10 bg-background">
        <div className="px-4 py-3 overflow-x-auto scrollbar-hide flex gap-2">
          {Array.from({ length: 7 }).map((_, i) => {
            const index = i + 1;
            const src = `/posters/bg-${index}.png`;
            return (
              <button
                key={index}
                onClick={() => setBgIndex(index)}
                className={cn(
                  'w-16 h-24 rounded-lg overflow-hidden shrink-0 border-2 transition-all relative',
                  bgIndex === index ? 'scale-[1.02]' : 'border-border/40 opacity-50 hover:opacity-100 hover:border-foreground/50'
                )}
                style={{ borderColor: bgIndex === index ? accent : undefined, boxShadow: bgIndex === index ? `0 0 15px ${accent}4D` : undefined }}
              >
                <img 
                  src={src} 
                  alt={`Template ${index}`} 
                  className="w-full h-full object-cover" 
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='96'%3E%3Crect width='100%25' height='100%25' fill='%23111'/%3E%3Ctext x='32' y='48' font-family='sans-serif' font-size='10' font-weight='bold' fill='%23333' text-anchor='middle' alignment-baseline='middle'%3EBG ${index}%3C/text%3E%3C/svg%3E`;
                  }}
                />
              </button>
            );
          })}
        </div>
        
        {/* THEME COLOR PICKER */}
        <div className="px-4 pb-3 flex items-center justify-between">
          <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Theme Color</span>
          <div className="flex gap-1.5">
            {colors.map(c => (
              <button
                key={c}
                onClick={() => setAccent(c)}
                className="w-6 h-6 rounded-full border-2 transition-transform active:scale-90"
                style={{ backgroundColor: c, borderColor: accent === c ? '#ffffff' : 'transparent' }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Poster Preview */}
      <div ref={containerRef} className="flex-1 min-h-0 flex items-center justify-center p-4 bg-background">
        <div style={{ width: 540 * scale, height: 960 * scale, position: 'relative' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: 540, height: 960, transform: `scale(${scale})`, transformOrigin: 'top left' }}>
            <div ref={posterRef} className="rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10 w-full h-full relative bg-[#050505]">
              <MasterPoster match={match} events={events} bgImage={`/posters/bg-${bgIndex}.png`} accentColor={accent} />
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
