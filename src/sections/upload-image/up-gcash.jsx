import React from 'react';
import { useProTheme } from '@theme/store-theme-pro';
import { 
    Box, 
    Typography, 
    Stack, 
    Card, 
    SHAPES 
} from '@theme/provider-theme';

export const Page_ImageGcash = ({ 
    qrCodeUrl = "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=GCash-Julius-Marnolyn",
    accountName = "JULIUS C. / MARNOLYN G.",
    accountNumber = "09XX XXX XXXX"
}) => {
    const { colors, is_mobile } = useProTheme();

    const pinkAccent = "#F48FB1";
    const softPinkBg = "#FFF5F7";
    const deepPink = "#C2185B";

    return (
        <Box 
            sx={{ 
                width: '100%', 
                py: 6, 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                minHeight: '400px'
            }}
        >
            <Card 
                shape="rounded" 
                sx={{ 
                    p: is_mobile ? 4 : 6, 
                    maxWidth: 500,
                    width: '90%',
                    textAlign: 'center',
                    border: 'none',
                    background: `linear-gradient(135deg, #FFFFFF 0%, ${softPinkBg} 100%)`,
                    boxShadow: `0 30px 60px ${pinkAccent}26`,
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <Box 
                    sx={{ 
                        position: 'absolute', 
                        top: -30, 
                        left: -30, 
                        fontSize: 80, 
                        opacity: 0.1, 
                        transform: 'rotate(-15deg)',
                        pointerEvents: 'none'
                    }}
                >
                    🕊️
                </Box>

                <Stack spacing={4} alignItems="center" sx={{ width: '100%' }}>
                    <Stack spacing={1} alignItems="center">
                        <Typography 
                            sx={{ 
                                color: deepPink, 
                                fontFamily: "'Playfair Display', serif", 
                                fontSize: is_mobile ? '1.8rem' : '2.2rem',
                                fontWeight: 800,
                                textAlign: 'center'
                            }}
                        >
                            Gifts & Blessings
                        </Typography>
                        <Box sx={{ width: 60, height: 2, bgcolor: pinkAccent, borderRadius: 1 }} />
                    </Stack>

                    <Typography 
                        sx={{ 
                            color: '#A07883', 
                            fontStyle: 'italic', 
                            fontSize: '1.05rem', 
                            lineHeight: 1.6,
                            px: 2,
                            textAlign: 'center',
                            maxWidth: '400px'
                        }}
                    >
                        "Your presence is our favorite gift! If you’d like to contribute toward our future home, it would mean the world to us."
                    </Typography>

                    <Box 
                        sx={{ 
                            p: 2.5, 
                            bgcolor: colors.white.main, 
                            borderRadius: SHAPES.rounded,
                            boxShadow: `0 15px 35px ${colors.black.main}0D`,
                            border: `1px solid ${pinkAccent}33`,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        <Box 
                            component="img"
                            src={qrCodeUrl}
                            alt="GCash QR Code"
                            sx={{ 
                                width: is_mobile ? 220 : 260, 
                                height: is_mobile ? 220 : 260,
                                display: 'block',
                                borderRadius: '4px'
                            }}
                        />
                    </Box>

                    <Stack spacing={0.5} alignItems="center">
                        <Typography 
                            size="tiny" 
                            sx={{ 
                                fontWeight: 900, 
                                color: pinkAccent, 
                                letterSpacing: 2,
                                textTransform: 'uppercase',
                                textAlign: 'center'
                            }}
                        >
                            Scan to send via GCash
                        </Typography>
                        <Typography 
                            sx={{ 
                                fontWeight: 800, 
                                color: deepPink, 
                                fontSize: '1.2rem',
                                textAlign: 'center'
                            }}
                        >
                            {accountName}
                        </Typography>
                        <Typography 
                            size="micro" 
                            sx={{ 
                                color: '#A07883', 
                                fontWeight: 700,
                                textAlign: 'center'
                            }}
                        >
                            {accountNumber}
                        </Typography>
                    </Stack>

                    <Box 
                        sx={{ 
                            px: 4, 
                            py: 1.5, 
                            bgcolor: `${pinkAccent}1A`, 
                            borderRadius: 10,
                            border: `1px solid ${pinkAccent}33`,
                            display: 'inline-flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        <Typography 
                            size="micro" 
                            sx={{ 
                                color: deepPink, 
                                fontWeight: 900,
                                letterSpacing: 1,
                                textAlign: 'center'
                            }}
                        >
                            THANK YOU FOR YOUR LOVE 🌸
                        </Typography>
                    </Box>
                </Stack>

                <Box 
                    sx={{ 
                        position: 'absolute', 
                        bottom: -20, 
                        right: -20, 
                        fontSize: 70, 
                        opacity: 0.1, 
                        transform: 'rotate(10deg)',
                        pointerEvents: 'none'
                    }}
                >
                    ✨
                </Box>
            </Card>
        </Box>
    );
};