'use client';

import React from 'react';

interface StatusBadgeProps {
  status: 'pending' | 'approved' | 'purchased' | 'shipped' | 'delivered' | 'cancelled';
  size?: 'sm' | 'md' | 'lg';
}

const statusConfig = {
  pending: {
    label: 'Pending',
    className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  },
  approved: {
    label: 'Approved',
    className: 'bg-blue-100 text-blue-800 border-blue-200',
  },
  purchased: {
    label: 'Purchased',
    className: 'bg-purple-100 text-purple-800 border-purple-200',
  },
  shipped: {
    label: 'Shipped',
    className: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  },
  delivered: {
    label: 'Delivered',
    className: 'bg-green-100 text-green-800 border-green-200',
  },
  cancelled: {
    label: 'Cancelled',
    className: 'bg-red-100 text-red-800 border-red-200',
  },
};

const sizeConfig = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-3 py-1.5 text-sm',
  lg: 'px-4 py-2 text-base',
};

export default function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const config = statusConfig[status];
  const sizeClass = sizeConfig[size];

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border ${config.className} ${sizeClass}`}
    >
      {config.label}
    </span>
  );
}
