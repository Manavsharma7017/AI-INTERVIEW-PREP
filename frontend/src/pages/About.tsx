import { useState } from "react";
import {
  BadgeCheck,
  Code2,
  Rocket,
  Sparkles,
  MonitorSmartphone,
  Settings2,
} from "lucide-react";

export const About: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"me" | "website">("me");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 py-12 px-4">
      <div className="w-full max-w-3xl space-y-8">
        {/* Toggle Buttons */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => setActiveTab("me")}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm sm:text-base transition-all duration-200 ${
              activeTab === "me"
                ? "bg-blue-100 text-blue-700 shadow-md"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <BadgeCheck className="h-4 w-4" />
            <span>About Me</span>
          </button>

          <button
            onClick={() => setActiveTab("website")}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm sm:text-base transition-all duration-200 ${
              activeTab === "website"
                ? "bg-purple-100 text-purple-700 shadow-md"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <MonitorSmartphone className="h-4 w-4" />
            <span>About Website</span>
          </button>
        </div>

        {/* Card-like Content Box */}
        <div className="bg-white shadow-xl rounded-xl p-6 sm:p-8 text-gray-700 text-base sm:text-lg leading-relaxed space-y-6">
          {activeTab === "me" && (
            <>
              <div className="flex items-center gap-2 text-indigo-600 font-semibold text-lg">
                <BadgeCheck className="w-5 h-5 shrink-0" />
                About Me
              </div>

              <p>
                I'm a <strong className="text-indigo-700">MERN stack developer</strong> passionate about building high-performance full-stack applications. I also work with technologies like <strong>Go</strong>, <strong>Fiber</strong>, <strong>Next.js</strong>, <strong>TypeScript</strong>, and <strong>DevOps</strong>. My focus is on scalable systems, clean code, and intuitive user experiences.
              </p>

              <div>
                <h3 className="font-semibold text-gray-900 flex items-center gap-2 text-lg sm:text-xl mb-2">
                  <Rocket className="w-5 h-5 text-purple-500 shrink-0" />
                  Projects I'm Building
                </h3>
                <ul className="list-disc list-inside space-y-2 text-sm sm:text-base">
                  <li>
                    <strong className="text-gray-800">Smart Interview Platform</strong> – An AI-driven platform to simulate, score, and improve interview readiness.
                  </li>
                  <li>
                    <strong className="text-gray-800">GitHub Issue Checker</strong> – A live tool to monitor GitHub issues across multiple repositories and alert developers in real-time.
                  </li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row flex-wrap gap-3 pt-4 text-indigo-600 text-sm sm:text-base">
                <div className="flex items-center gap-2">
                  <Code2 className="w-4 h-4 shrink-0" />
                  Writing clean, maintainable code.
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 shrink-0" />
                  Exploring the latest in web innovation.
                </div>
              </div>
            </>
          )}

          {activeTab === "website" && (
            <>
              <div className="flex items-center gap-2 text-indigo-600 font-semibold text-lg">
                <MonitorSmartphone className="w-5 h-5 shrink-0" />
                About the Website
              </div>

              <p>
                This AI interview platform simulates real-world technical interviews with AI feedback. Here's how it works:
              </p>

              <ol className="list-decimal list-inside space-y-2 text-sm sm:text-base pl-1">
                <li>Select a question from the given starting set.</li>
                <li>Start an interview session — a new secure page opens.</li>
                <li>Anti-cheat activated: Switching tabs more than 3 times ends the session.</li>
                <li>Submit answers one by one — AI evaluates them live.</li>
                <li>Next questions are adapted dynamically based on your previous answers.</li>
                <li>View complete feedback and analysis after the interview ends.</li>
              </ol>

              <div>
                <h4 className="font-semibold flex items-center gap-2 text-lg sm:text-xl mb-2">
                  <Settings2 className="w-5 h-5 text-blue-600 shrink-0" />
                  Tech Stack
                </h4>
                <ul className="list-disc list-inside space-y-1 text-sm sm:text-base">
                  <li><strong>Frontend:</strong> React, TypeScript, TailwindCSS</li>
                  <li><strong>Backend:</strong> Go, Fiber, GORM, PostgreSQL</li>
                  <li><strong>AI Engine:</strong> Python (LangChain + Gemini) via gRPC initially but now using HTTPS {`(because of deployment issues, the gRPC version is on GitHub)`}</li>
                  <li><strong>Infra:</strong> Docker containers for frontend, Go backend, Python AI server</li>
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
