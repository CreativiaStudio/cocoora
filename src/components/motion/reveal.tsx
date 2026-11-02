'use client';

import * as React from 'react';
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
  type Variants,
} from 'motion/react';
import { EASE, DUR, STAGGER } from '@/components/motion/tokens';

/* -------------------------------------------------------------------------- */
/* 1) Reveal                                                                  */
/* -------------------------------------------------------------------------- */

type RevealAs = 'div' | 'section' | 'article' | 'span';

export interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: RevealAs;
}

export function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
  as = 'div',
}: RevealProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    const Tag: React.ElementType = as;
    return <Tag className={className}>{children}</Tag>;
  }

  const MotionTag = motion[as] as React.ElementType;

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y, filter: 'blur(6px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-8% 0px' }}
      transition={{ duration: DUR.slow, ease: EASE.out, delay }}
    >
      {children}
    </MotionTag>
  );
}

/* -------------------------------------------------------------------------- */
/* 2) RevealStagger + RevealItem                                              */
/* -------------------------------------------------------------------------- */

const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DUR.slow, ease: EASE.out },
  },
};

export interface RevealStaggerProps {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
}

export function RevealStagger({
  children,
  className,
  stagger = STAGGER.base,
}: RevealStaggerProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-8% 0px' }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: stagger,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export interface RevealItemProps {
  children: React.ReactNode;
  className?: string;
}

export function RevealItem({ children, className }: RevealItemProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div className={className} variants={staggerItemVariants}>
      {children}
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/* 3) MaskLines                                                               */
/* -------------------------------------------------------------------------- */

type MaskLinesAs = 'h1' | 'h2' | 'h3' | 'p';

const maskLineItemVariants: Variants = {
  hidden: { y: '110%', rotate: 1.5 },
  visible: {
    y: '0%',
    rotate: 0,
    transition: { duration: DUR.slow, ease: EASE.out },
  },
};

export interface MaskLinesProps {
  lines: string[];
  className?: string;
  lineClassName?: string;
  delay?: number;
  as?: MaskLinesAs;
}

export function MaskLines({
  lines,
  className,
  lineClassName,
  delay = 0,
  as = 'h2',
}: MaskLinesProps) {
  const shouldReduceMotion = useReducedMotion();
  const ariaLabel = lines.join(' ');

  if (shouldReduceMotion) {
    const Tag: React.ElementType = as;
    return (
      <Tag className={className} aria-label={ariaLabel}>
        {lines.map((line, i) => (
          <span
            key={`${line}-${i}`}
            aria-hidden="true"
            className={`block ${lineClassName ?? ''}`}
          >
            {line}
          </span>
        ))}
      </Tag>
    );
  }

  const MotionTag = motion[as] as React.ElementType;

  return (
    <MotionTag
      className={className}
      aria-label={ariaLabel}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-8% 0px' }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.1,
            delayChildren: delay,
          },
        },
      }}
    >
      {lines.map((line, i) => (
        <span
          key={`${line}-${i}`}
          aria-hidden="true"
          className={`block overflow-hidden pb-[0.12em] ${lineClassName ?? ''}`}
        >
          <motion.span className="block" variants={maskLineItemVariants}>
            {line}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  );
}

/* -------------------------------------------------------------------------- */
/* 4) ScrollWords                                                             */
/* -------------------------------------------------------------------------- */

interface WordProps {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
}

function Word({ children, progress, range }: WordProps) {
  const opacity = useTransform(progress, range, [0.2, 1]);

  return (
    <motion.span className="inline-block" style={{ opacity }}>
      {children}
    </motion.span>
  );
}

export interface ScrollWordsProps {
  text: string;
  className?: string;
}

export function ScrollWords({ text, className }: ScrollWordsProps) {
  const shouldReduceMotion = useReducedMotion();
  const ref = React.useRef<HTMLParagraphElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 85%', 'end 45%'],
  });

  const words = React.useMemo(
    () => text.split(/\s+/).filter(Boolean),
    [text],
  );

  if (shouldReduceMotion) {
    return (
      <p ref={ref} className={`relative ${className ?? ''}`.trim()}>
        {text}
      </p>
    );
  }

  return (
    <p ref={ref} className={`relative ${className ?? ''}`.trim()}>
      {words.map((word, i) => {
        const start = i / words.length;
        const end = (i + 1) / words.length;

        return (
          <React.Fragment key={`${word}-${i}`}>
            <Word progress={scrollYProgress} range={[start, end]}>
              {word}
            </Word>
            {i < words.length - 1 ? ' ' : null}
          </React.Fragment>
        );
      })}
    </p>
  );
}