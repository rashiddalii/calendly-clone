export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ backgroundColor: "#ffffff", minHeight: "100vh" }}>
      {children}
    </div>
  );
}
