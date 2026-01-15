import React from 'react'
import SEO from '../components/SEO'
import Navbar from '../components/Navbar'
import ModernHero from '../components/ModernHero' // Import the new hero
import HubSection from '../components/HubSection' // Import the new Hub
import Footer from '../components/Footer'

const Hero = () => {
    return (
        <>
            <SEO
                title="Attainers - Best Mock Tests for JKSSB, SSC & Banking"
                description="Join Attainers for top-quality mock tests, video lectures, and study material for JKSSB, SSC, and Banking exams. Start your preparation today."
                keywords="Attainers, JKSSB Mock Tests, SSC CGL Mock Tests, Banking Exams, Video Lectures, Study Material"
            />
            <Navbar />
            {/* Removed the 80px margin div as ModernHero handles its own spacing/z-index */}
            <ModernHero />
            <HubSection />
            <Footer />
        </>
    )
}

export default Hero