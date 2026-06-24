// app/actions/auth.actions.ts
'use server'
import { cookies } from 'next/headers';

export async function registerUserAction(data: any) {
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
        field: result.field // รับค่า field (เช่น "email") จาก Backend
      };
    }

    return { success: true, message: 'สมัครสมาชิกสำเร็จ!' };

  } catch (error) {
    return { success: false, message: 'ไม่สามารถติดต่อเซิร์ฟเวอร์ได้' };
  }
}

export async function loginUserAction(data: any) {
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

    // ประกาศตัวแปรรับค่าที่รอ (await) จาก cookies()
    const cookieStore = await cookies();
    
    // ตั้งค่า token ใน cookie โดยใช้ cookieStore
    cookieStore.set('token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 วัน
    });

    return { success: true, message: result.message };

  } catch (error) {
    return { success: false, message: 'ไม่สามารถติดต่อเซิร์ฟเวอร์ได้' };
  }
}