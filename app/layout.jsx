import './globals.css';

export const metadata = {
  title: 'Data Playground',
  description: 'A hands-on introduction to data science, built from the EPITA course slides.'
};

export default function Layout({ children }) {
  return <html lang="en"><body>{children}</body></html>;
}
