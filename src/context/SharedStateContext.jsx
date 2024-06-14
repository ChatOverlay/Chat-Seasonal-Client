import React, { createContext, useState, useContext } from 'react';

const SharedStateContext = createContext();

export const useSharedState = () => useContext(SharedStateContext);

export const SharedStateProvider = ({ children }) => {
  const [newAdded, setnewAdded] = useState(false);

  const addNewData = () => {
    setnewAdded(true);
    setTimeout(() => setnewAdded(false), 500); // Reset after short delay
  };

  return (
    <SharedStateContext.Provider value={{ newAdded, addNewData }}>
      {children}
    </SharedStateContext.Provider>
  );
};
