"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  ChevronUp,
  Menu,
  X,
  Users,
  BookOpen,
  BarChart3,
  GraduationCap,
  CheckCircle,
  LayoutDashboard,
  ClipboardList,
  School,
  Globe,
  Twitter,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import axios from "axios";
import { setTokens, clearTokens } from "@/utils/auth";

const features = [
  {
    title: "Role-based Dashboards",
    description:
      "Distinct interfaces for students and teachers, with tailored navigation and features designed for each user type.",
    image: "/features/dark/Role-based Dashboards teacher.png",
    imageAlt: "/features/dark/Role-based Dashboards student.png",
    icon: LayoutDashboard,
  },
  {
    title: "Quiz Management",
    description:
      "Students can attempt quizzes with per-question time limits; teachers can create, manage, and analyze quizzes with multiple question types.",
    image: "/features/dark/Quiz Management teacher.png",
    imageAlt: "/features/dark/Quiz attempt student.png",
    icon: ClipboardList,
  },
  {
    title: "Classroom Management",
    description:
      "Enroll in classrooms with unique codes, view classroom lists, and manage students with ease.",
    image: "/features/dark/Classroom Management teacher.png",
    icon: School,
  },
  {
    title: "Comprehensive Analytics",
    description:
      "Teachers access detailed stats on student performance, quiz attempts, and scores to track progress effectively.",
    image: "/features/dark/Analytics teacher.png",
    icon: BarChart3,
  },
];

const testimonials = [
  {
    text: "Assessify has completely transformed how I manage my classroom assessments. The analytics are incredibly insightful!",
    author: "Sarah Johnson",
    role: "High School Teacher",
    initials: "SJ",
    platform: "twitter",
  },
  {
    text: "As a student, I love how easy it is to take quizzes and track my progress. The interface is so intuitive.",
    author: "Michael Chen",
    role: "University Student",
    initials: "MC",
    platform: "twitter",
  },
  {
    text: "The classroom management features save me hours every week. Highly recommended for any educator!",
    author: "Emily Davis",
    role: "Middle School Teacher",
    initials: "ED",
    platform: "twitter",
  },
  {
    text: "Finally, a platform that understands what teachers and students actually need. Simple yet powerful.",
    author: "James Wilson",
    role: "College Professor",
    initials: "JW",
    platform: "twitter",
  },
  {
    text: "The quiz timer feature keeps students focused and engaged. It's made a real difference in my classes.",
    author: "Amanda Brown",
    role: "Elementary Teacher",
    initials: "AB",
    platform: "twitter",
  },
  {
    text: "I can easily see how my students are performing and identify who needs extra help. Game changer!",
    author: "Robert Taylor",
    role: "STEM Instructor",
    initials: "RT",
    platform: "twitter",
  },
];

const faqs = [
  {
    question: "What is Assessify?",
    answer:
      "Assessify is a comprehensive education platform that enables teachers to create and manage quizzes, track student performance, and organize classrooms efficiently. Students can take quizzes, view their scores, and track their learning progress.",
  },
  {
    question: "How do students join a classroom?",
    answer:
      "Students can join a classroom using a unique enrollment code provided by their teacher. Simply navigate to the Classrooms section and click 'Enroll in Classroom' to enter the code.",
  },
  {
    question: "Can teachers customize quiz time limits?",
    answer:
      "Yes! Teachers can set individual time limits for each question, allowing for flexible assessment designs that match the difficulty level of each question.",
  },
  {
    question: "Is Assessify free to use?",
    answer:
      "Yes, Assessify is currently free to use for both teachers and students. We believe in making quality education tools accessible to everyone.",
  },
];

