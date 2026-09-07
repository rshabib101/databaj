import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'databaj-super-secret-jwt-key-2026';

function getUserFromRequest(request) {
  const token =
    request.cookies.get('databaj_token')?.value ||
    request.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) return null;
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

export async function POST(request) {
  try {
    const authUser = getUserFromRequest(request);
    if (!authUser) {
      return NextResponse.json({ success: false, message: 'অননুমোদিত অ্যাক্সেস' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ success: false, message: 'কোনো ফাইল পাওয়া যায়নি' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Ensure uploads directory exists
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'chat');
    await mkdir(uploadDir, { recursive: true });

    // Clean filename and add timestamp prefix
    const originalName = file.name || 'attachment';
    const ext = path.extname(originalName) || '';
    const baseName = path.basename(originalName, ext).replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 40);
    const uniqueFileName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}_${baseName}${ext}`;

    const filePath = path.join(uploadDir, uniqueFileName);
    await writeFile(filePath, buffer);

    const publicUrl = `/uploads/chat/${uniqueFileName}`;

    return NextResponse.json({
      success: true,
      file: {
        url: publicUrl,
        fileName: originalName,
        fileType: file.type || 'application/octet-stream',
        fileSize: file.size || buffer.length,
      },
    });
  } catch (error) {
    console.error('Chat file upload error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
