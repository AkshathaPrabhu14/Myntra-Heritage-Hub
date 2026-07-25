import React, { useContext, useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { ArrowLeft, CreditCard, Landmark, CheckCircle } from 'lucide-react';
import { calculateDiscountedPrice, resolveImageUrl } from '../services/productService';
import api from '../services/api';

const Checkout = () => {
  const {
    cart,
    cartSubtotal,
    cartDiscount,
    shippingPrice,
    taxPrice,
    shippingAddress,
    setShippingAddress,
    clearCart
  } = useContext(CartContext);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [address, setAddress] = useState(shippingAddress.address);
  const [city, setCity] = useState(shippingAddress.city);
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode);
  const [country, setCountry] = useState(shippingAddress.country || 'India');

  const [paymentMethod, setPaymentMethod] = useState('UPI'); // UPI, CARD, COD
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  const [loading, setLoading] = useState(false);

  // --- Coupon states ---
  const [passport, setPassport] = useState(null);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');

  // Coupon Rewards Configurations
  const couponRewards = {
    'HERITAGE5': { type: 'discount', value: 0.05, label: '5% Heritage Discount' },
    'FREESHIP5': { type: 'shipping', value: 0, label: 'Free Shipping' },
    'EARLY10': { type: 'discount', value: 0.10, label: '10% Early Access Discount' },
    'FRAME15': { type: 'discount', value: 0.15, label: '15% Profile Frame Discount' },
    'HERITAGE10': { type: 'discount', value: 0.10, label: '10% Heritage Discount' },
    'GUARDIAN28': { type: 'discount', value: 0.28, label: '28% Heritage Guardian Discount' },
    'SOUTHSPEC': { type: 'shipping', value: 0, label: 'Free Shipping (South India Special)' },
    'NORTH10': { type: 'discount', value: 0.10, label: '10% North India Collection Discount' },
    'NORTHEAST': { type: 'discount', value: 0.15, label: '15% North East Explorer Discount' },
    'SILKMASTER': { type: 'discount', value: 0.20, label: '20% Silk Master Discount' },
  };

  // Fetch user passport data to check earned coupons
  useEffect(() => {
    const fetchPassportData = async () => {
      try {
        const { data } = await api.get('/passport');
        if (data.success) {
          setPassport(data.data);
        }
      } catch (error) {
        console.error('Error loading passport for coupons:', error);
      }
    };
    fetchPassportData();
  }, []);

  // Compute list of unlocked coupon codes (uppercase)
  const unlockedCoupons = useMemo(() => {
    if (!passport) return [];
    const codes = [];
    (passport.milestones || []).forEach((m) => {
      if (m.unlocked && m.couponCode && !m.isUsed) {
        codes.push(m.couponCode.toUpperCase());
      }
    });
    (passport.challenges || []).forEach((c) => {
      if (c.isCompleted && c.couponCode && !c.isUsed) {
        codes.push(c.couponCode.toUpperCase());
      }
    });
    return Array.from(new Set(codes));
  }, [passport]);

  // Check coupon eligibility against cart items
  const checkCouponEligibility = (code, cartItems) => {
    const codeUpper = code.toUpperCase();

    if (codeUpper === 'SOUTHSPEC') {
      const southStates = ['karnataka', 'kerala', 'tamil nadu', 'andhra pradesh'];
      return cartItems.some((item) =>
        southStates.includes((item.state || '').toLowerCase().trim())
      );
    }

    if (codeUpper === 'NORTH10') {
      const northStates = [
        'rajasthan',
        'punjab',
        'jammu & kashmir',
        'uttar pradesh',
        'himachal pradesh',
      ];
      return cartItems.some((item) =>
        northStates.includes((item.state || '').toLowerCase().trim())
      );
    }

    if (codeUpper === 'NORTHEAST') {
      const northeastStates = [
        'assam',
        'nagaland',
        'meghalaya',
        'manipur',
        'mizoram',
        'arunachal pradesh',
        'tripura',
        'sikkim',
      ];
      return cartItems.some((item) =>
        northeastStates.includes((item.state || '').toLowerCase().trim())
      );
    }

    if (codeUpper === 'SILKMASTER') {
      return cartItems.some((item) =>
        (item.craft || '').toLowerCase().includes('silk')
      );
    }

    // Standard milestones coupons are eligible for all products
    return true;
  };

  const handleApplyCoupon = (code) => {
    setCouponError('');
    const codeUpper = code.trim().toUpperCase();
    if (!codeUpper) return;

    const isUnlocked = unlockedCoupons.includes(codeUpper);
    if (!isUnlocked) {
      const isAlreadyUsed = (passport?.milestones || []).some((m) => m.couponCode?.toUpperCase() === codeUpper && m.isUsed) ||
                            (passport?.challenges || []).some((c) => c.couponCode?.toUpperCase() === codeUpper && c.isUsed);
      if (isAlreadyUsed) {
        setCouponError('This coupon has already been used on a previous order.');
      } else {
        setCouponError('This coupon code is locked! Complete challenges in your Fashion Passport to unlock it.');
      }
      return;
    }

    const isEligible = checkCouponEligibility(codeUpper, cart);
    if (!isEligible) {
      let requirement = 'eligible products';
      if (codeUpper === 'SOUTHSPEC') requirement = 'crafts from South India (Karnataka, Kerala, Tamil Nadu, Andhra Pradesh)';
      else if (codeUpper === 'NORTH10') requirement = 'crafts from North India (Rajasthan, Punjab, Jammu & Kashmir, Uttar Pradesh, Himachal Pradesh)';
      else if (codeUpper === 'NORTHEAST') requirement = 'crafts from North East states';
      else if (codeUpper === 'SILKMASTER') requirement = 'Silk crafts';

      setCouponError(`This coupon is only eligible for ${requirement}. Add one to your bag to apply this coupon.`);
      return;
    }

    const reward = couponRewards[codeUpper] || { type: 'discount', value: 0.10, label: 'Heritage Discount' };
    setAppliedCoupon({
      code: codeUpper,
      ...reward
    });
    showToast(`Coupon ${codeUpper} applied successfully!`, 'success');
    setCouponCode('');
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon removed.', 'info');
  };

  // Quick validation
  const validateForm = () => {
    if (!address.trim() || !city.trim() || !postalCode.trim()) {
      showToast('Please fill out all address fields.', 'error');
      return false;
    }
    if (paymentMethod === 'UPI' && !upiId.trim()) {
      showToast('Please enter your UPI ID.', 'error');
      return false;
    }
    if (paymentMethod === 'CARD' && (!cardNumber.trim() || !cardExpiry.trim() || !cardCvv.trim())) {
      showToast('Please enter complete card details.', 'error');
      return false;
    }
    return true;
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    // Update context address for next times
    setShippingAddress({ address, city, postalCode, country });

    // Format order items for backend
    const orderItems = cart.map((item) => {
      const discPrice = calculateDiscountedPrice(item.price, item.discount);
      return {
        product: item._id,
        name: item.name,
        qty: item.qty,
        image: item.image,
        price: discPrice
      };
    });

    // --- Coupon calculations ---
    let finalCartTotal = cartSubtotal - cartDiscount;
    let finalShippingPrice = shippingPrice;
    let couponDiscountAmount = 0;

    if (appliedCoupon) {
      if (appliedCoupon.type === 'discount') {
        couponDiscountAmount = Math.round(finalCartTotal * appliedCoupon.value);
        finalCartTotal = Math.max(0, finalCartTotal - couponDiscountAmount);
      } else if (appliedCoupon.type === 'shipping') {
        finalShippingPrice = 0;
      }
    }

    const finalGrandTotal = finalCartTotal + finalShippingPrice;

    const payload = {
      orderItems,
      shippingAddress: { address, city, postalCode, country },
      paymentMethod,
      itemsPrice: cartSubtotal - cartDiscount - (appliedCoupon && appliedCoupon.type === 'discount' ? couponDiscountAmount : 0),
      taxPrice,
      shippingPrice: finalShippingPrice,
      totalPrice: finalGrandTotal,
      couponApplied: appliedCoupon ? appliedCoupon.code : undefined
    };

    try {
      const { data } = await api.post('/orders', payload);
      if (data.success) {
        showToast('Order placed successfully!', 'success');
        clearCart();
        navigate(`/order-confirmation/${data.data._id}`, {
          state: { newlyUnlockedStates: data.newlyUnlockedStates || [] },
        });
      } else {
        showToast(data.message || 'Failed to place order.', 'error');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      const msg = error.response?.data?.message || 'Error occurred while placing order.';
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-[600px] mx-auto px-4 py-16 mt-[90px] text-center">
        <h2 className="text-xl font-bold text-myntra-dark mb-4">Your bag is empty</h2>
        <Link to="/heritage" className="px-6 py-2.5 bg-myntra-pink text-white font-bold rounded">
          Explore Crafts
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1100px] mx-auto px-4 py-8 md:py-16 mt-[80px] md:mt-[90px] animate-fade-in">
      <div className="flex items-center space-x-3 mb-8">
        <Link to="/cart" className="p-2 hover:bg-gray-100 rounded-full transition text-myntra-dark">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="font-extrabold text-2xl md:text-3xl text-myntra-dark">Checkout</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12 items-start">
        {/* LEFT COLUMN: ADDRESS & PAYMENT FORM */}
        <form onSubmit={handlePlaceOrder} className="lg:col-span-2 space-y-6">
          {/* Shipping Address Box */}
          <div className="border border-gray-150 rounded-lg p-5 bg-white space-y-4">
            <h2 className="font-extrabold text-base text-myntra-dark border-b border-gray-100 pb-2">
              Delivery Address
            </h2>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-myntra-gray mb-1 uppercase">Street Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. 123 Heritage Lane, MG Road"
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded text-sm focus:outline-none focus:border-myntra-pink"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-myntra-gray mb-1 uppercase">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Bengaluru"
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded text-sm focus:outline-none focus:border-myntra-pink"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-myntra-gray mb-1 uppercase">Pin Code</label>
                  <input
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="e.g. 560001"
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded text-sm focus:outline-none focus:border-myntra-pink"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-myntra-gray mb-1 uppercase">Country</label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="India"
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded text-sm focus:outline-none focus:border-myntra-pink bg-gray-50 text-gray-550"
                  disabled
                />
              </div>
            </div>
          </div>

          {/* Payment Method Box */}
          <div className="border border-gray-150 rounded-lg p-5 bg-white space-y-4">
            <h2 className="font-extrabold text-base text-myntra-dark border-b border-gray-100 pb-2">
              Payment Option
            </h2>

            <div className="grid grid-cols-3 gap-4">
              <button
                type="button"
                onClick={() => setPaymentMethod('UPI')}
                className={`py-3 px-4 border rounded-md flex flex-col items-center justify-center space-y-1.5 transition ${
                  paymentMethod === 'UPI'
                    ? 'border-myntra-pink bg-pink-50/30 text-myntra-pink'
                    : 'border-gray-200 text-myntra-dark hover:border-gray-300'
                }`}
              >
                <Landmark className="w-5 h-5" />
                <span className="text-xs font-bold">UPI / QR</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('CARD')}
                className={`py-3 px-4 border rounded-md flex flex-col items-center justify-center space-y-1.5 transition ${
                  paymentMethod === 'CARD'
                    ? 'border-myntra-pink bg-pink-50/30 text-myntra-pink'
                    : 'border-gray-200 text-myntra-dark hover:border-gray-300'
                }`}
              >
                <CreditCard className="w-5 h-5" />
                <span className="text-xs font-bold">Credit/Debit Card</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('COD')}
                className={`py-3 px-4 border rounded-md flex flex-col items-center justify-center space-y-1.5 transition ${
                  paymentMethod === 'COD'
                    ? 'border-myntra-pink bg-pink-50/30 text-myntra-pink'
                    : 'border-gray-200 text-myntra-dark hover:border-gray-300'
                }`}
              >
                <CheckCircle className="w-5 h-5" />
                <span className="text-xs font-bold">Cash on Delivery</span>
              </button>
            </div>

            {/* Subforms based on method */}
            {paymentMethod === 'UPI' && (
              <div className="pt-2 animate-slide-in">
                <label className="block text-xs font-bold text-myntra-gray mb-1 uppercase">Enter UPI ID</label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="username@upi"
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded text-sm focus:outline-none focus:border-myntra-pink"
                />
              </div>
            )}

            {paymentMethod === 'CARD' && (
              <div className="pt-2 space-y-3 animate-slide-in">
                <div>
                  <label className="block text-xs font-bold text-myntra-gray mb-1 uppercase">Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="1234 5678 9101 1121"
                    maxLength={19}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded text-sm focus:outline-none focus:border-myntra-pink"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-myntra-gray mb-1 uppercase">Expiry (MM/YY)</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="12/29"
                      maxLength={5}
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded text-sm focus:outline-none focus:border-myntra-pink"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-myntra-gray mb-1 uppercase">CVV</label>
                    <input
                      type="password"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      placeholder="***"
                      maxLength={3}
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded text-sm focus:outline-none focus:border-myntra-pink"
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'COD' && (
              <p className="text-xs text-myntra-gray bg-gray-50 p-3 rounded">
                Additional ₹40 collection charge may apply. Pay in cash or QR code to the delivery associate.
              </p>
            )}
          </div>
        </form>

        {/* RIGHT COLUMN: ORDER SUMMARY */}
        <div className="space-y-6">
          <div className="border border-gray-150 rounded-lg p-5 bg-white space-y-4 shadow-sm">
            <h3 className="text-xs font-extrabold text-myntra-gray uppercase tracking-wider border-b border-gray-100 pb-2.5">
              Order Items ({cart.reduce((acc, i) => acc + i.qty, 0)})
            </h3>

            {/* Simple list of items */}
            <div className="max-h-[180px] overflow-y-auto space-y-3 divide-y divide-gray-50 pr-2">
              {cart.map((item) => (
                <div key={item._id} className="flex justify-between items-center pt-2">
                  <div className="flex items-center space-x-3 pr-2">
                    <img
                      src={resolveImageUrl(item.image)}
                      alt={item.name}
                      className="w-10 h-13 object-cover rounded"
                    />
                    <div className="text-xs">
                      <p className="font-bold text-myntra-dark line-clamp-1">{item.name}</p>
                      <p className="text-myntra-gray text-[10px]">Qty: {item.qty} • Free Size</p>
                    </div>
                  </div>
                  <span className="text-xs font-extrabold text-myntra-dark whitespace-nowrap">
                    ₹{(calculateDiscountedPrice(item.price, item.discount) * item.qty).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>

            {/* COUPON SECTION */}
            <div className="border-t border-gray-150 pt-3.5 space-y-3">
              <label className="block text-[10px] font-black uppercase text-myntra-gray tracking-wider">
                Apply Unlocked Coupon
              </label>
              
              {/* Manual input */}
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Enter Coupon Code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-grow px-3 py-2 border border-gray-300 rounded text-xs focus:outline-none uppercase font-bold"
                />
                <button
                  type="button"
                  onClick={() => handleApplyCoupon(couponCode)}
                  className="px-3.5 py-2 bg-slate-900 text-white font-bold rounded text-xs hover:bg-slate-800"
                >
                  Apply
                </button>
              </div>

              {couponError && (
                <p className="text-[10px] text-red-500 font-bold leading-tight">
                  ⚠️ {couponError}
                </p>
              )}

              {/* Show Applied Coupon */}
              {appliedCoupon && (
                <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-2.5 flex items-center justify-between text-xs font-bold animate-fade-in">
                  <div>
                    <span className="bg-green-600 text-white text-[9px] px-1.5 py-0.5 rounded font-black mr-2">
                      APPLIED
                    </span>
                    <span>{appliedCoupon.code}</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    className="text-red-500 hover:text-red-700 font-bold ml-2 text-[10px] uppercase"
                  >
                    Remove
                  </button>
                </div>
              )}

              {/* List of Available Unlocked Coupons */}
              {unlockedCoupons.length > 0 ? (
                <div className="space-y-1.5 pt-1">
                  <span className="block text-[10px] font-bold text-myntra-gray">
                    Your Unlocked Passport Coupons:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {unlockedCoupons.map((code) => {
                      const isEligible = checkCouponEligibility(code, cart);
                      const isApplied = appliedCoupon?.code === code;
                      return (
                        <button
                          key={code}
                          type="button"
                          onClick={() => {
                            if (isApplied) {
                              handleRemoveCoupon();
                            } else {
                              handleApplyCoupon(code);
                            }
                          }}
                          className={`text-[10px] px-2.5 py-1 rounded font-bold transition flex items-center space-x-1 ${
                            isApplied
                              ? 'bg-green-600 text-white'
                              : isEligible
                              ? 'bg-pink-50 border border-pink-200 text-myntra-pink hover:bg-pink-100'
                              : 'bg-gray-100 border border-gray-200 text-gray-400 cursor-not-allowed opacity-75'
                          }`}
                          title={!isEligible ? 'Add qualifying items to use this coupon' : 'Click to apply'}
                          disabled={!isEligible && !isApplied}
                        >
                          <span>{code}</span>
                          {!isEligible && <span className="text-[8px] font-bold text-red-500">(Not Eligible)</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <p className="text-[10px] text-myntra-gray font-semibold leading-relaxed">
                  💡 Complete collection challenges in your <Link to="/passport" className="text-myntra-pink hover:underline font-bold">Fashion Passport</Link> to unlock discount coupons!
                </p>
              )}
            </div>

            <hr className="border-gray-100" />

            {/* Totals */}
            {(() => {
              // Re-run totals logic locally within render block
              let finalSubtotal = cartSubtotal;
              let finalBagDiscount = cartDiscount;
              let finalCartTotal = cartSubtotal - cartDiscount;
              let finalShippingPrice = shippingPrice;
              let couponDiscountAmount = 0;

              if (appliedCoupon) {
                if (appliedCoupon.type === 'discount') {
                  couponDiscountAmount = Math.round(finalCartTotal * appliedCoupon.value);
                  finalCartTotal = Math.max(0, finalCartTotal - couponDiscountAmount);
                } else if (appliedCoupon.type === 'shipping') {
                  finalShippingPrice = 0;
                }
              }

              const finalGrandTotal = finalCartTotal + finalShippingPrice;

              return (
                <>
                  <div className="space-y-2 text-xs font-medium text-myntra-dark">
                    <div className="flex justify-between">
                      <span className="text-myntra-gray">Bag Subtotal</span>
                      <span>₹{finalSubtotal.toLocaleString('en-IN')}</span>
                    </div>
                    {finalBagDiscount > 0 && (
                      <div className="flex justify-between">
                        <span className="text-myntra-gray">Bag Discount</span>
                        <span className="text-green-600">-₹{finalBagDiscount.toLocaleString('en-IN')}</span>
                      </div>
                    )}
                    {appliedCoupon && appliedCoupon.type === 'discount' && (
                      <div className="flex justify-between">
                        <span className="text-myntra-pink font-extrabold">Passport Coupon ({appliedCoupon.code})</span>
                        <span className="text-green-600 font-extrabold">-₹{couponDiscountAmount.toLocaleString('en-IN')}</span>
                      </div>
                    )}
                    {appliedCoupon && appliedCoupon.type === 'shipping' && (
                      <div className="flex justify-between">
                        <span className="text-myntra-pink font-extrabold">Passport Coupon ({appliedCoupon.code})</span>
                        <span className="text-green-600 font-extrabold">Free Shipping Applied</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-myntra-gray">Shipping</span>
                      <span>{finalShippingPrice === 0 ? 'FREE' : `₹${finalShippingPrice}`}</span>
                    </div>
                  </div>

                  <hr className="border-gray-100" />

                  <div className="flex justify-between items-baseline font-black text-sm text-myntra-dark">
                    <span>Total Payable</span>
                    <span className="text-base text-myntra-pink">₹{finalGrandTotal.toLocaleString('en-IN')}</span>
                  </div>
                </>
              );
            })()}

            <button
              onClick={handlePlaceOrder}
              disabled={loading}
              className={`w-full py-3 bg-myntra-pink hover:bg-myntra-pinkHover text-white font-bold rounded shadow transition-all duration-200 uppercase tracking-wider text-xs ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Processing Order...' : 'Pay & Place Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
