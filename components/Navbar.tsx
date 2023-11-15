import { ConnectWallet, useAddress, useDisconnect } from "@thirdweb-dev/react";
import styles from "../styles/Home.module.css";
import Link from "next/link";
import { useState, useEffect } from "react";

import {
    ThirdwebProvider,
    metamaskWallet,
    coinbaseWallet,
    walletConnect,
    trustWallet,
    darkTheme,
  } from "@thirdweb-dev/react";

export default function Navbar() {
    const address = useAddress();
    const disconnect = useDisconnect();

    const [formattedAddress, setFormattedAddress] = useState<string | undefined>(undefined);

    useEffect(() => {
      if (address) {
        const formatted = `${address.slice(0, 4)}...${address.slice(-4)}`;
        setFormattedAddress(formatted);
      } else {
        setFormattedAddress('Address not available');
      }
    }, [address]);

    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

    function disconnectWallet() {
        disconnect();
        setIsProfileDropdownOpen(false);
    }

    return (

        <nav className="bg-[#252525] fixed w-full z-20 top-0 left-0 border-b border-gray-200 dark:border-gray-600">
            <div className="flex flex-wrap items-center justify-between mx-auto p-4">
                <Link href="/" className="flex items-center md:hidden ">
                    <img src="https://lh3.googleusercontent.com/u/5/drive-viewer/AK7aPaAAFFvu1f155K_4R1TcVA3vUS7y2BEByU5ws4h5nnd0LNoR-1XLDzkpNYD5h5COd7RYeHa6p5ulgb7nuSe6nT1aY0L38g=w2560-h1243" className="h-8 mr-3" alt="Flowbite Logo"/>
                    <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">The Sybil Market</span>
                </Link>
                <div className="flex md:order-2">
                    {/* <button type="button" className="text-white bg-yellow-700 hover:bg-yellow-800 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm px-4 py-2 text-center mr-3 md:mr-0 dark:bg-yellow-600 dark:hover:bg-yellow-700 dark:focus:ring-yellow-800">Get started</button> */}
                    <button data-collapse-toggle="navbar-sticky" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-sticky" aria-expanded="false">
                        <span className="sr-only">Open main menu</span>
                        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15"/>
                        </svg>
                    </button>
                    <div>
                        {!address ? (
                            <ConnectWallet 
                                btnTitle="Connect Wallet"
                                theme={darkTheme({
                                    colors: {
                                      accentText: "#ffb433",
                                      accentButtonBg: "#ffb433",
                                    },
                                  })}
                                  auth={{ loginOptional: false }}
                                  switchToActiveChain={true}
                                  modalSize={"wide"}
                                
                                className="text-white bg-yellow-700 hover:bg-yellow-800 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm px-4 py-2 text-center mr-3 md:mr-0 dark:bg-yellow-600 dark:hover:bg-yellow-700 dark:focus:ring-yellow-800"
                            />
                        ) : (
                            <div
                                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                            >
                                <img src={`https://avatars.dicebear.com/api/avataaars/1.svg`} alt="avatar" className={styles.avatar}/>
                            </div>
                        )}
                    </div>
          
                    {isProfileDropdownOpen && (
                        <div className="transform translate-y-10 md:-translate-x-20 md:-translate-x-2 -translate-x-12  z-50 fixed my-4 text-base list-none bg-[#282828] divide-y divide-gray-100 rounded-lg shadow  dark:divide-gray-600" id="user-dropdown">
                            
                            <div className="px-4 py-3 w-[10em] flex justify-center">
                                <span className="block text-sm text-gray-900 dark:text-white">{formattedAddress}</span>
                                {/* <span className="block text-sm  text-gray-500 truncate dark:text-gray-400">name@flowbite.com</span> */}
                            </div>
                            <ul className="py-2 "  aria-labelledby="user-menu-button">
                                <Link href="/myPacks" className="flex justify-center">
                                    <p className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">My Packs</p>
                                </Link>
                                <Link href="/myCards" className="flex justify-center">
                                    <p className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">My Cards</p>
                                </Link>
                                <button onClick={disconnectWallet} className="flex justify-center w-full">
                                    <p className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Logout</p>
                                </button>
                            </ul>
                        </div>
                    )}
                </div>
                <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-sticky">
                    <Link href="/" className="sm:flex hidden items-center mr-20">
                                <img src="https://lh3.googleusercontent.com/u/5/drive-viewer/AK7aPaAAFFvu1f155K_4R1TcVA3vUS7y2BEByU5ws4h5nnd0LNoR-1XLDzkpNYD5h5COd7RYeHa6p5ulgb7nuSe6nT1aY0L38g=w2560-h1243" className="h-8 mr-3" alt="Flowbite Logo"/>
                                <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">The Sybil Market</span>
                    </Link>
                    <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-[#252525] md:flex-row md:space-x-8 md:mt-0 md:border-0 dark:border-gray-700">
                    {/* <li>
                        <p className="block py-2 pl-3 pr-4 text-white bg-yellow-700 rounded md:bg-transparent md:text-yellow-700 md:p-0 md:dark:text-yellow-500" aria-current="page">Home</p>
                    </li> */}
                    <Link href="/marketplace">
                        <p className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-yellow-700 md:p-0 md:dark:hover:text-yellow-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Marketplace</p>
                    </Link>
                    <Link href="/shop">
                        <p className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-yellow-700 md:p-0 md:dark:hover:text-yellow-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Shop</p>
                        </Link>
                    <Link href="/packsshop">
                        <p className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-yellow-700 md:p-0 md:dark:hover:text-yellow-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Packs</p>
                    </Link>
                    </ul>
                </div>
            </div>
        </nav>

    )
}