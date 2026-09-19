'use client'
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { deleteProject } from '@/features/projects/actions'
export function DeleteProjectButton({id}:{id:string}){const router=useRouter();const [pending,start]=useTransition();const [message,setMessage]=useState('');return <div><button disabled={pending} className="text-xs text-red-300 disabled:opacity-40" onClick={()=>{if(!window.confirm('Delete this project? This cannot be undone.'))return;start(async()=>{const r=await deleteProject(id);setMessage(r.message);if(r.ok)router.refresh()})}}>Delete</button>{message&&<span className="ml-2 text-xs text-white/35">{message}</span>}</div>}
