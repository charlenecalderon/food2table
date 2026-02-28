import React from 'react'
import "tailwindcss/tailwind.css"
import "tailwindcss/base.css"
import "tailwindcss/utilities.css"
import "tailwindcss/components.css"
import "tailwindcss/variants.css"


export default function Home() {
  return (
  <div className="bg-emerald-50 min-h-screen w-screen object-fill">

    <div className="w-screen h-60 object-fill">
      <img className="w-screen h-60" src="https://thumbs.dreamstime.com/b/day-life-pixelated-farm-dive-vibrant-world-charming-pixel-art-where-characters-tend-to-their-crops-332448133.jpg"/>
    </div>
    
    <div className="flex justify-between items-center w-screen p-4 bg-green-200">
      <div className="flex w-1/3"></div>
      <div className="w-1/3 justify-center items-center flex">
      <span className="text-3xl font-serif font-bold text-center mt-4 text-emerald-900">fresh2table</span>
      </div>
      <div className="flex justify-end w-1/3">
      <button className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-4 rounded-full mt-4 ml-4 h-10 w-10">
        ?
      </button>
      <button className="bg-emerald-800 rounded-full mt-3 ml-4 w-12 h-12 items-center flex justify-center">
        <img className="rounded-full w-10 h-10 m-1" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyzTWQoCUbRNdiyorem5Qp1zYYhpliR9q0Bw&s"></img>
      </button>
      </div>
    </div>

    <div className = "flex justify-between items-center w-full p-4">
    <div className = "flex w-1/6">
    <span>
      <button className="bg-emerald-400 hover:bg-emerald-500 text-white font-bold rounded-full mt-4 ml-4 h-20 w-40">
        Browse
      </button>
      </span>
    </div>
    <div className = "flex w-1/6 justify-center">
    <span>
      <button className="bg-emerald-400 hover:bg-emerald-500 text-white font-bold rounded-full mt-4 ml-4 h-20 w-40">
        Cart
      </button>
      </span>
    </div>
    <div className = "flex w-1/6 justify-end p-1">
    <span>
      <button className="bg-emerald-400 hover:bg-emerald-500 text-white font-bold rounded-full mt-4 ml-4 h-20 w-40">
        Orders
      </button>
      </span>
    </div>
    </div>

    <div>
        <div className = "w-full h-full flex-wrap p-5 items-center justify-between">
          <div className="bg-green-200 text-white rounded-xl h-1/2 w-1/3 object-fill p-4">
            <img className="rounded-xl h-1/2 w-full" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSdIC8P1fXIU3Au62klNg7tc_BmUEelpxvJ3Q&s"></img>
            <div className="flex justify-between mt-2 ml-2">
            <h1 className="text-emerald-900  font-bold font-serif">Eggs</h1>
              <button className="bg-emerald-900 rounded-full w-20 h-6 flex justify-center items-center align-middle font-serif text-sm font-bold">
                Vendor
              </button>
            <h1 className="text-emerald-900 font-bold font-serif flex justify-end">
              $3.99
            </h1>
            </div>
            <div className="bg-emerald-900 h-0.5 w-full gap-x-2 mt-2 mb-2">

            </div>
            <p className="text-emerald-900 font-serif text-sm mt-2 ml-2 line-clamp-4">
              Fresh, organic eggs from local farms. Perfect for breakfast or baking.
              mEOW MEOW MEOW MOEW meow meow meow meow meow
            </p>
          </div>
        </div>

    </div>

  </div>
  )
}