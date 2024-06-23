'use client';

import { useState, FormEvent } from 'react';
import axios from 'axios';

export default function ForgotPassword() {
  const [email, setEmail] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(false); // เพิ่ม state สำหรับจัดการสถานะการโหลด

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true); // เริ่มการโหลด
    try {
      const res = await axios.post('/api/auth/forgot-password', { email });
      setMessage(res.data.message);
      setIsSuccess(true);
    } catch (error) {
      console.error('Error occurred:', error);
      setMessage('An error occurred while sending the email. Please try again later.');
      setIsSuccess(false);
    } finally {
      setLoading(false); // จบการโหลด
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-md shadow-md w-full max-w-sm">
        <h1 className="text-lg font-semibold mb-4 text-center">Forgot Password</h1>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <button type="submit" className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" disabled={loading}>
          {loading ? <span className="loading loading-spinner loading-xs"></span> : 'Submit'}
        </button>
        {message && (
          <div role="alert" className={`alert mt-4 ${isSuccess ? 'alert-success' : 'alert-error'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isSuccess ? "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" : "M6 18L18 6M6 6l12 12"} />
            </svg>
            <span>{message}</span>
          </div>
        )}
      </form>
    </div>
  );
}
