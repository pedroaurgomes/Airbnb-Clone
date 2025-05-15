'use client';

import React from 'react';

type ButtonProps = {
  label: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
};

export default function Button({ label, onClick, type = 'button' }: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="bg-rose-500 hover:bg-rose-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300"
    >
      {label}
    </button>
  );
}
