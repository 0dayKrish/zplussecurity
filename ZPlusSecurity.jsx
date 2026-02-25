import { useState, useEffect, useRef } from "react";

// ─── STYLES ────────────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Share+Tech+Mono&family=Roboto+Condensed:wght@300;400;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --olive:       #4A5240;
    --olive-dark:  #2E3328;
    --olive-light: #5C6650;
    --carbon:      #111111;
    --gunmetal:    #1E2020;
    --panel:       #252825;
    --khaki:       #C8A84B;
    --khaki-light: #E0BF6A;
    --steel:       #7A8E96;
    --off-white:   #E8E4D9;
    --muted:       #5A6068;
    --danger:      #8B1A1A;
    --border:      #333A30;
  }

  html { scroll-behavior: smooth; }

  body {
    font-family: 'Roboto Condensed', sans-serif;
    background: var(--carbon);
    color: var(--off-white);
    overflow-x: hidden;
  }

  ::selection { background: var(--khaki); color: var(--carbon); }

  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: var(--carbon); }
  ::-webkit-scrollbar-thumb { background: var(--olive); border-radius: 0; }

  .noise::after {
    content: '';
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
    pointer-events: none;
    z-index: 1;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(30px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes blink {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0; }
  }
  @keyframes scanline {
    0%   { transform: translateY(-100%); }
    100% { transform: translateY(100vh); }
  }
  @keyframes marqueeTick {
    0%   { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }

  .animate-fadeUp  { animation: fadeUp 0.7s ease both; }
  .animate-fadeIn  { animation: fadeIn 0.5s ease both; }
  .cursor-blink    { animation: blink 1s step-end infinite; }

  .btn-primary {
    display: inline-block;
    padding: 12px 32px;
    background: var(--khaki);
    color: var(--carbon);
    font-family: 'Oswald', sans-serif;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 2px;
    text-transform: uppercase;
    border: 2px solid var(--khaki);
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: all 0.3s;
    text-decoration: none;
  }
  .btn-primary::before {
    content: '';
    position: absolute;
    top: 0; left: -100%;
    width: 100%; height: 100%;
    background: var(--carbon);
    transition: left 0.3s;
    z-index: 0;
  }
  .btn-primary:hover::before { left: 0; }
  .btn-primary:hover { color: var(--khaki); }
  .btn-primary span { position: relative; z-index: 1; }

  .btn-outline {
    display: inline-block;
    padding: 12px 32px;
    background: transparent;
    color: var(--off-white);
    font-family: 'Oswald', sans-serif;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 2px;
    text-transform: uppercase;
    border: 2px solid var(--steel);
    cursor: pointer;
    transition: all 0.3s;
    text-decoration: none;
  }
  .btn-outline:hover { border-color: var(--khaki); color: var(--khaki); }

  .section-label {
    font-family: 'Share Tech Mono', monospace;
    font-size: 11px;
    color: var(--steel);
    letter-spacing: 3px;
    text-transform: uppercase;
    margin-bottom: 12px;
    display: block;
  }

  .section-heading {
    font-family: 'Oswald', sans-serif;
    font-size: clamp(32px, 5vw, 52px);
    font-weight: 700;
    color: var(--khaki);
    text-transform: uppercase;
    letter-spacing: 3px;
    line-height: 1.1;
    margin-bottom: 16px;
  }

  .bracket-card {
    background: var(--panel);
    border-left: 3px solid var(--olive);
    padding: 28px 24px;
    position: relative;
    transition: all 0.3s;
    cursor: default;
  }
  .bracket-card::before, .bracket-card::after {
    font-family: monospace;
    font-size: 18px;
    color: var(--olive);
    position: absolute;
    transition: color 0.3s;
  }
  .bracket-card::before { content: '\u250C'; top: 8px; right: 12px; }
  .bracket-card::after  { content: '\u2518'; bottom: 8px; right: 12px; }
  .bracket-card:hover {
    border-left-color: var(--khaki);
    transform: translateY(-4px);
    box-shadow: 0 8px 32px rgba(0,0,0,0.5);
  }
  .bracket-card:hover::before,
  .bracket-card:hover::after { color: var(--khaki); }

  nav {
    position: fixed;
    top: 0; left: 0; right: 0;
    z-index: 1000;
    transition: all 0.3s;
  }
  nav.scrolled {
    background: rgba(17,17,17,0.97);
    border-bottom: 1px solid var(--olive);
    backdrop-filter: blur(8px);
  }
  .nav-inner {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 32px;
    height: 72px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .nav-logo {
    display: flex;
    align-items: center;
    gap: 10px;
    text-decoration: none;
  }
  .nav-logo-z {
    font-family: 'Oswald', sans-serif;
    font-size: 28px;
    font-weight: 700;
    color: var(--khaki);
    line-height: 1;
  }
  .nav-logo-text {
    display: flex;
    flex-direction: column;
    line-height: 1.1;
  }
  .nav-logo-main {
    font-family: 'Oswald', sans-serif;
    font-size: 16px;
    font-weight: 600;
    color: var(--off-white);
    letter-spacing: 3px;
  }
  .nav-logo-sub {
    font-family: 'Share Tech Mono', monospace;
    font-size: 9px;
    color: var(--steel);
    letter-spacing: 2px;
  }
  .nav-links {
    display: flex;
    align-items: center;
    gap: 36px;
    list-style: none;
  }
  .nav-links a {
    font-family: 'Oswald', sans-serif;
    font-size: 13px;
    font-weight: 500;
    color: var(--steel);
    text-decoration: none;
    letter-spacing: 2px;
    text-transform: uppercase;
    position: relative;
    transition: color 0.3s;
  }
  .nav-links a::after {
    content: '';
    position: absolute;
    bottom: -4px; left: 0;
    width: 0; height: 1px;
    background: var(--khaki);
    transition: width 0.3s;
  }
  .nav-links a:hover { color: var(--khaki); }
  .nav-links a:hover::after { width: 100%; }

  .hero {
    min-height: 100vh;
    display: flex;
    align-items: center;
    position: relative;
    overflow: hidden;
    background: linear-gradient(135deg, #0a0c0a 0%, #1a1f18 50%, #0d1009 100%);
  }
  .hero-grid {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(74,82,64,0.1) 1px, transparent 1px),
      linear-gradient(90deg, rgba(74,82,64,0.1) 1px, transparent 1px);
    background-size: 60px 60px;
  }
  .hero-scanline {
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, rgba(200,168,75,0.3), transparent);
    animation: scanline 4s linear infinite;
    pointer-events: none;
  }
  .hero-watermark {
    position: absolute;
    right: -2%;
    top: 50%;
    transform: translateY(-50%) rotate(-15deg);
    font-family: 'Oswald', sans-serif;
    font-size: clamp(120px, 20vw, 280px);
    font-weight: 700;
    color: transparent;
    -webkit-text-stroke: 1px rgba(74,82,64,0.15);
    pointer-events: none;
    user-select: none;
    letter-spacing: -10px;
  }
  .hero-content {
    position: relative;
    z-index: 2;
    max-width: 1280px;
    margin: 0 auto;
    padding: 120px 32px 80px;
    width: 100%;
  }
  .hero-status {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 32px;
  }
  .status-dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    background: #22c55e;
    animation: blink 1.5s ease-in-out infinite;
  }
  .hero-tag {
    font-family: 'Share Tech Mono', monospace;
    font-size: 11px;
    color: var(--steel);
    letter-spacing: 3px;
  }
  .hero-title {
    font-family: 'Oswald', sans-serif;
    font-weight: 700;
    text-transform: uppercase;
    line-height: 0.9;
    margin-bottom: 28px;
  }
  .hero-title .line1 {
    display: block;
    font-size: clamp(60px, 12vw, 130px);
    color: var(--off-white);
    letter-spacing: 4px;
  }
  .hero-title .line2 {
    display: block;
    font-size: clamp(60px, 12vw, 130px);
    color: var(--khaki);
    letter-spacing: 4px;
  }
  .hero-title .line3 {
    display: block;
    font-size: clamp(60px, 12vw, 130px);
    color: transparent;
    -webkit-text-stroke: 2px var(--off-white);
    letter-spacing: 4px;
    opacity: 0.6;
  }
  .hero-sub {
    font-family: 'Share Tech Mono', monospace;
    font-size: 14px;
    color: var(--steel);
    letter-spacing: 2px;
    margin-bottom: 40px;
    max-width: 540px;
    line-height: 1.8;
  }
  .hero-buttons { display: flex; gap: 16px; flex-wrap: wrap; }
  .hero-bottom {
    position: absolute;
    bottom: 32px; left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    animation: fadeIn 1s 1.5s both;
  }
  .scroll-label {
    font-family: 'Share Tech Mono', monospace;
    font-size: 10px;
    color: var(--muted);
    letter-spacing: 3px;
  }
  .scroll-arrow {
    width: 20px; height: 20px;
    border-right: 2px solid var(--olive);
    border-bottom: 2px solid var(--olive);
    transform: rotate(45deg);
    animation: fadeUp 0.5s 0.3s ease-in-out alternate infinite;
  }

  .ticker {
    background: var(--olive-dark);
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
    overflow: hidden;
    padding: 10px 0;
  }
  .ticker-inner {
    display: flex;
    white-space: nowrap;
    animation: marqueeTick 25s linear infinite;
  }
  .ticker-item {
    font-family: 'Share Tech Mono', monospace;
    font-size: 11px;
    color: var(--steel);
    letter-spacing: 2px;
    padding: 0 40px;
  }
  .ticker-item span { color: var(--khaki); margin-right: 8px; }

  .stats-bar {
    background: var(--olive-dark);
    padding: 64px 32px 80px;
    clip-path: polygon(0 0, 100% 0, 100% 88%, 0 100%);
  }
  .stats-grid {
    max-width: 1280px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0;
  }
  .stat-item {
    text-align: center;
    padding: 24px 16px;
    border-right: 1px solid rgba(74,82,64,0.4);
  }
  .stat-item:last-child { border-right: none; }
  .stat-number {
    font-family: 'Oswald', sans-serif;
    font-size: clamp(40px, 6vw, 64px);
    font-weight: 700;
    color: var(--khaki);
    line-height: 1;
    display: block;
  }
  .stat-label {
    font-family: 'Share Tech Mono', monospace;
    font-size: 11px;
    color: var(--steel);
    letter-spacing: 2px;
    text-transform: uppercase;
    margin-top: 8px;
    display: block;
  }

  .services-section {
    padding: 100px 32px;
    background: var(--carbon);
    position: relative;
  }
  .services-grid {
    max-width: 1280px;
    margin: 48px auto 0;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2px;
  }
  .service-card-icon {
    width: 48px; height: 48px;
    margin-bottom: 16px;
    color: var(--khaki);
  }
  .service-card-num {
    font-family: 'Share Tech Mono', monospace;
    font-size: 11px;
    color: var(--muted);
    letter-spacing: 2px;
    margin-bottom: 8px;
    display: block;
  }
  .service-card-title {
    font-family: 'Oswald', sans-serif;
    font-size: 18px;
    font-weight: 600;
    color: var(--off-white);
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 10px;
  }
  .service-card-desc {
    font-size: 14px;
    color: var(--steel);
    line-height: 1.7;
  }

  .about-section {
    padding: 100px 32px;
    background: var(--gunmetal);
    position: relative;
  }
  .about-inner {
    max-width: 1280px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 80px;
    align-items: center;
  }
  .about-check {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 16px;
  }
  .about-check-icon { color: var(--khaki); margin-top: 3px; flex-shrink: 0; }
  .about-check-text { font-size: 15px; color: var(--off-white); line-height: 1.6; }
  .about-visual {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }
  .shield-outer { width: 280px; height: 320px; position: relative; }
  .shield-svg { width: 100%; height: 100%; }

  .whyus-section {
    padding: 120px 32px;
    background: var(--olive-dark);
    clip-path: polygon(0 5%, 100% 0, 100% 95%, 0 100%);
  }
  .whyus-grid {
    max-width: 1280px;
    margin: 48px auto 0;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 3px;
  }
  .whyus-card {
    background: rgba(0,0,0,0.3);
    padding: 36px 32px;
    border-top: 2px solid var(--olive);
    transition: border-color 0.3s;
  }
  .whyus-card:hover { border-top-color: var(--khaki); }
  .whyus-num {
    font-family: 'Oswald', sans-serif;
    font-size: 48px;
    font-weight: 700;
    color: rgba(200,168,75,0.15);
    line-height: 1;
    margin-bottom: 12px;
  }
  .whyus-title {
    font-family: 'Oswald', sans-serif;
    font-size: 20px;
    font-weight: 600;
    color: var(--off-white);
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 10px;
    margin-top: -8px;
  }
  .whyus-desc { font-size: 14px; color: var(--steel); line-height: 1.7; }

  .testimonials-section { padding: 100px 32px; background: var(--carbon); }
  .testimonials-grid {
    max-width: 1280px;
    margin: 48px auto 0;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 3px;
  }
  .testi-card {
    background: var(--panel);
    padding: 36px 28px;
    border-top: 3px solid var(--khaki);
    position: relative;
  }
  .testi-quote {
    font-family: 'Oswald', sans-serif;
    font-size: 72px;
    color: rgba(200,168,75,0.1);
    line-height: 1;
    position: absolute;
    top: 12px; left: 20px;
  }
  .testi-stars { color: var(--khaki); font-size: 14px; margin-bottom: 16px; }
  .testi-text { font-size: 14px; color: var(--steel); line-height: 1.8; margin-bottom: 20px; }
  .testi-name {
    font-family: 'Oswald', sans-serif;
    font-size: 15px;
    font-weight: 600;
    color: var(--off-white);
    text-transform: uppercase;
    letter-spacing: 1px;
  }
  .testi-company {
    font-family: 'Share Tech Mono', monospace;
    font-size: 11px;
    color: var(--muted);
    letter-spacing: 1px;
    margin-top: 4px;
  }

  .contact-section { padding: 100px 32px; background: var(--gunmetal); }
  .contact-inner {
    max-width: 1280px;
    margin: 48px auto 0;
    display: grid;
    grid-template-columns: 1.2fr 0.8fr;
    gap: 60px;
  }
  .form-group { margin-bottom: 20px; }
  .form-label {
    display: block;
    font-family: 'Share Tech Mono', monospace;
    font-size: 11px;
    color: var(--steel);
    letter-spacing: 2px;
    text-transform: uppercase;
    margin-bottom: 8px;
  }
  .form-input, .form-select, .form-textarea {
    width: 100%;
    background: var(--carbon);
    border: 1px solid var(--border);
    border-left: 3px solid var(--olive);
    color: var(--off-white);
    font-family: 'Roboto Condensed', sans-serif;
    font-size: 15px;
    padding: 12px 16px;
    outline: none;
    transition: border-color 0.3s;
    appearance: none;
  }
  .form-input:focus, .form-select:focus, .form-textarea:focus {
    border-color: var(--khaki);
    border-left-color: var(--khaki);
  }
  .form-textarea { resize: vertical; min-height: 120px; }
  .form-select option { background: var(--carbon); }
  .contact-info-item {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    margin-bottom: 28px;
  }
  .contact-info-icon {
    width: 40px; height: 40px;
    background: var(--olive-dark);
    border: 1px solid var(--olive);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    color: var(--khaki);
  }
  .contact-info-label {
    font-family: 'Share Tech Mono', monospace;
    font-size: 10px;
    color: var(--muted);
    letter-spacing: 2px;
    text-transform: uppercase;
    margin-bottom: 4px;
  }
  .contact-info-value { font-size: 15px; color: var(--off-white); line-height: 1.5; }
  .ops-hours {
    background: var(--carbon);
    border: 1px solid var(--border);
    border-left: 3px solid var(--khaki);
    padding: 20px;
    margin-top: 32px;
  }
  .ops-hours-title {
    font-family: 'Oswald', sans-serif;
    font-size: 14px;
    color: var(--khaki);
    letter-spacing: 2px;
    text-transform: uppercase;
    margin-bottom: 10px;
  }
  .ops-hours-text {
    font-family: 'Share Tech Mono', monospace;
    font-size: 12px;
    color: var(--steel);
    line-height: 1.8;
  }

  footer {
    background: var(--carbon);
    border-top: 1px solid var(--olive);
    padding: 60px 32px 24px;
  }
  .footer-inner { max-width: 1280px; margin: 0 auto; }
  .footer-top {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr;
    gap: 48px;
    padding-bottom: 48px;
    border-bottom: 1px solid var(--border);
  }
  .footer-brand-desc {
    font-size: 13px;
    color: var(--muted);
    line-height: 1.8;
    margin-top: 12px;
    max-width: 280px;
  }
  .footer-heading {
    font-family: 'Oswald', sans-serif;
    font-size: 13px;
    font-weight: 600;
    color: var(--khaki);
    letter-spacing: 3px;
    text-transform: uppercase;
    margin-bottom: 20px;
  }
  .footer-links { list-style: none; }
  .footer-links li { margin-bottom: 10px; }
  .footer-links a {
    font-size: 13px;
    color: var(--muted);
    text-decoration: none;
    letter-spacing: 1px;
    transition: color 0.2s;
  }
  .footer-links a:hover { color: var(--khaki); }
  .footer-bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 24px;
  }
  .footer-copy {
    font-family: 'Share Tech Mono', monospace;
    font-size: 11px;
    color: var(--muted);
    letter-spacing: 2px;
  }
  .social-links { display: flex; gap: 12px; }
  .social-link {
    width: 36px; height: 36px;
    border: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--muted);
    text-decoration: none;
    font-size: 14px;
    transition: all 0.3s;
  }
  .social-link:hover { border-color: var(--khaki); color: var(--khaki); }

  .mobile-menu {
    display: none;
    position: fixed;
    top: 72px; left: 0; right: 0;
    background: rgba(17,17,17,0.98);
    border-bottom: 1px solid var(--olive);
    padding: 24px 32px;
    z-index: 999;
    backdrop-filter: blur(8px);
  }
  .mobile-menu.open { display: block; }
  .mobile-nav-links { list-style: none; }
  .mobile-nav-links li { margin-bottom: 16px; }
  .mobile-nav-links a {
    font-family: 'Oswald', sans-serif;
    font-size: 18px;
    color: var(--steel);
    text-decoration: none;
    letter-spacing: 3px;
    text-transform: uppercase;
  }

  .form-success {
    background: rgba(74,82,64,0.2);
    border: 1px solid var(--olive);
    border-left: 3px solid var(--khaki);
    padding: 16px 20px;
    margin-top: 16px;
    font-family: 'Share Tech Mono', monospace;
    font-size: 12px;
    color: var(--khaki);
    letter-spacing: 1px;
  }

  @media (max-width: 1024px) {
    .services-grid { grid-template-columns: repeat(2, 1fr); }
    .about-inner { grid-template-columns: 1fr; gap: 48px; }
    .about-visual { display: none; }
    .footer-top { grid-template-columns: 1fr 1fr; gap: 32px; }
    .testimonials-grid { grid-template-columns: 1fr 1fr; }
  }
  @media (max-width: 768px) {
    .nav-links { display: none; }
    .nav-cta { display: none; }
    .hamburger { display: flex !important; }
    .stats-grid { grid-template-columns: repeat(2, 1fr); }
    .stat-item { border-right: none; border-bottom: 1px solid rgba(74,82,64,0.3); }
    .services-grid { grid-template-columns: 1fr; }
    .whyus-grid { grid-template-columns: 1fr; }
    .testimonials-grid { grid-template-columns: 1fr; }
    .contact-inner { grid-template-columns: 1fr; }
    .footer-top { grid-template-columns: 1fr; }
    .footer-bottom { flex-direction: column; gap: 16px; text-align: center; }
  }
  .hamburger {
    display: none;
    flex-direction: column;
    gap: 5px;
    cursor: pointer;
    padding: 4px;
    background: none;
    border: none;
  }
  .hamburger span { display: block; width: 24px; height: 2px; background: var(--off-white); transition: all 0.3s; }