export default function LandingPage() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedDemoRole, setSelectedDemoRole] = useState<
    "student" | "teacher" | null
  >(null);
  const [isDemoLoading, setIsDemoLoading] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleDemoLogin = async (role: "student" | "teacher") => {
    setSelectedDemoRole(role);
    setIsDemoLoading(true);

    try {
      // Clear any existing tokens without redirect
      clearTokens();

      // Login with demo credentials
      const username =
        role === "teacher"
          ? process.env.NEXT_PUBLIC_TEACHER_DEMO_USERNAME || "teacher"
          : process.env.NEXT_PUBLIC_STUDENT_DEMO_USERNAME || "student";

      const password = process.env.NEXT_PUBLIC_DEMO_PASSWORD || "Pass_1212";

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/token/`,
        {
          username,
          password,
        }
      );

      const { access: accessToken, refresh: refreshToken } = response.data;
      setTokens(accessToken, refreshToken);

      // Redirect to home
      router.push("/home");
    } catch (error) {
      console.error("Demo login error:", error);
      alert("Failed to login with demo account. Please try again.");
      setIsDemoLoading(false);
      setSelectedDemoRole(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white overflow-x-hidden">
      {/* Navigation */}
      <nav
        className={`fixed top-4 left-0 right-0 z-50 px-4 transition-all duration-300 ${
          isScrolled ? "" : ""
        }`}
      >
        <div
          className={`w-full mx-auto transition-all duration-300 ${
            isScrolled ? "md:max-w-3xl" : "md:max-w-7xl"
          }`}
        >
          <div
            className={`bg-[#1a1a1a]/10 backdrop-blur-md border border-white/10 rounded-full transition-all duration-300 hidden md:flex ${
              isScrolled ? "px-2" : "px-6 sm:px-8"
            }`}
            style={{
              willChange: "transform",
              transform: "translateZ(0)",
              backfaceVisibility: "hidden",
              perspective: "1000px",
            }}
          >
            <div className="flex items-center justify-between h-16 w-full">
              <div
                className={`flex items-center gap-2 transition-all duration-300 ${
                  isScrolled ? "ml-4" : ""
                }`}
              >
                <a href={process.env.NEXT_PUBLIC_URL}>
                  <Image
                    src="/logo-white.png"
                    alt="Assessify"
                    width={120}
                    height={32}
                  />
                </a>
              </div>

              <div className="flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
                <a
                  href="#features"
                  className="text-gray-300 hover:text-white transition"
                >
                  Features
                </a>
                <a
                  href="#demo"
                  className="text-gray-300 hover:text-white transition"
                >
                  Demo
                </a>
                <a
                  href="#testimonials"
                  className="text-gray-300 hover:text-white transition"
                >
                  Testimonials
                </a>
                <a
                  href="#faq"
                  className="text-gray-300 hover:text-white transition"
                >
                  FAQ
                </a>
              </div>

              <div className="flex items-center gap-4">
                <Link
                  href="/login"
                  className="text-gray-300 hover:text-white transition"
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-full font-medium transition"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden w-full bg-[#1a1a1a]/10 backdrop-blur-md border border-white/10 rounded-full px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center ml-[10px]">
                <a href={process.env.NEXT_PUBLIC_URL}>
                  <Image
                    src="/logo-white.png"
                    alt="Assessify"
                    width={120}
                    height={22}
                    className="flex-shrink-0 object-contain "
                  />
                </a>
              </div>

              <button
                className="flex items-center justify-center w-10 h-10 rounded-full text-gray-300 flex-shrink-0"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden w-full bg-[#1a1a1a]/20 backdrop-blur-md border border-white/10 rounded-2xl mt-2 overflow-hidden">
              <div className="flex flex-col gap-2 p-4">
                <a
                  href="#features"
                  className="text-gray-300 hover:text-white hover:bg-white/5 transition px-4 py-3 rounded-xl"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Features
                </a>
                <a
                  href="#demo"
                  className="text-gray-300 hover:text-white hover:bg-white/5 transition px-4 py-3 rounded-xl"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Demo
                </a>
                <a
                  href="#testimonials"
                  className="text-gray-300 hover:text-white hover:bg-white/5 transition px-4 py-3 rounded-xl"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Testimonials
                </a>
                <a
                  href="#faq"
                  className="text-gray-300 hover:text-white hover:bg-white/5 transition px-4 py-3 rounded-xl"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  FAQ
                </a>
                <hr className="border-white/10 my-2" />
                <Link
                  href="/login"
                  className="text-gray-300 hover:text-white hover:bg-white/5 transition px-4 py-3 rounded-xl"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-3 rounded-full font-medium transition text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-40 px-4 relative overflow-x-hidden">
        {/* Center Glow Effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] max-w-[90vw] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-emerald-600/10 border border-emerald-600/30 text-emerald-400 px-4 py-2 rounded-full text-sm mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Education Platform
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Empower learning &<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">
              assess effortlessly
            </span>
          </h1>

          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10">
            A comprehensive platform for teachers and students. Create quizzes,
            manage classrooms, and track performance — all in one place.
          </p>

          <div className="flex flex-col items-center gap-6 mb-16">
            {/* Decorative Arrows */}
            <svg
              width="100"
              height="50"
              viewBox="0 0 100 50"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              className="text-emerald-500"
            >
              <path d="M68.6958 5.40679C67.3329 12.7082 68.5287 20.1216 68.5197 27.4583C68.5189 29.5382 68.404 31.6054 68.1147 33.682C67.9844 34.592 69.4111 34.751 69.5414 33.8411C70.5618 26.5016 69.2488 19.104 69.4639 11.7325C69.5218 9.65887 69.7222 7.6012 70.0939 5.56265C70.1638 5.1949 69.831 4.81112 69.4601 4.76976C69.0891 4.72841 68.7689 5.01049 68.6958 5.40679Z"></path>
              <path d="M74.0117 26.1349C73.2662 27.1206 72.5493 28.1096 72.0194 29.235C71.5688 30.167 71.2007 31.137 70.7216 32.0658C70.4995 32.5033 70.252 32.9091 69.9475 33.3085C69.8142 33.4669 69.6779 33.654 69.5161 33.8093C69.4527 33.86 68.9199 34.2339 68.9167 34.2624C68.9263 34.1768 69.0752 34.3957 69.0055 34.2434C68.958 34.1515 68.8534 34.0531 68.8058 33.9612C68.6347 33.6821 68.4637 33.403 68.264 33.1208L67.1612 31.3512C66.3532 30.0477 65.5199 28.7126 64.7119 27.4093C64.5185 27.0699 63.9701 27.0666 63.7131 27.2979C63.396 27.5514 63.4053 27.9858 63.6018 28.2966C64.3845 29.5683 65.1956 30.8431 65.9783 32.1149L67.1572 33.9796C67.5025 34.5093 67.8225 35.2671 68.428 35.5368C69.6136 36.0446 70.7841 34.615 71.3424 33.7529C71.9992 32.786 72.4085 31.705 72.9035 30.6336C73.4842 29.3116 74.2774 28.1578 75.1306 26.9818C75.7047 26.2369 74.5573 25.3868 74.0117 26.1349ZM55.1301 12.2849C54.6936 18.274 54.6565 24.3076 55.0284 30.3003C55.1293 31.987 55.2555 33.7056 55.4419 35.4019C55.5431 36.3087 56.9541 36.0905 56.8529 35.1837C56.2654 29.3115 56.0868 23.3982 56.2824 17.4978C56.3528 15.8301 56.4263 14.1339 56.5537 12.4725C56.6301 11.5276 55.2034 11.3686 55.1301 12.2849Z"></path>
              <path d="M59.2642 30.6571C58.8264 31.475 58.36 32.2896 57.9222 33.1075C57.7032 33.5164 57.4843 33.9253 57.2369 34.3311C57.0528 34.6861 56.8656 35.0697 56.6278 35.3898C56.596 35.4152 56.5611 35.4691 56.5294 35.4944C56.4881 35.6054 56.5041 35.4627 56.5548 35.5261C56.7481 35.6055 56.8337 35.6151 56.7545 35.5484L56.6784 35.4533C56.6023 35.3581 56.5263 35.263 56.4534 35.1393C56.1778 34.7619 55.8734 34.3814 55.5946 34.0324C55.0146 33.2744 54.4315 32.545 53.8515 31.787C53.2685 31.0576 52.1584 31.945 52.7415 32.6744C53.4229 33.5592 54.1042 34.4441 54.7888 35.3004C55.1184 35.7127 55.4321 36.2677 55.8569 36.6039C56.3069 36.9719 56.884 36.9784 57.3533 36.6551C57.7624 36.3542 57.9845 35.9167 58.2067 35.4792C58.4636 34.9878 58.746 34.5282 59.003 34.0369C59.5423 33.0859 60.0563 32.1032 60.5957 31.1522C60.7765 30.8257 60.5104 30.3627 60.2092 30.2135C59.8161 30.112 59.4451 30.3305 59.2642 30.6571ZM44.5918 10.1569L42.2324 37.5406C42.0032 40.1151 41.8057 42.6641 41.5764 45.2386C41.5032 46.1549 42.9299 46.314 43.0032 45.3977L45.3626 18.014C45.5918 15.4396 45.7893 12.8905 46.0186 10.316C46.1235 9.37433 44.6968 9.21532 44.5918 10.1569Z"></path>
              <path d="M48.101 37.7616C46.7404 38.8232 45.8267 40.2814 44.9163 41.7109C44.0407 43.0866 43.1365 44.4592 41.738 45.3434C42.1247 45.5019 42.5146 45.6321 42.9014 45.7908C42.1324 41.8051 41.04 37.8699 39.6781 34.0203C39.545 33.6589 39.0695 33.5191 38.7365 33.6553C38.3719 33.817 38.2385 34.2353 38.3716 34.5969C39.7209 38.3007 40.7404 42.1121 41.4904 46.009C41.6012 46.5703 42.1877 46.7512 42.6539 46.4565C45.5462 44.6124 46.3877 40.9506 49.0169 38.8748C49.7178 38.2884 48.8304 37.1784 48.101 37.7616ZM25.9671 13.1014C25.7028 16.2497 26.0758 19.3824 26.5091 22.4929C26.9645 25.6636 27.4166 28.863 27.872 32.0337C28.1346 33.8253 28.3971 35.6167 28.631 37.4051C28.7607 38.3151 30.1717 38.0968 30.042 37.1868C29.5866 34.016 29.1281 30.8738 28.7012 27.7062C28.2647 24.6242 27.7396 21.5612 27.449 18.4666C27.2943 16.7449 27.2283 15.0042 27.3653 13.2572C27.4671 12.3442 26.0404 12.1851 25.9671 13.1014Z"></path>
              <path d="M30.5625 27.3357C29.9525 30.7343 29.3425 34.133 28.704 37.5284C29.1225 37.4018 29.5411 37.2751 29.9882 37.1516C28.6034 35.0617 27.2504 32.9465 25.8655 30.8565C25.6406 30.5425 25.1523 30.517 24.8669 30.7451C24.5497 30.9987 24.5305 31.4299 24.7555 31.7439C26.1403 33.8338 27.4933 35.9491 28.8781 38.039C29.2489 38.6003 30.0417 38.2265 30.1624 37.6621C30.7724 34.2635 31.3824 30.8648 32.0209 27.4694C32.0908 27.1016 31.758 26.7178 31.3871 26.6765C30.9559 26.6573 30.6324 26.9679 30.5625 27.3357Z"></path>
            </svg>

            {/* Try Demo Button */}
            <a href="#demo">
              <div className="group cursor-pointer border border-white/10 bg-white/5 gap-2 h-[60px] flex items-center p-[10px] rounded-full hover:border-emerald-600/30 transition-all">
                <div className="border border-white/10 bg-emerald-600 h-[40px] rounded-full flex items-center justify-center text-white">
                  <p className="font-medium tracking-tight mr-3 ml-3 flex items-center gap-2 justify-center text-base">
                    <Globe className="w-[18px] h-[18px]" />
                    Try Demo Now
                  </p>
                </div>
                <div className="text-gray-400 group-hover:ml-4 ease-in-out transition-all size-[24px] flex items-center justify-center rounded-full border-2 border-white/10">
                  <ArrowRight className="w-[14px] h-[14px] group-hover:rotate-180 ease-in-out transition-all" />
                </div>
              </div>
            </a>
          </div>

          <p className="text-gray-500 text-sm mb-4">
            Trusted by educators worldwide
          </p>
          <div className="flex justify-center gap-8 text-gray-600">
            <GraduationCap size={32} />
            <BookOpen size={32} />
            <Users size={32} />
            <BarChart3 size={32} />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="py-20 px-4 bg-gradient-to-b from-[#000000] to-[#0a0a0a] relative overflow-hidden"
      >
        <div className="bg-emerald-500 absolute -top-10 left-1/2 h-16 w-44 -translate-x-1/2 rounded-full opacity-40 blur-3xl select-none"></div>
        <div className="absolute top-0 left-1/2 h-px w-3/5 -translate-x-1/2 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent transition-all ease-in-out"></div>

        <div className="max-w-7xl mx-auto pt-20">
          <div className="text-center mb-16">
            <span className="text-emerald-500 text-sm font-medium tracking-wider uppercase">
              Features
            </span>
            <h2 className="text-3xl md:text-5xl font-bold mt-4">
              Everything you need to
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">
                manage education
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="border border-white/10 rounded-2xl overflow-hidden relative group hover:scale-[1.02] transition-transform duration-300"
                  onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    e.currentTarget.style.setProperty("--mouse-x", `${x}px`);
                    e.currentTarget.style.setProperty("--mouse-y", `${y}px`);
                  }}
                  style={{
                    background:
                      "radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(16, 185, 129, 0.15), #000000 40%)",
                  }}
                >
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-emerald-600/0 rounded-lg flex-shrink-0">
                        <Icon className="w-8 h-8 text-emerald-500" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-2">
                          {feature.title}
                        </h3>
                        <p className="text-gray-400 text-sm">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="relative w-full">
                    <Image
                      src={feature.image}
                      alt={feature.title}
                      width={800}
                      height={450}
                      className="w-full h-auto"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold text-emerald-500 mb-2">
                100+
              </div>
              <div className="text-gray-400">Active Teachers</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-emerald-500 mb-2">
                1000+
              </div>
              <div className="text-gray-400">Students</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-emerald-500 mb-2">
                5000+
              </div>
              <div className="text-gray-400">Quizzes Created</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-emerald-500 mb-2">
                99%
              </div>
              <div className="text-gray-400">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Try Demo Section */}
      <section id="demo" className="pt-40 pb-20 px-4 bg-[#0a0a0a]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-emerald-500 text-sm font-medium tracking-wider uppercase">
              Try it now
            </span>
            <h2 className="text-3xl md:text-5xl font-bold mt-4 mb-4">
              Experience Assessify
            </h2>
            <p className="text-gray-400 text-lg">
              Choose a demo account to explore the platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <div
              className={cn(
                "relative cursor-pointer rounded-2xl border-2 p-8 transition-all duration-300 hover:scale-105 group",
                selectedDemoRole === "student"
                  ? "border-emerald-500 bg-emerald-500/10"
                  : "border-white/10 bg-white/5 hover:border-emerald-500/30"
              )}
              onClick={() => !isDemoLoading && handleDemoLogin("student")}
            >
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="p-4 rounded-full transition-colors bg-white/5 group-hover:bg-emerald-500/20">
                  <GraduationCap className="h-12 w-12 text-gray-400 group-hover:text-emerald-400 transition-colors" />
                </div>
                <div className="space-y-2">
                  <p
                    className={cn(
                      "text-xl font-semibold",
                      selectedDemoRole === "student"
                        ? "text-emerald-400"
                        : "text-white"
                    )}
                  >
                    Student Demo
                  </p>
                  <p className="text-sm text-gray-400">
                    Take assessments and view your results
                  </p>
                </div>
                {isDemoLoading && selectedDemoRole === "student" && (
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-500"></div>
                )}
              </div>
              {selectedDemoRole === "student" && !isDemoLoading && (
                <div className="absolute right-4 top-4">
                  <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
                </div>
              )}
            </div>

            <div
              className={cn(
                "relative cursor-pointer rounded-2xl border-2 p-8 transition-all duration-300 hover:scale-105 group",
                selectedDemoRole === "teacher"
                  ? "border-emerald-500 bg-emerald-500/10"
                  : "border-white/10 bg-white/5 hover:border-emerald-500/30"
              )}
              onClick={() => !isDemoLoading && handleDemoLogin("teacher")}
            >
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="p-4 rounded-full transition-colors bg-white/5 group-hover:bg-emerald-500/20">
                  <Users className="h-12 w-12 text-gray-400 group-hover:text-emerald-400 transition-colors" />
                </div>
                <div className="space-y-2">
                  <p
                    className={cn(
                      "text-xl font-semibold",
                      selectedDemoRole === "teacher"
                        ? "text-emerald-400"
                        : "text-white"
                    )}
                  >
                    Teacher Demo
                  </p>
                  <p className="text-sm text-gray-400">
                    Create and manage assessments
                  </p>
                </div>
                {isDemoLoading && selectedDemoRole === "teacher" && (
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-500"></div>
                )}
              </div>
              {selectedDemoRole === "teacher" && !isDemoLoading && (
                <div className="absolute right-4 top-4">
                  <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        id="testimonials"
        className="pt-40 pb-20 px-4 bg-gradient-to-b from-[#0a0a0a] to-[#000000] relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-emerald-500 text-sm font-medium tracking-wider uppercase">
              Testimonials
            </span>
            <h2 className="text-3xl md:text-5xl font-bold mt-4">
              What our users say
            </h2>
            <p className="text-gray-400 mt-4 max-w-xl mx-auto">
              From teachers to students, Assessify has become an essential tool
              for classrooms around the world.
            </p>
          </div>

          <div className="relative mb-12 flex max-h-[600px] justify-center gap-6 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)]">
            {/* Column 1 - Scrolling Down */}
            <div className="flex flex-col gap-6 animate-scroll-1">
              {[
                ...testimonials.slice(0, 2),
                ...testimonials.slice(0, 2),
                ...testimonials.slice(0, 2),
              ].map((testimonial, index) => (
                <div
                  key={`col1-${index}`}
                  className="bg-[#000000] border border-white/10 rounded-2xl p-6 hover:border-emerald-600/30 transition flex-shrink-0 w-[350px]"
                >
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-600/20 text-emerald-500 flex items-center justify-center font-semibold text-sm flex-shrink-0">
                      {testimonial.initials}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div className="font-medium">{testimonial.author}</div>
                        <Twitter className="w-4 h-4 text-blue-400" />
                      </div>
                      <div className="text-gray-500 text-sm">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm">
                    &ldquo;{testimonial.text}&rdquo;
                  </p>
                </div>
              ))}
            </div>

            {/* Column 2 - Scrolling Up */}
            <div className="hidden md:flex flex-col gap-6 animate-scroll-2">
              {[
                ...testimonials.slice(2, 4),
                ...testimonials.slice(2, 4),
                ...testimonials.slice(2, 4),
              ].map((testimonial, index) => (
                <div
                  key={`col2-${index}`}
                  className="bg-[#000000] border border-white/10 rounded-2xl p-6 hover:border-emerald-600/30 transition flex-shrink-0 w-[350px]"
                >
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-600/20 text-emerald-500 flex items-center justify-center font-semibold text-sm flex-shrink-0">
                      {testimonial.initials}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div className="font-medium">{testimonial.author}</div>
                        <Twitter className="w-4 h-4 text-blue-400" />
                      </div>
                      <div className="text-gray-500 text-sm">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm">
                    &ldquo;{testimonial.text}&rdquo;
                  </p>
                </div>
              ))}
            </div>

            {/* Column 3 - Scrolling Down */}
            <div className="hidden lg:flex flex-col gap-6 animate-scroll-3">
              {[
                ...testimonials.slice(4, 6),
                ...testimonials.slice(4, 6),
                ...testimonials.slice(4, 6),
              ].map((testimonial, index) => (
                <div
                  key={`col3-${index}`}
                  className="bg-[#000000] border border-white/10 rounded-2xl p-6 hover:border-emerald-600/30 transition flex-shrink-0 w-[350px]"
                >
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-600/20 text-emerald-500 flex items-center justify-center font-semibold text-sm flex-shrink-0">
                      {testimonial.initials}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div className="font-medium">{testimonial.author}</div>
                        <Twitter className="w-4 h-4 text-blue-400" />
                      </div>
                      <div className="text-gray-500 text-sm">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm">
                    &ldquo;{testimonial.text}&rdquo;
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center">
            <a
              href="https://twitter.com/intent/tweet?text=I%20love%20using%20Assessify!%20%23Assessify"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-blue-500/30 hover:border-blue-500 hover:bg-blue-500/10 text-blue-400 px-6 py-3 rounded-full font-medium transition text-sm"
            >
              <Twitter className="w-4 h-4" />
              Share Your Experience
            </a>
          </div>
        </div>

        <style jsx>{`
          @keyframes scroll {
            0% {
              transform: translateY(0);
            }
            100% {
              transform: translateY(calc(-100% / 3));
            }
          }
          @keyframes scroll-reverse {
            0% {
              transform: translateY(calc(-100% / 3));
            }
            100% {
              transform: translateY(0);
            }
          }
          .animate-scroll-1 {
            animation: scroll 20s linear infinite;
          }
          .animate-scroll-2 {
            animation: scroll-reverse 20s linear infinite;
          }
          .animate-scroll-3 {
            animation: scroll 20s linear infinite;
          }
        `}</style>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-emerald-900/50 to-emerald-800/30 border border-emerald-600/30 rounded-3xl p-8 md:p-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                Ready to Transform Your Classroom?
              </h2>
              <p className="text-gray-300 text-lg mb-8 max-w-xl mx-auto">
                Join thousands of educators and students who are already using
                Assessify to enhance their learning experience.
              </p>
              <div className="flex flex-col items-center gap-6">
                {/* Decorative Arrows */}
                <svg
                  width="100"
                  height="50"
                  viewBox="0 0 100 50"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-white"
                >
                  <path d="M68.6958 5.40679C67.3329 12.7082 68.5287 20.1216 68.5197 27.4583C68.5189 29.5382 68.404 31.6054 68.1147 33.682C67.9844 34.592 69.4111 34.751 69.5414 33.8411C70.5618 26.5016 69.2488 19.104 69.4639 11.7325C69.5218 9.65887 69.7222 7.6012 70.0939 5.56265C70.1638 5.1949 69.831 4.81112 69.4601 4.76976C69.0891 4.72841 68.7689 5.01049 68.6958 5.40679Z"></path>
                  <path d="M74.0117 26.1349C73.2662 27.1206 72.5493 28.1096 72.0194 29.235C71.5688 30.167 71.2007 31.137 70.7216 32.0658C70.4995 32.5033 70.252 32.9091 69.9475 33.3085C69.8142 33.4669 69.6779 33.654 69.5161 33.8093C69.4527 33.86 68.9199 34.2339 68.9167 34.2624C68.9263 34.1768 69.0752 34.3957 69.0055 34.2434C68.958 34.1515 68.8534 34.0531 68.8058 33.9612C68.6347 33.6821 68.4637 33.403 68.264 33.1208L67.1612 31.3512C66.3532 30.0477 65.5199 28.7126 64.7119 27.4093C64.5185 27.0699 63.9701 27.0666 63.7131 27.2979C63.396 27.5514 63.4053 27.9858 63.6018 28.2966C64.3845 29.5683 65.1956 30.8431 65.9783 32.1149L67.1572 33.9796C67.5025 34.5093 67.8225 35.2671 68.428 35.5368C69.6136 36.0446 70.7841 34.615 71.3424 33.7529C71.9992 32.786 72.4085 31.705 72.9035 30.6336C73.4842 29.3116 74.2774 28.1578 75.1306 26.9818C75.7047 26.2369 74.5573 25.3868 74.0117 26.1349ZM55.1301 12.2849C54.6936 18.274 54.6565 24.3076 55.0284 30.3003C55.1293 31.987 55.2555 33.7056 55.4419 35.4019C55.5431 36.3087 56.9541 36.0905 56.8529 35.1837C56.2654 29.3115 56.0868 23.3982 56.2824 17.4978C56.3528 15.8301 56.4263 14.1339 56.5537 12.4725C56.6301 11.5276 55.2034 11.3686 55.1301 12.2849Z"></path>
                  <path d="M59.2642 30.6571C58.8264 31.475 58.36 32.2896 57.9222 33.1075C57.7032 33.5164 57.4843 33.9253 57.2369 34.3311C57.0528 34.6861 56.8656 35.0697 56.6278 35.3898C56.596 35.4152 56.5611 35.4691 56.5294 35.4944C56.4881 35.6054 56.5041 35.4627 56.5548 35.5261C56.7481 35.6055 56.8337 35.6151 56.7545 35.5484L56.6784 35.4533C56.6023 35.3581 56.5263 35.263 56.4534 35.1393C56.1778 34.7619 55.8734 34.3814 55.5946 34.0324C55.0146 33.2744 54.4315 32.545 53.8515 31.787C53.2685 31.0576 52.1584 31.945 52.7415 32.6744C53.4229 33.5592 54.1042 34.4441 54.7888 35.3004C55.1184 35.7127 55.4321 36.2677 55.8569 36.6039C56.3069 36.9719 56.884 36.9784 57.3533 36.6551C57.7624 36.3542 57.9845 35.9167 58.2067 35.4792C58.4636 34.9878 58.746 34.5282 59.003 34.0369C59.5423 33.0859 60.0563 32.1032 60.5957 31.1522C60.7765 30.8257 60.5104 30.3627 60.2092 30.2135C59.8161 30.112 59.4451 30.3305 59.2642 30.6571ZM44.5918 10.1569L42.2324 37.5406C42.0032 40.1151 41.8057 42.6641 41.5764 45.2386C41.5032 46.1549 42.9299 46.314 43.0032 45.3977L45.3626 18.014C45.5918 15.4396 45.7893 12.8905 46.0186 10.316C46.1235 9.37433 44.6968 9.21532 44.5918 10.1569Z"></path>
                  <path d="M48.101 37.7616C46.7404 38.8232 45.8267 40.2814 44.9163 41.7109C44.0407 43.0866 43.1365 44.4592 41.738 45.3434C42.1247 45.5019 42.5146 45.6321 42.9014 45.7908C42.1324 41.8051 41.04 37.8699 39.6781 34.0203C39.545 33.6589 39.0695 33.5191 38.7365 33.6553C38.3719 33.817 38.2385 34.2353 38.3716 34.5969C39.7209 38.3007 40.7404 42.1121 41.4904 46.009C41.6012 46.5703 42.1877 46.7512 42.6539 46.4565C45.5462 44.6124 46.3877 40.9506 49.0169 38.8748C49.7178 38.2884 48.8304 37.1784 48.101 37.7616ZM25.9671 13.1014C25.7028 16.2497 26.0758 19.3824 26.5091 22.4929C26.9645 25.6636 27.4166 28.863 27.872 32.0337C28.1346 33.8253 28.3971 35.6167 28.631 37.4051C28.7607 38.3151 30.1717 38.0968 30.042 37.1868C29.5866 34.016 29.1281 30.8738 28.7012 27.7062C28.2647 24.6242 27.7396 21.5612 27.449 18.4666C27.2943 16.7449 27.2283 15.0042 27.3653 13.2572C27.4671 12.3442 26.0404 12.1851 25.9671 13.1014Z"></path>
                  <path d="M30.5625 27.3357C29.9525 30.7343 29.3425 34.133 28.704 37.5284C29.1225 37.4018 29.5411 37.2751 29.9882 37.1516C28.6034 35.0617 27.2504 32.9465 25.8655 30.8565C25.6406 30.5425 25.1523 30.517 24.8669 30.7451C24.5497 30.9987 24.5305 31.4299 24.7555 31.7439C26.1403 33.8338 27.4933 35.9491 28.8781 38.039C29.2489 38.6003 30.0417 38.2265 30.1624 37.6621C30.7724 34.2635 31.3824 30.8648 32.0209 27.4694C32.0908 27.1016 31.758 26.7178 31.3871 26.6765C30.9559 26.6573 30.6324 26.9679 30.5625 27.3357Z"></path>
                </svg>

                <Link href="/register">
                  <div className="group cursor-pointer border border-white/10 bg-white/5 gap-2 h-[60px] inline-flex items-center p-[10px] rounded-full hover:border-emerald-600/30 transition-all">
                    <div className="border border-white/10 bg-emerald-600 h-[40px] rounded-full flex items-center justify-center text-white">
                      <p className="font-medium tracking-tight mr-3 ml-3 flex items-center gap-2 justify-center text-base">
                        <Globe className="w-[18px] h-[18px]" />
                        Get started free
                      </p>
                    </div>
                    <div className="text-gray-400 group-hover:ml-4 ease-in-out transition-all size-[24px] flex items-center justify-center rounded-full border-2 border-white/10">
                      <ArrowRight className="w-[14px] h-[14px] group-hover:rotate-180 ease-in-out transition-all" />
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="pt-40 pb-20 px-4 bg-[#000000]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-emerald-500 text-sm font-medium tracking-wider uppercase">
              FAQ
            </span>
            <h2 className="text-3xl md:text-5xl font-bold mt-4">
              Questions? We&apos;ve got
              <br />
              answers
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-[#000000] border border-white/10 rounded-xl overflow-hidden transition-all duration-300 hover:border-emerald-600/30"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors duration-200"
                >
                  <span className="font-medium">{faq.question}</span>
                  <ChevronDown
                    className={`transition-all duration-300 ${
                      openFaq === index
                        ? "rotate-180 text-emerald-500"
                        : "text-gray-500"
                    }`}
                    size={20}
                  />
                </button>
                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    openFaq === index
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="px-6 pb-4 text-gray-400">{faq.answer}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-2">
              <a href={process.env.NEXT_PUBLIC_URL}>
                <Image
                  src="/logo-white.png"
                  alt="Assessify"
                  width={120}
                  height={32}
                />
              </a>
            </div>

            <div className="flex flex-wrap justify-center gap-8 text-gray-400">
              <a href="#features" className="hover:text-white transition">
                Features
              </a>
              <a href="#testimonials" className="hover:text-white transition">
                Testimonials
              </a>
              <a href="#faq" className="hover:text-white transition">
                FAQ
              </a>
              <a href={process.env.NEXT_PUBLIC_API_URL} className="hover:text-white transition">
                API
              </a>
              <a href={`${process.env.NEXT_PUBLIC_API_URL}/redoc`} className="hover:text-white transition">
                Redoc
              </a>
              <Link href="/login" className="hover:text-white transition">
                Login
              </Link>
              <Link href="/register" className="hover:text-white transition">
                Register
              </Link>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-white/10 text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} Assessify. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
