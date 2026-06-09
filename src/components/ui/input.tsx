import * as React from "react"

import { cn } from "@/lib/utils"

// 1. ขยาย Interface ให้รองรับ prop 'error' (ส่งมาเป็น boolean หรือ string ก็ได้)
interface InputProps extends React.ComponentProps<"input"> {
  error?: boolean | string;
}

function Input({ className, type, error, ...props }: InputProps) {
  return (
    <input
      type={type}
      data-slot="input"
      // 2. ถ้ามี error ให้ตั้งค่า aria-invalid="true" เพื่อให้รองรับคลาสจำพวก aria-invalid:
      aria-invalid={error ? "true" : undefined}
      className={cn(
        "h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-input/30",
        
        // error state
        "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 focus-visible:aria-invalid:border-destructive",
        "dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        
        className
      )}
      {...props}
    />
  )
}

export { Input }