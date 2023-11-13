import { MARKETPLACE_ADDRESS, PACK_ADDRESS } from "../const/addresses";
import { MediaRenderer, Web3Button, useAddress, useContract, useDirectListings, useNFT } from "@thirdweb-dev/react";
import styles from "../styles/Home.module.css";

type Props = {
    contractAddress: string;
    tokenId: any;
};

export const PackNFTCard = ({ contractAddress, tokenId }: Props) => {
    const address = useAddress();

    const { contract: marketplace, isLoading: loadingMarketplace } = useContract(MARKETPLACE_ADDRESS, "marketplace-v3");
    const { contract: packContract } = useContract(contractAddress);
    const { data: packNFT, isLoading: loadingNFT } = useNFT(packContract, tokenId);


    const { data: packListings, isLoading: loadingPackListings } = 
    useDirectListings(
        marketplace,
        {
            tokenContract: PACK_ADDRESS,
        }
    );
    console.log("Pack Listings: ", packListings);

    async function buyPack() {
        let txResult;

        if (packListings?.[tokenId]) {
            txResult = await marketplace?.directListings.buyFromListing(
                packListings[tokenId].id,
                1
            )
        } else {
            throw new Error("No valid listing found");
        }
            
        return txResult;
    };

    return (
        <div className="p-6 flex justify-center sm:block">
            {!loadingNFT && !loadingPackListings ? (
                <div className="flex">
                    <div className="w-[20em] overflow-hidden rounded-md shadow-lg bg-[#252525] ">
                        <div className="relative h-80 p-2 bg-black">
                            <MediaRenderer
                                src={packNFT?.metadata.image}
                                className="object-cover w-full h-full rounded-t-md py-6"
                            />
                        </div>
                        <div className="p-4 bg-[#252525] rounded-b-md">
                            <h3 className="text-white text-xl font-semibold mb-2">{packNFT?.metadata.name}</h3>
                            
                            <p className="text-white mb-2">Cost: {packListings![tokenId].currencyValuePerToken.displayValue} {` ` + packListings![tokenId].currencyValuePerToken.symbol}</p>
                            <p className="text-white mb-2">Supply: {packListings![tokenId].quantity}</p>
                            {!address ? (
                                <p className="text-white mb-2">Login to buy</p>
                            ) : (
                                
                                <div className="w-full mt-10">
                                        <Web3Button
                                        style={{width: "100%"}}
                                        contractAddress={MARKETPLACE_ADDRESS}
                                        action={() => buyPack()}
                                        className="bg-yellow-300 text-white px-4 py-2 rounded-md hover:bg-yellow-500 focus:outline-none focus:shadow-outline-blue active:bg-yellow-500 ">
                                            Buy Pack
                                        </Web3Button>
                                </div>

                                
                            )}
                        </div>
                    </div>
                    {/* <div className="w-[20em] overflow-hidden rounded-md shadow-lg bg-[#252525] ">
                        <div className="relative h-80 p-2 bg-black">
                            <MediaRenderer
                                src={packNFT?.metadata.image}
                                className="object-cover w-full h-full rounded-t-md py-6"
                            />
                        </div>
                        <div className="p-4 bg-[#252525] rounded-b-md">
                            <h3 className="text-white text-xl font-semibold mb-2">{packNFT?.metadata.name}</h3>
                            
                            <p className="text-white mb-2">Cost: {packListings![tokenId].currencyValuePerToken.displayValue} {` ` + packListings![tokenId].currencyValuePerToken.symbol}</p>
                            <p className="text-white mb-2">Supply: {packListings![tokenId].quantity}</p>
                            {!address ? (
                                <p className="text-white mb-2">Login to buy</p>
                            ) : (
                                
                                <div className="w-full mt-10">
                                        <Web3Button
                                        style={{width: "100%"}}
                                        contractAddress={MARKETPLACE_ADDRESS}
                                        action={() => buyPack()}
                                        className="bg-yellow-300 text-white px-4 py-2 rounded-md hover:bg-yellow-500 focus:outline-none focus:shadow-outline-blue active:bg-yellow-500 ">
                                            Buy Pack
                                        </Web3Button>
                                </div>

                                
                            )}
                        </div>
                    </div> */}
                </div>
            ) : (
                <p>.</p>
            )}

        </div>
        



    )
};