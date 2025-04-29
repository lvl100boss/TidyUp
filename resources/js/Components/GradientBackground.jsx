import React from 'react'

const GradientBackground = () => {
    const img = "https://images.unsplash.com/photo-1627704442358-61c8e05c7bf4?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    return (
        <div className='fixed inset-0 -z-10'>
            <img src={img} className='size-full object-cover opacity-20 dark:opacity-10 invert  dark:invert-0 dark:hue-rotate-90 -hue-rotate-90 object-center blur-3xl' />
        </div>
    )
}

export default GradientBackground