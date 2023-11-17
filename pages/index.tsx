import type { NextPage } from "next";
import styles from "../styles/Home.module.css";
import { useState, useEffect } from 'react';
import { MediaRenderer } from "@thirdweb-dev/react";
import Link from "next/link";

const Home: NextPage = () => {

  const images = [
    'https://thesybilmarket.vercel.app/4.png',
    'https://thesybilmarket.vercel.app/5.png',
    'https://thesybilmarket.vercel.app/6.png',
    'https://thesybilmarket.vercel.app/41.png',
    'https://thesybilmarket.vercel.app/2.png',
  ];

  const data0 = [
    { Bigtext: 'Collection 1', desc: 'Description Description', image: 'https://thesybilmarket.vercel.app/4.png' },
    { Bigtext: 'Collection 2', desc: 'Description Description', image: 'https://thesybilmarket.vercel.app/5.png' },
    { Bigtext: 'Collection 3', desc: 'Description Description', image: 'https://thesybilmarket.vercel.app/6.png' },
    { Bigtext: 'Collection 3', desc: 'Description Description', image: 'https://thesybilmarket.vercel.app/41.png' },
    { Bigtext: 'Collection 3', desc: 'Description Description', image: 'https://thesybilmarket.vercel.app/2.png' },
    // Add more data as needed
  ];
  const data1 = [
    { rank: 1, collection: 'Collection A', floorPrice: '$100', image: 'https://thesybilmarket.vercel.app/7.png' },
    { rank: 2, collection: 'Collection B', floorPrice: '$150', image: 'https://thesybilmarket.vercel.app/31.png' },
    { rank: 3, collection: 'Collection C', floorPrice: '$120', image: 'https://thesybilmarket.vercel.app/41.png' },
    // Add more data as needed
  ];
  const data2 = [
    { rank: 4, collection: 'Collection A', floorPrice: '$100', image: 'https://thesybilmarket.vercel.app/1.png' },
    { rank: 5, collection: 'Collection B', floorPrice: '$150', image: 'https://thesybilmarket.vercel.app/2.png' },
    { rank: 6, collection: 'Collection C', floorPrice: '$120', image: 'https://thesybilmarket.vercel.app/3.png' },
    // Add more data as needed
  ];

  const items = [
    {
      tokenAddress: '0xf8Bb1882230064CC364b65F4cC61A9F4B4F12869',
      imageUrl: 'https://thesybilmarket.vercel.app/4.png',
      name: 'NFT T-Shirt 1',
    },
    {
      tokenAddress: '0xf8Bb1882230064CC364b65F4cC61A9F4B4F12869',
      imageUrl: 'https://thesybilmarket.vercel.app/5.png',
      name: 'NFT T-Shirt 2',
    },
    {
      tokenAddress: '0xf8Bb1882230064CC364b65F4cC61A9F4B4F12869',
      imageUrl: 'https://thesybilmarket.vercel.app/6.png',
      name: 'NFT T-Shirt 3',
    },
    {
      tokenAddress: '0xf8Bb1882230064CC364b65F4cC61A9F4B4F12869',
      imageUrl: 'https://thesybilmarket.vercel.app/7.png',
      name: 'NFT T-Shirt 4',
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
      <div className="sm:p-10 p-0 mt-16 block justify-center">
            
            <div id="default-carousel" className="relative w-full " data-carousel="slide">
              <div className="relative h-56 overflow-hidden rounded-lg md:h-96">
                {data0.map((item, index) => (
                  <div
                    key={index}
                    className={`duration-700 ease-in-out absolute top-0 left-0 right-0 bottom-0 transition-opacity ${
                      index === currentIndex ? 'opacity-100' : 'opacity-0'
                    }`}
                    data-carousel-item
                  >
                    <img src={item.image} className="w-full h-full object-cover font-mono " alt={`Slide ${index + 1}`} />
                    <div className="absolute left-4 bottom-4 text-white font-bold">
                      <p className="sm:text-2xl text-base text-white">{item.Bigtext}</p>
                      <p className="sm:text-lg text-sm text-white/60">{item.desc}</p>
                    </div>
                    <div className="absolute right-4 bottom-4">
                      <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0">
                          <Link href="/shop" className="font-mono inline-flex justify-center items-center sm:py-3 sm:px-5 py-1 px-3 text-xs sm:font-medium font-xs text-center text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900">
                              Get started
                              <svg className="w-3.5 h-3.5 ms-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                              </svg>
                          </Link>  
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="absolute z-30 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3 rtl:space-x-reverse">
                {data0.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    className={`sm:w-3 sm:h-3 w-2 h-2 rounded-full ${index === currentIndex ? 'bg-blue-500' : 'bg-gray-300'}`}
                    aria-label={`Slide ${index + 1}`}
                    onClick={() => setCurrentIndex(index)}
                  ></button>
                ))}
              </div>

                  <button type="button" className="absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none" onClick={handlePrev}>
                    <div className="inline-flex items-center justify-center sm:w-10 sm:h-10 w-6 h-10 rounded-full sm:bg-white bg-white/60  group-hover:bg-white/80  group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
                      <svg className="sm:w-4 sm:h-4 w-3 h-3 text-gray-800 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 1 1 5l4 4"/>
                      </svg>
                    </div>
                  </button>
                  <button type="button" className="absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none" onClick={handleNext}>
                    <div className="inline-flex items-center justify-center sm:w-10 sm:h-10 w-6 h-10 rounded-full sm:bg-white bg-white/60  group-hover:bg-white/20  group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
                      <svg className="sm:w-4 sm:h-4 w-3 h-3 text-gray-800 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"/>
                      </svg>
                    </div>
                  </button>
                </div>

                <div className="w-full sm:p-10 py-6">
                  <div className="text-xl text-white flex justify-start mb-6 sm:px-0 px-3">
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
                        {data1.map((item, index) => (
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
                  <div className="text-xl text-white flex justify-start mb-6">
                    Trending:
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 justify-items-center">
                    {items.map((item, index) => (
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
                    ))}
                  </div>
                </div>
                {/* Roadmap */}
                <ol className="flex items-center mt-28 sm:text-xl text-[8px] font-light">
                    <li className="relative w-full mb-6">
                        <div className="flex items-center">
                            <div className="z-10 flex items-center justify-center w-6 h-6 bg-blue-200 rounded-full ring-0 ring-white dark:bg-blue-900 sm:ring-8 dark:ring-gray-900 shrink-0">
                                <span className="flex w-3 h-3 bg-blue-600 rounded-full"></span>
                            </div>
                            <div className="flex w-full bg-gray-200 h-0.5 dark:bg-gray-700"></div>
                        </div>
                        <div className="mt-3">
                            <h3 className="font-medium text-gray-900 dark:text-white">Collabs</h3>
                        </div>
                    </li>
                    <li className="relative w-full mb-6">
                        <div className="flex items-center">
                            <div className="z-10 flex items-center justify-center w-6 h-6 bg-blue-200 rounded-full ring-0 ring-white dark:bg-blue-900 sm:ring-8 dark:ring-gray-900 shrink-0">
                                <span className="flex w-3 h-3 bg-blue-600 rounded-full"></span>
                            </div>
                            <div className="flex w-full bg-gray-200 h-0.5 dark:bg-gray-700"></div>
                        </div>
                        <div className="mt-3">
                            <h3 className="font-medium text-gray-900 dark:text-white">First Single Drop</h3>
                        </div>
                    </li>
                    <li className="relative w-full mb-6">
                        <div className="flex items-center">
                            <div className="z-10 flex items-center justify-center w-6 h-6 bg-blue-200 rounded-full ring-0 ring-white dark:bg-blue-900 sm:ring-8 dark:ring-gray-900 shrink-0">
                                <span className="flex w-3 h-3 bg-blue-600 rounded-full"></span>
                            </div>
                            <div className="flex w-full bg-gray-200 h-0.5 dark:bg-gray-700"></div>
                        </div>
                        <div className="mt-3">
                            <h3 className="font-medium text-gray-900 dark:text-white">First Pack Drop</h3>
                        </div>
                    </li>
                    <li className="relative w-full mb-6">
                        <div className="flex items-center">
                            <div className="z-10 flex items-center justify-center w-6 h-6 bg-gray-200 rounded-full ring-0 ring-white dark:bg-gray-700 sm:ring-8 dark:ring-gray-900 shrink-0">
                                <span className="flex w-3 h-3 bg-gray-900 rounded-full dark:bg-gray-300"></span>
                            </div>
                            <div className="flex w-full bg-gray-200 h-0.5 dark:bg-gray-700"></div>
                        </div>
                        <div className="mt-3">
                            <h3 className="font-medium text-gray-900 dark:text-white">Marketplace</h3>
                        </div>
                    </li>
                    <li className="relative w-full mb-6">
                        <div className="flex items-center">
                            <div className="z-10 flex items-center justify-center w-6 h-6 bg-gray-200 rounded-full ring-0 ring-white dark:bg-gray-700 sm:ring-8 dark:ring-gray-900 shrink-0">
                                <span className="flex w-3 h-3 bg-gray-900 rounded-full dark:bg-gray-300"></span>
                            </div>
                            <div className="flex w-full bg-gray-200 h-0.5 dark:bg-gray-700"></div>
                        </div>
                        <div className="mt-3">
                            <h3 className="font-medium text-gray-900 dark:text-white">To The Moon</h3>
                        </div>
                    </li>
                </ol>

                {/* email */}
                <section className=" mt-28">
                    <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 z-10 relative">
                        <a href="#" className="inline-flex justify-between items-center py-1 px-1 pe-4 mb-7 text-sm text-blue-700 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800">
                            <span className="text-xs bg-blue-600 rounded-full text-white px-4 py-1.5 me-3">New</span> <span className="text-sm font-medium">{`Jumbotron component was launched! See what's new`}</span> 
                            <svg className="w-2.5 h-2.5 ms-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"/>
                            </svg>
                        </a>
                        <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white">Sybil market - это сообщество криптанов создающих стиль жизни</h1>
                        <p className="mb-8 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 lg:px-48 dark:text-gray-200">Мы для тех, кто хочет не просто плыть по течению, а сам определяем куда плывет</p>
                        <form className="w-full max-w-md mx-auto">   
                            <label htmlFor="default-email" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Email sign-up</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 rtl:inset-x-0 start-0 flex items-center ps-3.5 pointer-events-none">
                                    <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 16">
                                        <path d="m10.036 8.278 9.258-7.79A1.979 1.979 0 0 0 18 0H2A1.987 1.987 0 0 0 .641.541l9.395 7.737Z"/>
                                        <path d="M11.241 9.817c-.36.275-.801.425-1.255.427-.428 0-.845-.138-1.187-.395L0 2.6V14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2.5l-8.759 7.317Z"/>
                                    </svg>
                                </div>
                                <input type="email" id="default-email" className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter your email here..." required />
                                <button type="submit" className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Sign up</button>
                            </div>
                        </form>
                    </div>
                    {/* <div className="bg-gradient-to-b from-blue-50 to-transparent dark:from-blue-900 w-full h-full absolute top-0 left-0 z-0"></div> */}
                </section>

                {/* footer */}
                <footer className="mt-28">
                    <div className="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
                        <div className="md:flex md:justify-between">
                          <div className="mb-6 md:mb-0">
                              <Link href="/" className="flex items-center">
                                  <img src="https://thesybilmarket.vercel.app/logo02.png" className="h-8 me-3" alt="FlowBite Logo" />
                                  <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">The Sybil Market</span>
                              </Link>
                          </div>
                          <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-2">
                              
                              <div>
                                  <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Follow us</h2>
                                  <ul className="text-gray-500 dark:text-gray-400 font-medium">
                                      <li className="mb-4">
                                          <a href="https://instagram.com/thesybilmarketplace" className="hover:underline ">Instagram</a>
                                      </li>
                                      <li>
                                          <a href="https://discord.gg/WRtthbQR" className="hover:underline">Discord</a>
                                      </li>
                                  </ul>
                              </div>
                              <div>
                                  <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Legal</h2>
                                  <ul className="text-gray-500 dark:text-gray-400 font-medium">
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
                      <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
                      <div className="sm:flex sm:items-center sm:justify-between">
                          <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2024 <Link href="/" className="hover:underline">The Sybil Market™</Link>. All Rights Reserved.
                          </span>
                          
                      </div>
                    </div>
                </footer>

                

      </div>
  );
};

export default Home;
