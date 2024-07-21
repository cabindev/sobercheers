'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Timeline from './components/timeline/timeline';
import ProfileCard from './components/profileCard/card';

interface Campaign {
  id: number;
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
  motivations: string[] | string;
  healthImpact: string;
  userId: string;
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  image: string | null;
  role: string;
}

interface Session {
  user: User;
}

const siteUrl = 'https://healthy-sobriety.sdnthailand.com/';

export default function Profile() {
  const { data: session, status } = useSession() as { data: Session | null; status: string };
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [showCampaigns, setShowCampaigns] = useState(false);
  const [showProfileCard, setShowProfileCard] = useState(false);
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

  if (status !== "authenticated" || !session?.user) {
    return null;
  }

  const isAdmin = session.user.role === 'admin';

  const handleEditProfile = () => {
    router.push(`/auth/form_signup/edit/${session.user.id}`);
  };

  return (
    <>
      <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8 px-4">
        <div className="avatar">
          <div className="w-32 rounded-full">
            <img
              src={
                imageError
                  ? "/images/default-profile.png"
                  : session.user.image || "/images/default-profile.png"
              }
              alt="User image"
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
            className="badge flex-1 px-6 py-2 mt-4 text-center bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600"
            onClick={handleEditProfile}
          >
            แก้ไขข้อมูลส่วนตัว
          </button>
          <button
            className="badge flex-1 px-6 py-2 text-center bg-indigo-500 text-white font-semibold rounded-lg hover:bg-indigo-600"
            onClick={() => setShowCampaigns(!showCampaigns)}
          >
            กิจกรรม
          </button>
          {isAdmin && (
            <button
              className="badge flex-1 px-6 py-2 mt-4 text-center bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600"
              onClick={() => router.push("/dashboard")}
            >
              ไปที่แดชบอร์ด
            </button>
          )}
          <button
            className="badge flex-1 px-6 py-2 mt-4 text-center bg-purple-500 text-white font-semibold rounded-lg hover:bg-purple-600"
            onClick={() => setShowProfileCard(!showProfileCard)}
          >
            การ์ดส่วนตัว
          </button>
        </div>

        {showProfileCard && campaigns.length > 0 && (
          <ProfileCard
            firstName={campaigns[0].firstName}
            lastName={campaigns[0].lastName}
            image={session.user.image || "/images/default-profile.png"}
            motivations={campaigns[0].motivations}
            intentPeriod={campaigns[0].intentPeriod}
          />
        )}

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
                          <div className="ring-primary ring-offset-base-100 w-10 rounded-full ring ring-offset-2">
                            <img
                              src={
                                imageError
                                  ? "/images/default-profile.png"
                                  : session.user.image ||
                                    "/images/default-profile.png"
                              }
                              alt="User image"
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
                                {typeof campaign.monthlyExpense === "number"
                                  ? campaign.monthlyExpense.toLocaleString() +
                                    " บาท"
                                  : "ไม่ระบุ"}
                              </p>
                            </>
                          )}
                          <p>
                            <strong>แรงจูงใจ:</strong>{" "}
                            {Array.isArray(campaign.motivations)
                              ? campaign.motivations.join(", ")
                              : campaign.motivations}
                          </p>
                          <p>
                            <strong>ผลกระทบต่อสุขภาพ:</strong>{" "}
                            {campaign.healthImpact}
                          </p>
                        </div>
                      )}
                      <div className="flex items-center space-x-2 mt-4">
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
                        <Link
                          className="badge badge-ghost cursor-pointer"
                          href={`/form_campaign_buddhist_lent/edit/${campaign.id}`}
                        >
                          Edit
                        </Link>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="btn-btn-xs flex-1 px-6 py-2 text-center bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        )}
        <Timeline userId={session.user.id.toString()} />
      </div>
    </>
  );
}