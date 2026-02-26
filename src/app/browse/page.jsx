import React from 'react'
import "tailwindcss/tailwind.css"
import "tailwindcss/base.css"
import "tailwindcss/utilities.css"
import "tailwindcss/components.css"
import "tailwindcss/variants.css"
import "tailwindcss/screens.css"


export default function Home() {
  return (
  <div>

    <div>
      <img className="w-screen h-250 object-fill p-0" width="screen" height="250" src="https://thumbs.dreamstime.com/b/day-life-pixelated-farm-dive-vibrant-world-charming-pixel-art-where-characters-tend-to-their-crops-332448133.jpg"/>
    </div>
    
    <div className="flex p-4 justify-center gap-x-600">
      <div className="">
      <h1 className="text-3xl font-bold text-center mt-4">fresh2table</h1>
      </div>
      <div className="">
      <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4 ml-4">
        Sign Up
      </button>
      </div>
    </div>

  </div>
  )
}