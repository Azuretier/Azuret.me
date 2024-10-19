"use client"

import {motion} from 'framer-motion'

const Gatiiku = () => {
    return (
        <main className="flex justify-center items-center h-screen">
            <motion.div
                className="bg-white p-4 rounded-xl text-xl"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
            >
                1919
            </motion.div>
        </main>
        
    )
}

export default Gatiiku