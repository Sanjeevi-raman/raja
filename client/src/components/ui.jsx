import { useEffect, useState } from 'react';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import rajaMark from '../assets/logo/logo.png';

export const Btn = ({ children, onClick, plain = false, type = 'button', disabled = false }) => <button type={type} disabled={disabled} onClick={onClick} className={`btn ${plain ? 'plain' : ''}`}>{children}</button>;
export function CountUp({ value, duration = 1300 }) {
  const text = String(value), hasPlus = text.includes('+'), hasK = /k/i.test(text), hasPercent = text.includes('%');
  const target = Number(text.replace(/[^0-9.]/g, '')) * (hasK ? 1000 : 1);
  const [count, setCount] = useState(0);
  useEffect(() => {
    let frame;
    const startedAt = performance.now();
    const animate = now => {
      const progress = Math.min((now - startedAt) / duration, 1);
      setCount(Math.round(target * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [duration, target]);
  const display = hasK && count >= 1000 ? `${Number((count / 1000).toFixed(1))}K` : count.toLocaleString('en-IN');
  return <>{display}{hasPlus ? '+' : hasPercent ? '%' : ''}</>;
}
export function PageHead({ crumb, title, desc }) { return <div className="page-head"><div><small>Home / {crumb}</small><h1>{title}</h1>{desc && <p>{desc}</p>}</div></div>; }
export function Stats() { return <div className="stats">{[['25+', 'Years of Trust'], ['5000+', 'Products'], ['100+', 'Ongoing Projects']].map(([value, label]) => <div key={value}><ShieldCheck /><b>{value}</b><small>{label}</small></div>)}</div>; }
export function InfoSection({ title, children, centered = false }) { return <section className="intro-section" style={centered ? { alignItems: 'center' } : undefined}><div><small className="section-kicker">Why choose Raja</small><h2>{title}</h2></div><div>{children}</div></section>; }
export function CtaBand({ go }) { return <section className="cta-band"><div><div className="cta-kicker-row"><img src={rajaMark} alt="Raja Electricals 'N' Hardwares" /><small className="section-kicker">Let's build better</small></div><h2>Have a requirement?<br />We are ready to help.</h2><p>Speak with our product specialists for quotes, bulk orders and technical guidance.</p></div><Btn onClick={() => go('contactus')}>Request a quote <ArrowRight size={15} /></Btn></section>; }

export function WhatsAppIcon({ size = 20, className = "" }) {
  return (
    <span className={`whatsapp-badge ${className}`} aria-hidden="true">
      <svg viewBox="0 0 28 28" width={size} height={size} fill="none">
        <circle cx="14" cy="14" r="14" fill="#25D366" />
        <g transform="translate(2.5, 2.5) scale(0.82)">
          <path
            d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"
            stroke="#ffffff"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </g>
      </svg>
    </span>
  );
}

