import { colors } from '../tokens/colors';
import { typography } from '../tokens/typography';
import { spacing, borderRadius, shadows } from '../tokens/spacing';
import { transitions } from '../tokens/layout';

export const globalStyles = `
  /* Reset and base styles */
  *, *::before, *::after {
    box-sizing: border-box;
  }

  html {
    line-height: 1.15;
    -webkit-text-size-adjust: 100%;
  }

  body {
    margin: 0;
    font-family: Inter, ui-sans-serif, system-ui, sans-serif;
    font-size: 1rem;
    line-height: 1.5;
    color: #111827;
    background-color: #f9fafb;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* Typography */
  h1, h2, h3, h4, h5, h6 {
    margin: 0;
    font-weight: ${typography.fontWeight.bold};
    line-height: ${typography.lineHeight.tight};
  }

  h1 { font-size: ${typography.fontSize['3xl']}; }
  h2 { font-size: ${typography.fontSize['2xl']}; }
  h3 { font-size: ${typography.fontSize.xl}; }
  h4 { font-size: ${typography.fontSize.lg}; }
  h5 { font-size: ${typography.fontSize.base}; }
  h6 { font-size: ${typography.fontSize.sm}; }

  p {
    margin: 0 0 ${spacing[4]} 0;
  }

  /* Links */
  a {
    color: ${colors.primary[600]};
    text-decoration: none;
    transition: ${transitions.colors};
  }

  a:hover {
    color: ${colors.primary[700]};
    text-decoration: underline;
  }

  /* Focus styles */
  *:focus {
    outline: 2px solid ${colors.primary[500]};
    outline-offset: 2px;
  }

  /* Buttons */
  button {
    cursor: pointer;
    border: none;
    background: none;
    padding: 0;
    font: inherit;
  }

  /* Forms */
  input, select, textarea {
    font: inherit;
  }

  /* Lists */
  ul, ol {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  /* Tables */
  table {
    border-collapse: collapse;
    width: 100%;
  }

  /* Images */
  img {
    max-width: 100%;
    height: auto;
    display: block;
  }

  /* Utility classes */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  .container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 ${spacing[4]};
  }

  .flex {
    display: flex;
  }

  .items-center {
    align-items: center;
  }

  .justify-center {
    justify-content: center;
  }

  .justify-between {
    justify-content: space-between;
  }

  .flex-col {
    flex-direction: column;
  }

  .grid {
    display: grid;
  }

  .hidden {
    display: none;
  }

  .relative {
    position: relative;
  }

  .absolute {
    position: absolute;
  }

  .fixed {
    position: fixed;
  }

  .inset-0 {
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }

  .w-full {
    width: 100%;
  }

  .h-full {
    height: 100%;
  }

  .min-h-screen {
    min-height: 100vh;
  }

  .overflow-hidden {
    overflow: hidden;
  }

  .overflow-auto {
    overflow: auto;
  }

  .text-center {
    text-align: center;
  }

  .text-left {
    text-align: left;
  }

  .text-right {
    text-align: right;
  }

  .uppercase {
    text-transform: uppercase;
  }

  .lowercase {
    text-transform: lowercase;
  }

  .capitalize {
    text-transform: capitalize;
  }

  .truncate {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .border {
    border: 1px solid ${colors.gray[200]};
  }

  .border-0 {
    border: 0;
  }

  .rounded {
    border-radius: ${borderRadius.base};
  }

  .rounded-full {
    border-radius: ${borderRadius.full};
  }

  .shadow {
    box-shadow: ${shadows.base};
  }

  .shadow-lg {
    box-shadow: ${shadows.lg};
  }

  .transition {
    transition: ${transitions.all};
  }

  .cursor-pointer {
    cursor: pointer;
  }

  .cursor-not-allowed {
    cursor: not-allowed;
  }

  .select-none {
    user-select: none;
  }

  .pointer-events-none {
    pointer-events: none;
  }
`;
