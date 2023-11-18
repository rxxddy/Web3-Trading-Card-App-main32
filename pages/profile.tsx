import { ThirdwebNftMedia, useAddress, useContract, useOwnedNFTs, Web3Button } from "@thirdweb-dev/react";
import styles from "../styles/Home.module.css";
import { CARD_ADDRESS, SINGLE_DROP_ADDRESS } from "../const/addresses";
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
        contract: cardNftCollection,
        isLoading: loadingCardNFTCollection
    } = useContract(CARD_ADDRESS, "edition");

    const {
        data: cardNfts,
        isLoading: loadingCardNFTs
    } = useOwnedNFTs(cardNftCollection, address);

    // single drop
    const {
        contract: singleDropNftCollection,
        isLoading: loadingSingleDropNFTCollection
    } = useContract(SINGLE_DROP_ADDRESS, "edition");

    const {
        data: singleDropNfts,
        isLoading: loadingSingleDropNFTs
    } = useOwnedNFTs(singleDropNftCollection, address);

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


    const [ModalOpen, setModalOpen] = useState(false);

    const openModal = () => {
      setModalOpen(true);
    };
  
    const closeModal = () => {
      setModalOpen(false);
    };


    return (
        
        
        <div className="py-2 mt-24">
            
                    {ModalOpen && (
                        <div>
                            <div id="default-modal" className="fixed z-50 justify-center items-center ">
                                <div className="relative p-4 w-full max-w-2xl max-h-full">
                                   
                                    <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                                   
                                        <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                                Terms of Service
                                            </h3>
                                            <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="default-modal" onClick={() => setModalOpen(!ModalOpen)}>
                                                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                                                </svg>
                                                <span className="sr-only">Close modal</span>
                                            </button>
                                        </div>
                              
                                        <div className="p-4 md:p-5 space-y-4">
                                            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                                                With less than a month to go before the European Union enacts new consumer privacy laws for its citizens, companies around the world are updating their terms of service agreements to comply.
                                            </p>
                                            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                                                The European Union’s General Data Protection Regulation (G.D.P.R.) goes into effect on May 25 and is meant to ensure a common set of data rights in the European Union. It requires organizations to notify users as soon as possible of high-risk data breaches that could personally affect them.
                                            </p>
                                        </div>
                                    
                                        <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                                            <button data-modal-hide="default-modal" type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 " onClick={() => setModalOpen(!ModalOpen)}>I accept</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div
                                className="fixed inset-0 bg-black opacity-50 w-full h-full"
                                onClick={() => setModalOpen(!ModalOpen)}
                            ></div>
                        </div>
                    )}

            <h1 className="text-start ml-6 text-white font-mono sm:text-lg text-sm pb-6">Your NFTs:</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 lg:p-10 gap-4 justify-items-center">
                {!selectedNFT ? (
                    !loadingCardNFTCollection && !loadingCardNFTs && !loadingSingleDropNFTCollection && !loadingSingleDropNFTs ? (
                        [...(cardNfts ?? []), ...(singleDropNfts ?? [])].map((nft, index) => (
                            <div key={index} className="w-[20em] overflow-hidden rounded-md shadow-lg bg-[#252525] pb-3">
                                <div className="relative w-full bg-black">
                                    <ThirdwebNftMedia metadata={nft.metadata} style={{width: "100%", height: "100%", minWidth: "300px", minHeight: "300px", maxHeight: "300px", objectFit: 'cover'}}/>
                                </div>
                                <div className="p-4 bg-[#252525] rounded-b-md">
                                    <h3 className="text-white text-xl font-semibold">{nft.metadata.name}</h3>
                                    <p className="text-white mb-2">Qty: {nft.quantityOwned}</p>
                                    <div className="w-[7em] transform translate-x-[69px] translate-y-[54px] bg-red-900 rounded-md p-1 font-mono text-xs text-white/90">Coming Soon</div>
                                    <div className="flex justify-between">

                                        <div className="p-4 flex justify-center w-3/6 mr-1 font-mono bg-black text-white mt-10 cursor-not-allowed rounded-sm">
                                            <p>Sell</p>
                                        </div>

                                        <button className="p-4 flex justify-center w-3/6 ml-1 font-mono bg-white mt-10 rounded-sm" onClick={() => setModalOpen(!ModalOpen)}>
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