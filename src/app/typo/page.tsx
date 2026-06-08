import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { BluetoothIcon } from "lucide-react";

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

      <section className="space-y-4 flex flex-col border p-8">
        <h2 className="text-2xl font-semibold">Checkbox</h2>
        <div className="flex flex-row space-x-4 ">
          <Checkbox></Checkbox>
          <Checkbox defaultChecked></Checkbox>
          <Checkbox disabled></Checkbox>
          <Checkbox defaultChecked disabled></Checkbox>
        </div>
      </section>

      <section className="space-y-4 flex flex-col border p-8">
        <h2 className="text-2xl font-semibold">Radio Group</h2>
        <div className="flex flex-row space-x-4 ">
              <RadioGroup defaultValue="comfortable" className="w-fit">
      <div className="flex items-center gap-3">
        <RadioGroupItem value="default" id="r1" />
        <Label htmlFor="r1">Default</Label>
      </div>
      <div className="flex items-center gap-3">
        <RadioGroupItem value="comfortable" id="r2" />
        <Label htmlFor="r2">Comfortable</Label>
      </div>
      <div className="flex items-center gap-3">
        <RadioGroupItem value="compact" id="r3" />
        <Label htmlFor="r3">Compact</Label>
      </div>
    </RadioGroup>
        </div>
      </section>

      <section className="space-y-4 flex flex-col border p-8">
        <h2 className="text-2xl font-semibold">Alert Dialogs</h2>
        <div className="flex flex-row space-x-4 ">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline">Show Dialog</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="secondary">Show Dialog</Button>
            </AlertDialogTrigger>
            <AlertDialogContent size="sm">
              <AlertDialogHeader>
                <AlertDialogMedia>
                  <BluetoothIcon />
                </AlertDialogMedia>
                <AlertDialogTitle>Allow accessory to connect?</AlertDialogTitle>
                <AlertDialogDescription>
                  Do you want to allow the USB accessory to connect to this
                  device?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Don&apos;t allow</AlertDialogCancel>
                <AlertDialogAction>Allow</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </section>
    </div>
  );
}
