interface Props {
    children: React.ReactNode;
}

const PageContainer = ({ children }: Props) => {
    return <div className="pt-6 h-[calc(100dvh-3rem)]">{children}</div>;
};

export default PageContainer;
