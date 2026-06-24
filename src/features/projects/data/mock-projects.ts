// --- Mock Data (จำลองผู้ใช้ปัจจุบัน: คุณธนาธร | หน่วยงาน: สำนักยุทธศาสตร์และประเมินผล) ---

// 1. แบบร่างของฉัน (Owner: คุณธนาธร เท่านั้น)
export const myDraftProjects = [
  { id: "PRJ-2024-005", name: "โครงการจัดหาระบบคลาวด์", formProgress: "3/5", docProgress: "4/4", lastEdit: "2 ชม. ที่แล้ว", owner: "คุณธนาธร (คุณ)" },
  { id: "PRJ-2024-006", name: "พัฒนาระบบ AI ตรวจสอบเอกสาร", formProgress: "1/5", docProgress: "0/4", lastEdit: "เมื่อวาน", owner: "คุณธนาธร (คุณ)" },
  { id: "PRJ-2024-007", name: "จัดซื้อเครื่องคอมพิวเตอร์ประจำปี", formProgress: "5/5", docProgress: "2/4", lastEdit: "2 วันที่แล้ว", owner: "คุณธนาธร (คุณ)" },
  { id: "PRJ-2024-008", name: "ระบบจองรถยนต์ส่วนกลาง", formProgress: "5/5", docProgress: "4/4", lastEdit: "3 วันที่แล้ว", owner: "คุณธนาธร (คุณ)" },
  { id: "PRJ-2024-009", name: "โครงการพัฒนาแอปพลิเคชัน BMA Mobile", formProgress: "2/5", docProgress: "1/4", lastEdit: "5 วันที่แล้ว", owner: "คุณธนาธร (คุณ)" },
  { id: "PRJ-2024-010", name: "อัปเกรดระบบเครือข่ายไร้สาย (Wi-Fi)", formProgress: "4/5", docProgress: "4/4", lastEdit: "1 สัปดาห์ที่แล้ว", owner: "คุณธนาธร (คุณ)" },
  { id: "PRJ-2024-011", name: "โครงการ Smart City เฟส 1", formProgress: "3/5", docProgress: "2/4", lastEdit: "1 สัปดาห์ที่แล้ว", owner: "คุณธนาธร (คุณ)" },
  { id: "PRJ-2024-012", name: "ระบบฐานข้อมูลบุคลากรกลาง", formProgress: "5/5", docProgress: "3/4", lastEdit: "2 สัปดาห์ที่แล้ว", owner: "คุณธนาธร (คุณ)" },
];

// 2. โครงการของฉันที่ส่งแล้ว (Owner: คุณธนาธร เท่านั้น)
export const myActiveProjects = [
  { id: "PRJ-2024-015", name: "จัดซื้อ License Software พนักงาน", status: "Need Revision", lastEdit: "15 นาทีที่แล้ว", owner: "คุณธนาธร (คุณ)" }, 
  { id: "PRJ-2024-001", name: "ระบบจัดการเอกสารภายในองค์กร", status: "Pending Review", lastEdit: "3 วันที่แล้ว", owner: "คุณธนาธร (คุณ)" },
  { id: "PRJ-2024-002", name: "ปรับปรุงโครงสร้างเครือข่ายศูนย์ข้อมูล", status: "Approved", lastEdit: "สัปดาห์ที่แล้ว", owner: "คุณธนาธร (คุณ)" },
  { id: "PRJ-2024-016", name: "โครงการปรับปรุง Website ศูนย์บริการประชาชน", status: "Need Revision", lastEdit: "1 ชม. ที่แล้ว", owner: "คุณธนาธร (คุณ)" },
];

// 3. โครงการในหน่วยงาน (Owner: คนอื่นใน 'สำนักยุทธศาสตร์ฯ' | มองเห็นและ Edit ได้)
export const teamProjects = [
  { id: "PRJ-2024-020", name: "ระบบฐานข้อมูลบุคลากรกลาง (Draft)", owner: "คุณสมชาย ใจดี", status: "Draft", lastEdit: "1 ชม. ที่แล้ว", canEdit: true },
  { id: "PRJ-2024-003", name: "ระบบจองห้องประชุมออนไลน์", owner: "คุณสมชาย ใจดี", status: "In Analysis", lastEdit: "3 วันที่แล้ว", canEdit: true },
  { id: "PRJ-2024-004", name: "แอปพลิเคชันให้บริการประชาชน", owner: "คุณสมหญิง รักงาน", status: "Approved", lastEdit: "สัปดาห์ที่แล้ว", canEdit: false }, 
  { id: "PRJ-2024-021", name: "แพลตฟอร์มร้องเรียนปัญหาเมือง", owner: "คุณวิชัย เก่งกาจ", status: "Need Revision", lastEdit: "เมื่อวาน", canEdit: true }, 
];

// 4. 📍 จำลองข้อมูลจากต่างหน่วยงาน (สำหรับแท็บ Admin | จะไม่เห็นแบบร่างของสำนักอื่นเลย เห็นเฉพาะตัวที่กดส่งแล้ว)
export const otherDepartmentProjects = [
  { id: "PRJ-2024-030", name: "ระบบจัดเก็บภาษีและค่าธรรมเนียมท้องถิ่นอัจฉริยะ", owner: "คุณวิชาญ มั่นคง", agency: "สำนักการคลัง", status: "In Analysis", lastEdit: "4 ชม. ที่แล้ว" },
  { id: "PRJ-2024-031", name: "ระบบบริหารจัดการน้ำท่วมและระบายน้ำอัตโนมัติ", owner: "คุณสมศักดิ์ รักเมือง", agency: "สำนักการระบายน้ำ", status: "Pending Review", lastEdit: "1 วันที่แล้ว" },
  { id: "PRJ-2024-032", name: "ระบบทะเบียนแผนที่ภาษีและทรัพย์สินภูมิสารสนเทศ", owner: "คุณนภา เจริญดี", agency: "สำนักการคลัง", status: "Approved", lastEdit: "3 วันที่แล้ว" },
];