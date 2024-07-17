'use client';
import React from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Menu, Dropdown, Button, Avatar, Skeleton } from 'antd';
import { HomeOutlined, UserOutlined, LogoutOutlined, MenuOutlined, BarChartOutlined } from '@ant-design/icons';

export default function Navbar() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const isAdmin = session?.user?.role === 'admin';

  const userMenu = {
    items: [
      {
        key: 'home',
        label: <Link href="/" className="text-sm text-gray-700">Home</Link>,
        icon: <HomeOutlined />,
      },
      {
        key: 'profile',
        label: <Link href="/profile" className="text-sm text-gray-700">Profile</Link>,
        icon: <UserOutlined />,
      },
      {
        key: 'signout',
        label: <span className="text-sm text-gray-700">Sign out</span>,
        icon: <LogoutOutlined />,
        onClick: () => signOut({ callbackUrl: "/" }),
      },
    ],
  };

  const dashboardMenu = {
    items: [
      // {
      //   key: 'overview',
      //   label: <Link href="/dashboard/" className="text-sm text-gray-700">ภาพรวม</Link>,
      //   icon: <HomeOutlined />,
      // },
      {
        key: 'soberCheers',
        label: <Link href="/dashboard/soberCheers" className="text-sm text-gray-700">SoberCheers</Link>,
        icon: <BarChartOutlined />,
      },
      {
        key: 'soberTable',
        label: <Link href="/dashboard/soberCheers/components/soberTable" className="text-sm text-gray-700">ข้อมูลงดเหล้าเข้าพรรษา 2567</Link>,
        icon: <BarChartOutlined />,
      },
      {
        key: 'addSobersUser',
        label: <Link href="/soberCheers" className="text-sm text-gray-700">เพิ่มข้อมูล SoberCheers</Link>,
        icon: <BarChartOutlined />,
      },
    ],
  };

  const mobileMenu = {
    items: [
      {
        key: 'home',
        label: <Link href="https://sdnthailand.com/">Home</Link>,
        icon: <HomeOutlined />,
      },
      ...(isAdmin ? [
        {
          key: 'dashboard',
          label: 'Dashboard',
          icon: <HomeOutlined />,
          children: [
            // {
            //   key: 'overview',
            //   label: <Link href="/dashboard/">ภาพรวม</Link>,
            // },
            {
              key: 'soberCheers',
              label: <Link href="/dashboard/soberCheers">SoberCheers</Link>,
            },
            {
              key: 'soberTable',
              label: <Link href="/dashboard/soberCheers/components/soberTable">ข้อมูลงดเหล้าเข้าพรรษา 2567</Link>,
            },
            {
              key: 'addSobersUser',
              label: <Link href="/soberCheers">เพิ่มข้อมูล SoberCheers</Link>,
            },
          ],
        },
        // {
        //   key: 'sobercheers',
        //   label: <Link href="/sobercheers">SoberCheers</Link>,
        // },
      ] : []),
      ...(session && session.user ? [
        {
          key: 'profile',
          label: <Link href="/profile">Profile</Link>,
          icon: <UserOutlined />,
        },
        {
          key: 'signout',
          label: 'Sign out',
          icon: <LogoutOutlined />,
          onClick: () => signOut({ callbackUrl: "/" }),
        },
      ] : [
        {
          key: 'login',
          label: 'Login',
          onClick: () => router.push("/auth/signin"),
        },
      ]),
    ],
  };

  return (
    <nav className="relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <img className="h-12 w-12" src="/x-left.png" alt="Logo" />
            <span className="mx-2 text-lg font-bold text-center bg-gradient-to-r from-amber-500 to-amber-700 text-transparent bg-clip-text">
              SOBER CHEERs
            </span>
            <Link
              href="https://sdnthailand.com/"
              className="ml-4 text-gray-700 hover:text-amber-500 transition-colors"
            >
              Home
            </Link>
          </div>
          <div className="hidden sm:flex sm:items-center sm:space-x-8">
            {status === "loading" ? (
              <Skeleton.Button active size="default" shape="round" />
            ) : (
              isAdmin && (
                <>
                  <Dropdown menu={dashboardMenu} placement="bottomLeft">
                    <Button type="text" className="text-gray-700 hover:text-amber-500 transition-colors">
                      <HomeOutlined /> Dashboard
                    </Button>
                  </Dropdown>
                  {/* <Link href="/dashboard/soberCheers" className="text-gray-700 hover:text-amber-500 transition-colors">
                    SoberCheers
                  </Link> */}
                </>
              )
            )}
            {status === "loading" ? (
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
            ) : session && session.user ? (
              <Dropdown
                menu={userMenu}
                placement="bottomRight"
                trigger={["click"]}
              >
                 <img
                  src={
                    session.user.image ||
                    "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
                  }
                  alt="User profile"
                  className="w-8 h-8 rounded-full cursor-pointer object-cover"
                />
              </Dropdown>
            ) : (
              <Button
                type="primary"
                onClick={() => router.push("/auth/signin")}
                className="bg-amber-500 hover:bg-amber-600 text-white border-none"
              >
                Login
              </Button>
            )}
          </div>
          <div className="sm:hidden flex items-center">
            {status === "loading" ? (
              <Skeleton.Button active size="small" shape="circle" />
            ) : (
              <Dropdown
                menu={mobileMenu}
                placement="bottomRight"
                trigger={["click"]}
              >
                <Button type="text" icon={<MenuOutlined />} />
              </Dropdown>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
