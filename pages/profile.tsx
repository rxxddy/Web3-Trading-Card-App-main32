import { ThirdwebNftMedia, useAddress, useContract, useOwnedNFTs, Web3Button } from "@thirdweb-dev/react";
import { CARD_ADDRESS, SINGLE_DROP_ADDRESS } from "../const/addresses";
import type { NFT as NFTType } from "@thirdweb-dev/sdk";
import { BigNumber, utils } from "ethers";
import { useState, useEffect } from "react";
import { useContractWrite } from "@thirdweb-dev/react";

export default function Profile() {
    const address = useAddress();
    const currentAddress = address;
    const tokenAddress = "0xAE844Bc15fc76F647E4D285d5e6e67dB2b0D1fcf";

    const [quantity, setQuantity] = useState(1);
    const [referralAddress, setReferralAddress] = useState('');
    const [reffs, setReffs] = useState<number>(0);
    const [isNFTid, setisNFTid] = useState('0');
    const [referralError, setReferralError] = useState("");

    const [fio, setfio] = useState('');
    const [phone, setphone] = useState('');
    const [homeAddress, setHomeAddress] = useState('');
    const [email, setEmail] = useState('');
    const [size, setSize] = useState('');
    const [isFormValid, setIsFormValid] = useState(false);
    
    const [ModalOpen, setModalOpen] = useState(false);
    const [selectedNFT, setSelectedNFT] = useState<NFTType>();

    const { contract: cardNftCollection, isLoading: loadingCardNFTCollection } = useContract(CARD_ADDRESS, "edition");
    const { data: cardNfts, isLoading: loadingCardNFTs } = useOwnedNFTs(cardNftCollection, address);
    
    const { contract: singleDropNftCollection, isLoading: loadingSingleDropNFTCollection } = useContract(SINGLE_DROP_ADDRESS, "edition");
    const { data: singleDropNfts, isLoading: loadingSingleDropNFTs } = useOwnedNFTs(singleDropNftCollection, address);

    const { contract } = useContract(SINGLE_DROP_ADDRESS, "edition");
    const { mutateAsync } = useContractWrite(contract, "burnBatch");

    // --- API LOGIC (SAFE) ---
    useEffect(() => {
        if (currentAddress) {
            fetch(`/api/get-sheets-data?address=${currentAddress}`)
                .then(res => res.json())
                .then(data => {
                    if (data.referrals !== undefined) setReffs(data.referrals);
                })
                .catch(err => console.error(err));
        }
    }, [currentAddress]);

    const writeToGoogleSheets = async (data: { fio: string, phone: string, homeAddress: string, email: string, size: string }) => {
        if (!data.fio || !data.phone || !data.homeAddress || !data.email || !data.size) {
            console.error("Fill in all fields");
            return;
        }

        const formattedDate = new Date().toISOString();

        try {
            const response = await fetch('/api/write-sheets-data', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'delivery',
                    user_address: currentAddress,
                    user_fio: data.fio,
                    user_phone: data.phone,
                    homeAddress: data.homeAddress,
                    email: data.email,
                    nft_id: isNFTid,
                    user_size: data.size,
                    user_data: formattedDate
                }),
            });

            if (response.ok) {
                console.log('Data written to Google Sheets via API.');
                setModalOpen(false);
                setfio(''); setphone(''); setHomeAddress(''); setEmail(''); setSize('');
            } else {
                console.error('Server Error');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleFormSubmit = async (event: any) => {
        event.preventDefault();
        await writeToGoogleSheets({ fio, phone, homeAddress, email, size });
    };

    return (
        <div className="py-2 mt-24">
            {/* MODAL */}
            {ModalOpen && (
                <div className="absolute inset-0 flex items-center justify-center z-[9999]">
                    <div id="default-modal" className="fixed z-50 justify-center items-center w-full sm:w-[30em] top-20">
                        <div className="relative p-4 w-full max-w-2xl max-h-full">
                            <div className="relative bg-gray-700 rounded-lg shadow">
                                
                                {/* Header */}
                                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
                                    <div>
                                        <h3 className="text-xl font-semibold text-white/90">Delivery</h3>
                                        <p className="font-semibold text-white/90 text-xs mt-4 text-justify">
                                           After you fill in the information fields and sign the transaction, your NFT will be burned and we will send you an email.
                                        </p>
                                    </div>
                                    <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-white/90 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center" onClick={() => setModalOpen(false)}>
                                        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                                        </svg>
                                    </button>
                                </div>

                                {/* Body */}
                                <div className="p-4 md:p-5 space-y-4">
                                    <div className="mb-6">
                                        <label htmlFor="user_fio" className="block mb-2 text-sm font-medium text-white/90">Name</label>
                                        <input type="text" id="user_fio" className="bg-gray-50 border border-gray-300 text-gray-700 text-sm rounded-lg block w-full p-2.5" placeholder="Иванов Иван Иванович" value={fio} onChange={(e) => setfio(e.target.value)} required />
                                    </div>

                                    <div className="grid gap-6 mb-6 md:grid-cols-2">
                                        <div>
                                            <label htmlFor="user_phone" className="block mb-2 text-sm font-medium text-white/90">Phone</label>
                                            <input type="text" id="user_phone" className="bg-gray-50 border border-gray-300 text-gray-700 text-sm rounded-lg block w-full p-2.5" placeholder="88005553535" value={phone} onChange={(e) => setphone(e.target.value)} required />
                                        </div>
                                        <div>
                                            <label htmlFor="email" className="block mb-2 text-sm font-medium text-white/90">Email</label>
                                            <input type="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-700 text-sm rounded-lg block w-full p-2.5" placeholder="email@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                                        </div>
                                    </div>

                                    <div className="mb-6">
                                        <label htmlFor="homeAddress" className="block mb-2 text-sm font-medium text-white/90">Address</label>
                                        <input type="text" id="homeAddress" className="bg-gray-50 border border-gray-300 text-gray-700 text-sm rounded-lg block w-full p-2.5" placeholder="Адрес доставки" value={homeAddress} onChange={(e) => setHomeAddress(e.target.value)} required />
                                    </div>

                                    <div className="mb-6">
                                        <label htmlFor="user_size" className="block mb-2 text-sm font-medium text-white/90">Size</label>
                                        <input type="text" id="size" className="bg-gray-50 border border-gray-300 text-gray-700 text-sm rounded-lg block w-full p-2.5" placeholder="XS/S/M/L/XL/XXL" value={size} onChange={(e) => setSize(e.target.value)} required />
                                    </div>

                                    <div className="flex items-start mb-6">
                                        <div className="flex items-center h-5">
                                            <input id="remember" type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50" required />
                                        </div>
                                        <label htmlFor="remember" className="ms-2 text-sm font-medium text-white/90">
                                            Agree с <a href="https://discord.gg/mTZGgkCQ83" className="text-blue-600 hover:underline">rules and policies</a>
                                        </label>
                                    </div>

                                    {/* Action Button */}
                                    <Web3Button
                                        contractAddress={SINGLE_DROP_ADDRESS}
                                        action={async () => mutateAsync({ args: [address, [isNFTid], [1]] })}
                                        onSuccess={() => writeToGoogleSheets({ fio, phone, homeAddress, email, size })}
                                        onError={(err) => console.error("Burn failed", err)}
                                    >
                                        Delivery
                                    </Web3Button>
                                    
                                    {isFormValid && <div className="text-red-500 mt-2">Form is not valid</div>}
                                </div>
                            </div>
                        </div>
                        <div className="fixed inset-0 bg-black opacity-50 h-[100vh]" onClick={() => setModalOpen(false)}></div>
                    </div>
                </div>
            )}

            <h1 className="text-start ml-6 text-white font-mono sm:text-lg text-sm pb-6">Your NFTs:</h1>
            
            {/* GRID OF NFTS */}
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
                                    <p className="text-white mb-2">id: {nft.metadata.id}</p>
                                    <div className="w-[7em] transform translate-x-[69px] translate-y-[54px] bg-red-900 rounded-md p-1 font-mono text-xs text-white/90">Coming Soon</div>
                                    <div className="flex justify-between">
                                        <div className="p-4 flex justify-center w-3/6 mr-1 font-mono bg-black text-white mt-10 cursor-not-allowed rounded-sm">
                                            <p>Sell</p>
                                        </div>
                                        <button className="p-4 flex justify-center w-3/6 ml-1 font-mono bg-white mt-10 rounded-sm" onClick={() => {
                                            setisNFTid(nft.metadata.id)
                                            setModalOpen(true);
                                        }}>
                                            Delivery
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <h1 className="flex justify-center w-full my-24"><p className="mb-10 text-white">Loading... </p></h1>
                    )
                ) : (
                    <div className="text-xl text-red-600 font-mono">ERROR! PLEASE TURN BACK! <button onClick={() => setSelectedNFT(undefined)}>Back</button></div>
                )}
            </div>

            <h1 className="text-start ml-6 text-white font-mono sm:text-lg text-sm mt-12 pb-6">My Packs</h1>
            <h1 className="flex justify-center w-full my-24"><p className="mb-10 text-white">Packs are coming soon </p></h1>
        </div>
    );
};