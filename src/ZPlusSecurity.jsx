import { useState, useEffect, useRef } from 'react';
import logoEmblem from './assets/zplus-logo.png';
import {
  Shield,
  Users,
  Flag,
  Building2,
  Factory,
  Star,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  Linkedin,
  Facebook,
  Instagram,
  MessageCircle,
} from 'lucide-react';

const iconMap = {
  shield: Shield,
  users: Users,
  flag: Flag,
  building: Building2,
  zap: Factory,
  star: Star,
  check: CheckCircle2,
  phone: Phone,
  mail: Mail,
  map: MapPin,
  linkedin: Linkedin,
  facebook: Facebook,
  instagram: Instagram,
  whatsapp: MessageCircle,
};

const Icon = ({ name, size = 24 }) => {
  const LucideIcon = iconMap[name];
  if (!LucideIcon) return null;
  return <LucideIcon size={size} strokeWidth={1.5} />;
};

function useCountUp(target, duration = 1800, trigger) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    if (isNaN(parseInt(target, 10))) {
      setCount(target);
      return;
    }
    const end = parseInt(target, 10);
    let start = 0;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [trigger, target, duration]);
  return count;
}

function useInView(threshold = 0.2) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

function StatItem({ number, suffix = '', label, inView }) {
  const count = useCountUp(number, 1600, inView);
  return (
    <div className="stat-item">
      <span className="stat-number">
        {count}
        {suffix}
      </span>
      <span className="stat-label">{label}</span>
    </div>
  );
}

function Typewriter({ text }) {
  const [displayed, setDisplayed] = useState('');
  useEffect(() => {
    let i = 0;
    const t = setInterval(() => {
      setDisplayed(text.slice(0, i + 1));
      i += 1;
      if (i >= text.length) clearInterval(t);
    }, 45);
    return () => clearInterval(t);
  }, [text]);
  return (
    <span>
      {displayed}
      <span className="cursor-blink" style={{ color: 'var(--khaki)' }}>
        |
      </span>
    </span>
  );
}

