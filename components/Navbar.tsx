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

    const handleLogout = () => {
        // Perform the disconnectWallet action here
        disconnectWallet();
      
        // After disconnecting, toggle the profile dropdown
        setIsProfileDropdownOpen(!isProfileDropdownOpen);
      };

    return (

        <nav className="bg-[#202020] fixed w-full z-40 top-0 left-0 border-b border-gray-200 ">
            <div className="flex flex-wrap items-center justify-between mx-auto p-4">
                <Link href="/" className="flex items-center md:hidden ">
                    <img src="https://thesybilmarket.vercel.app/logo02.png" className="h-8 mr-3" alt="Flowbite Logo"/>
                    <img src="https://thesybilmarket.vercel.app/TSM02.png" className="h-8 mr-3" alt="Flowbite Logo"/>
                    {/* <span className="self-center text-2xl font-semibold whitespace-nowrap ">The Sybil Market</span> */}
                </Link>
                <div className="flex md:order-2">
                    {/* <button type="button" className="text-white bg-gray-500 hover:bg-yellow-800 focus:ring-4 focus:outline-none focus:ring-gray-500 font-medium rounded-lg text-sm px-4 py-2 text-center mr-3 md:mr-0 ">Get started</button> */}
                    


                    <div className="">
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
                                  style={{width: "7em", minWidth: "7em", fontSize: "10px"}}
                                className="text-white bg-gray-500 hover:bg-gray-400 focus:ring-4 focus:outline-none focus:ring-gray-500 font-medium rounded-lg sm:text-sm text-xs px-4 py-2 text-center mr-3 md:w-[7em] w-[14em]  md:mr-"
                            />
                        ) : (

                            <div>

                            <button data-collapse-toggle="navbar-sticky" onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)} type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200   " aria-controls="navbar-sticky" aria-expanded="false">
                                <span className="sr-only">Open main menu</span>
                                <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15"/>
                                </svg>
                            </button>
                            
                            <Link href="/profile"
                                className="md:block hidden"
                            >
                                <img src={`https://avatars.dicebear.com/api/avataaars/1.svg`} alt="avatar" className={styles.avatar}/>
                            </Link>

                            </div>
                        )}
                    </div>
          
                    {isProfileDropdownOpen && (
                        <div>
                            <div className="transform translate-x-[-24.5em] translate-y-[2.3em] z-50 fixed my-4 text-base list-none bg-[#282828] divide-y divide-gray-100 rounded-lg shadow  " id="user-dropdown">
                                
                                <div className="px-4 py-3 w-[15em] flex justify-end z-50">
                                    <span className="block text-sm text-white ">{formattedAddress}</span>
                                    {/* <span className="block text-sm  text-gray-500 truncate ">name@flowbite.com</span> */}
                                </div>
                                <ul className="py-2 z-50 flex"  aria-labelledby="user-menu-button">
                                    <Link href="/profile" onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)} className="flex justify-startstart">
                                        <p className="block px-4 py-2 text-sm text-white hover:bg-gray-100   ">Profile</p>
                                    </Link>
                                    <Link href="/shop" onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)} className="flex justify-startstart">
                                        <p className="block px-4 py-2 text-sm text-white hover:bg-gray-100   ">Shop</p>
                                    </Link>
                                    <Link href="/packsshop" onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)} className="flex justify-startstart">
                                        <p className="block px-4 py-2 text-sm text-white hover:bg-gray-100   ">Packs</p>
                                    </Link>
                                    <Link href="/marketplace" onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)} className="flex justify-startstart">
                                        <p className="block px-4 py-2 text-sm text-white hover:bg-gray-100   ">Marketplace</p>
                                    </Link>
                                    <button onClick={handleLogout} className="flex justify-startstart w-full">
                                        <p className="block px-4 py-2 text-sm text-white hover:bg-gray-100   ">Logout</p>
                                    </button>
                                </ul>
                            
                            </div>
                            <div
                                className="fixed inset-0 bg-black opacity-50"
                                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                            ></div>
                        </div>
                    )}
                </div>
                <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-sticky">
                    <Link href="/" className="sm:flex hidden items-center mr-20">
                                <img src="https://thesybilmarket.vercel.app/logo02.png" className="h-8 mr-3" alt="Flowbite Logo"/>
                                <img src="https://thesybilmarket.vercel.app/TSM02.png" className="h-8 mr-3" alt="Flowbite Logo"/>
                                {/* <span className="self-center text-2xl font-semibold whitespace-nowrap ">The Sybil Market</span> */}
                    </Link>
                    <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-[#202020] md:flex-row md:space-x-8 md:mt-0 md:border-0 ">
                    {/* <li>
                        <p className="block py-2 pl-3 pr-4 text-white bg-gray-500 rounded md:bg-transparent md:text-gray-500 md:p-0 " aria-current="page">Home</p>
                    </li> */}
                    <Link href="/marketplace">
                        <p className="block py-2 pl-3 pr-4 text-white rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-gray-500 md:p-0      ">Marketplace</p>
                    </Link>
                    <Link href="/shop">
                        <p className="block py-2 pl-3 pr-4 text-white rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-gray-500 md:p-0      ">Shop</p>
                        </Link>
                    <Link href="/packsshop">
                        <p className="block py-2 pl-3 pr-4 text-white rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-gray-500 md:p-0      ">Packs</p>
                    </Link>

                    {address ? (
                    <button onClick={handleLogout} >
                        <p className="block py-2 pl-3 pr-4 text-white rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-gray-500 md:p-0      ">Logout</p>
                    </button>
                    ) : (<div></div>)}


                    </ul>
                </div>
            </div>
        </nav>

    )
}