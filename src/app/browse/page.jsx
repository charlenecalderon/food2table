import React from 'react'
import "tailwindcss/tailwind.css"
import "tailwindcss/base.css"
import "tailwindcss/utilities.css"
import "tailwindcss/components.css"
import "tailwindcss/variants.css"


export default function Home() {
  return (
  <div className="bg-emerald-50 min-h-screen min-w-screen object-fill">

    <div className="w-screen h-90">
      <img className="w-screen max-h-80" src="https://thumbs.dreamstime.com/b/day-life-pixelated-farm-dive-vibrant-world-charming-pixel-art-where-characters-tend-to-their-crops-332448133.jpg"/>
    </div>
    
    <div className="flex justify-between items-center w-full p-4 bg-green-200">
      <div className="flex w-1/3"></div>
      <div className="w-1/3 justify-center items-center flex">
      <span className="text-3xl font-serif font-bold text-center mt-4 text-emerald-900">fresh2table</span>
      </div>
      <div className="flex justify-end w-1/3">
      <button className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-4 rounded-full mt-4 ml-4 h-10 w-10">
        ?
      </button>
      <button className="bg-emerald-800 rounded-full mt-3 ml-4 w-12 h-12"></button>
      </div>
    </div>

    <div className = "flex justify-between items-center w-full p-4">
    <div className = "flex w-1/6">
    <span>
      <a href>
      <button className="bg-emerald-400 hover:bg-emerald-500 text-white font-bold rounded-full mt-4 ml-4 h-20 w-40">
        Browse
      </button>
      </a>
      </span>
    </div>
    <div className = "flex w-1/6 justify-center">
    <span>
      <a href>
      <button className="bg-emerald-400 hover:bg-emerald-500 text-white font-bold rounded-full mt-4 ml-4 h-20 w-40">
        Cart
      </button>
      </a>
      </span>
    </div>
    <div className = "flex w-1/6 justify-end p-1">
    <span>
      <a href>
      <button className="bg-emerald-400 hover:bg-emerald-500 text-white font-bold rounded-full mt-4 ml-4 h-20 w-40">
        Orders
      </button>
      </a>
      </span>
    </div>
    </div>

  </div>
  )
}