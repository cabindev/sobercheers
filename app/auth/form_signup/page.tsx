'use client'
import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation'; 
import toast, { Toaster } from 'react-hot-toast';
import imageCompression from 'browser-image-compression';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  image: File | null;
}

export default function SignupPage() {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    image: null,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const router = useRouter();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = event.target;
    if (name === 'image' && files) {
      const file = files[0];
      const allowedExtensions = ['.jpg', '.jpeg', '.webp', '.svg', '.png'];
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      
      if (file && allowedExtensions.includes(`.${fileExtension}`)) {
        const options = {
          maxSizeMB: 0.2, // 200 KB
          maxWidthOrHeight: 1024,
          useWebWorker: true,
        };
        imageCompression(file, options)
          .then(compressedFile => {
            const reader = new FileReader();
            reader.onloadend = () => {
              setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(compressedFile);
            setFormData({ ...formData, image: compressedFile });
          })
          .catch(error => {
            console.error('Error compressing image', error);
            toast.error('Error compressing image');
          });
      } else {
        toast.error('Invalid file type');
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append('firstName', formData.firstName);
    formDataToSend.append('lastName', formData.lastName);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('password', formData.password);
    if (formData.image) {
      formDataToSend.append('image', formData.image);
    }

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        body: formDataToSend,
      });
      const data = await response.json();

      if (response.status === 200) {
        toast.success('ลงทะเบียนสำเร็จ...', {
          duration: 4000,
          style: { background: '#4ade80', color: '#ffffff' },
        });
        setTimeout(() => router.push('/auth/signin'), 1000);
      } else {
        toast.error(data.error || 'มีบางอย่างผิดปกติ', {
          style: { background: '#f87171', color: '#ffffff' },
        });
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('มีบางอย่างผิดปกติ', {
        style: { background: '#f87171', color: '#ffffff' },
      });
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <form className="max-w-md mx-auto bg-white p-8 border rounded-lg shadow space-y-4" onSubmit={handleSubmit}>
        <Toaster />
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">ชื่อจริง</label>
          <input
            type="text"
            name="firstName"
            id="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">นามสกุล</label>
          <input
            type="text"
            name="lastName"
            id="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">อีเมล</label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">รหัสผ่าน</label>
          <input
            type="password"
            name="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700">รูปถ่าย</label>
          <input
            type="file"
            name="image"
            id="image"
            accept=".jpg,.jpeg,.webp,.svg,.png"
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
          {imagePreview && (
            <div className="avatar mt-2">
              <div className="w-24 rounded-xl">
                <img src={imagePreview} alt="Image Preview" />
              </div>
            </div>
          )}
        </div>
        <button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          ลงทะเบียน
        </button>
      </form>
    </div>
  );
}
