import { ButtonHTMLAttributes } from "react";

const RoundButton = ({ className, ...otherProps }: ButtonHTMLAttributes<HTMLButtonElement>) => {
    return (
        <button className={`rounded-full border-transparent text-center p-2.5 cursor-pointer ${className}`}
            {...otherProps}
        />
    )
}

export default RoundButton;