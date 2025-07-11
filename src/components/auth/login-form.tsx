"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CircleUser, Mail, Lock, Eye, EyeOff, Shield, FileText, Database } from "lucide-react";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth/auth-context';
import { toast } from 'sonner';
import Image from 'next/image';

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('rememberMe') === 'true';
    }
    return false;
  });
  const router = useRouter();
  const { login } = useAuth();

  // Inicializar partículas interactivas
  useEffect(() => {
    const initParticles = () => {
      const canvas = document.getElementById('particles-js') as HTMLCanvasElement;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Configurar canvas
      const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      };
      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);

      // Configuración de partículas
      const particles: Array<{
        x: number;
        y: number;
        vx: number;
        vy: number;
        size: number;
        opacity: number;
      }> = [];

      const mouse = { x: 0, y: 0, radius: 150 };

      // Crear partículas
      for (let i = 0; i < 100; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 3 + 1,
          opacity: Math.random() * 0.5 + 0.2
        });
      }

      // Evento del mouse
      const handleMouseMove = (e: MouseEvent) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
      };

      canvas.addEventListener('mousemove', handleMouseMove);

      // Función de animación
      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Actualizar y dibujar partículas
        particles.forEach((particle, index) => {
          // Mover partícula
          particle.x += particle.vx;
          particle.y += particle.vy;

          // Rebotar en los bordes
          if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
          if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

          // Interacción con el mouse
          const dx = mouse.x - particle.x;
          const dy = mouse.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < mouse.radius) {
            const force = (mouse.radius - distance) / mouse.radius;
            const angle = Math.atan2(dy, dx);
            particle.vx -= Math.cos(angle) * force * 0.02;
            particle.vy -= Math.sin(angle) * force * 0.02;
          }

          // Dibujar partícula
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(59, 130, 246, ${particle.opacity})`;
          ctx.fill();

          // Conectar partículas cercanas
          particles.forEach((otherParticle, otherIndex) => {
            if (index === otherIndex) return;
            
            const dx = particle.x - otherParticle.x;
            const dy = particle.y - otherParticle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100) {
              ctx.beginPath();
              ctx.moveTo(particle.x, particle.y);
              ctx.lineTo(otherParticle.x, otherParticle.y);
              ctx.strokeStyle = `rgba(59, 130, 246, ${0.1 * (1 - distance / 100)})`;
              ctx.lineWidth = 1;
              ctx.stroke();
            }
          });
        });

        requestAnimationFrame(animate);
      };

      animate();

      // Cleanup
      return () => {
        window.removeEventListener('resize', resizeCanvas);
        canvas.removeEventListener('mousemove', handleMouseMove);
      };
    };

    // Inicializar después de que el DOM esté listo
    const timer = setTimeout(initParticles, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleRememberMeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setRememberMe(isChecked);
    localStorage.setItem('rememberMe', isChecked.toString());
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login({ username, password, rememberMe });
    } catch (error) {
      toast.error('Error al iniciar sesión. Por favor, verifica tus credenciales.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        /* Security Grid Pattern */
        .security-grid {
          background-image: 
            linear-gradient(rgba(59, 130, 246, 0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.06) 1px, transparent 1px);
          background-size: 80px 80px;
          width: 100%;
          height: 100%;
          animation: grid-subtle-pulse 8s ease-in-out infinite;
        }
        
        .security-grid::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle at 25% 75%, rgba(255, 0, 76, 0.2) 0%, transparent 50%),
                      radial-gradient(circle at 75% 25%, rgb(247, 210, 0) 0%, transparent 50%);
          animation: security-glow 10s ease-in-out infinite alternate;
        }
        
        @keyframes grid-subtle-pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.7; }
        }
        
        @keyframes security-glow {
          0% { opacity: 0.3; }
          100% { opacity: 0.6; }
        }
        
        /* Corporate Panel */
        .corporate-panel {
          background: linear-gradient(135deg, 
            rgba(1, 31, 100, 0.95) 0%,
            rgba(2, 51, 129, 0.9) 30%,
            rgba(4, 33, 73, 0.95) 70%,
            rgba(3, 42, 134, 0.99) 100%);
          backdrop-filter: blur(20px);
          border-right: 1px solid rgb(2, 14, 31);
          position: relative;
          overflow: hidden;
        }
        
        .corporate-panel::before {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          width: 2px;
          height: 100%;
          background: linear-gradient(0deg, 
            transparent 0%, 
            rgba(59, 130, 246, 0.3) 20%, 
            rgba(99, 102, 241, 0.3) 50%, 
            rgba(59, 130, 246, 0.3) 80%, 
            transparent 100%);
          animation: border-subtle-flow 6s linear infinite;
        }
        
        @keyframes border-subtle-flow {
          0% { transform: translateY(-100%); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(100%); opacity: 0; }
        }
        
        /* Professional Glass Panel */
        .professional-panel {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px) saturate(1.1);
          border-radius: 16px;
          border: 1px solid rgba(148, 163, 184, 0.2);
          position: relative;
          overflow: hidden;
          box-shadow: 
            0 20px 40px rgba(0, 0, 0, 0.1),
            0 8px 16px rgba(0, 0, 0, 0.06),
            inset 0 1px 0 rgba(255, 255, 255, 0.8);
        }
        
        .professional-panel::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, 
            transparent 0%, 
            rgba(59, 130, 246, 0.3) 25%, 
            rgba(99, 102, 241, 0.3) 75%, 
            transparent 100%);
          animation: top-border-flow 4s ease-in-out infinite;
        }
        
        @keyframes top-border-flow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.8; }
        }
        
        /* Typography */
        .corporate-title {
          font-family: 'Inter', sans-serif;
          background: linear-gradient(135deg, #1e293b 0%, #475569 50%, #334155 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-weight: 700;
          letter-spacing: -0.025em;
        }
        
        .corporate-subtitle {
          font-family: 'Inter', sans-serif;
          color: #64748b;
          font-weight: 500;
        }
        
        .corporate-text {
          font-family: 'Inter', sans-serif;
          color: #e2e8f0;
          line-height: 1.6;
        }
        
        /* Form Elements */
        .corporate-input {
          background: rgba(248, 250, 252, 0.9) !important;
          border: 1.5px solid rgba(203, 213, 225, 0.6) !important;
          color: #1e293b !important;
          font-family: 'Inter', sans-serif !important;
          font-weight: 500 !important;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
          box-shadow: 
            0 1px 3px rgba(0, 0, 0, 0.1),
            inset 0 1px 2px rgba(0, 0, 0, 0.05) !important;
        }
        
        .corporate-input:focus {
          border-color: #3b82f6 !important;
          box-shadow: 
            0 0 0 3px rgba(59, 130, 246, 0.1),
            0 4px 12px rgba(59, 130, 246, 0.15) !important;
          background: rgba(255, 255, 255, 0.95) !important;
        }
        
        .corporate-input::placeholder {
          color: #94a3b8 !important;
          font-family: 'Inter', sans-serif !important;
          font-weight: 400 !important;
        }
        
        .corporate-input-container {
          position: relative;
        }
        
        .corporate-input-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(90deg, 
            transparent 0%, 
            rgba(59, 130, 246, 0.1) 50%, 
            transparent 100%);
          border-radius: 8px;
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
          z-index: 0;
        }
        
        .corporate-input-container:focus-within::before {
          opacity: 1;
          animation: input-highlight 2s ease-in-out infinite;
        }
        
        @keyframes input-highlight {
          0%, 100% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
        }
        
        /* Button */
        .corporate-button {
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%) !important;
          border: 1px solid rgba(59, 130, 246, 0.5) !important;
          color: #ffffff !important;
          font-weight: 600 !important;
          font-family: 'Inter', sans-serif !important;
          letter-spacing: 0.025em !important;
          position: relative !important;
          overflow: hidden !important;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
          box-shadow: 
            0 4px 12px rgba(59, 130, 246, 0.25),
            inset 0 1px 0 rgba(255, 255, 255, 0.1) !important;
        }
        
        .corporate-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, 
            transparent 0%, 
            rgba(255, 255, 255, 0.2) 50%, 
            transparent 100%);
          transition: left 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 1;
        }
        
        .corporate-button:hover {
          background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%) !important;
          box-shadow: 
            0 8px 20px rgba(59, 130, 246, 0.3),
            0 4px 8px rgba(59, 130, 246, 0.2) !important;
          transform: translateY(-2px) !important;
        }
        
        .corporate-button:hover::before {
          left: 100%;
        }
        
        .corporate-button:active {
          transform: translateY(-1px) !important;
        }
        
        .corporate-button:disabled {
          opacity: 0.7 !important;
          cursor: not-allowed !important;
          transform: none !important;
          box-shadow: 0 2px 6px rgba(59, 130, 246, 0.15) !important;
        }
        
        /* Checkbox */
        .corporate-checkbox {
          appearance: none;
          width: 18px;
          height: 18px;
          border: 2px solid #cbd5e1;
          border-radius: 4px;
          background: #ffffff;
          position: relative;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        
        .corporate-checkbox:hover {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        
        .corporate-checkbox:checked {
          background: #3b82f6;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        
        .corporate-checkbox:checked::after {
          content: '✓';
          position: absolute;
          top: -2px;
          left: 2px;
          color: #ffffff;
          font-size: 14px;
          font-weight: bold;
        }
        
        /* Links */
        .corporate-link {
          color: #3b82f6 !important;
          text-decoration: none !important;
          font-family: 'Inter', sans-serif !important;
          font-weight: 500 !important;
          position: relative !important;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
          display: inline-block !important;
        }
        
        .corporate-link::before {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 2px;
          background: #3b82f6;
          transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .corporate-link:hover {
          color: #1d4ed8 !important;
        }
        
        .corporate-link:hover::before {
          width: 100%;
        }
        
        /* Feature Items */
        .feature-item {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          padding: 12px;
          border-radius: 8px;
        }
        
        .feature-item:hover {
          background: rgba(59, 130, 246, 0.05);
          transform: translateX(8px);
        }
        
        .corporate-icon {
          background: rgba(59, 130, 246, 0.1);
          border: 2px solid rgba(59, 130, 246, 0.2);
          border-radius: 50%;
          padding: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .feature-item:hover .corporate-icon {
          background: rgba(59, 130, 246, 0.15);
          border-color: rgba(59, 130, 246, 0.4);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
        }
        
        /* Loading Animation */
        .loading-pulse {
          animation: corporate-loading 1.5s ease-in-out infinite alternate;
        }
        
        @keyframes corporate-loading {
          0% { box-shadow: 0 4px 12px rgba(59, 130, 246, 0.25); }
          100% { box-shadow: 0 8px 24px rgba(59, 130, 246, 0.4); }
        }
        
        /* Responsive Design */
        @media (max-width: 768px) {
          .professional-panel {
            margin: 1rem;
            background: rgba(255, 255, 255, 0.98);
          }
          
          .security-grid {
            opacity: 0.3;
          }
          
          .corporate-title {
            font-size: 1.8rem;
          }
        }
        
        @media (max-width: 480px) {
          .corporate-button {
            font-size: 0.9rem !important;
          }
          
          .corporate-input {
            font-size: 0.9rem !important;
          }
        }
        
        /* Custom Scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: rgba(148, 163, 184, 0.1);
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #3b82f6 0%, #1d4ed8 100%);
          border-radius: 4px;
          box-shadow: 0 2px 4px rgba(59, 130, 246, 0.2);
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #2563eb 0%, #1e40af 100%);
        }
      `}</style>
      
      <div className="relative min-h-screen overflow-hidden bg-imageLogin">
        {/* Security Grid Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="security-grid"></div>
        </div>

        {/* Interactive Particles Background */}
        <div className="absolute inset-0">
          <canvas id="particles-js" style={{ display: 'block' }}></canvas>
        </div>

        {/* Main Content */}
        <div className="relative z-10 flex min-h-screen">
          {/* Left Side - Brand Info */}
          <div className="hidden md:flex md:w-1/2 xl:w-2/5 relative">
            <div className="flex flex-col justify-center p-10 text-white relative z-20 w-full">
              {/* Glass panel overlay */}
              <div className="absolute inset-0 bg-black/20 backdrop-blur-sm rounded-r-3xl border-r border-white/10"></div>
              <div className="relative z-10">
                <div className="flex flex-col items-start mb-6">
                  <div className="flex items-center gap-4">
                    {/* Logo SVG compuesto */}
                    <svg width="110" height="110" viewBox="0 0 220 220" fill="none" xmlns="http://www.w3.org/2000/svg">
                      {/* Elipse grande */}
                      <ellipse cx="110" cy="110" rx="90" ry="90" stroke="#fff" strokeWidth="4" fill="none"/>
                      {/* Círculo superior */}
                      <circle cx="110" cy="30" r="24" fill="#fff"/>
                      {/* Círculo izquierdo */}
                      <circle cx="40" cy="150" r="24" fill="#fff"/>
                      {/* Círculo derecho */}
                      <circle cx="180" cy="150" r="24" fill="#fff"/>
                    </svg>
                    <div className="flex flex-col">
                      <span style={{
                        fontSize: '2.5rem',
                        fontWeight: 700,
                        color: '#fff',
                        letterSpacing: '0.05em',
                        lineHeight: 1
                      }}>
                        DocFlow AI
                      </span>
                      <span style={{
                        fontSize: '1rem',
                        color: 'rgba(255,255,255,0.7)',
                        fontWeight: 400,
                        marginTop: 2,
                        marginLeft: 4
                      }}>
                        by Cibernética
                      </span>
                    </div>
                  </div>
                </div>
                <p className="mb-8 text-slate-200 text-base leading-relaxed max-w-md">
                  Plataforma integral para la administración segura de documentos financieros. 
                  Controle el acceso de su equipo, gestione vencimientos, genere reportes de auditoría 
                  y mantenga la trazabilidad completa de todos sus documentos críticos.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 feature-item">
                    <span className="corporate-icon">
                      <Shield className="h-5 w-5 text-blue-400" />
                    </span>
                    <div>
                      <span className="text-sm font-semibold block text-slate-200">Seguridad Bancaria</span>
                      <span className="text-xs text-slate-400">Cifrado de grado militar</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 feature-item">
                    <span className="corporate-icon">
                      <FileText className="h-5 w-5 text-indigo-400" />
                    </span>
                    <div>
                      <span className="text-sm font-semibold block text-slate-200">Gestión Integral</span>
                      <span className="text-xs text-slate-400">Control total de documentos</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 feature-item">
                    <span className="corporate-icon">
                      <Database className="h-5 w-5 text-purple-400" />
                    </span>
                    <div>
                      <span className="text-sm font-semibold block text-slate-200">Auditoría Completa</span>
                      <span className="text-xs text-slate-400">Trazabilidad y reportes</span>
                    </div>
                  </div>
                </div>
                <div className="text-xs text-slate-400 mt-16 opacity-60 font-medium">
                  © 2024 Gestor Doc. Sistema certificado para entidades financieras.
                </div>
              </div>
            </div>
          </div>

          {/* Línea vertical divisoria */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/30 to-transparent z-20"></div>

          {/* Right Side - Login Form */}
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="professional-panel w-full max-w-lg mx-auto relative">
              <div className="relative z-10 p-8 sm:p-10">
                <div className="mb-8 text-center">
                  <h2 className={`text-3xl font-bold mb-3 corporate-title  `}>
                    Acceso al Sistema
                  </h2>
                  <p className="corporate-subtitle text-sm">
                    Ingrese sus credenciales para acceder de forma segura
                  </p>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
                  {/* Username Field */}
                  <div className="form-group">
                    <label htmlFor="username" className="block text-sm font-semibold text-slate-700 mb-2">
                      Usuario
                    </label>
                    <div className="relative corporate-input-container">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                        <CircleUser className="h-5 w-5 text-slate-400" />
                      </div>
                      <Input
                        id="username"
                        name="username"
                        type="text"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="corporate-input pl-10"
                        placeholder="Ingrese su usuario"
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="form-group">
                    <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-2">
                      Contraseña
                    </label>
                    <div className="relative corporate-input-container">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                        <Lock className="h-5 w-5 text-slate-400" />
                      </div>
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="corporate-input pl-10 pr-10"
                        placeholder="Ingrese su contraseña"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center z-10 text-slate-400 hover:text-blue-600 transition-colors duration-300"
                        onClick={() => setShowPassword(!showPassword)}
                        tabIndex={-1}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Remember Me & Forgot Password */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        checked={rememberMe}
                        onChange={handleRememberMeChange}
                        className="corporate-checkbox"
                      />
                      <label htmlFor="remember-me" className="ml-3 block text-sm text-slate-700 font-medium">
                        Mantener sesión iniciada
                      </label>
                    </div>
                    <div className="text-sm">
                      <Link href="/forgot-password" className="corporate-link">
                        ¿Olvidó su contraseña?
                      </Link>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className={`corporate-button w-full ${isLoading ? 'loading-pulse' : ''}`}
                    disabled={isLoading}
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    {isLoading ? "Verificando credenciales..." : "Acceder al Sistema"}
                  </Button>
                </form>

                {/* Security Notice */}
                <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-xs text-blue-800 text-center">
                    🔒 Conexión segura SSL/TLS - Sus datos están protegidos
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}