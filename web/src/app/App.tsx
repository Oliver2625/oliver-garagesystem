import React, { useEffect } from "react";
import ScaleFade from "@/transitions/ScaleFade";
import { useNuiEvent } from "@/hooks/useNuiEvent";
import Garage from "@/app/components/Garage";
import { fetchNui } from "@/utils/fetchNui";
import { VisibilityProvider, useVisibility } from "@/app/visibility/VisibilityContext";

const AppBody: React.FC = () => {
    const { visible, setVisible } = useVisibility();

    useNuiEvent<boolean>("showUi", (data) => {
        setVisible(data);
    });

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && visible) {
                handleClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [visible]);

    const handleClose = () => {
        setVisible(false);
        fetchNui("hideFrame");
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
            <ScaleFade visible={visible}>
                <div className="pointer-events-auto p-6 sm:p-8">
                    <Garage />
                </div>
            </ScaleFade>
        </div>
    );
};

const App: React.FC = () => {
    return (
        <VisibilityProvider>
            <AppBody />
        </VisibilityProvider>
    );
};

export default App;
