import { forwardRef } from 'react';
import type { UseLongPressHandlers } from '@/hook/use-long-press';
import type { ReactNode } from 'react';

interface PriceCardProps extends Omit<UseLongPressHandlers, 'isClicking'> {
  price: number;
  title: ReactNode;
  color: string;
  className?: string;
  style?: React.CSSProperties;
}

export const PriceCard = forwardRef<HTMLDivElement, PriceCardProps>(
  ({ price, title, color, className, ...longPressEvent }, ref) => {
    return (
      <div
        {...longPressEvent}
        ref={ref}
        className={`rounded-4xl px-20 py-8 shadow-inner shadow-black/30 z-1 bg-[#${color}] ${className} flex justify-center items-center`}
      >
        <div className={`grid grid-cols-[auto_1fr] gap-4 items-center-safe`}>
          <img
            src={`${import.meta.env.BASE_URL}rocket.png`}
            alt="Rocket Icon"
            className="row-span-3 aspect-square h-35 animate-infinite animate-duration-200 animate-ease-in-out animate-out invert-100"
          />
          <div className="text-4xl font-semibold text-yellow-400">{title}</div>
          <div className="text-6xl font-bold text-yellow-300">Rs. {price}</div>
          <div className="text-4xl font-semibold text-yellow-400">Gift Voucher</div>
        </div>
      </div>
    );
  },
);

PriceCard.displayName = 'PriceCard';
