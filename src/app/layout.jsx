import '../app/globals.css';
import NavBar from '../components/NavBar';

export const metadata = {
  title: "Food2Table",
  description: "Fresh food marketplace",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-emerald-50">
        {/*<NavBar />*/}
        {children}
        </body>
    </html>
  );
}
