import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Service from '@/models/Service';
import User from '@/models/User';
import jwt from 'jsonwebtoken';
import { ensureDefaultData } from '@/lib/seedData';

const JWT_SECRET = process.env.JWT_SECRET || 'databaj-super-secret-jwt-key-2026';

function getSuperAdminFromRequest(request) {
  const token = request.cookies.get('databaj_token')?.value || request.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role === 'super_admin') return decoded;
    return null;
  } catch {
    return null;
  }
}

export async function GET(request) {
  try {
    await connectToDatabase();
    await ensureDefaultData();

    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    if (slug) {
      const service = await Service.findOne({ slug }).lean();
      if (!service) {
        return NextResponse.json({ success: false, message: 'Service not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, service });
    }

    const all = searchParams.get('all') === 'true';
    const filter = all ? {} : { isActive: true };
    const services = await Service.find(filter).sort({ order: 1, createdAt: 1 }).lean();

    return NextResponse.json({
      success: true,
      services,
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectToDatabase();
    const superAdmin = getSuperAdminFromRequest(request);

    if (!superAdmin) {
      return NextResponse.json({ success: false, message: 'Super admin authorization required' }, { status: 403 });
    }

    const body = await request.json();
    const { _id, title, slug, shortDescription, fullDescription, icon, badge, features, order, isActive } = body;

    if (!title || !shortDescription) {
      return NextResponse.json({ success: false, message: 'Title and short description are required' }, { status: 400 });
    }

    const serviceSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    if (_id) {
      // Update existing service
      const updatedService = await Service.findByIdAndUpdate(
        _id,
        {
          title,
          slug: serviceSlug,
          shortDescription,
          fullDescription: fullDescription || '',
          icon: icon || 'Code',
          badge: badge || '',
          features: Array.isArray(features) ? features : (features ? features.split('\n').filter(Boolean) : []),
          order: Number(order) || 0,
          isActive: isActive !== undefined ? isActive : true,
        },
        { new: true }
      );
      return NextResponse.json({
        success: true,
        message: 'Service updated successfully!',
        service: updatedService,
      });
    }

    // Create new service
    const newService = await Service.create({
      title,
      slug: serviceSlug,
      shortDescription,
      fullDescription: fullDescription || '',
      icon: icon || 'Code',
      badge: badge || '',
      features: Array.isArray(features) ? features : (features ? features.split('\n').filter(Boolean) : []),
      order: Number(order) || 0,
      isActive: isActive !== undefined ? isActive : true,
    });

    return NextResponse.json({
      success: true,
      message: 'Service created successfully!',
      service: newService,
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    await connectToDatabase();
    const superAdmin = getSuperAdminFromRequest(request);

    if (!superAdmin) {
      return NextResponse.json({ success: false, message: 'Super admin authorization required' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'Service ID is required' }, { status: 400 });
    }

    await Service.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: 'Service deleted successfully!',
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
