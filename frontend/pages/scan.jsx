import { ConnectButton } from '@rainbow-me/rainbowkit';
import Head from 'next/head';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const Scanner = dynamic(() => import('../components/scanner'), {
  ssr: false,
});
import styles from '../styles/Home.module.css';

const Scan = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>NFT Ticketer | Scan Ticket</title>
        <meta name="description" content="Scan ticket" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="w-full flex border-b justify-between py-4 px-10">
        <h1 className="text-3xl font-bold">NFT Ticketer</h1>
        <div className="flex">
          <ConnectButton />
          <Link href="/tickets">
            <a className="px-3 py-2 shadow-md font-bold bg-white text-black rounded-xl mx-5">
              My Tickets
            </a>
          </Link>
        </div>
      </div>

      <main className={styles.main}>
        <Scanner />
      </main>
    </div>
  );
};

export default Scan;
