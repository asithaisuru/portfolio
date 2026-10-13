'use client';

import dynamic from 'next/dynamic';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ArrowDown, ArrowRight, ArrowUp, ArrowUpRight, BriefcaseBusiness,
  ChevronLeft, ChevronRight, Code2, Download, ExternalLink,
  Github, GraduationCap, Linkedin, Mail, MapPin, Menu, MousePointer2, Phone,
  RefreshCw, Rocket, Satellite, Sparkles, Star, TerminalSquare, X,
} from 'lucide-react';
import { fetchPublicGithubProjects, GITHUB_PROFILE_URL, GITHUB_USERNAME, normalizeGithubProjects, projectTitle, type GithubProject, type ProjectsResponse } from '@/lib/github-projects';
import type { BrickInteraction, BrickOutfit, ContactInteraction } from './brick-world';
import { BrandMark } from './brand-mark';
import { StoryCharacter, type StoryChapter } from './story-character';
import journeyStyles from './journey.module.css';
import { CharacterPlatform } from './character-platform';

const GalaxyCanvas = dynamic(() => import('./brick-world').then((mod) => mod.GalaxyCanvas), { ssr: false });
const LandingCanvas = dynamic(() => import('./brick-world').then((mod) => mod.LandingCanvas), { ssr: false });
const ShipCanvas = dynamic(() => import('./brick-world').then((mod) => mod.ShipCanvas), { ssr: false });

const CONTACT_EMAIL = 'asithafree1@gmail.com';
const CV_URL = '/CV - Asitha Isuru - Software Engineer.pdf';

const chapters = [
  { id: 'about', title: 'Home', number: '00' },
  { id: 'education', title: 'Education', number: '01' },
  { id: 'experience', title: 'Journey', number: '02' },
  { id: 'skills', title: 'Toolbox', number: '03' },
  { id: 'mission', title: 'Projects', number: '04' },
  { id: 'contact', title: 'Contact', number: '05' },
] as const;

type ChapterId = (typeof chapters)[number]['id'];
type Phase = 'story' | 'launching' | 'space' | 'landing';
type ProjectSource = 'server' | 'public' | 'cached' | null;
const PROJECT_CACHE_KEY = 'asitha-github-public-repositories';

