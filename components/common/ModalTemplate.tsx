import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogOverlay,
    DialogPortal,
    DialogTitle,
} from '@radix-ui/react-dialog';

interface Props {
    isOpen: boolean;
    close: () => void;
    children: React.ReactNode;
    title: string;
    description?: string;
}

const ModalTemplate = ({ children, isOpen, title, description, close }: Props) => {
    return (
        <Dialog open={isOpen}>
            <DialogPortal>
                <DialogOverlay onClick={close} className="fixed inset-0 bg-black/40" />
                <DialogContent className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl p-6 w-full max-w-md z-50 flex flex-col gap-4">
                    <DialogTitle className="text-base font-medium text-gray-900">
                        {title}
                    </DialogTitle>
                    {description && <DialogDescription>{description}</DialogDescription>}
                    {children}
                </DialogContent>
            </DialogPortal>
        </Dialog>
    );
};

export default ModalTemplate;
