export default function Header() {
  return (
    <section className="relative min-h-170 w-full bg-black text-white flex items-center overflow-hidden">
      
      <div className="absolute inset-0 bg-gradient-to-br from-neutral-950 via-black to-black" />
      <div className="absolute top-[-150px] left-[-150px] w-[400px] h-[400px] bg-white/5 rounded-full blur-3xl" />
      <div className="absolute bottom-[-150px] right-[-150px] w-[400px] h-[400px] bg-white/5 rounded-full blur-3xl" />

      <div className="relative w-full px-6 md:px-16 lg:px-24 grid md:grid-cols-2 gap-20 items-center">
        <div>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight tracking-tight">
            Write Code <br />
            <span className="bg-gradient-to-r from-white via-neutral-300 to-neutral-500 bg-clip-text text-transparent">
              Together. Instantly.
            </span>
          </h1>

          <p className="mt-6 text-lg text-neutral-400 max-w-xl leading-relaxed">
            A real-time code sharing workspace for practicing, debugging, and solving problems together.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            
            <button className="px-7 py-3 bg-[#f5f5dc] text-black font-semibold rounded-2xl hover:scale-105 cursor-pointer hover:shadow-[0_10px_30px_rgba(255,255,255,0.2)] transition duration-200">
              Create Room
            </button>

            <button className="px-7 py-3 border border-neutral-700 rounded-2xl hover:bg-neutral-900 hover:border-neutral-500 transition duration-200 cursor-pointer">
              Join Room
            </button>

          </div>
          <p className="mt-6 text-sm text-neutral-500">
            Works in browser • No installation • Instant sharing
          </p>
        </div>

        <div className="relative w-full">
          
          <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent blur-2xl rounded-3xl" />

          <div className="relative bg-neutral-900/80 backdrop-blur-xl rounded-2xl p-5 border border-neutral-800 shadow-[0_25px_80px_rgba(0,0,0,0.7)] ">
            <div className="flex items-center justify-between mb-4">
              <div className="flex gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full" />
                <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                <div className="w-3 h-3 bg-green-500 rounded-full" />
              </div>
              <span className="text-xs text-neutral-500">live_session.js</span>
            </div>

            <pre className="text-sm text-neutral-300 leading-relaxed relative">
{`function multiply(a, b) {
  return a * b;
}

// Teammate editing...
console.log(multiply(4, 5));`}
              <span className="inline-block w-[2px] h-4 bg-white ml-1 animate-pulse" />
            </pre>

            <div className="mt-5 flex items-center gap-3 text-xs">
              <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full">
                ● You
              </span>
              <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full">
                ● Teammate
              </span>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}