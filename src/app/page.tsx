import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  ExternalLink,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

import { Button } from "@/components/ui/button";

// เปลี่ยนลิงก์เป็นข้อมูลที่สอดคล้องกับระบบราชการ/การใช้งาน
const usefulLinks = ["คู่มือการใช้งานระบบ", "นโยบายความเป็นส่วนตัว", "เงื่อนไขการให้บริการ"];

// ปรับจุดเด่นของระบบให้ตรงกับสิ่งที่เรากำลังทำ (Tracking, Collaboration, EA)
const focusAreas = [
  "บูรณาการข้อมูลระหว่างหน่วยงาน",
  "สอดคล้องกับสถาปัตยกรรมองค์กร (EA)",
  "ติดตามสถานะและงบประมาณโปร่งใส",
];

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="fixed inset-x-0 top-0 z-50 px-4 py-3 sm:px-6">
        <nav className="mx-auto flex max-w-7xl items-center justify-between rounded-full bg-background/80 px-4 py-3 shadow-level-1 backdrop-blur-xl sm:px-5 border">
          <Link href="/" className="flex min-w-0 items-center gap-6">
            <span className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-surface-container-low shadow-sm">
              <Image
                src="/pics/logo.png"
                alt="BMA Logo"
                width={40}
                height={40}
                className="h-12 w-12 object-contain"
                priority
              />
            </span>
            <span className="truncate text-base font-bold tracking-normal text-foreground sm:text-lg uppercase">
              bmadigitalproject
            </span>
          </Link>

          <div className="flex shrink-0 items-center gap-2">
            <Button asChild variant="ghost" size="lg" className="px-4 sm:px-5">
              <Link href="/register"><p className="text-foreground">ลงทะเบียน</p></Link>
            </Button>
            <Button asChild variant="default" size="lg" className="px-4 sm:px-5">
              <Link href="/login"><p className="text-background">เข้าสู่ระบบ</p></Link>
            </Button>
          </div>
        </nav>
      </header>

      <section className="relative isolate overflow-hidden px-4 pb-16 pt-32 sm:px-6 sm:pb-24 sm:pt-40">
        <div className="absolute inset-x-0 top-24 -z-10 h-72 bg-surface-container-low/70" />
        <div className="absolute inset-x-0 top-0 -z-20 h-full bg-[linear-gradient(90deg,rgba(0,115,75,0.05)_1px,transparent_1px),linear-gradient(180deg,rgba(0,115,75,0.04)_1px,transparent_1px)] bg-[size:56px_56px]" />

        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div className="max-w-3xl space-y-0 flex flex-col items-start">
            <p className="mb-5 text-xl font-bold uppercase tracking-[0.04em] text-primary">
              กองยุทธศาสตร์ดิจิทัล สํานักดิจิทัลกรุงเทพมหานคร
            </p>
            <h1 className="max-w-4xl text-4xl font-semibold leading-[1.08] tracking-normal text-foreground sm:text-5xl lg:text-6xl">
              ขับเคลื่อนโครงการของกรุงเทพมหานคร สู่อนาคตที่ยั่งยืนและโปร่งใส
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              ระบบสารสนเทศเพื่อการบริหารจัดการและติดตามประเมินผลโครงการด้านเทคโนโลยีดิจิทัล 
            </p>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="w-full sm:w-auto pl-5">
                <a
                  href="https://webportal.bangkok.go.th/dsd"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <p className="text-background">เว็บไซต์ กทม.</p>
                  <ExternalLink data-icon="inline-end" className="size-4 text-background" />
                </a>
              </Button>
            
            </div>
          </div>

          <div className="rounded-[40px] border-none bg-surface p-4 shadow-level-1 sm:p-6">
            <div className="rounded-[32px] bg-surface-container-low p-5 sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    โครงการที่กำลังดำเนินการ
                  </p>
                  <p className="mt-2 text-4xl font-semibold text-foreground">
                    1,204
                  </p>
                </div>
                <span className="flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Building2 className="size-5" />
                </span>
              </div>

              <div className="mt-8 space-y-3">
                {focusAreas.map((area) => (
                  <div
                    key={area}
                    className="flex items-center justify-between rounded-full bg-background px-4 py-3 shadow-sm"
                  >
                    <span className="text-sm font-medium text-foreground">
                      {area}
                    </span>
                    <span className="size-2 rounded-full bg-primary" />
                  </div>
                ))}
              </div>

              <div className="mt-8 grid grid-cols-2 gap-3">
                <div className="rounded-[28px] bg-background p-5 shadow-sm">
                  <p className="text-2xl font-semibold">66</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    หน่วยงานที่เข้าร่วม
                  </p>
                </div>
                <div className="rounded-[28px] bg-background p-5 shadow-sm">
                  <p className="text-2xl font-semibold">89%</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    ดำเนินงานตามแผน
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-surface-container-low px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 rounded-[40px] border-none bg-surface p-6 shadow-level-1 sm:p-8 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
            <div>
              <div className="flex items-center gap-6">
                <span className="flex size-11 items-center justify-center overflow-hidden rounded-full bg-surface-container-low shadow-sm">
                  <Image
                    src="/pics/logo.png"
                    alt="BMA Logo Footer"
                    width={34}
                    height={34}
                    className="h-8 w-8 object-contain"
                  />
                </span>
                <span className="text-lg font-bold">ระบบจัดการโครงการ กทม.</span>
              </div>
              <p className="mt-4 max-w-md text-sm leading-6 text-muted-foreground">
                ระบบสารสนเทศเพื่อการบริหารจัดการโครงการแบบรวมศูนย์ มุ่งเน้นความโปร่งใสและประสิทธิภาพในการใช้จ่ายงบประมาณเพื่อพัฒนาคุณภาพชีวิตชาวกรุงเทพฯ
              </p>
            </div>

            <div>
              <h2 className="text-sm font-bold uppercase leading-4 tracking-[0.04em]">
                ติดต่อเรา
              </h2>
              <address className="mt-4 space-y-3 text-sm not-italic text-muted-foreground">
                <span className="flex gap-3">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
                  173 ถนนดินสอ แขวงเสาชิงช้า<br />เขตพระนคร กรุงเทพมหานคร 10200
                </span>
                <span className="flex gap-3">
                  <Phone className="mt-0.5 size-4 shrink-0 text-primary" />
                  02-221-2141
                </span>
                <span className="flex gap-3">
                  <Mail className="mt-0.5 size-4 shrink-0 text-primary" />
                  contact@bangkok.go.th
                </span>
              </address>
            </div>

            <div>
              <h2 className="text-sm font-bold uppercase leading-4 tracking-[0.04em]">
                ลิงก์ที่เกี่ยวข้อง
              </h2>
              <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                {usefulLinks.map((link) => (
                  <li key={link}>
                    <a className="transition-colors hover:text-primary" href="#">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <p className="mt-8 text-center text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} กรุงเทพมหานคร (Bangkok Metropolitan Administration). สงวนลิขสิทธิ์.
          </p>
        </div>
      </footer>
    </main>
  );
}