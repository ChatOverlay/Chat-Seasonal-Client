import { createContext, useState, useContext } from 'react';
import PropTypes from 'prop-types';

const SharedStateContext = createContext();

export const useSharedState = () => useContext(SharedStateContext);

export const SharedStateProvider = ({ children }) => {
  const [newAdded, setNewAdded] = useState(false);

  const addNewData = () => {
    setNewAdded(true);
    setTimeout(() => setNewAdded(false), 500); // Reset after short delay
  };

  return (
    <SharedStateContext.Provider value={{ newAdded, addNewData }}>
      {children}
    </SharedStateContext.Provider>
  );
};

SharedStateProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
