import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { AuthProvider } from '@/contexts/AuthContext';
import Head from 'next/head';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Head>
        <title>PlacementIQ – Evidence-Based Placement Readiness Platform</title>
        <meta name="description" content="P06 – Evidence-Based Placement Readiness and Skill-Gap Platform. Track skill gaps, compute readiness, and manage placement drives." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </Head>
      <Component {...pageProps} />
    </AuthProvider>
  );
}
