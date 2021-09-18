import { createContext, useState, useEffect } from 'react';
import useWindowSize from '../hooks/useWindowSize';

const DataContext = createContext({});

const DataProvider = ({ children }) => {
  const { width } = useWindowSize();
  return (
    <DataContext.Provider value={{ width }}>
      {children}
    </DataContext.Provider>
  );
};

export { DataContext, DataProvider };
