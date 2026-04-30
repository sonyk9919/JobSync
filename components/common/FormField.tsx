import { cn } from "@/utils/css/tailwind";

interface Props {
    label: string;
    children: React.ReactNode;
}

const FormField = ({ label, children }: Props) => {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-400">{label}</label>
            {children}
        </div>
    );
};

const inputClass = "bg-gray-100 text-sm border border-gray-100 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-400 text-gray-900";

const Input = ({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) => {
    return <input className={cn(inputClass, className)} {...props} />
}

const Textarea = ({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => {
    return <textarea className={cn(inputClass, 'resize-none', className)} {...props} />
}

FormField.Input = Input;
FormField.Textarea = Textarea;

export default FormField;