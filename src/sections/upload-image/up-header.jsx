import React, { useState, useEffect } from 'react';
import { useProTheme } from '@theme/store-theme-pro';
import { 
    Box, 
    Typography, 
    Stack 
} from '@theme/provider-theme';

export const Page_ImageHeader = ({ 
    title = "", 
    date = "",
    address = "",
    images = [  ]
}) => {
    const { is_mobile, colors } = useProTheme();
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % images.length);
        }, 6000);
        return () => clearInterval(timer);
    }, [images.length]);

    const pinkMain = "#F8BBD0";
    const pinkAccent = "#F48FB1";
    const softPinkBg = "#FFF5F7";

    return (
        <Box 
            sx={{ 
                width: '100%', 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                mb:  is_mobile ? 0 : -5,
                pt: is_mobile ? 0 : 2
            }}
        >
            <Box 
                shape="rounded"
                sx={{ 
                    position: 'relative', 
                    height: is_mobile ? 500 : 500, 
                    width: '100%', 
                    overflow: 'hidden',
                    bgcolor: softPinkBg,
                    boxShadow: `0 30px 60px ${pinkMain}33`,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                {images.map((img, i) => (
                    <Box
                        key={i}
                        sx={{
                            position: 'absolute',
                            inset: 0,
                            backgroundImage: `url(${img})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            opacity: index === i ? 1 : 0,
                            transform: index === i ? 'scale(1)' : 'scale(1.1)',
                            transition: 'opacity 2s ease-in-out, transform 8s ease-out',
                        }}
                    />
                ))}

                <Box
                    sx={{
                        position: 'absolute',
                        inset: 0,
                        background: `linear-gradient(to bottom, 
                            ${colors.white.main}00 0%, 
                            ${softPinkBg}B3 50%, 
                            ${softPinkBg}FF 100%)`,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        textAlign: 'center',
                        pt: is_mobile ? 15 : 10,
                        px: 3,
                    }}
                >
                    <Stack spacing={1.5} alignItems="center" sx={{ width: '100%', mb: -10 }}>

                        <Typography 
                            sx={{ 
                                color: "#C2185B", 
                                fontWeight: 400, 
                                fontSize: is_mobile ? 30 : 65,
                                fontFamily: "'Playfair Display', serif",
                                lineHeight: 1.1,
                                textAlign: 'center'
                            }}
                        >
                            {title}
                        </Typography>

                        <Stack spacing={0.5} alignItems="center">
                            <Typography 
                                size="medium" 
                                sx={{ 
                                    color: "#880E4F", 
                                    fontWeight: 700, 
                                    letterSpacing: is_mobile ? 3 : 6,
                                    textTransform: 'uppercase',
                                    opacity: 0.8,
                                    fontSize: 11,
                                    textAlign: 'center'
                                }}
                            >
                                {date}
                            </Typography>
                            
                            <Typography 
                                sx={{ 
                                    color: pinkAccent, 
                                    fontWeight: 600, 
                                    fontSize: 11,
                                    letterSpacing: 2,
                                    textTransform: 'uppercase',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: 1,
                                    textAlign: 'center'
                                }}
                            >
                                📍 {address}
                            </Typography>
                        </Stack>
                        
                        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', mt: 3 }}>
                            <Stack direction="row" spacing={1.5} justifyContent="center" alignItems="center">
                                {images.map((_, i) => (
                                    <Box
                                        key={i}
                                        onClick={() => setIndex(i)}
                                        sx={{
                                            width: index === i ? 24 : 8,
                                            height: 8,
                                            borderRadius: 4,
                                            bgcolor: index === i ? pinkAccent : `${pinkAccent}4D`,
                                            border: `1.5px solid ${colors.white.main}`,
                                            transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                                            cursor: 'pointer',
                                            boxShadow: index === i ? `0 0 10px ${pinkAccent}` : 'none'
                                        }}
                                    />
                                ))}
                            </Stack>
                        </Box>
                    </Stack>
                </Box>
            </Box>
        </Box>
    );
};