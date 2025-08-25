import PoPup from "./popup";
import RemoveBgPage from "./pages/RemoveBgPage";

const App = () => {
  return (
    <main>
      <header className="flex items-center justify-between py-4 px-7 fixed w-full top-0 backdrop-blur-2xl z-20">
        
        <img src="/logo.svg" className="w-8" alt="" />
        <button className="py-2 px-4 font-extralight text-gray-950 bg-gray-100 rounded text-sm cursor-not-allowed">
          Login
        </button>
      </header>
      <div className="bg-green-600/25 w-72 h-72 fixed -z-10 blur-3xl left-1/2 bottom-14 -translate-x-1/2 "></div>
      <div className="bg-pink-600/25 w-72 h-72 fixed -z-10 blur-3xl -bottom-14 -left-14"></div>
      <div className="bg-purple-600/25 w-72 h-72 fixed -z-10 blur-3xl -bottom-14 -right-14"></div>
      <section
        className="w-full max-w-5xl mx-auto my-10 p-2
      "
      >
        <PoPup/>
        <div>
          <RemoveBgPage />
        </div>
      </section>
    </main>
  );
};

export default App;