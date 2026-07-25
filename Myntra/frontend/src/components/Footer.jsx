import React from 'react';
import { ShieldCheck, RefreshCw, Truck } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-myntra-light text-myntra-dark border-t border-gray-200 mt-auto">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* ONLINE SHOPPING */}
          <div>
            <h4 className="text-[12px] font-extrabold tracking-widest uppercase mb-4 text-myntra-dark">
              Online Shopping
            </h4>
            <ul className="space-y-2 text-xs text-[#535766]">
              <li><span className="hover:text-myntra-pink cursor-pointer">Men</span></li>
              <li><span className="hover:text-myntra-pink cursor-pointer">Women</span></li>
              <li><span className="hover:text-myntra-pink cursor-pointer">Kids</span></li>
              <li><span className="hover:text-myntra-pink cursor-pointer">Home & Living</span></li>
              <li><span className="hover:text-myntra-pink cursor-pointer">Beauty</span></li>
              <li><span className="hover:text-myntra-pink cursor-pointer">Gift Cards</span></li>
              <li><span className="hover:text-myntra-pink cursor-pointer text-myntra-pink font-bold">Heritage Hub Specials</span></li>
            </ul>
          </div>

          {/* CUSTOMER POLICIES */}
          <div>
            <h4 className="text-[12px] font-extrabold tracking-widest uppercase mb-4 text-myntra-dark">
              Customer Policies
            </h4>
            <ul className="space-y-2 text-xs text-[#535766]">
              <li><span className="hover:text-myntra-pink cursor-pointer">Contact Us</span></li>
              <li><span className="hover:text-myntra-pink cursor-pointer">FAQ</span></li>
              <li><span className="hover:text-myntra-pink cursor-pointer">T&C</span></li>
              <li><span className="hover:text-myntra-pink cursor-pointer">Terms of Use</span></li>
              <li><span className="hover:text-myntra-pink cursor-pointer">Track Orders</span></li>
              <li><span className="hover:text-myntra-pink cursor-pointer">Shipping</span></li>
              <li><span className="hover:text-myntra-pink cursor-pointer">Cancellation & Returns</span></li>
            </ul>
          </div>

          {/* EXPERIENCE APP & CONNECT */}
          <div>
            <h4 className="text-[12px] font-extrabold tracking-widest uppercase mb-4 text-myntra-dark">
              Experience Myntra App
            </h4>
            <div className="flex space-x-2 mb-6">
              <span className="bg-black text-white text-[10px] px-3 py-1.5 rounded flex items-center justify-center font-bold border border-gray-800 cursor-pointer">
                Google Play
              </span>
              <span className="bg-black text-white text-[10px] px-3 py-1.5 rounded flex items-center justify-center font-bold border border-gray-800 cursor-pointer">
                App Store
              </span>
            </div>

            <h4 className="text-[12px] font-extrabold tracking-widest uppercase mb-3 text-myntra-dark">
              Keep In Touch
            </h4>
            <div className="flex space-x-4">
              <span className="text-[#535766] hover:text-myntra-pink cursor-pointer">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                </svg>
              </span>
              <span className="text-[#535766] hover:text-myntra-pink cursor-pointer">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </span>
              <span className="text-[#535766] hover:text-myntra-pink cursor-pointer">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M23.498 6.163c-.272-1.022-1.074-1.825-2.097-2.097-1.85-.5-9.401-.5-9.401-.5s-7.551 0-9.401.5c-1.022.272-1.825 1.074-2.097 2.097-.5 1.85-.5 5.717-.5 5.717s0 3.868.5 5.718c.272 1.022 1.074 1.824 2.097 2.097 1.85.5 9.401.5 9.401.5s7.551 0 9.401-.5c1.022-.273 1.825-1.075 2.097-2.097.5-1.85.5-5.718.5-5.718s0-3.868-.5-5.717zm-14.248 10.137v-8.6l7.5 4.3-7.5 4.3z" />
                </svg>
              </span>
              <span className="text-[#535766] hover:text-myntra-pink cursor-pointer">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0 3.259-.014-3.667-.072-4.947-.2-4.358-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </span>
            </div>
          </div>

          {/* COMMITMENT & AUTHENTICITY */}
          <div>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <ShieldCheck className="w-8 h-8 text-green-600 flex-shrink-0" />
                <p className="text-xs text-[#282c3f]">
                  <strong className="block text-myntra-dark font-extrabold">100% ORIGINAL</strong> guarantee for all products on Myntra
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <RefreshCw className="w-8 h-8 text-blue-600 flex-shrink-0" />
                <p className="text-xs text-[#282c3f]">
                  <strong className="block text-myntra-dark font-extrabold">Return within 14 days</strong> of receiving your order
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Truck className="w-8 h-8 text-amber-600 flex-shrink-0" />
                <p className="text-xs text-[#282c3f]">
                  <strong className="block text-myntra-dark font-extrabold">Free Shipping</strong> for orders above ₹799
                </p>
              </div>
            </div>
          </div>
        </div>

        <hr className="my-8 border-gray-200" />

        <div className="flex flex-col sm:flex-row justify-between items-center text-xs text-[#535766]">
          <p>© 2026 www.myntra.com. All rights reserved.</p>
          <div className="mt-4 sm:mt-0 flex space-x-4">
            <span className="hover:text-myntra-pink cursor-pointer">Security</span>
            <span className="hover:text-myntra-pink cursor-pointer">Privacy</span>
            <span className="hover:text-myntra-pink cursor-pointer">Artisan Cooperatives</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
