import axios from 'axios';

export const postToPinata = async (data) => {
  try {
    const res = await axios.post(
      'https://api.pinata.cloud/pinning/pinJSONToIPFS',
      data,
      {
        headers: {
          pinata_api_key: process.env.NEXT_PUBLIC_PINATA_API,
          pinata_secret_api_key: process.env.NEXT_PUBLIC_PINATA_SECRET,
        },
      }
    );

    return res;
  } catch (error) {
    console.error(error);
  }
};

export const readFromPinata = async (cid) => {
  try {
    const response = await axios.get(
      `https://gateway.pinata.cloud/ipfs/${cid}`
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const fetchTickets = async (address) => {
  const config = {
    method: 'get',
    url: `${process.env.NEXT_PUBLIC_ALCHEMY}/getNFTs?owner=${address}&withMetadata=true&contractAddresses[]=${CONTRACT_ADDRESS}`,
  };

  const response = await axios(config);

  const userNFTs = [];

  for (let nft of response.data.ownedNfts) {
    if (nft.metadata.attributes.length > 0) {
      console.log(nft);
      userNFTs.push({
        title: data.attributes[0].value,
        description: data.description,
        date: data.attributes[1].value,
        ticketId: parseInt(nft.id.tokenId, 16),
      });
    }
  }

  return userNFTs;
};

export const CONTRACT_ADDRESS = '0x815e080c886D962ef408396F69A57a970E3174bF';
