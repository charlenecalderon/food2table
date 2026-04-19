import NavBar from "../../components/NavBar";

export default function About() {
  return (
    <>
      <NavBar />
      <div className="bg-emerald-50 min-h-screen w-screen object-fill">
        <h1 className="text-3xl font-bold font-serif text-emerald-900 text-center py-4">
          About Us
        </h1>
        <hr className="border-emerald-400 mb-8 h-0.5" />
        <p className="text-lg text-emerald-800 font-serif max-w-3xl mx-auto px-4 mb-4">
          Hello and welcome to fresh2table! Our mission is to display local
          vendors who are selling fresh produce either from their backyard
          gardens or very own farms. We as a small business would like to create
          a friendly community in which we can support each other. Our farmers
          receive profits that can go towards their lifestyle and produce
          quality, while our customers receive exceptional products and live a
          healthier lifestyle that doesn’t include extra additives. Our belief
          is that hosting this site will help benefit both parties and allow for
          easier access to local foods. We sincerely hope you join our growing
          community and continue to support us!
        </p>
        <h2 className="text-xl font-bold font-serif text-emerald-900 text-center py-4">
          Contact Us:{" "}
          <a
            href="mailto:@fresh2table@gmail.com"
            className="text-emerald-600 hover:underline"
          >
            fresh2table@gmail.com
          </a>
        </h2>
        <h2 className="text-xl font-bold font-serif text-emerald-900 text-center py-4">
          Tag Us:{" "}
          <a
            href="https://www.instagram.com/fresh2table/"
            className="text-emerald-600 hover:underline"
          >
            @fresh2table
          </a>
        </h2>
      </div>
    </>
  );
}
