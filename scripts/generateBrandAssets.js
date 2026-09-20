import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicDir = path.join(__dirname, '../public');
const brandDir = path.join(publicDir, 'brand');

if (!fs.existsSync(brandDir)) {
  fs.mkdirSync(brandDir, { recursive: true });
}

// Color Palette Constants
const COLORS = {
  primaryBlue: '#0EA5E9',
  indigo: '#6366F1',
  cyan: '#22D3EE',
  light: '#F8FAFC',
  muted: '#94A3B8',
  darkBg: '#0B1220',
  darkCard: '#0F172A',
  border: '#1E293B',
};

// SVG Definitions for the Stylized Forward-Motion "E" Logo Mark
const GRADIENT_DEF = `
  <defs>
    <linearGradient id="execoraGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#22D3EE" />
      <stop offset="50%" stop-color="#0EA5E9" />
      <stop offset="100%" stop-color="#6366F1" />
    </linearGradient>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0B1220" />
      <stop offset="100%" stop-color="#0F172A" />
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>
`;

// Stylized "E" Icon Path
const ICON_PATH = `
  <g transform="translate(10, 10)">
    <!-- Top Bar -->
    <path d="M 15 10 L 85 10 L 65 32 L 35 32 Z" fill="url(#execoraGrad)" />
    <!-- Mid Bar -->
    <path d="M 25 38 L 75 38 L 58 58 L 25 58 Z" fill="url(#execoraGrad)" />
    <!-- Bottom Bar -->
    <path d="M 15 64 L 85 64 L 65 86 L 15 86 Z" fill="url(#execoraGrad)" />
    <!-- Spine Link -->
    <path d="M 15 10 L 35 32 L 25 58 L 15 86 L 5 86 L 5 10 Z" fill="url(#execoraGrad)" opacity="0.9" />
  </g>
`;

// 1. Icon Only SVG
const iconSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 115 105" width="512" height="512">
  ${GRADIENT_DEF}
  <rect width="115" height="105" rx="20" fill="transparent" />
  ${ICON_PATH}
</svg>`;

// 2. Horizontal Primary Logo SVG
const logoHorizontalSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 130" width="1080" height="260">
  ${GRADIENT_DEF}
  <g transform="translate(10, 15) scale(1.05)">
    ${ICON_PATH}
  </g>
  <text x="145" y="72" font-family="Inter, system-ui, sans-serif" font-size="54" font-weight="800" fill="#F8FAFC" letter-spacing="-1">Execora</text>
  <text x="147" y="98" font-family="Inter, system-ui, sans-serif" font-size="18" font-weight="400" fill="#94A3B8" letter-spacing="0.2">From information to execution.</text>
</svg>`;

// 3. Vertical Stacked Logo SVG
const logoVerticalSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 320" width="800" height="640">
  ${GRADIENT_DEF}
  <g transform="translate(142, 20) scale(1.1)">
    ${ICON_PATH}
  </g>
  <text x="200" y="210" text-anchor="middle" font-family="Inter, system-ui, sans-serif" font-size="52" font-weight="800" fill="#F8FAFC" letter-spacing="-1">Execora</text>
  <text x="200" y="245" text-anchor="middle" font-family="Inter, system-ui, sans-serif" font-size="18" font-weight="400" fill="#94A3B8" letter-spacing="0.2">From information to execution.</text>
</svg>`;

// 4. App Icon SVG
const appIconSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  ${GRADIENT_DEF}
  <rect width="512" height="512" rx="110" fill="url(#bgGrad)" stroke="#1E293B" stroke-width="4" />
  <g transform="translate(106, 106) scale(2.6)" filter="url(#glow)">
    ${ICON_PATH}
  </g>
</svg>`;

