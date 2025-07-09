import type { ChangeEvent, FC } from 'react';
import s from './input.module.scss';

interface TextInputProps {
    label?: string;
    type?: string;
    placeholder?: string;
    className?: string;
    error?: string;
    value?: string;
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const TextInput: FC<TextInputProps> = ({ label, error, className, ...props }) => {
    return (
        <div className={`${s.wrapper} ${className}`}>
            {label && <span className={s.label}>{label}</span>}
            <input
                className={`${s.input} ${error ? s.error : ''}`}
                {...props}
            />
            {error && <span className={s.error}>{error}</span>}
        </div>
    );
};

