'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import axios from 'axios';

interface Campaign {
  firstName: string;
  lastName: string;
  birthday: string;
  addressLine1: string;
  district: string;
  amphoe: string;
  province: string;
  zipcode: string;
  phone: string;
  job: string;
  alcoholConsumption: string;
  drinkingFrequency: string;
  intentPeriod: string;
  monthlyExpense: number;
  motivation: string[];
  healthImpact: string;
}

export default function Buddhist() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [showCampaigns, setShowCampaigns] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (status === 'authenticated' && session?.user) {
      // Fetch campaigns for the user
      axios.get(`/api/campaign-buddhist-lent?userId=${session.user.id}`)
        .then(res => {
          if (res.data.campaigns) {
            setCampaigns(res.data.campaigns);
          }
        })
        .catch(err => console.error('Error fetching campaigns:', err));
    }
  }, [status, session, router]);

  const calculateAge = (birthday: string) => {
    const birthDate = new Date(birthday);
    const ageDifMs = Date.now() - birthDate.getTime();
    const ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  return (
    status === "authenticated" &&
    session.user && (
      <div className="min-h-screen bg-gray-100 flex flex-col lg:flex-row">
        {/* Sidebar */}
        <aside className="w-full lg:w-1/4 bg-slate-800 text-white flex flex-col items-center py-6 lg:py-12 px-4 lg:px-8">
          <Image
            src={
              imageError
                ? "/images/default-profile.png"
                : session.user.image || "/images/default-profile.png"
            }
            className="rounded-full mb-4"
            alt="User image"
            width={128}
            height={128}
            onError={() => setImageError(true)}
          />
          <h2 className="text-2xl font-semibold">
            {session.user.firstName} {session.user.lastName}
          </h2>
          <p className="text-gray-400 mb-6">{session.user.email}</p>
          <nav className="mt-6 w-full">
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="block py-2 px-4 text-center bg-slate-700 rounded hover:bg-slate-600"
                >
                  ข้อมูลส่วนตัว
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block py-2 px-4 text-center bg-slate-700 rounded hover:bg-slate-600"
                >
                  ตั้งค่า
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block py-2 px-4 text-center bg-slate-700 rounded hover:bg-slate-600"
                  onClick={() => setShowCampaigns(!showCampaigns)}
                >
                  กิจกรรม
                </a>
              </li>
            </ul>
          </nav>
          <button
            onClick={() => signOut({ callbackUrl: "/api/auth/signin" })}
            className="mt-auto w-full bg-red-600 hover:bg-red-500 text-white py-2 rounded"
          >
            Logout
          </button>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto bg-white p-6 rounded-md shadow-md">
            <h1 className="text-2xl font-semibold mb-4">ข้อมูลส่วนตัว</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p>
                  <strong>ชื่อ:</strong> {session.user.firstName}
                </p>
                <p>
                  <strong>สกุล:</strong> {session.user.lastName}
                </p>
                <p>
                  <strong>อีเมล:</strong> {session.user.email}
                </p>
                <p>
                  <strong>บทบาท:</strong> {session.user.role}
                </p>
              </div>
              <div>{/* Additional user information can be added here */}</div>
            </div>
          </div>

          {/* Campaign List */}
          {showCampaigns && (
            <div className="mt-8 max-w-4xl mx-auto bg-white p-6 rounded-md shadow-md">
              <h1 className="text-2xl font-semibold mb-4">กิจกรรม : งดเหล้าเข้าพรรษา</h1>
              <ul>
                {campaigns.map((campaign, index) => (
                  <li key={index} className="border-b py-2">
                    <p>
                      {campaign.firstName} {campaign.lastName}
                    </p>
                    <p className="text-gray-500">
                      {calculateAge(campaign.birthday)} ปี
                    </p>
                    {selectedCampaign === campaign && (
                      <div>
                        <p>
                          <strong>ที่อยู่:</strong> {campaign.addressLine1},{" "}
                          {campaign.district}, {campaign.amphoe},{" "}
                          {campaign.province}, {campaign.zipcode}
                        </p>
                        <p>
                          <strong>โทรศัพท์:</strong> {campaign.phone}
                        </p>
                        <p>
                          <strong>อาชีพ:</strong> {campaign.job}
                        </p>
                        <p>
                          <strong>การบริโภคแอลกอฮอล์:</strong>{" "}
                          {campaign.alcoholConsumption}
                        </p>
                        {campaign.alcoholConsumption !==
                          "ไม่เคยดื่มเลยตลอดชีวิต" && (
                          <>
                            <p>
                              <strong>ความถี่ในการดื่ม:</strong>{" "}
                              {campaign.drinkingFrequency}
                            </p>
                            <p>
                              <strong>ความตั้งใจในการงด:</strong>{" "}
                              {campaign.intentPeriod}
                            </p>
                            <p>
                              <strong>ค่าใช้จ่ายต่อเดือน:</strong>{" "}
                              {campaign.monthlyExpense.toLocaleString()} บาท
                            </p>
                          </>
                        )}
                        <p>
                          <strong>แรงจูงใจ:</strong>{" "}
                          {Array.isArray(campaign.motivation)
                            ? campaign.motivation.join(", ")
                            : campaign.motivation}
                        </p>
                        <p>
                          <strong>ผลกระทบต่อสุขภาพ:</strong>{" "}
                          {campaign.healthImpact}
                        </p>
                      </div>
                    )}
                    <div
                      className="badge badge-ghost cursor-pointer"
                      onClick={() => setSelectedCampaign(campaign)}
                    >
                      show more
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </main>
      </div>
    )
  );
}
