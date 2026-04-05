import React, { type ReactNode, useState } from "react";
import { Member } from "../../lib/types/member";
import { GlobalContext } from "../hooks/useGlobals";

const ContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  /**
   * Removed: cookies.get("accessToken") check
   *
   * Our JWT cookie is HttpOnly (secure) — JavaScript CANNOT read it.
   * So cookies.get("accessToken") always returns undefined,
   * which was clearing localStorage on every page refresh.
   *
   * Instead, we trust localStorage for auth state.
   * If the token expires, the backend will return 401
   * and we handle logout at that point.
   */
  const [authMember, setAuthMember] = useState<Member | null>(
    localStorage.getItem("memberData")
      ? JSON.parse(localStorage.getItem("memberData") as string)
      : null
  );

  const [orderBuilder, setOrderBuilder] = useState<Date>(new Date());

  return (
    <GlobalContext.Provider
      value={{ authMember, setAuthMember, orderBuilder, setOrderBuilder }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default ContextProvider;
