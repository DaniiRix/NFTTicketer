import { ConnectButton } from '@rainbow-me/rainbowkit';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAccount, useSigner } from 'wagmi';
import { toast } from 'react-toastify';
import { ethers } from 'ethers';

import styles from '../styles/Home.module.css';
import { CONTRACT_ADDRESS, readFromPinata } from '../utils';
import ContractABI from '../abi/core.json';

const Buy = () => {
  const { address } = useAccount();
  const router = useRouter();
  const { data: signer } = useSigner();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const { cid, eventId } = router.query;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await readFromPinata(cid);
        setData(res);
      } catch (error) {
        toast.error('Some error occured');
        console.log(error);
      }
    };
    if (cid) fetchData();
  }, [cid]);

  const buy = async () => {
    setLoading(true);

    try {
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        ContractABI,
        signer
      );

      const tx = await contract.mint(eventId);

      const res = await tx.wait();
      console.log(res);
      setIsDone(true);
      toast.success('Ticket to event bought successfully');

      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>NFT Ticketer | Buy</title>
        <meta name="description" content="Buy tickets for your event" />
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
          <div className="w-1/3 bg-white shadow-lg p-4 rounded-xl">
            <h2 className="text-2xl text-center font-semibold">Buy Ticket</h2>
            <img
              src="/ticket.png"
              width={'100%'}
              height={'auto'}
              className="my-5"
            />
            {data && (
              <div className="mt-4">
                <h2 className="text-2xl font-semibold text-center">
                  {data.attributes[0].value}
                </h2>
                <p className="my-4 text-base font-normal text-center">
                  {data.description}
                </p>
                <h2 className="text-2xl font-normal text-center">
                  {data.attributes[1].value}
                </h2>
                <div className="mt-5 text-center">
                  <button
                    className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-bold py-2 px-4 rounded-xl"
                    onClick={isDone ? () => {} : buy}
                    disabled={loading}
                  >
                    {loading
                      ? 'Loading...'
                      : isDone
                      ? 'Ticket Bought'
                      : 'Buy Ticket'}
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <h3 className="text-2xl font-semibold bg-purple-500 rounded-xl p-3 text-white">
            Connect wallet to buy ticket
          </h3>
        )}
      </main>
    </div>
  );
};

export default Buy;
