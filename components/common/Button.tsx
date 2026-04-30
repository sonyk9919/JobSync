interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant: 'primary' | 'secondary';
}

const Button = ({ variant, className, children, ...props }: Props): React.ReactNode => {
    const variantClass = {
        primary: 'bg-blue-400 text-white hover:bg-blue-600',
        secondary: 'border border-gray-100 text-gray-400 hover:bg-gray-50',
    }[variant];

    return (
        <button
            className={`text-sm px-4 py-2 rounded-lg duration-150 ${variantClass} ${className ?? ''}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
