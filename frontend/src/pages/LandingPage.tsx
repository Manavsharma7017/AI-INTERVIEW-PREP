import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Star,
  ArrowRight,

  Shield,
  Zap,
  Clock,
  BookOpen
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { domains, features, stats, testimonials } from '../constants/Landingconstant';
import { toast } from 'react-toastify';

export const LandingPage: React.FC = () => {
  useEffect(() => {
    toast.info('Due to Free deployment, the backend may take a few seconds to load.',)
  }, []);
  return (
    <div className="min-h-screen bg-white relative">
      {/* Hero Section */}
      <section className="pt-28 pb-20 overflow-hidden relative z-10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 transition-colors">
              🚀 Trusted by 50,000+ professionals
            </Badge>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Ace Your Next
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-teal-500 bg-clip-text text-transparent">
                Interview with AI
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 mb-12 leading-relaxed max-w-3xl mx-auto">
              Practice with AI-powered feedback, track your progress, and land your dream job.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link to="/login" className='flex items-center justify-center'>
                <Button size="lg" className="text-lg px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300">
                  Start Practicing Free
                  
                </Button>
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>

          
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
              {stats.map((stat, index) => (
                <div key={index} className="group">
                  <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2 group-hover:scale-110 transition-transform duration-300">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Hero Background Blur Elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-400/20 rounded-full filter blur-3xl"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-400/20 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-teal-400/20 rounded-full filter blur-3xl"></div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Why Choose AI Interview Prep?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Our platform combines cutting-edge AI technology with expert-curated content
              to give you the most effective interview preparation experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="p-8 border-0 shadow-lg hover:shadow-2xl transition-all duration-300 group bg-white">
                  <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${feature.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    {feature.description}
                  </p>
                </Card>
              );
            })}
          </div>

          {/* Additional Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-8 text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300 group bg-white">
              <div className="p-4 bg-gradient-to-r from-green-400 to-blue-500 rounded-2xl inline-flex mb-6 group-hover:scale-110 transition-transform duration-300">
                <Clock className="h-8 w-8 text-white" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">24/7 Availability</h4>
              <p className="text-gray-600 leading-relaxed">Practice anytime at your own pace</p>
            </Card>

            <Card className="p-8 text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300 group bg-white">
              <div className="p-4 bg-gradient-to-r from-purple-400 to-pink-500 rounded-2xl inline-flex mb-6 group-hover:scale-110 transition-transform duration-300">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Secure & Private</h4>
              <p className="text-gray-600 leading-relaxed">Your data is encrypted and secure</p>
            </Card>

            <Card className="p-8 text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300 group bg-white">
              <div className="p-4 bg-gradient-to-r from-orange-400 to-red-500 rounded-2xl inline-flex mb-6 group-hover:scale-110 transition-transform duration-300">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Instant Feedback</h4>
              <p className="text-gray-600 leading-relaxed">Receive detailed feedback in seconds</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Domains Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Practice Across Multiple Domains
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Whether you're in tech, finance, or consulting, we’ve got questions tailored for your field.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {domains.map((domain, index) => (
              <Card key={index} className="p-6 text-center border-0 shadow-md hover:shadow-lg transition-all duration-300 group cursor-pointer bg-white">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl inline-flex mb-4 group-hover:scale-110 transition-transform duration-300">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 text-lg">{domain}</h4>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Success Stories
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Join thousands who landed jobs at top companies with our platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-8 border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
                <div className="flex items-center mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>

                <p className="text-gray-700 mb-8 leading-relaxed text-lg italic">
                  "{testimonial.content}"
                </p>

                <div className="flex items-center">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-14 h-14 rounded-full mr-4 object-cover ring-2 ring-blue-100"
                  />
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">{testimonial.name}</h4>
                    <p className="text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Section (same as before) */}
      {/* ...keep your original footer or I can restyle it too on request... */}
      <footer className="py-12 bg-gray-800 text-white rounded-2xl">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm mb-4">© 2023 AI Interview Prep. All rights reserved.</p>
          <p className="text-sm">Made with ❤️ by the Manav Sharma and ideated by Kushagra Srivastava</p>
        </div>
      </footer>
    </div>
  );
};
