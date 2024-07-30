'use client'

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Switch } from '@headlessui/react';
import { SearchIcon } from '@heroicons/react/solid';
import axios from 'axios';

enum Role {
  member = 'member',
  admin = 'admin'
}

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
}

export default function AdminPage() {
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await axios.get('/api/users');
      const data = res.data;
      if (data && Array.isArray(data.users)) {
        setAllUsers(data.users);
        applyFiltersAndPagination(data.users);
      } else {
        console.error('Invalid users data:', data);
        setAllUsers([]);
        setFilteredUsers([]);
        setTotalItems(0);
      }
    } catch (error) {
      console.error('Failed to fetch users', error);
      setAllUsers([]);
      setFilteredUsers([]);
      setTotalItems(0);
    }
    setIsLoading(false);
  }, []);

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

  const toggleUserRole = async (userId: number, currentRole: Role) => {
    const newRole = currentRole === Role.admin ? Role.member : Role.admin;
    try {
      await axios.patch('/api/users', { id: userId, role: newRole });
      setAllUsers(prevUsers => prevUsers.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));
      applyFiltersAndPagination(allUsers);
    } catch (error) {
      console.error('Failed to update user role:', error);
    }
  };

  const totalPages = useMemo(() => Math.ceil(totalItems / rowsPerPage), [totalItems, rowsPerPage]);

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">User Management</h1>
      <div className="bg-white shadow-lg rounded-lg p-6">
        <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              placeholder="Search for users..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      No.
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      First Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user, index) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {(page - 1) * rowsPerPage + index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{user.firstName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{user.lastName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Switch
                            checked={user.role === Role.admin}
                            onChange={() => toggleUserRole(user.id, user.role)}
                            className={`${
                              user.role === Role.admin ? 'bg-blue-600' : 'bg-gray-200'
                            } relative inline-flex h-6 w-11 items-center rounded-full mr-3`}
                          >
                            <span className="sr-only">Enable admin</span>
                            <span
                              className={`${
                                user.role === Role.admin ? 'translate-x-6' : 'translate-x-1'
                              } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                            />
                          </Switch>
                          <span className={`text-sm ${user.role === Role.admin ? 'text-blue-600 font-semibold' : 'text-gray-500'}`}>
                            {user.role === Role.admin ? 'Admin' : 'Member'}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-6 flex justify-between items-center">
              <div className="flex items-center">
                <select
                  value={rowsPerPage}
                  onChange={(e) => {
                    setRowsPerPage(parseInt(e.target.value));
                    setPage(1);
                  }}
                  className="mx-2 px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <span className="text-sm text-gray-700">rows per page</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">
                  {filteredUsers.length > 0
                    ? `${(page - 1) * rowsPerPage + 1}-${Math.min(
                        page * rowsPerPage,
                        totalItems
                      )} of ${totalItems}`
                    : "No data"}
                </span>
                <div className="flex space-x-1">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="px-2 py-1 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages || filteredUsers.length === 0}
                    className="px-2 py-1 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
