import { ConnectButton } from '@rainbow-me/rainbowkit';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAccount } from 'wagmi';
import QRCode from 'react-qr-code';

import styles from '../styles/Home.module.css';

const Ticket = () => {
  const { address } = useAccount();
  const router = useRouter();
  const { title, description, date, ticketId } = router.query;

  return (
    <div className={styles.container}>
      <Head>
        <title>NFT Ticketer | View Ticket</title>
        <meta name="description" content="View ticket" />
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
        {address ? (
          <div className="w-1/2">
            <div className="mt-4">
              <div className="my-4 shadow-xl bg-white p-4 rounded-xl">
                <img
                  className="ticketImage"
                  src="/view.jpeg"
                  width="100%"
                  height="auto"
                />
                <h2 className="text-2xl text-center font-semibold">{title}</h2>
                <p className="my-4 text-xl text-center">{description}</p>
                <p className="my-4 text-xl text-center">{date}</p>
                <p className="my-4 text-xl text-center">
                  Ticket Id: {ticketId}
                </p>
                <p className="my-4 text-xl text-center truncate">
                  Owner: {address}
                </p>
                <div className="my-4 flex justify-center items-center">
                  <QRCode
                    size={300}
                    value={JSON.stringify({ owner: address, ticketId })}
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <h3 className="text-2xl font-semibold bg-purple-500 rounded-xl p-3 text-white">
            Connect wallet to view tickets
          </h3>
        )}
      </main>
    </div>
  );
};

export default Ticket;
