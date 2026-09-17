import React, { useState } from 'react';
import { Search } from 'lucide-react';

export const DataTable = ({
  columns,
  data = [],
  searchPlaceholder = 'Search records...',
  searchField,
  loading = false,
  emptyMessage = 'No records found',
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = data.filter((item) => {
    if (!searchTerm.trim()) return true;
    if (searchField) {
      const val = item[searchField];
      return String(val || '')
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    }
    // Search across all string fields
    return Object.values(item).some((val) =>
      String(val || '')
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="bg-white rounded-3xl border border-parchment-200 overflow-hidden shadow-soft-sm">
      {/* Search Bar Header */}
      <div className="p-4 border-b border-parchment-200 flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-espresso-700 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl bg-parchment-50 border border-parchment-200 text-espresso-900 focus:outline-none focus:border-henna-700"
          />
        </div>
        <div className="text-xs text-espresso-700">
          Showing <span className="font-semibold text-espresso-900">{filteredData.length}</span> records
        </div>
      </div>

      {/* Table Body */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs sm:text-sm">
          <thead>
            <tr className="bg-parchment-50/75 border-b border-parchment-200 text-espresso-700 uppercase tracking-wider text-[11px] font-semibold">
              {columns.map((col, idx) => (
                <th key={idx} className="py-3 px-4 sm:px-6">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-parchment-100">
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="py-12 text-center text-espresso-700">
                  Loading records...
                </td>
              </tr>
            ) : filteredData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-12 text-center text-espresso-700">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              filteredData.map((row, rowIdx) => (
                <tr key={row._id || rowIdx} className="hover:bg-parchment-50/60 transition-colors">
                  {columns.map((col, colIdx) => (
                    <td key={colIdx} className="py-3.5 px-4 sm:px-6 text-espresso-900">
                      {col.render ? col.render(row) : row[col.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
