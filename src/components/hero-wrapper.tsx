'use client';

import dynamic from 'next/dynamic';

const Hero = dynamic(() => import('@/components/ui/neural-network-hero'), {
  ssr: false,
  loading: () => (
    <section className="relative min-h-svh w-full bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-400" />
  ),
});

interface HeroWrapperProps {
  title: string;
  description: string;
  badgeText?: string;
  badgeLabel?: string;
  ctaButtons?: Array<{ text: string; href: string; primary?: boolean }>;
  microDetails?: Array<string>;
}

export default function HeroWrapper(props: HeroWrapperProps) {
  return <Hero {...props} />;
}
