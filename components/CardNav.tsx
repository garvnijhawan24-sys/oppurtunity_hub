'use client';

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import ThemeToggle from './ThemeToggle';
import './CardNav.css';

// SSR-safe layout effect to avoid React warnings in Next.js
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export interface NavCardLink {
  label: string;
  href: string;
  ariaLabel?: string;
}

export interface CardNavItem {
  label: string;
  bgColor: string;
  textColor: string;
  links: NavCardLink[];
}

export interface CardNavProps {
  logo?: React.ReactNode;
  logoAlt?: string;
  items?: CardNavItem[];
  className?: string;
  ease?: string;
  baseColor?: string;
  menuColor?: string;
  buttonBgColor?: string;
  buttonTextColor?: string;
  ctaText?: string;
  ctaHref?: string;
}

const DEFAULT_ITEMS: CardNavItem[] = [
  {
    label: 'Explore',
    bgColor: '#18181b',
    textColor: '#ffffff',
    links: [
      { label: 'All Opportunities', href: '/explore', ariaLabel: 'Explore all opportunities' },
      { label: 'Hackathons', href: '/explore?category=Hackathon', ariaLabel: 'Browse hackathons' },
      { label: 'Internships', href: '/explore?category=Internship', ariaLabel: 'Browse internships' },
      { label: 'Workshops & Events', href: '/explore?category=Workshop', ariaLabel: 'Browse workshops' },
    ],
  },
  {
    label: 'My Hub',
    bgColor: '#27272a',
    textColor: '#ffffff',
    links: [
      { label: 'Saved Dashboard', href: '/dashboard', ariaLabel: 'Go to saved opportunities dashboard' },
      { label: 'Post Opportunity', href: '/add', ariaLabel: 'Submit a new opportunity' },
    ],
  },
  {
    label: 'Categories',
    bgColor: '#3f3f46',
    textColor: '#ffffff',
    links: [
      { label: 'Competitions', href: '/explore?category=Competition', ariaLabel: 'Browse student competitions' },
      { label: 'Open Source Community', href: '/explore', ariaLabel: 'Browse open-source opportunities' },
    ],
  },
];

