export default function VendorPage({ params }) {
  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold">Vendor Page</h1>
      <p className="mt-2">Vendor ID: {params.id}</p>
    </main>
  );
}