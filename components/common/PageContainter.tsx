interface Props {
    children: React.ReactNode;
}

const PageContainer = ({ children }: Props) => {
    return <div className="pt-10 h-dvh">{children}</div>;
};

export default PageContainer;