export default function CardNav({
  items = DEFAULT_ITEMS,
  className = '',
  ease = 'power3.out',
  baseColor,
  menuColor,
  buttonBgColor,
  buttonTextColor,
  ctaText = 'Post',
  ctaHref = '/add',
}: CardNavProps) {
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const navRef = useRef<HTMLElement | null>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  const calculateHeight = (): number => {
    const navEl = navRef.current;
    if (!navEl) return 260;

    const contentEl = navEl.querySelector('.card-nav-content') as HTMLElement | null;
    if (contentEl) {
      const wasVisible = contentEl.style.visibility;
      const wasPointerEvents = contentEl.style.pointerEvents;
      const wasPosition = contentEl.style.position;
      const wasHeight = contentEl.style.height;

      contentEl.style.visibility = 'visible';
      contentEl.style.pointerEvents = 'auto';
      contentEl.style.position = 'static';
      contentEl.style.height = 'auto';

      void contentEl.offsetHeight;

      const topBar = 60;
      const padding = 16;
      const contentHeight = contentEl.scrollHeight;

      contentEl.style.visibility = wasVisible;
      contentEl.style.pointerEvents = wasPointerEvents;
      contentEl.style.position = wasPosition;
      contentEl.style.height = wasHeight;

      return topBar + contentHeight + padding;
    }
    return 260;
  };

  const createTimeline = () => {
    const navEl = navRef.current;
    if (!navEl) return null;

    gsap.set(navEl, { height: 60, overflow: 'hidden' });
    gsap.set(cardsRef.current.filter(Boolean), { y: 50, opacity: 0 });

    const tl = gsap.timeline({ paused: true });

    tl.to(navEl, {
      height: calculateHeight,
      duration: 0.4,
      ease,
    });

    tl.to(
      cardsRef.current.filter(Boolean),
      {
        y: 0,
        opacity: 1,
        duration: 0.35,
        ease,
        stagger: 0.08,
      },
      '-=0.1'
    );

    return tl;
  };

  useIsomorphicLayoutEffect(() => {
    const tl = createTimeline();
    tlRef.current = tl;

    return () => {
      tl?.kill();
      tlRef.current = null;
    };
  }, [ease, items]);

  useIsomorphicLayoutEffect(() => {
    const handleResize = () => {
      if (!tlRef.current) return;

      if (isExpanded) {
        const newHeight = calculateHeight();
        gsap.set(navRef.current, { height: newHeight });

        tlRef.current.kill();
        const newTl = createTimeline();
        if (newTl) {
          newTl.progress(1);
          tlRef.current = newTl;
        }
      } else {
        tlRef.current.kill();
        const newTl = createTimeline();
        if (newTl) {
          tlRef.current = newTl;
        }
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isExpanded]);

  const toggleMenu = () => {
    const tl = tlRef.current;
    if (!tl) return;
    if (!isExpanded) {
      setIsHamburgerOpen(true);
      setIsExpanded(true);
      tl.play(0);
    } else {
      setIsHamburgerOpen(false);
      tl.eventCallback('onReverseComplete', () => setIsExpanded(false));
      tl.reverse();
    }
  };

  const closeMenu = () => {
    if (isExpanded) {
      const tl = tlRef.current;
      if (!tl) return;
      setIsHamburgerOpen(false);
      tl.eventCallback('onReverseComplete', () => setIsExpanded(false));
      tl.reverse();
    }
  };

  const setCardRef = (i: number) => (el: HTMLDivElement | null) => {
    if (el) cardsRef.current[i] = el;
  };

  return (
    <div className={`card-nav-container ${className}`}>
      <nav
        ref={navRef}
        className={`card-nav ${isExpanded ? 'open' : ''}`}
        style={baseColor ? { backgroundColor: baseColor } : undefined}
      >
        <div className="card-nav-top">
          {/* Brand Logo & Title */}
          <div className="logo-container">
            <Link
              href="/"
              onClick={closeMenu}
              className="flex items-center gap-2 group"
              aria-label="OpportunityHub Home"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 text-white font-semibold text-xs dark:bg-white dark:text-zinc-900 shadow-2xs">
                OH
              </div>
              <span className="text-sm font-bold tracking-tight text-zinc-900 dark:text-white">
                OpportunityHub
              </span>
            </Link>
          </div>

          {/* Right Action Cluster: ThemeToggle + CTA Button + Hamburger */}
          <div className="flex items-center gap-2">
            <ThemeToggle />

            <Link
              href={ctaHref}
              onClick={closeMenu}
              className="card-nav-cta-button"
              style={{
                backgroundColor: buttonBgColor,
                color: buttonTextColor,
              }}
            >
              {ctaText}
            </Link>

            <div
              className={`hamburger-menu ${isHamburgerOpen ? 'open' : ''}`}
              onClick={toggleMenu}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  toggleMenu();
                }
              }}
              role="button"
              aria-label={isExpanded ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isExpanded}
              tabIndex={0}
              style={menuColor ? { color: menuColor } : undefined}
            >
              <div className="hamburger-line" />
              <div className="hamburger-line" />
            </div>
          </div>
        </div>

        {/* Expandable Navigation Cards */}
        <div className="card-nav-content" aria-hidden={!isExpanded}>
          {(items || []).slice(0, 3).map((item, idx) => (
            <div
              key={`${item.label}-${idx}`}
              className="nav-card"
              ref={setCardRef(idx)}
              style={{
                backgroundColor: item.bgColor,
                color: item.textColor,
              }}
            >
              <div className="nav-card-label">{item.label}</div>
              <div className="nav-card-links">
                {item.links?.map((lnk, i) => (
                  <Link
                    key={`${lnk.label}-${i}`}
                    href={lnk.href}
                    onClick={closeMenu}
                    className="nav-card-link"
                    aria-label={lnk.ariaLabel}
                  >
                    <span>{lnk.label}</span>
                    {/* SVG ArrowUpRight icon */}
                    <svg
                      className="nav-card-link-icon"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.2}
                        d="M7 17L17 7M17 7H7M17 7v10"
                      />
                    </svg>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </nav>
    </div>
  );
}
