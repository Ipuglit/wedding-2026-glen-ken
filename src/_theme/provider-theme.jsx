import React, { useMemo } from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useThemeStore, getColors, getShades, SIZES } from './store-theme-pro';

import { 
    Box as MuiBox, Button as MuiButton, Stack as MuiStack, 
    IconButton as MuiIconButton, Typography as MuiTypography, 
    Divider as MuiDivider, Tabs as MuiTabs, Tab as MuiTab, 
    Stepper as MuiStepper, Chip as MuiChip, Card as MuiCard, 
    Paper as MuiPaper, Avatar as MuiAvatar, Badge as MuiBadge,
    TextField as MuiTextField, Menu as MuiMenu, MenuItem as MuiMenuItem,
    Switch as MuiSwitch, Checkbox as MuiCheckbox, Radio as MuiRadio,
    Slider as MuiSlider, LinearProgress as MuiLinearProgress, CircularProgress as MuiCircularProgress,
    Tooltip as MuiTooltip, Select as MuiSelect, FormControl as MuiFormControl,
    InputLabel as MuiInputLabel, FormHelperText as MuiFormHelperText,
    Dialog as MuiDialog, DialogTitle as MuiDialogTitle, DialogContent as MuiDialogContent, DialogActions as MuiDialogActions,
    Accordion as MuiAccordion, AccordionSummary as MuiAccordionSummary, AccordionDetails as MuiAccordionDetails,
    List as MuiList, ListItem as MuiListItem, ListItemText as MuiListItemText, ListItemIcon as MuiListItemIcon,
    ListItemButton as MuiListItemButton, Autocomplete as MuiAutocomplete, Snackbar as MuiSnackbar,
    SnackbarContent as MuiSnackbarContent, Input as MuiInput, OutlinedInput as MuiOutlinedInput,
    ToggleButton as MuiToggleButton, ToggleButtonGroup as MuiToggleButtonGroup
} from '@mui/material';

export const SHAPES = {
    flat: '0px',
    default: '8px',
    rounded: '16px',
    oval: '500px', 
    circle: '50%'
};

export const ProTheme = ({ children }) => {
    const mode = useThemeStore((state) => state.mode);
    const pigment = useThemeStore((state) => state.pigment);

    const theme = useMemo(() => {
        const activeColors = getColors(mode);
        
        let bgDefault = mode === 'dark' ? '#0a0a0c' : '#f5f5f7';
        let bgPaper = mode === 'dark' ? '#121215' : '#ffffff';

        if (pigment !== 'inherit' && activeColors[pigment]) {
            const tint = activeColors[pigment].main;
            bgDefault = `color-mix(in srgb, ${bgDefault} 92%, ${tint} 8%)`;
            bgPaper = `color-mix(in srgb, ${bgPaper} 95%, ${tint} 5%)`;
        }

        return createTheme({
            palette: {
                mode,
                ...activeColors,
                background: { default: bgDefault, paper: bgPaper }
            },
            typography: { fontFamily: '"Inter", "Roboto", sans-serif' },
            components: {
                MuiButton: { styleOverrides: { root: { borderRadius: SHAPES.default, textTransform: 'none', fontWeight: 700 } } },
                MuiCard: { styleOverrides: { root: { borderRadius: SHAPES.rounded } } },
                MuiPaper: { styleOverrides: { rounded: { borderRadius: SHAPES.default } } },
                MuiDialog: { styleOverrides: { paper: { borderRadius: SHAPES.rounded } } }
            }
        });
    }, [mode, pigment]);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
        </ThemeProvider>
    );
};

