import { createContext, useContext, useState } from "react";

const AnimeCacheContext = createContext();

export function AnimeCacheProvider({ children }) {
  const [cache, setCache] = useState({});
  return (
    <AnimeCacheContext.Provider value={{ cache, setCache }}>
      {children}
    </AnimeCacheContext.Provider>
  );
}

export function useAnimeCache() {
  return useContext(AnimeCacheContext);
}
