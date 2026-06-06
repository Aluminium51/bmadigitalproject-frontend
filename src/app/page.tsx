"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const slides = [
  {
    title: "Smart dashboard",
    accent: "from-sky-400 via-cyan-300 to-emerald-300",
    frame: "bg-[#102a43]",
    preview: "bg-gradient-to-br from-[#f8fbff] to-[#e3f1ff]",
    stats: ["Live orders", "24h sync", "Insights"],
  },
  {
    title: "Mobile flow",
    accent: "from-fuchsia-400 via-pink-300 to-amber-200",
    frame: "bg-[#16263b]",
    preview: "bg-gradient-to-br from-[#fff8fb] to-[#ffe6f2]",
    stats: ["Swipe ready", "Touch first", "Fast checkout"],
  },
  {
    title: "Team operations",
    accent: "from-teal-400 via-cyan-300 to-lime-200",
    frame: "bg-[#153247]",
    preview: "bg-gradient-to-br from-[#f8fffe] to-[#e4fff7]",
    stats: ["Multi-user", "Alerts", "Reports"],
  },
];

export default function Home() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const startX = useRef<number | null>(null);

  useEffect(() => {
    if (isDragging) {
      return;
    }

    const interval = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, 5000);

    return () => window.clearInterval(interval);
  }, [isDragging]);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    startX.current = event.clientX;
    setIsDragging(true);
    setDragOffset(0);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (startX.current === null) {
      return;
    }

    setDragOffset(event.clientX - startX.current);
  };

  const completeDrag = (currentTarget: HTMLDivElement, pointerId: number) => {
    currentTarget.releasePointerCapture(pointerId);

    const threshold = 70;

    if (dragOffset > threshold) {
      setActiveSlide(
        (current) => (current - 1 + slides.length) % slides.length,
      );
    } else if (dragOffset < -threshold) {
      setActiveSlide((current) => (current + 1) % slides.length);
    }

    startX.current = null;
    setIsDragging(false);
    setDragOffset(0);
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (startX.current === null) {
      return;
    }

    completeDrag(event.currentTarget, event.pointerId);
  };

  return (
    <main className="landing-shell min-h-screen px-4 py-5 sm:px-6 lg:px-8">
      <section
        id="home"
        className="mx-auto flex min-h-[calc(100vh-2.5rem)] w-full flex-col overflow-hidden rounded-4xl border border-white/60 bg-white/45 shadow-[0_20px_60px_rgba(34,64,112,0.22)] backdrop-blur-2xl"
      >
        <header className="sticky top-0 z-20 border-b border-white/35 bg-white/20 px-5 py-4 backdrop-blur-xl sm:px-8">
          <div className="flex items-center justify-between gap-4">
            <a
              href="#home"
              className="flex items-center gap-3 font-(family-name:--font-display) text-lg font-extrabold tracking-[0.18em] text-[#0c385d]"
            >
              <span className="flex h-18 w-18 items-center justify-center rounded-full bg-transparent text-sm text-white shadow-black">
                <Image
                  src="/pics/logo.png"
                  alt="Logo"
                  width={112}
                  height={112}
                />
              </span>
              Bangkok
            </a>

            <div className="flex items-center gap-2 sm:gap-3">
              <a
                href="/login"
                className="px-4 py-2 text-sm transition hover:-translate-y-0.5 "
              >
                <Button variant="ghost">Login</Button>
              </a>
              <a
                href="/register"
                className="rounded-full border border-[#0c5ea8]/20 bg-white/55 px-4 py-2 text-sm font-semibold text-[#164569] transition hover:border-[#0c5ea8]/40 hover:bg-white"
              >
                Register
              </a>
            </div>
          </div>
        </header>

        <div className="grid flex-1 items-stretch lg:grid-cols-[1.08fr_1fr]">
          <section className="flex items-center bg-[#f8fbff] px-6 py-12 sm:px-10 lg:px-14 lg:py-16">
            <div className="max-w-xl">
              <p className="mb-4 inline-flex rounded-full border border-[#0c5ea8]/12 bg-white px-4 py-1 text-xs font-semibold uppercase tracking-[0.32em] text-[#0c5ea8] shadow-sm">
                Digital platform landing
              </p>
              <h1 className="font-(family-name:--font-display) text-5xl font-black leading-[0.95] tracking-tighter text-[#08314f] sm:text-6xl lg:text-[5rem]">
                ONLINE
                <br />
                SHOPPING
              </h1>
              <p className="mt-6 max-w-lg text-sm leading-7 text-[#476179] sm:text-base">
                A modern system landing page for showcasing your product,
                guiding users into the experience, and presenting the key value
                proposition with clarity.
              </p>
              {/*<p className="mt-4 max-w-lg text-sm leading-7 text-[#5f7386] sm:text-base">
                Designed for a transparent navigation bar, a split-screen hero,
                a carousel-driven visual area, and feature highlights that
                communicate the system at a glance.
              </p>*/}

              <div className="mt-8 flex items-center gap-4">
                <a
                  href="https://example.com"
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-[#0c5ea8]/20 bg-white px-5 py-3 text-sm font-semibold text-[#0c5ea8] shadow-[0_10px_24px_rgba(12,94,168,0.12)] transition hover:-translate-y-0.5 hover:border-[#0c5ea8]/35"
                >
                  Read more
                </a>
                <span className="text-xs font-medium uppercase tracking-[0.3em] text-[#7f95aa]">
                  Swipe or drag the showcase
                </span>
              </div>
            </div>
          </section>

          <section className="relative flex items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_35%_10%,rgba(255,255,255,0.8),transparent_40%),linear-gradient(145deg,#bcefe7_0%,#a7e1d7_48%,#97dccf_100%)] px-5 py-10 sm:px-8 lg:px-10 lg:py-14">
            <div className="absolute left-[-10%] top-[-8%] h-[68%] w-[72%] rounded-[48%_52%_49%_51%/58%_44%_56%_42%] bg-white/40 blur-2xl" />
            <div className="absolute bottom-[-14%] right-[-10%] h-[58%] w-[56%] rounded-[52%_48%_33%_67%/46%_46%_54%_54%] bg-[#2d6d82]/12 blur-2xl" />

            <div
              className="relative w-full max-w-md select-none"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              onPointerLeave={() => {
                if (isDragging && startX.current !== null) {
                  startX.current = null;
                  setIsDragging(false);
                  setDragOffset(0);
                }
              }}
              style={{ cursor: isDragging ? "grabbing" : "grab" }}
            >
              <div className="absolute inset-x-10 -bottom-6 h-6 rounded-full bg-black/15 blur-xl" />

              <div className="relative overflow-hidden rounded-4xl border border-white/65 bg-white/30 p-4 shadow-[0_26px_70px_rgba(18,64,92,0.24)] backdrop-blur-xl">
                <div className="mb-4 flex items-center justify-between rounded-[1.35rem] border border-white/45 bg-white/55 px-4 py-3 text-xs font-semibold text-[#4c7087] shadow-sm">
                  <span>Live preview</span>
                  <span>
                    {String(activeSlide + 1).padStart(2, "0")} /{" "}
                    {String(slides.length).padStart(2, "0")}
                  </span>
                </div>

                <div className="relative h-112 overflow-hidden rounded-[1.85rem] bg-[#eaf7f4] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)]">
                  <div className="absolute left-0 top-0 h-full w-28 bg-[linear-gradient(90deg,rgba(255,255,255,0.78),transparent)]" />
                  <div className="absolute right-0 top-0 h-full w-28 bg-[linear-gradient(270deg,rgba(255,255,255,0.78),transparent)]" />

                  <div
                    className="flex h-full transition-transform duration-500 ease-out"
                    style={{
                      transform: `translateX(calc(${-activeSlide * 100}% + ${dragOffset}px))`,
                    }}
                  >
                    {slides.map((slide, index) => (
                      <article
                        key={slide.title}
                        className="flex h-full min-w-full items-center justify-center px-2"
                      >
                        <div
                          className={`relative flex h-full w-full flex-col overflow-hidden rounded-[1.6rem] ${slide.frame} text-white shadow-[0_18px_40px_rgba(11,34,57,0.22)]`}
                        >
                          <div
                            className={`absolute inset-x-0 top-0 h-36 bg-linear-to-br ${slide.accent} opacity-40`}
                          />
                          <div className="relative flex items-center justify-between px-5 pt-5 text-xs font-semibold uppercase tracking-[0.28em] text-white/75">
                            <span>Screen {index + 1}</span>
                            <span>Prototype</span>
                          </div>

                          <div className="relative mx-5 mt-4 flex-1 overflow-hidden rounded-[1.3rem] bg-white/95 p-4 text-[#13324a]">
                            <div className="mb-4 flex items-center justify-between">
                              <div>
                                <div className="h-2.5 w-20 rounded-full bg-[#c8d7e6]" />
                                <div className="mt-2 h-2 w-32 rounded-full bg-[#e0eaf2]" />
                              </div>
                              <div className="h-9 w-9 rounded-full bg-[#eef5fb]" />
                            </div>

                            <div
                              className={`rounded-[1.1rem] bg-linear-to-br ${slide.preview} p-4`}
                            >
                              <div className="grid grid-cols-2 gap-3">
                                <div className="rounded-2xl bg-white p-3 shadow-sm">
                                  <div className="h-24 rounded-[0.85rem] bg-[#d9e6f4]" />
                                  <div className="mt-3 h-3 w-16 rounded-full bg-[#bfd0df]" />
                                </div>
                                <div className="rounded-2xl bg-white p-3 shadow-sm">
                                  <div className="h-24 rounded-[0.85rem] bg-[#e5d7fb]" />
                                  <div className="mt-3 h-3 w-20 rounded-full bg-[#c9badf]" />
                                </div>
                                <div className="rounded-2xl bg-white p-3 shadow-sm">
                                  <div className="h-24 rounded-[0.85rem] bg-[#f5d8df]" />
                                  <div className="mt-3 h-3 w-14 rounded-full bg-[#dfb9c1]" />
                                </div>
                                <div className="rounded-2xl bg-white p-3 shadow-sm">
                                  <div className="h-24 rounded-[0.85rem] bg-[#d8efe8]" />
                                  <div className="mt-3 h-3 w-18 rounded-full bg-[#b8d5cb]" />
                                </div>
                              </div>
                            </div>

                            <div className="mt-4 flex items-center justify-between rounded-2xl bg-[#f5f8fc] px-4 py-3 text-xs font-semibold text-[#56728a]">
                              {slide.stats.map((item) => (
                                <span key={item}>{item}</span>
                              ))}
                            </div>
                          </div>

                          <div className="relative flex items-end justify-between px-5 pb-5 pt-4">
                            <div>
                              <p className="text-xs uppercase tracking-[0.25em] text-white/72">
                                Showcase
                              </p>
                              <h3 className="mt-1 text-2xl font-bold">
                                {slide.title}
                              </h3>
                            </div>
                            <div className="rounded-full bg-white/18 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white/85 backdrop-blur">
                              Auto-play
                            </div>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-center gap-3">
                  {slides.map((slide, index) => (
                    <button
                      key={slide.title}
                      type="button"
                      aria-label={`Go to slide ${index + 1}`}
                      onClick={() => setActiveSlide(index)}
                      className={`h-3.5 rounded-full border border-white/65 transition-all duration-300 ${
                        activeSlide === index
                          ? "w-10 bg-white shadow-[0_10px_20px_rgba(255,255,255,0.4)]"
                          : "w-3.5 bg-white/45 hover:bg-white/70"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>

        <footer
          id="contact"
          className="border-t border-white/45 bg-[#0a385d] px-6 py-8 text-white sm:px-8 lg:px-10"
        >
          <div className="mx-auto flex max-w-6xl flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/65">
                Contact
              </p>
              <p className="mt-2 text-sm text-white/85">
                hello@yourcompany.com · +66 2 000 0000
              </p>
              <p className="mt-1 text-sm text-white/65">Bangkok, Thailand</p>
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-white/80">
              <a href="/privacy" className="transition hover:text-white">
                Privacy Policy
              </a>
              <a href="/terms" className="transition hover:text-white">
                Terms of Use
              </a>
              <a
                href="mailto:hello@yourcompany.com"
                className="transition hover:text-white"
              >
                Support
              </a>
            </div>
          </div>
        </footer>
      </section>
    </main>
  );
}