function scrollToChapter(chapter: ChapterId) {
  document.getElementById(chapter)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function ChapterAdvance({ active }: { active: ChapterId }) {
  const next = chapters[chapters.findIndex(({ id }) => id === active) + 1];
  if (!next) return null;

  return (
    <button
      type="button"
      onClick={() => scrollToChapter(next.id)}
      aria-label={`Next chapter: ${next.title}`}
      className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] right-4 z-30 inline-flex items-center gap-2 rounded-full border border-[#d8e1d9] bg-[#fffdf8]/95 px-4 py-2.5 text-sm font-extrabold text-[#243d61] shadow-[0_8px_32px_#1d34452a] backdrop-blur-xl transition-all hover:-translate-y-1 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#3760d2] sm:bottom-6 sm:right-8 sm:px-5 sm:py-3"
    >
      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#79908e]">Next</span>
      <span>{next.title}</span>
      <ArrowDown size={17} className="text-[#3e998c]" aria-hidden="true" />
    </button>
  );
}

function ChapterEyebrow({ number, children, light = false }: { number: string; children: React.ReactNode; light?: boolean }) {
  return (
    <div className={`inline-flex items-center gap-3 text-[11px] font-extrabold uppercase tracking-[0.24em] ${light ? 'text-[#d5e2ff]' : 'text-[#435e73]'}`}>
      <span className={`rounded-full px-3 py-1.5 tracking-normal ${light ? 'bg-white/15 text-white' : 'bg-[#e1e9e6] text-[#28425b]'}`}>{number}</span>
      {children}
    </div>
  );
}

/** The persistent story character visits these empty stage anchors. */
function ChapterCompanion({ outfit, interaction, line, hint = 'Explore the cards to interact ↗' }: { outfit: BrickOutfit; interaction: BrickInteraction; line: string; hint?: string }) {
  const chapter = outfit === 'graduate' ? 'education' : outfit === 'work' ? 'experience' : 'skills';
  return (
    <div className="chapter-companion relative mt-6 h-[230px] w-full overflow-hidden rounded-[30px] border border-white/70 bg-white/40 shadow-[0_16px_45px_#243d5520] sm:h-[255px]" style={{ isolation: 'auto' }}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_65%_80%,#d4e8e3_0%,transparent_52%)]" />
      <div data-story-character-anchor={chapter} data-character-outfit={outfit} data-character-interaction={interaction} className="chapter-companion-scene absolute bottom-0 right-[-16px] top-0 w-[70%]"><CharacterPlatform /></div>
      <div className="chapter-companion-bubble pointer-events-none absolute left-4 top-6 z-30 max-w-[52%] -rotate-3 rounded-2xl border-2 border-[#29475d] bg-[#fffdf8] px-3.5 py-3 text-sm font-black leading-snug text-[#29475d] shadow-[4px_5px_0_#29475d] sm:left-6 sm:px-4">
        {line}
      </div>
      <span className="chapter-companion-hint pointer-events-none absolute bottom-4 left-5 z-30 rounded-full bg-white/85 px-3 py-1.5 text-[10px] font-bold text-[#5c7b82]">{hint}</span>
    </div>
  );
}

function StoryNavigation({ active, isSpace }: { active: ChapterId; isSpace: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);

  if (isSpace) return null;

  return (
    <header className="story-nav fixed inset-x-0 top-0 z-40 px-4 pt-4 sm:px-8 sm:pt-6">
      <nav aria-label="Main navigation" className="mx-auto flex max-w-[1240px] items-center justify-between gap-2 rounded-full border border-[#dbe5dc] bg-[#fffdf8]/90 px-3 py-3 shadow-[0_8px_30px_#1730440f] backdrop-blur-2xl sm:gap-3 sm:px-5">
        <button onClick={() => scrollToChapter('about')} className="flex items-center gap-2 rounded-full text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#3760d2]" aria-label="Asitha Isuru, back to top">
          <BrandMark className="size-8 shrink-0 sm:size-10" />
          <span className="text-[11px] font-black tracking-tight text-[#1a304b] sm:text-sm">asitha<span className="text-[#3e998c]">isuru</span></span>
        </button>

        <div className="hidden items-center gap-0.5 lg:flex">
          {chapters.slice(0, 5).map((chapter) => (
            <button key={chapter.id} onClick={() => scrollToChapter(chapter.id)} className={`rounded-full px-4 py-2 text-[13px] font-bold transition-colors focus-visible:outline-2 focus-visible:outline-[#3760d2] ${active === chapter.id ? 'bg-[#e9eee5] text-[#1e3a52]' : 'text-[#6c7b84] hover:bg-[#f2f1e9] hover:text-[#1c334b]'}`}>
              {chapter.title}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <a href={CV_URL} download className="hidden items-center gap-2 rounded-full border border-[#dce3db] px-4 py-2.5 text-xs font-black text-[#2c4154] transition-colors hover:bg-[#edf2ec] sm:inline-flex"><Download size={15} /> My CV</a>
          <button onClick={() => scrollToChapter('contact')} className="inline-flex items-center gap-2 rounded-full bg-[#233c62] px-3 py-2.5 text-xs font-black text-white transition-transform hover:-translate-y-0.5 sm:px-5">Say hello <ArrowUpRight size={15} /></button>
          <button className="grid size-9 place-items-center rounded-full bg-[#e9ede8] text-[#243a55] sm:size-10 lg:hidden" aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>
            {menuOpen ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </nav>
      {menuOpen && (
        <div className="mx-auto mt-2 max-w-[1240px] overflow-hidden rounded-[24px] border border-[#e5e8df] bg-[#fffdf8] p-3 shadow-xl lg:hidden">
          {chapters.map((chapter) => (
            <button key={chapter.id} className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm font-bold text-[#263e59] hover:bg-[#edf2ec]" onClick={() => { setMenuOpen(false); scrollToChapter(chapter.id); }}>
              <span>{chapter.title}</span><span className="text-xs text-[#a2adae]">{chapter.number}</span>
            </button>
          ))}
        </div>
      )}
    </header>
  );
}

function Hero() {
  return (
    <section id="about" data-story-section="about" className="story-section hero-section relative flex min-h-[100svh] items-center overflow-hidden bg-[#f9f5e9] pb-20 pt-28 lg:h-[100dvh] lg:min-h-[580px] lg:pb-16 lg:pt-[clamp(92px,12dvh,116px)]">
      <div className="hero-grid pointer-events-none absolute inset-0 opacity-30" />
      <div className="absolute -left-40 top-[24%] size-[500px] rounded-full bg-[#ffdb9c]/40 blur-[100px]" />
      <div className="absolute -right-44 -top-40 size-[520px] rounded-full bg-[#d7ede6]/80 blur-[100px]" />

      <div className="relative mx-auto grid w-full max-w-[1240px] items-center gap-7 px-6 sm:px-10 lg:h-full lg:min-h-0 lg:grid-cols-[1.1fr_0.9fr] lg:gap-4">
        <div className="relative z-10 py-2 lg:py-0">
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#d9e3d9] bg-white/75 px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.13em] text-[#264f57] shadow-sm lg:mb-[clamp(10px,2dvh,20px)]"><span className="size-2 animate-pulse rounded-full bg-[#59b3a0]" /> Welcome to my little universe</span>
          <h1 className="max-w-[750px] text-[clamp(3.1rem,10vw,5.4rem)] font-black leading-[0.96] tracking-[-0.075em] text-[#1e344c] lg:text-[clamp(3.35rem,5vw,5.85rem)]">
            Hey, I&apos;m<br /><span className="relative z-10 text-[#e88864]">Asitha<span className="text-[#1f374f]">.</span></span><br />
            <span className="text-[#1e344c]">I make ideas</span><br /><span className="relative inline-block text-[#3e998c]">come alive<span className="absolute -bottom-2 left-1 right-0 h-2 rotate-[-2deg] rounded-full bg-[#f6bc67] sm:-bottom-3" /></span>
          </h1>
          <p className="mt-6 max-w-[520px] text-base leading-[1.65] text-[#596b79] sm:text-lg lg:mt-5 lg:text-[16px] lg:leading-[1.6]">Software developer, curious problem-solver, and big believer that technology should feel a little magical. Come explore the story behind my code.</p>

          <div className="mt-6 flex flex-wrap items-center gap-3 lg:mt-5">
            <button onClick={() => scrollToChapter('education')} className="group inline-flex items-center gap-3 rounded-full bg-[#243d61] px-6 py-3 text-sm font-black text-white shadow-[0_14px_30px_#23416228] transition-all hover:-translate-y-1 hover:bg-[#314f78]">Start the story <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" /></button>
            <button onClick={() => scrollToChapter('mission')} className="inline-flex items-center gap-2 rounded-full border border-[#d0dad1] bg-white/70 px-6 py-3 text-sm font-bold text-[#243d61] transition-colors hover:bg-white"><Rocket size={18} /> See my work</button>
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-3 text-xs font-bold text-[#75858b] lg:mt-6">
            <span className="mr-2 uppercase tracking-[0.14em]">Find me on</span>
            <a className="hero-social" href={`https://github.com/${GITHUB_USERNAME}`} target="_blank" rel="noopener noreferrer" aria-label="GitHub"><Github size={19} /></a>
            <a className="hero-social" href="https://www.linkedin.com/in/asithaisuru" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><Linkedin size={19} /></a>
            <a className="hero-social" href={`mailto:${CONTACT_EMAIL}`} aria-label="Email"><Mail size={19} /></a>
            <span className="ml-2 hidden items-center gap-1.5 sm:inline-flex"><MapPin size={14} /> Sri Lanka</span>
          </div>
        </div>

        <div className="relative mx-auto h-[350px] w-full max-w-[590px] sm:h-[470px] lg:h-[min(70dvh,610px)] lg:max-h-full">
          <div className="absolute inset-x-[8%] bottom-[5%] top-[8%] rounded-[45%_45%_22%_22%] bg-[#d9e9db] shadow-[inset_0_0_0_2px_#c8e0d4]" />
          <div className="absolute inset-x-[18%] bottom-[8%] top-[19%] rounded-[48%_48%_14%_14%] border-2 border-dashed border-[#b7d2c4]" />
          <span className="hero-orbit absolute left-0 top-[18%] size-16 rounded-2xl bg-[#f8be72] p-4 text-[#835126] shadow-[0_15px_40px_#b7835630] sm:size-20"><Code2 className="h-full w-full" strokeWidth={2.3} /></span>
          <span className="hero-orbit absolute right-[2%] top-[25%] grid size-14 rotate-12 place-items-center rounded-2xl bg-[#f5a58b] text-2xl shadow-[0_15px_40px_#b7835630] sm:size-20 sm:text-3xl">✦</span>
          <div data-story-character-anchor="about" data-character-outfit="suit" data-character-interaction="idle" className="absolute inset-x-[5%] bottom-[8%] top-[2%]"><CharacterPlatform /></div>
          <div className="absolute bottom-[7%] left-[2%] z-30 -rotate-6 rounded-2xl border-2 border-[#1e344c] bg-white px-5 py-4 text-sm font-black text-[#28465d] shadow-[6px_7px_0_#233b61] sm:left-[-3%] sm:bottom-[13%]">
            <span className="block text-[10px] font-extrabold uppercase tracking-widest text-[#e68a63]">meet the builder</span>
            That&apos;s me! <span aria-hidden="true">↗</span>
          </div>
          <div className="absolute right-0 top-[5%] z-30 rotate-[7deg] rounded-xl border border-[#f7d0ad] bg-[#fff8ea] px-4 py-2 text-[11px] font-black tracking-wide text-[#a56f32] shadow-md sm:right-[-3%]">100% made with curiosity ✨</div>
          <div className="absolute right-[2%] bottom-[4%] z-30 flex items-center gap-1.5 rounded-full bg-[#fffdf7] px-3 py-2 text-[11px] font-extrabold text-[#506475] shadow-md"><MousePointer2 size={13} /> Move your cursor!</div>
        </div>
      </div>

    </section>
  );
}

function Education() {
  const [highlight, setHighlight] = useState<'university' | null>(null);

  return (
    <section id="education" data-story-section="education" aria-labelledby="education-title" className="story-section relative min-h-[100svh] overflow-hidden bg-[#e9f2ed] px-6 pb-24 pt-28 sm:px-10 lg:min-h-[100dvh]">
      <div aria-hidden="true" className="pointer-events-none absolute -right-32 top-12 size-[400px] rounded-full border-[75px] border-[#d2e8db] opacity-70" />
      <div className="education-layout relative mx-auto grid w-full max-w-[1180px] items-center gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <div className="education-intro min-w-0">
          <ChapterEyebrow number="01">The beginnings</ChapterEyebrow>
          <h2 id="education-title" className="mt-6 text-[clamp(3rem,5vw,4.5rem)] font-black leading-[1.04] tracking-[-0.06em] text-[#223d55]">First, I<br />learned to<br /><span className="text-[#3e998c]">dream</span><span className="text-[#e9a858]">.</span></h2>
          <p className="mt-5 max-w-[420px] text-base leading-[1.75] text-[#5d746e]">Every great build starts with one small brick. Mine started with a love for finding out how things work.</p>
          <ChapterCompanion outfit="graduate" interaction={highlight ? 'present' : 'idle'} line={highlight ? 'Turning questions into projects!' : 'Hi! Explore my university story.'} />
        </div>

        <div className="education-details min-w-0 space-y-5">
          <article tabIndex={0} onMouseEnter={() => setHighlight('university')} onMouseLeave={() => setHighlight(null)} onFocus={() => setHighlight('university')} onBlur={() => setHighlight(null)} className="story-card relative rounded-[30px] border border-[#dbe7df] bg-[#fffdf8] p-6 shadow-[0_20px_50px_#527d6c12] outline-offset-4 focus-visible:outline-2 focus-visible:outline-[#3e998c] sm:p-8">
            <div className="education-card-header flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3"><span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-[#d9eee4] text-[#287e72]"><GraduationCap size={22} /></span><span className="text-[11px] font-black uppercase tracking-[0.16em] text-[#3e998c]">University</span></div>
              <span className="rounded-full bg-[#fff0d9] px-3 py-2 text-[11px] font-extrabold text-[#85602e]">Learning in progress ✦</span>
            </div>
            <h3 className="mt-6 text-2xl font-black leading-[1.2] tracking-tight text-[#1d3851] sm:text-3xl">B.Sc. (Hons) in Industrial Information Technology</h3>
            <p className="mt-3 text-base font-semibold text-[#3d907f]">Uva Wellassa University of Sri Lanka</p>
            <p className="mt-5 leading-relaxed text-[#607684]">Software engineering, databases, networks, and all the curious experiments in between. Where I learned to turn questions into projects.</p>
            <div className="education-tags mt-6 flex flex-wrap gap-2 border-t border-[#e4ebe5] pt-5"><span className="mini-tag">Software Engineering</span><span className="mini-tag">Problem Solving</span><span className="mini-tag">Computer Vision</span></div>
          </article>
          <p className="flex items-center gap-3 px-2 text-sm font-semibold leading-relaxed text-[#638278]"><Sparkles size={18} className="shrink-0 text-[#3e998c]" /> The best part? I never stopped learning.</p>
        </div>
      </div>
    </section>
  );
}

function Experience() {
  const [hoveredRole, setHoveredRole] = useState<'training' | 'support' | null>(null);
  const [focusedRole, setFocusedRole] = useState<'training' | 'support' | null>(null);
  const highlight = hoveredRole ?? focusedRole;

  return (
    <section id="experience" data-story-section="experience" aria-labelledby="journey-title" className={`story-section ${journeyStyles.section}`}>
      <div aria-hidden="true" className="pointer-events-none absolute -left-32 -top-24 size-[360px] rounded-full border-[45px] border-[#f5e5c8]/65" />
      <div className={journeyStyles.layout}>
        <div className={journeyStyles.intro}>
          <ChapterEyebrow number="02">The real world</ChapterEyebrow>
          <h2 id="journey-title" className={journeyStyles.title}>Learning by<br /><span>doing.</span> Every day.</h2>
          <p className={journeyStyles.description}>From fixing real problems for people to building software that makes their work easier. Every role adds another brick.</p>
          <div className={journeyStyles.stage}>
            <ChapterCompanion outfit="work" interaction="idle" hint="Move your cursor ↗" line={highlight === 'training' ? 'Shipping real-world features!' : highlight === 'support' ? 'Debugging with people first.' : 'Every role adds another brick.'} />
          </div>
        </div>
        <div className={journeyStyles.chapters}>
          <p className={journeyStyles.caption}>The chapters so far</p>
          <div className={journeyStyles.timeline}>
            <article tabIndex={0} data-active={highlight === 'training'} onMouseEnter={() => setHoveredRole('training')} onMouseLeave={() => setHoveredRole(null)} onFocus={() => setFocusedRole('training')} onBlur={() => setFocusedRole(null)} className={journeyStyles.card}>
              <div className={journeyStyles.header}>
                <div className={journeyStyles.identity}><span className={journeyStyles.icon}><TerminalSquare size={21} /></span><p className={journeyStyles.date}>2026 – Present</p></div>
                <span className={journeyStyles.status}>Current chapter</span>
              </div>
              <h3 className={journeyStyles.role}>Software Development · Industrial Training</h3>
              <p className={journeyStyles.company}>KeenRabbits (Pvt) Ltd</p>
              <p className={journeyStyles.copy}>Building hands-on experience with full-stack business applications, Laravel workflows, finance features, and team collaboration on live projects.</p>
              <div className={journeyStyles.tags}><span className="mini-tag">Laravel</span><span className="mini-tag">Business Systems</span><span className="mini-tag">Full Stack</span></div>
            </article>
            <article tabIndex={0} data-active={highlight === 'support'} onMouseEnter={() => setHoveredRole('support')} onMouseLeave={() => setHoveredRole(null)} onFocus={() => setFocusedRole('support')} onBlur={() => setFocusedRole(null)} className={`${journeyStyles.card} ${journeyStyles.previous}`}>
              <div className={journeyStyles.header}>
                <div className={journeyStyles.identity}><span className={journeyStyles.icon}><BriefcaseBusiness size={21} /></span><p className={journeyStyles.date}>Dec 2021 – May 2022</p></div>
                <span className={journeyStyles.status}>Where it started</span>
              </div>
              <h3 className={journeyStyles.role}>Customer Support Technician</h3>
              <p className={journeyStyles.company}>Dialog Axiata (Pvt) Ltd</p>
              <p className={journeyStyles.copy}>Troubleshooting systems, helping people get unstuck, and learning that the best technology always starts with understanding its users.</p>
              <div className={journeyStyles.tags}><span className="mini-tag">IT Support</span><span className="mini-tag">Troubleshooting</span><span className="mini-tag">Teamwork</span></div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}

const skills = [
  { icon: Code2, title: 'Frontend', desc: 'Interfaces people love to use', tint: 'bg-[#e7edff] text-[#5c76c1]', items: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'JavaScript'] },
  { icon: TerminalSquare, title: 'Backend', desc: 'The engines behind the magic', tint: 'bg-[#dbf1e7] text-[#33937b]', items: ['Laravel', 'PHP', 'Node.js', 'REST APIs', 'MongoDB'] },
  { icon: Sparkles, title: 'AI & Computer Vision', desc: 'Teaching computers to see', tint: 'bg-[#fff0d9] text-[#be884e]', items: ['Python', 'OpenCV', 'PyTorch', 'Machine Learning', '3D Reconstruction'] },
  { icon: Satellite, title: 'Tools & Systems', desc: 'Getting the whole thing working', tint: 'bg-[#f5e4ef] text-[#ac719c]', items: ['Git & GitHub', 'Linux', 'Docker', 'AWS', 'WebSockets'] },
];

function Skills() {
  const [activeSkill, setActiveSkill] = useState<number | null>(null);

  return (
    <section id="skills" data-story-section="skills" className="story-section relative min-h-[100svh] overflow-hidden bg-[#e9edf8] px-6 py-24 sm:px-10 lg:min-h-[100dvh] lg:py-20">
      <div className="absolute -right-32 top-36 size-[420px] rounded-full bg-[#dce1f4] blur-3xl" />
      <div className="relative mx-auto max-w-[1180px]">
        <ChapterEyebrow number="03">The toolbox</ChapterEyebrow>
        <div className="mt-6 flex flex-col justify-between gap-7 lg:flex-row lg:items-end">
          <h2 className="text-[clamp(3.2rem,6.1vw,6.1rem)] font-black leading-[1.02] tracking-[-0.065em] text-[#263d5a]">Meet my <span className="text-[#7883cb]">superpowers.</span></h2>
          <div className="w-full max-w-[355px]">
            <p className="text-lg leading-[1.75] text-[#647187]">Different tools, same mission: build something useful, thoughtful, and fun.</p>
            <ChapterCompanion outfit="maker" interaction={activeSkill === null ? 'idle' : activeSkill === 2 ? 'celebrate' : 'build'} line={activeSkill === null ? 'Choose a toolbox card!' : `Let's build with ${skills[activeSkill].title}!`} />
          </div>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-3">
          {skills.map((category, index) => {
            const Icon = category.icon;
            return (
              <article key={category.title} tabIndex={0} onMouseEnter={() => setActiveSkill(index)} onMouseLeave={() => setActiveSkill(null)} onFocus={() => setActiveSkill(index)} onBlur={() => setActiveSkill(null)} className="story-card group rounded-[28px] border border-[#d7dfef] bg-white/90 p-7 outline-offset-4 focus-visible:outline-2 focus-visible:outline-[#7883cb] sm:p-9">
                <div className="flex items-start justify-between gap-4"><span className={`grid size-14 place-items-center rounded-[19px] ${category.tint}`}><Icon size={26} /></span><span className="font-mono text-[11px] font-extrabold text-[#a6adc3]">0{index + 1} / 04</span></div>
                <h3 className="mt-8 text-[26px] font-black text-[#283e59]">{category.title}</h3>
                <p className="mt-1 text-sm text-[#8390a4]">{category.desc}</p>
                <div className="mt-7 flex flex-wrap gap-2">{category.items.map((item) => <span key={item} className="rounded-xl bg-[#f1f3f9] px-3.5 py-2 text-xs font-bold text-[#56677e] transition-colors group-hover:bg-[#e9edf8]">{item}</span>)}</div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function MissionLaunch({ onLaunch, onRetry, status, projectCount, source, characterVisible }: { onLaunch: () => void; onRetry: () => void; status: 'loading' | 'ready' | 'error'; projectCount: number; source: ProjectSource; characterVisible: boolean }) {
  return (
    <section id="mission" data-story-section="mission" className="story-section mission-section relative isolate flex min-h-[100svh] items-center overflow-hidden bg-[#172644] px-6 py-24 text-white sm:px-10 lg:min-h-[100dvh] lg:py-16">
      <div className="mission-stars pointer-events-none absolute inset-0 opacity-70" />
      <div className="absolute -right-[13%] top-[8%] size-[550px] rounded-full border border-[#889ace]/20 sm:size-[720px]" />
      <div className="absolute -right-[8%] top-[16%] size-[460px] rounded-full border border-[#889ace]/20 sm:size-[620px]" />
      <div className="absolute -right-[2%] top-[24%] size-[360px] rounded-full bg-[#2d4c79]/40 blur-3xl sm:size-[510px]" />
      <div className="relative z-10 mx-auto grid w-full max-w-[1180px] items-center gap-14 lg:grid-cols-[1fr_0.88fr]">
        <div className="relative z-20">
          <ChapterEyebrow number="04" light>Mission: Projects</ChapterEyebrow>
          <h2 className="mt-8 text-[clamp(3.4rem,6.5vw,6.8rem)] font-black leading-[1.02] tracking-[-0.07em]">Okay, but<br />what have I <span className="text-[#f6b871]">built?</span></h2>
          <p className="mt-8 max-w-[520px] text-lg leading-[1.85] text-[#b9c5d8]">Glad you asked. My projects are out there in their own little galaxy. Every planet is a real GitHub repository, and new ones join the universe automatically.</p>
          <div className="mt-7 flex flex-wrap gap-2"><span role="status" className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold text-[#dfebff]">{status === 'loading' ? 'Scanning GitHub…' : status === 'ready' && projectCount ? `${projectCount} real project planets` : 'Public GitHub mission control ready'}</span><span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold text-[#dfebff]">{source === 'cached' ? 'Showing last saved GitHub feed' : 'Automatically synced to public repositories'}</span></div>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <button onClick={onLaunch} className="group inline-flex items-center gap-3 rounded-full bg-[#f6b66b] px-8 py-4 text-sm font-black text-[#26374e] shadow-[0_15px_60px_#e99b5650] transition-all hover:-translate-y-1 hover:bg-[#ffce90]"><Rocket size={19} className="transition-transform group-hover:-rotate-12" /> Launch project explorer <ArrowRight size={18} /></button>
            <a href={`${GITHUB_PROFILE_URL}?tab=repositories`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full px-2 py-3 text-sm font-bold text-[#d5e1f3] transition-colors hover:text-white"><Github size={18} /> Browse GitHub <ArrowUpRight size={16} /></a>
          </div>
          {(status === 'error' || (status === 'ready' && projectCount === 0)) && (
            <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-[#cad8ed]">
              <span>{status === 'error' ? 'The repository feed is unavailable; the explorer will take you to your GitHub profile.' : 'No public repositories in this flight yet.'}</span>
              <button onClick={onRetry} className="inline-flex items-center gap-1.5 rounded-full border border-white/30 px-3 py-2 font-bold text-white transition-colors hover:bg-white/10"><RefreshCw size={14} /> Try again</button>
            </div>
          )}
          <p className="mt-5 text-xs font-medium text-[#96abc4]">Scroll between planets · Peek into the code · Land on the contact planet</p>
        </div>
        <div className="pointer-events-none relative z-0 mx-auto h-[360px] w-full max-w-[480px] sm:h-[480px]">
          <div aria-hidden="true" className="mission-planet-system absolute right-[-12%] top-0 size-[330px] sm:right-[-5%] sm:size-[425px]">
            <div className="mission-planet-ring mission-planet-ring-back" />
            <div className="mission-planet absolute inset-0 rounded-full" />
            <div className="mission-planet-ring mission-planet-ring-front" />
            <div className="mission-moon-orbit"><div className="mission-moon" /></div>
          </div>
          <div className="mission-ship absolute bottom-9 left-[-12%] h-[245px] w-[126%] sm:bottom-4 sm:left-[-28%] sm:h-[340px] sm:w-[148%] lg:left-[-32%] lg:h-[320px] lg:w-[145%]" style={{ animation: 'none', transform: 'none' }}><SceneWhenNear><ShipCanvas fitWholeShip pilotWaving showPilot={characterVisible} /></SceneWhenNear><div data-story-character-anchor="mission" data-character-outfit="suit" className="absolute left-1/2 top-[15%] h-20 w-16" /></div>
          <div className="absolute bottom-3 right-1 rotate-6 rounded-2xl border border-white/20 bg-[#2b3f64] px-5 py-3 text-[12px] font-black text-[#ffce91] shadow-xl">NEXT STOP: THE UNIVERSE →</div>
          <span className="absolute left-12 top-0 text-5xl text-[#f5c67b]" aria-hidden="true">✦</span>
          <span className="absolute bottom-12 right-6 text-3xl text-[#8bafda]" aria-hidden="true">✧</span>
        </div>
      </div>
    </section>
  );
}

function Contact({ hasLanded, characterVisible }: { hasLanded: boolean; characterVisible: boolean }) {
  const [interaction, setInteraction] = useState<ContactInteraction>('idle');
  const [hasWalked, setHasWalked] = useState(false);
  useEffect(() => { if (!hasLanded) setHasWalked(false); }, [hasLanded]);
  const contactPrompt: Record<ContactInteraction, string> = {
    idle: 'Watch me work the terminal! Hover or focus a channel to take control. 👋',
    email: 'Tapping the email control… 📬',
    phone: 'Dialing the direct line… 📞',
    github: 'Opening my code galaxy… 🚀',
    linkedin: 'Connecting our networks… ✦',
  };
  const contactControls = [
    { id: 'email' as const, label: 'Email', href: `mailto:${CONTACT_EMAIL}?subject=Hello%20Asitha!`, icon: Mail, external: false },
    { id: 'phone' as const, label: 'Call', href: 'tel:+94784377862', icon: Phone, external: false },
    { id: 'github' as const, label: 'GitHub', href: GITHUB_PROFILE_URL, icon: Github, external: true },
    { id: 'linkedin' as const, label: 'LinkedIn', href: 'https://www.linkedin.com/in/asithaisuru', icon: Linkedin, external: true },
  ];
  const activate = (id: ContactInteraction) => ({
    onMouseEnter: () => setInteraction(id),
    onMouseLeave: () => setInteraction('idle'),
    onFocus: () => setInteraction(id),
    onBlur: () => setInteraction('idle'),
    onClick: () => setInteraction(id),
  });

  return (
    <section id="contact" data-story-section="contact" className="story-section contact-section relative isolate min-h-[100svh] overflow-hidden bg-[#dff0e8] px-6 pb-0 pt-28 sm:px-10 lg:min-h-[100dvh] lg:pt-24">
      <div className="absolute -left-40 top-10 size-[440px] rounded-full bg-[#b9dfcd] blur-[85px]" />
      <div className="absolute -right-36 bottom-0 size-[520px] rounded-full bg-[#b8dbea] blur-[85px]" />
      <div className="relative mx-auto max-w-[1180px]">
        <ChapterEyebrow number="05">Final destination</ChapterEyebrow>
        <div className="mt-7 grid gap-9 lg:grid-cols-[1fr_0.95fr] lg:items-start">
          <div className="relative z-10">
            <h2 className="text-[clamp(3.1rem,6.1vw,6.1rem)] font-black leading-[1.04] tracking-[-0.067em] text-[#22415a]">Touchdown!<br />Let&apos;s make <span className="text-[#3c9a88]">something.</span></h2>
            <p className="mt-7 max-w-[470px] text-lg leading-[1.8] text-[#55746e]">Thanks for coming along for the ride. Have an idea, a project, or just want to say hi? I&apos;d love to hear from you.</p>
            <a href={`mailto:${CONTACT_EMAIL}?subject=Hello%20Asitha!`} {...activate('email')} className="mt-9 inline-flex items-center gap-3 rounded-full bg-[#25405e] px-7 py-4 text-sm font-black text-white shadow-[0_15px_35px_#1b544037] transition-transform hover:-translate-y-1"><Mail size={19} /> Say hello <ArrowUpRight size={18} /></a>
            <div className="mt-9 flex flex-col gap-3 text-sm font-semibold text-[#52716c]">
              <a href={`mailto:${CONTACT_EMAIL}`} {...activate('email')} className="flex items-center gap-3 hover:text-[#234d5d]"><span className="grid size-9 place-items-center rounded-xl bg-white/75"><Mail size={17} /></span>{CONTACT_EMAIL}</a>
              <a href="tel:+94784377862" {...activate('phone')} className="flex items-center gap-3 hover:text-[#234d5d]"><span className="grid size-9 place-items-center rounded-xl bg-white/75"><Phone size={17} /></span>+94 78 43 77 862</a>
              <span className="flex items-center gap-3"><span className="grid size-9 place-items-center rounded-xl bg-white/75"><MapPin size={17} /></span>Gampaha, Sri Lanka</span>
            </div>
          </div>
          <div className="contact-scene-group relative">
            <div data-story-character-anchor="contact" data-character-outfit="contact" className="contact-scene relative h-[400px] sm:h-[500px] lg:h-[530px]">
              <div className="pointer-events-none absolute inset-x-[6%] bottom-[16%] h-[45%] rounded-full bg-[radial-gradient(ellipse,#a9cc9f70,transparent_70%)]" />
              <div className="pointer-events-none absolute inset-0"><SceneWhenNear><LandingCanvas arrived={hasLanded && !hasWalked} onArrivalComplete={() => setHasWalked(true)} showCharacter={characterVisible} interaction={interaction} /></SceneWhenNear></div>
              <div className="pointer-events-none absolute left-3 right-3 top-1 z-10 flex flex-col gap-2 sm:left-5 sm:top-5 lg:-top-6">
                <span className="w-fit rounded-full border border-[#9fc4b9] bg-[#fffdf8]/90 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.13em] text-[#357b71]">{hasLanded ? '✓ Landing complete' : '05 / Contact control room'}</span>
                <span aria-live="polite" className="max-w-[270px] rounded-2xl border-2 border-[#29475d] bg-white px-4 py-3 text-xs font-black leading-snug text-[#29475d] shadow-[4px_5px_0_#29475d] sm:text-sm">{contactPrompt[interaction]}</span>
              </div>
            </div>
            <div className="contact-channel-controls relative z-20 mx-1 rounded-[22px] border border-[#b7d3cd] bg-white/90 p-3 shadow-[0_15px_45px_#2a5b5525] backdrop-blur-lg sm:mx-3 sm:p-4" style={{ marginTop: 'clamp(-72px, calc(144px - 24dvh), -44px)' }}>
              <p className="mb-3 text-center text-[10px] font-black uppercase tracking-[0.22em] text-[#6b9188]">Interactive terminal · Choose a channel</p>
              <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
                {contactControls.map(({ id, label, href, icon: Icon, external }) => (
                  <a key={id} href={href} {...activate(id)} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined} className={`flex flex-col items-center justify-center gap-1.5 rounded-xl px-1 py-2.5 text-[11px] font-black transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#397f79] sm:flex-row sm:gap-2 sm:py-3 sm:text-xs ${interaction === id ? 'bg-[#25475c] text-white shadow-lg' : 'bg-[#eaf3ef] text-[#345c61] hover:bg-[#d9e9e0]'}`}>
                    <Icon size={18} /> {label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="relative z-10 mt-4 grid gap-4 border-t border-[#a8ccc2] py-9 sm:grid-cols-[1fr_auto] sm:items-center">
          <div><div className="flex items-center gap-2.5"><BrandMark className="size-8" /><p className="text-lg font-black tracking-tight text-[#284b60]">asitha<span className="text-[#3e998c]">isuru</span></p></div><p className="mt-2 text-xs font-medium text-[#6c8b84]">Made with curiosity, caffeine, and a few bricks. © {new Date().getFullYear()} asithaisuru.</p></div>
          <div className="flex flex-wrap items-center gap-3"><a className="footer-social" href={`https://github.com/${GITHUB_USERNAME}`} target="_blank" rel="noopener noreferrer" aria-label="GitHub"><Github size={20} /></a><a className="footer-social" href="https://www.linkedin.com/in/asithaisuru" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><Linkedin size={20} /></a><a className="footer-social" href={CV_URL} download aria-label="Download my CV"><Download size={20} /></a><button type="button" onClick={() => scrollToChapter('about')} className="inline-flex min-h-10 items-center gap-2 rounded-full border border-[#9fc4b9] bg-[#fffefa] px-4 py-2.5 text-xs font-black text-[#284b60] transition-all hover:-translate-y-1 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#397f79]"><ArrowUp size={16} aria-hidden="true" /> Go to top</button></div>
        </div>
      </div>
    </section>
  );
}

/** Pause offscreen canvases so mobile devices do not animate every scene at once. */
function SceneWhenNear({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (!('IntersectionObserver' in window)) { setNear(true); return; }
    const observer = new IntersectionObserver(([entry]) => setNear(entry.isIntersecting), { rootMargin: '320px' });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return <div ref={ref} className="h-full w-full">{near ? children : null}</div>;
}

function WarpSequence() {
  return (
    <div className="warp-scene fixed inset-0 z-[70] flex flex-col items-center justify-center overflow-hidden bg-[#0b1630] text-white" role="status" aria-live="polite" aria-label="Boarding spaceship and jumping to light speed">
      <div className="warp-stars absolute inset-0" />
      <div className="warp-rays absolute inset-0" />
      <div className="warp-rocket relative h-[170px] w-[280px] sm:h-[210px] sm:w-[360px]"><ShipCanvas fitWholeShip launching /></div>
      <p className="relative mt-8 text-xl font-black tracking-tight sm:text-2xl">Strap in, we&apos;re taking off!</p>
      <p className="relative mt-2 text-xs font-bold uppercase tracking-[0.28em] text-[#90b5e7]">Preparing hyperdrive…</p>
    </div>
  );
}

function LandingSequence() {
  return (
    <div className="landing-sequence fixed inset-0 z-[70] flex flex-col items-center justify-center overflow-hidden bg-[#d6eee1]" role="status" aria-live="polite" aria-label="Spaceship is landing on the contact planet">
      <div className="landing-rocket relative h-[210px] w-[290px] sm:h-[280px] sm:w-[440px]"><ShipCanvas /></div>
      <p className="mt-10 text-2xl font-black text-[#24475a]">Welcome back to Earth!</p>
      <p className="mt-2 text-sm font-bold text-[#5d8b7c]">Time to say hello.</p>
    </div>
  );
}

function ProjectGalaxy({ projects, status, onRetry, onExit, onLand }: { projects: GithubProject[]; status: 'loading' | 'ready' | 'error'; onRetry: () => void; onExit: () => void; onLand: () => void }) {
  // -1 is the launch bay; each subsequent index is a separate GitHub world.
  const [index, setIndex] = useState(-1);
  const [detailOpen, setDetailOpen] = useState(false);
  const indexRef = useRef(-1);
  const lastMove = useRef(0);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const flagRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);
  const project = index >= 0 ? projects[index] : undefined;
  const intro = index === -1 && projects.length > 0;
  const lastPlanet = projects.length === 0 || index === projects.length - 1;

  const move = useCallback((direction: number, throttled = true) => {
    if (detailOpen) return;
    const now = Date.now();
    if (throttled && now - lastMove.current < 650) return;
    lastMove.current = now;
    const next = indexRef.current + direction;
    if (next >= projects.length) {
      onLand();
      return;
    }
    const bounded = Math.max(-1, next);
    indexRef.current = bounded;
    setIndex(bounded);
    setDetailOpen(false);
  }, [detailOpen, onLand, projects.length]);

  useEffect(() => {
    if (detailOpen) {
      wasOpen.current = true;
      closeRef.current?.focus();
    } else if (wasOpen.current) {
      flagRef.current?.focus();
      wasOpen.current = false;
    }
  }, [detailOpen]);

  const trapDialogFocus = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key !== 'Tab') return;
    const items = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('button:not([tabindex="-1"]), a[href]'));
    const first = items[0];
    const last = items[items.length - 1];
    if (!first || !last) return;
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  };

  useEffect(() => {
    const wheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaY) <= 8) return;
      event.preventDefault();
      if (!detailOpen) move(event.deltaY > 0 ? 1 : -1);
    };
    const keydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        if (detailOpen) setDetailOpen(false);
        else onExit();
        return;
      }
      if (detailOpen) return;
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown' || event.key === 'PageDown' || event.key.toLowerCase() === 'd') {
        event.preventDefault(); move(1);
      }
      if (event.key === 'ArrowLeft' || event.key === 'ArrowUp' || event.key === 'PageUp' || event.key.toLowerCase() === 'a') {
        event.preventDefault(); move(-1);
      }
    };
    window.addEventListener('wheel', wheel, { passive: false });
    window.addEventListener('keydown', keydown);
    return () => { window.removeEventListener('wheel', wheel); window.removeEventListener('keydown', keydown); };
  }, [detailOpen, move, onExit]);

  const select = (next: number) => { indexRef.current = next; setIndex(next); setDetailOpen(false); lastMove.current = Date.now(); };

  const startTouch = (event: React.TouchEvent<HTMLDivElement>) => {
    const target = event.target as Element;
    if (detailOpen || target.closest('a, button, [role="dialog"]')) { touchStart.current = null; return; }
    const touch = event.touches[0];
    touchStart.current = touch ? { x: touch.clientX, y: touch.clientY } : null;
  };

  const endTouch = (event: React.TouchEvent<HTMLDivElement>) => {
    const start = touchStart.current;
    touchStart.current = null;
    if (start === null || detailOpen) return;
    const touch = event.changedTouches[0];
    const deltaX = start.x - (touch?.clientX ?? start.x);
    const deltaY = start.y - (touch?.clientY ?? start.y);
    // Both horizontal swipes and vertical scroll gestures advance the flight.
    const delta = Math.abs(deltaX) > Math.abs(deltaY) ? deltaX : deltaY;
    if (Math.abs(delta) < 45) return;
    move(delta > 0 ? 1 : -1);
  };

  return (
    <div className="galaxy-scene fixed inset-0 z-[65] overflow-hidden bg-[#080d20] text-[#f7f8ff]" aria-label="Interactive project galaxy" onTouchStart={startTouch} onTouchEnd={endTouch}>
      <div className="galaxy-nebula pointer-events-none absolute inset-0" />
      <div className="galaxy-star-dots pointer-events-none absolute inset-0" />
      <div className="galaxy-haze pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute inset-0"><GalaxyCanvas index={index} /></div>

      <header className="relative z-20 mx-auto flex max-w-[1320px] items-center justify-between gap-3 px-5 pt-6 sm:px-10 sm:pt-9">
        <div className="flex items-center gap-3"><span className="grid size-11 place-items-center rounded-2xl border border-white/20 bg-white/10 text-[#ffca81]"><Rocket size={21} /></span><div><p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#acc7ed]">Asitha&apos;s universe</p><p className="text-sm font-black text-white">Project explorer</p></div></div>
        <button onClick={onExit} className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-3 text-xs font-black text-white transition-colors hover:bg-white/20"><X size={16} /> <span className="hidden sm:inline">Exit to story</span><span className="sm:hidden">Exit</span></button>
      </header>

      {/* The cockpit stays visible while the visitor chooses when to inspect a planet. */}
      {intro && (
        <div className="pointer-events-none absolute left-5 right-5 top-[17%] z-10 sm:left-10 md:left-[6%] md:right-auto md:top-[26%] md:w-[430px]">
          <div className="pointer-events-auto rounded-[27px] border border-white/20 bg-[#0b1b37]/75 p-5 shadow-[0_24px_90px_#0008] backdrop-blur-xl sm:p-8">
            <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.23em] text-[#94e7ef]"><Satellite size={16} /> Departure deck · Ready to launch</span>
            <h2 className="mt-3 text-[clamp(2rem,5vw,3.1rem)] font-black leading-[1.07] tracking-[-0.05em] text-white">The projects<br /><span className="text-[#f7c181]">are out there.</span></h2>
            <p className="mt-3 text-sm leading-[1.65] text-[#c1d5ed]">Fly with me from planet to planet. Every world represents a real GitHub project. Select its flag to see what I built.</p>
            <button onClick={() => move(1, false)} className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#f6bb73] px-5 py-3 text-xs font-black text-[#23334c] transition-colors hover:bg-[#ffd59d]"><Rocket size={16} /> Start exploring <ChevronRight size={18} /></button>
            <p className="mt-4 text-[11px] font-semibold text-[#a2bbdd]">{projects.length} live destinations · Scroll, swipe, use arrows or A / D to steer</p>
          </div>
        </div>
      )}

      {!intro && !project && (
        <div className="absolute inset-x-4 top-[18%] z-10 mx-auto max-w-[500px] rounded-[26px] border border-white/20 bg-[#0a1934]/85 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
          <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.19em] text-[#8de0ee]"><Satellite size={17} /> GitHub command station</div>
          <h2 className="mt-4 text-3xl font-black tracking-tight text-white">Waiting for the planets.</h2>
          <p role="status" className="mt-4 text-sm leading-[1.8] text-[#cad8ed]">{status === 'loading' ? 'Connecting to my public repositories…' : status === 'error' ? 'The GitHub feed could not be reached this visit. You can retry or browse the public profile.' : 'No public project repositories are available at the moment.'}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={GITHUB_PROFILE_URL + '?tab=repositories'} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[#f6bb73] px-4 py-3 text-xs font-black text-[#23334c]"><Github size={16} /> Public GitHub <ArrowUpRight size={16} /></a>
            <button onClick={onRetry} className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-3 text-xs font-black text-white"><RefreshCw size={16} /> Retry</button>
          </div>
        </div>
      )}

      {project && !detailOpen && (
        <button
          key={project.id}
          ref={flagRef}
          type="button"
          onClick={() => setDetailOpen(true)}
          aria-label={'Open details for ' + projectTitle(project.name)}
          className={['galaxy-planet-flag', index % 2 === 0 ? 'galaxy-planet-flag-right' : 'galaxy-planet-flag-left'].join(' ')}
        >
          <span className="galaxy-flag-banner">
            <span className="block text-[9px] font-black uppercase tracking-[0.17em] text-[#8fe9ec]">Planet {String(index + 1).padStart(2, '0')} · Land here</span>
            <span className="mt-1 block line-clamp-2 text-base font-black leading-tight text-white sm:text-lg">{projectTitle(project.name)}</span>
            <span className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold text-[#ffd49c]"><MousePointer2 size={12} /> Select flag for details</span>
          </span>
          <span className="galaxy-flag-pole" aria-hidden="true" />
          <span className="galaxy-flag-foot" aria-hidden="true" />
        </button>
      )}

      {project && !detailOpen && (
        <div className="pointer-events-none absolute inset-x-5 bottom-[104px] z-10 flex flex-col items-center gap-2 text-center sm:bottom-[110px]">
          <span className="rounded-full border border-[#9ab5de]/25 bg-[#071227]/65 px-4 py-2 text-[11px] font-black uppercase tracking-[0.15em] text-[#c2d6f4] backdrop-blur-lg">Orbit {String(index + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}</span>
          <span className="text-[11px] font-semibold text-[#a6bddf]">Choose the planet flag to open this project</span>
        </div>
      )}

      {project && detailOpen && (
        <div className="pointer-events-auto absolute inset-0 z-40">
          <button type="button" className="absolute inset-0 cursor-default bg-[#020915]/65 backdrop-blur-[2px] md:bg-[#020915]/25" onClick={() => setDetailOpen(false)} aria-label="Close project details" tabIndex={-1} />
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="galaxy-detail-title"
            onKeyDown={trapDialogFocus}
            className={['galaxy-detail-card', 'absolute inset-0 flex items-center overflow-hidden border-white/20 bg-[#0b1930]/96 px-6 py-5 shadow-[0_25px_90px_#000c] backdrop-blur-3xl sm:px-10 md:inset-y-[min(10dvh,88px)] md:w-[min(43vw,540px)] md:rounded-[32px] md:border md:bg-[#101d39]/90 md:px-8 lg:w-[min(38vw,525px)]', index % 2 === 0 ? 'md:left-[3.5vw]' : 'md:right-[3.5vw]'].join(' ')}
          >
            <div className="mx-auto flex w-full max-w-[530px] flex-col gap-3 sm:gap-4 md:gap-5">
              <div className="flex items-center justify-between gap-3">
                <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.17em] text-[#89dbe8] sm:text-xs"><span className="size-2 rounded-full bg-[#81e9df] shadow-[0_0_14px_#81e9df]" /> Planet {String(index + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}</span>
                <button ref={closeRef} type="button" onClick={() => setDetailOpen(false)} aria-label="Close project details" className="grid size-11 shrink-0 place-items-center rounded-full border border-white/25 bg-white/10 text-white transition-colors hover:bg-white/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#83dfef]"><X size={20} /></button>
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#f7bd7b]">Mission log · Project discovered</span>
                <h2 id="galaxy-detail-title" className="mt-2 line-clamp-2 break-words text-[clamp(1.85rem,7.8vw,3.55rem)] font-black leading-[1.09] tracking-[-0.055em] text-white md:text-[clamp(2.1rem,3vw,3.55rem)]">{projectTitle(project.name)}</h2>
              </div>
              <p className="line-clamp-4 text-sm leading-[1.65] text-[#c5d5ec] sm:line-clamp-5 sm:text-[15px]">{project.description || 'A real project from my public GitHub repositories. Explore the source code, implementation, and development history.'}</p>
              <div className="flex flex-wrap gap-2">{[project.language, ...project.topics].filter(Boolean).slice(0, 4).map((tag) => <span key={tag} className="max-w-[48%] truncate rounded-full border border-[#accbea]/25 bg-[#abc8ef]/10 px-3 py-1.5 text-[10px] font-bold text-[#c9def9]">{tag}</span>)}</div>
              <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-[#a1badb]">
                <span className="inline-flex items-center gap-1.5"><Star size={15} className="text-[#f5c27d]" /> {project.stargazers_count} stars</span>
                {project.updated_at && <span>Updated {new Date(project.updated_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>}
              </div>
              <div className="flex flex-wrap gap-2.5 pt-1">
                <a href={project.html_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#f7bd77] px-5 py-3 text-xs font-black text-[#24334b] transition-colors hover:bg-[#ffd6a4]"><Github size={17} /> View GitHub <ArrowUpRight size={16} /></a>
                {project.homepage && <a href={project.homepage} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 bg-white/10 px-5 py-3 text-xs font-black text-white hover:bg-white/20">Live demo <ExternalLink size={15} /></a>}
              </div>
              <p className="text-[10px] font-semibold text-[#7999c2]">Close this log to continue the flight.</p>
            </div>
          </section>
        </div>
      )}

      <div className="absolute bottom-5 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 sm:bottom-8 sm:left-10 sm:right-10">
        <div className="hidden items-center gap-2 sm:flex"><span className="mr-2 text-[10px] font-black uppercase tracking-[0.17em] text-[#a6b6d6]">Flight path</span><button onClick={() => select(-1)} aria-label="Return to centered launch bay" aria-current={index === -1 ? 'step' : undefined} className={`h-2.5 rounded-full transition-all ${index === -1 ? 'w-9 bg-[#7dd8e5]' : 'w-2.5 bg-[#546c94] hover:bg-[#95aacb]'}`} />{projects.slice(0, 12).map((repo, i) => <button key={repo.id} onClick={() => select(i)} aria-label={`Visit project planet ${i + 1}: ${projectTitle(repo.name)}`} aria-current={index === i ? 'step' : undefined} className={`h-2.5 rounded-full transition-all ${index === i ? 'w-9 bg-[#f7bb76]' : 'w-2.5 bg-[#546c94] hover:bg-[#95aacb]'}`} />)}{projects.length > 12 && <span className="text-xs text-[#98b1d1]">+{projects.length - 12}</span>}</div>
        <div className="flex w-full items-center justify-between gap-3 sm:w-auto sm:justify-end"><span className="text-xs font-bold text-[#9fbbda] sm:hidden">{intro ? 'Launch bay' : projects.length ? `${index + 1} of ${projects.length} planets` : 'GitHub hub'}</span><div className="flex gap-2"><button aria-label="Previous destination" onClick={() => move(-1, false)} disabled={index === -1} className="grid size-11 place-items-center rounded-full border border-white/20 bg-white/10 text-white transition-colors hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-30"><ChevronLeft size={21} /></button><button onClick={() => move(1, false)} className="inline-flex items-center gap-2 rounded-full bg-[#f6bb73] px-5 py-3 text-xs font-black text-[#253852] transition-colors hover:bg-[#ffd094]">{intro ? 'First planet' : lastPlanet ? 'Land & say hello' : 'Next planet'} {lastPlanet && !intro ? <ArrowDown size={18} /> : <ChevronRight size={19} />}</button></div></div>
      </div>
      <div className="pointer-events-none absolute right-10 top-[48%] hidden rotate-90 text-[10px] font-bold uppercase tracking-[0.3em] text-[#869fc9] xl:block">Scroll to fly ↓</div>
    </div>
  );
}

export default function StoryPortfolio() {
  const [chapter, setChapter] = useState<ChapterId>('about');
  const [characterOwner, setCharacterOwner] = useState<StoryChapter>('about');
  const [phase, setPhase] = useState<Phase>('story');
  const [projects, setProjects] = useState<GithubProject[]>([]);
  const [projectStatus, setProjectStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [projectSource, setProjectSource] = useState<ProjectSource>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [hasLanded, setHasLanded] = useState(false);
  const phaseRef = useRef<Phase>('story');

  useEffect(() => { phaseRef.current = phase; }, [phase]);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();
    setProjectStatus('loading');

    const accept = (loaded: GithubProject[], source: Exclude<ProjectSource, null>) => {
      if (cancelled) return;
      setProjects(loaded);
      setProjectSource(source);
      setProjectStatus('ready');
      if (source !== 'cached') {
        try { localStorage.setItem(PROJECT_CACHE_KEY, JSON.stringify({ projects: loaded, updatedAt: new Date().toISOString() })); } catch { /* storage is optional */ }
      }
    };

    const load = async () => {
      // Display saved real repositories immediately while checking for new ones.
      let cachedProjects = false;
      try {
        const cached = localStorage.getItem(PROJECT_CACHE_KEY);
        if (cached) {
          const data: ProjectsResponse = JSON.parse(cached);
          const age = Date.now() - Date.parse(data.updatedAt);
          if (age >= 0 && age < 7 * 24 * 60 * 60 * 1000) {
            accept(normalizeGithubProjects(data.projects), 'cached');
            cachedProjects = true;
          }
        }
      } catch { /* cached data is optional */ }

      // The public browser endpoint works even on hosts whose server cannot reach GitHub.
      try {
        accept(await fetchPublicGithubProjects(controller.signal), 'public');
        return;
      } catch {
        if (controller.signal.aborted) return;
      }

      // Server-side proxy remains available as a fallback for browser rate limits or CORS.
      try {
        const response = await fetch('/api/projects', { signal: controller.signal, cache: 'no-store' });
        if (!response.ok) throw new Error('Project feed unavailable');
        const data: ProjectsResponse = await response.json();
        if (!Array.isArray(data.projects)) throw new Error('Invalid projects');
        accept(normalizeGithubProjects(data.projects), 'server');
        return;
      } catch {
        if (controller.signal.aborted) return;
      }

      if (!cancelled && !cachedProjects) { setProjectSource(null); setProjectStatus('error'); }
    };
    load();
    return () => { cancelled = true; controller.abort(); };
  }, [retryCount]);

  useEffect(() => {
    let previousChapter: ChapterId = 'about';
    let frame = 0;

    const update = () => {
      frame = 0;
      const marker = window.innerHeight * 0.45;
      const visible = chapters.find(({ id }) => {
        const rect = document.getElementById(id)?.getBoundingClientRect();
        return rect && rect.top <= marker && rect.bottom >= marker;
      });
      if (visible && visible.id !== previousChapter) {
        previousChapter = visible.id;
        setChapter(visible.id);
      }
    };

    const onScroll = () => { if (!frame && phaseRef.current === 'story') frame = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); cancelAnimationFrame(frame); };
  }, []);

  useEffect(() => {
    if (phase === 'story') return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, [phase]);

  const launch = () => {
    if (phaseRef.current !== 'story') return;
    setHasLanded(false);
    setPhase('launching');
  };

  useEffect(() => {
    if (phase !== 'launching' && phase !== 'landing') return;
    const timer = setTimeout(() => {
      if (phase === 'launching') setPhase('space');
      else {
        setHasLanded(true);
        setPhase('story');
        requestAnimationFrame(() => document.getElementById('contact')?.scrollIntoView({ behavior: 'instant', block: 'start' }));
      }
    }, phase === 'launching' ? 1800 : 1400);
    return () => clearTimeout(timer);
  }, [phase]);

  return (
    <main className="story-app min-h-screen overflow-x-clip bg-[#f9f5e9] font-sans selection:bg-[#f7bc78] selection:text-[#20344c]">
      <StoryNavigation active={chapter} isSpace={phase !== 'story'} />
      <div className="story-progress fixed left-0 top-0 z-50 h-1 bg-[#efaa72]" style={{ width: `${((chapters.findIndex(({ id }) => id === chapter) + 1) / chapters.length) * 100}%` }} />
      <Hero />
      <Education />
      <Experience />
      <Skills />
      <MissionLaunch characterVisible={characterOwner === 'mission'} onLaunch={launch} onRetry={() => setRetryCount((count) => count + 1)} status={projectStatus} source={projectSource} projectCount={projects.length} />
      <Contact hasLanded={hasLanded} characterVisible={characterOwner === 'contact'} />
      <StoryCharacter enabled={phase === 'story'} onOwnerChange={setCharacterOwner} />
      {phase === 'story' && <ChapterAdvance active={chapter} />}
      {phase === 'launching' && <WarpSequence />}
      {phase === 'space' && <ProjectGalaxy projects={projects} status={projectStatus} onRetry={() => setRetryCount((count) => count + 1)} onExit={() => setPhase('story')} onLand={() => setPhase('landing')} />}
      {phase === 'landing' && <LandingSequence />}
    </main>
  );
}
