import { z } from "zod";

const registerSchema = z
  .object({
    username: z.string().min(3, "กรุณากรอกชื่อผู้ใช้อย่างน้อย 3 ตัวอักษร"),
    password: z.string().min(8, "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร"),
    confirmPassword: z.string().min(8, "กรุณายืนยันรหัสผ่าน"),
    firstName: z.string().min(1, "กรุณากรอกชื่อ"),
    lastName: z.string().min(1, "กรุณากรอกนามสกุล"),
    position: z.string().min(1, "กรุณากรอกตำแหน่ง"),
    department: z.string().min(1, "กรุณากรอกหน่วยงาน"),
    division: z.string().min(1, "กรุณากรอกส่วนราชการ"),
    email: z.string().email("รูปแบบอีเมลไม่ถูกต้อง"),
    mobilePhone: z.string().min(6, "กรุณากรอกเบอร์มือถือให้ถูกต้อง"),
    officePhone: z.string().min(6, "กรุณากรอกเบอร์สำนักงานให้ถูกต้อง"),
    internalExtension: z.string().min(1, "กรุณากรอกเบอร์ภายใน"),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน",
    path: ["confirmPassword"],
  });

type RegisterValues = z.infer<typeof registerSchema>;

type RegisterFieldProps = {
  label: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
};

export { registerSchema };
export type { RegisterValues, RegisterFieldProps };