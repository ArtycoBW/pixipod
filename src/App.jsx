import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import LiquidReveal from './LiquidReveal.jsx';

gsap.registerPlugin(ScrollTrigger);

const projects = [
  { title: 'GrooMyCRM', category: 'Система / Груминг', year: '2026', description: 'Сайт, онлайн-запись и управление груминг-салоном в одном дружелюбном продукте.', image: '/cases/groomy.png', video: '/cases/groomy-loop.mp4', url: 'https://groomycrm.ru', tags: ['Арт-дирекшн', 'Интерфейсы', 'Разработка'] },
  { title: 'TrimmyCRM', category: 'Система / Салоны', year: '2026', description: 'Иммерсивный запуск системы для салонов через пространство, свет и движение.', image: '/cases/trimmy.png', video: '/cases/trimmy-loop.mp4', url: 'https://trimmycrm.ru', tags: ['Объёмный концепт', 'Анимация', 'Разработка'] },
  { title: '24Uptime', category: 'Сервис / Мониторинг', year: '2026', description: 'Продуктовый сайт для мониторинга сайтов, программных интерфейсов и инфраструктуры.', image: '/cases/uptime.png', video: '/cases/uptime-loop.mp4', url: 'https://24uptime.ru', tags: ['Продуктовый дизайн', 'Система', 'Анимация'] },
  { title: 'Bankrot.AI', category: 'ИИ / Право', year: '2026', description: 'Правовая аналитика для сложных банкротных споров и больших массивов практики.', image: '/cases/bankrot.png', video: '/cases/bankrot-loop.mp4', url: 'https://банкрот-ии.рф', tags: ['Стратегия', 'Интерфейсы', 'Разработка'] },
  { title: 'Lex-Doc Sorter', category: 'ИИ / Документы', year: '2026', description: 'Сервис на основе ИИ превращает сотни файлов и сканов в готовый пакет документов.', image: '/cases/lexsorter.png', video: '/cases/lexsorter-loop.mp4', url: 'https://lex-sorter.ru', tags: ['Продукт', 'Интерфейс', 'Разработка'], wide: true },
];

const services = [
  ['01', 'Дизайн и арт-дирекшн', 'Визуальная система, которая делает продукт узнаваемым с первого экрана.'],
  ['02', 'Разработка интерфейсов', 'Быстрые адаптивные интерфейсы с чистой архитектурой и точной вёрсткой.'],
  ['03', 'Анимация и объём', 'Движение и глубина, которые объясняют продукт, а не отвлекают от него.'],
  ['04', 'Продуктовая стратегия', 'Структура, сценарии и приоритеты до того, как начинается рисование экранов.'],
];

const carouselItems = [
  { caption: 'Интерфейсы', title: 'Ведут к действию.' },
  { caption: 'Разработка', title: 'Работает быстро.' },
  { caption: 'Система движения', title: 'Подчёркивает смысл.' },
];

function Logo({ light = false }) {
  return <span className={`brand-lockup ${light ? 'is-light' : ''}`}><span className="logo-crop" aria-hidden="true"><img src="/pixipod-logo.jpg" alt="" /></span><span>PixiPod</span></span>;
}

function Arrow({ up = false }) { return <span className="arrow" aria-hidden="true">{up ? '↗' : '→'}</span>; }

function Eyebrow({ children, light = false }) { return <p className={`eyebrow ${light ? 'eyebrow-light' : ''}`}><span />{children}</p>; }

function PillButton({ children, variant = 'dark', up = false, onClick, href, type = 'button', disabled = false }) {
  const className = `pill pill-${variant}`;
  const content = <><span>{children}</span><span className="pill-arrow"><Arrow up={up} /></span></>;
  if (href) return <a className={className} href={href}>{content}</a>;
  return <button className={className} type={type} onClick={onClick} disabled={disabled}>{content}</button>;
}

