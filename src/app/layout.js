// app/layout.js
import './globals.css';
import 'animate.css/animate.min.css';
import { Kanit, Pacifico, Noto_Serif_Thai, Playfair_Display } from 'next/font/google';

const kanit = Kanit({
  subsets: ['latin', 'thai'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-kanit',
  display: 'swap',
  fallback: ['system-ui', 'arial', 'sans-serif'],
});

const pacifico = Pacifico({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-pacifico',
  display: 'swap',
  fallback: ['cursive'],
});

const notoSerifThai = Noto_Serif_Thai({
  subsets: ['latin', 'thai'],
  weight: ['400', '700'], // Regular and Bold
  variable: '--font-noto-serif-thai',
  display: 'swap',
  fallback: ['serif'],
});

const playfairDisplay = Playfair_Display({
    subsets: ['latin'],
    weight: ['700'], // Bold for titles
    style: ['normal', 'italic'],
    variable: '--font-playfair-display',
    display: 'swap',
    fallback: ['serif'],
});

export const metadata = {
  title: 'สุขสันต์วันเกิดนะหยก!', // <<<< แก้ไข
  description: 'เว็บอวยพรวันเกิดหยก', // <<<< แก้ไข
};

export default function RootLayout({ children }) {
  return (
    <html lang="th" className={`${kanit.variable} ${pacifico.variable} ${notoSerifThai.variable} ${playfairDisplay.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>{children}</body>
    </html>
  );
}