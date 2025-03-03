import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Activity,
  Stethoscope,
  ChartLine,
  ArrowUpRight,
  Menu,
  X,
  Star,
  Plus,
  MinusCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const Index = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b bg-white/75 backdrop-blur-md fixed w-full z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex-shrink-0">
              <span className="text-xl font-bold text-primary">withyou</span>
            </div>
            <div className="hidden md:flex items-center justify-between flex-1 ml-10">
              <div className="flex items-baseline space-x-4">
                <a
                  href="#features"
                  className="text-gray-600 hover:text-primary px-3 py-2"
                >
                  Features
                </a>
                <a
                  href="#how-it-works"
                  className="text-gray-600 hover:text-primary px-3 py-2"
                >
                  How it Works
                </a>
                <a
                  href="#about"
                  className="text-gray-600 hover:text-primary px-3 py-2"
                >
                  About
                </a>
              </div>
              <div className="flex items-center space-x-4">
                <Link to="/sign-in">
                  <Button variant="outline">Login </Button>
                </Link>

                <Link to="/sign-up">
                  <Button>Sign up</Button>
                </Link>
              </div>
            </div>
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 rounded-md text-gray-600 hover:text-primary hover:bg-gray-100"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="fixed top-16 left-0 right-0 bottom-0 bg-white z-40 md:hidden"
          >
            <div className="flex flex-col p-4 space-y-4">
              <a
                href="#features"
                className="text-gray-600 hover:text-primary px-3 py-2"
                onClick={toggleMobileMenu}
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="text-gray-600 hover:text-primary px-3 py-2"
                onClick={toggleMobileMenu}
              >
                How it Works
              </a>
              <a
                href="#about"
                className="text-gray-600 hover:text-primary px-3 py-2"
                onClick={toggleMobileMenu}
              >
                About
              </a>
              <Link
                to="/appointment"
                className="text-primary hover:text-primary/90 px-3 py-2"
                onClick={toggleMobileMenu}
              >
                Find Doctors
              </Link>
              <div className="pt-4 space-y-2">
                <Link to="/sign-in" onClick={toggleMobileMenu}>
                  <Button variant="outline" className="w-full mb-3">
                    Login
                  </Button>
                </Link>
                <Link to="/sign-up" onClick={toggleMobileMenu}>
                  <Button className="w-full">Sign up</Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced Hero Section */}
      <div className="relative overflow-hidden pt-16 min-h-screen flex items-center">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-sage-100/20" />
          {/* Decorative elements */}
          <div className="absolute right-0 top-1/4 -translate-y-1/2 w-[500px] h-[500px]">
            <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute inset-0 bg-sage-200/20 rounded-full blur-2xl animate-pulse delay-300" />
          </div>
          <div className="absolute left-0 bottom-1/4 w-[300px] h-[300px]">
            <div className="absolute inset-0 bg-sage-300/20 rounded-full blur-2xl animate-pulse delay-700" />
          </div>
        </div>

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl  w-full font-bold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl mb-8">
                <span className="relative z-10 text-primary pr-5">Withyou</span>
                ,we will always be with you
              </h1>
              <p className="mt-6 text-xl text-gray-600">
                Take control of your liver health with our AI-powered monitoring
                system. Get real-time insights and connect with specialists for
                personalized care.
              </p>

              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/sign-in">
                  <Button size="lg" className="w-full sm:w-auto group">
                    Start Monitoring
                    <motion.span
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </motion.span>
                  </Button>
                </Link>
                <a
                  href="#how-it-works"
                  className="inline-flex items-center justify-center px-6 py-3 text-lg font-semibold text-gray-900 hover:text-primary transition-colors"
                >
                  See How It Works
                  <ArrowUpRight className="ml-1 h-4 w-4" />
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      {/* Features Section */}
      <div id="features" className="py-24 pt-12 sm:py-32 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Complete Liver Health Monitoring
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Track, understand, and improve your liver health with our
              comprehensive tools
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              {features.map((feature) => (
                <motion.div
                  key={feature.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col"
                >
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                    <feature.icon
                      className="h-5 w-5 flex-none text-primary"
                      aria-hidden="true"
                    />
                    {feature.name}
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                    <p className="flex-auto">{feature.description}</p>
                  </dd>
                </motion.div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div id="how-it-works" className="py-24 sm:py-32 bg-sage-50/30">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              How withyou Works
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Simple steps to better liver health monitoring
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {steps.map((step, index) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative bg-white p-6 rounded-lg shadow-sm"
                >
                  <div className="absolute -top-4 left-4 bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-gray-900">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-gray-600">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">
            Frequently Asked Questions
          </h2>
          <div className="max-w-3xl mx-auto">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                className="mb-4"
              >
                <button
                  onClick={() =>
                    setActiveFaq(activeFaq === index ? null : index)
                  }
                  className="w-full text-left p-4 bg-sage-50/30 rounded-lg flex items-center justify-between"
                >
                  <span className="font-semibold">{faq.question}</span>
                  {activeFaq === index ? (
                    <MinusCircle className="w-5 h-5" />
                  ) : (
                    <Plus className="w-5 h-5" />
                  )}
                </button>
                <AnimatePresence>
                  {activeFaq === index && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="p-4 bg-white overflow-hidden"
                    >
                      {faq.answer}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Final CTA Section */}
      <div className="py-24 bg-primary/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">
            Ready to Take Control of Your Liver Health?
          </h2>
          <Link to="/sign-up">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Get Started Now
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* About Section */}
      <div id="about" className="py-24 sm:py-32 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Why Choose withyou?
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              We're dedicated to making liver health monitoring accessible,
              understandable, and actionable for everyone. Our platform combines
              medical expertise with user-friendly technology to help you
              maintain optimal liver health.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-sage-50/30 border-t">
        <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
          <div className="flex justify-center space-x-6 md:order-2">
            <a href="#" className="text-gray-600 hover:text-primary">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-600 hover:text-primary">
              Terms of Service
            </a>
            <a href="#" className="text-gray-600 hover:text-primary">
              Contact
            </a>
          </div>
          <div className="mt-8 md:order-1 md:mt-0">
            <p className="text-center text-xs leading-5 text-gray-600">
              &copy; {new Date().getFullYear()} withyou. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const faqs = [
  {
    question: "How does withyou help monitor liver health?",
    answer:
      "withyou provides comprehensive tracking tools, personalized insights, and direct access to liver specialists. Our platform allows you to log important health metrics, track symptoms, and receive tailored recommendations for better liver health management.",
  },
  {
    question: "Is my medical data secure?",
    answer:
      "Yes, we take data security very seriously. All your medical information is encrypted and stored securely following HIPAA guidelines. We implement the latest security measures to protect your personal health information.",
  },
  {
    question: "Can I share my health data with my doctor?",
    answer:
      "Absolutely! withyou makes it easy to share your health data with your healthcare providers. You can generate detailed reports and securely share them with your medical team.",
  },
  {
    question: "How often should I update my health metrics?",
    answer:
      "We recommend updating your health metrics at least once a week for optimal monitoring. However, the frequency may vary based on your doctor's recommendations and your specific health condition.",
  },
  {
    question: "What kind of support is available?",
    answer:
      "We offer 24/7 technical support for platform-related issues. For medical concerns, you can easily connect with liver specialists through our telemedicine feature during business hours.",
  },
  {
    question: "How do I get started?",
    answer:
      "Getting started is simple! Just create an account, complete your health profile, and begin tracking your liver health metrics. Our intuitive interface will guide you through the process step by step.",
  },
];

const features = [
  {
    name: "Track Health Metrics",
    description:
      "Monitor key liver health indicators, symptoms, and lifestyle factors that affect your liver function.",
    icon: Activity,
  },
  {
    name: "Expert Consultation",
    description:
      "Connect with liver specialists and healthcare providers for professional guidance and care.",
    icon: Stethoscope,
  },
  {
    name: "Progress Analysis",
    description:
      "View detailed analytics and trends of your liver health metrics over time.",
    icon: ChartLine,
  },
];

const steps = [
  {
    title: "Track Your Metrics",
    description:
      "Input your liver health indicators and symptoms regularly to establish baseline data.",
  },
  {
    title: "Get Insights",
    description:
      "Receive personalized analysis and recommendations based on your health data.",
  },
  {
    title: "Connect with Doctors",
    description:
      "Easily share your health data with specialists and schedule consultations when needed.",
  },
];

export default Index;
