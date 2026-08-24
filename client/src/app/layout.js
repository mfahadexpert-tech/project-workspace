import '../styles/globals.css';

export const metadata = {
  title: 'AI Project Workspace — Developer Multi-Agent Environment',
  description: 'Persistent, secure, scalable AI project workspace with Supervisor and 3 Slave agents',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
