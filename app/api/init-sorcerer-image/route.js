import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const srcPath = 'C:\\Users\\b\\.gemini\\antigravity-ide\\brain\\303191d3-59d0-4359-b690-930bfb3c76c6\\.user_uploaded\\media_1791215906052.jpg';
    const destDir = path.join(process.cwd(), 'public');
    const destPath = path.join(destDir, 'sorcerer-brands.jpg');

    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, destPath);
      return NextResponse.json({ success: true, message: 'Copied successfully', exists: fs.existsSync(destPath) });
    } else {
      return NextResponse.json({ success: false, message: 'Source image not found: ' + srcPath });
    }
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message });
  }
}
