import React from 'react';
import { Backdrop, CircularProgress, Stack, Box } from '@mui/material';

import { useLoader } from './store-loader';
import { Typography } from '@/_theme/provider-theme';

import loaderImg from "@/_assets/images_icon/loader.png"; 
// or .png depending on your file

export const ProLoader = () => {
    const isOpen = useLoader((state) => state.isOpen);
    const text = useLoader((state) => state.text);

    const centerImage = useLoader((state) => state.icon);

    return (
        <Backdrop
            open={isOpen}
            sx={{
                zIndex: 99999,
                backdropFilter: 'blur(12px)',
                background: 'radial-gradient(circle, rgba(255,245,247,0.92) 0%, rgba(255,230,235,0.96) 100%)',
                flexDirection: 'column'
            }}
        >
            <Stack alignItems="center" gap={3} sx={{ animation: 'weddingFadeIn 0.6s ease-out both' }}>
                
                <Box sx={{ position: 'relative', display: 'inline-flex', width: 120, height: 120, alignItems: 'center', justifyContent: 'center' }}>
                    <CircularProgress 
                        size={120} 
                        thickness={1.5} 
                        sx={{ 
                            color: '#ff85a2', 
                            position: 'absolute', 
                            top: 0, left: 0, 
                            opacity: 0.4
                        }} 
                    />
                    
                    <CircularProgress 
                        size={120} 
                        thickness={1.5} 
                        variant="determinate"
                        value={75}
                        sx={{ 
                            color: '#ff4d7d', 
                            position: 'absolute', 
                            top: 0, left: 0, 
                            animation: 'rotateLoop 2.5s linear infinite',
                            strokeCap: 'round',
                            filter: 'drop-shadow(0 0 8px rgba(255,77,125,0.3))'
                        }} 
                    />
                    
                    <Box sx={{ animation: 'heartBeat 2s ease-in-out infinite', display: 'flex', zIndex: 1 }}>
                        {loaderImg ? (
                            <Box 
                                component="img" 
                                src={loaderImg} 
                                sx={{ 
                                    width: 70, // Adjust size as needed
                                    height: 70, // Adjust size as needed
                                    objectFit: 'contain',
                                    borderRadius: '50%', // Assuming you want a circular image container
                                    // border: '2px solid white', // Optional border
                                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)' // Optional shadow
                                }} 
                            />
                        ) : (
                            null
                        )}
                    </Box>

                    <Box 
                        sx={{ 
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            border: '1px solid #ffb3c6',
                            borderRadius: '50%',
                            animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
                            opacity: 0
                        }} 
                    />
                </Box>

                {text && (
                    <Stack spacing={0.5} alignItems="center">
                        <Typography 
                            size="small" 
                            sx={{ 
                                fontWeight: 600, 
                                color: '#ff4d7d',
                                letterSpacing: 4, 
                                textTransform: 'uppercase',
                                textAlign: 'center',
                                fontFamily: "'Playfair Display', serif"
                            }}
                        >
                            {text}
                        </Typography>
                        <Box sx={{ width: 40, height: 2, bgcolor: '#ffb3c6', borderRadius: 1, mt: 1 }} />
                    </Stack>
                )}
            </Stack>

            <style>{`
                @keyframes weddingFadeIn {
                    from { opacity: 0; transform: scale(0.9); }
                    to { opacity: 1; transform: scale(1); }
                }
                @keyframes rotateLoop {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                @keyframes heartBeat {
                    0% { transform: scale(1); }
                    14% { transform: scale(1.15); }
                    28% { transform: scale(1); }
                    42% { transform: scale(1.15); }
                    70% { transform: scale(1); }
                }
                @keyframes ping {
                    75%, 100% { transform: scale(1.5); opacity: 0; }
                    0% { transform: scale(1); opacity: 0.6; }
                }
            `}</style>
        </Backdrop>
    );
};