import React from 'react'


const News = () => {
  return (
    <section className="px-6 md:px-12 py-20 bg-white">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16">

        {/* Left Section - Text */}
        <div className="md:w-1/2 space-y-6 text-center md:text-left">
          <h1 className="text-5xl font-extrabold text-gray-900 drop-shadow-md">
            Attainers
          </h1>
          <p className="text-lg text-gray-500 leading-relaxed">
            Stay updated with the latest <span className="text-indigo-600 font-semibold">study material</span>,
            career guidance, and government job notifications from
            <span className="text-indigo-600 font-semibold"> Jammu & Kashmir</span> and across India.
          </p>
        </div>

        {/* Right Section - Floating Image */}
        <div className="md:w-1/2 flex justify-center relative">
          <img
            src="/main.jpg"
            alt="government exams illustration"
            className="w-80 h-auto drop-shadow-2xl transition-transform duration-500 hover:scale-105"
          />
        </div>
      </div>
    </section>
  )
}

export default News
