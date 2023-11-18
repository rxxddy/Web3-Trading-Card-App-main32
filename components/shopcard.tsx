import { MediaRenderer, RequiredParam, useContract, useDirectListings } from "@thirdweb-dev/react";
import { MARKETPLACE_ADDRESS, PACK_ADDRESS } from "../const/addresses";
import styles from "../styles/Home.module.css";
import { PackNFTCard } from "../components/PackNFT";

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

  import React from 'react';

import { useMemo, useState, useEffect } from "react";
import { BigNumber, utils } from "ethers";

type ShopCardProps = {
    tokenAddress: string;
    nftimage: string;
    name: string;
  };

export default function ShopCard( { tokenAddress, nftimage, name }: ShopCardProps, ) {
    // const tokenAddress = "0xf8Bb1882230064CC364b65F4cC61A9F4B4F12869";


    return (

        <div className="mx-8 my-10">
            <div className="flex justify-center">
                    <div className="w-[20em] overflow-hidden rounded-md shadow-lg bg-[#252525] ">
                        <div className="relative w-full bg-black">
                            <MediaRenderer
                                src={nftimage}
                                className="object-cover rounded-t-md"
                                style={{width: "100%", height: "100%"}}
                            />
                        </div>
                        <div className="p-4 bg-[#252525] rounded-b-md">
                            <h3 className="text-white text-xl font-semibold mb-2">{name}</h3>
                            
                            <p className="text-white mb-2">Cost: 55$</p>
                            <p className="text-white mb-2">{12}/{150}</p>
                            
                        </div>
                    </div>
                
            </div>
        </div>

    )
}

function parseIneligibility(data: import("@thirdweb-dev/react").ClaimEligibility[], quantity: number): any {
    throw new Error("Function not implemented.");
}
