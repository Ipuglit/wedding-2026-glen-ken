import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import CryptoJS from 'crypto-js';
import { useMediaQuery } from '@mui/material';

const SECRET_KEY = 'PRO_UI_ENCRYPTION_KEY_ALL_IN_STATISTICS';

export const SIZES = { micro: 10, tiny: 12, mini: 14, small: 16, medium: 18, big: 22, large: 28, huge: 36, massive: 48, gigantic: 64 };

export const getShades = (mode) => ({
    light:          mode === 'dark' ? 0.35 : 0.6,
    lighter:        mode === 'dark' ? 0.15 : 0.3,
    main:           1
});

export const getColors = (mode) => ({
    main:        mode === 'dark' ? { main: '#d48bff', light: '#e8bfff', dark: '#a020f0', contrastText: '#000000' } : { main: '#6702aa', light: '#9c27b0', dark: '#4a007a', contrastText: '#ffffff' },
    sub:         mode === 'dark' ? { main: '#00ffff', light: '#80ffff', dark: '#00b3b3', contrastText: '#000000' } : { main: '#00b3b3', light: '#00e6e6', dark: '#008080', contrastText: '#ffffff' },
    white:       mode === 'dark' ? { main: '#ffffff', light: '#ffffff', dark: '#cccccc', contrastText: '#000000' } : { main: '#fcfcfc', light: '#ffffff', dark: '#e0e0e0', contrastText: '#000000' },
    black:       mode === 'dark' ? { main: '#000000', light: '#333333', dark: '#000000', contrastText: '#ffffff' } : { main: '#111111', light: '#444444', dark: '#000000', contrastText: '#ffffff' },
    gray:        mode === 'dark' ? { main: '#808080', light: '#b3b3b3', dark: '#4d4d4d', contrastText: '#ffffff' } : { main: '#757575', light: '#9e9e9e', dark: '#424242', contrastText: '#ffffff' },
    ash:         mode === 'dark' ? { main: '#b0b0b0', light: '#d9d9d9', dark: '#808080', contrastText: '#000000' } : { main: '#e0e0e0', light: '#f5f5f5', dark: '#b3b3b3', contrastText: '#000000' },
    green:       mode === 'dark' ? { main: '#4caf50', light: '#81c784', dark: '#388e3c', contrastText: '#ffffff' } : { main: '#2e7d32', light: '#4caf50', dark: '#1b5e20', contrastText: '#ffffff' },
    red:         mode === 'dark' ? { main: '#f44336', light: '#e57373', dark: '#d32f2f', contrastText: '#ffffff' } : { main: '#c62828', light: '#ef5350', dark: '#b71c1c', contrastText: '#ffffff' },
    blue:        mode === 'dark' ? { main: '#2196f3', light: '#64b5f6', dark: '#1976d2', contrastText: '#ffffff' } : { main: '#1565c0', light: '#42a5f5', dark: '#0d47a1', contrastText: '#ffffff' },
    orange:      mode === 'dark' ? { main: '#ff9800', light: '#ffb74d', dark: '#f57c00', contrastText: '#000000' } : { main: '#e65100', light: '#ff9800', dark: '#bf360c', contrastText: '#ffffff' },
    yellow:      mode === 'dark' ? { main: '#ffeb3b', light: '#fff176', dark: '#fbc02d', contrastText: '#000000' } : { main: '#f57f17', light: '#fbc02d', dark: '#e65100', contrastText: '#ffffff' },
    violet:      mode === 'dark' ? { main: '#9c27b0', light: '#ba68c8', dark: '#7b1fa2', contrastText: '#ffffff' } : { main: '#6a1b9a', light: '#8e24aa', dark: '#4a148c', contrastText: '#ffffff' },
    purple:      mode === 'dark' ? { main: '#d48bff', light: '#e8bfff', dark: '#a020f0', contrastText: '#000000' } : { main: '#6702aa', light: '#9c27b0', dark: '#4a007a', contrastText: '#ffffff' },
    pink:        mode === 'dark' ? { main: '#e91e63', light: '#f06292', dark: '#c2185b', contrastText: '#ffffff' } : { main: '#ad1457', light: '#d81b60', dark: '#880e4f', contrastText: '#ffffff' },
    teal:        mode === 'dark' ? { main: '#009688', light: '#4db6ac', dark: '#00796b', contrastText: '#ffffff' } : { main: '#00695c', light: '#00897b', dark: '#004d40', contrastText: '#ffffff' },
    neonblue:    mode === 'dark' ? { main: '#00ffff', light: '#80ffff', dark: '#00b3b3', contrastText: '#000000' } : { main: '#00b3b3', light: '#00e6e6', dark: '#008080', contrastText: '#ffffff' },
    neongreen:   mode === 'dark' ? { main: '#39ff14', light: '#8aff73', dark: '#2eb80f', contrastText: '#000000' } : { main: '#2eb80f', light: '#39ff14', dark: '#1f800a', contrastText: '#ffffff' },
    neonred:     mode === 'dark' ? { main: '#ff073a', light: '#ff6b8b', dark: '#cc002a', contrastText: '#ffffff' } : { main: '#cc002a', light: '#ff1a4a', dark: '#990020', contrastText: '#ffffff' },
    redorange:   mode === 'dark' ? { main: '#ff5349', light: '#ff8a84', dark: '#cc3d33', contrastText: '#ffffff' } : { main: '#d84315', light: '#ff5722', dark: '#bf360c', contrastText: '#ffffff' },
    yellowgreen: mode === 'dark' ? { main: '#9acd32', light: '#bceb5c', dark: '#7a9f24', contrastText: '#000000' } : { main: '#689f38', light: '#8bc34a', dark: '#33691e', contrastText: '#ffffff' },
    rust:        mode === 'dark' ? { main: '#b7410e', light: '#e86a33', dark: '#8a2b06', contrastText: '#ffffff' } : { main: '#8a2b06', light: '#b7410e', dark: '#5e1b00', contrastText: '#ffffff' },
    sky:         mode === 'dark' ? { main: '#87ceeb', light: '#b0e2ff', dark: '#5facd3', contrastText: '#000000' } : { main: '#4682b4', light: '#87ceeb', dark: '#315a7d', contrastText: '#ffffff' },
    brown:       mode === 'dark' ? { main: '#8d6e63', light: '#be9c91', dark: '#5f4339', contrastText: '#ffffff' } : { main: '#5d4037', light: '#8b6b61', dark: '#321911', contrastText: '#ffffff' },
});

