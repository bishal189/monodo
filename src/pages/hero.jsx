
export default function Hero() {
  return (
    <section className="bg-gradient-to-b from-red-50 to-white">
      <div className="bg-red-500 text-white px-6 py-3 text-sm font-medium flex items-center gap-2">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M13 16h-2v-5.41L7.41 13 6 11.59 12 5.59l6 6L16.41 13 13 16.41z" />
        </svg>
        address. Thank you.
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-gray-900">
          Data to trust – for
          <br />
          decisions that matter
        </h1>

        <div className="mb-8 rounded-lg overflow-hidden bg-gray-200 h-80">
          <img src="/modern-interior-design-minimalist-living-room.jpg" alt="Modern interior design" className="w-full h-full object-cover" />
        </div>

        <p className="text-gray-700 mb-8 max-w-2xl text-lg leading-relaxed">
          Data isn't hard to find, but high-quality data is. At Airbnb you get real data collected from real people – a
          natural starting point for on-point market research. So that your next decision is the right one.
        </p>

        <button className="w-full md:w-auto bg-red-500 hover:bg-red-600 text-white font-bold py-4 px-12 rounded-lg transition duration-200 text-lg">
          Get Started
        </button>
      </div>
    </section>
  )
}
