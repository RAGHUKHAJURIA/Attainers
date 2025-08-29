import React from 'react'
import Navbar from '../components/Navbar'
import News from '../components/News'

const Hero = () => {
    return (
        <>
            <Navbar />
            <div style={{ marginTop: "80px" }}></div>
            <News />
        </>
    )
}

export default Hero