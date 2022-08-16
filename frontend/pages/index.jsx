import { ConnectButton } from '@rainbow-me/rainbowkit';
import { ethers } from 'ethers';
import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAccount, useSigner } from 'wagmi';
import { toast } from 'react-toastify';

import styles from '../styles/Home.module.css';
import ContractABI from '../abi/core.json';
import { CONTRACT_ADDRESS, postToPinata } from '../utils';

const Home = () => {
  const { address } = useAccount();
  const [contract, setContract] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [total, setTotal] = useState(null);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [cid, setCid] = useState(null);

  const [url, setUrl] = useState(null);

  const { data: signer } = useSigner();

  const onCreated = async (sender, eventId) => {
    console.log(
      `EventCreated - sender: ${sender} tokenId: ${eventId.toNumber()}`
    );
    setUrl(
      'https://nftticketer.on.fleek.co/buy?cid=' +
        cid +
        '&eventId=' +
        eventId.toNumber()
    );
  };

  useEffect(() => {
    if (contract) {
      contract.on('Created', onCreated);
    }

    return () => {
      if (contract) {
        contract.off('Created', onCreated);
      }
    };
  }, []);

  const mint = async () => {
    setLoading(true);

    try {
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        ContractABI,
        signer
      );

      setContract(contract);

      const formatedDate = new Date(date).toISOString().split('T')[0];

      const pinataObj = {
        attributes: [
          {
            trait_type: 'Event Title',
            value: title,
          },
          {
            trait_type: 'Event Date',
            value: formatedDate,
          },
          {
            trait_type: 'Max Tickets',
            value: total,
          },
        ],
        description,
        image: null,
      };

      const response = await postToPinata(pinataObj);

      const tx = await contract.create(
        title,
        description,
        formatedDate,
        response.data.IpfsHash,
        total
      );

      const res = await tx.wait();
      setCid(response.data.IpfsHash);

      console.log(res);
      toast.success('Event created successfully');

      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>NFT Ticketer</title>
        <meta
          name="description"
          content="Generate On-chain verifiable tickets"
        />
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
            <h2 className="text-xl font-normal">Event Details</h2>
            <div className="mt-4">
              <input
                className="w-full my-2 px-3 py-2 border border-gray-300 rounded-xl outline-none"
                placeholder="Event Title*"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <input
                className="w-full my-2 px-3 py-2 border border-gray-300 rounded-xl outline-none"
                placeholder="Event Description*"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <input
                className="w-full my-2 px-3 py-2 border border-gray-300 rounded-xl outline-none"
                placeholder="Event Title"
                type={'date'}
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
              <input
                type={'number'}
                className="w-full my-2 px-3 py-2 border border-gray-300 rounded-xl outline-none"
                placeholder="Tickets to mint"
                required
                value={total}
                onChange={(e) => setTotal(e.target.value)}
              />
              <div className="w-full text-right">
                <button
                  className="mt-2 bg-purple-500 text-white px-3 py-2 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={mint}
                  disabled={loading}
                >
                  {loading ? 'Minting...' : 'Mint Tickets'}
                </button>
              </div>

              {url && (
                <Link href={url}>
                  <a className="block text-blue-400 text-center truncate">
                    <span className="text-black/90 font-semibold">
                      MINT NFT:{' '}
                    </span>
                    {url}
                  </a>
                </Link>
              )}
            </div>
          </div>
        ) : (
          <h3 className="text-2xl font-semibold bg-purple-500 rounded-xl p-3 text-white">
            Connect wallet to create Event
          </h3>
        )}
      </main>
    </div>
  );
};

export default Home;