`;

const Icon = ({ name, size = 24 }) => {
  const paths = {
    shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>,
    users: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>,
    flag: <><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></>,
    building: <><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></>,
    zap: <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>,
    star: <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>,
    check: <polyline points="20 6 9 17 4 12"/>,
    phone: <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13 19.79 19.79 0 0 1 1.58 4.35 2 2 0 0 1 3.57 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>,
    mail: <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></>,
    map: <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></>,
    linkedin: <><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></>,
    facebook: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>,
    instagram: <><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></>,
    whatsapp: <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      {paths[name]}
    </svg>
  );
};

function useCountUp(target, duration = 1800, trigger) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    if (isNaN(parseInt(target))) { setCount(target); return; }
    const end = parseInt(target);
    let start = 0;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [trigger]);
  return count;
}

function useInView(threshold = 0.2) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setInView(true); obs.disconnect(); }
    }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

function StatItem({ number, suffix = "", label, inView }) {
  const count = useCountUp(number, 1600, inView);
  return (
    <div className="stat-item">
      <span className="stat-number">{count}{suffix}</span>
      <span className="stat-label">{label}</span>
    </div>
  );
}

function Typewriter({ text }) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    let i = 0;
    const t = setInterval(() => {
      setDisplayed(text.slice(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(t);
    }, 45);
    return () => clearInterval(t);
  }, [text]);
  return <span>{displayed}<span className="cursor-blink" style={{ color: "var(--khaki)" }}>|</span></span>;
}

export default function ZPlusSecurity() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "", email: "", service: "", message: "" });
  const [formSent, setFormSent] = useState(false);

  const [statsRef, statsInView]     = useInView(0.3);
  const [servicesRef, servicesInView] = useInView(0.1);
  const [aboutRef, aboutInView]     = useInView(0.2);
  const [whyRef, whyInView]         = useInView(0.1);
  const [testiRef, testiInView]     = useInView(0.1);
  const [contactRef, contactInView] = useInView(0.1);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNav = (e, id) => {
    e.preventDefault();
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSent(true);
    setFormData({ name: "", phone: "", email: "", service: "", message: "" });
    setTimeout(() => setFormSent(false), 5000);
  };

  const services = [
    { icon: "shield",   num: "01", title: "Armed Guard Services",       desc: "Trained armed personnel deployed for high-security establishments and critical asset protection." },
    { icon: "users",    num: "02", title: "Unarmed Security Personnel",  desc: "Professional unarmed guards for offices, malls, housing societies, and commercial premises." },
    { icon: "flag",     num: "03", title: "Event & Crowd Control",       desc: "Specialized security teams for concerts, corporate events, VIP functions, and large gatherings." },
    { icon: "building", num: "04", title: "Corporate Security",          desc: "End-to-end security solutions for corporate parks, tech campuses, and business headquarters." },
    { icon: "zap",      num: "05", title: "Industrial & Site Security",  desc: "Round-the-clock security for factories, warehouses, construction sites, and industrial zones." },
    { icon: "star",     num: "06", title: "Executive Protection",        desc: "Personal security detail for executives, VIPs, celebrities, and high-net-worth individuals." },
  ];

  const testimonials = [
    { text: "Z+ Security transformed our corporate campus safety. Their team is disciplined, professional, and always two steps ahead. We feel genuinely protected.", name: "Rajesh Mehta",  company: "Operations Head — TechVision India", stars: 5 },
    { text: "We deployed Z+ Security for our annual summit with 3,000+ attendees. Flawless coordination, zero incidents. Their event security is unmatched.",             name: "Priya Nair",   company: "Director — Summit Events Pvt. Ltd.",  stars: 5 },
    { text: "Our industrial site had recurring security lapses. Since partnering with Z+ Security, there have been zero breaches in 18 months. Highly recommended.",      name: "Arun Sharma",  company: "Plant Manager — Bharat Steel Works",   stars: 5 },
  ];

  const whyUs = [
    { num: "01", icon: "users",    title: "Trained Professionals", desc: "All personnel undergo rigorous background verification, physical training, and scenario-based drills before deployment." },
    { num: "02", icon: "shield",   title: "Licensed & Certified",  desc: "Fully compliant with PSARA and all national security regulations. Our licenses are current and audited regularly." },
    { num: "03", icon: "zap",      title: "24/7 Command Center",   desc: "Our operations center monitors all deployed units round the clock with real-time incident reporting and rapid response." },
    { num: "04", icon: "flag",     title: "Custom Deployments",    desc: "We design security plans tailored to your specific requirements — no one-size-fits-all templates." },
  ];

  const navLinks = [["home","HOME"],["services","SERVICES"],["about","ABOUT"],["whyus","WHY US"],["contact","CONTACT"]];

  return (
    <>
      <style>{styles}</style>

      {/* NAVBAR */}
      <nav className={scrolled ? "scrolled" : ""}>
        <div className="nav-inner">
          <a href="#home" className="nav-logo" onClick={e => handleNav(e,"home")}>
            <span className="nav-logo-z">Z+</span>
            <div className="nav-logo-text">
              <span className="nav-logo-main">SECURITY</span>
              <span className="nav-logo-sub">// MANPOWER SOLUTIONS</span>
            </div>
          </a>
          <ul className="nav-links">
            {navLinks.map(([id,label]) => (
              <li key={id}><a href={`#${id}`} onClick={e => handleNav(e,id)}>{label}</a></li>
            ))}
          </ul>
          <a href="#contact" className="btn-primary nav-cta" onClick={e => handleNav(e,"contact")} style={{ padding:"10px 24px", fontSize:"12px" }}>
            <span>REQUEST DEPLOYMENT</span>
          </a>
          <button className="hamburger" onClick={() => setMenuOpen(o => !o)}>
            <span/><span/><span/>
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        <ul className="mobile-nav-links">
          {navLinks.map(([id,label]) => (
            <li key={id}><a href={`#${id}`} onClick={e => handleNav(e,id)}>{label}</a></li>
          ))}
        </ul>
      </div>

      {/* HERO */}
      <section id="home" className="hero noise">
        <div className="hero-grid"/>
        <div className="hero-scanline"/>
        <div className="hero-watermark">Z+</div>
        <div className="hero-content">
          <div className="hero-status" style={{ animation:"fadeIn 0.8s 0.1s both" }}>
            <span className="status-dot"/>
            <span className="hero-tag">// ACTIVE OPERATIONS — ALL UNITS DEPLOYED</span>
          </div>
          <div className="hero-title" style={{ animation:"fadeUp 0.8s 0.2s both" }}>
            <span className="line1">ELITE</span>
            <span className="line2">SECURITY</span>
            <span className="line3">SOLUTIONS</span>
          </div>
          <p className="hero-sub" style={{ animation:"fadeUp 0.8s 0.5s both" }}>
            <Typewriter text="Professional Manpower. Uncompromising Protection. 24/7 Command." />
          </p>
          <div className="hero-buttons" style={{ animation:"fadeUp 0.8s 0.8s both" }}>
            <a href="#services" className="btn-primary" onClick={e => handleNav(e,"services")}><span>VIEW SERVICES</span></a>
            <a href="#contact"  className="btn-outline"  onClick={e => handleNav(e,"contact")}>DEPLOY NOW</a>
          </div>
        </div>
        <div className="hero-bottom">
          <span className="scroll-label">SCROLL DOWN</span>
          <div className="scroll-arrow"/>
        </div>
      </section>

      {/* TICKER */}
      <div className="ticker">
        <div className="ticker-inner">
          {[0,1].map(i => (
            <div key={i} style={{ display:"flex" }}>
              {["ARMED GUARDS","EVENT SECURITY","CORPORATE PROTECTION","INDUSTRIAL SECURITY","EXECUTIVE DETAIL","VIP PROTECTION","CROWD CONTROL","SITE SECURITY"].map((item,j) => (
                <span key={j} className="ticker-item"><span>■</span>{item}</span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* STATS */}
      <section ref={statsRef} className="stats-bar">
        <div className="stats-grid">
          <StatItem number={500} suffix="+" label="GUARDS DEPLOYED"    inView={statsInView} />
          <StatItem number={200} suffix="+" label="CLIENTS PROTECTED"  inView={statsInView} />
          <StatItem number={10}  suffix="+" label="YEARS IN SERVICE"   inView={statsInView} />
          <StatItem number="24/7"           label="OPERATIONAL COMMAND" inView={statsInView} />
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="services-section">
        <div style={{ maxWidth:1280, margin:"0 auto" }}>
          <span className="section-label">// 04 OPERATIONAL UNITS</span>
          <h2 className="section-heading">Our Services</h2>
          <p style={{ color:"var(--steel)", fontSize:15, maxWidth:540, lineHeight:1.8 }}>
            Z+ Security deploys trained, certified manpower across a full spectrum of security operations — from guarding corporate assets to protecting VIPs.
          </p>
        </div>
        <div ref={servicesRef} className="services-grid">
          {services.map((s, i) => (
            <div key={i} className="bracket-card" style={{ animation: servicesInView ? `fadeUp 0.6s ${i*0.1}s both` : "none" }}>
              <span className="service-card-num">{s.num}</span>
              <div className="service-card-icon"><Icon name={s.icon} size={36} /></div>
              <div className="service-card-title">{s.title}</div>
              <p className="service-card-desc">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" ref={aboutRef} className="about-section">
        <div className="about-inner">
          <div style={{ animation: aboutInView ? "fadeUp 0.7s both" : "none" }}>
            <span className="section-label">// MISSION BRIEFING</span>
            <h2 className="section-heading">Who We Are</h2>
            <p style={{ color:"var(--steel)", fontSize:15, lineHeight:1.9, marginBottom:24 }}>
              Z+ Security is a premier manpower and security services company with over a decade of operational excellence. We deploy trained, background-verified security professionals across India — from corporate campuses to industrial sites, events to executive details.
            </p>
            <p style={{ color:"var(--steel)", fontSize:15, lineHeight:1.9, marginBottom:32 }}>
              Our command-and-control approach ensures every deployment is executed with military precision. We don't just guard — we protect, monitor, and respond.
            </p>
            {[
              "All personnel are PSARA-certified and background verified",
              "Rapid response teams available 24/7 across all deployment zones",
              "Customized security blueprints for every client engagement",
              "Real-time incident reporting through our operations center",
            ].map((item, i) => (
              <div key={i} className="about-check">
                <span className="about-check-icon"><Icon name="check" size={16} /></span>
                <span className="about-check-text">{item}</span>
              </div>
            ))}
            <div style={{ marginTop:32 }}>
              <a href="#contact" className="btn-primary" onClick={e => handleNav(e,"contact")}><span>GET IN TOUCH</span></a>
            </div>
          </div>
          <div className="about-visual" style={{ animation: aboutInView ? "fadeIn 1s 0.3s both" : "none" }}>
            <div className="shield-outer">
              <svg viewBox="0 0 280 320" className="shield-svg" fill="none">
                <path d="M140 10 L260 55 L260 160 Q260 255 140 305 Q20 255 20 160 L20 55 Z"
                  fill="#1E2020" stroke="#4A5240" strokeWidth="2"/>
                <path d="M140 28 L245 68 L245 162 Q245 245 140 288 Q35 245 35 162 L35 68 Z"
                  fill="none" stroke="#3A4235" strokeWidth="1"/>
                <text x="140" y="158" textAnchor="middle" fontFamily="Oswald,sans-serif"
                  fontSize="68" fontWeight="700" fill="#C8A84B" dominantBaseline="middle">Z+</text>
                <text x="140" y="210" textAnchor="middle" fontFamily="monospace"
                  fontSize="11" fill="#7A8E96" letterSpacing="4">SECURITY</text>
                <line x1="50" y1="82" x2="230" y2="82" stroke="#2E3328" strokeWidth="1"/>
                <circle cx="140" cy="60" r="4" fill="none" stroke="#C8A84B" strokeWidth="1"/>
                <circle cx="140" cy="60" r="10" fill="none" stroke="#4A5240" strokeWidth="1"/>
                <text x="32" y="44"  fontFamily="monospace" fontSize="14" fill="#4A5240">&#x250C;</text>
                <text x="250" y="44" fontFamily="monospace" fontSize="14" fill="#4A5240">&#x2510;</text>
              </svg>
              <div style={{
                position:"absolute", inset:0,
                backgroundImage:"linear-gradient(rgba(74,82,64,0.07) 1px,transparent 1px),linear-gradient(90deg,rgba(74,82,64,0.07) 1px,transparent 1px)",
                backgroundSize:"24px 24px", pointerEvents:"none"
              }}/>
            </div>
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section id="whyus" ref={whyRef} className="whyus-section">
        <div style={{ maxWidth:1280, margin:"0 auto" }}>
          <span className="section-label">// OPERATIONAL ADVANTAGES</span>
          <h2 className="section-heading">Why Choose Z+</h2>
        </div>
        <div className="whyus-grid">
          {whyUs.map((w, i) => (
            <div key={i} className="whyus-card" style={{ animation: whyInView ? `fadeUp 0.6s ${i*0.15}s both` : "none" }}>
              <div className="whyus-num">{w.num}</div>
              <div style={{ marginBottom:10, color:"var(--khaki)", marginTop:-8 }}><Icon name={w.icon} size={28} /></div>
              <div className="whyus-title">{w.title}</div>
              <p className="whyus-desc">{w.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section ref={testiRef} className="testimonials-section">
        <div style={{ maxWidth:1280, margin:"0 auto" }}>
          <span className="section-label">// FIELD REPORTS</span>
          <h2 className="section-heading">Client Testimonials</h2>
        </div>
        <div className="testimonials-grid">
          {testimonials.map((t, i) => (
            <div key={i} className="testi-card" style={{ animation: testiInView ? `fadeUp 0.6s ${i*0.15}s both` : "none" }}>
              <div className="testi-quote">"</div>
              <div className="testi-stars">{"★".repeat(t.stars)}</div>
              <p className="testi-text">{t.text}</p>
              <div className="testi-name">{t.name}</div>
              <div className="testi-company">{t.company}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" ref={contactRef} className="contact-section">
        <div style={{ maxWidth:1280, margin:"0 auto" }}>
          <span className="section-label">// REQUEST DEPLOYMENT</span>
          <h2 className="section-heading">Contact Us</h2>
        </div>
        <div className="contact-inner">
          <div style={{ animation: contactInView ? "fadeUp 0.7s both" : "none" }}>
            <form onSubmit={handleSubmit}>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input className="form-input" type="text" required placeholder="Your full name"
                    value={formData.name} onChange={e => setFormData(p => ({...p, name: e.target.value}))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input className="form-input" type="tel" required placeholder="+91 00000 00000"
                    value={formData.phone} onChange={e => setFormData(p => ({...p, phone: e.target.value}))} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input className="form-input" type="email" required placeholder="your@email.com"
                  value={formData.email} onChange={e => setFormData(p => ({...p, email: e.target.value}))} />
              </div>
              <div className="form-group">
                <label className="form-label">Service Required</label>
                <select className="form-select" required
                  value={formData.service} onChange={e => setFormData(p => ({...p, service: e.target.value}))}>
                  <option value="">-- SELECT SERVICE --</option>
                  <option>Armed Guard Services</option>
                  <option>Unarmed Security Personnel</option>
                  <option>Event & Crowd Control</option>
                  <option>Corporate Security</option>
                  <option>Industrial & Site Security</option>
                  <option>Executive Protection</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Message / Requirements</label>
                <textarea className="form-textarea" placeholder="Describe your security requirements..."
                  value={formData.message} onChange={e => setFormData(p => ({...p, message: e.target.value}))} />
              </div>
              <button type="submit" className="btn-primary" style={{ width:"100%" }}>
                <span>SUBMIT REQUEST</span>
              </button>
              {formSent && (
                <div className="form-success">
                  ✓ REQUEST RECEIVED — Our team will contact you within 24 hours.
                </div>
              )}
            </form>
          </div>

          <div style={{ animation: contactInView ? "fadeUp 0.7s 0.2s both" : "none" }}>
            {[
              { icon:"map",   label:"HEADQUARTERS",   value:"123 Command Lane, Sector 5\nNew Delhi — 110001, India" },
              { icon:"phone", label:"COMMAND LINE",   value:"+91 98765 43210\n+91 11 2345 6789" },
              { icon:"mail",  label:"EMAIL",          value:"ops@zplussecurity.in\ninfo@zplussecurity.in" },
            ].map((item, i) => (
              <div key={i} className="contact-info-item">
                <div className="contact-info-icon"><Icon name={item.icon} size={18} /></div>
                <div>
                  <div className="contact-info-label">{item.label}</div>
                  <div className="contact-info-value">{item.value.split("\n").map((l,j) => <span key={j}>{l}{j===0&&<br/>}</span>)}</div>
                </div>
              </div>
            ))}
            <div className="ops-hours">
              <div className="ops-hours-title">⬡ OPERATIONAL HOURS</div>
              <div className="ops-hours-text">
                MONDAY — SUNDAY<br/>
                24 HOURS / 7 DAYS / 365 DAYS<br/><br/>
                // EMERGENCY RESPONSE: IMMEDIATE<br/>
                // DEPLOYMENT QUERY: 09:00 — 18:00 IST
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-inner">
          <div className="footer-top">
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
                <span style={{ fontFamily:"Oswald,sans-serif", fontSize:28, fontWeight:700, color:"var(--khaki)" }}>Z+</span>
                <div>
                  <div style={{ fontFamily:"Oswald,sans-serif", fontSize:16, color:"var(--off-white)", letterSpacing:3 }}>SECURITY</div>
                  <div style={{ fontFamily:"monospace", fontSize:9, color:"var(--steel)", letterSpacing:2 }}>// MANPOWER SOLUTIONS</div>
                </div>
              </div>
              <p className="footer-brand-desc">
                Z+ Security provides professional manpower and security solutions across India. Trained. Certified. Always Deployed.
              </p>
            </div>
            <div>
              <div className="footer-heading">Quick Links</div>
              <ul className="footer-links">
                {navLinks.map(([id,label]) => (
                  <li key={id}><a href={`#${id}`} onClick={e => handleNav(e,id)}>{label}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <div className="footer-heading">Services</div>
              <ul className="footer-links">
                {["Armed Guards","Unarmed Personnel","Event Security","Corporate Security","Industrial Security","Executive Protection"].map(s => (
                  <li key={s}><a href="#services" onClick={e => handleNav(e,"services")}>{s}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <div className="footer-heading">Contact</div>
              <ul className="footer-links">
                <li><a href="tel:+919876543210">+91 98765 43210</a></li>
                <li><a href="mailto:ops@zplussecurity.in">ops@zplussecurity.in</a></li>
                <li><a href="#contact" onClick={e => handleNav(e,"contact")}>New Delhi, India</a></li>
              </ul>
              <div style={{ marginTop:20 }}>
                <div className="footer-heading" style={{ marginBottom:12 }}>Follow Us</div>
                <div className="social-links">
                  {["linkedin","facebook","instagram","whatsapp"].map(s => (
                    <a key={s} href="#" className="social-link"><Icon name={s} size={15} /></a>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <span className="footer-copy">© 2025 Z+ SECURITY. ALL RIGHTS RESERVED. // PSARA LICENSED</span>
            <span className="footer-copy" style={{ color:"var(--olive)" }}>PROTECTING INDIA. 24/7.</span>
          </div>
        </div>
      </footer>
    </>
  );
}
