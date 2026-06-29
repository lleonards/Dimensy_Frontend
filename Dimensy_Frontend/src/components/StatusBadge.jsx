import React from 'react';

const STATUS_MAP = {
  novo:        { label: 'Novo',        className: 'bg-blue-50 text-blue-700 ring-blue-600/20' },
  em_contato:  { label: 'Em contato', className: 'bg-yellow-50 text-yellow-700 ring-yellow-600/20' },
  fechado:     { label: 'Fechado',     className: 'bg-green-50 text-green-700 ring-green-600/20' },
  cancelado:   { label: 'Cancelado',   className: 'bg-red-50 text-red-700 ring-red-600/20' },
};

export default function StatusBadge({ status }) {
  const { label, className } = STATUS_MAP[status] || { label: status, className: 'bg-gray-50 text-gray-700' };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${className}`}>
      {label}
    </span>
  );
}
