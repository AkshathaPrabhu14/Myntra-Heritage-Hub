import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import IndiaMap from '../components/IndiaMap';
import ProductCard from '../components/ProductCard';
import api from '../services/api';
import {
  Award,
  Compass,
  Crown,
  Gift,
  CheckCircle2,
  Lock,
  Sparkles,
  Copy,
  ChevronRight,
  Loader2,
  MapPin,
  Package,
  Layers,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

const ALL_28_STATES = [
  { name: 'Jammu & Kashmir', dbName: 'jammu & kashmir', craft: 'Pashmina Weaving', icon: '🏔️' },
  { name: 'Himachal Pradesh', dbName: 'himachal pradesh', craft: 'Kullu Shawls', icon: '🏔️' },
  { name: 'Punjab', dbName: 'punjab', craft: 'Phulkari Embroidery', icon: '🌾' },
  { name: 'Uttarakhand', dbName: 'uttarakhand', craft: 'Aipan Art', icon: '⛰️' },
  { name: 'Haryana', dbName: 'haryana', craft: 'Terracotta Pottery', icon: '🏺' },
  { name: 'Uttar Pradesh', dbName: 'uttar pradesh', craft: 'Chikankari & Banarasi Silk', icon: '🕌' },
  { name: 'Rajasthan', dbName: 'rajasthan', craft: 'Blue Pottery & Bandhani', icon: '🏰' },
  { name: 'Gujarat', dbName: 'gujarat', craft: 'Patan Patola Silk', icon: '💃' },
  { name: 'Madhya Pradesh', dbName: 'madhya pradesh', craft: 'Chanderi Handlooms', icon: '🏛️' },
  { name: 'Chhattisgarh', dbName: 'chhattisgarh', craft: 'Bell Metal Craft', icon: '🔔' },
  { name: 'Bihar', dbName: 'bihar', craft: 'Madhubani Art', icon: '🎨' },
  { name: 'Jharkhand', dbName: 'jharkhand', craft: 'Dokra Metal Art', icon: '🏺' },
  { name: 'West Bengal', dbName: 'west bengal', craft: 'Kantha Stitch & Jamdani', icon: '🎨' },
  { name: 'Odisha', dbName: 'odisha', craft: 'Sambalpuri Ikat', icon: '🌊' },
  { name: 'Sikkim', dbName: 'sikkim', craft: 'Thangka Weaving', icon: '🏔️' },
  { name: 'Assam', dbName: 'assam', craft: 'Rare Muga Silk', icon: '🦏' },
  { name: 'Arunachal Pradesh', dbName: 'arunachal pradesh', craft: 'Carpet Weaving', icon: '🌄' },
  { name: 'Nagaland', dbName: 'nagaland', craft: 'Naga Shawls', icon: '🏹' },
  { name: 'Manipur', dbName: 'manipur', craft: 'Kauna Craft', icon: '🌿' },
  { name: 'Mizoram', dbName: 'mizoram', craft: 'Puan Textiles', icon: '🌿' },
  { name: 'Tripura', dbName: 'tripura', craft: 'Bamboo Handicrafts', icon: '🎋' },
  { name: 'Meghalaya', dbName: 'meghalaya', craft: 'Cane Weaving', icon: '🌧️' },
  { name: 'Maharashtra', dbName: 'maharashtra', craft: 'Paithani Silk & Warli Art', icon: '🚩' },
  { name: 'Goa', dbName: 'goa', craft: 'Kunbi Weaving', icon: '🏖️' },
  { name: 'Karnataka', dbName: 'karnataka', craft: 'Mysore Silk & Channapatna Toys', icon: '🐘' },
  { name: 'Kerala', dbName: 'kerala', craft: 'Kasavu & Aranmula Mirror', icon: '🌴' },
  { name: 'Tamil Nadu', dbName: 'tamil nadu', craft: 'Kanchipuram Silk & Tanjore Art', icon: '🛕' },
  { name: 'Andhra Pradesh', dbName: 'andhra pradesh', craft: 'Kalamkari & Kondapalli Toys', icon: '🍇' },
];

const Passport = () => {
  const { user, isAuthenticated, loading: authLoading } = useContext(AuthContext);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [passportData, setPassportData] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('badges'); // badges, map, crafts, milestones, challenges, rewards

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, authLoading, navigate]);

  useEffect(() => {
    const fetchPassport = async () => {
      if (!isAuthenticated) return;
      try {
        const [passRes, recRes] = await Promise.all([
          api.get('/passport'),
          api.get('/passport/recommendations'),
        ]);

        if (passRes.data.success) {
          setPassportData(passRes.data.data);
        }
        if (recRes.data.success) {
          setRecommendations(recRes.data.data);
        }
      } catch (error) {
        console.error('Error loading passport:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPassport();
  }, [isAuthenticated]);

  const copyCoupon = (code) => {
    navigator.clipboard.writeText(code);
    showToast(`Coupon code ${code} copied to clipboard!`, 'success');
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center mt-[80px]">
        <Loader2 className="w-10 h-10 text-myntra-pink animate-spin" />
      </div>
    );
  }

  const unlockedStateNames = (passportData?.unlockedStates || []).map((s) =>
    s.state.toLowerCase().trim()
  );

  const unlockedStatesMap = {};
  (passportData?.unlockedStates || []).forEach((item) => {
    unlockedStatesMap[item.state.toLowerCase().trim()] = item;
  });

  const totalStates = passportData?.totalStatesCollected || 0;
  const progressPercent = passportData?.passportProgress || 0;
  const totalCrafts = passportData?.totalCraftsCollected || 0;

  // Next milestone calculation
  const milestones = passportData?.milestones || [];
  const nextMilestone = milestones.find((m) => !m.unlocked) || {
    title: 'Heritage Guardian',
    reward: 'Exclusive Heritage Guardian Badge',
    count: 28,
  };
  const statesToNext = nextMilestone ? Math.max(0, nextMilestone.count - totalStates) : 0;

  return (
    <div className="min-h-screen bg-slate-50/50 text-myntra-dark mt-[80px] md:mt-[90px] pb-20">
      {/* HERO PASSPORT HEADER - MYNTRA CLEAN STYLE */}
      <div className="bg-gradient-to-r from-pink-50/80 via-white to-orange-50/60 border-b border-gray-150 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1300px] mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            {/* Title & Patron Info */}
            <div className="text-center lg:text-left space-y-3">
              <div className="inline-flex items-center space-x-2 bg-pink-100/80 text-myntra-pink border border-pink-200 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
                <Award className="w-3.5 h-3.5 text-myntra-pink" />
                <span>Cultural Loyalty Program</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-myntra-dark tracking-tight">
                Fashion Passport
              </h1>
              <p className="text-sm sm:text-base text-myntra-gray max-w-xl font-medium leading-relaxed">
                Discover India's diverse heritage crafts and support regional artisans. Earn collectible state badges and unlock exclusive Myntra rewards with every completed order.
              </p>
              {user && (
                <div className="pt-2 flex items-center justify-center lg:justify-start space-x-3">
                  <div className="w-10 h-10 rounded-full bg-myntra-pink text-white font-extrabold flex items-center justify-center text-lg shadow-sm">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <span className="block text-[10px] text-myntra-gray font-extrabold uppercase tracking-wider">Passport Holder</span>
                    <span className="text-sm font-bold text-myntra-dark">{user.name}</span>
                  </div>
                </div>
              )}
            </div>

            {/* PASSPORT PROGRESS CARD - LIGHT & ELEGANT */}
            <div className="w-full lg:w-[480px] bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm space-y-5">
              <div className="flex justify-between items-baseline border-b border-gray-100 pb-4">
                <div>
                  <span className="text-[11px] font-bold uppercase text-myntra-pink tracking-wider block mb-1">
                    States Collected
                  </span>
                  <div className="flex items-baseline space-x-1.5">
                    <span className="text-3xl font-black text-myntra-dark">{totalStates}</span>
                    <span className="text-myntra-gray font-bold text-base">/ 28 States</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-bold uppercase text-orange-500 tracking-wider block mb-1">
                    Completion
                  </span>
                  <span className="text-3xl font-black text-myntra-dark">{progressPercent}%</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5">
                <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden p-0.5 border border-gray-200">
                  <div
                    className="bg-gradient-to-r from-myntra-pink to-orange-400 h-full rounded-full transition-all duration-1000 shadow-sm"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] font-bold text-myntra-gray pt-1">
                  <span>0 States</span>
                  <span>{totalCrafts} Crafts Collected</span>
                  <span>28 States</span>
                </div>
              </div>

              {/* Next Reward Alert Box */}
              {nextMilestone && (
                <div className="bg-pink-50/60 border border-pink-150 rounded-xl p-3.5 flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-lg bg-myntra-pink text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Gift className="w-5 h-5" />
                  </div>
                  <div className="text-xs">
                    <span className="text-[10px] font-extrabold text-myntra-pink uppercase tracking-wider block">
                      Next Reward Goal
                    </span>
                    <p className="font-extrabold text-myntra-dark text-sm">
                      {nextMilestone.reward}
                    </p>
                    {statesToNext > 0 ? (
                      <p className="text-myntra-gray text-[11px] mt-0.5 font-medium">
                        Only <strong className="text-myntra-pink">{statesToNext} state{statesToNext > 1 ? 's' : ''}</strong> remaining to unlock!
                      </p>
                    ) : (
                      <p className="text-emerald-600 text-[11px] font-bold">Reward Unlocked!</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* NAVIGATION TABS - MYNTRA LIGHT TABS */}
      <div className="sticky top-[80px] md:top-[90px] bg-white/95 backdrop-blur border-b border-gray-200 z-30 py-3 px-4 shadow-sm">
        <div className="max-w-[1300px] mx-auto flex items-center justify-start overflow-x-auto space-x-2 no-scrollbar">
          {[
            { id: 'badges', label: 'Collectible Badges', icon: Award },
            { id: 'map', label: 'Interactive India Map', icon: Compass },
            { id: 'crafts', label: 'Craft Collection', icon: Layers },
            { id: 'milestones', label: 'Milestones', icon: ShieldCheck },
            { id: 'challenges', label: 'Collection Challenges', icon: Crown },
            { id: 'rewards', label: 'My Rewards Hub', icon: Gift },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? 'bg-myntra-pink text-white shadow-sm'
                    : 'bg-gray-100 text-myntra-dark hover:bg-gray-200 font-bold'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* MAIN CONTAINER CONTENT */}
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-12">
        {/* TAB 1: COLLECTIBLE STATE BADGES */}
        {activeTab === 'badges' && (
          <section className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-200 pb-4">
              <div>
                <h2 className="text-2xl font-black text-myntra-dark flex items-center space-x-2">
                  <Award className="text-myntra-pink w-6 h-6" />
                  <span>State Heritage Badges</span>
                </h2>
                <p className="text-xs text-myntra-gray font-semibold mt-1">
                  Complete orders to earn official digital heritage stamps for each Indian state.
                </p>
              </div>
              <div className="mt-3 sm:mt-0 text-xs font-bold bg-pink-50 text-myntra-pink px-3 py-1.5 rounded-full border border-pink-100">
                {totalStates} / 28 Unlocked
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
              {ALL_28_STATES.map((st, idx) => {
                const isUnlocked = unlockedStateNames.includes(st.dbName.toLowerCase());
                const unlockData = unlockedStatesMap[st.dbName.toLowerCase()];

                return (
                  <div
                    key={idx}
                    onClick={() => navigate(`/heritage/${st.dbName.replace(/\s+/g, '-')}`)}
                    className={`relative rounded-2xl p-4 flex flex-col items-center justify-between text-center cursor-pointer transition-all duration-300 group overflow-hidden border ${
                      isUnlocked
                        ? 'bg-white border-pink-200 shadow-sm hover:shadow-md hover:border-myntra-pink hover:scale-102'
                        : 'bg-gray-50/80 border-gray-200 opacity-70 hover:opacity-100 hover:border-gray-300'
                    }`}
                  >
                    {/* Badge Status Top Right */}
                    <div className="absolute top-2 right-2">
                      {isUnlocked ? (
                        <span className="w-5 h-5 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-xs">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </span>
                      ) : (
                        <span className="w-5 h-5 bg-gray-200 text-gray-400 rounded-full flex items-center justify-center">
                          <Lock className="w-3 h-3" />
                        </span>
                      )}
                    </div>

                    {/* Stamp Circular Emblem */}
                    <div
                      className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl my-2 border transition duration-300 ${
                        isUnlocked
                          ? 'bg-pink-50 border-myntra-pink text-myntra-pink shadow-xs group-hover:scale-110'
                          : 'bg-gray-100 border-gray-200 text-gray-400'
                      }`}
                    >
                      {st.icon}
                    </div>

                    {/* Info */}
                    <div className="w-full space-y-1 mt-1">
                      <h4 className="font-bold text-xs text-myntra-dark truncate group-hover:text-myntra-pink transition">
                        {st.name}
                      </h4>
                      <p className="text-[10px] text-myntra-pink font-semibold line-clamp-1">
                        {st.craft}
                      </p>
                      <div className="pt-2 border-t border-gray-100 text-[9px] font-semibold text-myntra-gray">
                        {isUnlocked ? (
                          <span className="text-emerald-600 font-extrabold block">
                            Unlocked {unlockData?.unlockedAt ? new Date(unlockData.unlockedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : ''}
                          </span>
                        ) : (
                          <span className="text-gray-400 italic block">Not Collected</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* TAB 2: INTERACTIVE INDIA MAP */}
        {activeTab === 'map' && (
          <section className="space-y-6 animate-fade-in">
            <div className="text-center max-w-xl mx-auto space-y-1.5">
              <span className="text-xs font-bold uppercase text-myntra-pink tracking-widest">
                Geographic Exploration
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-myntra-dark">
                Interactive State Discovery Map
              </h2>
              <p className="text-xs text-myntra-gray font-semibold">
                States highlighted in Myntra Pink represent crafts you have unlocked through orders. Grey states await your discovery!
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <IndiaMap unlockedStates={passportData?.unlockedStates || []} isPassportMode={true} />
            </div>
          </section>
        )}

        {/* TAB 3: CRAFT COLLECTION */}
        {activeTab === 'crafts' && (
          <section className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center border-b border-gray-200 pb-4">
              <div>
                <h2 className="text-2xl font-black text-myntra-dark flex items-center space-x-2">
                  <Layers className="text-myntra-pink w-6 h-6" />
                  <span>Artisan Craft Collection</span>
                </h2>
                <p className="text-xs text-myntra-gray font-semibold mt-1">
                  Every unique traditional craft form acquired in your heritage journey.
                </p>
              </div>
              <span className="text-xs font-bold bg-pink-50 text-myntra-pink border border-pink-200 px-3 py-1 rounded-full">
                {totalCrafts} Crafts Collected
              </span>
            </div>

            {(passportData?.collectedCrafts || []).length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center space-y-4 shadow-sm">
                <Package className="w-12 h-12 text-gray-300 mx-auto" />
                <h3 className="text-lg font-bold text-myntra-dark">No Crafts Collected Yet</h3>
                <p className="text-xs text-myntra-gray max-w-md mx-auto">
                  Place an order for any heritage product to unlock your first artisan craft badge!
                </p>
                <Link
                  to="/heritage"
                  className="inline-flex items-center space-x-2 px-5 py-2.5 bg-myntra-pink text-white font-bold text-xs rounded-lg hover:bg-myntra-pinkHover transition shadow"
                >
                  <span>Explore Heritage Hub</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {(passportData?.collectedCrafts || []).map((craft, idx) => (
                  <div
                    key={idx}
                    className="bg-white border border-gray-200 rounded-2xl p-5 space-y-3 hover:border-myntra-pink transition shadow-sm flex flex-col justify-between"
                  >
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-myntra-pink bg-pink-50 px-2 py-0.5 rounded border border-pink-100 capitalize">
                          {craft.state}
                        </span>
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      </div>
                      <h3 className="font-extrabold text-base text-myntra-dark">{craft.craftName}</h3>
                      <p className="text-xs text-myntra-gray font-medium line-clamp-2">
                        Product: <strong className="text-myntra-dark">{craft.productPurchased}</strong>
                      </p>
                    </div>

                    <div className="pt-3 border-t border-gray-100 flex justify-between items-center text-[10px] text-myntra-gray">
                      <span>Acquired</span>
                      <span className="font-bold text-myntra-dark">
                        {new Date(craft.purchaseDate).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* TAB 4: MILESTONES */}
        {activeTab === 'milestones' && (
          <section className="space-y-6 animate-fade-in">
            <div className="border-b border-gray-200 pb-4">
              <h2 className="text-2xl font-black text-myntra-dark flex items-center space-x-2">
                <ShieldCheck className="text-myntra-pink w-6 h-6" />
                <span>Loyalty Milestones</span>
              </h2>
              <p className="text-xs text-myntra-gray font-semibold mt-1">
                Reach state collection milestones to unlock exclusive coupons, free shipping, and guardian badges.
              </p>
            </div>

            <div className="space-y-4">
              {milestones.map((m, idx) => (
                <div
                  key={idx}
                  className={`border rounded-2xl p-5 transition flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                    m.unlocked
                      ? 'bg-white border-emerald-200 shadow-sm'
                      : 'bg-gray-50/70 border-gray-200 opacity-75'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg flex-shrink-0 ${
                        m.unlocked
                          ? 'bg-myntra-pink text-white shadow-xs'
                          : 'bg-gray-200 text-gray-500 border border-gray-300'
                      }`}
                    >
                      {m.count}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-bold text-base text-myntra-dark">{m.title}</h3>
                        <span className="text-[10px] text-myntra-gray font-bold">
                          ({m.count} State{m.count > 1 ? 's' : ''})
                        </span>
                      </div>
                      <p className="text-xs text-myntra-pink font-semibold mt-0.5">{m.reward}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 w-full md:w-auto justify-between md:justify-end">
                    {m.unlocked ? (
                      <>
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full flex items-center space-x-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Unlocked</span>
                        </span>
                        {m.isUsed ? (
                          <span className="text-xs font-bold text-gray-500 bg-gray-150 border border-gray-200 px-3.5 py-1.5 rounded-xl flex items-center space-x-1">
                            <span>Claimed</span>
                          </span>
                        ) : (
                          <button
                            onClick={() => copyCoupon(m.couponCode)}
                            className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-pink-50 text-myntra-pink hover:bg-myntra-pink hover:text-white border border-pink-200 rounded-xl text-xs font-bold transition"
                          >
                            <Copy className="w-3.5 h-3.5" />
                            <span>{m.couponCode}</span>
                          </button>
                        )}
                      </>
                    ) : (
                      <span className="text-xs font-bold text-gray-500 bg-gray-100 border border-gray-200 px-3 py-1 rounded-full flex items-center space-x-1">
                        <Lock className="w-3.5 h-3.5" />
                        <span>Requires {m.count - totalStates} more state{m.count - totalStates > 1 ? 's' : ''}</span>
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* TAB 5: COLLECTION CHALLENGES */}
        {activeTab === 'challenges' && (
          <section className="space-y-6 animate-fade-in">
            <div className="border-b border-gray-200 pb-4">
              <h2 className="text-2xl font-black text-myntra-dark flex items-center space-x-2">
                <Crown className="text-orange-500 w-6 h-6" />
                <span>Regional & Artisan Collection Challenges</span>
              </h2>
              <p className="text-xs text-myntra-gray font-semibold mt-1">
                Collect specific clusters of regional states or signature textile traditions to complete challenges.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(passportData?.challenges || []).map((ch, idx) => (
                <div
                  key={idx}
                  className={`border rounded-2xl p-6 space-y-4 flex flex-col justify-between transition ${
                    ch.isCompleted
                      ? 'bg-white border-pink-200 shadow-sm'
                      : 'bg-gray-50/70 border-gray-200'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-extrabold text-lg text-myntra-dark">{ch.title}</h3>
                        <p className="text-xs text-myntra-pink font-bold mt-0.5">Reward: {ch.reward}</p>
                      </div>
                      {ch.isCompleted ? (
                        <span className="bg-emerald-600 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-xs">
                          COMPLETED ✓
                        </span>
                      ) : (
                        <span className="bg-gray-200 text-myntra-dark text-[10px] font-bold px-2.5 py-1 rounded-full">
                          {ch.completedItems} / {ch.totalItems} Done
                        </span>
                      )}
                    </div>

                    {/* Progress Checklist */}
                    <div className="grid grid-cols-2 gap-2 pt-2">
                      {(ch.states.length > 0 ? ch.states : ch.crafts).map((item, itemIdx) => {
                        const isDone = ch.states.length > 0
                          ? unlockedStateNames.includes(item.toLowerCase())
                          : (passportData?.collectedCrafts || []).some((c) =>
                              c.craftName.toLowerCase().includes(item.toLowerCase())
                            );
                        return (
                          <div
                            key={itemIdx}
                            className={`flex items-center space-x-2 text-xs p-2 rounded-xl border ${
                              isDone
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-800 font-bold'
                                : 'bg-white border-gray-200 text-myntra-gray font-medium'
                            }`}
                          >
                            {isDone ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                            ) : (
                              <div className="w-3.5 h-3.5 rounded-full border border-gray-300 flex-shrink-0" />
                            )}
                            <span className="capitalize truncate">{item}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {ch.isCompleted && (
                    <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                      <span className="text-xs text-myntra-gray font-semibold">Coupon Code:</span>
                      {ch.isUsed ? (
                        <span className="text-xs font-bold text-gray-500 bg-gray-100 border border-gray-200 px-3 py-1 rounded-lg">
                          Claimed
                        </span>
                      ) : (
                        <button
                          onClick={() => copyCoupon(ch.couponCode)}
                          className="px-3 py-1 bg-myntra-pink text-white text-xs font-bold rounded-lg hover:bg-myntra-pinkHover transition flex items-center space-x-1 shadow-xs"
                        >
                          <Copy className="w-3.5 h-3" />
                          <span>{ch.couponCode}</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* TAB 6: MY REWARDS HUB */}
        {activeTab === 'rewards' && (
          <section className="space-y-6 animate-fade-in">
            <div className="border-b border-gray-200 pb-4">
              <h2 className="text-2xl font-black text-myntra-dark flex items-center space-x-2">
                <Gift className="text-myntra-pink w-6 h-6" />
                <span>Unlocked Functional Rewards</span>
              </h2>
              <p className="text-xs text-myntra-gray font-semibold mt-1">
                Coupons and benefits automatically awarded based on your heritage passport progress.
              </p>
            </div>

            {(passportData?.rewardsUnlocked || []).length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center space-y-4 shadow-sm">
                <Gift className="w-12 h-12 text-gray-300 mx-auto" />
                <h3 className="text-lg font-bold text-myntra-dark">No Rewards Unlocked Yet</h3>
                <p className="text-xs text-myntra-gray max-w-md mx-auto">
                  Unlock your first reward by placing an order and acquiring your 1st State Badge!
                </p>
                <Link
                  to="/heritage"
                  className="inline-flex items-center space-x-2 px-5 py-2.5 bg-myntra-pink text-white font-bold text-xs rounded-lg hover:bg-myntra-pinkHover transition shadow"
                >
                  <span>Shop Heritage Collection</span>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(passportData?.rewardsUnlocked || []).map((reward, idx) => (
                  <div
                    key={idx}
                    className="bg-white border border-pink-150 rounded-2xl p-6 shadow-sm hover:shadow-md transition space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-extrabold uppercase text-myntra-pink bg-pink-50 px-2.5 py-0.5 rounded-full border border-pink-100">
                          Active Reward
                        </span>
                        <Sparkles className="w-4 h-4 text-orange-500" />
                      </div>
                      <h3 className="font-extrabold text-lg text-myntra-dark">{reward.title}</h3>
                      <p className="text-xs text-myntra-gray leading-relaxed font-medium">{reward.description}</p>
                    </div>

                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                      {reward.isUsed ? (
                        <div>
                          <span className="block text-[9px] font-bold text-myntra-gray uppercase">Status</span>
                          <span className="font-mono text-sm font-black text-gray-500">USED / CLAIMED</span>
                        </div>
                      ) : (
                        <>
                          <div>
                            <span className="block text-[9px] font-bold text-myntra-gray uppercase">Use Coupon Code</span>
                            <span className="font-mono text-sm font-black text-myntra-pink">{reward.couponCode}</span>
                          </div>
                          <button
                            onClick={() => copyCoupon(reward.couponCode)}
                            className="px-3.5 py-2 bg-myntra-pink text-white text-xs font-bold rounded-lg hover:bg-myntra-pinkHover transition shadow-xs"
                          >
                            Copy Code
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* SMART RECOMMENDATIONS ("Complete your Heritage Journey") */}
        {recommendations.length > 0 && (
          <section className="space-y-6 pt-10 border-t border-gray-200">
            <div className="flex justify-between items-end">
              <div>
                <span className="text-xs font-extrabold uppercase text-myntra-pink tracking-widest">
                  Smart Recommendations
                </span>
                <h2 className="text-2xl font-black text-myntra-dark mt-1">
                  Complete Your Heritage Journey
                </h2>
                <p className="text-xs text-myntra-gray font-semibold">
                  Handcrafted products from Indian states you have not yet explored.
                </p>
              </div>
              <Link
                to="/heritage"
                className="text-xs font-bold text-myntra-pink hover:text-myntra-dark transition flex items-center space-x-1"
              >
                <span>View All States</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {recommendations.map((prod) => (
                <ProductCard key={prod._id} product={prod} passportStates={unlockedStateNames} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default Passport;
