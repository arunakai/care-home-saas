import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/auth-context';
import { UserRole } from '@/lib/auth/auth-utils';

interface SidebarProps {
  isOpen: boolean;
}

export default function Sidebar({ isOpen }: SidebarProps) {
  const { user } = useAuth();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const toggleDropdown = (dropdown: string) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  // Define menu items based on user role
  const getMenuItems = () => {
    const items = [
      {
        title: 'Dashboard',
        icon: (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path>
            <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path>
          </svg>
        ),
        href: '/dashboard',
        roles: [UserRole.STAFF, UserRole.ADMIN, UserRole.SUPER_ADMIN],
      },
      {
        title: 'Resident Management',
        icon: (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
          </svg>
        ),
        dropdown: 'residents',
        roles: [UserRole.STAFF, UserRole.ADMIN, UserRole.SUPER_ADMIN],
        children: [
          { title: 'All Residents', href: '/residents' },
          { title: 'Fitment Predictor', href: '/residents/fitment' },
          { title: 'Falls Predictor', href: '/residents/falls' },
        ],
      },
      {
        title: 'Facility Management',
        icon: (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4zm3 1h6v4H7V5zm8 8v2h1v1H4v-1h1v-2H4v-1h16v1h-1z" clipRule="evenodd"></path>
          </svg>
        ),
        dropdown: 'facilities',
        roles: [UserRole.ADMIN, UserRole.SUPER_ADMIN],
        children: [
          { title: 'All Facilities', href: '/facilities' },
          { title: 'Infection Predictor', href: '/facilities/infection' },
          { title: 'Inspection Heatmap', href: '/facilities/inspections' },
        ],
      },
      {
        title: 'Operational Tools',
        icon: (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"></path>
          </svg>
        ),
        dropdown: 'tools',
        roles: [UserRole.STAFF, UserRole.ADMIN, UserRole.SUPER_ADMIN],
        children: [
          { title: 'Laundry Tracking', href: '/tools/laundry' },
          { title: 'Meal Intake Measurer', href: '/tools/meal-intake' },
          { title: 'Nurse Dictation', href: '/tools/dictation' },
          { title: 'PDF Summarizer', href: '/tools/pdf-summary' },
        ],
      },
      {
        title: 'AI Support',
        icon: (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"></path>
          </svg>
        ),
        dropdown: 'ai',
        roles: [UserRole.STAFF, UserRole.ADMIN, UserRole.SUPER_ADMIN],
        children: [
          { title: 'Ethical Dilemmas', href: '/ai/ethical-dilemmas' },
          { title: 'Policy Interpreter', href: '/ai/policy-interpreter' },
          { title: 'Critical Incident Support', href: '/ai/critical-incidents' },
          { title: 'On-Call Manager Support', href: '/ai/on-call-support' },
        ],
      },
      {
        title: 'User Management',
        icon: (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"></path>
          </svg>
        ),
        href: '/users',
        roles: [UserRole.ADMIN, UserRole.SUPER_ADMIN],
      },
      {
        title: 'Settings',
        icon: (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"></path>
          </svg>
        ),
        href: '/settings',
        roles: [UserRole.STAFF, UserRole.ADMIN, UserRole.SUPER_ADMIN],
      },
    ];

    // Filter items based on user role
    if (!user) return [];
    return items.filter(item => item.roles.includes(user.role as UserRole));
  };

  const menuItems = getMenuItems();

  return (
    <aside
      id="sidebar"
      className={`fixed top-0 left-0 z-20 h-full pt-16 flex lg:flex flex-shrink-0 flex-col w-64 transition-width duration-75 ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}
      aria-label="Sidebar"
    >
      <div className="relative flex-1 flex flex-col min-h-0 border-r border-gray-200 bg-white pt-0">
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <div className="flex-1 px-3 bg-white divide-y space-y-1">
            <ul className="space-y-2 pb-2">
              {menuItems.map((item, index) => (
                <li key={index}>
                  {item.dropdown ? (
                    <div>
                      <button
                        type="button"
                        className={`text-base text-gray-900 font-normal rounded-lg flex items-center p-2 hover:bg-gray-100 group w-full ${
                          activeDropdown === item.dropdown ? 'bg-gray-100' : ''
                        }`}
                        onClick={() => toggleDropdown(item.dropdown)}
                      >
                        {item.icon}
                        <span className="ml-3 flex-1 whitespace-nowrap">{item.title}</span>
                        <svg
                          className={`w-6 h-6 ${activeDropdown === item.dropdown ? 'transform rotate-180' : ''}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                      </button>
                      {activeDropdown === item.dropdown && (
                        <ul className="py-2 space-y-2">
                          {item.children?.map((child, childIndex) => (
                            <li key={childIndex}>
                              <Link
                                href={child.href}
                                className="text-base text-gray-900 font-normal rounded-lg flex items-center p-2 pl-11 w-full hover:bg-gray-100"
                              >
                                {child.title}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={item.href || '#'}
                      className="text-base text-gray-900 font-normal rounded-lg flex items-center p-2 hover:bg-gray-100 group"
                    >
                      {item.icon}
                      <span className="ml-3 flex-1 whitespace-nowrap">{item.title}</span>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </aside>
  );
}
