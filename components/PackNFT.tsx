import { MARKETPLACE_ADDRESS, PACK_ADDRESS } from "../const/addresses";
import { MediaRenderer, Web3Button, useAddress, useContract, useDirectListings, useNFT } from "@thirdweb-dev/react";
import styles from "../styles/Home.module.css";

type Props = {
    contractAddress: string;
    tokenId: any;
};

export const PackNFTCard = () => {

    return (
        <div className="p-6 flex justify-center sm:block">   
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 justify-items-center">
                    <div className="w-[20em] overflow-hidden rounded-md shadow-lg bg-[#252525] ">
                        <div className="relative h-80 p-2 bg-[#303030]">
                            <MediaRenderer
                                src="https://thesybilmarket.vercel.app/Tube.png"
                                className="object-cover w-full h-full rounded-t-md py-6"
                            />
                        </div>
                        <div className="p-4 bg-[#252525] rounded-b-md">
                            <h3 className="text-white text-xl font-semibold mb-2">Hoodie Pack</h3>
                            
                            <p className="text-white mb-2">Cost: ???</p>
                            <p className="text-white mb-2">Supply: ???</p>
                            <div className="w-full mt-10">
                                <div className="bg-red-800 text-white px-4 py-2 rounded-md focus:outline-none focus:shadow-outline-blue  cursor-not-allowed">
                                    Coming soon
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-[20em] overflow-hidden rounded-md shadow-lg bg-[#252525] ">
                        <div className="relative h-80 p-2 bg-[#303030]">
                            <MediaRenderer
                                src="https://thesybilmarket.vercel.app/Tube.png"
                                className="object-cover w-full h-full rounded-t-md py-6"
                            />
                        </div>
                        <div className="p-4 bg-[#252525] rounded-b-md">
                            <h3 className="text-white text-xl font-semibold mb-2">Costume Pack</h3>
                            <p className="text-white mb-2">Cost: ???</p>
                            <p className="text-white mb-2">Supply: ???</p> 
                            <div className="w-full mt-10">
                                <div className="bg-red-800 text-white px-4 py-2 rounded-md focus:outline-none focus:shadow-outline-blue cursor-not-allowed">
                                    Coming soon
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-[20em] overflow-hidden rounded-md shadow-lg bg-[#252525] ">
                        <div className="relative h-80 p-2 bg-[#303030]">
                            <MediaRenderer
                                src="https://thesybilmarket.vercel.app/Tube.png"
                                className="object-cover w-full h-full rounded-t-md py-6"
                            />
                        </div>
                        <div className="p-4 bg-[#252525] rounded-b-md">
                            <h3 className="text-white text-xl font-semibold mb-2">Mix Pack</h3>
                            <p className="text-white mb-2">Cost: ???</p>
                            <p className="text-white mb-2">Supply: ???</p> 
                            <div className="w-full mt-10">
                                <div className="bg-red-800 text-white px-4 py-2 rounded-md focus:outline-none focus:shadow-outline-blue cursor-not-allowed">
                                    Coming soon
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
        </div>

    )
};