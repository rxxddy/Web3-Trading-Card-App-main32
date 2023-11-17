import { useContract, useDirectListings } from "@thirdweb-dev/react";
import { MARKETPLACE_ADDRESS, PACK_ADDRESS } from "../const/addresses";
import styles from "../styles/Home.module.css";
import { PackNFTCard } from "../components/PackNFT";
import Link from "next/link";

import {
    useActiveClaimConditionForWallet,
    useAddress,
    useClaimConditions,
    useClaimerProofs,
    useClaimIneligibilityReasons,
    useContractMetadata,
    useTokenSupply,
    Web3Button,
  } from "@thirdweb-dev/react";

import { useMemo, useState, useEffect } from "react";
import { BigNumber, utils } from "ethers";

import ShopCard from "../components/shopcard";

export default function Shop() {
    const shopItems = [
        {
          tokenAddress: '0xf8Bb1882230064CC364b65F4cC61A9F4B4F12869',
          imageUrl: 'https://thesybilmarket.vercel.app/31.png',
          name: 'NFT T-Shirt 1',
        },
        {
          tokenAddress: '0xf8Bb1882230064CC364b65F4cC61A9F4B4F12869',
          imageUrl: 'https://thesybilmarket.vercel.app/41.png',
          name: 'NFT T-Shirt 2',
        },
        
        // Add more items as needed
      ];

    return (
      <div className="py-2 mt-12 flex justify-center">
      <h1>Shop</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:p-10 gap-4">
        {shopItems.map((item, index) => (
          <Link key={index} href={`/${encodeURIComponent(item.name.replace(/\s+/g, '-'))}`}>
            
              <ShopCard
                tokenAddress={item.tokenAddress}
                nftimage={item.imageUrl}
                name={item.name}
              />
            
          </Link>
        ))}
      </div>
    </div>
    )
};

function parseIneligibility(data: import("@thirdweb-dev/react").ClaimEligibility[], quantity: number): any {
    throw new Error("Function not implemented.");
}
