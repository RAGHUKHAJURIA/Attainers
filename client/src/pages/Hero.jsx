import React from 'react'
import Navbar from '../components/Navbar'
import ModernHero from '../components/ModernHero' // Import the new hero
import HubSection from '../components/HubSection' // Import the new Hub
import Footer from '../components/Footer'

const Hero = () => {
    return (
        <>
            <Navbar />
            {/* Removed the 80px margin div as ModernHero handles its own spacing/z-index */}
            <ModernHero />
            <HubSection />
            <Footer />
        </>
    )
}

export default Hero