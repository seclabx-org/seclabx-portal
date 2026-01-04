import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Flag, 
  BookOpen, 
  Globe, 
  Moon, 
  Sun, 
  ArrowRight, 
  Server, 
  Code, 
  Layers,
  Cpu
} from 'lucide-react';

/**
 * SeclabX Portal - 核心入口配置
 * 在这里添加新的服务模块
 */
const SERVICES = [
  {
    id: 'ctf',
    title: 'SeclabX CTF',
    subtitle: '实战演练平台',
    desc: '高仿真网络攻防演练环境，沉浸式 CTF 竞技体验。',
    url: 'https://ctf.seclabx.cn',
    icon: Flag,
    color: 'from-red-500 to-orange-500',
    tag: '竞赛平台'
  },
  {
    id: 'ai',
    title: 'SeclabX AI Hub',
    subtitle: '统一平台中枢',
    desc: 'AI 驱动的教学、实训与安全工具统一入口。',
    url: 'https://ai.seclabx.cn',
    icon: Layers,
    color: 'from-blue-500 to-cyan-500',
    tag: 'AI 中枢'
  },
  {
    id: 'science',
    title: '安全科普中心',
    subtitle: '全民安全意识',
    desc: '致力于网络安全知识普及，提升公众数字素养。',
    url: 'https://science.seclabx.cn',
    icon: Globe,
    color: 'from-emerald-500 to-teal-500',
    tag: '公众科普'
  },
  {
    id: 'labs',
    title: '创新实验室',
    subtitle: '孵化与研究',
    desc: '前沿漏洞挖掘、区块链安全审计与工具开发。',
    url: 'https://github.com/seclabx-org',
    icon: Cpu,
    color: 'from-purple-500 to-indigo-500',
    tag: '前沿研究'
  }
];

