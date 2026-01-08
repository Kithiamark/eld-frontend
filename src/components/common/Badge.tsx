/**
 * Badge Component
 * Display status indicators and labels
 */

import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'default';
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  className = '',
}) => {
  const variantClasses = {
    success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    danger: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    info: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    default: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  };

  const dotColors = {
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    danger: 'bg-red-500',
    info: 'bg-blue-500',
    default: 'bg-gray-500',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {dot && <span className={`w-2 h-2 rounded-full ${dotColors[variant]}`} />}
      {children}
    </span>
  );
};

export default Badge;

// Driver Status Badge
export const DriverStatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const variants: Record<string, 'success' | 'warning' | 'danger'> = {
    active: 'success',
    inactive: 'warning',
    suspended: 'danger',
  };

  return (
    <Badge variant={variants[status] || 'default'} dot>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

// Vehicle Status Badge
export const VehicleStatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const variants: Record<string, 'success' | 'warning' | 'danger' | 'info'> = {
    active: 'success',
    maintenance: 'warning',
    inactive: 'default',
    out_of_service: 'danger',
  };

  const labels: Record<string, string> = {
    active: 'Active',
    maintenance: 'Maintenance',
    inactive: 'Inactive',
    out_of_service: 'Out of Service',
  };

  return (
    <Badge variant={variants[status] || 'default'} dot>
      {labels[status] || status}
    </Badge>
  );
};

// Compliance Badge
export const ComplianceBadge: React.FC<{ isCompliant: boolean }> = ({ isCompliant }) => (
  <Badge variant={isCompliant ? 'success' : 'danger'} dot>
    {isCompliant ? 'Compliant' : 'Non-Compliant'}
  </Badge>
);