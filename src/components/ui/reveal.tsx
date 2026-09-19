'use client'
import { motion,useReducedMotion } from 'motion/react'
export function Reveal({children,className=''}:{children:React.ReactNode;className?:string}){const reduce=useReducedMotion();return <motion.div data-motion-disabled={reduce?'true':'false'} className={className} initial={reduce?false:{opacity:0,y:24,filter:'blur(10px)',scale:.985}} whileInView={reduce?undefined:{opacity:1,y:0,filter:'blur(0px)',scale:1}} viewport={{once:true,amount:.2}} transition={{duration:.7,ease:[.2,.8,.2,1]}}>{children}</motion.div>}
