import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { FaComputer, FaStackOverflow, FaMobileScreenButton } from "react-icons/fa6";
import { BiGitRepoForked } from "react-icons/bi";
import { FaArrowLeft, FaArrowRight, FaBrain } from "react-icons/fa";
import { HiOutlineViewGridAdd } from "react-icons/hi";
import { IoMdSettings } from "react-icons/io";
import { Link } from "react-router-dom";

const categories = [
  { name: "Frontend Development", count: 2, icon: <FaComputer size={60} /> },
  { name: "Backend Development", count: 3, icon: <BiGitRepoForked size={60} /> },
  { name: "Full Stack Development", count: 3, icon: <FaStackOverflow size={60} /> },
  {
    name: "Artifical Intelligence", count: 3, icon:
      <FaBrain size={60} />
  },
  { name: "Mobile App Development", count: 1, icon: <FaMobileScreenButton size={60} /> },
  { name: "Hybrid App Development", count: 1, icon: <HiOutlineViewGridAdd size={60} /> },
  { name: "Machine learning", count: 1, icon: <IoMdSettings size={60} /> },
];

const TopCategoryCarousel = () => {
  return (
    <div className="py-10 px-4 text-center bg-white">
      <div className="text-indigo-600 bg-indigo-100 font-semibold inline-block px-4 py-1 rounded-full text-sm">
        Course Categories
      </div>
      <h2 className="text-3xl md:text-4xl font-bold mt-3">
        Top Category We Have
      </h2>
      <p className="text-gray-500 mt-2">Explore Our Diverse Course Categories</p>

      <div className="relative  mt-10 max-w-7xl mx-auto bg-gray-100 rounded-full px-6 py-10 overflow-hidden">
        {/* Left Arrow */}
        <div className="swiper-button-prev-custom absolute left-10 top-1/2 -translate-y-1/2 z-10 bg- p-3 rounded-full shadow-md bg-[#ffc224] custom-boxShadow font-semibold border-[1.5px] cursor-pointer">
          <FaArrowLeft />
        </div>

        {/* Right Arrow */}
        <div className="swiper-button-next-custom absolute right-10 top-1/2 -translate-y-1/2 z-10 bg-[#ffc224] custom-boxShadow p-3 rounded-full shadow-md hover:scale-110 transition font-semibold border-[1.5px] cursor-pointer">
          <FaArrowRight />
        </div>

        <Swiper
          modules={[Navigation]}
          loop={true}
          speed={500}
          navigation={{
            nextEl: ".swiper-button-next-custom",
            prevEl: ".swiper-button-prev-custom",
          }}
          breakpoints={{
            320: {
              slidesPerView: 1,
              spaceBetween: 10,
            },
            480: {
              slidesPerView: 2,
              spaceBetween: 10,
            },
            640: {
              slidesPerView: 3,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 4,
              spaceBetween: 30,
            },
            1280: {
              slidesPerView: 5,
              spaceBetween: 30,
            },
          }}
          className="!px-6 pt-4 !mx-12"
        >
          {categories.map((item, i) => (
            <SwiperSlide key={i}>
              <Link to={"#"} className="mx-auto">
                <div className="flex flex-col items-center justify-center text-center border-2 border-[#0b66c3] rounded-full w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 shadow-md transition mx-auto relative hover:bg-[#5751e1] hover:border-[#5751e1] custom-boxShadow2 text-[#0b66c3] hover:text-white">
                  <div className="text-3xl mb-1">{item.icon}</div>
                  <img src="cat_star.svg" alt="star" className="absolute top-7 right-5 " />
                </div>
                <div className="mx-auto">
                  <div className="font-semibold text-sm text-black mt-4">
                    {item.name}
                  </div>
                  <div className="text-gray-500 text-sm">({item.count})</div>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default TopCategoryCarousel;
