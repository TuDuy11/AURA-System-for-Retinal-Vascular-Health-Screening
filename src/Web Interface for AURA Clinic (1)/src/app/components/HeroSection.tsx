import { Button } from './ui/button';
import { heroImage } from '../assets/images';
export function HeroSection() {
  const scrollToAppointment = () => {
    const element = document.getElementById('appointment');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative pt-20 min-h-screen overflow-hidden">
      {/* Clean Medical Blue Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a1f3d] via-[#0d2d4a] to-[#0a1f3d]">
        {/* Subtle overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a1f3d]/95 via-[#0a1f3d]/80 to-transparent"></div>
      </div>

      {/* Subtle Medical Grid Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full" style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0, 212, 255, 0.15) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 212, 255, 0.15) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px'
        }}></div>
      </div>

      {/* Minimal Floating Dots */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-24 left-10 w-2 h-2 bg-cyan-400/40 rounded-full animate-pulse"></div>
        <div className="absolute top-48 right-20 w-2 h-2 bg-cyan-300/40 rounded-full animate-pulse delay-100"></div>
        <div className="absolute bottom-52 left-1/4 w-2 h-2 bg-cyan-500/40 rounded-full animate-pulse delay-200"></div>
      </div>

      {/* Content Container */}
      <div className="container mx-auto px-4 py-6 md:py-10 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-7rem)]">
          {/* Left Content */}
          <div className="space-y-6 md:space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/20 text-cyan-300 rounded-full border border-cyan-400/30 backdrop-blur-sm">
              <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
              <span className="text-sm font-medium">Công nghệ AI tiên tiến nhất</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
              <span className="text-white">Sàng lọc võng mạc</span>
              <br />
              <span className="bg-gradient-to-r from-cyan-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent">
                chuyên sâu với AI
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-xl">
              Phòng khám AURA sử dụng công nghệ trí tuệ nhân tạo và hình ảnh tiên tiến để 
              phát hiện sớm các bệnh lý võng mạc, giúp bảo vệ thị lực và sức khỏe đôi mắt của bạn.
            </p>
            
            <div className="flex flex-wrap gap-4 pt-4">
              <Button 
                onClick={scrollToAppointment} 
                size="lg" 
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-lg shadow-cyan-500/50 border-0 text-lg px-8 py-6"
              >
                Đặt lịch ngay
              </Button>
              <Button
                onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
                variant="outline"
                size="lg"
                className="border-2 border-cyan-400/50 text-cyan-300 hover:bg-cyan-500/10 hover:border-cyan-400 backdrop-blur-sm text-lg px-8 py-6"
              >
                Tìm hiểu thêm
              </Button>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 md:pt-12">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  10K+
                </div>
                <div className="text-sm text-gray-400 mt-1">Bệnh nhân</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  99%
                </div>
                <div className="text-sm text-gray-400 mt-1">Độ chính xác</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  15+
                </div>
                <div className="text-sm text-gray-400 mt-1">Năm kinh nghiệm</div>
              </div>
            </div>
          </div>

          {/* Right Side - Eye Illustration (1/3 screen width, vertically centered) */}
          <div className="hidden lg:flex items-center justify-center relative">
            {/* Main Eye Image - Vertically Centered with Vignette Effect */}
            <div className="relative w-full max-w-md">
              {/* Glow Effect Behind Eye */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/30 to-blue-500/30 rounded-full blur-3xl scale-110"></div>
              
              {/* Eye Image Container with Vignette/Fade Effect on corners */}
              <div className="relative">
                <img 
                  src={heroImage}
                  alt="AI Retinal Scanning"
                  className="relative w-full h-auto drop-shadow-2xl"
                  style={{
                    maskImage: 'radial-gradient(ellipse 70% 70% at center, black 40%, transparent 100%)',
                    WebkitMaskImage: 'radial-gradient(ellipse 70% 70% at center, black 40%, transparent 100%)'
                  }}
                />
              </div>
              
              {/* Decorative Rings */}
              <div className="absolute -top-8 -right-8 w-32 h-32 border-2 border-cyan-400/30 rounded-full animate-pulse"></div>
              <div className="absolute -bottom-8 -left-8 w-40 h-40 border-2 border-cyan-400/20 rounded-full animate-pulse delay-200"></div>
            </div>
            
            {/* Floating AI Badge */}
            <div className="absolute bottom-0 left-0 bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-lg p-6 rounded-xl shadow-2xl border border-cyan-500/30">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/50">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <div className="font-bold text-white">AI-Powered</div>
                  <div className="text-sm text-cyan-300">ISO & FDA Certified</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave Separator */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full">
          <path fill="#ffffff" fillOpacity="1" d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
        </svg>
      </div>
    </section>
  );
}

