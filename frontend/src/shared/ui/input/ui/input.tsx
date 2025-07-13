import type { ChangeEvent, FC } from 'react';
import s from './input.module.scss';

interface InputProps {
    label?: string;
    type?: string;
    placeholder?: string;
    className?: string;
    error?: string;
    value?: string;
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const InputUi: FC<InputProps> = (
    {
        label,
        error,
        className,
        value,
        placeholder,
        type = 'text',
        ...props
    },
) => {
    return (
        <div className={`${s.wrapper} ${className}`}>
            {label &&
                <span className={s.label}>{label}</span>
            }
            <input
                className={`${s.input} ${error ? s.error : ''}`}
                value={value}
                placeholder={placeholder}
                type={type}
                {...props}
            />
            {error &&
                <span className={s.error}>{error}</span>
            }
        </div>
    );
};

