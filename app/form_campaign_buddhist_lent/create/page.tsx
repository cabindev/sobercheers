'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { data } from '@/app/data/regions';

export default function CampaignBuddhistLent() {
  const { data: session } = useSession();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthday, setBirthday] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [district, setDistrict] = useState('');
  const [amphoe, setAmphoe] = useState('');
  const [province, setProvince] = useState('');
  const [zipcode, setZipcode] = useState('');
  const [type, setType] = useState('');
  const [phone, setPhone] = useState(''); // เพิ่มช่องสำหรับเบอร์โทรศัพท์
  const [job, setJob] = useState('');
  const [alcoholConsumption, setAlcoholConsumption] = useState('');
  const [drinkingFrequency, setDrinkingFrequency] = useState('');
  const [intentPeriod, setIntentPeriod] = useState('');
  const [monthlyExpense, setMonthlyExpense] = useState('');
  const [motivations, setMotivations] = useState<string[]>([]);
  const [healthImpact, setHealthImpact] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (session) {
      setFirstName(session.user.firstName);
      setLastName(session.user.lastName);
    }
  }, [session]);

  const handleDistrictChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDistrict(value);

    if (value.length > 0) {
      const filteredSuggestions = data
        .filter((region) => region.district.startsWith(value))
        .slice(0, 10);
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion: any) => {
    setDistrict(suggestion.district);
    setAmphoe(suggestion.amphoe);
    setProvince(suggestion.province);
    setZipcode(suggestion.zipcode.toString());
    setType(suggestion.type);
    setSuggestions([]);
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, setState: React.Dispatch<React.SetStateAction<string[]>>) => {
    const value = e.target.value;
    setState(prev => prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // ตรวจสอบค่า
    if (!session?.user.id) {
      console.error('User ID is missing');
      return;
    }

    if (alcoholConsumption !== 'ไม่เคยดื่มเลยตลอดชีวิต' && (!drinkingFrequency || !intentPeriod || !monthlyExpense)) {
      console.error('Some required fields are missing for alcohol consumption');
      return;
    }

    const formData = {
      firstName,
      lastName,
      birthday,
      addressLine1,
      district,
      amphoe,
      province,
      zipcode,
      type,
      phone, // เพิ่มเบอร์โทรศัพท์ในฟอร์ม
      job,
      alcoholConsumption,
      drinkingFrequency: alcoholConsumption === 'ไม่เคยดื่มเลยตลอดชีวิต' ? null : drinkingFrequency,
      intentPeriod: alcoholConsumption === 'ไม่เคยดื่มเลยตลอดชีวิต' ? null : intentPeriod,
      monthlyExpense: alcoholConsumption === 'ไม่เคยดื่มเลยตลอดชีวิต' ? null : parseInt(monthlyExpense),
      motivations,
      healthImpact,
      userId: session.user.id,
    };

    try {
      const res = await axios.post('/api/campaign-buddhist-lent', formData);
      router.push('/profile'); // เปลี่ยนเส้นทางไปยังโปรไฟล์หลังจากสร้างข้อมูลสำเร็จ
    } catch (error) {
      console.error('Error occurred:', error);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100 p-4">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-md shadow-md w-full max-w-lg space-y-4 overflow-auto" style={{ maxHeight: '80vh' }}>
        <h1 className="text-lg font-semibold mb-4 text-center">ลงทะเบียนเข้าร่วมโครงการงดเหล้าเข้าพรรษาปี 2567</h1>
        
        <div className="flex space-x-4">
          <div className="w-1/2">
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">ชื่อ</label>
            <input
              id="firstName"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div className="w-1/2">
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">สกุล</label>
            <input
              id="lastName"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="birthday" className="block text-sm font-medium text-gray-700">วันเกิด</label>
          <input
            id="birthday"
            type="date"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        
        <div>
          <label htmlFor="addressLine1" className="block text-sm font-medium text-gray-700">ที่อยู่ (เลขที่/หมู่บ้าน)</label>
          <input
            id="addressLine1"
            type="text"
            value={addressLine1}
            onChange={(e) => setAddressLine1(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        
        <div>
          <label htmlFor="district" className="block text-sm font-medium text-gray-700">ตำบล/เขต</label>
          <input
            id="district"
            type="text"
            value={district}
            onChange={handleDistrictChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
          {suggestions.length > 0 && (
            <ul className="border border-gray-300 mt-1 max-h-60 overflow-auto">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="cursor-pointer p-2 hover:bg-gray-200"
                >
                  {suggestion.district} - {suggestion.amphoe}, {suggestion.province}, {suggestion.zipcode}
                </li>
              ))}
            </ul>
          )}
        </div>
        
        <div>
          <label htmlFor="amphoe" className="block text-sm font-medium text-gray-700">อำเภอ</label>
          <input
            id="amphoe"
            type="text"
            value={amphoe}
            onChange={(e) => setAmphoe(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        
        <div>
          <label htmlFor="province" className="block text-sm font-medium text-gray-700">จังหวัด</label>
          <input
            id="province"
            type="text"
            value={province}
            onChange={(e) => setProvince(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        
        <div>
          <label htmlFor="zipcode" className="block text-sm font-medium text-gray-700">รหัสไปรษณีย์</label>
          <input
            id="zipcode"
            type="text"
            value={zipcode}
            onChange={(e) => setZipcode(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">เบอร์โทรศัพท์</label>
          <input
            id="phone"
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="job" className="block text-sm font-medium text-gray-700">อาชีพ</label>
          <select
            id="job"
            value={job}
            onChange={(e) => setJob(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="" disabled>เลือกอาชีพ</option>
            <option value="ประกอบธุรกิจส่วนตัว">ประกอบธุรกิจส่วนตัว</option>
            <option value="ข้าราชการ/ลูกจ้างหน่วยงานราชการ">ข้าราชการ/ลูกจ้างหน่วยงานราชการ</option>
            <option value="รัฐวิสาหกิจ">รัฐวิสาหกิจ</option>
            <option value="พนักงานเอกชน/ลูกจ้างเอกชน">พนักงานเอกชน/ลูกจ้างเอกชน</option>
            <option value="ค้าขาย/งานบริการ">ค้าขาย/งานบริการ</option>
            <option value="เกษตรกรรม">เกษตรกรรม</option>
            <option value="รับจ้างทั่วไป">รับจ้างทั่วไป</option>
            <option value="นักเรียน/นักศึกษา">นักเรียน/นักศึกษา</option>
            <option value="ข้าราชการเกษียณ">ข้าราชการเกษียณ</option>
            <option value="อื่น ๆ">อื่น ๆ</option>
          </select>
        </div>

        <div>
          <label htmlFor="alcoholConsumption" className="block text-sm font-medium text-gray-700">ท่านดื่มเครื่องดื่มแอลกอฮอล์หรือไม่</label>
          <select
            id="alcoholConsumption"
            value={alcoholConsumption}
            onChange={(e) => setAlcoholConsumption(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="" disabled>เลือกคำตอบ</option>
            <option value="ดื่ม (ย้อนหลังไป 1 ปี)">ดื่ม (ย้อนหลังไป 1 ปี)</option>
            <option value="เลิกดื่มมาแล้วมากกว่า 1 ปี แต่ยังไม่ถึง 3 ปี">เลิกดื่มมาแล้วมากกว่า 1 ปี แต่ยังไม่ถึง 3 ปี</option>
            <option value="เลิกดื่มมาแล้วมากกว่า 3 ปี">เลิกดื่มมาแล้วมากกว่า 3 ปี</option>
            <option value="ไม่เคยดื่มเลยตลอดชีวิต">ไม่เคยดื่มเลยตลอดชีวิต</option>
          </select>
        </div>

        {alcoholConsumption !== 'ไม่เคยดื่มเลยตลอดชีวิต' && (
          <>
            <div>
              <label htmlFor="drinkingFrequency" className="block text-sm font-medium text-gray-700">ท่านดื่มบ่อยแค่ไหน</label>
              <select
                id="drinkingFrequency"
                value={drinkingFrequency}
                onChange={(e) => setDrinkingFrequency(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="" disabled>เลือกคำตอบ</option>
                <option value="ทุกวัน (7 วัน/สัปดาห์)">ทุกวัน (7 วัน/สัปดาห์)</option>
                <option value="เกือบทุกวัน (3-5 วัน/สัปดาห์)">เกือบทุกวัน (3-5 วัน/สัปดาห์)</option>
                <option value="ทุกสัปดาห์ (1-2 วัน/สัปดาห์)">ทุกสัปดาห์ (1-2 วัน/สัปดาห์)</option>
                <option value="ทุกเดือน (1-3 วัน/เดือน)">ทุกเดือน (1-3 วัน/เดือน)</option>
                <option value="นาน ๆ ครั้ง (8-11 วัน/ปี)">นาน ๆ ครั้ง (8-11 วัน/ปี)</option>
              </select>
            </div>

            <div>
              <label htmlFor="intentPeriod" className="block text-sm font-medium text-gray-700">ตั้งใจงดดื่มแบบไหน</label>
              <select
                id="intentPeriod"
                value={intentPeriod}
                onChange={(e) => setIntentPeriod(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="" disabled>เลือกคำตอบ</option>
                <option value="1 เดือน">1 เดือน</option>
                <option value="2 เดือน">2 เดือน</option>
                <option value="3 เดือน">3 เดือน</option>
                <option value="ตลอดชีวิต">ตลอดชีวิต</option>
                <option value="ลดปริมาณการดื่ม">ลดปริมาณการดื่ม</option>
              </select>
            </div>

            <div>
              <label htmlFor="monthlyExpense" className="block text-sm font-medium text-gray-700">ค่าใช้จ่ายในการดื่มต่อเดือน (บาท)</label>
              <input
                id="monthlyExpense"
                type="number"
                value={monthlyExpense}
                onChange={(e) => setMonthlyExpense(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </>
        )}

        <div>
          <label htmlFor="motivations" className="block text-sm font-medium text-gray-700">แรงจูงใจในการงดเหล้า (เลือกได้หลายข้อ)</label>
          <div className="mt-2 space-y-2">
            <div className="flex items-center">
              <input
                id="motivation1"
                type="checkbox"
                value="เพื่อลูกและครอบครัว"
                onChange={(e) => handleCheckboxChange(e, setMotivations)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="motivation1" className="ml-2 text-sm font-medium text-gray-700">เพื่อลูกและครอบครัว</label>
            </div>
            <div className="flex items-center">
              <input
                id="motivation2"
                type="checkbox"
                value="เพื่อสุขภาพของตนเอง"
                onChange={(e) => handleCheckboxChange(e, setMotivations)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="motivation2" className="ml-2 text-sm font-medium text-gray-700">เพื่อสุขภาพของตนเอง</label>
            </div>
            <div className="flex items-center">
              <input
                id="motivation3"
                type="checkbox"
                value="ได้บุญ/รักษาศีล"
                onChange={(e) => handleCheckboxChange(e, setMotivations)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="motivation3" className="ml-2 text-sm font-medium text-gray-700">ได้บุญ/รักษาศีล</label>
            </div>
            <div className="flex items-center">
              <input
                id="motivation4"
                type="checkbox"
                value="ผู้นำชุมชนชักชวน"
                onChange={(e) => handleCheckboxChange(e, setMotivations)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="motivation4" className="ml-2 text-sm font-medium text-gray-700">ผู้นำชุมชนชักชวน</label>
            </div>
            <div className="flex items-center">
              <input
                id="motivation5"
                type="checkbox"
                value="คนรักและเพื่อนชวน"
                onChange={(e) => handleCheckboxChange(e, setMotivations)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="motivation5" className="ml-2 text-sm font-medium text-gray-700">คนรักและเพื่อนชวน</label>
            </div>
            <div className="flex items-center">
              <input
                id="motivation6"
                type="checkbox"
                value="ประหยัดเงิน"
                onChange={(e) => handleCheckboxChange(e, setMotivations)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="motivation6" className="ml-2 text-sm font-medium text-gray-700">ประหยัดเงิน</label>
            </div>
            <div className="flex items-center">
              <input
                id="motivation7"
                type="checkbox"
                value="เพื่อเป็นแบบอย่างที่ดีให้กับคนอื่น"
                onChange={(e) => handleCheckboxChange(e, setMotivations)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="motivation7" className="ml-2 text-sm font-medium text-gray-700">เพื่อเป็นแบบอย่างที่ดีให้กับคนอื่น</label>
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="healthImpact" className="block text-sm font-medium text-gray-700">ผลกระทบต่อสุขภาพ</label>
          <select
            id="healthImpact"
            value={healthImpact}
            onChange={(e) => setHealthImpact(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="" disabled>เลือกคำตอบ</option>
            <option value="ไม่มีผลกระทบ">ไม่มีผลกระทบ</option>
            <option value="มีผลกระทบแต่ไม่ต้องการช่วยเหลือ">มีผลกระทบแต่ไม่ต้องการช่วยเหลือ</option>
            <option value="มีผลกระทบและควรได้รับการช่วยเหลือจากแพทย์หรือผู้เชี่ยวชาญด้านการบำบัดสุรา">มีผลกระทบและควรได้รับการช่วยเหลือจากแพทย์หรือผู้เชี่ยวชาญด้านการบำบัดสุรา</option>
          </select>
        </div>

        <button type="submit" className="w-full bg-amber-800 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          Submit
        </button>
      </form>
    </div>
  );
}
