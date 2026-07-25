import React from 'react';
import { Link } from 'react-router-dom';
import { Award, Compass, HeartHandshake, ShieldCheck } from 'lucide-react';


const Home = () => {
  const introCards = [
    {
      icon: <ShieldCheck className="w-8 h-8 text-myntra-pink" />,
      title: 'Authentic Products',
      description: 'Shop absolute authenticity. Every item comes with official artisan labels and genuine quality guarantees.',
    },
    {
      icon: <Award className="w-8 h-8 text-myntra-pink" />,
      title: 'GI Certified Crafts',
      description: 'Discover geographical indicator verified marvels - from Banarasi silk to Pochampally ikat and Rajasthani blue pottery.',
    },
    {
      icon: <HeartHandshake className="w-8 h-8 text-myntra-pink" />,
      title: 'Direct Artisan Marketplace',
      description: 'Support community cooperatives. We route proceeds directly back to rural creators and regional handloom societies.',
    },
    {
      icon: <Compass className="w-8 h-8 text-myntra-pink" />,
      title: 'Preserving Indian Heritage',
      description: 'Join the conservation journey. We work to save ancient crafting techniques and keep traditional art forms alive.',
    },
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* HERO BANNER */}
      <section className="relative overflow-hidden bg-gradient-to-tr from-pink-50 via-white to-orange-50 py-20 lg:py-32 px-4 sm:px-6 lg:px-8 border-b border-gray-100">
        <div className="max-w-[1200px] mx-auto text-center relative z-10">
          <span className="inline-block bg-pink-100 text-myntra-pink text-xs font-extrabold tracking-widest uppercase px-3 py-1.5 rounded-full mb-6 animate-pulse">
            Introducing Heritage Hub
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-myntra-dark tracking-tight leading-none mb-6">
            Discover India's <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-myntra-pink to-orange-500">
              Timeless Heritage
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-myntra-gray max-w-[800px] mx-auto mb-10 leading-relaxed font-medium">
            Explore authentic handlooms, handicrafts, jewellery and artisan-made treasures from every Indian state.
          </p>
          <div className="flex justify-center">
            <Link
              to="/heritage"
              className="myntra-btn-primary px-8 py-4 rounded-full text-base font-extrabold tracking-wider uppercase shadow-lg transform hover:-translate-y-0.5 transition duration-200"
            >
              Explore Heritage Hub
            </Link>
          </div>
        </div>

        {/* Decorative background shapes */}
        <div className="absolute top-1/2 left-10 -translate-y-1/2 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/3 right-10 -translate-y-1/2 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      </section>

      {/* INTRODUCTION CARD SECTION */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50/50">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-myntra-dark mb-4">
              Celebrating Craftsmanship
            </h2>
            <p className="text-myntra-gray max-w-[600px] mx-auto text-sm font-medium">
              Bringing centuries of royal design and regional expertise directly from native craftspeople to your closet.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {introCards.map((card, idx) => (
              <div
                key={idx}
                className="bg-white p-8 rounded-2xl border border-gray-100 hover:border-pink-100 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group"
              >
                <div className="bg-pink-50 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition duration-300">
                  {card.icon}
                </div>
                <h3 className="text-lg font-bold text-myntra-dark mb-3">
                  {card.title}
                </h3>
                <p className="text-xs text-myntra-gray leading-relaxed font-semibold">
                  {card.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
