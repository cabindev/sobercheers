'use client'

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { SearchIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/solid';
import axios from 'axios';
import { Skeleton, message } from 'antd';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  image: string | null;
}

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    if (status === 'loading') return;
    if (!session || session.user?.role !== 'admin') {
      message.error('You do not have permission to view this page');
      router.push('/');
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.get('/api/users');
      const data = res.data;
      if (data && Array.isArray(data.users)) {
        const adminUsers = data.users.filter((user: User) => user.role === 'admin');
        setAllUsers(adminUsers);
      
        applyFiltersAndPagination(adminUsers);
      } else {
        console.error('Invalid users data:', data);
        setAllUsers([]);
        setFilteredUsers([]);
        setTotalItems(0);
      }
    } catch (error) {
      console.error('Failed to fetch users', error);
      message.error('Failed to fetch users');
      setAllUsers([]);
      setFilteredUsers([]);
      setTotalItems(0);
    }
    setIsLoading(false);
  }, [session, status, router]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const applyFiltersAndPagination = useCallback((users: User[]) => {
    const filtered = users.filter(user => 
      search === '' || 
      user.firstName.toLowerCase().includes(search.toLowerCase()) ||
      user.lastName.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
    );
    setTotalItems(filtered.length);
    setFilteredUsers(filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage));
  }, [search, page, rowsPerPage]);

  useEffect(() => {
    applyFiltersAndPagination(allUsers);
  }, [applyFiltersAndPagination, allUsers]);

  const totalPages = useMemo(() => Math.ceil(totalItems / rowsPerPage), [totalItems, rowsPerPage]);

  if (status === 'loading') {
    return <div className="flex justify-center items-center h-screen">
      <Skeleton active avatar paragraph={{ rows: 4 }} />
    </div>;
  }

  if (!session || session.user?.role !== 'admin') {
    return null; // or redirect to home page
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Admin Management</h1>
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6">
              <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                <div className="w-full sm:w-1/2 mb-4 sm:mb-0">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search admins..."
                      value={search}
                      onChange={(e) => {
                        setSearch(e.target.value);
                        setPage(1);
                      }}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <SearchIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                  </div>
                </div>
              </div>
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-500"></div>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredUsers.map((user) => (
                      <div key={user.id} className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
                        <div className="p-4">
                          <div className="flex items-center justify-center mb-4">
                            {user.image ? (
                              <img
                                src={user.image}
                                alt={`${user.firstName} ${user.lastName}`}
                                className="h-20 w-20 rounded-full object-cover"
                              />
                            ) : (
                              <div className="h-20 w-20 rounded-full bg-amber-100 flex items-center justify-center">
                                <span className="text-amber-800 text-2xl font-medium">
                                  {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="text-center">
                            <h3 className="text-lg font-medium text-gray-900">{user.firstName} {user.lastName}</h3>
                            <p className="text-sm text-gray-500 mt-1">{user.email}</p>
                            <div className="mt-3">
                              <span className="px-2 py-1 text-xs font-semibold text-amber-600 bg-amber-100 rounded-full">
                                Admin
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 flex justify-between items-center">
                    <div className="text-sm text-gray-700">
                      Showing <span className="font-medium">{(page - 1) * rowsPerPage + 1}</span> to{' '}
                      <span className="font-medium">{Math.min(page * rowsPerPage, totalItems)}</span> of{' '}
                      <span className="font-medium">{totalItems}</span> admins
                    </div>
                    <div className="flex-1 flex justify-end">
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        <button
                          onClick={() => setPage(Math.max(1, page - 1))}
                          disabled={page === 1}
                          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                        >
                          <span className="sr-only">Previous</span>
                          <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                        </button>
                        {[...Array(Math.min(5, totalPages))].map((_, i) => {
                          const pageNumber = page - 2 + i;
                          return pageNumber > 0 && pageNumber <= totalPages ? (
                            <button
                              key={pageNumber}
                              onClick={() => setPage(pageNumber)}
                              className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                pageNumber === page
                                  ? 'z-10 bg-amber-50 border-amber-500 text-amber-600'
                                  : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                              }`}
                            >
                              {pageNumber}
                            </button>
                          ) : null;
                        })}
                        <button
                          onClick={() => setPage(Math.min(totalPages, page + 1))}
                          disabled={page === totalPages || filteredUsers.length === 0}
                          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                        >
                          <span className="sr-only">Next</span>
                          <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                        </button>
                      </nav>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}