function PageLoader({ onDone }) {
  const [progress, setProgress] = useState(0);
  const [leaving, setLeaving] = useState(false);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setProgress(100);
      setLeaving(true);
      const reducedTimer = window.setTimeout(onDone, 20);
      return () => window.clearTimeout(reducedTimer);
    }
    const duration = 1650;
    let frame = 0;
    let leaveTimer = 0;
    const start = performance.now();
    const ease = (value) => (value < 0.5 ? 4 * value ** 3 : 1 - ((-2 * value + 2) ** 3) / 2);
    const tick = (time) => {
      const raw = Math.min((time - start) / duration, 1);
      setProgress(Math.round(ease(raw) * 100));
      if (raw < 1) frame = requestAnimationFrame(tick);
      else { setLeaving(true); leaveTimer = window.setTimeout(onDone, 900); }
    };
    frame = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(frame); clearTimeout(leaveTimer); };
  }, [onDone]);
  return <div className={`page-loader ${leaving ? 'is-leaving' : ''}`} aria-label="Загрузка сайта">
    <div className="loader-top"><Logo light /><span>Цифровая студия · 2026</span></div>
    <div className="loader-stage">
      <div className="loader-visual" aria-hidden="true">
        <span className="loader-panel is-left" />
        <span className="loader-panel is-right" />
        <span className="loader-axis" />
        <img src="/hero/robot-reveal.png" alt="" />
        <b>p.</b>
        <i style={{ '--load': `${progress}%` }} />
        <small>СБОРКА / {String(progress).padStart(3, '0')}</small>
      </div>
      <p><span>Собираем цифровую среду</span><em>Стратегия · Дизайн · Код · Движение</em></p>
    </div>
    <div className="loader-word" aria-hidden="true"><span>PIXI</span><span>POD</span></div>
    <div className="loader-progress"><div><span style={{ width: `${progress}%` }} /></div><p><span>Система запускается</span><strong>{String(progress).padStart(3, '0')}</strong></p></div>
  </div>;
}

function LiveClock({ light = false }) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => { const timer = window.setInterval(() => setNow(new Date()), 1000); return () => clearInterval(timer); }, []);
  const time = now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  const date = now.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
  return <span className={`live-clock ${light ? 'is-light' : ''}`}><em>Локальное время</em><b>{time}</b><i>•</i><span>{date}</span></span>;
}

function Header({ ready, onMenu, onContact, scrollToId, inactive }) {
  return <header className={`studio-header ${ready ? 'is-ready' : ''}`} inert={inactive ? '' : undefined} aria-hidden={inactive || undefined}><div className="shell header-inner"><button className="brand-button" type="button" onClick={() => scrollToId('home')} aria-label="PixiPod — на главную"><Logo /></button><nav className="header-nav" aria-label="Основная навигация"><button type="button" onClick={() => scrollToId('home')}>Главная</button><button type="button" onClick={() => scrollToId('works')}>Проекты</button><button type="button" onClick={() => scrollToId('services')}>Услуги</button><button type="button" onClick={() => scrollToId('about')}>Студия</button><button type="button" onClick={onContact}>Контакты</button></nav><div className="header-actions"><button className="menu-button" type="button" onClick={onMenu} aria-label="Открыть меню"><span>☰</span><b>Меню</b></button></div></div></header>;
}

function HeroCard() {
  const [active, setActive] = useState(0);
  const [phase, setPhase] = useState('idle');
  const [direction, setDirection] = useState(1);
  const timersRef = useRef([]);
  const change = useCallback((step) => {
    if (phase !== 'idle') return;
    setDirection(step);
    setPhase('out');
    timersRef.current.push(window.setTimeout(() => {
      setActive((value) => (value + step + carouselItems.length) % carouselItems.length);
      setPhase('in');
    }, 190));
    timersRef.current.push(window.setTimeout(() => setPhase('idle'), 620));
  }, [phase]);
  useEffect(() => () => timersRef.current.forEach(window.clearTimeout), []);
  const item = carouselItems[active];
  return <div className={`hero-card intro-card is-${phase} direction-${direction > 0 ? 'next' : 'prev'}`}><div className="hero-card-main"><span className="hero-card-symbol" aria-hidden="true"><small>0{active + 1}</small><span>p.</span></span><span className="hero-card-copy"><span className="carousel-copy" key={active}><em>{item.caption}</em><b>{item.title}</b></span><span className="carousel-controls"><span className="carousel-dots" aria-hidden="true">{carouselItems.map((entry, index) => <i className={index === active ? 'active' : ''} key={entry.caption} />)}</span><span className="carousel-buttons"><button type="button" aria-label="Предыдущая компетенция" onClick={() => change(-1)}>←</button><button type="button" aria-label="Следующая компетенция" onClick={() => change(1)}>→</button></span></span></span></div><span className="hero-card-sweep" aria-hidden="true" /></div>;
}

