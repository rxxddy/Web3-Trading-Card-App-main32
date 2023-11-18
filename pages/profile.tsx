import { ThirdwebNftMedia, useAddress, useContract, useOwnedNFTs, Web3Button } from "@thirdweb-dev/react";
import styles from "../styles/Home.module.css";
import { CARD_ADDRESS, SINGLE_DROP_ADDRESS } from "../const/addresses";
import type { NFT as NFTType } from "@thirdweb-dev/sdk";
import { ListingInfo } from "../components/ListingInfo";

import { PACK_ADDRESS } from '../const/addresses';
import { PackRewards } from '@thirdweb-dev/sdk';
import { PackRewardCard } from '../components/PackRewardCard';


  import { BigNumber, utils } from "ethers";
  import Image from "next/image";
  import { useMemo, useState, useEffect } from "react";
  import { parseIneligibility } from "../utils/parseIneligibility";
  import creds from './cred/credentials.json';
  import { GoogleSpreadsheet } from 'google-spreadsheet';
  import { JWT } from 'google-auth-library';
  
  // import dotenv from "dotenv";
  // import path from "path";
  
  // dotenv.config({ path: path.resolve(__dirname, "../.env") });

export default function Profile() {


    const tokenAddress = "0xf8Bb1882230064CC364b65F4cC61A9F4B4F12869";

    // console.log('FIRST COLSOLE LOG', address)
    const [quantity, setQuantity] = useState(1);
    // const { data: contractMetadata } = useContractMetadata(contract);
    const [referralAddress, setReferralAddress] = useState('');
    const successText = 'text logs only after success';
    const [reffs, setReffs] = useState<number>(0);
    const [referralError, setReferralError] = useState("");
    
    const address = useAddress();
    const currentAddress = address;

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


    // console.log('Private Key:', process.env.GOOGLE_SHEETS_KEY);

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
      
        const doc = new GoogleSpreadsheet('15Q3_nYP6h1PKJFAiw79enMeFEcRNtKb1tUY9pg7X5VY', serviceAccountAuth);
      
        try {
          console.log('Attempting to authorize...');
          await serviceAccountAuth.authorize();
          console.log('Authorization successful.');
      
          console.log('Loading document info...');
          await doc.loadInfo();
          console.log('Document info loaded.');
      
          const sheet = doc.sheetsByIndex[2];
          console.log('Sheet loaded.');
      
          const dataToWrite = {
            address: referralAddress,
            maxClaimable: 1,
          };
      
          const rows = await sheet.getRows();
      
          const existingRow = rows.find((row) => row.get('address') === referralAddress);
          console.log('existingRow', existingRow);
      
          if (existingRow) {
            const currentAmount = Number(existingRow.get('maxClaimable'));
            existingRow.set('maxClaimable', currentAmount + 1);
            await existingRow.save();
          } else {
            await sheet.addRow(dataToWrite);
          }
      
          console.log('Data written to Google Sheets.');
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
        
        const doc = new GoogleSpreadsheet('15Q3_nYP6h1PKJFAiw79enMeFEcRNtKb1tUY9pg7X5VY', serviceAccountAuth);
      
        try {
          console.log('Attempting to authorize...');
          try {
            await serviceAccountAuth.authorize();
          } catch (error) {
            console.error('Error during authorization:', error);
          }
          console.log('Authorization successful.');
          console.log('Loading document info...');
          await doc.loadInfo();
          console.log('Document info loaded.');
          const sheetIndexToWriteTo = 2;
          const sheet = doc.sheetsByIndex[sheetIndexToWriteTo];
        
          if (!sheet) {
            console.error(`Sheet with index ${sheetIndexToWriteTo} not found.`);
            return;
          }
          console.log('Sheet loaded.');
          const rows = await sheet.getRows();
          console.log('IERNONIGR', currentAddress)
          const matchingRow = await rows.find(async (row) => row.get('address') === currentAddress);
          console.log('matchingRow', matchingRow);
          console.log('IERNONIGR', currentAddress);
          const findMatchingRow = async () => {
            const matchingRow = await Promise.all(rows.map(async (row) => {
              const wallet = await row.get('address');
              const referrals = await row.get('maxClaimable');
              if (wallet === currentAddress) {
                console.log('Matching Wallet:', wallet);
                console.log('Amount of Referrals:', referrals);
                setReffs(referrals);
                return true;
              }
              return false;
            }));
            if (!matchingRow.includes(true)) {
              console.log('No matching row found.');
              console.log('Loaded sheets:', doc.sheetsByIndex.map(sheet => sheet.title));
            }
          };
          findMatchingRow();
          if (matchingRow) {
            const amount = Number(matchingRow.get('maxClaimable'));
            console.log('AMAAAAAAAAAAAAAAAUNT', amount);
          } else {
            console.log('No matching row found');
          }
          console.log(matchingRow);
          console.log('Data written to Google Sheets.');
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
        console.log(referralData);
        console.log(successText);
        writeToGoogleSheets(referralAddress);
      };


    return (
        
        
        <div className="py-2 mt-24">
            
                    {ModalOpen && (
                        <div className="absolute inset-0 flex items-center justify-center z-9999 ">
                            <div id="default-modal" className="fixed z-50 justify-center items-center w-full sm:w-[30em]">
                                <div className="relative p-4 w-full max-w-2xl max-h-full">
                                   
                                    <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                                   
                                        <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                                Terms of Service
                                            </h3>
                                            <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="default-modal" onClick={() => setModalOpen(!ModalOpen)}>
                                                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                                                </svg>
                                                <span className="sr-only">Close modal</span>
                                            </button>
                                        </div>
                              
                                        <div className="p-4 md:p-5 space-y-4">
                                            <input
                                                type="text"
                                                placeholder="Your referral"
                                                value={referralAddress}
                                                onChange={(e) => {
                                                    const inputValue = e.target.value;
                                                    setReferralAddress(inputValue);

                                                    // Validation checks
                                                    if (inputValue !== "" && !inputValue.startsWith("0x")) {
                                                    setReferralError("Referral address must start with '0x'");
                                                    } else if (inputValue !== "" && inputValue.length !== 42) {
                                                    setReferralError("Referral address must be 42 characters long");
                                                    } else if (inputValue !== "" && inputValue === currentAddress) {
                                                    setReferralError("Referral address cannot be the same as the current address");
                                                    } else {
                                                    setReferralError(""); // Clear error if input is valid or empty
                                                    }
                                                }}
                                                className={`w-[100%] bg-transparent border border-gray-300 rounded-lg text-white h-12 px-4 text-base mb-0 ${referralError ? "border-red-500" : ""}`}
                                            />
                                            {referralError && <div className="text-red-500">{referralError}</div>}
                                            
                                        </div>
                                    
                                        <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                                            <button onClick={() => {
                                                setModalOpen(!ModalOpen);
                                                handleButtonClick();
                                            }} 
                                            data-modal-hide="default-modal" type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 " >I accept</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div
                                className="fixed inset-0 bg-black opacity-50 w-[100vh] h-[100vh]"
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