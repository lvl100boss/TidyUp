import React from 'react'
import { motion } from 'framer-motion'

const SetupShopHeader = (props) => {
    return (
        <div className='mb-5'>
            <motion.h1
                className="text-2xl mb-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                Submit your Shop's Information
            </motion.h1>
            <motion.p
                className="text-muted-foreground text-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
            >
                Please provide the necessary details to set up your shop for review.
            </motion.p>
        </div>
    )
}

export default SetupShopHeader