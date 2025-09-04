import React from 'react'
import Navbar from '../components/Navbar'
import News from '../components/News'
import Dummy from '../components/Dummy'

const Hero = () => {
    return (
        <>
            <Navbar />
            <div style={{ marginTop: "80px" }}></div>
            <News />
            <div style={{ marginTop: "80px" }}></div>
            <Dummy />
        </>
    )
}

export default Hero