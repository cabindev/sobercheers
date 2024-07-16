import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';



interface TimelineStep {
  title: string;
  date: Date;
  healthInfo: string;
  icon: string;
}

interface CampaignData {
  monthlyExpense: number;
  intentPeriod: string;
  birthday: Date;
}

const CongratulationsMessage: React.FC = () => {
  return (
    <motion.div
      className="bg-white rounded-lg shadow-lg p-8 text-center"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl font-bold text-green-600 mb-4">ยินดีด้วย!</h2>
      <p className="text-xl mb-4">คุณเป็นผู้ที่ไม่ดื่มแอลกอฮอล์ตลอดชีวิต</p>
      <p className="text-md text-gray-600">
        การตัดสินใจของคุณส่งผลดีต่อสุขภาพและคุณภาพชีวิตอย่างมาก
        ขอให้คุณมีความสุขและสุขภาพแข็งแรงตลอดไป
      </p>
    </motion.div>
  );
};

const Timeline: React.FC<{ userId: number }> = ({ userId }) => {
  const [campaignData, setCampaignData] = useState<CampaignData | null>(null);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [showConfetti, setShowConfetti] = useState<boolean>(false);

  const buddhistLentStart: Date = new Date('2024-07-21');
  const buddhistLentEnd: Date = new Date('2024-10-17');

  useEffect(() => {
    const fetchCampaignData = async () => {
      try {
        const response = await fetch(`/api/campaign-buddhist-lent?userId=${userId}`);
        const data = await response.json();
        if (data.campaigns && data.campaigns.length > 0) {
          setCampaignData({
            ...data.campaigns[0],
            birthday: new Date(data.campaigns[0].birthday)
          });
          if (!data.campaigns[0].monthlyExpense) {
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 10000);
          }
        }
      } catch (error) {
        console.error('Error fetching campaign data:', error);
      }
    };

    fetchCampaignData();
    const timer = setInterval(() => setCurrentDate(new Date()), 1000);
    return () => clearInterval(timer);
  }, [userId]);

  useEffect(() => {
    if (campaignData && campaignData.monthlyExpense && currentDate >= calculateEndDate()) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 10000);
    }
  }, [currentDate, campaignData]);

  const calculateAge = (birthday: Date): number => {
    const today = new Date();
    let age = today.getFullYear() - birthday.getFullYear();
    const m = today.getMonth() - birthday.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthday.getDate())) {
      age--;
    }
    return age;
  };

  const calculateRemainingYears = (birthday: Date): number => {
    const age = calculateAge(birthday);
    return Math.max(0, 80 - age);
  };

  const calculateEndDate = (): Date => {
    if (!campaignData) return buddhistLentEnd;
    
    switch (campaignData.intentPeriod) {
      case '1 เดือน':
        return new Date(buddhistLentStart.getFullYear(), buddhistLentStart.getMonth() + 1, buddhistLentStart.getDate());
      case '2 เดือน':
        return new Date(buddhistLentStart.getFullYear(), buddhistLentStart.getMonth() + 2, buddhistLentStart.getDate());
      case '3 เดือน':
        return buddhistLentEnd;
      case 'ตลอดชีวิต':
        return new Date(9999, 11, 31); // วันที่ไกลในอนาคต
      case 'ลดปริมาณการดื่ม':
        return buddhistLentEnd;
      default:
        return buddhistLentEnd;
    }
  };

  const calculateSavings = (): number => {
    if (!campaignData) return 0;
    const dailyExpense = campaignData.monthlyExpense / 30;
    const startDate = currentDate < buddhistLentStart ? buddhistLentStart : currentDate;
    const daysPassed = Math.max(0, Math.floor((startDate.getTime() - buddhistLentStart.getTime()) / (1000 * 3600 * 24)));
    
    if (campaignData.intentPeriod === 'ลดปริมาณการดื่ม') {
      return Math.round(dailyExpense * daysPassed * 0.5); // สมมติว่าลดลง 50%
    }
    return Math.round(dailyExpense * daysPassed);
  };

  const calculateTotalPossibleSavings = (): { total: number; monthly: number; years: number } => {
    if (!campaignData) return { total: 0, monthly: 0, years: 0 };
    const monthlyExpense = campaignData.monthlyExpense;
    const endDate = calculateEndDate();
    const totalDays = Math.ceil((endDate.getTime() - buddhistLentStart.getTime()) / (1000 * 3600 * 24));
    
    switch (campaignData.intentPeriod) {
      case 'ตลอดชีวิต':
        const remainingYears = calculateRemainingYears(campaignData.birthday);
        return {
          total: monthlyExpense * 12 * remainingYears,
          monthly: monthlyExpense,
          years: remainingYears
        };
      case 'ลดปริมาณการดื่ม':
        return {
          total: Math.round(monthlyExpense * (totalDays / 30) * 0.5),
          monthly: Math.round(monthlyExpense * 0.5),
          years: totalDays / 365
        };
      default:
        return {
          total: Math.round(monthlyExpense * (totalDays / 30)),
          monthly: monthlyExpense,
          years: totalDays / 365
        };
    }
  };

  const getSteps = (): TimelineStep[] => {
    if (!campaignData) return [];

    const baseSteps: TimelineStep[] = [
      {
        title: 'เริ่มต้นเข้าพรรษา',
        date: buddhistLentStart,
        healthInfo: 'คุณพร้อมแล้วสำหรับการเปลี่ยนแปลงตัวเอง',
        icon: '🍃'
      }
    ];

    if (['2 เดือน', '3 เดือน', 'ตลอดชีวิต', 'ลดปริมาณการดื่ม'].includes(campaignData.intentPeriod)) {
      baseSteps.push({
        title: '1 เดือนผ่านไป',
        date: new Date(buddhistLentStart.getFullYear(), buddhistLentStart.getMonth() + 1, buddhistLentStart.getDate()),
        healthInfo: 'การนอนหลับดีขึ้น ผิวพรรณเปล่งปลั่ง',
        icon: '😴'
      });
    }

    if (['3 เดือน', 'ตลอดชีวิต'].includes(campaignData.intentPeriod)) {
      baseSteps.push({
        title: '2 เดือนผ่านไป',
        date: new Date(buddhistLentStart.getFullYear(), buddhistLentStart.getMonth() + 2, buddhistLentStart.getDate()),
        healthInfo: 'ความจำและสมาธิดีขึ้น น้ำหนักลดลง',
        icon: '🧠'
      });
    }

    baseSteps.push({
      title: campaignData.intentPeriod === 'ตลอดชีวิต' ? 'เป้าหมายตลอดชีวิต' : 'สิ้นสุดเป้าหมาย',
      date: calculateEndDate(),
      healthInfo: 'สุขภาพโดยรวมดีขึ้น ความเสี่ยงโรคตับลดลง',
      icon: '🎉'
    });

    return baseSteps;
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getCurrentStep = (): number => {
    const steps = getSteps();
    for (let i = steps.length - 1; i >= 0; i--) {
      if (currentDate >= steps[i].date) {
        return i;
      }
    }
    return -1;
  };

  const steps = getSteps();
  const currentStep = getCurrentStep();
  const savings = calculateSavings();
  const { total: totalPossibleSavings, monthly: monthlySavings, years: savingYears } = calculateTotalPossibleSavings();
  const progress = (savings / totalPossibleSavings) * 100;

  if (campaignData && !campaignData.monthlyExpense) {
    return (
      <div className="relative py-8 px-4 max-w-4xl mx-auto">
        {showConfetti && <Confetti recycle={false} numberOfPieces={500} />}
        <CongratulationsMessage />
      </div>
    );
  }

  return (
    <div className="timeline-container relative py-8 px-4 max-w-4xl mx-auto">
      {showConfetti && (
        <div className="confetti-container fixed top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none">
          <Confetti recycle={false} numberOfPieces={500} />
          
        </div>
      )}
      <h2 className="text-2xl font-bold text-center mb-6">บันทึกการเดินทาง "งดเหล้าเข้าพรรษา"</h2>
      {campaignData ? (
        <>
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <p className="text-xl font-semibold mb-2 text-center">วันที่ปัจจุบัน: {formatDate(currentDate)}</p>
            <p className="text-2xl font-bold text-green-600 mb-4 text-center">คุณประหยัดได้แล้ว: {savings.toLocaleString()} บาท</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4 dark:bg-gray-700">
              <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
            </div>
            <p className="text-sm text-gray-600 text-center mb-2">
              เป้าหมายการประหยัด ({campaignData.intentPeriod}): {totalPossibleSavings.toLocaleString()} บาท
            </p>
            {campaignData.intentPeriod === 'ตลอดชีวิต' && (
              <p className="text-sm text-gray-600 text-center">
                ปัจจุบันคุณอายุ {calculateAge(campaignData.birthday)} ปี 
                หากคุณมีอายุครบ 80 ปี คุณจะประหยัดได้ {totalPossibleSavings.toLocaleString()} บาท 
                (ประมาณ {monthlySavings.toLocaleString()} บาท/เดือน เป็นเวลา {Math.round(savingYears)} ปี)
              </p>
            )}
          </div>
          <div className="space-y-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                className={`flex items-center space-x-4 ${index <= currentStep ? 'opacity-100' : 'opacity-50'}`}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-2xl ${index <= currentStep ? 'bg-green-500' : 'bg-gray-300'} z-10`}>
                  {step.icon}
                </div>
                <div className="flex-grow">
                  <h3 className="text-lg font-semibold">{step.title}</h3>
                  <p className="text-sm text-gray-600">{formatDate(step.date)}</p>
                  <p className="text-sm text-green-600">{step.healthInfo}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      ) : (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8 text-center">
          <p className="text-2xl font-bold text-green-600 mb-4">กำลังโหลดข้อมูล...</p>
        </div>
      )}
    </div>
  );
};

export default Timeline;