const encryptedStorage = {
    getItem: (name) => {
        const str = localStorage.getItem(name);
        if (!str) return null;
        try { return CryptoJS.AES.decrypt(str, SECRET_KEY).toString(CryptoJS.enc.Utf8); } 
        catch { return null; }
    },
    setItem: (name, value) => localStorage.setItem(name, CryptoJS.AES.encrypt(value, SECRET_KEY).toString()),
    removeItem: (name) => localStorage.removeItem(name),
};

export const useThemeStore = create(
    persist(
        (set) => ({
            mode: 'light',
            pigment: 'inherit',
            setThemeMode: (mode)        => set((state) => ({ mode: mode ?? (state.mode === 'dark' ? 'light' : 'dark') })),
            setThemePigment: (pigment)  => set({ pigment }),
        }),
        {
            name: 'pro-theme-storage',
            storage: createJSONStorage(() => encryptedStorage),

            partialize: (state) => state,

            onRehydrateStorage: () => (state) => {
                if (!state?.mode) {
                    state.mode = 'light';
                }
            },
        }
    )
);

export const useProTheme = () => {
    const mode                  = useThemeStore((state) => state.mode);
    const pigment               = useThemeStore((state) => state.pigment);
    const setThemeMode          = useThemeStore((state) => state.setThemeMode);
    const setThemePigment       = useThemeStore((state) => state.setThemePigment);
    
    const is_mobile = useMediaQuery('(max-width:599px)');
    const is_tablet = useMediaQuery('(min-width:600px) and (max-width:1199px)');
    const is_laptop = useMediaQuery('(min-width:1200px)');

    return {
        mode,
        is_dark: mode === 'dark',
        pigment,
        setThemeMode,
        setThemePigment,
        is_mobile,
        is_tablet,
        is_laptop,
        colors: getColors(mode),
        sizes: SIZES,
        shades: getShades(mode)
    };
};