// --- 3D 文本球体组件 (可交互版) ---
const SeclabXSphere = ({ isDark }) => {
  const canvasRef = useRef(null);
  
  // 用于控制旋转状态的 Refs (避免触发重渲染)
  const rotationRef = useRef({ x: 0.001, y: 0.002 }); // 当前旋转速度
  const dragRef = useRef({ 
    isDown: false, 
    lastX: 0, 
    lastY: 0 
  });

  // 处理鼠标/触摸交互
  const handlePointerDown = (e) => {
    // 阻止默认行为（防止手机上滚动页面）
    // 注意：在 React 事件中 e.preventDefault 可能需要 passive: false，这里简单处理逻辑
    
    dragRef.current.isDown = true;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    dragRef.current.lastX = clientX;
    dragRef.current.lastY = clientY;
  };

  const handlePointerMove = (e) => {
    if (!dragRef.current.isDown) return;

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const dx = clientX - dragRef.current.lastX;
    const dy = clientY - dragRef.current.lastY;

    // 更新旋转速度，负号是为了让旋转方向符合直觉（抓取效果）
    // 灵敏度系数 0.0001
    rotationRef.current.y = -dx * 0.0005; 
    rotationRef.current.x = -dy * 0.0005;

    dragRef.current.lastX = clientX;
    dragRef.current.lastY = clientY;
  };

  const handlePointerUp = () => {
    dragRef.current.isDown = false;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = canvas.width = canvas.parentElement.clientWidth;
    let height = canvas.height = canvas.parentElement.clientHeight;

    // 文本粒子配置
    const texts = Array(40).fill("SeclabX").concat(Array(10).fill("BLOCK"), Array(10).fill("CHAIN"));
    const radius = Math.min(width, height) * 0.35;
    
    // 初始化粒子位置
    const particles = texts.map((text, i) => {
      // 斐波那契球体分布算法，保证均匀分布
      const phi = Math.acos(-1 + (2 * i) / texts.length);
      const theta = Math.sqrt(texts.length * Math.PI) * phi;
      return {
        x: radius * Math.cos(theta) * Math.sin(phi),
        y: radius * Math.sin(theta) * Math.sin(phi),
        z: radius * Math.cos(phi),
        text: text,
        type: text === 'SeclabX' ? 'main' : 'deco'
      };
    });

    const draw = () => {
      // 1. 物理计算：速度衰减与恢复
      // 如果没有在拖拽，让速度慢慢恢复到默认的自转速度
      if (!dragRef.current.isDown) {
        const defaultSpeedX = 0.001;
        const defaultSpeedY = 0.002;
        // 线性插值 (Lerp) 平滑恢复，0.05 是恢复系数
        rotationRef.current.x = rotationRef.current.x * 0.95 + defaultSpeedX * 0.05;
        rotationRef.current.y = rotationRef.current.y * 0.95 + defaultSpeedY * 0.05;
      }

      const angleX = rotationRef.current.x;
      const angleY = rotationRef.current.y;

      // 2. 清空画布
      ctx.clearRect(0, 0, width, height);
      
      // 3. 确定中心点
      const cx = width / 2;
      const cy = height / 2;

      // 4. 颜色配置 (根据主题)
      const mainColor = isDark ? 'rgba(56, 189, 248, ' : 'rgba(15, 23, 42, '; // Sky-400 or Slate-900
      const decoColor = isDark ? 'rgba(168, 85, 247, ' : 'rgba(100, 116, 139, '; // Purple-500 or Slate-500
      const lineColor = isDark ? 'rgba(56, 189, 248, 0.15)' : 'rgba(15, 23, 42, 0.05)';

      // 5. 旋转与投影
      particles.forEach(p => {
        // 绕 Y 轴旋转
        const y1 = p.y * Math.cos(angleX) - p.z * Math.sin(angleX);
        const z1 = p.y * Math.sin(angleX) + p.z * Math.cos(angleX);
        p.y = y1;
        p.z = z1;

        // 绕 X 轴旋转
        const x2 = p.x * Math.cos(angleY) - p.z * Math.sin(angleY);
        const z2 = p.x * Math.sin(angleY) + p.z * Math.cos(angleY);
        p.x = x2;
        p.z = z2;

        // 3D -> 2D 投影 (Perspective)
        const scale = 300 / (300 + p.z); 
        p.screenX = cx + p.x * scale;
        p.screenY = cy + p.y * scale;
        p.scale = scale;
      });

      // 6. 绘制连接线 (模拟区块链结构)
      ctx.beginPath();
      ctx.strokeStyle = lineColor;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].screenX - particles[j].screenX;
          const dy = particles[i].screenY - particles[j].screenY;
          const dist = Math.sqrt(dx*dx + dy*dy);
          // 只连接距离较近的点，且在背面时不绘制太多以保持性能
          if (dist < 60 && particles[i].scale > 0.6) {
            ctx.moveTo(particles[i].screenX, particles[i].screenY);
            ctx.lineTo(particles[j].screenX, particles[j].screenY);
          }
        }
      }
      ctx.stroke();

      // 7. 绘制文本
      // 按 Z 轴排序，先画远的，再画近的 (Painter's algorithm)
      particles.sort((a, b) => a.z - b.z);

      particles.forEach(p => {
        const alpha = (p.z + radius) / (2 * radius); // 根据深度计算透明度
        ctx.save();
        ctx.translate(p.screenX, p.screenY);
        
        const fontSize = p.type === 'main' ? 14 * p.scale : 10 * p.scale;
        ctx.font = `600 ${fontSize}px "JetBrains Mono", monospace, sans-serif`;
        
        if (p.type === 'main') {
          ctx.fillStyle = mainColor + (alpha * 0.9 + 0.1) + ')';
        } else {
          ctx.fillStyle = decoColor + (alpha * 0.7) + ')';
        }
        
        ctx.fillText(p.text, -ctx.measureText(p.text).width / 2, 5);
        
        // 节点高亮
        if (p.scale > 0.9) {
          ctx.fillStyle = isDark ? '#fff' : '#000';
          ctx.beginPath();
          ctx.arc(0, -fontSize, 2 * p.scale, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      });

      requestAnimationFrame(draw);
    };

    const handleResize = () => {
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);
    const animationId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, [isDark]);

  return (
    <canvas 
      ref={canvasRef} 
      className="w-full h-full cursor-grab active:cursor-grabbing touch-none" 
      onMouseDown={handlePointerDown}
      onMouseMove={handlePointerMove}
      onMouseUp={handlePointerUp}
      onMouseLeave={handlePointerUp}
      onTouchStart={handlePointerDown}
      onTouchMove={handlePointerMove}
      onTouchEnd={handlePointerUp}
      title="拖拽旋转"
    />
  );
};


