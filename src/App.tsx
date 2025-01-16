// @ts-nocheck

import React, { useEffect } from 'react';
import './App.css';
import { useDispatch } from 'react-redux';
import { ProductInfo } from './components/productInfo';
import { Table } from './components/table';
import { fetchProducts } from './redux/productSlice';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-primary text-white p-4">
        <img
          src={`${process.env.PUBLIC_URL}/stackline_logo.svg`}
          className="Stackline-logo"
          width="120"
          height="auto"
          alt="logo"
        />
      </header>
      <main className="flex-grow bg-secondary px-4 py-8 grid grid-cols-[300px_auto] grid-rows-[auto_auto] gap-x-4 gap-y-4">
        <ProductInfo className="col-start-1 col-end-1 row-start-1 row-end-1 container" />
        <Table className="col-start-2 col-end-2 row-start-1 row-end-2 container overflow-x-auto" />
      </main>
    </div>
  );
}

export default App;
