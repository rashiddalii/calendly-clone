export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ backgroundColor: "#fcf8fe", minHeight: "100vh" }}>
      {children}
    </div>
  );
}
