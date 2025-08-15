const LandingLayout = ({
  children
}: {
  children: React.ReactNode;
}) => {
  return (
    <main className="dark:bg-black/95">
      <div>
        {children}
      </div>
    </main>
  );
}

export default LandingLayout;