/**
 * (c) 2025 Cosmic Life Mandala – Radial Timeline Project
 * Founder and Author: Jamal Ali
 * Built by ChatGPT & Lovable · MIT Licensed
 */

import React from 'react';

// Disabled motion components - no animations
export const motion = {
  div: React.forwardRef<HTMLDivElement, any>(({ children, style, className, ...props }, ref) => (
    <div ref={ref} style={style} className={className} {...props}>
      {children}
    </div>
  )),
  g: React.forwardRef<SVGGElement, any>(({ children, style, className, ...props }, ref) => (
    <g ref={ref} style={style} className={className} {...props}>
      {children}
    </g>
  )),
  path: React.forwardRef<SVGPathElement, any>(({ children, style, className, ...props }, ref) => (
    <path ref={ref} style={style} className={className} {...props}>
      {children}
    </path>
  )),
  circle: React.forwardRef<SVGCircleElement, any>(({ children, style, className, ...props }, ref) => (
    <circle ref={ref} style={style} className={className} {...props}>
      {children}
    </circle>
  )),
  text: React.forwardRef<SVGTextElement, any>(({ children, style, className, ...props }, ref) => (
    <text ref={ref} style={style} className={className} {...props}>
      {children}
    </text>
  )),
  rect: React.forwardRef<SVGRectElement, any>(({ children, style, className, ...props }, ref) => (
    <rect ref={ref} style={style} className={className} {...props}>
      {children}
    </rect>
  )),
  svg: React.forwardRef<SVGSVGElement, any>(({ children, style, className, ...props }, ref) => (
    <svg ref={ref} style={style} className={className} {...props}>
      {children}
    </svg>
  )),
  span: React.forwardRef<HTMLSpanElement, any>(({ children, style, className, ...props }, ref) => (
    <span ref={ref} style={style} className={className} {...props}>
      {children}
    </span>
  )),
  button: React.forwardRef<HTMLButtonElement, any>(({ children, style, className, ...props }, ref) => (
    <button ref={ref} style={style} className={className} {...props}>
      {children}
    </button>
  )),
  line: React.forwardRef<SVGLineElement, any>(({ children, style, className, ...props }, ref) => (
    <line ref={ref} style={style} className={className} {...props}>
      {children}
    </line>
  )),
  p: React.forwardRef<HTMLParagraphElement, any>(({ children, style, className, ...props }, ref) => (
    <p ref={ref} style={style} className={className} {...props}>
      {children}
    </p>
  ))
};

export const AnimatePresence: React.FC<{ children: React.ReactNode }> = ({ children }) => <>{children}</>;