import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { Users, TrendingUp, AlertTriangle, Activity, Settings, Lock, Unlock, BarChart3 } from 'lucide-react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Slider } from '@/app/components/ui/slider';
import { Switch } from '@/app/components/ui/switch';
import { Badge } from '@/app/components/ui/badge';
import { CrowdHeatmap } from '@/app/components/shared/CrowdHeatmap';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface AdminDashboardProps {
  onBack: () => void;
}

export function AdminDashboard({ onBack }: AdminDashboardProps) {
  const [totalCount, setTotalCount] = useState(1247);
  const [capacityLimit, setCapacityLimit] = useState(1500);
  const [mandatoryBooking, setMandatoryBooking] = useState(true);
  const [alerts, setAlerts] = useState([
    { id: 1, zone: 'Main Entrance', level: 'warning', message: 'Approaching 85% capacity', time: 'Just now' },
    { id: 2, zone: 'Queue Zone', level: 'critical', message: 'Exceeding safe limits', time: '2 min ago' },
  ]);

  const [footfallData, setFootfallData] = useState([
    { time: '06:00', count: 145 },
    { time: '08:00', count: 389 },
    { time: '10:00', count: 621 },
    { time: '12:00', count: 892 },
    { time: '14:00', count: 1124 },
    { time: '16:00', count: 1347 },
    { time: '18:00', count: 956 },
  ]);

  const zoneStats = [
    { name: 'Main Entrance', current: 165, capacity: 200, personnel: 12 },
    { name: 'Temple Hall', current: 245, capacity: 300, personnel: 18 },
    { name: 'Sanctum', current: 142, capacity: 150, personnel: 8 },
    { name: 'Queue Zone', current: 188, capacity: 200, personnel: 15 },
  ];
useEffect(() => {
  const handler = () => {
    const emergency = localStorage.getItem("activeEmergency");
    if (emergency) {
      setActiveEmergency(JSON.parse(emergency));
    }
  };

  window.addEventListener("EMERGENCY_ALERT", handler);
  return () => window.removeEventListener("EMERGENCY_ALERT", handler);
}, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTotalCount(prev => Math.max(800, prev + Math.floor(Math.random() * 21) - 10));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const percentage = (totalCount / capacityLimit) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-slate-900 to-purple-950 p-6">
      <div className="max-w-[1920px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Button variant="ghost" onClick={onBack} className="mb-4 text-white hover:text-white/80">← Back</Button>
            <h1 className="text-4xl font-bold text-white flex items-center gap-3">
              <Activity className="w-10 h-10 text-blue-400" />
              Temple Command Center
            </h1>
            <p className="text-slate-300 mt-2">Real-time monitoring and crowd control management</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm text-slate-400">System Status</div>
              <div className="text-green-400 font-semibold flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                Operational
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Users}
            label="Total Footfall"
            value={totalCount.toLocaleString()}
            change="+12%"
            changeType="up"
            color="blue"
          />
          <StatCard
            icon={TrendingUp}
            label="Capacity Utilization"
            value={`${percentage.toFixed(0)}%`}
            change={percentage > 80 ? 'High' : 'Normal'}
            changeType={percentage > 80 ? 'warning' : 'neutral'}
            color="purple"
          />
          <StatCard
            icon={AlertTriangle}
            label="Active Alerts"
            value={alerts.length}
            change="Requires Action"
            changeType="critical"
            color="red"
          />
          <StatCard
            icon={BarChart3}
            label="Avg Wait Time"
            value="23 min"
            change="-5 min"
            changeType="down"
            color="green"
          />
        </div>

        {/* Main Control Grid */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Central Heatmap */}
          <div className="lg:col-span-2">
            <Card className="p-6 bg-slate-900/50 border-slate-700 backdrop-blur">
              <h2 className="text-2xl font-bold text-white mb-4">Live Crowd Density Map</h2>
              <CrowdHeatmap interactive />
            </Card>
          </div>

          {/* Controls Panel */}
          <div className="space-y-6">
            {/* Capacity Control */}
            <Card className="p-6 bg-slate-900/50 border-slate-700 backdrop-blur">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5 text-blue-400" />
                Capacity Control
              </h3>
              
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-slate-300">Maximum Capacity</span>
                    <span className="text-white font-bold">{capacityLimit}</span>
                  </div>
                  <Slider
                    value={[capacityLimit]}
                    onValueChange={(value) => setCapacityLimit(value[0])}
                    min={1000}
                    max={2000}
                    step={50}
                    className="mb-2"
                  />
                  <div className="text-xs text-slate-400">Adjust temple capacity limit</div>
                </div>

                <div className="pt-4 border-t border-slate-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-slate-300 font-medium">Mandatory Booking</div>
                      <div className="text-xs text-slate-400 mt-1">Enforce slot-based entry</div>
                    </div>
                    <Switch checked={mandatoryBooking} onCheckedChange={setMandatoryBooking} />
                  </div>
                </div>

                <motion.div
                  className="bg-slate-800 rounded-lg p-4"
                  animate={percentage > 90 ? { borderColor: ['#ef4444', '#f59e0b'], borderWidth: 2 } : {}}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {percentage > 90 ? <Lock className="w-4 h-4 text-red-400" /> : <Unlock className="w-4 h-4 text-green-400" />}
                    <span className="text-sm font-semibold text-white">
                      {percentage > 90 ? 'Entry Restricted' : 'Entry Open'}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400">
                    {percentage > 90 ? 'Automatic restriction active' : 'Normal operations'}
                  </div>
                </motion.div>
              </div>
            </Card>

            {/* Live Alerts */}
            <Card className="p-6 bg-slate-900/50 border-slate-700 backdrop-blur">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                Live Alerts
              </h3>
              
              <div className="space-y-3">
                {alerts.map((alert) => (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`p-3 rounded-lg border-l-4 ${
                      alert.level === 'critical' ? 'bg-red-950/50 border-red-500' : 'bg-yellow-950/50 border-yellow-500'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="font-semibold text-white text-sm">{alert.zone}</div>
                        <div className="text-xs text-slate-300 mt-1">{alert.message}</div>
                      </div>
                      <Badge variant={alert.level === 'critical' ? 'destructive' : 'secondary'} className="text-xs">
                        {alert.level.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="text-xs text-slate-400 mt-2">{alert.time}</div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* Zone-wise Stats & Analytics */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Zone Breakdown */}
          <Card className="p-6 bg-slate-900/50 border-slate-700 backdrop-blur">
            <h3 className="text-xl font-bold text-white mb-6">Zone-wise Status</h3>
            
            <div className="space-y-4">
              {zoneStats.map((zone) => {
                const zonePercentage = (zone.current / zone.capacity) * 100;
                return (
                  <div key={zone.name} className="p-4 bg-slate-800/50 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-white font-medium">{zone.name}</span>
                      <div className="flex items-center gap-4">
                        <span className="text-slate-400 text-sm">{zone.personnel} personnel</span>
                        <Badge variant={zonePercentage > 90 ? 'destructive' : zonePercentage > 70 ? 'secondary' : 'default'}>
                          {zone.current}/{zone.capacity}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-slate-400">
                        <span>Occupancy</span>
                        <span className={zonePercentage > 90 ? 'text-red-400' : zonePercentage > 70 ? 'text-yellow-400' : 'text-green-400'}>
                          {zonePercentage.toFixed(0)}%
                        </span>
                      </div>
                      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full ${
                            zonePercentage > 90 ? 'bg-red-500' : zonePercentage > 70 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          initial={{ width: 0 }}
                          animate={{ width: `${zonePercentage}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Footfall Timeline */}
          <Card className="p-6 bg-slate-900/50 border-slate-700 backdrop-blur">
            <h3 className="text-xl font-bold text-white mb-6">Daily Footfall Trend</h3>
            
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={footfallData}>
                <defs>
                  <linearGradient id="footfallGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="time" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                  labelStyle={{ color: '#e2e8f0' }}
                />
                <Area type="monotone" dataKey="count" stroke="#3b82f6" fillOpacity={1} fill="url(#footfallGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, change, changeType, color }: any) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    purple: 'from-purple-500 to-purple-600',
    red: 'from-red-500 to-red-600',
    green: 'from-green-500 to-green-600',
  };

  const changeColors = {
    up: 'text-green-400',
    down: 'text-green-400',
    warning: 'text-yellow-400',
    critical: 'text-red-400',
    neutral: 'text-slate-400',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
    >
      <Card className="p-6 bg-slate-900/50 border-slate-700 backdrop-blur">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl bg-gradient-to-br ${colorClasses[color]}`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div className={`text-sm font-medium ${changeColors[changeType]}`}>
            {change}
          </div>
        </div>
        <div className="text-sm text-slate-400 mb-1">{label}</div>
        <div className="text-3xl font-bold text-white">{value}</div>
      </Card>
    </motion.div>
  );
}