function PortfolioVideo({ project }) {
  const videoRef = useRef(null);
  useEffect(() => {
    const video = videoRef.current;
    if (!video || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) video.play().catch(() => {});
      else video.pause();
    }, { threshold: 0.12 });
    observer.observe(video);
    return () => observer.disconnect();
  }, []);
  return <div className="project-media"><video ref={videoRef} muted loop playsInline preload="metadata" poster={project.image} aria-label={`Видео-превью проекта ${project.title}`}><source src={project.video} type="video/mp4" /></video></div>;
}

function PortfolioCard({ project }) {
  return <li className={`project-item ${project.wide ? 'is-wide' : ''}`} data-reveal><a href={project.url} target="_blank" rel="noreferrer" className="project-link" aria-label={`Открыть проект ${project.title}`}><article><PortfolioVideo project={project} /><span className="project-shade" /><div className="project-meta"><span>{project.category} — {project.year}</span><span className="project-live"><i /> живой просмотр</span><span className="project-arrow">↗</span></div><div className="project-bottom"><h3>{project.title}</h3><p>{project.description}</p><ul>{project.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul></div></article></a></li>;
}

function NavMenu({ open, onClose, onContact, scrollToId }) {
  const links = [['01', 'Главная', 'home'], ['02', 'Проекты', 'works'], ['03', 'Услуги', 'services'], ['04', 'Студия', 'about']];
  return <div className={`nav-overlay ${open ? 'is-open' : ''}`} aria-hidden={!open} role={open ? 'dialog' : undefined} aria-modal={open || undefined} aria-label={open ? 'Меню сайта' : undefined}><div className="shell nav-top"><Logo light /><button type="button" onClick={onClose} tabIndex={open ? 0 : -1}>×&nbsp; Закрыть</button></div><nav className="shell overlay-nav" aria-label="Полноэкранная навигация">{links.map(([number, label, id], index) => <button type="button" key={id} tabIndex={open ? 0 : -1} style={{ '--delay': `${index * 45 + 80}ms` }} onClick={() => { onClose(); window.setTimeout(() => scrollToId(id), 80); }}><span>{number}</span><b>{label}</b></button>)}<button type="button" tabIndex={open ? 0 : -1} style={{ '--delay': '260ms' }} onClick={() => { onClose(); onContact(); }}><span>05</span><b>Контакты</b></button></nav><div className="shell nav-bottom"><LiveClock light /><button type="button" onClick={() => { onClose(); onContact(); }} tabIndex={open ? 0 : -1}>Начать проект →</button></div></div>;
}

function BriefModal({ open, onClose }) {
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const nameRef = useRef(null);
  useEffect(() => { if (open) window.setTimeout(() => nameRef.current?.focus(), 80); else { setSubmitting(false); setSent(false); setError(''); } }, [open]);
  if (!open) return null;
  const submit = async (event) => {
    event.preventDefault(); setSubmitting(true); setError('');
    const data = new FormData(event.currentTarget);
    try {
      const response = await fetch('/api/leads', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: data.get('name'), contact: data.get('contact'), project: data.get('project'), website: data.get('website') }) });
      if (!response.ok) throw new Error('request failed');
      setSent(true);
    } catch {
      setError('Не удалось отправить заявку. Проверьте соединение и попробуйте ещё раз.');
    } finally { setSubmitting(false); }
  };
  return <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="brief-title" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><div className="brief-modal"><button className="modal-close" type="button" onClick={onClose} aria-label="Закрыть">×</button>{!sent ? <><div className="modal-heading"><Eyebrow>Начать проект</Eyebrow><h2 id="brief-title">Расскажите, что хотите запустить.</h2></div><form onSubmit={submit}><label>Имя<input ref={nameRef} name="name" required maxLength="80" placeholder="Как к вам обращаться" /></label><label>Контакт<input name="contact" required maxLength="160" placeholder="Почта или мессенджер" /></label><label>Проект<textarea name="project" required maxLength="3000" rows="4" placeholder="Задача, сроки и ориентир по бюджету" /></label><label className="form-trap" aria-hidden="true">Сайт<input name="website" tabIndex="-1" autoComplete="off" /></label>{error && <p className="form-error" role="alert">{error}</p>}<div className="modal-submit"><p>Заявка сразу придёт команде PixiPod на почту.</p><PillButton type="submit" up disabled={submitting}>{submitting ? 'Отправляем…' : 'Отправить заявку'}</PillButton></div></form></> : <div className="brief-success"><span className="success-mark">✓</span><h2 id="brief-title">Заявка отправлена</h2><p>Спасибо! Команда PixiPod получила бриф и свяжется с вами по указанному контакту.</p><div><PillButton onClick={onClose}>Готово</PillButton></div></div>}</div></div>;
}

