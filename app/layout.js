import './globals.css';
import { site } from '@/data/site';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import MobileBottomBar from '@/components/MobileBottomBar';
import ContactModal from '@/components/ContactModal';
import ScrollProgress from '@/components/ScrollProgress';

export const metadata = {
  title: `${site.name} | High-End Carpentry & Renovations`,
  description: `Premium ${site.trade} and renovation services across the Gold Coast.`,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        {/* <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" /> */}
      </head>
      <body>
        <ScrollProgress />
        <Nav />
        <main>{children}</main>
        <Footer />
        <ContactModal />
        <MobileBottomBar />
      </body>
    </html>
  );
}
