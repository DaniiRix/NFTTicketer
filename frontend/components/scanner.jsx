import { useEffect, useState } from 'react';
import QrReader from 'react-qr-scanner';
import { ethers } from 'ethers';
import { useAccount, useSigner } from 'wagmi';

import { CONTRACT_ADDRESS } from '../utils';
import ContractABI from '../abi/core.json';
import { toast } from 'react-toastify';

const Scanner = () => {
  const { address } = useAccount();
  const [data, setData] = useState(null);
  const [isVerified, setIsVerified] = useState(false);
  const { data: signer } = useSigner();

  useEffect(() => {
    setTimeout(() => {
      setData({
        owner: address,
        ticketId: 1,
      });
      parseData(
        JSON.stringify({
          owner: address,
          ticketId: 1,
        })
      );
    }, 20000);
  }, []);

  const parseData = async (qrData) => {
    const parsedData = JSON.parse(qrData);
    setData(parsedData);
    verify(parsedData);
  };

  const verify = async (data) => {
    try {
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        ContractABI,
        signer
      );

      const tx = await contract.verify(data.owner, data.ticketId);

      const res = await tx.wait();
      console.log(res);

      setIsVerified(true);
      toast.success('You are verified to attend the event');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="w-1/2">
      {!data && (
        <>
          <h1 className="text-3xl font-semibold text-center mb-4">
            Scan your ticket
          </h1>
          <QrReader
            delay={500}
            onError={console.error}
            onScan={(result) => {
              if (result) {
                setData(result.text);
                parseData(result.text);
              } else setData('Not Found');
            }}
          />
        </>
      )}

      {data && isVerified && (
        <>
          <h1 className="text-3xl font-semibold text-center mb-4">
            Welcome! You are verified to enter.
          </h1>

          <p className="text-xl text-center mb-4">Owner: {data.owner}</p>
          <p className="text-xl text-center mb-4">Ticket ID: {data.ticketId}</p>
        </>
      )}
    </div>
  );
};

export default Scanner;
