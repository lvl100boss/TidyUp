import React from 'react'
import { motion } from 'framer-motion'

const ResubmissionHeader = (props) => {
    return (
        <div className='mb-5'>
            <motion.h1
                className="text-2xl mb-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                Resubmit your Shop's Information
            </motion.h1>
            <motion.p
                className="text-muted-foreground text-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
            >
                Your shop registration has been rejected. Please resubmit your shop's information for review.
            </motion.p>
            <motion.div
                className='bg-background/80 backdrop-blur-3xl shadow-lg p-4 rounded-lg my-4 border'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <h2 className="font-semibold mb-1">
                    Reason for Rejection
                </h2>
                <p className="text-muted-foreground text-sm font-medium">
                    {props.rejection_reason}
                </p>
            </motion.div>
            <motion.p
                className="text-muted-foreground text-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
            >
                Please review the feedback provided above and update your shop information accordingly before resubmitting.
            </motion.p>
        </div>
    )
}

export default ResubmissionHeader