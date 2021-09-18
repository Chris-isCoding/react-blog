import { createContext, useState, useEffect } from 'react';

const DataContext = createContext({});

const DataProvider = ({ children }) => {
  return (
    <DataContext.Provider value={{}}>{children}</DataContext.Provider>
  );
};

export { DataContext, DataProvider };
