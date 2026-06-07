import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function TypographyPage() {
  return (
    <div className="p-8 space-y-6 border">
      <div className="p-8 space-y-6 border">
        <h1 className="text-4xl font-bold">Typography Page</h1>
        <p className="text-lg">
          นี่คือตัวอย่างหน้า Typography ที่ใช้ฟอนต์ Noto Sans Thai
        </p>
        <p className="text-sm text-gray-500">
          ฟอนต์นี้ถูกนำเข้าจาก Google Fonts และตั้งค่าใน RootLayout
        </p>
      </div>

      <section className="space-y-4 flex flex-col border p-8">
        <h2 className="text-2xl font-semibold">Buttons</h2>
        <div className="flex flex-row space-x-4 ">
          <Button className="w-auto">Default</Button>
          <Button className="w-auto" variant="outline">
            Outline
          </Button>
          <Button className="w-auto" variant="secondary">
            Secondary
          </Button>
          <Button className="w-auto" variant="ghost">
            Ghost
          </Button>
          <Button className="w-auto" variant="link">
            Link
          </Button>
          <Button className="w-auto" variant="destructive">
            Destructive
          </Button>
          <Button className="w-auto" variant="soft">
            Soft
          </Button>
        </div>
      </section>

      <section className="space-y-4 flex flex-col border p-8">
        <div className="flex flex-row space-x-4 ">
          <Badge variant="default">Default</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="destructive">Destructive</Badge>
        </div>
      </section>
    </div>
  );
}
