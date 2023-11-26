import type { NextPage } from "next";
import styles from "../styles/Home.module.css";
import { useState, useEffect } from 'react';
import { MediaRenderer } from "@thirdweb-dev/react";
import Link from "next/link";

/* eslint-disable react-hooks/rules-of-hooks */
// pages/products/[productName]/index.tsx
import { useRouter } from 'next/router';
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

  import { parseIneligibility } from "../utils/parseIneligibility";
// Updated shopItems array


import Image from "next/image";
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

const Home: NextPage = () => {

  // const images = [
  //   'https://thesybilmarket.vercel.app/4.png',
  //   'https://thesybilmarket.vercel.app/5.png',
  //   'https://thesybilmarket.vercel.app/6.png',
  //   'https://thesybilmarket.vercel.app/41.png',
  //   'https://thesybilmarket.vercel.app/2.png',
  // ];
  const myEditionDropContractAddress: string = "0xAE844Bc15fc76F647E4D285d5e6e67dB2b0D1fcf";

  const address = useAddress();
  const [quantity, setQuantity] = useState(1);
  const { contract: editionDrop } = useContract(myEditionDropContractAddress);
  const { data: contractMetadata } = useContractMetadata(editionDrop);
  const [referralAddress, setReferralAddress] = useState('');
  const successText = 'text logs only after success';
  const [reffs, setReffs] = useState<number>(0);
  const [referralError, setReferralError] = useState("");
  const currentAddress = address;

  // const data0 = [
  //   { Bigtext: 'DROP 001', desc: 'Low Bank', image: 'https://thesybilmarket.vercel.app/4.png' },
  //   { Bigtext: 'DROP 001', desc: 'Connect Wallet', image: 'https://thesybilmarket.vercel.app/5.png' },
  //   { Bigtext: 'DROP 001', desc: 'Fomo', image: 'https://thesybilmarket.vercel.app/6.png' },
  //   { Bigtext: 'DROP 001', desc: 'SYBIL', image: 'https://thesybilmarket.vercel.app/41.png' },
  //   { Bigtext: 'DROP 001', desc: 'The Low Bank', image: 'https://thesybilmarket.vercel.app/2.png' },
  //   // Add more data as needed
  // ];
  const data1 = [
    { rank: 1, collection: 'Stop Loss', floorPrice: '$55', image: 'https://thesybilmarket.vercel.app/1.png' },
    { rank: 2, collection: 'The Low Bank', floorPrice: '$55', image: 'https://thesybilmarket.vercel.app/ltl/2.png' },
    { rank: 3, collection: 'Not Eligible', floorPrice: '$55', image: 'https://thesybilmarket.vercel.app/ltl/3.png' },
    // Add more data as needed
  ];
  const data2 = [
    { rank: 4, collection: 'Connect Wallet', floorPrice: '$55', image: 'https://thesybilmarket.vercel.app/ltl/5.png' },
    { rank: 5, collection: 'FOMO', floorPrice: '$55', image: 'https://thesybilmarket.vercel.app/ltl/6.png' },
    { rank: 6, collection: 'Цените Бычку', floorPrice: '$55', image: 'https://thesybilmarket.vercel.app/ltl/7.png' },
    // Add more data as needed
  ];

  const items = [
    {
      tokenAddress: '0xf8Bb1882230064CC364b65F4cC61A9F4B4F12869',
      imageUrl: 'https://thesybilmarket.vercel.app/med/1.png',
      name: 'Stop Loss',
    },
    {
      tokenAddress: '0xf8Bb1882230064CC364b65F4cC61A9F4B4F12869',
      imageUrl: 'https://thesybilmarket.vercel.app/med/6.png',
      name: 'Fomo blank',
    },
    {
      tokenAddress: '0xf8Bb1882230064CC364b65F4cC61A9F4B4F12869',
      imageUrl: 'https://thesybilmarket.vercel.app/med/11.png',
      name: 'Mint Or Skip',
    },
    {
      tokenAddress: '0xf8Bb1882230064CC364b65F4cC61A9F4B4F12869',
      imageUrl: 'https://thesybilmarket.vercel.app/med/12.png',
      name: 'Connect Wallet Purple',
    },
    
    // Add more items as needed
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // const handleNext = () => {
  //   setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  // };

  // const handlePrev = () => {
  //   setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  // };

  // useEffect(() => {
  //   // Automatic image change every 3 seconds
  //   const intervalId = setInterval(() => {
  //     setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  //   }, 3000);

  //   // Cleanup function to clear the interval when the component unmounts
  //   return () => clearInterval(intervalId);
  // }, []);


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
  
    const doc = new GoogleSpreadsheet('1daqsM7V0qS3MKmzq40vmQ58izNWfzbA8qh0e7IUy4cM', serviceAccountAuth);
  
    try {
      // console.log('Attempting to authorize...');
      await serviceAccountAuth.authorize();
      // console.log('Authorization successful.');
  
      // console.log('Loading document info...');
      await doc.loadInfo();
      // console.log('Document info loaded.');
  
      const sheet = doc.sheetsByIndex[1];
      // console.log('Sheet loaded.');
  
      const dataToWrite = {
        address: referralAddress,
        maxClaimable: 1,
      };
  
      const rows = await sheet.getRows();
  
      const existingRow = rows.find((row) => row.get('address') === referralAddress);
      // console.log('existingRow', existingRow);
  
      if (existingRow) {
        const currentAmount = Number(existingRow.get('maxClaimable'));
        existingRow.set('maxClaimable', currentAmount + 1);
        await existingRow.save();
      } else {
        await sheet.addRow(dataToWrite);
      }
  
      // console.log('Data written to Google Sheets.');
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
    
    const doc = new GoogleSpreadsheet('1daqsM7V0qS3MKmzq40vmQ58izNWfzbA8qh0e7IUy4cM', serviceAccountAuth);
  
    try {
      // console.log('Attempting to authorize...');
      try {
        await serviceAccountAuth.authorize();
      } catch (error) {
        console.error('Error during authorization:', error);
      }
      // console.log('Authorization successful.');
      // console.log('Loading document info...');
      await doc.loadInfo();
      // console.log('Document info loaded.');
      const sheetIndexToWriteTo = 1;
      const sheet = doc.sheetsByIndex[sheetIndexToWriteTo];
    
      if (!sheet) {
        console.error(`Sheet with index ${sheetIndexToWriteTo} not found.`);
        return;
      }
      // console.log('Sheet loaded.');
      const rows = await sheet.getRows();
      // console.log('IERNONIGR', currentAddress)
      const matchingRow = await rows.find(async (row) => row.get('address') === currentAddress);
      // console.log('matchingRow', matchingRow);
      // console.log('IERNONIGR', currentAddress);
      const findMatchingRow = async () => {
        const matchingRow = await Promise.all(rows.map(async (row) => {
          const wallet = await row.get('address');
          const referrals = await row.get('maxClaimable');
          if (wallet === currentAddress) {
            // console.log('Matching Wallet:', wallet);
            // console.log('Amount of Referrals:', referrals);
            setReffs(referrals);
            return true;
          }
          return false;
        }));
        if (!matchingRow.includes(true)) {
          console.log('No matching row found.');
          // console.log('Loaded sheets:', doc.sheetsByIndex.map(sheet => sheet.title));
        }
      };
      findMatchingRow();
      if (matchingRow) {
        const amount = Number(matchingRow.get('maxClaimable'));
        // console.log('AMAAAAAAAAAAAAAAAUNT', amount);
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
  const [isMuted, setIsMuted] = useState(true);

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };
  
  return (
      <div className="sm:p-10 p-0 mt-16 block justify-center">
            
            <div id="default-carousel" className="relative w-full " data-carousel="slide">
              <div className="relative h-56 overflow-hidden rounded-lg md:h-96">
                {/* {data0.map((item, index) => ( */}
                  <div
                    // key={index}
                    // className={`duration-700 ease-in-out absolute top-0 left-0 right-0 bottom-0 transition-opacity ${
                    //   index === currentIndex ? 'opacity-100' : 'opacity-0'
                    // }`}
                    // data-carousel-item

                    className="absolute top-0 left-0 right-0 bottom-0"
                  >
                    <video className="w-full h-full object-cover font-mono" autoPlay muted loop controlsList="nofullscreen,nodownload,noremoteplayback" playsInline>
                      <source src="https://thesybilmarket.vercel.app/redder002.mp4" type="video/mp4" />
                    </video>
                      {/* <img src="{item.image}" className="w-full h-full object-cover font-mono" alt={`Slide ${index + 1}`} /> */}
                   
                    <div className="absolute left-4 bottom-4 text-white font-bold">
                      <p className="sm:text-2xl text-base text-white">Drop 001</p>
                      <p className="sm:text-lg text-sm text-white/60">Our first single nft drop ready to be minted</p>
                      {/* <button onClick={toggleMute} className="absolute left-4 bottom-4 text-white font-bold">
                        {isMuted ? 'Unmute' : 'Mute'}
                      </button> */}
                    </div>
                    <div className="absolute right-4 bottom-4">
                      <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0">
                          <Link href="/shop" className="font-mono inline-flex justify-center items-center sm:py-3 sm:px-5 py-1 px-3 text-xs sm:font-medium font-xs text-center text-white rounded-lg bg-[#b55e59] hover:bg-[#a05450] focus:ring-4 focus:ring-[#b55e59]">
                              Get started
                              <svg className="w-3.5 h-3.5 ms-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                              </svg>
                          </Link>  
                      </div>
                    </div>
                  </div>
                {/* ))} */}
              </div>

              {/* <div className="absolute z-30 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3 rtl:space-x-reverse">
                {data0.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    className={`sm:w-3 sm:h-3 w-2 h-2 rounded-full ${index === currentIndex ? 'bg-blue-500' : 'bg-gray-300'}`}
                    aria-label={`Slide ${index + 1}`}
                    onClick={() => setCurrentIndex(index)}
                  ></button>
                ))}
              </div> */}

                  {/* <button type="button" className="absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none" onClick={handlePrev}>
                    <div className="inline-flex items-center justify-center sm:w-10 sm:h-10 w-6 h-10 rounded-full sm:bg-white bg-white/60  group-hover:bg-white/80  group-focus:ring-4 group-focus:ring-white group-focus:ring-gray-800/70 group-focus:outline-none">
                      <svg className="sm:w-4 sm:h-4 w-3 h-3 text-gray-800 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 1 1 5l4 4"/>
                      </svg>
                    </div>
                  </button>
                  <button type="button" className="absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none" onClick={handleNext}>
                    <div className="inline-flex items-center justify-center sm:w-10 sm:h-10 w-6 h-10 rounded-full sm:bg-white bg-white/60  group-hover:bg-white/20  group-focus:ring-4 group-focus:ring-white group-focus:ring-gray-800/70 group-focus:outline-none">
                      <svg className="sm:w-4 sm:h-4 w-3 h-3 text-gray-800 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                      </svg>
                    </div>
                  </button> */}
                </div>

                <div className="w-full sm:p-10 py-6">
                  {/* <div className="text-xl text-white flex justify-start mb-6 sm:px-0 px-3">
                    Trending:
                  </div> */}
                  <div className="flex font-mono">
                    <table className="w-full text-white mr-6" cellSpacing="0">
                      <thead className="border-b-2 border-white/30 font-light">
                        <tr>
                          <th className="p-3 text-left">Rank</th>
                          <th className="p-3 text-left">Collection</th>
                          <th className="p-3 text-left">Floor Price</th>
                        </tr>
                      </thead>
                      <tbody className="">
                        {data1.map((item, index) => (
                          
                          <tr key={index}>
                            <td className="p-3 pt-12 font-bold sm:text-left text-center">{item.rank}</td>
                            <td className="p-3 pt-12 flex items-center text-left font-bold">
                              <img src={item.image} alt={`Image for ${item.collection}`} className="w-20 rounded-xl h-20 rounded-xl mr-2 sm:justify-start justify-center" /> {/* Adjust the width and height as needed */}
                              {item.collection}
                            </td>
                            <td className="p-3 pt-12 font-bold sm:text-left text-center">{item.floorPrice}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <table className="sm:inline-table hidden w-full text-white ml-6" cellSpacing="0">
                      <thead className="border-b-2 border-white/30 font-light">
                        <tr>
                          <th className="p-3 text-left">Rank</th>
                          <th className="p-3 text-left">Collection</th>
                          <th className="p-3 text-left">Floor Price</th>
                        </tr>
                      </thead>
                      <tbody className="">
                        {data2.map((item, index) => (
                          <tr key={index}>
                            <td className="p-3 pt-12 text-left font-bold">{item.rank}</td>
                            <td className="p-3 pt-12 flex items-center text-left font-bold">
                              <img src={item.image} alt={`Image for ${item.collection}`} className="w-20 rounded-xl h-20 rounded-xl mr-2" /> {/* Adjust the width and height as needed */}
                              {item.collection}
                            </td>
                            <td className="p-3 pt-12 text-left font-bold">{item.floorPrice}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="w-full p-10">
                  {/* <div className="text-xl text-white flex justify-start mb-6">
                    Trending:
                  </div> */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 justify-items-center">
                    
                    {items.map((item, index) => (
                      <Link key={index} href={`/${encodeURIComponent(item.name.replace(/\s+/g, '-'))}`}>
                        <div key={index} className="w-[20em] overflow-hidden rounded-md shadow-lg bg-[#252525] mx-6">
                          <div className="relative w-full bg-black">
                            <MediaRenderer
                              src={item.imageUrl}
                              className="object-cover rounded-t-md"
                              style={{ width: "100%", height: "100%" }}
                            />
                          </div>
                          <div className="p-4 bg-[#252525] rounded-b-md">
                            <h3 className="text-white text-xl font-semibold mb-2">{item.name}</h3>
                            {/* Additional content here */}
                          </div>
                        </div>

                      </Link>
                    ))}
                  </div>
                </div>
                {/* Roadmap */}
                <ol className="flex items-center mt-28 sm:text-xl text-[8px] font-light">
                    <li className="relative w-full mb-6">
                        <div className="flex items-center">
                            <div className="z-10 flex items-center justify-center w-6 h-6  rounded-full ring-0  bg-[#a9706d] sm:ring-8 ring-[#664341] shrink-0">
                                <span className="flex w-3 h-3 bg-[#dbacaa] rounded-full"></span>
                            </div>
                            <div className="flex w-full  h-0.5 bg-[#b55e59]"></div>
                        </div>
                        <div className="mt-3">
                            <h3 className="font-medium text-white">Collabs</h3>
                        </div>
                    </li>
                    <li className="relative w-full mb-6">
                        <div className="flex items-center">
                        <div className="z-10 flex items-center justify-center w-6 h-6  rounded-full ring-0  bg-gray-700 sm:ring-8 ring-gray-900 shrink-0">
                                <span className="flex w-3 h-3  rounded-full bg-gray-300"></span>
                            </div>
                            <div className="flex w-full  h-0.5 bg-gray-700"></div>
                        </div>
                        <div className="mt-3">
                            <h3 className="font-medium text-white">First Single Drop</h3>
                        </div>
                    </li>
                    <li className="relative w-full mb-6">
                        <div className="flex items-center">
                        <div className="z-10 flex items-center justify-center w-6 h-6  rounded-full ring-0  bg-gray-700 sm:ring-8 ring-gray-900 shrink-0">
                                <span className="flex w-3 h-3  rounded-full bg-gray-300"></span>
                            </div>
                            <div className="flex w-full  h-0.5 bg-gray-700"></div>
                        </div>
                        <div className="mt-3">
                            <h3 className="font-medium  text-white">First Pack Drop</h3>
                        </div>
                    </li>
                    <li className="relative w-full mb-6">
                        <div className="flex items-center">
                            <div className="z-10 flex items-center justify-center w-6 h-6  rounded-full ring-0  bg-gray-700 sm:ring-8 ring-gray-900 shrink-0">
                                <span className="flex w-3 h-3  rounded-full bg-gray-300"></span>
                            </div>
                            <div className="flex w-full  h-0.5 bg-gray-700"></div>
                        </div>
                        <div className="mt-3">
                            <h3 className="font-medium  text-white">Marketplace</h3>
                        </div>
                    </li>
                    <li className="relative w-full mb-6">
                        <div className="flex items-center">
                            <div className="z-10 flex items-center justify-center w-6 h-6  rounded-full ring-0  bg-gray-700 sm:ring-8 ring-gray-900 shrink-0">
                                <span className="flex w-3 h-3 rounded-full bg-gray-300"></span>
                            </div>
                            <div className="flex w-full  h-0.5 bg-gray-700"></div>
                        </div>
                        <div className="mt-3">
                            <h3 className="font-medium  text-white">To The Moon</h3>
                        </div>
                    </li>
                </ol>

                {/* email */}
                <section className=" mt-28">
                    <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 z-10 relative">
                        <a href="#" className="inline-flex justify-between items-center py-1 px-1 pe-4 mb-7 text-sm  rounded-full bg-[#b55e59] text-blue-300 hover:bg-[#b55e59]">
                            <span className="text-xs bg-[#b55e59] rounded-full text-white px-4 py-1.5 me-3">New</span> <span className="text-sm font-medium text-white">{`See what's new`}</span> 
                            <svg className="w-2.5 h-2.5 ms-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                <path stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                            </svg>
                        </a>
                        <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none  md:text-5xl lg:text-6xl text-white">Sybil market - это сообщество криптанов создающих стиль жизни</h1>
                        <p className="mb-8 text-lg font-normal  lg:text-xl sm:px-16 lg:px-48 text-gray-200">Все образы разработаны специально для крипто-комьюнити, их поймут только те кто в теме.</p>
                        {/* <form className="w-full max-w-md mx-auto">   
                            <label htmlFor="default-email" className="mb-2 text-sm font-medium text-gray-900 sr-only text-white">Email sign-up</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 rtl:inset-x-0 start-0 flex items-center ps-3.5 pointer-events-none">
                                    <svg className="w-4 h-4 text-gray-500 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 16">
                                        <path d="m10.036 8.278 9.258-7.79A1.979 1.979 0 0 0 18 0H2A1.987 1.987 0 0 0 .641.541l9.395 7.737Z"/>
                                        <path d="M11.241 9.817c-.36.275-.801.425-1.255.427-.428 0-.845-.138-1.187-.395L0 2.6V14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2.5l-8.759 7.317Z"/>
                                    </svg>
                                </div>
                                <input type="email" id="default-email" className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 bg-gray-800 border-gray-700 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" placeholder="Enter your email here..." required />
                                <button type="submit" className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 bg-blue-600 hover:bg-blue-700 focus:ring-blue-800">Sign up</button>
                            </div>
                        </form> */}
                    <h1 className="text-4xl font-extrabold tracking-tight leading-none  md:text-5xl lg:text-6xl text-white flex justify-center">
                      <p>Reffs:&nbsp;</p>
                      <div></div>
                      {reffs !== null ? <p>{reffs}</p> : <p>Loading...</p>}
                    </h1>
                    </div>
                    {/* <div className="bg-gradient-to-b from-blue-50 to-transparent from-blue-900 w-full h-full absolute top-0 left-0 z-0"></div> */}
                    {/* <div className="w-[100%] bg-transparent border border-gray-300 rounded-lg text-white h-12 px-4 text-base mb-0"> 
                      <p>Your address</p>
                      <p>{currentAddress}</p>
                    </div>     
                    <div className="w-[100%] bg-transparent border border-gray-300 rounded-lg text-white h-12 px-4 text-base mb-0">
                      <p>Your referrals</p>
                      {reffs !== null ? <p>{reffs}</p> : <p>Loading...</p>}
                    </div> */}
                </section>

                {/* footer */}
                <footer className="mt-28">
                    <div className="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
                        <div className="md:flex md:justify-between">
                          <div className="mb-6 md:mb-0">
                              <Link href="/" className="flex items-center">
                                  <img src="https://thesybilmarket.vercel.app/logo02.png" className="h-8 me-3" alt="FlowBite Logo" />
                                  <span className="self-center text-2xl font-semibold whitespace-nowrap text-white">The Sybil Market</span>
                              </Link>
                          </div>
                          <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-2">
                              
                              <div>
                                  <h2 className="mb-6 text-sm font-semibold  uppercase text-white">Follow us</h2>
                                  <ul className=" text-gray-400 font-medium">
                                      <li className="mb-4">
                                          <a href="https://instagram.com/thesybil.market" className="hover:underline ">Instagram</a>
                                      </li>
                                      <li className="mb-4">
                                          <a href="https://discord.gg/mTZGgkCQ83" className="hover:underline">Discord</a>
                                      </li>
                                    
                                  </ul>
                              </div>
                              <div>
                                  <h2 className="mb-6 text-sm font-semibold  uppercase text-white">Legal</h2>
                                  <ul className=" text-gray-400 font-medium">
                                      <li className="mb-4">
                                          <a href="#" className="hover:underline">Privacy Policy</a>
                                      </li>
                                      <li>
                                          <a href="#" className="hover:underline">Terms &amp; Conditions</a>
                                      </li>
                                  </ul>
                              </div>
                          </div>
                      </div>
                      <hr className="my-6 border-gray-200 sm:mx-auto  lg:my-8" />
                      <div className="sm:flex sm:items-center sm:justify-between">
                          <span className="text-sm  sm:text-center text-gray-400">© 2024 <Link href="/" className="hover:underline">The Sybil Market™</Link>. All Rights Reserved.
                          </span>
                          <span className="text-sm  sm:text-center text-gray-400"> Вся информация о нас и о доставке - в дискорде
                          </span>
                          
                      </div>
                    </div>
                </footer>

                

      </div>
  );
};

export default Home;
