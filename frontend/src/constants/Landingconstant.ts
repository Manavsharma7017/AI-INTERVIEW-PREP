import { 
  Brain, 
  Target, 
  Users, 
  BarChart3,
} from 'lucide-react';
export const features = [
    {
      icon: Brain,
      title: 'AI-Powered Feedback',
      description: 'Get instant, detailed feedback on your interview responses with our advanced AI analysis.',
      color: 'from-blue-500 to-purple-600'
    },
    {
      icon: Target,
      title: 'Personalized Practice',
      description: 'Practice with questions tailored to your skill level and target job domains.',
      color: 'from-purple-500 to-pink-600'
    },
    {
      icon: BarChart3,
      title: 'Progress Tracking',
      description: 'Monitor your improvement over time with detailed analytics and performance metrics.',
      color: 'from-teal-500 to-blue-600'
    },
    {
      icon: Users,
      title: 'Expert-Curated Content',
      description: 'Access questions and scenarios created by industry professionals and hiring experts.',
      color: 'from-orange-500 to-red-600'
    }
  ];

 export const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Software Engineer at Google',
      content: 'This platform helped me land my dream job! The AI feedback was incredibly detailed and helped me improve my communication skills.',
      rating: 5,
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    },
    {
      name: 'Michael Rodriguez',
      role: 'Product Manager at Microsoft',
      content: 'The practice sessions felt so realistic. I went into my actual interviews feeling confident and prepared.',
      rating: 5,
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    },
    {
      name: 'Emily Johnson',
      role: 'Data Scientist at Netflix',
      content: 'Amazing platform! The variety of questions and instant feedback made all the difference in my interview preparation.',
      rating: 5,
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    }
  ];

 export const stats = [
    { number: '50K+', label: 'Successful Interviews' },
    { number: '95%', label: 'Success Rate' },
    { number: '1M+', label: 'Practice Sessions' },
    { number: '4.9/5', label: 'User Rating' }
  ];

 export const domains = [
    'Software Engineering',
    'Data Science',
    'Product Management',
    'Marketing',
    'Sales',
    'Finance',
    'Consulting',
    'Design'
  ];
