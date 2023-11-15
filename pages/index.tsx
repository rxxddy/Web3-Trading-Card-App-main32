import type { NextPage } from "next";
import styles from "../styles/Home.module.css";
import { useState, useEffect } from 'react';

const Home: NextPage = () => {

  const images = [
    'https://image.mux.com/nzHlNbduVGyvrKDcVrTQEwZq00YWaKjrb8TEOzdRV6WY/thumbnail.jpg?auto=format&dpr=1&w=2560',
    'https://i.seadn.io/gcs/files/19f600d97f39e252900576e8937bb56c.png?auto=format&dpr=1&w=1920',
    'https://i.seadn.io/gcs/files/3cc47ef545e3ee3f33a476bf19a9f08a.gif?auto=format&dpr=1&w=2048',
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
      <div className="p-10 mt-16 flex justify-center">
            
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

      </div>
  );
};

export default Home;
