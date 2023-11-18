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


const activeChain = "mumbai";

const shopItems = [
  {
    name: 'NFT T-Shirt 1',
    id: 0,
    description: 'Всем трейдерам. Тем кто с нами и тем кто уже покинул нас... Желаем никому не словить ликвид. Все просто - никогда не забывай стоп-лосс!',
    images: [
      'https://thesybilmarket.vercel.app/31.png',
      'https://thesybilmarket.vercel.app/41.png',
      'https://thesybilmarket.vercel.app/31.png',
      'https://thesybilmarket.vercel.app/41.png',
      'https://thesybilmarket.vercel.app/31.png',
      
    ],
  },
  {
    name: 'NFT T-Shirt 2',
    id: 1,
    description: 'Всем трейдерам. Тем кто с нами и тем кто уже покинул нас... Желаем никому не словить ликвид. Все просто - никогда не забывай стоп-лосс!',
    images: [
      'https://thesybilmarket.vercel.app/41.png',
      'https://thesybilmarket.vercel.app/31.png',
      'https://thesybilmarket.vercel.app/41.png',
      'https://thesybilmarket.vercel.app/31.png',
      'https://thesybilmarket.vercel.app/41.png',
    ],
  },
  // Add more products as needed
];

const ProductPage = () => {
  const router = useRouter();
  const { productName } = router.query;

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
      console.log("This is ID", tokenId);
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

const myEditionDropContractAddress: string = "0x3FCcBBe57D72E9D43c631D8D5f4fC7CE131D139E";
// const tokenId: string = "0";

const address = useAddress();
const [quantity, setQuantity] = useState(1);
const { contract: editionDrop } = useContract(myEditionDropContractAddress);
const { data: contractMetadata } = useContractMetadata(editionDrop);

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

  return (
    <ThirdwebProvider activeChain={activeChain} clientId="9e4314f9cb80713a98f3221cfb883eaf">
      <div className="w-full flex justify-center mt-[6em]">
        <div className="grid text-white justify-center items-start w-2/6 p-6">
            {/* Render the product name and description */}
            <div className="flex flex-col justify-start items-center">
              <div className=''>
                  <div className='text-white text-2xl'>{selectedProduct.name}</div>
                  <div className='text-white/90 text-lg'>{selectedProduct.description}</div>
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
                  <div className='mt-24'>
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
                            className='p-1 rounded-lg mt-3 bg-slate-600 w-10 h-10 flex justify-center items-center'
                            onClick={() => setQuantity(quantity - 1)}
                            disabled={quantity <= 1}
                          >
                            -
                          </button>

                          <h4 className='p-1 rounded-lg my-3 bg-slate-700 w-full h-10 flex justify-center items-center'>{quantity}</h4>

                          <button
                            className='p-1 rounded-lg my-3 bg-slate-600 w-10 h-10 flex justify-center items-center'
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
                                alert("Successfully claimed NFTs");
                              }}
                            >
                              {buttonLoading ? "Loading..." : buttonText}
                            </Web3Button>
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
        <div className="grid gap-4 justify-center w-2/6">
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
          <div className="grid grid-cols-5 gap-4">
            {/* Render the product images */}
            {selectedProduct.images.map((image, index) => (
              <div key={index} onClick={() => setSelectedImage(image)}>
                <img
                  className="h-auto max-w-full rounded-lg"
                  src={image}
                  alt={`Product ${index + 1}`}
                />
              </div>
            ))}
          </div>
        </div>
        
      </div>

      {/* grrg */}



    </ThirdwebProvider>
  );
};

export default ProductPage;
