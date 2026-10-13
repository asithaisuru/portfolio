'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import type { BrickEntry, BrickInteraction, BrickOutfit } from './brick-world';

const CharacterCanvas = dynamic(() => import('./brick-world').then((mod) => mod.BrickCharacterCanvas), { ssr: false });
const storyChapters = ['about', 'education', 'experience', 'skills', 'mission', 'contact'] as const;
export type StoryChapter = (typeof storyChapters)[number];
const standAloneChapters = new Set<StoryChapter>(storyChapters.slice(0, 4));

/** One figure appears through the current chapter's contained portal. */
export function StoryCharacter({ enabled, onOwnerChange }: { enabled: boolean; onOwnerChange: (chapter: StoryChapter) => void }) {
  const host = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const [pose, setPose] = useState<{ outfit: BrickOutfit; interaction: BrickInteraction; entry: BrickEntry; entryKey: number }>({ outfit: 'suit', interaction: 'idle', entry: 'none', entryKey: 0 });

  useEffect(() => {
    const getAnchors = () => storyChapters.map((id) => ({ id, section: document.getElementById(id), node: document.querySelector<HTMLElement>(`[data-story-character-anchor="${id}"]`) }));
    const observedNodes = new Set<HTMLElement>();
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    let previousScroll = window.scrollY;
    let visibleOwner: StoryChapter | null = null;
    let previousOwner: StoryChapter | null = null;
    const update = () => {
      frame = 0;
      const anchors = getAnchors();
      if (!host.current || !stage.current || !enabled || anchors.some(({ section, node }) => !section || !node)) return;
      const currentNodes = new Set(anchors.map(({ node }) => node!));
      observedNodes.forEach((node) => { if (!currentNodes.has(node)) { resize.unobserve(node); observedNodes.delete(node); } });
      currentNodes.forEach((node) => { if (!observedNodes.has(node)) { resize.observe(node); observedNodes.add(node); } });
      const marker = window.innerHeight * 0.45;
      const owner = anchors.find(({ section }) => {
        const rect = section!.getBoundingClientRect();
        return rect.top <= marker && rect.bottom >= marker;
      }) || anchors[0];
      onOwnerChange(owner.id);
      const box = owner.node!.getBoundingClientRect();
      const { width, height } = box;
      host.current.style.width = `${width}px`;
      host.current.style.height = `${height}px`;
      host.current.style.transform = `translate3d(${box.left}px, ${box.top}px, 0)`;
      // Keep the WebGL viewport fixed while scrolling; scale its square stage
      // uniformly so resize-observer delays cannot crop or distort the figure.
      stage.current.style.transform = `translate3d(${(width - height) / 2}px, 0, 0) scale(${height / 640})`;
      const navBottom = document.querySelector('.story-nav')?.getBoundingClientRect().bottom || 80;
      const visibleHeight = Math.max(0, Math.min(box.bottom, window.innerHeight) - Math.max(box.top, navBottom));
      const visible = standAloneChapters.has(owner.id) && visibleHeight >= height * 0.9;
      setVisible(visible);
      host.current.style.visibility = visible ? 'visible' : 'hidden';
      host.current.dataset.characterOwner = owner.id;
      const model = owner.node!;
      const outfit = (model.dataset.characterOutfit || 'suit') as BrickOutfit;
      const interaction = (model.dataset.characterInteraction || 'idle') as BrickInteraction;
      const entering = visible && visibleOwner !== owner.id;
      const entry: BrickEntry = entering && previousOwner !== null && !reducedMotion.matches && outfit !== 'work' ? (window.scrollY >= previousScroll ? 'drop' : 'climb') : 'none';
      setPose((previous) => {
        if (entering) return { outfit, interaction, entry, entryKey: previous.entryKey + 1 };
        return previous.outfit === outfit && previous.interaction === interaction ? previous : { ...previous, outfit, interaction };
      });
      visibleOwner = visible ? owner.id : null;
      previousOwner = owner.id;
      previousScroll = window.scrollY;
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const resize = new ResizeObserver(schedule);
    const changes = new MutationObserver(schedule);
    changes.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['data-character-interaction', 'data-character-outfit'] });
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    reducedMotion.addEventListener('change', schedule);
    schedule();
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      changes.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      reducedMotion.removeEventListener('change', schedule);
    };
  }, [enabled, onOwnerChange]);

  return (
    <div ref={host} aria-hidden="true" data-persistent-story-character className="pointer-events-none fixed left-0 top-0 z-20" style={{ display: enabled ? 'block' : 'none', overflow: 'hidden' }}>
      <div ref={stage} style={{ width: 640, height: 640, transformOrigin: 'top left' }}>
        <CharacterCanvas active={enabled && visible} outfit={pose.outfit} interaction={pose.interaction} entry={pose.entry} entryKey={pose.entryKey} autoWave={pose.outfit !== 'work'} />
      </div>
    </div>
  );
}
