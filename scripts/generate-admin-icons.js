const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function generateAdminIcons() {
  const publicDir = path.join(__dirname, '..', 'public');
  const adminDir = path.join(publicDir, 'admin');

  if (!fs.existsSync(adminDir)) {
    fs.mkdirSync(adminDir, { recursive: true });
  }

  // 1. Generate 512x512 admin icon
  const badgeSvg512 = Buffer.from(`
    <svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
      <!-- Dark gradient border frame -->
      <rect x="6" y="6" width="500" height="500" rx="100" fill="none" stroke="#D4AF37" stroke-width="8" opacity="0.85"/>
      
      <!-- Top Right 'ADMIN' Shield Badge -->
      <g transform="translate(330, 24)">
        <rect width="158" height="52" rx="26" fill="#1C1917" stroke="#D4AF37" stroke-width="3" filter="drop-shadow(0px 4px 8px rgba(0,0,0,0.5))"/>
        <text x="79" y="34" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="22" fill="#F6E05E" text-anchor="middle" letter-spacing="2">ADMIN</text>
      </g>

      <!-- Bottom Banner Pill -->
      <g transform="translate(56, 400)">
        <rect width="400" height="74" rx="37" fill="#1C1917" stroke="#F59E0B" stroke-width="4" filter="drop-shadow(0px 6px 14px rgba(0,0,0,0.6))"/>
        <linearGradient id="goldText" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FDE68A"/>
          <stop offset="50%" stop-color="#F59E0B"/>
          <stop offset="100%" stop-color="#D97706"/>
        </linearGradient>
        <text x="200" y="47" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="28" fill="url(#goldText)" text-anchor="middle" letter-spacing="3">★ KS ADMIN ★</text>
      </g>
    </svg>
  `);

  await sharp(path.join(publicDir, 'icon-512.png'))
    .resize(512, 512)
    .composite([
      {
        input: badgeSvg512,
        top: 0,
        left: 0,
      },
    ])
    .png({ quality: 95 })
    .toFile(path.join(adminDir, 'icon-admin-512.png'));

  console.log('Created public/admin/icon-admin-512.png');

  // 2. Generate 192x192 admin icon
  const badgeSvg192 = Buffer.from(`
    <svg width="192" height="192" viewBox="0 0 192 192" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="3" width="186" height="186" rx="38" fill="none" stroke="#D4AF37" stroke-width="4" opacity="0.85"/>
      <g transform="translate(20, 146)">
        <rect width="152" height="34" rx="17" fill="#1C1917" stroke="#F59E0B" stroke-width="2.5" filter="drop-shadow(0px 3px 6px rgba(0,0,0,0.6))"/>
        <text x="76" y="23" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="13" fill="#FDE68A" text-anchor="middle" letter-spacing="1.5">★ ADMIN ★</text>
      </g>
    </svg>
  `);

  await sharp(path.join(publicDir, 'icon-192.png'))
    .resize(192, 192)
    .composite([
      {
        input: badgeSvg192,
        top: 0,
        left: 0,
      },
    ])
    .png({ quality: 95 })
    .toFile(path.join(adminDir, 'icon-admin-192.png'));

  console.log('Created public/admin/icon-admin-192.png');
}

generateAdminIcons().catch((err) => {
  console.error('Failed to generate admin icons:', err);
  process.exit(1);
});
