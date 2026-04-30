import { cn } from '@/utils/css/tailwind';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    active?: boolean;
}

const IconButton = ({ active, className, children, ...props }: Props): React.ReactNode => {
    return (
        <button
            className={cn(
                'p-1.5 rounded-md text-gray-400 hover:bg-gray-50',
                active && 'bg-blue-50 text-blue-400',
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
};

export default IconButton;
