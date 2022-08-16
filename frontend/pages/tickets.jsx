import { ConnectButton } from '@rainbow-me/rainbowkit';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { toast } from 'react-toastify';

import styles from '../styles/Home.module.css';
import { fetchTickets } from '../utils';

const Tickets = () => {
  const { address } = useAccount();
  const [data, setData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetchTickets(address);
        console.log(res);
        setData(res);
      } catch (error) {
        toast.error('Some error occured');
        console.log(error);
      }
    };
    fetchData();
  }, [address]);

  const Ticket = ({ details }) => (
    <div className="my-4 shadow-xl bg-white p-4 rounded-xl">
      <h2 className="text-2xl text-center font-semibold">{details.title}</h2>
      <p className="my-4 text-xl text-center">{details.description}</p>
      <button
        className="w-full text-xl bg-purple-500 text-white p-3 rounded-xl text-center"
        onClick={() =>
          router.push(
            `/ticket?title=${details.title}&description=${details.description}&ticketId=${details.ticketId}&date=${details.date}`
          )
        }
      >
        View Ticket
      </button>
    </div>
  );

  return (
    <div className={styles.container}>
      <Head>
        <title>NFT Ticketer | View Tickets</title>
        <meta name="description" content="View your tickets" />
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
          <div className="w-1/3 ">
            <div className="shadow-xl bg-white p-4 rounded-xl">
              <h2 className="text-2xl text-center font-semibold">
                Your Tickets
              </h2>
            </div>
            {data && (
              <div className="mt-4">
                {data.map((details) => (
                  <Ticket details={details} />
                ))}
                <Ticket
                  details={{
                    title: 'Title',
                    description: 'description',
                    ticketId: 1,
                    date: '2022-08-25',
                  }}
                />
              </div>
            )}
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

export default Tickets;
