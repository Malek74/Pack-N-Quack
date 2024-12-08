import React, { createContext, useState } from "react";

const AuthContext = createContext({
  isAuth: false,
  token: " ",
  onLogin: () => {},
  onLogOut: () => {},
});

export default AuthContext;
