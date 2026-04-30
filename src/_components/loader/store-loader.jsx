import { create } from 'zustand';

export const useLoader = create((set) => ({
    isOpen: false,
    text: '',
    icon: null,
}));

let timeoutRef = null;
let lastCallRef = 0;

export const upLoader = (isOpen, seconds = 0, text = 'Loading...', icon = null) => {
    const now = Date.now();
    
    if (isOpen && (now - lastCallRef < 500)) return;
    if (isOpen) lastCallRef = now;

    if (timeoutRef) {
        clearTimeout(timeoutRef);
        timeoutRef = null;
    }

    useLoader.setState({ isOpen, text, icon });

    if (isOpen && seconds > 0) {
        timeoutRef = setTimeout(() => {
            useLoader.setState({ isOpen: false });
            timeoutRef = null;
        }, seconds * 1000);
    }
};
