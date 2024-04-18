import React, { useState } from "react";

const useStateHooks = (initialState) => {
  const [state, setState] = useState(initialState);

  const resetState = () => {
    setState(initialState);
  };

  return [state, setState, resetState];
};

export default useStateHooks;
