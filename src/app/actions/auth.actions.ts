// app/actions/auth.actions.ts
'use server'

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