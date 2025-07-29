import React from "react";
import AppRoutes from "./routes/AppRoutes";
import Navbar from "./components/common/Navbar";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  return (
    <>
      <Navbar />
      {/* <AuthProvider> */}
        <AppRoutes />
      {/* </AuthProvider> */}
    </>
  );
}

export default App;
