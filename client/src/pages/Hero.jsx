import React from 'react'
import Navbar from '../components/Navbar'
import News from '../components/News'
import ALLNews from '../components/ALLNews.jsx'

const Hero = () => {
    return (
        <>
            <Navbar />
            <div style={{ marginTop: "80px" }}></div>
            <News />
            <div style={{ marginTop: "80px" }}></div>
            <ALLNews />

        </>
    )
}

export default Hero