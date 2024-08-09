"use client";
import React, { useState, FormEvent, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { data } from "@/app/data/regions";

interface SoberCheersFormData {
  firstName: string;
  lastName: string;
  gender: string;
  birthday: string;
  addressLine1: string;
  district: string;
  amphoe: string;
  province: string;
  zipcode: string;
  type: string;
  phone: string;
  job: string;
  alcoholConsumption: string;
  drinkingFrequency: string | null;
  intentPeriod: string | null;
  monthlyExpense: number | null;
  motivations: string[];
  healthImpact: string;
}

export default function CreateSoberCheers() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [birthday, setBirthday] = useState("");
  const [age, setAge] = useState<number | null>(null);
  const [addressLine1, setAddressLine1] = useState("");
  const [district, setDistrict] = useState("");
  const [amphoe, setAmphoe] = useState("");
  const [province, setProvince] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [type, setType] = useState("");
  const [phone, setPhone] = useState("");
  const [job, setJob] = useState("");
  const [alcoholConsumption, setAlcoholConsumption] = useState("");
  const [drinkingFrequency, setDrinkingFrequency] = useState("");
  const [intentPeriod, setIntentPeriod] = useState("");
  const [monthlyExpense, setMonthlyExpense] = useState("");
  const [motivations, setMotivations] = useState<string[]>([]);
  const [healthImpact, setHealthImpact] = useState("ไม่มีผลกระทบ");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [autoFilledFields, setAutoFilledFields] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (birthday) {
      const birthDate = new Date(birthday);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      setAge(age);
    }
  }, [birthday]);

  const handleDistrictChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDistrict(value);
    setAutoFilledFields([]); // Reset auto-filled fields when user types

    if (value.length > 0) {
      const filteredSuggestions = data
        .filter((region) =>
          region.district.toLowerCase().startsWith(value.toLowerCase())
        )
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
    setAutoFilledFields(["amphoe", "province", "zipcode",]);
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMotivations((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  const formatMonthlyExpense = (value: string) => {
    const number = parseInt(value.replace(/,/g, ""));
    return isNaN(number) ? "" : number.toLocaleString();
  };

  const isValidPhoneNumber = (phone: string) => {
    return /^[0-9]{10}$/.test(phone);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    if (value.length <= 10) {
      setPhone(value);
      setPhoneError(null);
    }
    if (value.length === 10 && !isValidPhoneNumber(value)) {
      setPhoneError("กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง");
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setPhoneError(null);

    if (phone && !isValidPhoneNumber(phone)) {
      setPhoneError("กรุณากรอกเบอร์โทรศัพท์ให้ครบ 10 หลัก หรือเว้นว่างไว้");
      return;
    }

    const formData: SoberCheersFormData = {
      firstName,
      lastName,
      gender,
      birthday,
      addressLine1,
      district,
      amphoe,
      province,
      zipcode,
      type,
      phone,
      job,
      alcoholConsumption,
      drinkingFrequency: [
        "ดื่ม (ย้อนหลังไป 1 ปี)",
        "เลิกดื่มมาแล้วมากกว่า 1 ปี แต่ยังไม่ถึง 3 ปี",
      ].includes(alcoholConsumption)
        ? drinkingFrequency
        : null,
      intentPeriod: [
        "ดื่ม (ย้อนหลังไป 1 ปี)",
        "เลิกดื่มมาแล้วมากกว่า 1 ปี แต่ยังไม่ถึง 3 ปี",
      ].includes(alcoholConsumption)
        ? intentPeriod
        : null,
      monthlyExpense: [
        "ดื่ม (ย้อนหลังไป 1 ปี)",
        "เลิกดื่มมาแล้วมากกว่า 1 ปี แต่ยังไม่ถึง 3 ปี",
      ].includes(alcoholConsumption)
        ? parseInt(monthlyExpense.replace(/,/g, ""))
        : null,
      motivations,
      healthImpact,
    };

    try {
      const res = await axios.post("/api/soberCheers", formData);
      if (res.status === 201) {
        router.push("/soberCheers");
      } else {
        throw new Error("Failed to create SoberCheers");
      }
    } catch (error: any) {
      console.error("Error occurred:", error);
      setError(
        error.response?.data?.error ||
          "เกิดข้อผิดพลาดในการส่งข้อมูล กรุณาลองใหม่อีกครั้ง"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-amber-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-6">
            <h1 className="text-2xl font-semibold mb-6 text-center text-amber-600">
              ลงทะเบียน SOBER CHEERs / ชวนช่วย ชมเชียร์ เชิดชู
            </h1>

            <div className="flex space-x-4">
              <div className="w-1/2">
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700"
                >
                  ชื่อ
                </label>
                <input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                />
              </div>
              <div className="w-1/2">
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700"
                >
                  สกุล
                </label>
                <input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                เพศ
              </label>
              <div className="mt-2 space-x-4">
                {["ชาย", "หญิง", "LGBTQ"].map((genderOption) => (
                  <label
                    key={genderOption}
                    className="inline-flex items-center"
                  >
                    <input
                      type="radio"
                      name="gender"
                      value={genderOption}
                      checked={gender === genderOption}
                      onChange={(e) => setGender(e.target.value)}
                      required
                      className="form-radio h-4 w-4 text-amber-600 transition duration-150 ease-in-out"
                    />
                    <span className="ml-2">{genderOption}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label
                htmlFor="birthday"
                className="block text-sm font-medium text-gray-700"
              >
                วันเกิด/วัน/เดือน/ปี ค.ศ
              </label>
              <input
                id="birthday"
                type="date"
                value={birthday}
                onChange={(e) => setBirthday(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
              />
              {age !== null && (
                <p className="mt-1 text-sm text-gray-500">อายุ: {age} ปี</p>
              )}
            </div>

            <div>
              <label
                htmlFor="addressLine1"
                className="block text-sm font-medium text-gray-700"
              >
                ที่อยู่ (เลขที่/หมู่บ้าน)
              </label>
              <input
                id="addressLine1"
                type="text"
                value={addressLine1}
                onChange={(e) => setAddressLine1(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="district"
                className="block text-sm font-medium text-gray-700"
              >
                ตำบล/แขวง <br />
                <span className="text-red-500 block text-center">
                  ไม่ต้องระบุ ตำบล หรือ ต./ให้ระบุชื่อตำบลโดยไม่มีคำนำหน้า
                </span>
                
              </label>
              <input
                id="district"
                type="text"
                value={district}
                onChange={handleDistrictChange}
                required
                placeholder="ระบุชื่อตำบลโดยไม่มีคำนำหน้า ระบบจะแนะนำข้อมูลที่เกี่ยวข้อง"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
              />
              {suggestions.length > 0 && (
                <ul className="absolute z-10 w-full bg-white border border-gray-300 mt-1 max-h-60 overflow-auto rounded-md shadow-lg">
                  {suggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="cursor-pointer p-2 hover:bg-amber-100 text-sm"
                    >
                      {suggestion.district} - {suggestion.amphoe},{" "}
                      {suggestion.province}, {suggestion.zipcode}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div>
              <label
                htmlFor="amphoe"
                className="block text-sm font-medium text-gray-700"
              >
                อำเภอ/เขต
              </label>
              <input
                id="amphoe"
                type="text"
                value={amphoe}
                onChange={(e) => setAmphoe(e.target.value)}
                required
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm ${
                  autoFilledFields.includes("amphoe")
                    ? "bg-green-50 border-green-300"
                    : "border-gray-300"
                }`}
              />
              {autoFilledFields.includes("amphoe") && (
                <p className="mt-1 text-xs text-green-600">
                  ข้อมูลถูกกรอกอัตโนมัติ
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="province"
                className="block text-sm font-medium text-gray-700"
              >
                จังหวัด
              </label>
              <input
                id="province"
                type="text"
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                required
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm ${
                  autoFilledFields.includes("province")
                    ? "bg-green-50 border-green-300"
                    : "border-gray-300"
                }`}
              />
              {autoFilledFields.includes("province") && (
                <p className="mt-1 text-xs text-green-600">
                  ข้อมูลถูกกรอกอัตโนมัติ
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="zipcode"
                className="block text-sm font-medium text-gray-700"
              >
                รหัสไปรษณีย์
              </label>
              <input
                id="zipcode"
                type="text"
                value={zipcode}
                onChange={(e) => setZipcode(e.target.value)}
                required
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm ${
                  autoFilledFields.includes("zipcode")
                    ? "bg-green-50 border-green-300"
                    : "border-gray-300"
                }`}
              />
              {autoFilledFields.includes("zipcode") && (
                <p className="mt-1 text-xs text-green-600">
                  ข้อมูลถูกกรอกอัตโนมัติ
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700"
              >
                เบอร์โทรศัพท์ (ไม่บังคับ)
              </label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={handlePhoneChange}
                maxLength={10}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
              />
              {phoneError && (
                <p className="mt-1 text-sm text-red-600">{phoneError}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="job"
                className="block text-sm font-medium text-gray-700"
              >
                อาชีพ
              </label>
              <select
                id="job"
                value={job}
                onChange={(e) => setJob(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
              >
                <option value="" disabled>
                  เลือกอาชีพ
                </option>
                <option value="ประกอบธุรกิจส่วนตัว">ประกอบธุรกิจส่วนตัว</option>
                <option value="ข้าราชการ/ลูกจ้างหน่วยงานราชการ">
                  ข้าราชการ/ลูกจ้างหน่วยงานราชการ
                </option>
                <option value="รัฐวิสาหกิจ">รัฐวิสาหกิจ</option>
                <option value="พนักงานเอกชน/ลูกจ้างเอกชน">
                  พนักงานเอกชน/ลูกจ้างเอกชน
                </option>
                <option value="ค้าขาย/งานบริการ">ค้าขาย/งานบริการ</option>
                <option value="เกษตรกรรม">เกษตรกรรม</option>
                <option value="รับจ้างทั่วไป">รับจ้างทั่วไป</option>
                <option value="นักเรียน/นักศึกษา">นักเรียน/นักศึกษา</option>
                <option value="ข้าราชการเกษียณ">ข้าราชการเกษียณ</option>
                <option value="อื่น ๆ">อื่น ๆ</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="alcoholConsumption"
                className="block text-sm font-medium text-gray-700"
              >
                ท่านดื่มเครื่องดื่มแอลกอฮอล์หรือไม่
              </label>
              <select
                id="alcoholConsumption"
                value={alcoholConsumption}
                onChange={(e) => setAlcoholConsumption(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
              >
                <option value="" disabled>
                  เลือกคำตอบ
                </option>
                <option value="ดื่ม (ย้อนหลังไป 1 ปี)">
                  ดื่ม (ย้อนหลังไป 1 ปี)
                </option>
                <option value="เลิกดื่มมาแล้วมากกว่า 1 ปี แต่ยังไม่ถึง 3 ปี">
                  เลิกดื่มมาแล้วมากกว่า 1 ปี แต่ยังไม่ถึง 3 ปี
                </option>
                <option value="เลิกดื่มมาแล้วมากกว่า 3 ปี">
                  เลิกดื่มมาแล้วมากกว่า 3 ปี
                </option>
                <option value="ไม่เคยดื่มเลยตลอดชีวิต">
                  ไม่เคยดื่มเลยตลอดชีวิต
                </option>
              </select>
            </div>

            {(alcoholConsumption === "ดื่ม (ย้อนหลังไป 1 ปี)" ||
              alcoholConsumption ===
                "เลิกดื่มมาแล้วมากกว่า 1 ปี แต่ยังไม่ถึง 3 ปี") && (
              <>
                <div>
                  <label
                    htmlFor="drinkingFrequency"
                    className="block text-sm font-medium text-gray-700"
                  >
                    ท่านดื่มบ่อยแค่ไหน
                  </label>
                  <select
                    id="drinkingFrequency"
                    value={drinkingFrequency}
                    onChange={(e) => setDrinkingFrequency(e.target.value)}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                  >
                    <option value="" disabled>
                      เลือกคำตอบ
                    </option>
                    <option value="ทุกวัน (7 วัน/สัปดาห์)">
                      ทุกวัน (7 วัน/สัปดาห์)
                    </option>
                    <option value="เกือบทุกวัน (3-5 วัน/สัปดาห์)">
                      เกือบทุกวัน (3-5 วัน/สัปดาห์)
                    </option>
                    <option value="ทุกสัปดาห์ (1-2 วัน/สัปดาห์)">
                      ทุกสัปดาห์ (1-2 วัน/สัปดาห์)
                    </option>
                    <option value="ทุกเดือน (1-3 วัน/เดือน)">
                      ทุกเดือน (1-3 วัน/เดือน)
                    </option>
                    <option value="นาน ๆ ครั้ง (8-11 วัน/ปี)">
                      นาน ๆ ครั้ง (8-11 วัน/ปี)
                    </option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="monthlyExpense"
                    className="block text-sm font-medium text-gray-700"
                  >
                    ค่าใช้จ่ายในการดื่มต่อเดือน (บาท)
                  </label>
                  <input
                    id="monthlyExpense"
                    type="text"
                    value={formatMonthlyExpense(monthlyExpense)}
                    onChange={(e) => setMonthlyExpense(e.target.value)}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label
                    htmlFor="intentPeriod"
                    className="block text-sm font-medium text-gray-700"
                  >
                    ตั้งใจงดดื่มแบบไหน
                  </label>
                  <select
                    id="intentPeriod"
                    value={intentPeriod}
                    onChange={(e) => setIntentPeriod(e.target.value)}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                  >
                    <option value="" disabled>
                      เลือกคำตอบ
                    </option>
                    <option value="1 เดือน">1 เดือน</option>
                    <option value="2 เดือน">2 เดือน</option>
                    <option value="3 เดือน">3 เดือน</option>
                    <option value="ตลอดชีวิต">ตลอดชีวิต</option>
                    <option value="ลดปริมาณการดื่ม">ลดปริมาณการดื่ม</option>
                  </select>
                </div>
              </>
            )}

            <div>
              <label
                htmlFor="motivations"
                className="block text-sm font-medium text-gray-700"
              >
                แรงจูงใจในการงดเหล้า (เลือกได้หลายข้อ)
              </label>
              <div className="mt-2 space-y-2">
                {[
                  "เพื่อลูกและครอบครัว",
                  "เพื่อสุขภาพของตนเอง",
                  "ได้บุญ/รักษาศีล",
                  "ผู้นำชุมชนชักชวน",
                  "คนรักและเพื่อนชวน",
                  "ประหยัดเงิน",
                  "เพื่อเป็นแบบอย่างที่ดีให้กับคนอื่น",
                ].map((motivation, index) => (
                  <div key={index} className="flex items-center">
                    <input
                      id={`motivation${index + 1}`}
                      type="checkbox"
                      value={motivation}
                      checked={motivations.includes(motivation)}
                      onChange={(e) => handleCheckboxChange(e)}
                      className="h-4 w-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                    />
                    <label
                      htmlFor={`motivation${index + 1}`}
                      className="ml-2 text-sm font-medium text-gray-700"
                    >
                      {motivation}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label
                htmlFor="healthImpact"
                className="block text-sm font-medium text-gray-700"
              >
                ผลกระทบต่อสุขภาพ
              </label>
              <select
                id="healthImpact"
                value={healthImpact}
                onChange={(e) => setHealthImpact(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
              >
                <option value="" disabled>
                  เลือกคำตอบ
                </option>
                <option value="ไม่มีผลกระทบ">ไม่มีผลกระทบ</option>
                <option value="มีผลกระทบแต่ไม่ต้องการช่วยเหลือ">
                  มีผลกระทบแต่ไม่ต้องการช่วยเหลือ
                </option>
                <option value="มีผลกระทบและควรได้รับการช่วยเหลือจากแพทย์หรือผู้เชี่ยวชาญด้านการบำบัดสุรา">
                  มีผลกระทบและควรได้รับการช่วยเหลือจากแพทย์หรือผู้เชี่ยวชาญด้านการบำบัดสุรา
                </option>
              </select>
            </div>

            {error && <div className="text-red-500 mt-2">{error}</div>}

            <button
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition duration-200"
            >
              ลงทะเบียน
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
