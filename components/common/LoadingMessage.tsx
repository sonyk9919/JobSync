import { Loader2 } from 'lucide-react';

interface Props {
    children: React.ReactNode;
}

const LoadingMessage = ({ children }: Props) => {
    return (
        <div className="w-full flex items-center gap-2 text-gray-400 text-sm py-6 justify-center">
            <Loader2 className="size-4 animate-spin" />
            {children}
        </div>
    );
};

export default LoadingMessage;
