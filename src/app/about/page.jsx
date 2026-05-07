import NavBar from "../../components/NavBar";

export default function About() {
  return (
    <>
      <NavBar />
      <div className="bg-emerald-50 object-fill">
        <h1 className="text-3xl font-bold font-serif text-emerald-900 text-center py-4">
          About Us
        </h1>
        <hr className="border-emerald-400 mb-8 h-0.5" />
        <p className="text-lg text-emerald-800 font-serif max-w-3xl mx-auto px-4 mb-4 text-center">
          Hello and welcome to fresh2table! Our mission is to display local
          vendors who are selling fresh produce either from their backyard
          gardens or very own farms. We as a small business would like to create
          a friendly community in which we can support each other. Our farmers
          receive profits that can go towards their lifestyle and produce
          quality, while our customers receive exceptional products and live a
          healthier lifestyle that does not include extra additives. Our belief
          is that hosting this site will help benefit both parties and allow for
          easier access to local foods. We sincerely hope you join our growing
          community and continue to support us!
        </p>
        <h2 className="text-xl font-bold font-serif text-emerald-900 text-center py-4">
          Contact Us:&nbsp;
          <a
            href="mailto:fresh2table@gmail.com"
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
        <hr className="border-emerald-400 mt-8 h-0.5" />
        <h1 className="text-3xl font-bold font-serif text-emerald-900 text-center py-4">
          . ݁₊ ⊹ . ݁Our Developer Team ݁ . ⊹ ₊ ݁.
        </h1>
        <div className="items-center flex flex-col justify-center mb-8">
          <h2 className="text-lg font-bold font-serif text-emerald-700 max-w-2xl w-full my-2 px-4 text-center">
            Meet the devs for fresh2table! We are a group of students at CSUSB
            pursuing a degree in something related to computers and we are so
            excited that we got the opportunity to work on this as a real dev
            team would! Making this project has been a great learning experience
            for all of us and we've come out of it knowing so much more than we
            did before. We hope you enjoy what we've made! Thank you so much for
            a great course :)
          </h2>
          <h2 className="text-lg font-bold font-serif text-emerald-700 mb-4 mx-8 text-center">
            - fresh2table devs , Software Engineering Spring 2026
          </h2>
          <img
            src="/team.jpg"
            alt="Developer Team"
            className="w-full max-w-md h-auto rounded-lg border-emerald-950 border-4"
          />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 m-4">
          <div className="bg-emerald-100 h-70 rounded-lg shadow-lg p-6 w-full md:w-1/3 text-center">
            <h2 className="text-lg font-bold font-serif text-emerald-900 mb-2">
              Charlene Calderon
            </h2>

            <img
              src="/charlene.png"
              alt="Charlene Calderon"
              className="w-full h-auto rounded-lg border-emerald-800 border-2"
            />
            <p className="text-emerald-700 font-bold">Project Manager</p>
          </div>
          <div className="bg-emerald-100 h-70 rounded-lg shadow-lg p-6 w-full md:w-1/3 text-center">
            <h2 className="text-lg font-bold font-serif text-emerald-900 mb-2">
              Andrew Duran
            </h2>
            <img
              src="/andrew.png"
              alt="Andrew Duran"
              className="w-full h-auto rounded-lg border-emerald-800 border-2"
            />
            <p className="text-emerald-700 font-bold line-clamp-2">
              Assistant Manager
            </p>
          </div>
          <div className="bg-emerald-100 h-70 rounded-lg shadow-lg p-6 w-full md:w-1/3 text-center">
            <h2 className="text-lg font-bold font-serif text-emerald-900 mb-2">
              Anastasia Dettman
            </h2>
            <img
              src="/anastasia.png"
              alt="Anastasia Dettman"
              className="w-full h-auto rounded-lg border-emerald-800 border-2"
            />
            <p className="text-emerald-700 font-bold line-clamp-2">
              Quality Assurance
            </p>
          </div>
          <div className="bg-emerald-100 h-70 rounded-lg shadow-lg p-6 w-full md:w-1/3 text-center">
            <h2 className="text-lg font-bold font-serif text-emerald-900 mb-2">
              Kimmy Robbins
            </h2>
            <img
              src="/kimmy.png"
              alt="Kimmy Robbins"
              className="w-full h-auto rounded-lg border-emerald-800 border-2"
            />
            <p className="text-emerald-700 font-bold line-clamp-2">
              Lead FE Developer
            </p>
          </div>
          <div className="bg-emerald-100 h-70 rounded-lg shadow-lg p-6 w-full md:w-1/3 text-center">
            <h2 className="text-lg font-bold font-serif text-emerald-900 mb-2">
              Juan Miranda
            </h2>
            <img
              src="/juan.png"
              alt="Juan Miranda"
              className="w-full h-auto rounded-lg border-emerald-800 border-2"
            />
            <p className="text-emerald-700 font-bold line-clamp-2">
              Lead BE Developer
            </p>
          </div>
          <div className="bg-emerald-100 h-70 rounded-lg shadow-lg p-6 w-full md:w-1/3 text-center">
            <h2 className="text-lg font-bold font-serif text-emerald-900 mb-2">
              Asad Muscati
            </h2>
            <img
              src="/asad.png"
              alt="Asad Muscati"
              className="w-full h-auto rounded-lg border-emerald-800 border-2"
            />
            <p className="text-emerald-700 font-bold line-clamp-2">
              Frontend Developer
            </p>
          </div>
          <div className="bg-emerald-100 h-70 rounded-lg shadow-lg p-6 w-full md:w-1/3 text-center">
            <h2 className="text-lg font-bold font-serif text-emerald-900 mb-2">
              Thomas Ketchum
            </h2>
            <img
              src="/thomas.png"
              alt="Thomas Ketchum"
              className="w-full h-auto rounded-lg border-emerald-800 border-2"
            />
            <p className="text-emerald-700 font-bold line-clamp-2">
              Backend Developer
            </p>
          </div>
          <div className="bg-emerald-100 h-70 rounded-lg shadow-lg p-6 w-full md:w-1/3 text-center">
            <h2 className="text-lg font-bold font-serif text-emerald-900 mb-2">
              FNU Aprajita
            </h2>
            <img
              src="/aprajita.png"
              alt="Aprajita"
              className="w-full h-auto rounded-lg border-emerald-800 border-2"
            />
            <p className="text-emerald-700 font-bold line-clamp-2">
              Frontend Developer
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
