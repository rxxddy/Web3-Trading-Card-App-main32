/* eslint-disable react-hooks/rules-of-hooks */
// pages/products/[productName]/index.tsx
import { useRouter } from 'next/router';
import { useState, useEffect, useMemo } from 'react';
import { ChainId, ThirdwebProvider } from "@thirdweb-dev/react";
import { BigNumber } from 'ethers';

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
  import { utils } from "ethers";
  import type { NextPage } from "next";

  import { parseIneligibility } from "../utils/parseIneligibility";
// Updated shopItems array


import Image from "next/image";
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';


const activeChain = "polygon";

const shopItems = [
  {
    name: 'Stop Loss',
    id: 0,
    description: 'Всем трейдерам. Тем кто с нами и тем кто уже покинул нас... Желаем никому не словить ликвид. Все просто - никогда не забывай стоп-лосс!',
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
    description: 'Лоу банк - как стиль жизни любого тру криптана. Это напоминание, сколько бы не было стейблов и битка, или полные карманы скамных щитков, в любой момент тонна монет может превратиться в 0$ на балансе. Познаем крипто дзен и раздаем стиля.',
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
    id: 1,
    description: 'Посвящается всем тем, кто не выбил ВЛ в гем давший иксы или был беспощадно сбрит в очередном ретро-дропе давшем каждому школьнику лайфченч. Держитесь...мы с вами. Но если все же ты словил свой лайфченч, подари эту футболку бритому братишке. Поддержи его. ',
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
    id: 1,
    description: 'Всем трейдерам. Тем кто с нами и тем кто уже покинул нас... Желаем никому не словить ликвид. Все просто - никогда не забывай стоп-лосс!',
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
    id: 1,
    description: 'Стоит подключить кошелек, и начинается магия. Иксы или рект, скам, рагпул, ханипот. +1000% к депозиту в два клика или -99% депа. Выбор за тобой. Just connect wallet.',
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
    id: 1,
    description: 'Всем трейдерам. Тем кто с нами и тем кто уже покинул нас... Желаем никому не словить ликвид. Все просто - никогда не забывай стоп-лосс!',
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
    id: 1,
    description: 'Не ценим что имеет, потеряв начинаем ценить. Те, кто в крипте с прошлого бычьего цикла или даже раньше, не по наслышке поймут эти слова. А тем, для кого будущий цикл роста первый в карьере, это станет постоянным напоминанием, что рост не бывает вечным. Также у всех нас есть "знакомые", кто был на коне в предыдущий цикл, но по его окончанию не смог удержаться и потерял большую часть депозита - для них эта футболка станет важным подарком. Позаботься о своем ближнем, и это вертнется тебе в кратном размере.',
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
    id: 1,
    description: 'Всем трейдерам. Тем кто с нами и тем кто уже покинул нас... Желаем никому не словить ликвид. Все просто - никогда не забывай стоп-лосс!',
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
    id: 1,
    description: 'Стоит подключить кошелек, и начинается магия. Иксы или рект, скам, рагпул, ханипот. +1000% к депозиту в два клика или -99% депа. Выбор за тобой. Just connect wallet.',
    images: [
      'https://thesybilmarket.vercel.app/main/9.png',
      'https://thesybilmarket.vercel.app/mainalt/91.png',
      'https://thesybilmarket.vercel.app/mainalt/92.png',
      'https://thesybilmarket.vercel.app/mainalt/93.png',
      'https://thesybilmarket.vercel.app/mainalt/00.png',
    ],
  },
  // Add more products as needed
];

