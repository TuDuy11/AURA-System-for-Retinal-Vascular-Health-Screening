import { useState, useEffect } from 'react';
import { Menu, X, User } from 'lucide-react';
import { Button } from './ui/button';
import logoImage from 'figma:asset/bc4a6196f2ea60ceb4bf7a5ed0a8563545e7d16f.png';

interface HeaderProps {
  onLoginClick?: () => void;
}

export function Header({ onLoginClick }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/98 backdrop-blur-md border-b border-blue-200 shadow-md' 
        : 'bg-[#0a1f3d]/98 backdrop-blur-md border-b border-cyan-500/20'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo - Increased Size */}
          <a href="#home" className="flex items-center gap-3 group">
            <img 
              src={logoImage} 
              alt="AURA Logo" 
              className="h-28 w-auto transition-transform group-hover:scale-105"
            />
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#home" className={`transition-colors ${
              isScrolled ? 'text-gray-700 hover:text-cyan-500' : 'text-gray-200 hover:text-cyan-400'
            }`}>
              Trang chủ
            </a>
            <a href="#services" className={`transition-colors ${
              isScrolled ? 'text-gray-700 hover:text-cyan-500' : 'text-gray-200 hover:text-cyan-400'
            }`}>
              Dịch vụ
            </a>
            <a href="#about" className={`transition-colors ${
              isScrolled ? 'text-gray-700 hover:text-cyan-500' : 'text-gray-200 hover:text-cyan-400'
            }`}>
              Giới thiệu
            </a>
            <a href="#appointment" className={`transition-colors ${
              isScrolled ? 'text-gray-700 hover:text-cyan-500' : 'text-gray-200 hover:text-cyan-400'
            }`}>
              Đặt lịch
            </a>
            <a href="#contact" className={`transition-colors ${
              isScrolled ? 'text-gray-700 hover:text-cyan-500' : 'text-gray-200 hover:text-cyan-400'
            }`}>
              Liên hệ
            </a>
            <Button 
              onClick={onLoginClick} 
              className={`transition-all ${
                isScrolled 
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white'
                  : 'bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-500 hover:to-cyan-600 text-white shadow-lg shadow-cyan-500/30'
              }`}
            >
              <User className="w-4 h-4 mr-2" />
              Đăng nhập
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`md:hidden p-2 transition-colors ${
              isScrolled ? 'text-gray-700 hover:text-cyan-500' : 'text-gray-200 hover:text-cyan-400'
            }`}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className={`md:hidden py-4 border-t ${
            isScrolled ? 'border-gray-200 bg-white' : 'border-cyan-500/20 bg-[#0a1f3d]/95'
          }`}>
            <div className="flex flex-col gap-4">
              <a 
                href="#home" 
                className={`py-2 transition-colors ${
                  isScrolled ? 'text-gray-700 hover:text-cyan-500' : 'text-gray-200 hover:text-cyan-400'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Trang chủ
              </a>
              <a 
                href="#services" 
                className={`py-2 transition-colors ${
                  isScrolled ? 'text-gray-700 hover:text-cyan-500' : 'text-gray-200 hover:text-cyan-400'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Dịch vụ
              </a>
              <a 
                href="#about" 
                className={`py-2 transition-colors ${
                  isScrolled ? 'text-gray-700 hover:text-cyan-500' : 'text-gray-200 hover:text-cyan-400'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Giới thiệu
              </a>
              <a 
                href="#appointment" 
                className={`py-2 transition-colors ${
                  isScrolled ? 'text-gray-700 hover:text-cyan-500' : 'text-gray-200 hover:text-cyan-400'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Đặt lịch
              </a>
              <a 
                href="#contact" 
                className={`py-2 transition-colors ${
                  isScrolled ? 'text-gray-700 hover:text-cyan-500' : 'text-gray-200 hover:text-cyan-400'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Liên hệ
              </a>
              <Button 
                onClick={() => {
                  if (onLoginClick) {
                    onLoginClick();
                  }
                  setIsMenuOpen(false);
                }}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-lg shadow-cyan-500/30"
              >
                <User className="w-4 h-4 mr-2" />
                Đăng nhập
              </Button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}