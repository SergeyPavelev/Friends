import s from './button.module.scss';
import type { ReactNode } from 'react';

interface ButtonProps {
    children?: ReactNode;
    className?: string;
    disabled?: boolean;
    onClick?: () => void;
}

export const ButtonUi = (
    {
        className,
        disabled,
        children,
        ...props
    }: ButtonProps,
) => {
    return (
        <button
            className={`${s.button} 
            ${className}`}
            disabled={disabled}
            {...props}
        >
            {children}
        </button>
    );
};

