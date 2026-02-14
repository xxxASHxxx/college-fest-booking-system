import React from 'react';
import LiquidEther from '../ui/LiquidEther';

/**
 * LiquidEtherBackground Component
 * 
 * Wrapper for the WebGL-based LiquidEther fluid simulation.
 * Provides full viewport coverage with mouse-interactive swirling fluid effects.
 * 
 * The canvas element uses pointer-events CSS so mouse interactions pass through to form elements.
 */
const LiquidEtherBackground = ({ children }) => {
    return (
        <div className="relative w-full min-h-screen overflow-hidden">
            {/* WebGL Fluid Canvas - pointer-events-auto on canvas, wrapper handles layering */}
            <div
                className="fixed inset-0 w-screen h-screen"
                style={{ zIndex: 0, pointerEvents: 'none' }}
            >
                <div style={{ pointerEvents: 'auto', width: '100%', height: '100%' }}>
                    <LiquidEther
                        mouseForce={20}
                        cursorSize={100}
                        colors={["#D00000", "#FAA307", "#03071E"]}
                        autoDemo={true}
                        autoSpeed={0.5}
                        autoIntensity={2.2}
                    />
                </div>
            </div>

            {/* Content Layer - positioned above canvas */}
            <div className="relative" style={{ zIndex: 1 }}>
                {children}
            </div>
        </div>
    );
};

export default LiquidEtherBackground;
