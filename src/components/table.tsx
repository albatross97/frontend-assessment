import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  currentProduct,
  sortByColumn,
  Product,
  RootState,
  SalesData,
} from '../redux/productSlice';
import { ChevronDown } from 'lucide-react';

const dateFormatter = (dateStr: string) => {
  const date = new Date(dateStr);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2);

  return `${month}-${day}-${year}`;
};

const currencyFormatter = (currencyStr: number) => {
  return '$' + currencyStr.toLocaleString();
};

const CustomizedTh = ({
  field,
  display,
}: {
  field: string;
  display: string;
}) => {
  const dispatch = useDispatch();

  const sortingColumn = useSelector(
    (state: RootState) => state.product.sortingColumn
  );
  const sortingDirection = useSelector(
    (state: RootState) => state.product.sortingDirection
  );

  const handleSort = () => {
    const newDirection =
      sortingColumn === field && sortingDirection === 'asc' ? 'desc' : 'asc';
    dispatch(sortByColumn({ field, direction: newDirection }));
  };

  return (
    <th
      className="text-xs font-normal text-primary cursor-pointer px-8 py-6"
      onClick={handleSort}>
      <div className="flex items-center space-x-1">
        <span>{display}</span>
        <ChevronDown
          size={16}
          className={`text-lightBlue ${
            sortingColumn === field && sortingDirection === 'desc'
              ? 'rotate-180'
              : ''
          } ${sortingColumn === field && 'text-primary'}`}
        />
      </div>
    </th>
  );
};

export const Table = ({ className }: { className: string }) => {
  const product: Product = useSelector(currentProduct) as Product;
  const status = useSelector((state: RootState) => state.product.status);

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  if (status === 'failed') {
    return <p>Error loading table info.</p>;
  }

  if (Object.keys(product).length === 0) {
    return <div>No table info available.</div>;
  }

  return (
    <div className={className}>
      <table>
        <thead>
          <tr className="border-b">
            <CustomizedTh field="weekEnding" display="WEEK ENDING" />
            <CustomizedTh field="retailSales" display="RETAIL SALES" />
            <CustomizedTh field="wholesaleSales" display="WHOLESALE SALES" />
            <CustomizedTh field="unitsSold" display="UNITS SOLD" />
            <CustomizedTh field="retailerMargin" display="RETAILER MARGIN" />
          </tr>
        </thead>
        <tbody>
          {product.sales?.map((item: SalesData, index: number) => (
            <tr
              key={index}
              className="text-lightBlue border-b text-sm hover:bg-gray-100">
              <td className="table-cell">{dateFormatter(item.weekEnding)}</td>
              <td className="text-right table-cell">
                {currencyFormatter(item.retailSales)}
              </td>
              <td className="text-right table-cell">
                {currencyFormatter(item.wholesaleSales)}
              </td>
              <td className="text-right table-cell">
                {item.unitsSold.toLocaleString()}
              </td>
              <td className="text-right table-cell">
                {currencyFormatter(item.retailerMargin)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
