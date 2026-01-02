/* eslint-disable react-hooks/rules-of-hooks */
import { useRouter } from 'next/router';
import { useState, useEffect, useMemo } from 'react';
import { ChainId, ThirdwebProvider, metamaskWallet, coinbaseWallet, walletConnect, trustWallet } from "@thirdweb-dev/react";
import { BigNumber, utils } from 'ethers';
import {
  useActiveClaimConditionForWallet,
  useAddress,
  useClaimConditions,
  useClaimerProofs,
  useClaimIneligibilityReasons,
  useContract,
  useContractMetadata,
  useTotalCirculatingSupply,
  Web3Button,
} from "@thirdweb-dev/react";
import type { NextPage } from "next";
import { parseIneligibility } from "../utils/parseIneligibility";

const activeChain = "polygon";
const myEditionDropContractAddress: string = "0xAE844Bc15fc76F647E4D285d5e6e67dB2b0D1fcf";

const shopItems = [
  {
    name: 'Stop Loss',
    id: 0,
    description: 'To all traders. To those with us and those who have already left us... We wish no one to get liquidated. It is simple - never forget your stop-loss!',
    images: [
      'https://thesybilmarket.vercel.app/main/1.png',
      'https://thesybilmarket.vercel.app/mainalt/11.png',
      'https://thesybilmarket.vercel.app/mainalt/12.png',
      'https://thesybilmarket.vercel.app/mainalt/13.png',
      'https://thesybilmarket.vercel.app/mainalt/00.png',
    ],
  },
  {
    name: 'The Low Bank',
    id: 1,
    description: 'Low bank is a lifestyle for any true crypto native. It is a reminder: no matter how many stables or BTC you have, or pockets full of scam shitcoins, a ton of coins can turn into $0 balance at any moment. Embrace crypto zen and spread the style.',
    images: [
      'https://thesybilmarket.vercel.app/main/2.png',
      'https://thesybilmarket.vercel.app/mainalt/21.png',
      'https://thesybilmarket.vercel.app/mainalt/22.png',
      'https://thesybilmarket.vercel.app/mainalt/23.png',
      'https://thesybilmarket.vercel.app/mainalt/00.png',
    ],
  },
  {
    name: 'Not Eligible',
    id: 2,
    description: 'Dedicated to everyone who missed the WL for a gem that did Xs, or was ruthlessly filtered out of the next retro-drop that gave every schoolkid life-changing money. Hang in there... we are with you. But if you did catch your life-change, gift this t-shirt to your rekt bro. Support him.',
    images: [
      'https://thesybilmarket.vercel.app/main/3.png',
      'https://thesybilmarket.vercel.app/mainalt/31.png',
      'https://thesybilmarket.vercel.app/mainalt/32.png',
      'https://thesybilmarket.vercel.app/mainalt/33.png',
      'https://thesybilmarket.vercel.app/mainalt/00.png',
    ],
  },
  {
    name: 'Fomo',
    id: 3,
    description: '',
    images: [
      'https://thesybilmarket.vercel.app/main/4.png',
      'https://thesybilmarket.vercel.app/mainalt/41.png',
      'https://thesybilmarket.vercel.app/mainalt/42.png',
      'https://thesybilmarket.vercel.app/mainalt/43.png',
      'https://thesybilmarket.vercel.app/mainalt/00.png',
    ],
  },
  {
    name: 'Connect Wallet',
    id: 4,
    description: 'Connect your wallet, and the magic begins. Xs or rekt, scam, rugpull, honeypot. +1000% to your deposit in two clicks or -99%. The choice is yours. Just connect wallet.',
    images: [
      'https://thesybilmarket.vercel.app/main/5.png',
      'https://thesybilmarket.vercel.app/mainalt/51.png',
      'https://thesybilmarket.vercel.app/mainalt/52.png',
      'https://thesybilmarket.vercel.app/mainalt/53.png',
      'https://thesybilmarket.vercel.app/mainalt/00.png',
    ],
  },
  {
    name: 'Fomo blank',
    id: 5,
    description: '',
    images: [
      'https://thesybilmarket.vercel.app/main/6.png',
      'https://thesybilmarket.vercel.app/mainalt/61.png',
      'https://thesybilmarket.vercel.app/mainalt/62.png',
      'https://thesybilmarket.vercel.app/mainalt/63.png',
      'https://thesybilmarket.vercel.app/mainalt/00.png',
    ],
  },
  {
    name: 'Tsenite Buchky',
    id: 6,
    description: 'We do not appreciate what we have until we lose it. Those who have been in crypto since the last bull cycle or earlier know these words firsthand. And for those for whom the upcoming growth cycle is their first, this will be a constant reminder that "up only" is not eternal. We all also have "acquaintances" who were riding high in the previous cycle, but couldn\'t hold on and lost most of their deposit - for them, this t-shirt will be an important gift. Take care of your neighbor, and it will return to you multiplied.',
    images: [
      'https://thesybilmarket.vercel.app/main/7.png',
      'https://thesybilmarket.vercel.app/mainalt/71.png',
      'https://thesybilmarket.vercel.app/mainalt/72.png',
      'https://thesybilmarket.vercel.app/mainalt/73.png',
      'https://thesybilmarket.vercel.app/mainalt/00.png',
    ],
  },
  {
    name: 'Mint Or Skip',
    id: 7,
    description: '',
    images: [
      'https://thesybilmarket.vercel.app/main/8.png',
      'https://thesybilmarket.vercel.app/mainalt/81.png',
      'https://thesybilmarket.vercel.app/mainalt/82.png',
      'https://thesybilmarket.vercel.app/mainalt/83.png',
      'https://thesybilmarket.vercel.app/mainalt/00.png',
    ],
  },
  {
    name: 'Connect Wallet Purple',
    id: 8,
    description: 'Connect your wallet, and the magic begins. Xs or rekt, scam, rugpull, honeypot. +1000% to your deposit in two clicks or -99%. The choice is yours. Just connect wallet.',
    images: [
      'https://thesybilmarket.vercel.app/main/9.png',
      'https://thesybilmarket.vercel.app/mainalt/91.png',
      'https://thesybilmarket.vercel.app/mainalt/92.png',
      'https://thesybilmarket.vercel.app/mainalt/93.png',
      'https://thesybilmarket.vercel.app/mainalt/00.png',
    ],
  },
];