function withPro(WrappedComponent) {
    return React.forwardRef(({ shade, size, shape, color, sx, ...props }, ref) => {
        let activeColor = color || 'main';
        const isInherit = activeColor === 'inherit' || activeColor === 'default';
        const isDotColor = typeof activeColor === 'string' && activeColor.includes('.');
        const passColor = (isDotColor || shade) ? undefined : activeColor;

        return (
            <WrappedComponent
                ref={ref}
                color={isInherit ? activeColor : passColor}
                sx={[
                    (theme) => {
                        let styles = {};

                        if (shape && SHAPES[shape]) {
                            styles.borderRadius = SHAPES[shape];
                        }

                        if (isInherit) {
                            if (size && SIZES[size]) {
                                const s = SIZES[size];
                                styles.fontSize = { xs: Math.max(10, Math.floor(s * 0.9)), sm: s };
                            }
                            return styles;
                        }

                        let [cName, cVariant = 'main'] = activeColor.split('.');

                        if (!theme.palette[cName]) {
                            cName = 'main';
                            cVariant = 'main';
                        }

                        let hexColor = theme.palette[cName][cVariant] || theme.palette[cName].main;
                        let contrast = theme.palette[cName].contrastText || '#ffffff';

                        if (shade && hexColor) {
                            const opac = getShades(theme.palette.mode)[shade] || 1;
                            
                            if (props.variant === 'outlined') {
                                styles.backgroundColor = alpha(hexColor, opac * 0.15);
                                styles.borderColor = alpha(hexColor, opac);
                                styles.color = hexColor;
                                styles['&:hover'] = { backgroundColor: alpha(hexColor, opac * 0.25) };
                            } else if (props.variant === 'text') {
                                styles.backgroundColor = alpha(hexColor, opac * 0.1);
                                styles.color = hexColor;
                                styles['&:hover'] = { backgroundColor: alpha(hexColor, opac * 0.2) };
                            } else {
                                styles.backgroundColor = alpha(hexColor, opac);
                                styles.color = contrast;
                                styles['&:hover'] = { backgroundColor: alpha(hexColor, Math.min(opac + 0.15, 1)) };
                            }
                        } else if ((isDotColor || typeof passColor === 'undefined') && hexColor) {
                             if (props.variant === 'outlined') {
                                styles.borderColor = hexColor;
                                styles.color = hexColor;
                                styles['&:hover'] = { backgroundColor: alpha(hexColor, 0.1) };
                            } else {
                                styles.backgroundColor = hexColor;
                                styles.color = contrast;
                                styles['&:hover'] = { backgroundColor: alpha(hexColor, 0.85) };
                            }
                        }

                        if (size && SIZES[size]) {
                            const baseSz = SIZES[size];
                            styles.fontSize = { xs: Math.max(10, Math.floor(baseSz * 0.9)), sm: baseSz };
                        }

                        return styles;
                    },
                    ...(Array.isArray(sx) ? sx : [sx])
                ]}
                {...props}
            />
        );
    });
}

export const Box = withPro(MuiBox);
export const Button = withPro(MuiButton);
export const Stack = withPro(MuiStack);
export const IconButton = withPro(MuiIconButton);
export const Typography = withPro(MuiTypography);
export const Divider = withPro(MuiDivider);
export const Tabs = withPro(MuiTabs);
export const Tab = withPro(MuiTab);
export const Stepper = withPro(MuiStepper);
export const Chip = withPro(MuiChip);
export const Card = withPro(MuiCard);
export const Paper = withPro(MuiPaper);
export const Avatar = withPro(MuiAvatar);
export const Badge = withPro(MuiBadge);
export const TextField = withPro(MuiTextField);
export const Menu = withPro(MuiMenu);
export const MenuItem = withPro(MuiMenuItem);
export const Switch = withPro(MuiSwitch);
export const Checkbox = withPro(MuiCheckbox);
export const Radio = withPro(MuiRadio);
export const Slider = withPro(MuiSlider);
export const LinearProgress = withPro(MuiLinearProgress);
export const CircularProgress = withPro(MuiCircularProgress);
export const Tooltip = withPro(MuiTooltip);
export const Select = withPro(MuiSelect);
export const FormControl = withPro(MuiFormControl);
export const InputLabel = withPro(MuiInputLabel);
export const FormHelperText = withPro(MuiFormHelperText);
export const Dialog = withPro(MuiDialog);
export const DialogTitle = withPro(MuiDialogTitle);
export const DialogContent = withPro(MuiDialogContent);
export const DialogActions = withPro(MuiDialogActions);
export const Accordion = withPro(MuiAccordion);
export const AccordionSummary = withPro(MuiAccordionSummary);
export const AccordionDetails = withPro(MuiAccordionDetails);
export const List = withPro(MuiList);
export const ListItem = withPro(MuiListItem);
export const ListItemButton = withPro(MuiListItemButton);
export const ListItemText = withPro(MuiListItemText);
export const ListItemIcon = withPro(MuiListItemIcon);
export const Autocomplete = withPro(MuiAutocomplete);
export const Snackbar = withPro(MuiSnackbar);
export const SnackbarContent = withPro(MuiSnackbarContent);
export const Input = withPro(MuiInput);
export const OutlinedInput = withPro(MuiOutlinedInput);
export const ToggleButton = withPro(MuiToggleButton);
export const ToggleButtonGroup = withPro(MuiToggleButtonGroup);
