'use client'

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Switch } from '@headlessui/react';
import { SearchIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/solid';
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

  const sortUsersByRole = (users: User[]): User[] => {
    return users.sort((a, b) => {
      if (a.role === Role.admin && b.role !== Role.admin) {
        return -1;
      }
      if (a.role !== Role.admin && b.role === Role.admin) {
        return 1;
      }
      return 0;
    });
  };

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await axios.get('/api/users');
      const data = res.data;
      if (data && Array.isArray(data.users)) {
        const sortedUsers = sortUsersByRole(data.users);
        setAllUsers(sortedUsers);
        applyFiltersAndPagination(sortedUsers);
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
    const sortedAndFiltered = sortUsersByRole(filtered);
    setFilteredUsers(sortedAndFiltered.slice((page - 1) * rowsPerPage, page * rowsPerPage));
  }, [search, page, rowsPerPage]);

  useEffect(() => {
    applyFiltersAndPagination(allUsers);
  }, [applyFiltersAndPagination, allUsers]);

  const toggleUserRole = async (userId: number, currentRole: Role) => {
    const newRole = currentRole === Role.admin ? Role.member : Role.admin;
    try {
      await axios.patch('/api/users', { id: userId, role: newRole });
      setAllUsers(prevUsers => {
        const updatedUsers = prevUsers.map(user => 
          user.id === userId ? { ...user, role: newRole } : user
        );
        return sortUsersByRole(updatedUsers);
      });
      applyFiltersAndPagination(allUsers);
    } catch (error) {
      console.error('Failed to update user role:', error);
    }
  };

  const totalPages = useMemo(() => Math.ceil(totalItems / rowsPerPage), [totalItems, rowsPerPage]);

  return (
    <div className="min-h-screen bg-green-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-green-800 mb-6">User Management</h1>
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6">
              <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                <div className="w-full sm:w-1/2 mb-4 sm:mb-0">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={search}
                      onChange={(e) => {
                        setSearch(e.target.value);
                        setPage(1);
                      }}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <SearchIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                  </div>
                </div>
                <div className="w-full sm:w-auto">
                  <select
                    value={rowsPerPage}
                    onChange={(e) => {
                      setRowsPerPage(parseInt(e.target.value));
                      setPage(1);
                    }}
                    className="block w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  >
                    <option value={10}>10 rows</option>
                    <option value={25}>25 rows</option>
                    <option value={50}>50 rows</option>
                    <option value={100}>100 rows</option>
                  </select>
                </div>
              </div>
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-green-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">
                            No.
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">
                            Name
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">
                            Email
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">
                            Role
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredUsers.map((user, index) => (
                          <tr key={user.id} className="hover:bg-green-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {(page - 1) * rowsPerPage + index + 1}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10">
                                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                                    <span className="text-green-800 font-medium">
                                      {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                                    </span>
                                  </div>
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{user.firstName} {user.lastName}</div>
                                </div>
                              </div>
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
                                    user.role === Role.admin ? 'bg-green-600' : 'bg-gray-200'
                                  } relative inline-flex h-6 w-11 items-center rounded-full mr-3 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
                                >
                                  <span className="sr-only">Enable admin</span>
                                  <span
                                    className={`${
                                      user.role === Role.admin ? 'translate-x-6' : 'translate-x-1'
                                    } inline-block h-4 w-4 transform rounded-full bg-white transition ease-in-out duration-200`}
                                  />
                                </Switch>
                                <span className={`text-sm ${user.role === Role.admin ? 'text-green-600 font-semibold' : 'text-gray-500'}`}>
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
                    <div className="text-sm text-gray-700">
                      Showing <span className="font-medium">{(page - 1) * rowsPerPage + 1}</span> to{' '}
                      <span className="font-medium">{Math.min(page * rowsPerPage, totalItems)}</span> of{' '}
                      <span className="font-medium">{totalItems}</span> results
                    </div>
                    <div className="flex-1 flex justify-end">
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        <button
                          onClick={() => setPage(Math.max(1, page - 1))}
                          disabled={page === 1}
                          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-green-50 disabled:opacity-50"
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
                                  ? 'z-10 bg-green-50 border-green-500 text-green-600'
                                  : 'bg-white border-gray-300 text-gray-500 hover:bg-green-50'
                              }`}
                            >
                              {pageNumber}
                            </button>
                          ) : null;
                        })}
                        <button
                          onClick={() => setPage(Math.min(totalPages, page + 1))}
                          disabled={page === totalPages || filteredUsers.length === 0}
                          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-green-50 disabled:opacity-50"
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