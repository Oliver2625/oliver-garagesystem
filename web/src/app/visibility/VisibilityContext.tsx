import React, { createContext, useContext, useState } from "react";

type VisibilityContextValue = {
    visible: boolean;
    setVisible: (value: boolean) => void;
};

const VisibilityContext = createContext<VisibilityContextValue | null>(null);

export const VisibilityProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [visible, setVisible] = useState(false);
    return (
        <VisibilityContext.Provider value={{ visible, setVisible }}>
            {children}
        </VisibilityContext.Provider>
    );
};

export const useVisibility = (): VisibilityContextValue => {
    const ctx = useContext(VisibilityContext);
    if (!ctx) throw new Error("useVisibility must be used within VisibilityProvider");
    return ctx;
};