const ProductPage = () => {
  const router = useRouter();
  const { productName } = router.query;

  const tokenAddress = "0xAE844Bc15fc76F647E4D285d5e6e67dB2b0D1fcf";

  // console.log('FIRST COLSOLE LOG', address)

  // const { data: contractMetadata } = useContractMetadata(contract);


  // Find the selected product data based on the product name
  const selectedProduct = shopItems.find(
    (item) => encodeURIComponent(item.name.replace(/\s+/g, '-')) === productName
  );

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [tokenId, setTokenId] = useState<number>(0);

  useEffect(() => {
    // Set the initial selected image to the first image in the array
    if (selectedProduct && selectedProduct.images.length > 0) {
      setSelectedImage(selectedProduct.images[0]);

      // Use a callback function with setTokenId to update the state
      setTokenId((prevTokenId) => selectedProduct.id);
    }
  }, [selectedProduct]);

  useEffect(() => {
    // Log the updated tokenId only when it's not null
    if (tokenId !== null) {
      // console.log("This is ID", tokenId);
    }
  }, [tokenId]);

  if (!selectedProduct) {
    // Handle case where product is not found
    return (
      <div>
        <div>Product not found</div>
      </div>
    );
  }

//   edition data

const myEditionDropContractAddress: string = "0xAE844Bc15fc76F647E4D285d5e6e67dB2b0D1fcf";
// const tokenId: string = "0";

const address = useAddress();
const [quantity, setQuantity] = useState(1);
const { contract: editionDrop } = useContract(myEditionDropContractAddress);
const { data: contractMetadata } = useContractMetadata(editionDrop);
const [referralAddress, setReferralAddress] = useState('');
const successText = 'text logs only after success';
const [reffs, setReffs] = useState<number>(0);
const [referralError, setReferralError] = useState("");
const currentAddress = address;

const claimConditions = useClaimConditions(editionDrop);
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
    bnMaxClaimable = BigNumber.from(
      activeClaimCondition.data?.maxClaimableSupply || 0
    );
  } catch (e) {
    bnMaxClaimable = BigNumber.from(1_000_000);
  }

  let perTransactionClaimable;
  try {
    perTransactionClaimable = BigNumber.from(
      activeClaimCondition.data?.maxClaimablePerWallet || 0
    );
  } catch (e) {
    perTransactionClaimable = BigNumber.from(1_000_000);
  }

  if (perTransactionClaimable.lte(bnMaxClaimable)) {
    bnMaxClaimable = perTransactionClaimable;
  }

  const snapshotClaimable = claimerProofs.data?.maxClaimable;

  if (snapshotClaimable) {
    if (snapshotClaimable === "0") {
      // allowed unlimited for the snapshot
      bnMaxClaimable = BigNumber.from(1_000_000);
    } else {
      try {
        bnMaxClaimable = BigNumber.from(snapshotClaimable);
      } catch (e) {
        // fall back to default case
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
        BigNumber.from(activeClaimCondition.data?.availableSupply || 0).lte(
          0
        )) ||
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

const writeToGoogleSheets = async (referralAddress: string) => {
  // Check if referralAddress is empty/
  if (referralAddress.trim() === '') {
    // Do nothing if referralAddress is empty
    return;
  }


// console.log("email:", process.env.GOOGLE_SHEETS_EMAIL)
  const serviceAccountAuth = new JWT({
    email: process.env.GOOGLE_SHEETS_EMAIL,
    key: process.env.GOOGLE_SHEETS_KEY,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const doc = new GoogleSpreadsheet('1daqsM7V0qS3MKmzq40vmQ58izNWfzbA8qh0e7IUy4cM', serviceAccountAuth);

  try {
    // console.log('Attempting to authorize...');
    await serviceAccountAuth.authorize();
    // console.log('Authorization successful.');

    // console.log('Loading document info...');
    await doc.loadInfo();
    // console.log('Document info loaded.');

    const sheet = doc.sheetsByIndex[1];
    // console.log('Sheet loaded.');

    const dataToWrite = {
      address: referralAddress,
      maxClaimable: 1,
    };

    const rows = await sheet.getRows();

    const existingRow = rows.find((row) => row.get('address') === referralAddress);
    // console.log('existingRow', existingRow);

    if (existingRow) {
      const currentAmount = Number(existingRow.get('maxClaimable'));
      existingRow.set('maxClaimable', currentAmount + 1);
      await existingRow.save();
    } else {
      await sheet.addRow(dataToWrite);
    }

    // console.log('Data written to Google Sheets.');
  } catch (error) {
    console.error('Error:', error);
  }
};

const readFromGoogleSheets = async (currentAddress: string) => {
  const serviceAccountAuth = new JWT({
    email: process.env.GOOGLE_SHEETS_EMAIL,
    key: process.env.GOOGLE_SHEETS_KEY,
    scopes: [
      'https://www.googleapis.com/auth/spreadsheets',
    ],
  });
  
  const doc = new GoogleSpreadsheet('1daqsM7V0qS3MKmzq40vmQ58izNWfzbA8qh0e7IUy4cM', serviceAccountAuth);

  try {
    // console.log('Attempting to authorize...');
    try {
      await serviceAccountAuth.authorize();
    } catch (error) {
      console.error('Error during authorization:', error);
    }
    // console.log('Authorization successful.');
    // console.log('Loading document info...');
    await doc.loadInfo();
    // console.log('Document info loaded.');
    const sheetIndexToWriteTo = 1;
    const sheet = doc.sheetsByIndex[sheetIndexToWriteTo];
  
    if (!sheet) {
      console.error(`Sheet with index ${sheetIndexToWriteTo} not found.`);
      return;
    }
    // console.log('Sheet loaded.');
    const rows = await sheet.getRows();
    // console.log('IERNONIGR', currentAddress)
    const matchingRow = await rows.find(async (row) => row.get('address') === currentAddress);
    // console.log('matchingRow', matchingRow);
    // console.log('IERNONIGR', currentAddress);
    const findMatchingRow = async () => {
      const matchingRow = await Promise.all(rows.map(async (row) => {
        const wallet = await row.get('address');
        const referrals = await row.get('maxClaimable');
        if (wallet === currentAddress) {
          // console.log('Matching Wallet:', wallet);
          // console.log('Amount of Referrals:', referrals);
          setReffs(referrals);
          return true;
        }
        return false;
      }));
      if (!matchingRow.includes(true)) {
        // console.log('No matching row found.');
        // console.log('Loaded sheets:', doc.sheetsByIndex.map(sheet => sheet.title));
      }
    };
    findMatchingRow();
    if (matchingRow) {
      const amount = Number(matchingRow.get('maxClaimable'));
      // console.log('AMAAAAAAAAAAAAAAAUNT', amount);
    } else {
      // console.log('No matching row found');
    }
    // console.log(matchingRow);
    // console.log('Data written to Google Sheets.');
  } catch (error) {
    console.error('Error:', error);
  }
};

useEffect(() => {
  if (currentAddress) {
    readFromGoogleSheets(currentAddress);
  }
}, [currentAddress]);

const [referralData, setReferralData] = useState<{ recipient: string; amount: number }[]>([]);

function addOrUpdateReferral(address: string) {

 const existingReferralIndex = referralData.findIndex((item) => item.recipient === address);

 if (existingReferralIndex !== -1) {
   const updatedReferralData = [...referralData];
   updatedReferralData[existingReferralIndex].amount += 1;
   setReferralData(updatedReferralData);
 } else {
   setReferralData([...referralData, { recipient: address, amount: 1 }]);
 }
}

const handleButtonClick = async () => {
  addOrUpdateReferral(referralAddress); // Update referral data array
  // console.log(referralData);
  // console.log(successText);
  writeToGoogleSheets(referralAddress);
};

const sizes = ['S', 'M', 'L', 'XL'];
  const numericValues = [1, 2, 3, 4, 5];

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Your data fetching logic here
        // Example: const response = await fetch('/api/data');
        // const data = await response.json();
      } catch (error) {
        console.error('Error fetching data:', error);
        setError("You can't reload the page");
      }
    };

    fetchData();
  }, []); // Run only on mount

  if (error) {
    return <div>{error}</div>;
  }


  return (
    <ThirdwebProvider activeChain={activeChain} clientId="9e4314f9cb80713a98f3221cfb883eaf">
      <div className="w-full flex justify-center mt-[6em]">
      <div className="md:w-full w-[90%] md:flex grid justify-center ">
        <div className="grid text-white justify-center items-start md:w-2/6 w-full px-6 order-2 md:order-1 ">
            {/* Render the product name and description */}
            <div className="flex flex-col justify-start items-center mt-5">
              <div className=''>
                  <div className='text-white text-2xl font-bold'>{selectedProduct.name}</div>
                  <div className='text-white/90 text-lg mt-5'>{selectedProduct.description}</div>
                  <div></div>
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
                        <div >
                          {claimedSupply ? (
                            <p>
                              <b>{numberClaimed}</b>
                              {" / "}
                              {numberTotal || "∞"}
                            </p>
                          ) : (
                            // Show loading state if we're still loading the supply
                            <div className='w-full flex justify-center'>
                              <p>Loading...</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {claimConditions.data?.length === 0 ||
                    claimConditions.data?.every(
                      (cc) => cc.maxClaimableSupply === "0"
                    ) ? (
                      <div>
                        <h2>
                          This drop is not ready to be minted yet. (No claim condition
                          set)
                        </h2>
                      </div>
                    ) : (
                      <>
                        <p className='mt-5'>Quantity</p>
                        <div className='flex justify-between p-1 rounded-lg mb-3'>
                          <button
                            className='p-1 rounded-lg mr-3 mt-3 border-gray-500 hover:bg-gray-500 border  w-10 h-10 flex justify-center items-center'
                            onClick={() => setQuantity(quantity - 1)}
                            disabled={quantity <= 1}
                          >
                            -
                          </button>

                          <h4 className='p-1 rounded-lg my-3 border-gray-500 border w-full h-10 flex justify-center items-center'>{quantity}</h4>

                          <button
                            className='p-1 rounded-lg ml-3 mt-3 border-gray-500 hover:bg-gray-500 border  w-10 h-10 flex justify-center items-center'
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
                                  
                                          // Validation checks
                                          if (inputValue !== "" && inputValue === currentAddress) {
                                            setReferralError("Referral address cannot be the same as the current address");
                                          } else {
                                          setReferralError(""); // Clear error if input is valid or empty
                                          }
                                      }}
                                      className={`w-[100%] bg-transparent border border-gray-300 rounded-lg text-white h-12 px-4 text-base mb-0 ${referralError ? "border-red-500" : ""}`}
                                  />
                                  
                              </div>
                              <Web3Button
                              style={{width: "100%"}}
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

            
        {/* finish */}


        </div>
        <div className="grid gap-4 justify-center md:w-2/6 w-full order-1 md:order-2">
          <div>
            {/* Render the selected image */}
            {selectedImage && (
              <img
                className="h-auto max-w-full rounded-lg"
                src={selectedImage}
                alt={`Selected Product`}
              />
            )}
          </div>
          <div className="grid grid-cols-5 gap-4 items-end">
            {/* Render the product images */}
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
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg flex justify-center my-10">
        <table className="md:w-4/6 w-[80%] text-sm text-left rtl:text-right text-gray-300 ">
            <thead className="text-xs text-gray-200 uppercase   ">
                <tr className=' border-b   '>
                    <th scope="col" className="px-6 py-3">
                        Размеры
                    </th>
                    <th scope="col" className="px-6 py-3">
                        Длина
                    </th>
                    <th scope="col" className="px-6 py-3">
                        Ширина
                    </th>
                    <th scope="col" className="px-6 py-3">
                        Рукова
                    </th>
                    <th scope="col" className="px-6 py-3">
                        Плечи
                    </th>
                </tr>
            </thead>
            <tbody className='sm:text-sm text-[9px]'>
                <tr className="">
                    <th scope="row" className="px-6 py-4 font-medium text-white whitespace-nowrap ">
                      XS
                    </th>
                    <td className="px-6 py-4">
                      68
                    </td>
                    <td className="px-6 py-4">
                      54 
                    </td>
                    <td className="px-6 py-4">
                      24
                    </td>
                    <td className="px-6 py-4">
                      17 
                    </td>
                   
                    
                    
                </tr>
                <tr className=" ">
                <th scope="row" className="px-6 py-4 font-medium text-white whitespace-nowrap ">
                      S
                    </th>
                    <td className="px-6 py-4">
                      72
                    </td>
                    <td className="px-6 py-4">
                      56
                    </td>
                    <td className="px-6 py-4">
                      25
                    </td>
                    <td className="px-6 py-4">
                      17.5
                    </td>
                    
                </tr>
                <tr className="   ">
                <th scope="row" className="px-6 py-4 font-medium text-white whitespace-nowrap ">
                      M 
                    </th>
                    <td className="px-6 py-4">
                        74
                    </td>
                    <td className="px-6 py-4">
                        58
                    </td>
                    <td className="px-6 py-4">
                        26
                    </td>
                    <td className="px-6 py-4">
                        18
                    </td>
                   
                </tr>
                <tr className="">
                <th scope="row" className="px-6 py-4 font-medium text-white whitespace-nowrap ">
                      L 
                    </th>
                    <td className="px-6 py-4">
                        76
                    </td>
                    <td className="px-6 py-4">
                        60
                    </td>
                    <td className="px-6 py-4">
                        26
                    </td>
                    <td className="px-6 py-4">
                        18.5
                    </td>
                  
                </tr>
                <tr className="">
                <th scope="row" className="px-6 py-4 font-medium text-white whitespace-nowrap ">
                      XL 
                    </th>
                    <td className="px-6 py-4">
                        78
                    </td>
                    <td className="px-6 py-4">
                        62
                    </td>
                    <td className="px-6 py-4">
                        27
                    </td>
                    <td className="px-6 py-4">
                        19
                    </td>
                  
                </tr>
                <tr className="">
                <th scope="row" className="px-6 py-4 font-medium text-white whitespace-nowrap ">
                      XXL 
                    </th>
                    <td className="px-6 py-4">
                        80
                    </td>
                    <td className="px-6 py-4">
                        64
                    </td>
                    <td className="px-6 py-4">
                        27
                    </td>
                    <td className="px-6 py-4">
                        19.5
                    </td>
                  
                </tr>
            </tbody>
        </table>
    </div>
    </ThirdwebProvider>
  );
};

export default ProductPage;
