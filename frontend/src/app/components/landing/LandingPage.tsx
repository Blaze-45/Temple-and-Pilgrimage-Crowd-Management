import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { Users, Shield, Activity, Clock, AlertCircle, CheckCircle2, MapPin, ArrowRight } from 'lucide-react';
import { CrowdHeatmap } from '@/app/components/shared/CrowdHeatmap';
import { getLandingStats } from "@/app/api/landing.api";


interface LandingPageProps {
  onRoleSelect: (role: 'pilgrim' | 'admin' | 'sos') => void;
}

export function LandingPage({ onRoleSelect }: LandingPageProps) {
  const [queueLength, setQueueLength] = useState(1247);
  const [slotsAvailable, setSlotsAvailable] = useState(342);
  const [incidents, setIncidents] = useState(2);
  
useEffect(() => {
  let mounted = true;

  const fetchStats = async () => {
    try {
      const data = await getLandingStats();
      if (!mounted) return;

      setQueueLength(data.queueLength);
      setSlotsAvailable(data.slotsAvailable);
      setIncidents(data.activeIncidents);
    } catch (err) {
      console.error("Landing stats fetch failed", err);
    }
  };

  fetchStats();
  const interval = setInterval(fetchStats, 3000);

  return () => {
    mounted = false;
    clearInterval(interval);
  };
}, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 overflow-x-hidden">
      {/* Hero Section with Live Data */}
      <div className="relative h-screen flex items-center justify-center">
        {/* Animated background grid */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            {Array.from({ length: 50 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-px h-px bg-blue-500 rounded-full"
                initial={{ 
                  x: Math.random() * window.innerWidth,
                  y: Math.random() * window.innerHeight,
                  opacity: 0 
                }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1.5, 0],
                }}
                transition={{
                  duration: 3,
                  delay: Math.random() * 5,
                  repeat: Infinity,
                  repeatDelay: Math.random() * 3,
                }}
              />
            ))}
          </div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Temple & Pilgrimage<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600">
                Crowd Management
              </span>
            </h1>
            <p className="text-xl text-slate-300 mb-12 max-w-3xl mx-auto">
              Real-time crowd intelligence • Seamless slot booking • Emergency response system
            </p>
          </motion.div>

          {/* Live Stats Bar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex flex-wrap justify-center gap-6 mb-16"
          >
            <LiveStat icon={Users} label="People in Queue" value={queueLength} color="text-blue-400" pulse />
            <LiveStat icon={Clock} label="Slots Available" value={slotsAvailable} color="text-green-400" pulse />
            <LiveStat icon={AlertCircle} label="Active Incidents" value={incidents} color={incidents > 0 ? "text-red-400" : "text-green-400"} pulse={incidents > 0} />
            <LiveStat icon={Activity} label="Avg Wait Time" value="23 min" color="text-yellow-400" />
          </motion.div>

          {/* Role Selection Portals */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto"
          >
            <RolePortal
              role="pilgrim"
              title="Devotee Entry"
              icon={Users}
              description="Book slots • Get digital passes • Track queues"
              gradient="from-orange-500 to-pink-500"
              onClick={() => onRoleSelect('pilgrim')}
            />
            <RolePortal
              role="admin"
              title="Temple Admin"
              icon={Shield}
              description="Monitor crowds • Manage capacity • Deploy resources"
              gradient="from-blue-500 to-purple-500"
              onClick={() => onRoleSelect('admin')}
            />
            <RolePortal
              role="sos"
              title="Emergency Ops"
              icon={Activity}
              description="Emergency alerts • Incident response • Medical dispatch"
              gradient="from-red-500 to-orange-500"
              onClick={() => onRoleSelect('sos')}
            />
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="text-slate-400 text-sm">Scroll to explore</div>
        </motion.div>
      </div>

      {/* Live Crowd Visualization Section */}
      <div className="py-20 px-4">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-7xl mx-auto"
        >
          <h2 className="text-4xl font-bold text-white text-center mb-4">
            Live Temple Crowd Map
          </h2>
          <p className="text-slate-400 text-center mb-12">Real-time zone-wise density tracking • Updated every 2 seconds</p>
          
          <CrowdHeatmap />
          
          {/* Feature highlights */}
          <div className="mt-16 grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={MapPin}
              title="Zone-wise Tracking"
              description="Monitor crowd density across 7+ temple zones in real-time"
              delay={0.1}
            />
            <FeatureCard
              icon={Clock}
              title="Predictive Alerts"
              description="AI-powered early warning system for crowd bottlenecks"
              delay={0.2}
            />
            <FeatureCard
              icon={CheckCircle2}
              title="Automated Control"
              description="Dynamic slot management and capacity enforcement"
              delay={0.3}
            />
          </div>
        </motion.div>
      </div>

      {/* Problem → Solution Storytelling */}
      <div className="py-20 px-4 bg-slate-950/50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-12 items-center"
          >
            <div>
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <div className="text-red-400 font-semibold mb-4">THE PROBLEM</div>
                <h3 className="text-3xl font-bold text-white mb-6">Traditional Chaos</h3>
                <ul className="space-y-4 text-slate-300">
                  <li className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                    <span>Unmanaged crowds causing stampede risks</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                    <span>Hours of waiting in unpredictable queues</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                    <span>No priority access for elderly & disabled</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                    <span>Delayed emergency response coordination</span>
                  </li>
                </ul>
              </motion.div>
            </div>
            
            <div>
              <motion.div
                initial={{ x: 50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                <div className="text-green-400 font-semibold mb-4">THE SOLUTION</div>
                <h3 className="text-3xl font-bold text-white mb-6">Smart Management</h3>
                <ul className="space-y-4 text-slate-300">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Real-time monitoring with automated controls</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Pre-booked slots with exact entry times</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Priority queue system with digital verification</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Integrated emergency response network</span>
                  </li>
                </ul>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function LiveStat({ icon: Icon, label, value, color, pulse }: any) {
  return (
    <motion.div
      className="bg-slate-800/50 backdrop-blur-sm px-6 py-4 rounded-xl border border-slate-700 min-w-[160px]"
      whileHover={{ scale: 1.05, borderColor: '#3b82f6' }}
    >
      <div className="flex items-center gap-3 mb-2">
        <motion.div
          animate={pulse ? { scale: [1, 1.2, 1] } : {}}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <Icon className={`w-5 h-5 ${color}`} />
        </motion.div>
        <div className="text-slate-400 text-sm">{label}</div>
      </div>
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
    </motion.div>
  );
}

function RolePortal({ role, title, icon: Icon, description, gradient, onClick }: any) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.button
      className="relative group overflow-hidden rounded-2xl border-2 border-slate-700 bg-slate-900/50 backdrop-blur-sm p-8 text-left transition-all hover:border-slate-500"
      whileHover={{ scale: 1.05, y: -5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity`} />
      
      <motion.div
        animate={isHovered ? { rotate: [0, 5, -5, 0] } : {}}
        transition={{ duration: 0.5 }}
      >
        <Icon className="w-12 h-12 text-white mb-4" />
      </motion.div>
      
      <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
      <p className="text-slate-400 mb-4">{description}</p>
      
      <motion.div
        className="flex items-center gap-2 text-blue-400 font-semibold"
        animate={isHovered ? { x: [0, 5, 0] } : {}}
        transition={{ duration: 0.8, repeat: Infinity }}
      >
        <span>Enter</span>
        <ArrowRight className="w-4 h-4" />
      </motion.div>
    </motion.button>
  );
}

function FeatureCard({ icon: Icon, title, description, delay }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      className="bg-slate-800/30 border border-slate-700 rounded-xl p-6 backdrop-blur-sm hover:border-slate-600 transition-colors"
    >
      <Icon className="w-10 h-10 text-blue-400 mb-4" />
      <h4 className="text-xl font-semibold text-white mb-2">{title}</h4>
      <p className="text-slate-400">{description}</p>
    </motion.div>
  );
}
