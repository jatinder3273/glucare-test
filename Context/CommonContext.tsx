import React, { createContext, useEffect, useState } from "react";

interface IProps {
  children: React.ReactNode;
}

type ICommonProps = {
  toggle: boolean;
  setToggle: (param: boolean) => void;
};

export const ToggleContext = createContext<ICommonProps>({
  toggle: false,
  setToggle: () => {},
} as ICommonProps);

const CommonContext = ({ children }: IProps) => {
  const [toggle, setToggle] = useState<boolean>(false);

  return (
    <ToggleContext.Provider value={{ toggle, setToggle }}>
      {children}
    </ToggleContext.Provider>
  );
};

export default CommonContext;
