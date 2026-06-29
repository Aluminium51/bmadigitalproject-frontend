// src/features/projects/data/mockProjects.ts

const MY_AGENCY = "สำนักยุทธศาสตร์และประเมินผล";

// ==========================================
// 1. แบบร่างของฉัน (activeTab === "drafts")
// ==========================================
// แสดงผล: ความคืบหน้า (ฟอร์ม x/5, เอกสาร x/4) + ผู้รับผิดชอบ + ปุ่ม "เขียนต่อ"
export const teamDraftProjects = [
  { id: "PRJ-2024-005", name: "โครงการจัดหาระบบคลาวด์องค์กร", formProgress: "3/5", docProgress: "4/4", lastEdit: "2 ชม. ที่แล้ว", owner: "คุณธนาธร (คุณ)", agency: MY_AGENCY },
  { id: "PRJ-2024-006", name: "พัฒนาระบบ AI ตรวจสอบเอกสารราชการ", formProgress: "1/5", docProgress: "0/4", lastEdit: "เมื่อวาน", owner: "คุณสมชาย ใจดี", agency: MY_AGENCY },
  { id: "PRJ-2024-007", name: "จัดซื้อเครื่องคอมพิวเตอร์ประมวลผลสูงประจำปี", formProgress: "5/5", docProgress: "2/4", lastEdit: "2 วันที่แล้ว", owner: "คุณสมหญิง รักงาน", agency: MY_AGENCY },
  { id: "PRJ-2024-008", name: "ระบบจองรถยนต์ส่วนกลางและยานพาหนะไฟฟ้า", formProgress: "5/5", docProgress: "4/4", lastEdit: "3 วันที่แล้ว", owner: "คุณธนาธร รุ่งเรือง", agency: MY_AGENCY },
  { id: "PRJ-2024-009", name: "โครงการพัฒนาแอปพลิเคชัน BMA Mobile Connect", formProgress: "2/5", docProgress: "1/4", lastEdit: "5 วันที่แล้ว", owner: "คุณปรีชา ใจเย็น", agency: MY_AGENCY },
  { id: "PRJ-2024-010", name: "อัปเกรดระบบเครือข่ายไร้สายความเร็วสูง (Wi-Fi 7)", formProgress: "4/5", docProgress: "4/4", lastEdit: "1 สัปดาห์ที่แล้ว", owner: "คุณนิรันดร์ กลางใจ", agency: MY_AGENCY },
  { id: "PRJ-2024-011", name: "โครงการ Smart City Data Platform เฟส 1", formProgress: "3/5", docProgress: "2/4", lastEdit: "1 สัปดาห์ที่แล้ว", owner: "คุณสมคิด นึกคิด", agency: MY_AGENCY },
  { id: "PRJ-2024-012", name: "ระบบฐานข้อมูลบล็อกเชนสำหรับตรวจสอบสิทธิ์", formProgress: "5/5", docProgress: "3/4", lastEdit: "2 สัปดาห์ที่แล้ว", owner: "คุณเทพไทย สีฟัน", agency: MY_AGENCY },
  { id: "PRJ-2024-013", name: "ระบบลงทะเบียนสวัสดิการเจ้าหน้าที่ออนไลน์", formProgress: "1/5", docProgress: "1/4", lastEdit: "3 สัปดาห์ที่แล้ว", owner: "คุณเจมส์ ชวนยิ้ม", agency: MY_AGENCY },
  { id: "PRJ-2024-014", name: "โครงการพัฒนาทักษะดิจิทัลบุคลากร (E-Learning)", formProgress: "4/5", docProgress: "2/4", lastEdit: "1 เดือนที่แล้ว", owner: "คุณธนาธร (คุณ)", agency: MY_AGENCY },
];

// ==========================================
// 2. โครงการของฉันที่ส่งแล้ว (activeTab === "active")
// ==========================================
// แสดงผล: สถานะโครการ + ผู้รับผิดชอบ + หากเป็น Need Revision จะขึ้นแถบสีแดงและปุ่ม "แก้ไขด่วน"
export const myActiveProjects = [
  { id: "PRJ-2024-015", name: "จัดซื้อ License Software สำหรับพนักงานไอที", status: "Need Revision", lastEdit: "15 นาทีที่แล้ว", owner: "คุณธนาธร (คุณ)", agency: MY_AGENCY }, 
  { id: "PRJ-2024-001", name: "ระบบจัดการเอกสารและสารบรรณอิเล็กทรอนิกส์ภายใน", status: "Pending Review", lastEdit: "3 วันที่แล้ว", owner: "คุณธนาธร (คุณ)", agency: MY_AGENCY },
  { id: "PRJ-2024-002", name: "ปรับปรุงโครงสร้างเครือข่ายความปลอดภัยศูนย์ข้อมูล", status: "Approved", lastEdit: "สัปดาห์ที่แล้ว", owner: "คุณธนาธร (คุณ)", agency: MY_AGENCY },
  { id: "PRJ-2024-016", name: "โครงการปรับปรุงเว็บพอร์ทัลศูนย์บริการประชาชน", status: "Need Revision", lastEdit: "1 ชม. ที่แล้ว", owner: "คุณธนาธร (คุณ)", agency: MY_AGENCY },
  { id: "PRJ-2024-017", name: "ระบบวิเคราะห์ข้อมูล Big Data เพื่อการวางผังเมือง", status: "In Analysis", lastEdit: "4 วันที่แล้ว", owner: "คุณธนาธร (คุณ)", agency: MY_AGENCY },
  { id: "PRJ-2024-018", name: "จัดหาหน้าจอแสดงผลอัจฉริยะ (Smart Dashboard)", status: "Approved", lastEdit: "2 สัปดาห์ที่แล้ว", owner: "คุณธนาธร (คุณ)", agency: MY_AGENCY },
];

