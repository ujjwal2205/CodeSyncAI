import { motion } from "framer-motion";
import { X, CheckCircle } from "lucide-react";
import { useStore } from "@/context/StoreContext";
export default function BeforeAfter() {
  const { setOpenLogin,isLoggedIn } = useStore();
  return (
    <section className="relative w-full -my-[70px] py-28 px-6 bg-black text-white overflow-hidden">
      
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05),transparent_70%)]" />

      <div className="max-w-6xl mx-auto relative z-10">

        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-4xl md:text-5xl font-semibold text-center mb-20"
        >
          Code Together. In Real-Time.
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-10 relative">

          <div className="hidden md:block absolute left-1/2 top-0 h-full w-[1px] bg-gradient-to-b from-transparent via-neutral-700 to-transparent" />

          <motion.div
            className="group border border-neutral-800 rounded-3xl p-8"
          >
            <h3 className="text-2xl font-semibold mb-6 text-red-400">
              Without CodeSync
            </h3>

            <ul className="space-y-5">
              {[
                "No real-time collaboration",
                "Slow debugging process",
                "No instant feedback",
                "Switching between tools",
                "Difficult interviews",
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-neutral-400">
                  <X className="text-red-400 w-5 h-5" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            className="group border border-neutral-700 rounded-3xl p-8 bg-gradient-to-b from-neutral-900/80 to-neutral-950 backdrop-blur-xl shadow-[0_0_40px_rgba(255,255,255,0.05)] transition duration-300"
          >
            <h3 className="text-2xl font-semibold mb-6 text-emerald-400">
              With CodeSync AI
            </h3>

            <ul className="space-y-5">
              {[
                "Live multi-user collaboration",
                "Faster debugging together",
                "AI-powered suggestions",
                "All-in-one coding workspace",
                "Perfect for interviews & teams",
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-neutral-200">
                  <CheckCircle className="text-emerald-400 w-5 h-5" />
                  {item}
                </li>
              ))}
            </ul>

            <div className="absolute inset-0 rounded-3xl bg-white/5 opacity-0 group-hover:opacity-80 transition duration-300 blur-2xl" />
          </motion.div>

        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mt-20"
        >
          {isLoggedIn ? (
          <button className="px-10 py-4 rounded-2xl bg-white text-black font-medium hover:bg-neutral-200 transition duration-200 shadow-lg cursor-pointer">
              Launch Live Room →
            </button>) : (
            <button className="px-10 py-4 rounded-2xl bg-white text-black font-medium hover:bg-neutral-200 transition duration-200 shadow-lg cursor-pointer" onClick={() => setOpenLogin(true)}>
              Launch Live Room →
            </button>
          )}
        </motion.div>

      </div>
    </section>
  );
}