// 5. Social Media Preview Banner SVG
const socialPreviewSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  ${GRADIENT_DEF}
  <rect width="1200" height="630" fill="url(#bgGrad)" />
  <circle cx="200" cy="150" r="300" fill="#0EA5E9" opacity="0.08" filter="blur(60px)" />
  <circle cx="1000" cy="450" r="250" fill="#6366F1" opacity="0.08" filter="blur(60px)" />
  <g transform="translate(100, 200)">
    <g transform="translate(0, 0) scale(1.6)">
      ${ICON_PATH}
    </g>
    <text x="200" y="90" font-family="Inter, system-ui, sans-serif" font-size="80" font-weight="800" fill="#F8FAFC" letter-spacing="-2">Execora</text>
    <text x="204" y="135" font-family="Inter, system-ui, sans-serif" font-size="28" font-weight="500" fill="#94A3B8" letter-spacing="0.5">From information to execution.</text>
  </g>
  <g transform="translate(780, 180)">
    <rect width="320" height="270" rx="24" fill="#0F172A" stroke="#1E293B" stroke-width="2" />
    <text x="40" y="70" font-family="Inter, system-ui, sans-serif" font-size="20" font-weight="700" fill="#22D3EE" letter-spacing="1.5">UNDERSTAND</text>
    <text x="40" y="120" font-family="Inter, system-ui, sans-serif" font-size="20" font-weight="700" fill="#0EA5E9" letter-spacing="1.5">PRIORITIZE</text>
    <text x="40" y="170" font-family="Inter, system-ui, sans-serif" font-size="20" font-weight="700" fill="#6366F1" letter-spacing="1.5">PLAN</text>
    <text x="40" y="220" font-family="Inter, system-ui, sans-serif" font-size="20" font-weight="700" fill="#F8FAFC" letter-spacing="1.5">EXECUTE</text>
  </g>
  <text x="600" y="570" text-anchor="middle" font-family="Inter, system-ui, sans-serif" font-size="22" font-weight="500" fill="#94A3B8" letter-spacing="1.5">“Execora — From information to execution.”</text>
</svg>`;

async function generateAssets() {
  console.log('🎨 Generating Execora Vector SVG & PNG Brand Assets...');

  // Save SVG Files
  fs.writeFileSync(path.join(brandDir, 'icon.svg'), iconSVG);
  fs.writeFileSync(path.join(brandDir, 'logo.svg'), logoHorizontalSVG);
  fs.writeFileSync(path.join(brandDir, 'logo-vertical.svg'), logoVerticalSVG);
  fs.writeFileSync(path.join(brandDir, 'app-icon.svg'), appIconSVG);
  fs.writeFileSync(path.join(brandDir, 'social-preview.svg'), socialPreviewSVG);

  fs.writeFileSync(path.join(publicDir, 'logo.svg'), logoHorizontalSVG);
  fs.writeFileSync(path.join(publicDir, 'icon.svg'), iconSVG);
  fs.writeFileSync(path.join(publicDir, 'favicon.svg'), iconSVG);

  try {
    const sharpModule = await import('sharp');
    const sharp = sharpModule.default;

    // Render PNG Assets using Sharp
    await sharp(Buffer.from(iconSVG)).resize(512, 512).png().toFile(path.join(brandDir, 'icon.png'));
    await sharp(Buffer.from(iconSVG)).resize(512, 512).png().toFile(path.join(publicDir, 'icon.png'));

    await sharp(Buffer.from(logoHorizontalSVG)).resize(1080, 260).png().toFile(path.join(brandDir, 'logo.png'));
    await sharp(Buffer.from(logoHorizontalSVG)).resize(1080, 260).png().toFile(path.join(publicDir, 'logo.png'));

    await sharp(Buffer.from(logoVerticalSVG)).resize(800, 640).png().toFile(path.join(brandDir, 'logo-vertical.png'));
    await sharp(Buffer.from(appIconSVG)).resize(512, 512).png().toFile(path.join(brandDir, 'app-icon.png'));
    await sharp(Buffer.from(socialPreviewSVG)).resize(1200, 630).png().toFile(path.join(brandDir, 'social-preview.png'));

    await sharp(Buffer.from(iconSVG)).resize(64, 64).png().toFile(path.join(brandDir, 'favicon.png'));
    await sharp(Buffer.from(iconSVG)).resize(64, 64).png().toFile(path.join(publicDir, 'favicon.png'));
    await sharp(Buffer.from(iconSVG)).resize(32, 32).toFile(path.join(brandDir, 'favicon.ico'));
    await sharp(Buffer.from(iconSVG)).resize(32, 32).toFile(path.join(publicDir, 'favicon.ico'));

    console.log('✅ Brand SVG & PNG assets generated successfully!');
  } catch (e) {
    console.log('ℹ️ Sharp library not available in build environment. SVG assets written successfully.');
  }
}

generateAssets().catch(err => {
  console.error('Error generating assets:', err);
});
