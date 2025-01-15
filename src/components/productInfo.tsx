// @ts-nocheck

import React from 'react';
import { useSelector } from 'react-redux';
import { twMerge } from 'tailwind-merge';
import { currentProduct } from '../redux/productSlice';

export const ProductInfo = ({ className }: { className: string }) => {
  const product = useSelector(currentProduct);

  if (product.length === 0) {
    return <div>No product available.</div>;
  }

  return (
    <div className={twMerge(className, 'product-container')}>
      <div className="product-info flex flex-col items-center gap-2 py-3 px-6">
        <img src={product.image} alt={product.title} width={170} />
        <p className="product-title text-primary font-bold text-xl">
          {product.title}
        </p>
        <p className="product-subtitle text-lightBlue text-center">
          {product.subtitle}
        </p>
      </div>
      <div className="product-tags flex flex-wrap gap-2 px-6 py-3 border-y text-sm">
        {(product.tags || []).map((item, index: number) => (
          <span
            key={index}
            className="product-tag border border-lightBlue text-primary px-4 py-0.5 rounded">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
};
