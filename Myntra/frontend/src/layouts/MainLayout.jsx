import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const MainLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      {/* Offset content to account for the fixed header */}
      <main className="flex-grow pt-[80px] md:pt-[90px]">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
