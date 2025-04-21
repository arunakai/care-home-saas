import React from 'react';
import { useAuth } from '@/lib/auth/auth-context';
import { UserRole } from '@/lib/auth/auth-utils';

export default function Dashboard() {
  const { user } = useAuth();

  // Stats cards based on user role
  const getStatsCards = () => {
    const commonStats = [
      {
        title: 'Active Residents',
        value: '124',
        change: '+4%',
        changeType: 'increase',
        icon: (
          <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"></path>
          </svg>
        ),
      },
      {
        title: 'Fall Incidents (30 days)',
        value: '8',
        change: '-12%',
        changeType: 'decrease',
        icon: (
          <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
          </svg>
        ),
      },
      {
        title: 'Meal Intake Avg',
        value: '87%',
        change: '+2%',
        changeType: 'increase',
        icon: (
          <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path>
            <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path>
          </svg>
        ),
      },
    ];

    // Admin and Super Admin see additional stats
    if (user?.role === UserRole.ADMIN || user?.role === UserRole.SUPER_ADMIN) {
      return [
        ...commonStats,
        {
          title: 'Staff Members',
          value: '42',
          change: '+2',
          changeType: 'increase',
          icon: (
            <svg className="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v1h8v-1zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-1a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v1h-3zM4.75 12.094A5.973 5.973 0 004 15v1H1v-1a3 3 0 013.75-2.906z"></path>
            </svg>
          ),
        },
        {
          title: 'Inspection Score',
          value: '92%',
          change: '+5%',
          changeType: 'increase',
          icon: (
            <svg className="w-8 h-8 text-yellow-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"></path>
            </svg>
          ),
        },
      ];
    }

    return commonStats;
  };

  // Quick access cards based on user role
  const getQuickAccessCards = () => {
    const commonCards = [
      {
        title: 'Resident Fitment',
        description: 'Predict resident-home fitment based on capabilities',
        icon: '🏠',
        href: '/residents/fitment',
        color: 'bg-blue-100 text-blue-800',
      },
      {
        title: 'Falls Predictor',
        description: 'Predict fall risks for residents',
        icon: '⚠️',
        href: '/residents/falls',
        color: 'bg-red-100 text-red-800',
      },
      {
        title: 'Meal Intake',
        description: 'Measure meal intake from photos',
        icon: '🍽️',
        href: '/tools/meal-intake',
        color: 'bg-green-100 text-green-800',
      },
      {
        title: 'Nurse Dictation',
        description: 'Voice-to-text for clinical notes',
        icon: '🎤',
        href: '/tools/dictation',
        color: 'bg-purple-100 text-purple-800',
      },
    ];

    // Admin and Super Admin see additional cards
    if (user?.role === UserRole.ADMIN || user?.role === UserRole.SUPER_ADMIN) {
      return [
        ...commonCards,
        {
          title: 'Infection Predictor',
          description: 'Predict infection outbreaks',
          icon: '🦠',
          href: '/facilities/infection',
          color: 'bg-yellow-100 text-yellow-800',
        },
        {
          title: 'Inspection Heatmap',
          description: 'Visualize inspection findings',
          icon: '🔍',
          href: '/facilities/inspections',
          color: 'bg-indigo-100 text-indigo-800',
        },
      ];
    }

    return commonCards;
  };

  const statsCards = getStatsCards();
  const quickAccessCards = getQuickAccessCards();

  return (
    <div className="px-4 py-6">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">
          Welcome back, {user?.firstName}! Here's what's happening at your facility today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
        {statsCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-4 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">{stat.icon}</div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">{stat.title}</dt>
                  <dd>
                    <div className="text-lg font-semibold text-gray-900">{stat.value}</div>
                  </dd>
                </dl>
              </div>
            </div>
            <div className="mt-4">
              <span
                className={`text-sm font-medium ${
                  stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {stat.change}
              </span>
              <span className="text-sm font-medium text-gray-500"> from last month</span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Access Cards */}
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Access</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {quickAccessCards.map((card, index) => (
          <a
            key={index}
            href={card.href}
            className="block p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-50"
          >
            <div className="flex items-center mb-2">
              <span className="text-2xl mr-2">{card.icon}</span>
              <h5 className="text-lg font-semibold tracking-tight text-gray-900">{card.title}</h5>
            </div>
            <p className="text-sm text-gray-600">{card.description}</p>
            <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-3 ${card.color}`}>
              Access Now
            </div>
          </a>
        ))}
      </div>

      {/* Recent Activity */}
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
      <div className="bg-white shadow rounded-lg p-4 sm:p-6 xl:p-8 mb-8">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Latest Updates</h3>
            <span className="text-sm font-normal text-gray-500">This is a list of recent activities</span>
          </div>
        </div>
        <div className="flex flex-col mt-4">
          <div className="overflow-x-auto">
            <div className="align-middle inline-block min-w-full">
              <div className="shadow overflow-hidden sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Activity
                      </th>
                      <th scope="col" className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th scope="col" className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date & Time
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    <tr>
                      <td className="p-4 whitespace-nowrap text-sm font-normal text-gray-900">
                        New resident assessment completed
                      </td>
                      <td className="p-4 whitespace-nowrap text-sm font-normal text-gray-500">
                        Sarah Johnson
                      </td>
                      <td className="p-4 whitespace-nowrap text-sm font-normal text-gray-500">
                        Apr 21, 2025 09:30 AM
                      </td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="p-4 whitespace-nowrap text-sm font-normal text-gray-900">
                        Fall incident reported
                      </td>
                      <td className="p-4 whitespace-nowrap text-sm font-normal text-gray-500">
                        Michael Brown
                      </td>
                      <td className="p-4 whitespace-nowrap text-sm font-normal text-gray-500">
                        Apr 20, 2025 03:15 PM
                      </td>
                    </tr>
                    <tr>
                      <td className="p-4 whitespace-nowrap text-sm font-normal text-gray-900">
                        Meal intake analysis completed
                      </td>
                      <td className="p-4 whitespace-nowrap text-sm font-normal text-gray-500">
                        Emily Davis
                      </td>
                      <td className="p-4 whitespace-nowrap text-sm font-normal text-gray-500">
                        Apr 20, 2025 12:45 PM
                      </td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="p-4 whitespace-nowrap text-sm font-normal text-gray-900">
                        New resident admitted
                      </td>
                      <td className="p-4 whitespace-nowrap text-sm font-normal text-gray-500">
                        Robert Wilson
                      </td>
                      <td className="p-4 whitespace-nowrap text-sm font-normal text-gray-500">
                        Apr 19, 2025 10:20 AM
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
