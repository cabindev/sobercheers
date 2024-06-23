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

export default function Profile() {
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
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  return (
    status === "authenticated" &&
    session.user && (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8 px-4">
        <div className="avatar online mb-4">
          <div className="w-32 h-32 rounded-full border-4 border-indigo-500">
            <Image
              src={
                imageError
                  ? "/images/default-profile.png"
                  : session.user.image || "/images/default-profile.png"
              }
              alt="User image"
              width={128}
              height={128}
              className="rounded-full"
              onError={() => setImageError(true)}
            />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-gray-800">
          {session.user.firstName} {session.user.lastName}
        </h2>
        <p className="text-gray-500 mb-6">{session.user.email}</p>
        <div className="w-full max-w-4xl bg-white p-6 rounded-md shadow-md mb-4">
          <h1 className="text-2xl font-semibold mb-4">ข้อมูลส่วนตัว</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-indigo-100 p-4 rounded-lg">
              <p>
                <strong>ชื่อ:</strong> {session.user.firstName}
              </p>
            </div>
            <div className="bg-indigo-100 p-4 rounded-lg">
              <p>
                <strong>สกุล:</strong> {session.user.lastName}
              </p>
            </div>
            <div className="bg-indigo-100 p-4 rounded-lg">
              <p>
                <strong>อีเมล:</strong> {session.user.email}
              </p>
            </div>
            <div className="bg-indigo-100 p-4 rounded-lg">
              <p>
                <strong>สมาชิก:</strong> {session.user.role}
              </p>
            </div>
          </div>
          <button
            className=" badge flex-1 px-6 py-2 text-center bg-indigo-500 text-white font-semibold rounded-lg hover:bg-indigo-600"
            onClick={() => setShowCampaigns(!showCampaigns)}
          >
            กิจกรรม
          </button>
        </div>

        {showCampaigns && (
          <div className="mt-8 w-full max-w-4xl bg-white p-6 rounded-md shadow-md">
            <h1 className="text-2xl font-semibold mb-4">
              กิจกรรม : งดเหล้าเข้าพรรษา
            </h1>
            <ul>
              {campaigns.map((campaign, index) => (
                <li key={index} className="border-b py-2">
                  <div className="card w-full bg-base-100 shadow-xl mb-4">
                    <div className="card-body">
                      <div className="chat chat-start">
                        <div className="chat-image avatar">
                          <div className="w-10 rounded-full">
                            <Image
                              src={
                                imageError
                                  ? "/images/default-profile.png"
                                  : session.user.image ||
                                    "/images/default-profile.png"
                              }
                              alt="User image"
                              width={128}
                              height={128}
                              className="rounded-full"
                              onError={() => setImageError(true)}
                            />
                          </div>
                        </div>
                        <div className="chat-bubble bg-amber-400 text-white">
                          <strong>ความตั้งใจในการงดเหล้าเข้าพรรษา :</strong>{" "}
                          {campaign.intentPeriod}
                        </div>
                      </div>

                      <h2 className="card-title">
                        {campaign.firstName} {campaign.lastName}
                        <div className="badge badge-accent">
                          {calculateAge(campaign.birthday)} ปี
                        </div>
                      </h2>
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
                        onClick={() =>
                          setSelectedCampaign(
                            selectedCampaign === campaign ? null : campaign
                          )
                        }
                      >
                        {selectedCampaign === campaign
                          ? "show less"
                          : "show more"}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <button
              onClick={() => signOut({ callbackUrl: "/api/auth/signin" })}
              className="btn-btn-xs flex-1 px-6 py-2 text-center bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    )
  );
}
