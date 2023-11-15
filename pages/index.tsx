import type { NextPage } from "next";
import styles from "../styles/Home.module.css";
import { useState, useEffect } from 'react';
import { MediaRenderer } from "@thirdweb-dev/react";

const Home: NextPage = () => {

  const images = [
    'https://image.mux.com/nzHlNbduVGyvrKDcVrTQEwZq00YWaKjrb8TEOzdRV6WY/thumbnail.jpg?auto=format&dpr=1&w=2560',
    'https://i.seadn.io/gcs/files/19f600d97f39e252900576e8937bb56c.png?auto=format&dpr=1&w=1920',
    'https://i.seadn.io/gcs/files/3cc47ef545e3ee3f33a476bf19a9f08a.gif?auto=format&dpr=1&w=2048',
  ];

  const data = [
    { rank: 1, collection: 'Collection A', floorPrice: '$100', image: 'https://d391b93f5f62d9c15f67142e43841acc.ipfscdn.io/ipfs/bafybeiggm45o5ue3324xeoq74uoh2mcafji5epndtyqt4rk32cydgekhdm/61.png' },
    { rank: 2, collection: 'Collection B', floorPrice: '$150', image: 'https://d391b93f5f62d9c15f67142e43841acc.ipfscdn.io/ipfs/bafybeig4bcif6bxelhdbnjqlizhlap3g42xjuib54wcl6wljjzw3qm7jd4/31.png' },
    { rank: 3, collection: 'Collection C', floorPrice: '$120', image: 'https://d391b93f5f62d9c15f67142e43841acc.ipfscdn.io/ipfs/bafybeiggm45o5ue3324xeoq74uoh2mcafji5epndtyqt4rk32cydgekhdm/61.png' },
    // Add more data as needed
  ];

  const items = [
    {
      tokenAddress: '0xf8Bb1882230064CC364b65F4cC61A9F4B4F12869',
      imageUrl: 'https://d391b93f5f62d9c15f67142e43841acc.ipfscdn.io/ipfs/bafybeig4bcif6bxelhdbnjqlizhlap3g42xjuib54wcl6wljjzw3qm7jd4/31.png',
      name: 'NFT T-Shirt 1',
    },
    {
      tokenAddress: '0xf8Bb1882230064CC364b65F4cC61A9F4B4F12869',
      imageUrl: 'https://d391b93f5f62d9c15f67142e43841acc.ipfscdn.io/ipfs/bafybeig4bcif6bxelhdbnjqlizhlap3g42xjuib54wcl6wljjzw3qm7jd4/11.png',
      name: 'NFT T-Shirt 2',
    },
    
    // Add more items as needed
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  useEffect(() => {
    // Automatic image change every 3 seconds
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);

    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);
  
  return (
      <div className="p-10 mt-16 block justify-center">
            
            <div id="default-carousel" className="relative w-full" data-carousel="slide">
              <div className="relative h-56 overflow-hidden rounded-lg md:h-96">
                {images.map((src, index) => (
                  <div
                    key={index}
                    className={`duration-700 ease-in-out absolute top-0 left-0 right-0 bottom-0 transition-opacity ${
                      index === currentIndex ? 'opacity-100' : 'opacity-0'
                    }`}
                    data-carousel-item
                  >
                    <img src={src} className="w-full h-full object-cover" alt={`Slide ${index + 1}`} />
                  </div>
                ))}
              </div>

              <div className="absolute z-30 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3 rtl:space-x-reverse">
                {images.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    className={`w-3 h-3 rounded-full ${index === currentIndex ? 'bg-blue-500' : 'bg-gray-300'}`}
                    aria-label={`Slide ${index + 1}`}
                    onClick={() => setCurrentIndex(index)}
                  ></button>
                ))}
              </div>

                  <button type="button" className="absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none" onClick={handlePrev}>
                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white  group-hover:bg-white/80  group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
                      <svg className="w-4 h-4 text-gray-800 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 1 1 5l4 4"/>
                      </svg>
                    </div>
                  </button>
                  <button type="button" className="absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none" onClick={handleNext}>
                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white  group-hover:bg-white/20  group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
                      <svg className="w-4 h-4 text-gray-800 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"/>
                      </svg>
                    </div>
                  </button>
                </div>

                <div className="w-full p-10">
                  <div className="text-xl text-white flex justify-start mb-6">
                    Trending:
                  </div>
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
                        {data.map((item, index) => (
                          <tr key={index}>
                            <td className="p-3 pt-12 text-left font-bold">{item.rank}</td>
                            <td className="p-3 pt-12 flex items-center text-left font-bold">
                              <img src={item.image} alt={`Image for ${item.collection}`} className="w-12 h-12 mr-2" /> {/* Adjust the width and height as needed */}
                              {item.collection}
                            </td>
                            <td className="p-3 pt-12 text-left font-bold">{item.floorPrice}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <table className="w-full text-white ml-6" cellSpacing="0">
                      <thead className="border-b-2 border-white/30 font-light">
                        <tr>
                          <th className="p-3 text-left">Rank</th>
                          <th className="p-3 text-left">Collection</th>
                          <th className="p-3 text-left">Floor Price</th>
                        </tr>
                      </thead>
                      <tbody className="">
                        {data.map((item, index) => (
                          <tr key={index}>
                            <td className="p-3 pt-12 text-left font-bold">{item.rank}</td>
                            <td className="p-3 pt-12 flex items-center text-left font-bold">
                              <img src={item.image} alt={`Image for ${item.collection}`} className="w-12 h-12 mr-2" /> {/* Adjust the width and height as needed */}
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
                  <div className="text-xl text-white flex justify-start mb-6">
                    Trending:
                  </div>
                  <div className="flex">
                    {items.map((item, index) => (
                        
                          <div key={index} className="w-[20em] overflow-hidden rounded-md shadow-lg bg-[#252525] mr-10">
                              <div className="relative w-full bg-black">
                                  <MediaRenderer
                                      src={item.imageUrl}
                                      className="object-cover rounded-t-md"
                                      style={{width: "100%", height: "100%"}}
                                  />
                              </div>
                              <div className="p-4 bg-[#252525] rounded-b-md">
                                  <h3 className="text-white text-xl font-semibold mb-2">{item.name}</h3>
                                      
                                  
                              </div>
                          </div>
                        
                    ))}
                  </div>
                </div>
                

      </div>
  );
};

export default Home;
