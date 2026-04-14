import "../app/globals.css";
import LayoutWrapper from "../components/LayoutWrapper";

export const metadata = {
  title: "Food2Table",
  description: "Fresh food marketplace",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-emerald-50">
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}