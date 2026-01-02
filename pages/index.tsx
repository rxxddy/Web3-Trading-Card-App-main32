import type { NextPage } from "next";
import { useState, useEffect } from 'react';
import { MediaRenderer, useAddress, useContract, useContractMetadata } from "@thirdweb-dev/react";
import Link from "next/link";

const Home: NextPage = () => {
  const address = useAddress();
  const [reffs, setReffs] = useState<number | null>(null); 
  const currentAddress = address;

  const data1 = [
    { rank: 1, collection: 'Stop Loss', floorPrice: '$55', image: 'https://thesybilmarket.vercel.app/1.png' },
    { rank: 2, collection: 'The Low Bank', floorPrice: '$55', image: 'https://thesybilmarket.vercel.app/ltl/2.png' },
    { rank: 3, collection: 'Not Eligible', floorPrice: '$55', image: 'https://thesybilmarket.vercel.app/ltl/3.png' },
  ];
  const data2 = [
    { rank: 4, collection: 'Connect Wallet', floorPrice: '$55', image: 'https://thesybilmarket.vercel.app/ltl/5.png' },
    { rank: 5, collection: 'Fomo blank', floorPrice: '$55', image: 'https://thesybilmarket.vercel.app/ltl/6.png' },
    { rank: 6, collection: 'Tsenite Buchky', floorPrice: '$55', image: 'https://thesybilmarket.vercel.app/ltl/7.png' },
  ];

  const items = [
    { tokenAddress: '0xf8Bb...', imageUrl: 'https://thesybilmarket.vercel.app/med/1.png', name: 'Stop Loss' },
    { tokenAddress: '0xf8Bb...', imageUrl: 'https://thesybilmarket.vercel.app/med/6.png', name: 'Fomo blank' },
    { tokenAddress: '0xf8Bb...', imageUrl: 'https://thesybilmarket.vercel.app/med/11.png', name: 'Mint Or Skip' },
    { tokenAddress: '0xf8Bb...', imageUrl: 'https://thesybilmarket.vercel.app/med/12.png', name: 'Connect Wallet Purple' },
  ];

  useEffect(() => {
    if (currentAddress) {
      fetch(`/api/get-sheets-data?address=${currentAddress}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.referrals !== undefined) {
            setReffs(data.referrals);
          }
        })
        .catch((err) => console.error(err));
    }
  }, [currentAddress]);

  const handleWriteToSheets = async (referralAddress: string) => {
    if (!referralAddress) return;
    try {
      await fetch('/api/write-sheets-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: referralAddress }),
      });
      alert("Ref added!");
    } catch (error) {
      console.error("Error", error);
    }
  };

  return (
    <div className="sm:p-10 p-0 mt-16 block justify-center">
      
      <div id="default-carousel" className="relative w-full" data-carousel="slide">
        <div className="relative h-56 overflow-hidden rounded-lg md:h-96">
          <div className="absolute top-0 left-0 right-0 bottom-0">
            <video className="w-full h-full object-cover font-mono" autoPlay muted loop playsInline>
              <source src="https://thesybilmarket.vercel.app/redder002.mp4" type="video/mp4" />
            </video>
            <div className="absolute left-4 bottom-4 text-white font-bold">
              <p className="sm:text-2xl text-base text-white">Drop 001</p>
              <p className="sm:text-lg text-xs text-white/60">Our first single nft drop ready to be minted</p>
            </div>
            <div className="absolute right-4 bottom-4">
              <Link href="/shop" className="font-mono inline-flex justify-center items-center sm:py-3 sm:px-5 py-1 px-3 text-xs sm:font-medium font-xs text-center text-white rounded-lg bg-[#b55e59] hover:bg-[#a05450]">
                Get started
                <svg className="w-3.5 h-3.5 ms-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full sm:p-10 py-6">
        <div className="flex font-mono">
          <table className="w-full text-white mr-6" cellSpacing="0">
            <thead className="border-b-2 border-white/30 font-light">
              <tr>
                <th className="p-3 text-left">Rank</th>
                <th className="p-3 text-left">Collection</th>
                <th className="p-3 text-left">Price</th>
              </tr>
            </thead>
            <tbody>
              {data1.map((item, index) => (
                <tr key={index}>
                  <td className="p-3 pt-12 font-bold sm:text-left text-center">{item.rank}</td>
                  <td className="p-3 pt-12 flex items-center text-left font-bold">
                    <Link href={`/${encodeURIComponent(item.collection.replace(/\s+/g, '-'))}`} className="contents text-white">
                      <img src={item.image} alt={item.collection} className="w-20 rounded-xl h-20 mr-2 sm:justify-start justify-center" />
                      {item.collection}
                    </Link>
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
                <th className="p-3 text-left">Price</th>
              </tr>
            </thead>
            <tbody>
              {data2.map((item, index) => (
                <tr key={index}>
                  <td className="p-3 pt-12 text-left font-bold">{item.rank}</td>
                  <td className="p-3 pt-12 flex items-center text-left font-bold">
                    <Link href={`/${encodeURIComponent(item.collection.replace(/\s+/g, '-'))}`} className="contents text-white">
                      <img src={item.image} alt={item.collection} className="w-20 rounded-xl h-20 mr-2 sm:justify-start justify-center" />
                      {item.collection}
                    </Link>
                  </td>
                  <td className="p-3 pt-12 text-left font-bold">{item.floorPrice}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="w-full p-10">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 justify-items-center">
          {items.map((item, index) => (
            <Link key={index} href={`/${encodeURIComponent(item.name.replace(/\s+/g, '-'))}`}>
              <div className="w-[20em] overflow-hidden rounded-md shadow-lg bg-[#252525] mx-6">
                <div className="relative w-full bg-black">
                  <MediaRenderer src={item.imageUrl} className="object-cover rounded-t-md" style={{ width: "100%", height: "100%" }} />
                </div>
                <div className="p-4 bg-[#252525] rounded-b-md">
                  <h3 className="text-white text-xl font-semibold mb-2">{item.name}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <ol className="flex items-center mt-28 sm:text-xl text-[8px] font-light">
         <li className="relative w-full mb-6">
             <div className="flex items-center">
                 <div className="z-10 flex items-center justify-center w-6 h-6 rounded-full bg-[#a9706d] ring-8 ring-[#664341] shrink-0">
                     <span className="flex w-3 h-3 bg-[#dbacaa] rounded-full"></span>
                 </div>
                 <div className="flex w-full h-0.5 bg-[#b55e59]"></div>
             </div>
             <div className="mt-3"><h3 className="font-medium text-white">Collabs</h3></div>
         </li>
      </ol>

      <section className="mt-28">
        <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 z-10 relative">
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl lg:text-6xl text-white">
            Sybil market is a community
          </h1>
          <p className="mb-8 text-lg font-normal lg:text-xl sm:px-16 lg:px-48 text-gray-200">
            All images are designed specifically for the crypto community.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-28">
         <div className="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
             <div className="sm:flex sm:items-center sm:justify-between">
                 <span className="text-sm text-gray-400">© 2024 The Sybil Market™. All Rights Reserved.</span>
             </div>
         </div>
      </footer>
    </div>
  );
};

export default Home;