// ==========================================
// 3. โครงการในหน่วยงานเดียวกัน (activeTab === "team")
// ==========================================
// แสดงผล: สถานะโครงการ + ผู้รับผิดชอบที่เป็นคนในทีมคนอื่น ๆ
export const teamProjects = [
  { id: "PRJ-2024-020", name: "ระบบศูนย์ปฏิบัติการฉุกเฉินอัจฉริยะ (IOC)", owner: "คุณสมชาย ใจดี", status: "In Analysis", lastEdit: "1 ชม. ที่แล้ว", agency: MY_AGENCY },
  { id: "PRJ-2024-003", name: "ระบบจองห้องประชุมและอุปกรณ์ออนไลน์", owner: "คุณสมชาย ใจดี", status: "In Analysis", lastEdit: "3 วันที่แล้ว", agency: MY_AGENCY },
  { id: "PRJ-2024-004", name: "แอปพลิเคชันแจ้งเตือนภัยพิบัติล่วงหน้าสำหรับประชาชน", owner: "คุณสมหญิง รักงาน", status: "Approved", lastEdit: "สัปดาห์ที่แล้ว", agency: MY_AGENCY }, 
  { id: "PRJ-2024-021", name: "แพลตฟอร์มรับเรื่องร้องเรียนและพิกัดปัญหาเมือง", owner: "คุณวิชัย เก่งกาจ", status: "Need Revision", lastEdit: "เมื่อวาน", agency: MY_AGENCY }, 
  { id: "PRJ-2024-022", name: "ระบบเชื่อมโยงกล้อง CCTV ตรวจจับความหนาแน่นจราจร", owner: "คุณวิชัย เก่งกาจ", status: "Pending Review", lastEdit: "5 วันที่แล้ว", agency: MY_AGENCY },
  { id: "PRJ-2024-023", name: "โครงการติดตั้งระบบกระจายสัญญาณเครือข่ายส่วนต่อขยาย", owner: "คุณสมหญิง รักงาน", status: "Approved", lastEdit: "3 สัปดาห์ที่แล้ว", agency: MY_AGENCY },
];

// ==========================================
// 4. โครงการจากต่างหน่วยงาน (ใช้ประกอบในแท็บ Admin: activeTab === "all")
// ==========================================
// แสดงผล: จะแสดงคอลัมน์ "หน่วยงาน" เพิ่มเข้ามาตาม Logic ของโค้ดหลัก
export const otherDepartmentProjects = [
  { id: "PRJ-2024-030", name: "ระบบจัดเก็บภาษีและค่าธรรมเนียมท้องถิ่นอัจฉริยะ", owner: "คุณวิชาญ มั่นคง", agency: "สำนักการคลัง", status: "In Analysis", lastEdit: "4 ชม. ที่แล้ว" },
  { id: "PRJ-2024-031", name: "ระบบบริหารจัดการน้ำท่วมและระบายน้ำอัตโนมัติ", owner: "คุณสมศักดิ์ รักเมือง", agency: "สำนักการระบายน้ำ", status: "Pending Review", lastEdit: "1 วันที่แล้ว" },
  { id: "PRJ-2024-032", name: "ระบบทะเบียนแผนที่ภาษีและทรัพย์สินภูมิสารสนเทศ", owner: "คุณนภา เจริญดี", agency: "สำนักการคลัง", status: "Approved", lastEdit: "3 วันที่แล้ว" },
  { id: "PRJ-2024-033", name: "แอปพลิเคชันลงทะเบียนสิทธิผู้สูงอายุและผู้พิการ", owner: "คุณปรีชา พัฒนา", agency: "สำนักพัฒนาสังคม", status: "In Analysis", lastEdit: "5 วันที่แล้ว" },
  { id: "PRJ-2024-034", name: "ระบบตรวจสอบและติดตามสุขาภิบาลโรงงานอัจฉริยะ", owner: "คุณอัญชลี รักษ์ดี", agency: "สำนักอนามัย", status: "Need Revision", lastEdit: "เมื่อวาน" },
  { id: "PRJ-2024-035", name: "โครงการจัดหาอุปกรณ์กู้ภัยและดับเพลิงในอาคารสูง", owner: "คุณกล้าหาญ ชาญชัย", agency: "สำนักป้องกันและบรรเทาสาธารณภัย", status: "Approved", lastEdit: "2 สัปดาห์ที่แล้ว" },
];