// app/actions/auth.actions.ts
'use server'

import { cookies } from 'next/headers';

// กำหนด Type ผลลัพธ์สำหรับ Auth Actions
type AuthResponse = {
  success: boolean;
  message: string;
  field?: string;
};

// ฟังก์ชันสำหรับสมัครสมาชิกผู้ใช้งานใหม่
export async function registerUserAction(data: Record<string, unknown>): Promise<AuthResponse> {
  try {
    const response = await fetch(`${process.env.BACKEND_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      return { 
        success: false, 
        message: result.error || 'เกิดข้อผิดพลาด',
        field: result.field
      };
    }

    return { success: true, message: 'สมัครสมาชิกสำเร็จ!' };
  } catch {
    return { success: false, message: 'ไม่สามารถติดต่อเซิร์ฟเวอร์ได้' };
  }
}

// ฟังก์ชันสำหรับเข้าสู่ระบบ
export async function loginUserAction(data: Record<string, unknown>): Promise<AuthResponse> {
  try {
    const response = await fetch(`${process.env.BACKEND_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      return { success: false, message: result.error, field: result.field };
    }

    const cookieStore = await cookies();
    
    // บันทึก JWT Token ลงใน HTTP-Only Cookie
    cookieStore.set('token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 วัน
    });

    return { success: true, message: result.message };
  } catch {
    return { success: false, message: 'ไม่สามารถติดต่อเซิร์ฟเวอร์ได้' };
  }
}