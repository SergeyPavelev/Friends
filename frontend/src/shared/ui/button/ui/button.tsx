import s from './button.module.scss'
import type { ButtonHTMLAttributes } from 'react';

export const ButtonUi = ({className, ...props}: ButtonHTMLAttributes<HTMLButtonElement> ) => {
    return (
        <button className={`${s.button} ${className}`} {...props}>
            {props.children}
        </button>
    );
};

