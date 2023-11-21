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
  import { GoogleSpreadsheet } from 'google-spreadsheet';
  import { JWT } from 'google-auth-library';
  import { useContractWrite } from "@thirdweb-dev/react";


  
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
    const [isNFTid, setisNFTid] = useState('0')
    const [referralError, setReferralError] = useState("");
    const [isContract, setisContract] = useState([]);

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [homeAddress, setHomeAddress] = useState('');
    const [email, setEmail] = useState('');
    const [isFormValid, setIsFormValid] = useState(false);
    const [size, setSize] = useState('');
    
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


    const { contract } = useContract(SINGLE_DROP_ADDRESS, "edition");
    
    const { mutateAsync, error } = useContractWrite(contract, "burnBatch");
    // packs
    // const { contract } = useContract(PACK_ADDRESS, "pack");
    const { data, isLoading } = useOwnedNFTs(contract, address);

    const [openPackRewards, setOpenPackRewards] = useState<PackRewards>();


    // async function openPack(packId: string) {
    //     const cardRewards = await contract?.open(parseInt(packId), 1);
    //     console.log(cardRewards);
    //     setOpenPackRewards(cardRewards);
    // };


    const [ModalOpen, setModalOpen] = useState(false);

    const openModal = () => {
      setModalOpen(true);
    };
  
    const closeModal = () => {
      setModalOpen(false);
    };


    // console.log('Private Key:', process.env.GOOGLE_SHEETS_KEY);

    const writeToGoogleSheets = async ({ firstName, lastName, homeAddress, email, size }: { firstName: string, lastName: string, homeAddress: string, email: string, size: string }) => {
        // Check if referralAddress is empty/
        if (!firstName || !lastName || !homeAddress || !email || !size) {
          // Do nothing if any field is empty
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
      
          const sheet = doc.sheetsByIndex[3];
          console.log('Sheet loaded.');
      
          const dataToWrite = {
            user_address: currentAddress || 'DefaultUserAddress',
            first_name: firstName,
            last_name: lastName,
            homeAddress: homeAddress,
            email: email,
            nft_id: isNFTid,
            user_size: size,
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
          const sheetIndexToWriteTo = 3;
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

    //  const handleButtonClick = async () => {
    //     addOrUpdateReferral(referralAddress); // Update referral data array
    //     console.log(referralData);
    //     console.log(successText);
    //     writeToGoogleSheets(referralAddress);
    //   };

      // const handleFormSubmit = async (event: { preventDefault: () => void; target: any; }) => {
      //   event.preventDefault(); // Prevents the default form submission behavior
    
      //   // Check form validity before processing the form data
      //   const form = event.target;
      //   if (form.checkValidity()) {
      //     // Your form submission logic goes here
      //     setModalOpen(!ModalOpen);

      //   const firstName = event.target.elements.first_name.value;
      //   const lastName = event.target.elements.last_name.value;
      //   const homeAddress = event.target.elements.homeAddress.value;
      //   const email = event.target.elements.email.value;
      
      //   // Call writeToGoogleSheets function with the collected data
      //   await writeToGoogleSheets({
      //     firstName,
      //     lastName,
      //     homeAddress,
      //     email,
      //   });
      
      //   // Optionally, you can reset the form after submission
      //   event.target.reset();

      //   } else {
      //     // If the form is not valid, you can show an error message or take other actions
      //     console.log('Form is not valid');
      //   }
      // };

      const [web3ButtonSuccess, setWeb3ButtonSuccess] = useState(false);
      // const [isFormValid, setIsFormValid] = useState(false);

      const handleFormSubmit = async (event: { preventDefault: () => void; target: any; }) => {
        event.preventDefault(); // Prevents the default form submission behavior
    
      // Check form validity before processing the form data
      const form = event.target;
      if (form.checkValidity() && web3ButtonSuccess) {
        // Your form submission logic goes here
        const firstName = event.target.elements.first_name.value;
        const lastName = event.target.elements.last_name.value;
        const homeAddress = event.target.elements.homeAddress.value;
        const email = event.target.elements.email.value;
        const size = event.target.elements.user_size.value;

        // Optionally, you can reset the form after submission
        event.target.reset();

        // Call writeToGoogleSheets function with the collected data
        await writeToGoogleSheets({
          firstName,
          lastName,
          homeAddress,
          email,
          size,
        });

        // Set modal open or perform other actions on form submission success
        setModalOpen(!ModalOpen);
        setIsFormValid(false); // Reset the form validity for the next submission
      } else {
        // If the form is not valid or Web3 button is not successful, you can show an error message or take other actions
        setIsFormValid(true); // Set the form validity state for error indication
        console.log('Form is not valid or Web3 button is not successful');
      }
      };

  const handleWeb3ButtonSuccess = () => {
    // Set the state to indicate that the Web3 button was successful
    setWeb3ButtonSuccess(true);

    // You can perform additional actions here if needed
    // ...
  };

  const handleButtonClick = async () => {
    // Your handleButtonClick logic here
    // ...

    writeToGoogleSheets({ firstName, lastName, homeAddress, email, size });
    setModalOpen(!ModalOpen);
  };


    return (
        
        
        <div className="py-2 mt-24">
            
                    {ModalOpen && (
                        <div className="absolute inset-0 flex items-center justify-center z-9999 ">
                            <div id="default-modal" className="fixed z-50 justify-center items-center w-full sm:w-[30em]">
                                <div className="relative p-4 w-full max-w-2xl max-h-full">
                                   
                                    <div className="relative bg-gray-700 rounded-lg shadow">
                                   
                                        <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                                            <div>
                                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                                Оформление Доставки
                                            </h3> 
                                            <p className=" font-semibold text-gray-900 dark:text-white text-xs mt-4 text-justify">
                                                После того как вы заполните поля информации и подпишите транзакцию - ваша нфт будет сожжена и мы направим вам письмо на почту с подтверждением заказа и номером отслеживания доставки
                                            </p>
                                            </div>
                                            <div className="h-full self-start">
                                              <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="default-modal" onClick={() => setModalOpen(!ModalOpen)}>
                                                  <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                                                  </svg>
                                                  <span className="sr-only">Close modal</span>
                                              </button>
                                            </div>
                                        </div>
                              
                                        <div className="p-4 md:p-5 space-y-4">
                                        <div className="grid gap-6 mb-6 md:grid-cols-2">
                                          <div>
                                            <label htmlFor="first_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                              Имя
                                            </label>
                                            <input
                                              type="text"
                                              id="first_name"
                                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                              placeholder="Dave"
                                              value={firstName}
                                              onChange={(e) => setFirstName(e.target.value)}
                                              required
                                            />
                                          </div>
                                          <div>
                                            <label htmlFor="last_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                              Фамилия
                                            </label>
                                            <input
                                              type="text"
                                              id="last_name"
                                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                              placeholder="Cooper"
                                              value={lastName}
                                              onChange={(e) => setLastName(e.target.value)}
                                              required
                                            />
                                          </div>
                                        </div>

                                        <div className="mb-6">
                                          <label htmlFor="homeAddress" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                            Адрес
                                          </label>
                                          <input
                                            type="text"
                                            id="homeAddress"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            placeholder="ул. Большая Дмитровка, 13, Москва"
                                            value={homeAddress}
                                            onChange={(e) => setHomeAddress(e.target.value)}
                                            required
                                          />
                                        </div>

                                        <div className="mb-6">
                                          <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                            Почта
                                          </label>
                                          <input
                                            type="email"
                                            id="email"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            placeholder="youremail@email.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                          />
                                        </div>
                                        <div>
                                            <label htmlFor="user_size" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                              Размер
                                            </label>
                                            <input
                                              type="text"
                                              id="size"
                                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                              placeholder="XS/S/M/L"
                                              value={size}
                                              onChange={(e) => setSize(e.target.value)}
                                              required
                                            />
                                          </div>

                                        <div className="flex items-start mb-6">
                                          <div className="flex items-center h-5">
                                            <input
                                              id="remember"
                                              type="checkbox"
                                              value=""
                                              className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800"
                                              required
                                            />
                                          </div>
                                          <label htmlFor="remember" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                                            Я согласен с {' '}
                                            <a href="#" className="text-blue-600 hover:underline dark:text-blue-500">
                                              правилами и политикой
                                            </a>
                                          </label>
                                        </div>

                                        <Web3Button
                                          contractAddress={SINGLE_DROP_ADDRESS}
                                          action={async () => mutateAsync({
                                            args: [address, [isNFTid], [1]],
                                          })}

                                          onSuccess={() => writeToGoogleSheets({ firstName, lastName, homeAddress, email, size })}
                                          
                                        >
                                          Send Transaction
                                        </Web3Button>

                                        {isFormValid && <div className="text-red-500">Form is not valid or Web3 button is not successful</div>}
                                      </div>
                                    
                                        
                                    </div>
                                </div>
                            </div>
                            <div
                                className="fixed inset-0 bg-black opacity-50  h-[100vh]"
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
                                    <p className="text-white mb-2">id: {nft.metadata.id}</p>
                                    <div className="w-[7em] transform translate-x-[69px] translate-y-[54px] bg-red-900 rounded-md p-1 font-mono text-xs text-white/90">Coming Soon</div>
                                    <div className="flex justify-between">

                                        <div className="p-4 flex justify-center w-3/6 mr-1 font-mono bg-black text-white mt-10 cursor-not-allowed rounded-sm">
                                            <p>Sell</p>
                                        </div>

                                        <button className="p-4 flex justify-center w-3/6 ml-1 font-mono bg-white mt-10 rounded-sm"     onClick={() => {
                                            // console.log("Order button clicked for NFT ID:", nft.metadata.id);
                                            setisNFTid(nft.metadata.id)
                                            // console.log("nft.metadata.id", isNFTid)
                                            setModalOpen(!ModalOpen);
                                            
                                            
                                        }}>
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

            <h1 className="flex justify-center w-full my-24"><p className="mb-10 text-white">Packs are coming soon </p></h1>
            {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 lg:p-10 gap-4 justify-items-center">
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
                            {/* <Web3Button
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
              */}
            </div> 
            // {openPackRewards && openPackRewards.erc1155Rewards?.length && (

                
            //     <div className="fixed inset-0 flex items-center justify-center">
            //     <div
            //         className="fixed inset-0 bg-black opacity-50"
            //         onClick={() => setOpenPackRewards(undefined)}
            //     ></div>
            //     <div className="relative z-50">
            //         <div className="flex justify-items-center">
            //         {openPackRewards.erc1155Rewards.map((card, index) => (
            //             <PackRewardCard reward={card} key={index} />
            //         ))}
            //         </div>
            //     </div>
            //     </div>
            // )}


        // </div>
    )
};