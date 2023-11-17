import { ThirdwebNftMedia, useAddress, useContract, useOwnedNFTs, Web3Button } from "@thirdweb-dev/react";
import styles from "../styles/Home.module.css";
import { CARD_ADDRESS } from "../const/addresses";
import { useState } from "react";
import type { NFT as NFTType } from "@thirdweb-dev/sdk";
import { ListingInfo } from "../components/ListingInfo";

import { PACK_ADDRESS } from '../const/addresses';
import { PackRewards } from '@thirdweb-dev/sdk';
import { PackRewardCard } from '../components/PackRewardCard';

export default function Profile() {
    const address = useAddress();

    // cards
    const {
        contract: nftCollection,
        isLoading: loadingNFTCollection
    } = useContract(CARD_ADDRESS, "edition");

    const {
        data: nfts,
        isLoading: loadingNFTs
    } = useOwnedNFTs(nftCollection, address);
    console.log(nfts);

    const [selectedNFT, setSelectedNFT] = useState<NFTType>();



    // packs
    const { contract } = useContract(PACK_ADDRESS, "pack");
    const { data, isLoading } = useOwnedNFTs(contract, address);

    const [openPackRewards, setOpenPackRewards] = useState<PackRewards>();


    async function openPack(packId: string) {
        const cardRewards = await contract?.open(parseInt(packId), 1);
        console.log(cardRewards);
        setOpenPackRewards(cardRewards);
    };


    return (
        
        
        <div className="py-2 mt-24">
            <h1 className="text-start ml-6 text-white font-mono sm:text-lg text-sm pb-6">Your NFTs:</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 lg:p-10 gap-4 justify-items-center">
                {!selectedNFT ? (
                    !loadingNFTCollection && !loadingNFTs ? (
                        nfts?.map((nft, index) => (
                            <div key={index} className="w-[20em] overflow-hidden rounded-md shadow-lg bg-[#252525] pb-3">
                                <div className="relative w-full bg-black">
                                    <ThirdwebNftMedia metadata={nft.metadata} />
                                </div>
                                <div className="p-4 bg-[#252525] rounded-b-md">
                                    <h3 className="text-white text-xl font-semibold">{nft.metadata.name}</h3>
                                    <p className="text-white mb-2">Qty: {nft.quantityOwned}</p>
                                    <div className="w-[7em] transform translate-x-[69px] translate-y-[54px] bg-red-900 rounded-md p-1 font-mono text-xs text-white/90">Coming Soon</div>
                                    <div className="flex justify-between">

                                        <div className="p-4 flex justify-center w-3/6 mr-1 font-mono bg-black text-white mt-10 cursor-not-allowed rounded-sm">
                                            <p>Sell</p>
                                        </div>

                                        <button className="p-4 flex justify-center w-3/6 ml-1 font-mono bg-white mt-10 rounded-sm">
                                            Order
                                        </button>

                                    </div>

                                    
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>Loading...</p>
                    )
                ) : (
                    <div className="text-xl text-red-500 font-mono flow justify-center">
                        {/* <div>
                            <button onClick={() => setSelectedNFT(undefined)}>Back</button>
                            <br />
                            <div className="relative w-full bg-black">
                                <ThirdwebNftMedia metadata={selectedNFT.metadata} />
                            </div>
                        </div>
                        <div className="p-4 bg-[#252525] rounded-b-md">
                            <p>List card for sale</p>
                            <ListingInfo nft={selectedNFT} />
                        </div> */}
                        <button onClick={() => setSelectedNFT(undefined)}>Back</button>
                        <div className="text-xl text-red-600 font-mono">ERROR! PLEASE TURN BACK!</div>
                    </div>
                )}
            </div>

            <h1 className="text-start ml-6 text-white font-mono sm:text-lg text-sm mt-12 pb-6">My Packs</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 lg:p-10 gap-4 justify-items-center">
                {!isLoading ? (
                    data?.map((pack, index) => (
                        <div key={index} className="w-[20em] overflow-hidden rounded-md shadow-lg bg-[#252525] pb-7 p-4">
                            <ThirdwebNftMedia
                            metadata={pack.metadata}
                            />
                            <div className="p-4 bg-[#252525] rounded-b-md">
                                <h3 className="text-white text-xl font-semibold">{pack.metadata.name}</h3>
                                <p className="text-white mb-2">Qty: {pack.quantityOwned}</p>
                            </div>
                            <Web3Button
                                contractAddress={PACK_ADDRESS}
                                action={() => openPack(pack.metadata.id)}
                                className="p-4 flex justify-center font-mono bg-white mt-10"
                                style={{width: "100%", backgroundColor: "white", borderRadius: "2px"}}
                            >Open Pack</Web3Button>
                        </div>
                    ))
                    ) : (
                    <p>Loading...</p>
                )}
            </div>
            {openPackRewards && openPackRewards.erc1155Rewards?.length && (

                
                <div className="fixed inset-0 flex items-center justify-center">
                <div
                    className="fixed inset-0 bg-black opacity-50"
                    onClick={() => setOpenPackRewards(undefined)}
                ></div>
                <div className="relative z-50">
                    <div className="flex justify-items-center">
                    {openPackRewards.erc1155Rewards.map((card, index) => (
                        <PackRewardCard reward={card} key={index} />
                    ))}
                    </div>
                </div>
                </div>
            )}


        </div>
    )
};