// --- 主程序 ---
export default function App() {
  // 默认白色主题，true 为黑色主题
  const [darkMode, setDarkMode] = useState(false);
  const currentYear = new Date().getFullYear();
  const yearDisplay = currentYear > 2025 ? `2025–${currentYear}` : '2025';

  // 切换主题
  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 ease-in-out font-sans ${darkMode ? 'bg-[#0a0a0c] text-white' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* 顶部工具栏 (极简) */}
      <div className="absolute top-0 right-0 p-6 z-50 flex items-center gap-4">
        <button 
          onClick={toggleTheme}
          className={`p-3 rounded-full transition-all duration-300 ${
            darkMode 
              ? 'bg-white/10 hover:bg-white/20 text-yellow-300' 
              : 'bg-slate-200 hover:bg-slate-300 text-slate-600'
          }`}
          title="切换主题"
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>

      {/* 核心布局 */}
      <main className="container mx-auto px-4 min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
        
        {/* 背景装饰：网格线 (仅在 Light Mode 显眼，Dark Mode 隐没) */}
        <div className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${darkMode ? 'opacity-10' : 'opacity-40'}`}>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          <div className={`absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full blur-[100px] ${darkMode ? 'bg-indigo-500/20' : 'bg-blue-400/20'}`}></div>
        </div>

        {/* 上半部分：品牌形象与 3D 球体 */}
        <div className="relative w-full max-w-5xl flex flex-col md:flex-row items-center justify-between mb-12 md:mb-20 z-10 mt-10 md:mt-0">
          
          {/* 左侧：文字信息 */}
          <div className="text-center md:text-left md:w-1/2 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-500 text-xs font-bold tracking-wider uppercase">
              
              {/* --- 自定义图标区域 --- */}
              {/* 如果您有本地图片文件，请取消下面这行的注释并修改路径： */}
              <img src="/icon.svg" alt="logo" className="w-3 h-3 text-blue-500" />
              
              {/* 这是一个自定义的内联 SVG 图标 (带 X 的盾牌)，您可以直接在这里替换 <svg> 代码 */}
              {/* <svg 
                className="w-3 h-3 text-blue-500" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="M9 9l6 6m-6 0l6-6" />
              </svg> */}
              {/* --- 图标结束 --- */}

              SECURE LABORATORY X
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter">
              <span className="block mb-2">
                Seclab
                {/* 特殊设计的 X，使用多色渐变体现"包含多个方面" */}
                <span className={`inline-block ml-0.5 text-transparent bg-clip-text bg-gradient-to-br ${darkMode ? 'from-cyan-400 via-purple-400 to-pink-400' : 'from-blue-600 via-purple-600 to-red-500'}`}>
                  X
                </span>
              </span>
              <span className={`text-transparent bg-clip-text bg-gradient-to-r ${darkMode ? 'from-blue-400 to-purple-500' : 'from-slate-800 to-blue-600'}`}>
                Portal
              </span>
            </h1>
            
            <p className={`text-lg md:text-xl max-w-lg mx-auto md:mx-0 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              连接未来安全的枢纽。构建以 AI 为核心的网络安全教学、实训与研究平台体系。
            </p>

            {/* (已移除装饰性数据流条) */}
          </div>

          {/* 右侧：3D Canvas 球体 */}
          <div className="w-full md:w-1/2 h-[350px] md:h-[500px] flex items-center justify-center relative">
            {/* 3D 渲染区域 */}
            <SeclabXSphere isDark={darkMode} />
            
            {/* 底部装饰光晕 */}
            <div className={`absolute bottom-10 left-1/2 -translate-x-1/2 w-2/3 h-4 bg-blue-500 blur-xl opacity-20 rounded-full`}></div>
          </div>

        </div>

        {/* 下半部分：模块卡片 Grid */}
        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20 z-10">
          {SERVICES.map((service) => (
            <a 
              key={service.id} 
              href={service.url}
              className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl flex flex-col h-full
                ${darkMode 
                  ? 'bg-white/5 border-white/10 hover:border-blue-500/50 hover:shadow-blue-900/20' 
                  : 'bg-white border-slate-200 hover:border-blue-400/50 hover:shadow-blue-200/50'
                }
              `}
            >
              {/* 顶部渐变条 */}
              <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${service.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
              
              <div className="p-6 flex-1 flex flex-col items-start">
                <div className={`p-3 rounded-lg mb-4 transition-colors duration-300 ${darkMode ? 'bg-white/5 group-hover:bg-white/10' : 'bg-slate-100 group-hover:bg-blue-50'}`}>
                  <service.icon className={`w-8 h-8 ${darkMode ? 'text-white' : 'text-slate-700'}`} />
                </div>
                
                <div className="mb-2">
                  <span className="text-[10px] font-bold tracking-widest opacity-40 uppercase">{service.tag}</span>
                  <h3 className="text-xl font-bold mt-1 group-hover:text-blue-500 transition-colors">{service.title}</h3>
                </div>
                
                <p className={`text-sm leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  {service.desc}
                </p>
              </div>

              {/* 底部 Action */}
              <div className={`px-6 py-4 border-t flex justify-between items-center mt-auto ${darkMode ? 'border-white/5 bg-white/5' : 'border-slate-100 bg-slate-50'}`}>
                <span className="text-xs font-medium opacity-60 font-mono">{service.url.replace('https://', '')}</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform text-blue-500" />
              </div>

              {/* 背景装饰图案 */}
              <div className="absolute -bottom-4 -right-4 opacity-5 group-hover:opacity-10 transition-opacity transform rotate-12">
                 <service.icon size={120} />
              </div>
            </a>
          ))}
        </div>

        {/* 页脚 */}
        <footer className={`absolute bottom-4 w-full text-center text-xs font-mono opacity-30 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
          <p style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <span>© {yearDisplay} SeclabX ·</span>
            <a
              href="https://github.com/seclabx-org"
              target="_blank"
              rel="noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <img
                src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
                width="20"
                alt="GitHub"
                style={{ display: 'block' }}
              />
              <span style={{ lineHeight: 1 }}>Open Source on GitHub</span>
            </a>
          </p>
        </footer>

      </main>
    </div>
  );
}
