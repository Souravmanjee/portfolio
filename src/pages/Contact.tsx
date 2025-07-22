import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';

interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface SocialLink {
  name: string;
  icon: string;
  url: string;
  color: string;
  description: string;
}

const socialLinks: SocialLink[] = [
  {
    name: 'GitHub',
    icon: '🐙',
    url: 'https://github.com/yourusername',
    color: '#181717',
    description: 'Check out my code and contributions'
  },
  {
    name: 'LinkedIn',
    icon: '💼',
    url: 'https://linkedin.com/in/yourprofile',
    color: '#0A66C2',
    description: 'Connect with me professionally'
  },
  {
    name: 'Twitter',
    icon: '🐦',
    url: 'https://twitter.com/yourusername',
    color: '#1DA1F2',
    description: 'Follow my thoughts on tech and development'
  },
  {
    name: 'Email',
    icon: '📧',
    url: 'mailto:your.email@example.com',
    color: '#EA4335',
    description: 'Send me a direct message'
  }
];

export const Contact: React.FC = () => {
  const { isDark } = useTheme();
  const [form, setForm] = useState<ContactForm>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 30,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSubmitStatus('success');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="text-center">
        <div className="text-6xl mb-4">📧</div>
        <h1 className="text-4xl font-display font-bold mb-4">
          Let's Connect!
        </h1>
        <p className={`text-xl ${isDark ? 'text-mist' : 'text-stone'} max-w-2xl mx-auto`}>
          Ready to embark on a new adventure together? Whether it's a project collaboration, 
          job opportunity, or just a friendly chat about technology, I'd love to hear from you!
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Contact Form */}
        <motion.div
          variants={itemVariants}
          className={`p-6 rounded-xl ${isDark ? 'bg-stone/10' : 'bg-fog/30'} border ${isDark ? 'border-stone/20' : 'border-stone/10'}`}
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="text-3xl">✉️</div>
            <h2 className="text-2xl font-display font-semibold">Send a Message</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name & Email Row */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-4 py-3 rounded-lg border ${
                    isDark 
                      ? 'bg-cliff/50 border-stone/30 text-snow focus:border-accent' 
                      : 'bg-snow border-stone/20 text-cliff focus:border-accent-dark'
                  } focus:ring-2 focus:ring-accent/20 transition-all duration-200`}
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Your Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={form.email}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-4 py-3 rounded-lg border ${
                    isDark 
                      ? 'bg-cliff/50 border-stone/30 text-snow focus:border-accent' 
                      : 'bg-snow border-stone/20 text-cliff focus:border-accent-dark'
                  } focus:ring-2 focus:ring-accent/20 transition-all duration-200`}
                  placeholder="john@example.com"
                />
              </div>
            </div>

            {/* Subject */}
            <div>
              <label htmlFor="subject" className="block text-sm font-medium mb-2">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={form.subject}
                onChange={handleInputChange}
                required
                className={`w-full px-4 py-3 rounded-lg border ${
                  isDark 
                    ? 'bg-cliff/50 border-stone/30 text-snow focus:border-accent' 
                    : 'bg-snow border-stone/20 text-cliff focus:border-accent-dark'
                } focus:ring-2 focus:ring-accent/20 transition-all duration-200`}
                placeholder="Let's collaborate on an amazing project!"
              />
            </div>

            {/* Message */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={form.message}
                onChange={handleInputChange}
                required
                rows={5}
                className={`w-full px-4 py-3 rounded-lg border resize-none ${
                  isDark 
                    ? 'bg-cliff/50 border-stone/30 text-snow focus:border-accent' 
                    : 'bg-snow border-stone/20 text-cliff focus:border-accent-dark'
                } focus:ring-2 focus:ring-accent/20 transition-all duration-200`}
                placeholder="Tell me about your project, ideas, or just say hello!"
              />
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 rounded-lg font-medium transition-all duration-200 ${
                isSubmitting
                  ? 'bg-stone/50 cursor-not-allowed'
                  : 'bg-accent hover:bg-accent-dark text-white hover:shadow-lg hover:shadow-accent/25'
              }`}
              whileHover={!isSubmitting ? { scale: 1.02 } : {}}
              whileTap={!isSubmitting ? { scale: 0.98 } : {}}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center space-x-2">
                  <motion.div
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  <span>Sending...</span>
                </div>
              ) : (
                <span className="flex items-center justify-center space-x-2">
                  <span>Send Message</span>
                  <span>🚀</span>
                </span>
              )}
            </motion.button>

            {/* Status Messages */}
            {submitStatus === 'success' && (
              <motion.div
                className="p-4 bg-success/10 border border-success/20 rounded-lg text-success text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                ✅ Message sent successfully! I'll get back to you soon.
              </motion.div>
            )}

            {submitStatus === 'error' && (
              <motion.div
                className="p-4 bg-danger/10 border border-danger/20 rounded-lg text-danger text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                ❌ Something went wrong. Please try again later.
              </motion.div>
            )}
          </form>
        </motion.div>

        {/* Contact Info & Social Links */}
        <div className="space-y-6">
          {/* Social Links */}
          <motion.div
            variants={itemVariants}
            className={`p-6 rounded-xl ${isDark ? 'bg-stone/10' : 'bg-fog/30'} border ${isDark ? 'border-stone/20' : 'border-stone/10'}`}
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="text-3xl">🌐</div>
              <h2 className="text-2xl font-display font-semibold">Find Me Online</h2>
            </div>

            <div className="space-y-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block p-4 rounded-lg ${isDark ? 'bg-stone/10 hover:bg-stone/20' : 'bg-fog/30 hover:bg-fog/50'} 
                    border ${isDark ? 'border-stone/20' : 'border-stone/10'} transition-all duration-300 group`}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-200"
                      style={{ backgroundColor: social.color + '20' }}
                    >
                      {social.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold group-hover:text-accent transition-colors duration-200">
                        {social.name}
                      </h3>
                      <p className={`text-sm ${isDark ? 'text-mist/80' : 'text-stone/80'}`}>
                        {social.description}
                      </p>
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Info */}
          <motion.div
            variants={itemVariants}
            className={`p-6 rounded-xl ${isDark ? 'bg-accent/10' : 'bg-accent/5'} border ${isDark ? 'border-accent/20' : 'border-accent/10'}`}
          >
            <div className="text-center">
              <div className="text-4xl mb-4">🏔️</div>
              <h2 className="text-2xl font-display font-semibold mb-4 text-accent">
                Ready for the Next Adventure
              </h2>
              <p className={`${isDark ? 'text-mist' : 'text-stone'} leading-relaxed mb-4`}>
                I'm always excited to discuss new opportunities, collaborate on interesting projects, 
                or just chat about the latest in web development. Let's climb to new heights together!
              </p>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className={`p-3 rounded-lg ${isDark ? 'bg-white/5' : 'bg-white/30'}`}>
                  <div className="text-lg mb-1">⏰</div>
                  <div className="font-medium">Response Time</div>
                  <div className={`${isDark ? 'text-mist/80' : 'text-stone/80'}`}>Usually within 24h</div>
                </div>
                <div className={`p-3 rounded-lg ${isDark ? 'bg-white/5' : 'bg-white/30'}`}>
                  <div className="text-lg mb-1">🌍</div>
                  <div className="font-medium">Time Zone</div>
                  <div className={`${isDark ? 'text-mist/80' : 'text-stone/80'}`}>PST (UTC-8)</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Final CTA */}
      <motion.div variants={itemVariants} className="text-center pt-4">
        <motion.div
          className="inline-flex items-center space-x-2 text-accent"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="text-2xl">🤝</span>
          <span className="font-medium">Looking forward to hearing from you!</span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};