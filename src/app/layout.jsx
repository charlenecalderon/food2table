
export const metadata = {
  title: "Food2Table",
  description: "Fresh food marketplace",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
