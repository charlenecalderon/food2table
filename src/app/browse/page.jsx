import NavBar from "../../../components/NavBar";
import Link from "next/link"

{/*layout for the data to be shown as a card*/}
function ProductCard({ product }) {
  return (
    <div className="bg-green-200 text-white rounded-xl w-72 p-4">
      <img
        className="rounded-xl h-40 w-full object-cover"
        src={product.img}
        alt={product.name}
      />
      <div className="flex justify-between items-center mt-2">
        <h2 className="text-emerald-900 font-bold font-serif">{product.name}</h2>
        <span className="text-emerald-900 font-bold">{product.price}</span>
      </div>
      <div className="flex justify-between mt-2">
        <Link href={`/vendor/${product.vendor.toLowerCase().replace(/\s+/g, '-')}`}>
          <button className="bg-emerald-900 hover:bg-emerald-700 rounded-full px-3 py-1 text-sm text-white">
            {product.vendor}
          </button>
        </Link>
      </div>
      <p className="text-emerald-900 font-serif text-sm mt-2 line-clamp-4">{product.desc}</p>
    </div>
  )
}

{/*mock data */}
function ProductsExamples() {
  const products = [
    {
      id: 1,
      name: 'Eggs',
      price: '$3.99',
      vendor: 'Local Farm',
      img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSdIC8P1fXIU3Au62klNg7tc_BmUEelpxvJ3Q&s',
      desc: 'Fresh, organic eggs from local farms. Perfect for breakfast or baking.'
    },
    {
      id: 2,
      name: 'Milk',
      price: '$2.49',
      vendor: 'Dairy Co',
      img: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=800&q=80',
      desc: 'Creamy whole milk from pasture-raised cows.'
    },
    {
      id: 3,
      name: 'Apple Bag',
      price: '$4.50',
      vendor: 'Orchard',
      img: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=800&q=80',
      desc: 'Crisp, sweet apples picked this season.'
    },
    {
      id: 4,
      name: 'Sourdough Bread',
      price: '$5.00',
      vendor: 'Baker',
      img: 'https://images.unsplash.com/photo-1585478259715-876acc5be8eb?w=800&q=80',
      desc: 'Handmade sourdough with a crisp crust and chewy crumb.'
    }
  ]

  return (
    <div className="p-5">
      <div className="flex flex-wrap gap-6 justify-start">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  )
}

export default function Browse() {
  return (
    <div className="bg-emerald-50 min-h-screen w-screen object-fill">
      {/* products section */}
      <ProductsExamples />
    </div>
  )
}
