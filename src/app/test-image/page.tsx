"use client";

import React, { useState, useRef, ChangeEvent } from "react";
import imageCompression from "browser-image-compression";

interface ImageStats {
  name: string;
  size: number;
  width: number;
  height: number;
  url: string;
}

export default function ClientImageCompressor() {
  const [original, setOriginal] = useState<ImageStats | null>(null);
  const [compressed, setCompressed] = useState<ImageStats | null>(null);
  const [quality, setQuality] = useState<number>(0.75); // ค่าเริ่มต้น 75%
  const [maxWidth, setMaxWidth] = useState<number>(1200); // ความกว้างสูงสุดเริ่มต้น
  const [loading, setLoading] = useState<boolean>(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const currentFileRef = useRef<File | null>(null);

  // ฟังก์ชันแปลงขนาดไฟล์เป็นหน่วยที่อ่านง่าย (KB/MB)
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Helper function เพื่ออ่านความกว้าง/ความสูงของภาพ (เนื่องจาก Library คืนค่ามาเป็น File Object)
  const getImageDimensions = (file: File | Blob): Promise<{ width: number; height: number }> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve({ width: img.width, height: img.height });
      img.src = URL.createObjectURL(file);
    });
  };

  // ฟังก์ชันหลักในการบีบอัดภาพด้วย browser-image-compression
  const compressImage = async (file: File, currentQuality: number, currentMaxWidth: number) => {
    if (!file) return;
    setLoading(true);

    try {
      // 1. ตรวจสอบและบันทึกข้อมูลภาพต้นฉบับ (ทำครั้งเดียวต่อ 1 ไฟล์)
      if (!original || original.name !== file.name || original.size !== file.size) {
        const origDims = await getImageDimensions(file);
        setOriginal({
          name: file.name,
          size: file.size,
          width: origDims.width,
          height: origDims.height,
          url: URL.createObjectURL(file),
        });
      }

      // 2. ตั้งค่า Options สำหรับ Library
      const options = {
        maxWidthOrHeight: currentMaxWidth, // ย่อด้านที่ยาวที่สุดไม่ให้เกินค่านี้
        initialQuality: currentQuality,    // คุณภาพที่ต้องการ (0.1 - 1.0)
        useWebWorker: true,                // เปิดใช้งาน Web Worker (ห้ามเอาออก หน้าเว็บจะได้ไม่ค้าง)
        fileType: "image/webp",            // บังคับแปลงเป็น WebP เพื่อความคุ้มค่าสูงสุด
      };

      // 3. เริ่มบีบอัด! (โค้ดสั้นลงกว่า Canvas API มาก)
      const compressedFile = await imageCompression(file, options);

      // 4. ดึงขนาด Width/Height ของภาพที่บีบอัดเสร็จแล้ว
      const compDims = await getImageDimensions(compressedFile);

      // 5. อัปเดต State เพื่อแสดงผล
      setCompressed({
        name: `compressed_${file.name.split(".")[0]}.webp`,
        size: compressedFile.size,
        width: compDims.width,
        height: compDims.height,
        url: URL.createObjectURL(compressedFile),
      });

    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการบีบอัดภาพ:", error);
      alert("ไม่สามารถบีบอัดภาพได้ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      currentFileRef.current = file;
      compressImage(file, quality, maxWidth);
    }
  };

  // เมื่อผู้ใช้เลื่อน Slider ให้ทำการบีบอัดใหม่ทันที (Real-time Preview)
  const handleQualityChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newQuality = parseFloat(e.target.value);
    setQuality(newQuality);
    if (currentFileRef.current) {
      compressImage(currentFileRef.current, newQuality, maxWidth);
    }
  };

  const handleWidthChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newWidth = parseInt(e.target.value);
    setMaxWidth(newWidth);
    if (currentFileRef.current) {
      compressImage(currentFileRef.current, quality, newWidth);
    }
  };

  // คำนวณเปอร์เซ็นต์ที่ประหยัดพื้นที่ได้
  const savedPercentage = original && compressed
    ? (((original.size - compressed.size) / original.size) * 100).toFixed(1)
    : "0";

  return (
    <div className="max-w-6xl mx-auto p-6 bg-slate-50 min-h-screen text-slate-800">
      <h1 className="text-3xl font-bold mb-2 text-center text-indigo-600">
        Image Compression Simulator (Client-Side)
      </h1>
      <p className="text-center text-slate-500 mb-8">
        ทดลองบีบอัดและย่อขนาดภาพด้วย browser-image-compression (Web Workers)
      </p>

      {/* แผงควบคุมและอัปโหลด */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* กล่องอัปโหลด */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-center items-center">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
          >
            เลือกรูปภาพทดสอบ
          </button>
          {original && <p className="mt-2 text-xs text-slate-400 truncate max-w-xs">{original.name}</p>}
        </div>

        {/* ปรับระดับ Quality */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <label className="block text-sm font-semibold mb-2">
            Quality (คุณภาพรูปภาพ): <span className="text-indigo-600">{(quality * 100).toFixed(0)}%</span>
          </label>
          <input
            type="range"
            min="0.1"
            max="1.0"
            step="0.05"
            value={quality}
            onChange={handleQualityChange}
            disabled={!original}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 disabled:opacity-50"
          />
          <span className="text-xs text-slate-400 block mt-1">ค่ายิ่งน้อย ขนาดไฟล์ยิ่งเล็ก แต่ภาพจะแตกมากขึ้น</span>
        </div>

        {/* ปรับ Max Width */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <label className="block text-sm font-semibold mb-2">
            Max Width (ความกว้างสูงสุด): <span className="text-indigo-600">{maxWidth}px</span>
          </label>
          <input
            type="range"
            min="400"
            max="3840"
            step="100"
            value={maxWidth}
            onChange={handleWidthChange}
            disabled={!original}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 disabled:opacity-50"
          />
          <span className="text-xs text-slate-400 block mt-1">หากภาพกว้างเกินค่านี้ ระบบจะย่อขนาดลงให้อัตโนมัติ</span>
        </div>
      </div>

      {/* แผงแสดง Metrics ตัวเลขสถิติ */}
      {original && compressed && (
        <div className="bg-linear-to-r from-indigo-500 to-purple-600 p-6 rounded-xl shadow-md text-white grid grid-cols-1 sm:grid-cols-3 gap-4 text-center mb-8">
          <div>
            <p className="text-indigo-100 text-sm">ขนาดเดิม</p>
            <p className="text-2xl font-bold">{formatBytes(original.size)}</p>
            <p className="text-xs text-indigo-200">{original.width} x {original.height} px</p>
          </div>
          <div className="border-y sm:border-y-0 sm:border-x border-indigo-400/50 py-2 sm:py-0">
            <p className="text-indigo-100 text-sm">ขนาดหลังบีบอัด (WebP)</p>
            <p className="text-2xl font-bold text-green-300">{formatBytes(compressed.size)}</p>
            <p className="text-xs text-indigo-200">{compressed.width} x {compressed.height} px</p>
          </div>
          <div>
            <p className="text-indigo-100 text-sm">ประหยัดพื้นที่บนระบบ</p>
            <p className="text-3xl font-extrabold text-yellow-300">ลดลง {savedPercentage}%</p>
            <p className="text-xs text-indigo-200">ประหยัดไปได้ {formatBytes(original.size - compressed.size)}</p>
          </div>
        </div>
      )}

      {/* หน้าจอเปรียบเทียบรูปภาพ (Before & After) */}
      {original && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* ฝั่งภาพเดิม */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
            <h3 className="font-semibold mb-2 text-slate-600 flex justify-between">
              <span>ก่อนทำ (Original)</span>
              <span className="text-sm font-normal text-slate-400">{formatBytes(original.size)}</span>
            </h3>
            <div className="border border-dashed border-slate-200 rounded-lg overflow-hidden bg-slate-100 flex items-center justify-center min-h-87.5 max-h-125">
              <img src={original.url} alt="Original" className="object-contain max-h-125" />
            </div>
          </div>

          {/* ฝั่งภาพที่บีบอัดแล้ว */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 relative">
            <h3 className="font-semibold mb-2 text-slate-600 flex justify-between">
              <span>หลังทำ (Compressed)</span>
              <span className="text-sm font-normal text-green-600">{compressed ? formatBytes(compressed.size) : ""}</span>
            </h3>
            <div className="border border-dashed border-slate-200 rounded-lg overflow-hidden bg-slate-100 flex items-center justify-center min-h-87.5 max-h-125 relative">
              {loading ? (
                <div className="absolute inset-0 bg-white/70 flex items-center justify-center font-medium text-indigo-600 z-10 backdrop-blur-sm transition-all">
                  กำลังบีบอัดรูปภาพ...
                </div>
              ) : null}
              {compressed && (
                <img src={compressed.url} alt="Compressed" className="object-contain max-h-125" />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}