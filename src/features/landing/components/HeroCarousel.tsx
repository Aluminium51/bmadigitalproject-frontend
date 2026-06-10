"use client";
import { useRef } from "react";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

const carouselData = [
  {
    id: 1,
    image: "/pics/forest.jpg",
    title: "เพิ่มพื้นที่สีเขียวปอดของคนกรุง",
    description: "โครงการสวนสาธารณะ 15 นาที เพื่อสุขภาพที่ดีของทุกคน",
  },
  {
    id: 2,
    image: "/pics/food_city.jpg",
    title: "ยกระดับคุณภาพชีวิต",
    description: "พัฒนาโครงสร้างพื้นฐาน สู่การเดินทางที่ไร้รอยต่อ",
  },
  {
    id: 3,
    image: "/pics/man.webp",
    title: "ระบบสาธารณสุขเชิงรุก",
    description: "ยกระดับศูนย์บริการสาธารณสุข ครอบคลุมทุกพื้นที่",
  },
];

export function HeroCarousel() {

  const plugin = useRef(Autoplay({ delay: 4000, stopOnInteraction: false }));

  return (
    <div className="w-full h-full min-h-100 sm:min-h-125 rounded-4xl sm:rounded-container overflow-hidden shadow-level-2 relative border-4 border-surface group">
      <Carousel
        plugins={[plugin.current]}
        className="w-full h-full"
        onMouseEnter={plugin.current.stop} // เอาเมาส์ชี้แล้วหยุดเลื่อน
        onMouseLeave={plugin.current.reset} // เอาเมาส์ออกแล้วเลื่อนต่อ
      >
        <CarouselContent className="h-full ml-0">
          {carouselData.map((slide) => (
            <CarouselItem
              key={slide.id}
              className="relative h-full w-full pl-0"
            >
              <div className="relative w-full h-100 sm:h-125">
                {/* 1. รูปภาพพื้นหลัง */}
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  sizes="(max-width: 640px) 100vw, 100vw"
                  className="object-cover"
                  priority={slide.id === 1} // โหลดรูปแรกก่อนเสมอ
                />

                {/* 2. Gradient Overlay (ทำให้ตัวหนังสืออ่านง่ายขึ้น) */}
                <div className="absolute inset-0 bg-linear-to-t from-foreground/80 via-foreground/20 to-transparent" />

                {/* 3. ข้อความ */}
                <div className="absolute bottom-0 left-0 w-full p-8 sm:p-10 transform transition-transform duration-500">
                  {/* <span className="inline-block px-3 py-1 mb-3 text-xs font-bold tracking-wider text-primary-foreground bg-primary rounded-full shadow-sm">
                    IMPACT
                  </span> */}
                  <h2 className="text-2xl sm:text-3xl font-bold text-surface mb-2 leading-tight">
                    {slide.title}
                  </h2>
                  <p className="text-surface/80 text-sm sm:text-base">
                    {slide.description}
                  </p>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}