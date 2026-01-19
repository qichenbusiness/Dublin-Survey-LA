import React from 'react'

interface PriceButtonProps {
  range: string
  onClick: () => void
  disabled?: boolean
}

export default function PriceButton({ range, onClick, disabled }: PriceButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full min-h-[48px] px-6 py-4
        bg-navy text-white
        text-xl font-semibold
        rounded-lg
        transition-all duration-200
        hover:bg-blue-900
        active:bg-blue-950
        disabled:opacity-50 disabled:cursor-not-allowed
        focus:outline-none focus:ring-4 focus:ring-blue-300
        shadow-md hover:shadow-lg
      `}
    >
      {range}
    </button>
  )
}