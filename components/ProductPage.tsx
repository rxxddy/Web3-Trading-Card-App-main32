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
    description: 'Всем трейдерам. Тем кто с нами и тем кто уже покинул нас... Желаем никому не словить ликвид. Все просто - никогда не забывай стоп-лосс!',
    images: [
      'https://d391b93f5f62d9c15f67142e43841acc.ipfscdn.io/ipfs/bafybeig4bcif6bxelhdbnjqlizhlap3g42xjuib54wcl6wljjzw3qm7jd4/31.png',
      'https://d391b93f5f62d9c15f67142e43841acc.ipfscdn.io/ipfs/bafybeig4bcif6bxelhdbnjqlizhlap3g42xjuib54wcl6wljjzw3qm7jd4/11.png',
      'https://d391b93f5f62d9c15f67142e43841acc.ipfscdn.io/ipfs/bafybeig4bcif6bxelhdbnjqlizhlap3g42xjuib54wcl6wljjzw3qm7jd4/31.png',
      'https://d391b93f5f62d9c15f67142e43841acc.ipfscdn.io/ipfs/bafybeig4bcif6bxelhdbnjqlizhlap3g42xjuib54wcl6wljjzw3qm7jd4/11.png',
      'https://d391b93f5f62d9c15f67142e43841acc.ipfscdn.io/ipfs/bafybeig4bcif6bxelhdbnjqlizhlap3g42xjuib54wcl6wljjzw3qm7jd4/31.png',
      
    ],
  },
  {
    name: 'NFT T-Shirt 2',
    description: 'Всем трейдерам. Тем кто с нами и тем кто уже покинул нас... Желаем никому не словить ликвид. Все просто - никогда не забывай стоп-лосс!',
    images: [
      'https://d391b93f5f62d9c15f67142e43841acc.ipfscdn.io/ipfs/bafybeig4bcif6bxelhdbnjqlizhlap3g42xjuib54wcl6wljjzw3qm7jd4/11.png',
      'https://d391b93f5f62d9c15f67142e43841acc.ipfscdn.io/ipfs/bafybeig4bcif6bxelhdbnjqlizhlap3g42xjuib54wcl6wljjzw3qm7jd4/31.png',
      'https://d391b93f5f62d9c15f67142e43841acc.ipfscdn.io/ipfs/bafybeig4bcif6bxelhdbnjqlizhlap3g42xjuib54wcl6wljjzw3qm7jd4/11.png',
      'https://d391b93f5f62d9c15f67142e43841acc.ipfscdn.io/ipfs/bafybeig4bcif6bxelhdbnjqlizhlap3g42xjuib54wcl6wljjzw3qm7jd4/31.png',
      'https://d391b93f5f62d9c15f67142e43841acc.ipfscdn.io/ipfs/bafybeig4bcif6bxelhdbnjqlizhlap3g42xjuib54wcl6wljjzw3qm7jd4/11.png',
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

  useEffect(() => {
    // Set the initial selected image to the first image in the array
    if (selectedProduct && selectedProduct.images.length > 0) {
      setSelectedImage(selectedProduct.images[0]);
    }
  }, [selectedProduct]);

  if (!selectedProduct) {
    // Handle case where product is not found
    return (
      <div>
        <div>Product not found</div>
      </div>
    );
  }

//   edition data

const myEditionDropContractAddress: string = "0xDC8017E1E20BFF80a49B0B92F719f00170013B4F";
const tokenId: string = "0";

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
        <div className="flex justify-center items-start w-2/6 p-6">
            {/* Render the product name and description */}
            <div className=''>
                <div className='text-white text-2xl'>{selectedProduct.name}</div>
                <div className='text-white/90 text-lg'>{selectedProduct.description}</div>
                <div></div>
            </div>
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
    </ThirdwebProvider>
  );
};

export default ProductPage;