export default function ZPlusSecurity() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    service: '',
    message: '',
  });
  const [formSent, setFormSent] = useState(false);

  const [statsRef, statsInView] = useInView(0.3);
  const [servicesRef, servicesInView] = useInView(0.1);
  const [aboutRef, aboutInView] = useInView(0.2);
  const [whyRef, whyInView] = useInView(0.1);
  const [testiRef, testiInView] = useInView(0.1);
  const [contactRef, contactInView] = useInView(0.1);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNav = (e, id) => {
    e.preventDefault();
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSent(true);
    setFormData({ name: '', phone: '', email: '', service: '', message: '' });
    setTimeout(() => setFormSent(false), 5000);
  };

  const services = [
    {
      icon: 'zap',
      num: '01',
      title: 'Industrial Security Services',
      desc: 'End-to-end industrial security with guards, supervisors, gunmen, CCTV operators, patrolling staff, and material movement control.',
    },
    {
      icon: 'building',
      num: '02',
      title: 'Commercial Security',
      desc: 'Security guards, reception security, access control, and CCTV monitoring for offices, malls, hospitals, and institutions.',
    },
    {
      icon: 'users',
      num: '03',
      title: 'Residential & Society Security',
      desc: 'Security guards, supervisors, gatekeepers, liftmen, CCTV operators, and parking safety staff for housing societies.',
    },
    {
      icon: 'flag',
      num: '04',
      title: 'Event-Based Security',
      desc: 'Bouncers, bodyguards, event security guards, crowd control, VIP and stage security, and gate management for events.',
    },
    {
      icon: 'shield',
      num: '05',
      title: 'Personal Protection',
      desc: 'Bodyguards, gunmen, lady guards, and escort services with preference to Ex-Army, Ex-Paramilitary, and Ex-Police personnel.',
    },
    {
      icon: 'star',
      num: '06',
      title: 'Housekeeping & Support',
      desc: 'Reliable housekeeping, cleaner, driver, caretaker, and utility staff deployed under disciplined supervision.',
    },
  ];

  const testimonials = [
    {
      text: 'Z Plus Security transformed our campus safety posture. Their guards are disciplined, well-briefed, and show strong command over access control and incident handling.',
      name: 'Rajesh Mehta',
      company: 'Operations Head — TechVision India',
      stars: 5,
    },
    {
      text: 'We deployed Z Plus Security for a large-scale corporate summit. From visitor management to VIP protection, their team ensured flawless coordination with zero incidents.',
      name: 'Priya Nair',
      company: 'Director — Summit Events Pvt. Ltd.',
      stars: 5,
    },
    {
      text: 'Our industrial site earlier faced recurring lapses. Since partnering with Z Plus Security, patrols, gate control, and material movement checks have been consistently robust.',
      name: 'Arun Sharma',
      company: 'Plant Manager — Bharat Steel Works',
      stars: 5,
    },
  ];

  const whyUs = [
    {
      num: '01',
      icon: 'users',
      title: 'Trained Professionals',
      desc: 'All personnel undergo rigorous background verification, physical training, and scenario-based drills before deployment.',
    },
    {
      num: '02',
      icon: 'shield',
      title: 'Licensed & Certified',
      desc: 'Fully compliant with PSARA and all national security regulations. Our licenses are current and audited regularly.',
    },
    {
      num: '03',
      icon: 'zap',
      title: '24/7 Command Center',
      desc: 'Our operations center monitors all deployed units round the clock with real-time incident reporting and rapid response.',
    },
    {
      num: '04',
      icon: 'flag',
      title: 'Custom Deployments',
      desc: 'We design security plans tailored to your specific requirements — no one-size-fits-all templates.',
    },
  ];

  const navLinks = [
    ['home', 'HOME'],
    ['services', 'SERVICES'],
    ['about', 'ABOUT'],
    ['whyus', 'WHY US'],
    ['contact', 'CONTACT'],
  ];

  return (
    <>
      <nav className={scrolled ? 'scrolled' : ''}>
        <div className="nav-inner">
          <a href="#home" className="nav-logo" onClick={(e) => handleNav(e, 'home')}>
            <img
              src={logoEmblem}
              alt="Z Plus Security emblem"
              style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                objectFit: 'cover',
              }}
            />
            <div className="nav-logo-text">
              <span className="nav-logo-main">Z PLUS SECURITY</span>
              <span className="nav-logo-sub">// PROTECT &amp; SERVE</span>
            </div>
          </a>
          <ul className="nav-links">
            {navLinks.map(([id, label]) => (
              <li key={id}>
                <a href={`#${id}`} onClick={(e) => handleNav(e, id)}>
                  {label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href="#contact"
            className="btn-primary nav-cta"
            onClick={(e) => handleNav(e, 'contact')}
            style={{ padding: '10px 24px', fontSize: '12px' }}
          >
            <span>REQUEST DEPLOYMENT</span>
          </a>
          <button type="button" className="hamburger" onClick={() => setMenuOpen((o) => !o)}>
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>

      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        <ul className="mobile-nav-links">
          {navLinks.map(([id, label]) => (
            <li key={id}>
              <a href={`#${id}`} onClick={(e) => handleNav(e, id)}>
                {label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <section id="home" className="hero noise">
        <div className="hero-grid" />
        <div className="hero-scanline" />
        <div className="hero-watermark">Z+</div>
        <div className="hero-content">
          <div className="hero-status" style={{ animation: 'fadeIn 0.8s 0.1s both' }}>
            <span className="status-dot" />
            <span className="hero-tag">// REGISTERED PSARA SECURITY AGENCY — GUJARAT</span>
          </div>
          <div className="hero-title" style={{ animation: 'fadeUp 0.8s 0.2s both' }}>
            <span className="line1">ELITE</span>
            <span className="line2">SECURITY</span>
            <span className="line3">SOLUTIONS</span>
          </div>
          <p className="hero-sub" style={{ animation: 'fadeUp 0.8s 0.5s both' }}>
            <Typewriter text="Professional Security Manpower. Disciplined Operations. 24/7 Protection." />
          </p>
          <div className="hero-buttons" style={{ animation: 'fadeUp 0.8s 0.8s both' }}>
            <a
              href="#contact"
              className="btn-primary"
              onClick={(e) => handleNav(e, 'contact')}
            >
              <span>DEPLOY NOW</span>
            </a>
            <a
              href="#services"
              className="btn-outline"
              onClick={(e) => handleNav(e, 'services')}
            >
              VIEW SERVICES
            </a>
          </div>
        </div>
        <div className="hero-bottom">
          <span className="scroll-label">SCROLL DOWN</span>
          <div className="scroll-arrow" />
        </div>
      </section>

      <div className="ticker">
        <div className="ticker-inner">
          {[0, 1].map((i) => (
            <div key={i} style={{ display: 'flex' }}>
              {[
                'ARMED GUARDS',
                'EVENT SECURITY',
                'CORPORATE PROTECTION',
                'INDUSTRIAL SECURITY',
                'EXECUTIVE DETAIL',
                'VIP PROTECTION',
                'CROWD CONTROL',
                'SITE SECURITY',
              ].map((item) => (
                <span key={item} className="ticker-item">
                  <span>■</span>
                  {item}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <section ref={statsRef} className="stats-bar">
        <div className="stats-grid">
          <StatItem number={500} suffix="+" label="GUARDS DEPLOYED" inView={statsInView} />
          <StatItem number={200} suffix="+" label="CLIENTS PROTECTED" inView={statsInView} />
          <StatItem number={10} suffix="+" label="YEARS IN SERVICE" inView={statsInView} />
          <StatItem number="24/7" label="OPERATIONAL COMMAND" inView={statsInView} />
        </div>
      </section>

      <section id="services" ref={servicesRef} className="services-section">
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <span className="section-label">// CORE MANPOWER DEPLOYMENTS</span>
          <h2 className="section-heading">Types of Services We Offer</h2>
          <p
            style={{
              color: 'var(--steel)',
              fontSize: 15,
              maxWidth: 540,
              lineHeight: 1.8,
            }}
          >
            Z Plus Security provides a full spectrum of security manpower and support staff tailored
            to industrial, commercial, residential, institutional, and event requirements.
          </p>
        </div>
        <div className="services-grid">
          {services.map((s, i) => (
            <div
              key={s.title}
              className="bracket-card"
              style={{ animation: servicesInView ? `fadeUp 0.6s ${i * 0.1}s both` : 'none' }}
            >
              <span className="service-card-num">{s.num}</span>
              <div className="service-card-icon">
                <Icon name={s.icon} size={36} />
              </div>
              <div className="service-card-title">{s.title}</div>
              <p className="service-card-desc">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="about" ref={aboutRef} className="about-section">
        <div className="about-inner">
          <div style={{ animation: aboutInView ? 'fadeUp 0.7s both' : 'none' }}>
            <span className="section-label">// MISSION BRIEFING</span>
            <h2 className="section-heading">Who We Are</h2>
            <p
              style={{
                color: 'var(--steel)',
                fontSize: 15,
                lineHeight: 1.9,
                marginBottom: 24,
              }}
            >
              Z Plus Security is a professional security manpower company dedicated to delivering
              disciplined, dependable, and well-trained security personnel for a wide range of
              requirements. We provide customized security solutions to residential societies,
              industrial units, commercial establishments, events, and institutions.
            </p>
            <p
              style={{
                color: 'var(--steel)',
                fontSize: 15,
                lineHeight: 1.9,
                marginBottom: 32,
              }}
            >
              Our operations are built on integrity, transparency, and accountability. Every
              deployment is supervised, monitored, and aligned with industry standards so that
              people, property, and critical assets are protected with consistent performance and
              complete client satisfaction.
            </p>
            {[
              'Leadership with 22+ years of distinguished paramilitary service overseeing recruitment and training',
              'Structured induction, role-based, fire & safety, first-aid, CCTV, and emergency drill training',
              'Strict selection criteria with medical fitness, police verification, and documented background checks',
              'Service culture focused on discipline, courtesy, and long-term client relationships',
            ].map((item) => (
              <div key={item} className="about-check">
                <span className="about-check-icon">
                  <Icon name="check" size={16} />
                </span>
                <span className="about-check-text">{item}</span>
              </div>
            ))}
            <div style={{ marginTop: 32 }}>
              <a
                href="#contact"
                className="btn-primary"
                onClick={(e) => handleNav(e, 'contact')}
              >
                <span>GET IN TOUCH</span>
              </a>
            </div>
          </div>
          <div
            className="about-visual"
            style={{ animation: aboutInView ? 'fadeIn 1s 0.3s both' : 'none' }}
          >
            <div className="shield-outer">
              <svg viewBox="0 0 280 320" className="shield-svg" fill="none">
                <path
                  d="M140 10 L260 55 L260 160 Q260 255 140 305 Q20 255 20 160 L20 55 Z"
                  fill="#1E2020"
                  stroke="#4A5240"
                  strokeWidth="2"
                />
                <path
                  d="M140 28 L245 68 L245 162 Q245 245 140 288 Q35 245 35 162 L35 68 Z"
                  fill="none"
                  stroke="#3A4235"
                  strokeWidth="1"
                />
                <text
                  x="140"
                  y="158"
                  textAnchor="middle"
                  fontFamily="Oswald,sans-serif"
                  fontSize="68"
                  fontWeight="700"
                  fill="#C8A84B"
                  dominantBaseline="middle"
                >
                  Z+
                </text>
                <text
                  x="140"
                  y="210"
                  textAnchor="middle"
                  fontFamily="monospace"
                  fontSize="11"
                  fill="#7A8E96"
                  letterSpacing="4"
                >
                  SECURITY
                </text>
                <line x1="50" y1="82" x2="230" y2="82" stroke="#2E3328" strokeWidth="1" />
                <circle cx="140" cy="60" r="4" fill="none" stroke="#C8A84B" strokeWidth="1" />
                <circle cx="140" cy="60" r="10" fill="none" stroke="#4A5240" strokeWidth="1" />
                <text
                  x="32"
                  y="44"
                  fontFamily="monospace"
                  fontSize="14"
                  fill="#4A5240"
                >
                  &#x250C;
                </text>
                <text
                  x="250"
                  y="44"
                  fontFamily="monospace"
                  fontSize="14"
                  fill="#4A5240"
                >
                  &#x2510;
                </text>
              </svg>
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage:
                    'linear-gradient(rgba(74,82,64,0.07) 1px,transparent 1px),linear-gradient(90deg,rgba(74,82,64,0.07) 1px,transparent 1px)',
                  backgroundSize: '24px 24px',
                  pointerEvents: 'none',
                }}
              />
            </div>
          </div>
        </div>
      </section>

      <section id="whyus" ref={whyRef} className="whyus-section">
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <span className="section-label">// OPERATIONAL ADVANTAGES</span>
          <h2 className="section-heading">Why Choose Z+</h2>
        </div>
        <div className="whyus-grid">
          {whyUs.map((w, i) => (
            <div
              key={w.title}
              className="whyus-card"
              style={{ animation: whyInView ? `fadeUp 0.6s ${i * 0.15}s both` : 'none' }}
            >
              <div className="whyus-num">{w.num}</div>
              <div style={{ marginBottom: 10, color: 'var(--khaki)', marginTop: -8 }}>
                <Icon name={w.icon} size={28} />
              </div>
              <div className="whyus-title">{w.title}</div>
              <p className="whyus-desc">{w.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section ref={testiRef} className="testimonials-section">
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <span className="section-label">// FIELD REPORTS</span>
          <h2 className="section-heading">Client Testimonials</h2>
        </div>
        <div className="testimonials-grid">
          {testimonials.map((t, i) => (
            <div
              key={t.name}
              className="testi-card"
              style={{ animation: testiInView ? `fadeUp 0.6s ${i * 0.15}s both` : 'none' }}
            >
              <div className="testi-quote">"</div>
              <div className="testi-stars">{'★'.repeat(t.stars)}</div>
              <p className="testi-text">{t.text}</p>
              <div className="testi-name">{t.name}</div>
              <div className="testi-company">{t.company}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="contact" ref={contactRef} className="contact-section">
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <span className="section-label">// REQUEST DEPLOYMENT</span>
          <h2 className="section-heading">Contact Us</h2>
        </div>
        <div className="contact-inner">
          <div style={{ animation: contactInView ? 'fadeUp 0.7s both' : 'none' }}>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    className="form-input"
                    type="text"
                    required
                    placeholder="Your full name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input
                    className="form-input"
                    type="tel"
                    required
                    placeholder="+91 00000 00000"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, phone: e.target.value }))
                    }
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  className="form-input"
                  type="email"
                  required
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                />
              </div>
              <div className="form-group">
                <label className="form-label">Service Required</label>
                <select
                  className="form-select"
                  required
                  value={formData.service}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, service: e.target.value }))
                  }
                >
                  <option value="">-- SELECT SERVICE --</option>
                  <option>Armed Guard Services</option>
                  <option>Unarmed Security Personnel</option>
                  <option>Event &amp; Crowd Control</option>
                  <option>Corporate Security</option>
                  <option>Industrial &amp; Site Security</option>
                  <option>Executive Protection</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Message / Requirements</label>
                <textarea
                  className="form-textarea"
                  placeholder="Describe your security requirements..."
                  value={formData.message}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, message: e.target.value }))
                  }
                />
              </div>
              <button type="submit" className="btn-primary" style={{ width: '100%' }}>
                <span>SUBMIT REQUEST</span>
              </button>
              {formSent && (
                <div className="form-success">
                  ✓ REQUEST RECEIVED — Our team will contact you within 24 hours.
                </div>
              )}
            </form>
          </div>

          <div style={{ animation: contactInView ? 'fadeUp 0.7s 0.2s both' : 'none' }}>
            {[
              {
                icon: 'map',
                label: 'NADIAD OFFICE',
                value:
                  'Shop No. G-7, Santram Lotus,\nNadiad–Kapadvanj Road, Nadiad, Gujarat',
              },
              {
                icon: 'map',
                label: 'PANCHMAHAL OFFICE',
                value:
                  'Thakor Na Nadhra, Taluka Kadana,\nPO Diwda Colony, Panchmahals, Gujarat – 389250',
              },
              {
                icon: 'phone',
                label: 'CONTACT NUMBERS',
                value: '+91 98684 34750\n+91 95374 59627',
              },
              {
                icon: 'mail',
                label: 'EMAIL',
                value: 'sharmacrpf6@gmail.com',
              },
            ].map((item) => (
              <div key={item.label} className="contact-info-item">
                <div className="contact-info-icon">
                  <Icon name={item.icon} size={18} />
                </div>
                <div>
                  <div className="contact-info-label">{item.label}</div>
                  <div className="contact-info-value">
                    {item.value.split('\n').map((line, idx) => (
                      <span key={`${item.label}-${line}`}>
                        {line}
                        {idx === 0 && <br />}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
            <div className="ops-hours">
              <div className="ops-hours-title">⬡ OPERATIONAL HOURS</div>
              <div className="ops-hours-text">
                MONDAY — SUNDAY
                <br />
                24 HOURS / 7 DAYS / 365 DAYS
                <br />
                <br />
                {/* eslint-disable-next-line react/no-unescaped-entities */}
                // EMERGENCY RESPONSE: IMMEDIATE
                <br />
                // DEPLOYMENT QUERY: 09:00 — 18:00 IST
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer>
        <div className="footer-inner">
          <div className="footer-top">
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  marginBottom: 12,
                }}
              >
                <span
                  style={{
                    fontFamily: 'Oswald,sans-serif',
                    fontSize: 28,
                    fontWeight: 700,
                    color: 'var(--khaki)',
                  }}
                >
                  Z+
                </span>
                <div>
                  <div
                    style={{
                      fontFamily: 'Oswald,sans-serif',
                      fontSize: 16,
                      color: 'var(--off-white)',
                      letterSpacing: 3,
                    }}
                  >
                    SECURITY
                  </div>
                  <div
                    style={{
                      fontFamily: 'monospace',
                      fontSize: 9,
                      color: 'var(--steel)',
                      letterSpacing: 2,
                    }}
                  >
                    // MANPOWER SOLUTIONS
                  </div>
                </div>
              </div>
              <p className="footer-brand-desc">
                Z+ Security provides professional manpower and security solutions across India.
                Trained. Certified. Always Deployed.
              </p>
            </div>
            <div>
              <div className="footer-heading">Quick Links</div>
              <ul className="footer-links">
                {navLinks.map(([id, label]) => (
                  <li key={id}>
                    <a href={`#${id}`} onClick={(e) => handleNav(e, id)}>
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="footer-heading">Services</div>
              <ul className="footer-links">
                {[
                  'Armed Guards',
                  'Unarmed Personnel',
                  'Event Security',
                  'Corporate Security',
                  'Industrial Security',
                  'Executive Protection',
                ].map((s) => (
                  <li key={s}>
                    <a href="#services" onClick={(e) => handleNav(e, 'services')}>
                      {s}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="footer-heading">Contact</div>
              <ul className="footer-links">
                <li>
                  <a href="tel:+919876543210">+91 98765 43210</a>
                </li>
                <li>
                  <a href="mailto:ops@zplussecurity.in">ops@zplussecurity.in</a>
                </li>
                <li>
                  <a href="#contact" onClick={(e) => handleNav(e, 'contact')}>
                    New Delhi, India
                  </a>
                </li>
              </ul>
              <div style={{ marginTop: 20 }}>
                <div className="footer-heading" style={{ marginBottom: 12 }}>
                  Follow Us
                </div>
                <div className="social-links">
                  {['linkedin', 'facebook', 'instagram', 'whatsapp'].map((s) => (
                    <a key={s} href="#" className="social-link" aria-label={s}>
                      <Icon name={s} size={15} />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <span className="footer-copy">
              © 2025 Z+ SECURITY. ALL RIGHTS RESERVED. // PSARA LICENSED
            </span>
            <span className="footer-copy" style={{ color: 'var(--olive)' }}>
              PROTECTING INDIA. 24/7.
            </span>
          </div>
        </div>
      </footer>
    </>
  );
}