const ProductPage: NextPage = () => {
  const router = useRouter();
  const address = useAddress();
  const [quantity, setQuantity] = useState(1);
  const { contract: editionDrop } = useContract(myEditionDropContractAddress);
  
  const [referralAddress, setReferralAddress] = useState('');
  const [reffs, setReffs] = useState<number>(0);
  const [referralError, setReferralError] = useState("");
  const currentAddress = address;
  const { productName } = router.query;
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [tokenId, setTokenId] = useState<number>(0);

  const selectedProduct = shopItems.find(
    (item) => item.name && productName && encodeURIComponent(item.name.replace(/\s+/g, '-')) === productName
  );

  // --- THIRDWEB LOGIC ---
  const claimConditions = useClaimConditions(editionDrop, tokenId);
  const activeClaimCondition = useActiveClaimConditionForWallet(
    editionDrop,
    address,
    tokenId
  );
  const claimerProofs = useClaimerProofs(editionDrop, address || "", tokenId);
  const claimIneligibilityReasons = useClaimIneligibilityReasons(
    editionDrop,
    {
      quantity,
      walletAddress: address || "",
    },
    tokenId
  );

  const claimedSupply = useTotalCirculatingSupply(editionDrop, tokenId);

  const totalAvailableSupply = useMemo(() => {
    try {
      return BigNumber.from(activeClaimCondition.data?.availableSupply || 0);
    } catch {
      return BigNumber.from(1_000_000);
    }
  }, [activeClaimCondition.data?.availableSupply]);

  const numberClaimed = useMemo(() => {
    return BigNumber.from(claimedSupply.data || 0).toString();
  }, [claimedSupply]);

  const numberTotal = useMemo(() => {
    const n = totalAvailableSupply.add(BigNumber.from(claimedSupply.data || 0));
    if (n.gte(1_000_000)) {
      return "";
    }
    return n.toString();
  }, [totalAvailableSupply, claimedSupply]);

  const priceToMint = useMemo(() => {
    const bnPrice = BigNumber.from(
      activeClaimCondition.data?.currencyMetadata.value || 0
    );
    return `${utils.formatUnits(
      bnPrice.mul(quantity).toString(),
      activeClaimCondition.data?.currencyMetadata.decimals || 18
    )} ${activeClaimCondition.data?.currencyMetadata.symbol}`;
  }, [
    activeClaimCondition.data?.currencyMetadata.decimals,
    activeClaimCondition.data?.currencyMetadata.symbol,
    activeClaimCondition.data?.currencyMetadata.value,
    quantity,
  ]);

  const maxClaimable = useMemo(() => {
    let bnMaxClaimable;
    try {
      bnMaxClaimable = BigNumber.from(activeClaimCondition.data?.maxClaimableSupply || 0);
    } catch (e) {
      bnMaxClaimable = BigNumber.from(1_000_000);
    }

    let perTransactionClaimable;
    try {
      perTransactionClaimable = BigNumber.from(activeClaimCondition.data?.maxClaimablePerWallet || 0);
    } catch (e) {
      perTransactionClaimable = BigNumber.from(1_000_000);
    }

    if (perTransactionClaimable.lte(bnMaxClaimable)) {
      bnMaxClaimable = perTransactionClaimable;
    }

    const snapshotClaimable = claimerProofs.data?.maxClaimable;

    if (snapshotClaimable) {
      if (snapshotClaimable === "0") {
        bnMaxClaimable = BigNumber.from(1_000_000);
      } else {
        try {
          bnMaxClaimable = BigNumber.from(snapshotClaimable);
        } catch (e) {
          // fallback
        }
      }
    }

    let max;
    if (totalAvailableSupply.lt(bnMaxClaimable)) {
      max = totalAvailableSupply;
    } else {
      max = bnMaxClaimable;
    }

    if (max.gte(1_000_000)) {
      return 1_000_000;
    }
    return max.toNumber();
  }, [
    claimerProofs.data?.maxClaimable,
    totalAvailableSupply,
    activeClaimCondition.data?.maxClaimableSupply,
    activeClaimCondition.data?.maxClaimablePerWallet,
  ]);

  const isSoldOut = useMemo(() => {
    try {
      return (
        (activeClaimCondition.isSuccess &&
          BigNumber.from(activeClaimCondition.data?.availableSupply || 0).lte(0)) ||
        numberClaimed === numberTotal
      );
    } catch (e) {
      return false;
    }
  }, [
    activeClaimCondition.data?.availableSupply,
    activeClaimCondition.isSuccess,
    numberClaimed,
    numberTotal,
  ]);

  const canClaim = useMemo(() => {
    return (
      activeClaimCondition.isSuccess &&
      claimIneligibilityReasons.isSuccess &&
      claimIneligibilityReasons.data?.length === 0 &&
      !isSoldOut
    );
  }, [
    activeClaimCondition.isSuccess,
    claimIneligibilityReasons.data?.length,
    claimIneligibilityReasons.isSuccess,
    isSoldOut,
  ]);

  const isLoading = useMemo(() => {
    return (
      activeClaimCondition.isLoading || claimedSupply.isLoading || !editionDrop
    );
  }, [activeClaimCondition.isLoading, editionDrop, claimedSupply.isLoading]);

  const buttonLoading = useMemo(
    () => isLoading || claimIneligibilityReasons.isLoading,
    [claimIneligibilityReasons.isLoading, isLoading]
  );

  const buttonText = useMemo(() => {
    if (isSoldOut) {
      return "Sold Out";
    }

    if (canClaim) {
      const pricePerToken = BigNumber.from(
        activeClaimCondition.data?.currencyMetadata.value || 0
      );
      if (pricePerToken.eq(0)) {
        return "Mint (Free)";
      }
      return `Mint (${priceToMint})`;
    }
    if (claimIneligibilityReasons.data?.length) {
      return parseIneligibility(claimIneligibilityReasons.data, quantity);
    }
    if (buttonLoading) {
      return "Checking eligibility...";
    }

    return "Claiming not available";
  }, [
    isSoldOut,
    canClaim,
    claimIneligibilityReasons.data,
    buttonLoading,
    activeClaimCondition.data?.currencyMetadata.value,
    priceToMint,
    quantity,
  ]);

  // --- GOOGLE SHEETS API LOGIC (SAFE) ---
  const writeToGoogleSheets = async (referralAddr: string) => {
    let addrToWrite = referralAddr.trim();
    if (addrToWrite === '') {
      addrToWrite = '0x';
    }

    try {
      await fetch('/api/write-sheets-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: addrToWrite }),
      });
      console.log('Referral saved via API');
    } catch (error) {
      console.error('Error saving referral:', error);
    }
  };

  useEffect(() => {
    if (currentAddress) {
      fetch(`/api/get-sheets-data?address=0x`)
        .then((res) => res.json())
        .then((data) => {
          if (data.referrals !== undefined) {
             setReffs(data.referrals);
          }
        })
        .catch(console.error);
    }
  }, [currentAddress]);

  const [referralData, setReferralData] = useState<{ recipient: string; amount: number }[]>([]);

  function addOrUpdateReferral(addr: string) {
    const existingReferralIndex = referralData.findIndex((item) => item.recipient === addr);
    if (existingReferralIndex !== -1) {
      const updatedReferralData = [...referralData];
      updatedReferralData[existingReferralIndex].amount += 1;
      setReferralData(updatedReferralData);
    } else {
      setReferralData([...referralData, { recipient: addr, amount: 1 }]);
    }
  }

  const handleButtonClick = async () => {
    const addressToUse = referralAddress.trim() === '' ? '0x' : referralAddress;
    
    addOrUpdateReferral(addressToUse);
    await writeToGoogleSheets(addressToUse);
  };

  // --- UI EFFECTS ---

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (selectedProduct && selectedProduct.images.length > 0) {
      setSelectedImage(selectedProduct.images[0]);
      setTokenId(selectedProduct.id);
    }
  }, [selectedProduct]);

  if (!selectedProduct) {
    return <div className="text-white text-center mt-20">Product not found</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <ThirdwebProvider
      activeChain={activeChain}
      clientId="9e4314f9cb80713a98f3221cfb883eaf"
      supportedWallets={[
        metamaskWallet({ recommended: true }),
        coinbaseWallet(),
        walletConnect(),
        trustWallet(),
      ]}
    >
      <div className="w-full flex justify-center mt-[6em]">
        <div className="md:w-full w-[90%] md:flex grid justify-center ">
          <div className="grid text-white justify-center items-start md:w-2/6 w-full px-6 order-2 md:order-1 ">
            {/* Product Info */}
            <div className="flex flex-col justify-start items-center mt-5">
              <div className=''>
                <div className='text-white text-2xl font-bold'>{selectedProduct.name}</div>
                <div className='text-white/90 text-md mt-5'>{selectedProduct.description}</div>
                <div className='text-white/90 text-md mt-5'>Composition: 100% cotton, density: 230g. This T-shirt is universal, suitable for both men and women. A care label is sewn into the side seam.</div>
              </div>
            </div>

            <div className="w-full mt-auto">
              {isLoading ? (
                <div className='w-full flex justify-center'>
                  <p>Loading...</p>
                </div>
              ) : (
                <>
                  <div className='sm:mt-5 mt-24'>
                    <div >
                      <div className='flex justify-between'>
                        <p>Total Minted</p>
                        {currentAddress ? (
                          <div>
                            {reffs !== null ? <p>{reffs}/150</p> : <p>Loading...</p>}
                          </div>
                        ) : (
                          <p>???/150</p>
                        )}
                      </div>
                    </div>

                    {claimConditions.data?.length === 0 ||
                    claimConditions.data?.every((cc) => cc.maxClaimableSupply === "0") ? (
                      <div>
                        <h2>This drop is not ready to be minted yet. (No claim condition set)</h2>
                      </div>
                    ) : (
                      <>
                        <p className='mt-5'>Quantity</p>
                        <div className='flex justify-between p-1 rounded-lg mb-3'>
                          <button
                            className='p-1 rounded-lg mr-3 mt-3 border-gray-500 hover:bg-gray-500 border w-10 h-10 flex justify-center items-center'
                            onClick={() => setQuantity(quantity - 1)}
                            disabled={quantity <= 1}
                          >
                            -
                          </button>
                          <h4 className='p-1 rounded-lg my-3 border-gray-500 border w-full h-10 flex justify-center items-center'>{quantity}</h4>
                          <button
                            className='p-1 rounded-lg ml-3 mt-3 border-gray-500 hover:bg-gray-500 border w-10 h-10 flex justify-center items-center'
                            onClick={() => setQuantity(quantity + 1)}
                            disabled={quantity >= maxClaimable}
                          >
                            +
                          </button>
                        </div>

                        <div>
                          {isSoldOut ? (
                            <div>
                              <h2>Sold Out</h2>
                            </div>
                          ) : (
                            <div>
                              <div className='mb-2'>
                                {referralError && <div className="text-red-500">{referralError}</div>}
                                <input
                                  type="text"
                                  placeholder="Wallet address or Code of person who invited you"
                                  value={referralAddress}
                                  onChange={(e) => {
                                    const inputValue = e.target.value;
                                    setReferralAddress(inputValue);
                                    if (inputValue !== "" && inputValue === currentAddress) {
                                      setReferralError("Referral address cannot be the same as the current address");
                                    } else {
                                      setReferralError("");
                                    }
                                  }}
                                  className={`w-[100%] bg-transparent border border-gray-300 rounded-lg text-white h-12 px-4 text-base mb-0 ${referralError ? "border-red-500" : ""}`}
                                />
                              </div>
                              <Web3Button
                                style={{ width: "100%" }}
                                contractAddress={editionDrop?.getAddress() || ""}
                                action={(cntr) => cntr.erc1155.claim(tokenId, quantity)}
                                isDisabled={!canClaim || buttonLoading}
                                onError={(err) => {
                                  console.error(err);
                                  alert("Error claiming NFTs");
                                }}
                                onSuccess={() => {
                                  setQuantity(1);
                                  handleButtonClick();
                                  router.push('/profile');
                                }}
                              >
                                {buttonLoading ? "Loading..." : buttonText}
                              </Web3Button>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="grid gap-4 justify-center md:w-2/6 w-full order-1 md:order-2">
            <div>
              {selectedImage && (
                <img
                  className="h-auto max-w-full rounded-lg"
                  src={selectedImage}
                  alt={`Selected Product`}
                />
              )}
            </div>
            <div className="grid grid-cols-5 gap-4 items-end">
              {selectedProduct.images.map((image, index) => (
                <div key={index} onClick={() => setSelectedImage(image)}>
                  <img
                    className="h-auto max-w-full rounded-lg cursor-pointer"
                    src={image}
                    alt={`Product ${index + 1}`}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Size Chart Table */}
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg flex justify-center my-10">
        <table className="md:w-4/6 w-[80%] text-sm text-left rtl:text-right text-gray-300 ">
            <thead className="text-xs text-gray-200 uppercase ">
                <tr className=' border-b '>
                    <th scope="col" className="px-6 py-3">Sizes</th>
                    <th scope="col" className="px-6 py-3">Lenght</th>
                    <th scope="col" className="px-6 py-3">Width</th>
                    <th scope="col" className="px-6 py-3">Sleeves</th>
                    <th scope="col" className="px-6 py-3">Shoulders</th>
                </tr>
            </thead>
            <tbody className='sm:text-sm text-[9px]'>
                <tr className="">
                    <th scope="row" className="px-6 py-4 font-medium text-white whitespace-nowrap ">XS</th>
                    <td className="px-6 py-4">68</td>
                    <td className="px-6 py-4">54</td>
                    <td className="px-6 py-4">24</td>
                    <td className="px-6 py-4">17</td>
                </tr>
                <tr className=" ">
                    <th scope="row" className="px-6 py-4 font-medium text-white whitespace-nowrap ">S</th>
                    <td className="px-6 py-4">72</td>
                    <td className="px-6 py-4">56</td>
                    <td className="px-6 py-4">25</td>
                    <td className="px-6 py-4">17.5</td>
                </tr>
                <tr className=" ">
                    <th scope="row" className="px-6 py-4 font-medium text-white whitespace-nowrap ">M</th>
                    <td className="px-6 py-4">74</td>
                    <td className="px-6 py-4">58</td>
                    <td className="px-6 py-4">26</td>
                    <td className="px-6 py-4">18</td>
                </tr>
                <tr className="">
                    <th scope="row" className="px-6 py-4 font-medium text-white whitespace-nowrap ">L</th>
                    <td className="px-6 py-4">76</td>
                    <td className="px-6 py-4">60</td>
                    <td className="px-6 py-4">26</td>
                    <td className="px-6 py-4">18.5</td>
                </tr>
                <tr className="">
                    <th scope="row" className="px-6 py-4 font-medium text-white whitespace-nowrap ">XL</th>
                    <td className="px-6 py-4">78</td>
                    <td className="px-6 py-4">62</td>
                    <td className="px-6 py-4">27</td>
                    <td className="px-6 py-4">19</td>
                </tr>
                <tr className="">
                    <th scope="row" className="px-6 py-4 font-medium text-white whitespace-nowrap ">XXL</th>
                    <td className="px-6 py-4">80</td>
                    <td className="px-6 py-4">64</td>
                    <td className="px-6 py-4">27</td>
                    <td className="px-6 py-4">19.5</td>
                </tr>
            </tbody>
        </table>
    </div>
    </ThirdwebProvider>
  );
};

export default ProductPage;