'use client';

import { useEffect, useState } from 'react';
import { getCookie } from 'cookies-next';

type User = {
  id: string;
  email: string;
  name: string;
};

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const userCookie = getCookie('user');
    if (userCookie) {
      try {
        setUser(JSON.parse(userCookie as string));
      } catch (error) {
        console.error('Error parsing user cookie:', error);
      }
    }
  }, []);

  if (!user) {
    return null; // The middleware will handle the redirect
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Welcome, {user.name}!</h1>
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-medium text-gray-900">Your Information</h2>
              <dl className="mt-2 space-y-2">
                <div className="flex">
                  <dt className="text-sm font-medium text-gray-500 w-24">Email:</dt>
                  <dd className="text-sm text-gray-900">{user.email}</dd>
                </div>
                <div className="flex">
                  <dt className="text-sm font-medium text-gray-500 w-24">User ID:</dt>
                  <dd className="text-sm text-gray-900">{user.id}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
