import { cn } from '@/utils/css/tailwind';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant: 'primary' | 'secondary' | 'danger';
}

const Button = ({ variant, disabled, className, children, ...props }: Props): React.ReactNode => {
    const variantClass = {
        primary: 'bg-blue-400 text-white hover:bg-blue-600',
        danger: 'bg-red-50 text-red-600 hover:bg-red-600 hover:text-white',
        secondary: 'border border-gray-100 text-gray-400 hover:bg-gray-50',
    }[variant];

    return (
        <button
            className={cn(
                'text-sm px-4 py-2 rounded-lg duration-150',
                variantClass,
                disabled && 'opacity-40 cursor-not-allowed pointer-events-none',
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
