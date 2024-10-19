"use client"

//import Center from "@/components/org/c"
//import {FadeUpDiv, FadeUpStagger} from "@/components/animation"
import {useEffect} from 'react'
import {animate} from 'framer-motion/dom'

const Gatiiku = () => {

    useEffect(() => {
        animate("div", { y: [10, 0]}, { type: "spring" })
    }, []); // 空の依存配列で初回レンダリング時にのみ実行

    return (
        <main className="flex items-center justify-center h-screen">    
            <div className="bg-white p-4 rounded-xl text-xl text-black">gatiiku</div>
        </main>
    )
}

export default Gatiiku