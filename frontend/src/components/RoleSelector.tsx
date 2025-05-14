'use client';

import React from 'react';

type RoleSelectorProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
};

export default function RoleSelector({ value, onChange }: RoleSelectorProps) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor="role" className="text-sm font-medium text-gray-700">
        Select Role
      </label>
      <select
        id="role"
        name="role"
        value={value}
        onChange={onChange}
        required
        className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
      >
        <option value="">Choose role</option>
        <option value="guest">Guest</option>
        <option value="host">Host</option>
      </select>
    </div>
  );
}
