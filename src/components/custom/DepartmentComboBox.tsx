import { useEffect, useState } from "react";
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
} from "@/components/ui/combobox";

import { department } from "@/data/lookup";

// หน่วยงาน
export const AgencyComboBox = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [agencies, setAgencies] = useState<{ id: string; name: string }[]>([]);
  
  // เพิ่ม State สำหรับเก็บข้อความที่ผู้ใช้กำลังพิมพ์ค้นหา
  const [inputValue, setInputValue] = useState("");

  const fetchAgencies = department.map((item) => ({
    id: item.id.toString(),
    name: item.name,
  }));

  useEffect(() => {
    setIsLoading(true);
    const fetchMockData = setTimeout(() => {
      setAgencies(fetchAgencies);
      setIsLoading(false);
    }, 600); 
    return () => clearTimeout(fetchMockData);
  }, []);

  // Logic กรองข้อมูล (Filter) หากคำที่พิมพ์ตรงกับชื่อหน่วยงาน ให้แสดงแค่รายการนั้น
  const filteredAgencies = agencies.filter((agency) =>
    agency.name.toLowerCase().includes(inputValue.toLowerCase())
  );

  return (
    <Combobox
      value={value || null} 
      onValueChange={(val) => onChange(val || "")}
      // ผูก State การค้นหาเข้ากับ Combobox
      inputValue={inputValue}
      onInputValueChange={(val) => setInputValue(val)}
    >
      <ComboboxInput
        placeholder="ค้นหา หรือ เลือกหน่วยงาน..."
        className="w-full bg-surface py-[1.175rem]"
        showTrigger={true}
        showClear={!!value}
      />
      <ComboboxContent
        align="start"
        className="w-full p-0 shadow-level-2 border-border"
      >
        <ComboboxList>
          {isLoading ? (
            <div className="py-6 text-center text-sm text-muted-foreground">
              กำลังโหลดข้อมูล...
            </div>
          ) : (
            <>
              {/* ComboboxEmpty จะแสดงอัตโนมัติเมื่อข้อมูลที่ map ด้านล่างเป็น 0 รายการ */}
              {/* <ComboboxEmpty>ไม่พบหน่วยงานที่คุณค้นหา</ComboboxEmpty> */}
              
              {/* นำ filteredAgencies มา map แสดงผลแทน agencies ตัวเต็ม */}
              {filteredAgencies.map((agency) => (
                <ComboboxItem key={agency.id} value={agency.name}>
                  {agency.name}
                </ComboboxItem>
              ))}
            </>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
};