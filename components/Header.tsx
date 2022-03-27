import Link from 'next/link'
import React from 'react'

const Header = () => {
  return (
    <div className="mx-auto flex w-11/12 max-w-6xl justify-between py-4">
      <div className="flex items-center space-x-5">
        <Link href="/">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Medium_logo_Wordmark_Black.svg/1280px-Medium_logo_Wordmark_Black.svg.png"
            alt="Logo de medium"
            className="w-40 object-contain"
          />
        </Link>

        <div className="hidden items-center space-x-5 sm:inline-flex">
          <span className="block">About</span>
          <span className="block">Contact</span>
          <span className="block rounded-full bg-green-600 px-4 py-1 text-white">
            Follow
          </span>
        </div>
      </div>
      <div className="flex items-center space-x-5 text-green-600">
        <span className="block">Sign In</span>
        <span className="block rounded-full border border-green-600 px-4 py-1">
          Get Started
        </span>
      </div>
    </div>
  )
}

export default Header