export default function App() {
  const rootRef = useRef(null);
  const lenisRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const finishLoader = useCallback(() => setReady(true), []);
  const reducedMotion = useMemo(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches, []);

  const scrollToId = useCallback((id) => {
    const target = document.getElementById(id);
    if (!target) return;
    if (lenisRef.current) lenisRef.current.scrollTo(target, { duration: 1.1, offset: 0 });
    else target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
  }, [reducedMotion]);
  const openContact = useCallback(() => { setMenuOpen(false); setModalOpen(true); }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (reducedMotion) return undefined;
    const lenis = new Lenis({ duration: 1.06, smoothWheel: true, wheelMultiplier: 0.92 });
    lenisRef.current = lenis; lenis.on('scroll', ScrollTrigger.update);
    const ticker = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(ticker); gsap.ticker.lagSmoothing(0);
    return () => { gsap.ticker.remove(ticker); lenis.destroy(); lenisRef.current = null; };
  }, [reducedMotion]);

  useEffect(() => {
    const locked = !ready || menuOpen || modalOpen;
    document.documentElement.classList.toggle('scroll-locked', locked);
    if (locked) lenisRef.current?.stop(); else lenisRef.current?.start();
    return () => document.documentElement.classList.remove('scroll-locked');
  }, [ready, menuOpen, modalOpen]);

  useEffect(() => {
    const handleEscape = (event) => { if (event.key === 'Escape') { setMenuOpen(false); setModalOpen(false); } };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  useEffect(() => {
    if (!ready || reducedMotion) return undefined;
    const context = gsap.context(() => {
      gsap.timeline({ defaults: { ease: 'power3.out' } })
        .from('.studio-header', { y: -14, opacity: 0, duration: 0.72 })
        .from('.hero-eyebrow', { y: 10, opacity: 0, duration: 0.55 }, 0.05)
        .from('.hero-line-inner', { yPercent: 110, opacity: 0, duration: 0.9, stagger: 0.12 }, 0.1)
        .from('.intro-card', { y: 16, scale: 0.96, opacity: 0, duration: 0.8 }, 0.22)
        .from('.hero-capabilities', { y: 14, opacity: 0, duration: 0.7 }, 0.34)
        .from('.hero-rating', { y: 10, opacity: 0, duration: 0.6 }, 0.42)
        .from('.hero-ctas', { y: 10, opacity: 0, duration: 0.6 }, 0.5)
        .from('.hero-status', { opacity: 0, duration: 0.6 }, 0.64)
        .from('.hero-watermark', { y: 20, opacity: 0, duration: 0.9 }, 0.14);

      gsap.utils.toArray('[data-reveal]').forEach((element) => gsap.from(element, { y: 42, opacity: 0, duration: 0.82, ease: 'power3.out', scrollTrigger: { trigger: element, start: 'top 88%', once: true } }));
      const aboutWordsElements = gsap.utils.toArray('.word-reveal .word');
      gsap.set(aboutWordsElements, { y: 26, opacity: 0.1 });
      gsap.timeline({ scrollTrigger: { trigger: '.word-reveal', start: 'top 90%', end: 'bottom -45%', scrub: 1.45 } })
        .to(aboutWordsElements, { y: 0, opacity: 1, duration: 1.35, stagger: 0.075, ease: 'power2.out' })
        .to(aboutWordsElements, { y: -12, opacity: 0.16, duration: 1.1, stagger: 0.045, ease: 'power2.inOut' }, '+=0.65');
      gsap.utils.toArray('.stat-number').forEach((element) => {
        const target = Number(element.dataset.target || 0); const suffix = element.dataset.suffix || '';
        ScrollTrigger.create({ trigger: element, start: 'top bottom', end: 'center center', scrub: true, onUpdate: (self) => { element.textContent = `${Math.round(self.progress * target)}${suffix}`; } });
      });
      gsap.utils.toArray('.project-media').forEach((media) => gsap.fromTo(media, { yPercent: -2.5 }, { yPercent: 2.5, ease: 'none', scrollTrigger: { trigger: media.closest('.project-link'), start: 'top bottom', end: 'bottom top', scrub: 0.6 } }));
    }, rootRef);
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    return () => context.revert();
  }, [ready, reducedMotion]);

  const aboutWords = 'Мы соединяем стратегию, визуальный язык и разработку, чтобы сложный продукт ощущался простым, цельным и готовым к росту.'.split(' ');

  return <div ref={rootRef} className={`site ${ready ? 'is-ready' : ''}`}>
    {!ready && <PageLoader onDone={finishLoader} />}
    <a className="skip-link" href="#main">Перейти к содержанию</a>
    <Header ready={ready} onMenu={() => setMenuOpen(true)} onContact={openContact} scrollToId={scrollToId} inactive={menuOpen || modalOpen} />

    <main id="main" inert={menuOpen || modalOpen ? '' : undefined} aria-hidden={menuOpen || modalOpen || undefined}>
      <section className="hero" id="home">
        <LiquidReveal /><div className="hero-vignette" aria-hidden="true" /><div className="hero-watermark" aria-hidden="true">PIXIPOD</div>
        <div className="shell hero-layout"><div className="hero-left"><Eyebrow><span className="hero-eyebrow">Независимая цифровая студия</span></Eyebrow><h1 aria-label="Смелые идеи, собранные с точностью.">{['Смелые идеи,', 'собранные', 'с точностью.'].map((line) => <span className="hero-line" aria-hidden="true" key={line}><span className="hero-line-inner">{line}</span></span>)}</h1><div className="hero-rating"><span className="stars" aria-hidden="true">{Array.from({ length: 5 }, (_, index) => <i key={index} style={{ '--star-index': index }}>✦</i>)}</span><p>Продукты уже работают в сети</p></div><div className="hero-ctas"><PillButton onClick={openContact} up>Обсудить проект</PillButton><PillButton variant="outline" onClick={() => scrollToId('works')}>Смотреть работы</PillButton></div></div><div className="hero-right"><HeroCard /><div className="hero-capabilities"><p><span>Одна команда</span><b>От идеи до запуска</b></p><ul>{['Стратегия', 'Интерфейсы', 'Код', 'Анимация', 'Объём', 'Запуск'].map((item) => <li key={item}><span>●</span>{item}</li>)}</ul></div></div></div>
        <div className="shell hero-status"><span>Дизайн + разработка</span><span>Работаем удалённо</span><span>Листайте дальше ↓</span></div>
      </section>

      <section className="about" id="about"><div className="shell about-grid"><div className="about-symbol" data-reveal><div className="studio-signal" aria-hidden="true"><span>01 / 04</span><div><span className="logo-crop"><img src="/pixipod-logo.jpg" alt="" /></span><b>PixiPod</b></div><i>ДИЗАЙН · КОД · ДВИЖЕНИЕ</i></div><Eyebrow>Студия</Eyebrow><p>Одна команда ведёт проект через стратегию, дизайн, анимацию и разработку.</p></div><div className="about-copy"><h2 className="word-reveal" aria-label={aboutWords.join(' ')}>{aboutWords.map((word, index) => <span className={`word ${index > 7 ? 'muted' : ''}`} aria-hidden="true" key={`${word}-${index}`}>{word}&nbsp;</span>)}</h2><div className="about-footer" data-reveal><div><span>Наш принцип</span><p>Сначала смысл. Затем форма. После — безупречная реализация.</p></div><PillButton variant="outline" onClick={() => scrollToId('services')}>Как мы работаем</PillButton></div></div></div></section>

      <section className="create-band" id="process" aria-label="Думаем, создаём и запускаем"><ul className="shell"><li className="tile-light" data-reveal><span>Думаем</span></li><li className="tile-accent" data-reveal><span>Создаём</span></li><li className="tile-dark" data-reveal aria-hidden="true"><span>→</span></li><li className="tile-ghost" data-reveal><span>Запускаем</span></li></ul></section>

      <section className="portfolio" id="works"><div className="shell"><div className="portfolio-heading" data-reveal><span className="portfolio-pill">Портфолио</span><h2>Избранные работы</h2><p>Самостоятельные цифровые продукты. Один подход: идея должна работать не хуже интерфейса.</p></div><ul className="project-grid">{projects.map((project) => <PortfolioCard project={project} key={project.title} />)}</ul></div></section>

      <section className="services" id="services"><div className="shell"><div className="services-heading" data-reveal><Eyebrow>Услуги</Eyebrow><h2>Что мы делаем лучше всего</h2></div><ul className="service-list">{services.map(([number, title, text]) => <li data-reveal key={number}><button type="button" onClick={openContact}><span>{number}</span><h3>{title}</h3><p>{text}</p><b>↗</b></button></li>)}</ul></div></section>

      <section className="stats"><div className="shell"><div className="stats-panel" data-reveal><Eyebrow light>В цифрах</Eyebrow><h2>Доказательство — в работающих проектах.</h2><ul><li><strong className="stat-number" data-target="24" data-suffix="/7">0/7</strong><span>цифровые продукты остаются на связи</span></li><li><strong className="stat-number" data-target="4">0</strong><span>ключевых этапа</span></li><li><strong className="stat-number" data-target="1">0</strong><span>команда от идеи до запуска</span></li><li><strong className="stat-number" data-target="360" data-suffix="°">0°</strong><span>взгляд на цифровой продукт</span></li></ul></div></div></section>
    </main>

    <footer className="footer" inert={menuOpen || modalOpen ? '' : undefined} aria-hidden={menuOpen || modalOpen || undefined}><div className="footer-watermark" aria-hidden="true">PIXIPOD</div><div className="shell footer-inner"><div className="footer-cta" data-reveal><h2>Есть идея?<br />Давайте превратим её <em>в продукт.</em></h2><PillButton variant="light" up onClick={openContact}>Начать проект</PillButton></div><div className="footer-columns"><div><Logo light /><p>Независимая студия, которая соединяет дизайн, разработку и движение.</p></div><div><span>Навигация</span><button onClick={() => scrollToId('about')}>Студия</button><button onClick={() => scrollToId('works')}>Проекты</button><button onClick={openContact}>Контакты</button></div><div><span>Услуги</span><button onClick={() => scrollToId('services')}>Дизайн</button><button onClick={() => scrollToId('services')}>Разработка</button><button onClick={() => scrollToId('services')}>Анимация</button></div><div><span>Проекты</span>{projects.slice(0, 3).map((project) => <a href={project.url} target="_blank" rel="noreferrer" key={project.title}>{project.title}</a>)}</div></div><div className="footer-legal"><span>© 2026 PixiPod. Все права защищены.</span><button type="button" onClick={() => scrollToId('home')}>Наверх ↑</button></div></div></footer>

    <NavMenu open={menuOpen} onClose={() => setMenuOpen(false)} onContact={openContact} scrollToId={scrollToId} />
    <BriefModal open={modalOpen} onClose={() => setModalOpen(false)} />
  </div>;
}
