import Link from 'next/link'
import React from 'react'

export const Header = () => {
  return (
    <header className='flex items-center gap-2 justify-between max-w-[1500px] w-full mx-auto px-4 py-5'>
        <div>
            <Link href="/" className='text-3xl font-semibold text-text'>Jynx</Link>
        </div>
    </header>
  )
}
