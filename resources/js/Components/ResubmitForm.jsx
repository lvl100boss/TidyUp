import React from 'react'
import { motion } from 'framer-motion'
const ResubmitForm = ({ title, icon, children }) => {
    const [IconComponent, setIconComponent] = React.useState(null);
    React.useEffect(() => {
        import(`lucide-react`).then((module) => {
            setIconComponent(module[icon]);
        });
    }, [icon]);
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className='p-4 rounded-lg mb-4 bg-background/80 backdrop-blur-3xl shadow-lg border'
        >
            <div className=' border-b border-foreground/50 pb-2 flex gap-1 items-center mb-4'>
                {IconComponent && <IconComponent size={18} />}
                <h1 className='text-xl'>
                    {title}
                </h1>
            </div>
            {children}
        </motion.div>
    )
}

export default ResubmitForm