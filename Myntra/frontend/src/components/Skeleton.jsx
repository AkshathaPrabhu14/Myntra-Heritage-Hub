import React from 'react';

export const SkeletonLine = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`}></div>
);

export const ProductCardSkeleton = () => {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col justify-between h-[380px]">
      <div className="relative pt-[115%] bg-gray-200 animate-pulse"></div>
      <div className="p-4 flex-grow flex flex-col justify-between space-y-3">
        <div>
          <div className="flex justify-between items-center mb-2">
            <SkeletonLine className="h-3 w-1/3" />
            <SkeletonLine className="h-4 w-1/4" />
          </div>
          <SkeletonLine className="h-5 w-5/6 mb-2" />
          <div className="flex space-x-1">
            <SkeletonLine className="h-3 w-12" />
            <SkeletonLine className="h-3 w-12" />
          </div>
        </div>
        <div className="flex items-baseline space-x-2 pt-2 border-t border-gray-50">
          <SkeletonLine className="h-5 w-1/3" />
          <SkeletonLine className="h-4 w-1/4" />
        </div>
      </div>
    </div>
  );
};

export const ProductDetailsSkeleton = () => {
  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8 md:py-16 mt-[80px] md:mt-[90px] animate-fade-in">
      {/* Breadcrumb skeleton */}
      <div className="flex items-center space-x-2 mb-6">
        <SkeletonLine className="h-4 w-16" />
        <span className="text-gray-300">/</span>
        <SkeletonLine className="h-4 w-20" />
        <span className="text-gray-300">/</span>
        <SkeletonLine className="h-4 w-32" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
        {/* Gallery Skeletons */}
        <div className="space-y-4">
          <div className="aspect-[4/5] bg-gray-200 rounded-xl animate-pulse"></div>
          <div className="grid grid-cols-4 gap-4">
            <div className="aspect-square bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="aspect-square bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="aspect-square bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="aspect-square bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
        </div>

        {/* Info Skeletons */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <SkeletonLine className="h-6 w-32" />
              <SkeletonLine className="h-6 w-20" />
            </div>
            <SkeletonLine className="h-8 w-4/5 mb-3" />
            <SkeletonLine className="h-5 w-24 mb-4" />
          </div>

          <div className="py-4 border-y border-gray-100 flex items-baseline space-x-4">
            <SkeletonLine className="h-8 w-28" />
            <SkeletonLine className="h-5 w-20" />
            <SkeletonLine className="h-5 w-16" />
          </div>

          <div className="space-y-2">
            <SkeletonLine className="h-4 w-full" />
            <SkeletonLine className="h-4 w-full" />
            <SkeletonLine className="h-4 w-3/4" />
          </div>

          <div className="flex space-x-4 pt-4">
            <div className="h-12 bg-gray-200 rounded-md animate-pulse flex-1"></div>
            <div className="h-12 bg-gray-200 rounded-md animate-pulse flex-1"></div>
          </div>

          <div className="pt-6 border-t border-gray-100 space-y-4">
            <SkeletonLine className="h-6 w-1/3" />
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 border border-gray-100 rounded-lg space-y-2">
                <SkeletonLine className="h-4 w-1/2" />
                <SkeletonLine className="h-4 w-3/4" />
              </div>
              <div className="p-4 border border-gray-100 rounded-lg space-y-2">
                <SkeletonLine className="h-4 w-1/2" />
                <SkeletonLine className="h-4 w-3/4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
