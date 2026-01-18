import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { Siren, Users, Ambulance, Shield, MapPin, AlertTriangle, Navigation, Phone } from 'lucide-react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { CrowdHeatmap } from '@/app/components/shared/CrowdHeatmap';

interface SOSDashboardProps {
  onBack: () => void;
}

interface Incident {
  id: number;
  type: 'medical' | 'crowd' | 'security';
  priority: 'critical' | 'high' | 'medium';
  location: string;
  description: string;
  time: string;
  status: 'active' | 'dispatched' | 'resolved';
  assignedUnit?: string;
}

export function SOSDashboard({ onBack }: SOSDashboardProps) {
  const [incidents, setIncidents] = useState<Incident[]>([
    { id: 1, type: 'medical', priority: 'critical', location: 'Main Entrance', description: 'Elderly person collapsed', time: 'Just now', status: 'active' },
    { id: 2, type: 'crowd', priority: 'high', location: 'Queue Zone', description: 'Overcrowding detected', time: '3 min ago', status: 'dispatched', assignedUnit: 'Team Alpha' },
  ]);

  const [resources, setResources] = useState({
    police: { available: 12, deployed: 8, total: 20 },
    medical: { available: 5, deployed: 3, total: 8 },
    ambulances: { available: 3, deployed: 1, total: 4 },
    crowd_control: { available: 18, deployed: 12, total: 30 },
  });

  const [predictions, setPredictions] = useState([
    { zone: 'Sanctum Area', risk: 'high', eta: '15 min', people: 156 },
    { zone: 'Main Entrance', risk: 'medium', eta: '30 min', people: 142 },
  ]);
useEffect(() => {
  const handler = () => {
    const emergency = localStorage.getItem("activeEmergency");
    if (!emergency) return;

    const data = JSON.parse(emergency);

    const newIncident: Incident = {
      id: data.id,
      type: "medical",
      priority: "critical",
      location: data.location || "Main Entrance",
      description: data.description || "Emergency SOS triggered",
      time: "Just now",
      status: "active",
    };

    setIncidents(prev => [newIncident, ...prev]);
  };

  window.addEventListener("EMERGENCY_ALERT", handler);
  return () => window.removeEventListener("EMERGENCY_ALERT", handler);
}, []);

useEffect(() => {
  const handler = () => {
    const data = localStorage.getItem("sosResponse");
    if (!data) return;

    const payload = JSON.parse(data);

    setNotifications(prev => [
      {
        id: Date.now(),
        type: "warning",
        message: payload.message,
        time: payload.time,
      },
      ...prev,
    ]);
    setActiveTab("notifications");

  };

  window.addEventListener("SOS_DISPATCHED", handler);
  return () => window.removeEventListener("SOS_DISPATCHED", handler);
}, []);

  useEffect(() => {
    // Simulate new incidents
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const newIncident: Incident = {
          id: Date.now(),
          type: ['medical', 'crowd', 'security'][Math.floor(Math.random() * 3)] as any,
          priority: ['critical', 'high', 'medium'][Math.floor(Math.random() * 3)] as any,
          location: ['Main Entrance', 'Temple Hall', 'Sanctum', 'Queue Zone'][Math.floor(Math.random() * 4)],
          description: 'New incident detected',
          time: 'Just now',
          status: 'active',
        };
        setIncidents(prev => [newIncident, ...prev].slice(0, 5));
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const getIncidentIcon = (type: string) => {
    switch (type) {
      case 'medical': return Ambulance;
      case 'crowd': return Users;
      case 'security': return Shield;
      default: return AlertTriangle;
    }
  };
const [sosActive, setSosActive] = useState(false);

  const getIncidentColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-950 border-red-500 text-red-300';
      case 'high': return 'bg-orange-950 border-orange-500 text-orange-300';
      case 'medium': return 'bg-yellow-950 border-yellow-500 text-yellow-300';
      default: return 'bg-slate-800 border-slate-600 text-slate-300';
    }
  };

  const handleDispatch = (incidentId: number) => {
  setIncidents(prev =>
    prev.map(inc =>
      inc.id === incidentId
        ? {
            ...inc,
            status: "dispatched",
            assignedUnit: "Emergency Team Alpha",
          }
        : inc
    )
  );

  // notify pilgrim
  localStorage.setItem(
    "sosResponse",
    JSON.stringify({
      message: "Emergency team dispatched. Help is on the way.",
      time: "Just now",
    })
  );

  window.dispatchEvent(new Event("SOS_DISPATCHED"));
};
const handleDeployEmergency = () => {
  setResources(prev => ({
    ...prev,
    medical: {
      ...prev.medical,
      available: Math.max(0, prev.medical.available - 1),
      deployed: prev.medical.deployed + 1,
    },
  }));

  localStorage.setItem(
    "sosResponse",
    JSON.stringify({
      message: "Additional emergency resources deployed.",
      time: "Just now",
    })
  );

  window.dispatchEvent(new Event("SOS_DISPATCHED"));
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-red-950 via-slate-900 to-orange-950 p-6">
      <div className="max-w-[1920px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Button variant="ghost" onClick={onBack} className="mb-4 text-white hover:text-white/80">← Back</Button>
            <h1 className="text-4xl font-bold text-white flex items-center gap-3">
              <motion.div
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <Siren className="w-10 h-10 text-red-500" />
              </motion.div>
              Emergency Operations Center
            </h1>
            <p className="text-slate-300 mt-2">Real-time incident management and resource deployment</p>
          </div>
          
          <div className="flex items-center gap-4">
            <motion.button
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={{
                boxShadow: ['0 0 0 0 rgba(220, 38, 38, 0.7)', '0 0 0 20px rgba(220, 38, 38, 0)'],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Phone className="w-5 h-5" />
              Emergency Hotline
            </motion.button>
          </div>
        </div>

        {/* Alert Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <ResourceCard
            icon={AlertTriangle}
            label="Active Incidents"
            value={incidents.filter(i => i.status === 'active').length}
            total={incidents.length}
            color="red"
            pulse
          />
          <ResourceCard
            icon={Shield}
            label="Police Units"
            value={resources.police.available}
            total={resources.police.total}
            color="blue"
          />
          <ResourceCard
            icon={Ambulance}
            label="Medical Teams"
            value={resources.medical.available}
            total={resources.medical.total}
            color="green"
          />
          <ResourceCard
            icon={Users}
            label="Crowd Control"
            value={resources.crowd_control.available}
            total={resources.crowd_control.total}
            color="purple"
          />
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Heatmap */}
          <div className="lg:col-span-2">
            <Card className="p-6 bg-slate-900/50 border-slate-700 backdrop-blur">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <MapPin className="w-6 h-6 text-red-400" />
                Live Threat Assessment Map
              </h2>
              <CrowdHeatmap interactive />
            </Card>
          </div>

          {/* Early Warning System */}
          <div>
            <Card className="p-6 bg-slate-900/50 border-slate-700 backdrop-blur">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
                Predictive Alerts
              </h3>
              
              <div className="space-y-4">
                {predictions.map((pred, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`p-4 rounded-lg border-2 ${
                      pred.risk === 'high' ? 'bg-red-950/50 border-red-500' : 'bg-orange-950/50 border-orange-500'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-white">{pred.zone}</span>
                      <Badge variant={pred.risk === 'high' ? 'destructive' : 'secondary'}>
                        {pred.risk.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="text-sm text-slate-300 space-y-1">
                      <div className="flex justify-between">
                        <span>Expected:</span>
                        <span className="font-semibold">{pred.eta}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>People:</span>
                        <span className="font-semibold">{pred.people}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-slate-800 rounded-lg">
                <div className="text-sm text-slate-400 mb-2">AI Risk Analysis</div>
                <div className="text-lg font-bold text-yellow-400">Medium Threat Level</div>
                <div className="text-xs text-slate-400 mt-1">Based on crowd patterns & historical data</div>
              </div>
            </Card>
          </div>
        </div>

        {/* Incidents and Deployment */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Active Incidents */}
          <Card className="p-6 bg-slate-900/50 border-slate-700 backdrop-blur">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Siren className="w-5 h-5 text-red-400" />
              Live Incidents
            </h3>
            
            <div className="space-y-4">
              {incidents.map((incident) => {
                const Icon = getIncidentIcon(incident.type);
                return (
                  <motion.div
                    key={incident.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`p-4 rounded-lg border-l-4 ${getIncidentColor(incident.priority)}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-slate-800 rounded-lg">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-white">{incident.location}</span>
                          <Badge
                            variant={
                              incident.status === 'active' ? 'destructive' :
                              incident.status === 'dispatched' ? 'secondary' : 'default'
                            }
                          >
                            {incident.status.toUpperCase()}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-slate-300 mb-2">{incident.description}</p>
                        
                        <div className="flex items-center justify-between">
                          <div className="text-xs text-slate-400">
                            {incident.time}
                            {incident.assignedUnit && ` • ${incident.assignedUnit}`}
                          </div>
                          
                          {incident.status === 'active' && (
                            <Button
                              size="sm"
                              onClick={() => handleDispatch(incident.id)}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              <Navigation className="w-3 h-3 mr-1" />
                              Dispatch
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </Card>

          {/* Resource Deployment */}
          <Card className="p-6 bg-slate-900/50 border-slate-700 backdrop-blur">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-400" />
              Resource Deployment
            </h3>
            
            <div className="space-y-6">
              <DeploymentBar
                label="Police Units"
                icon={Shield}
                available={resources.police.available}
                deployed={resources.police.deployed}
                total={resources.police.total}
                color="blue"
              />
              <DeploymentBar
                label="Medical Teams"
                icon={Ambulance}
                available={resources.medical.available}
                deployed={resources.medical.deployed}
                total={resources.medical.total}
                color="green"
              />
              <DeploymentBar
                label="Ambulances"
                icon={Ambulance}
                available={resources.ambulances.available}
                deployed={resources.ambulances.deployed}
                total={resources.ambulances.total}
                color="red"
              />
              <DeploymentBar
                label="Crowd Control"
                icon={Users}
                available={resources.crowd_control.available}
                deployed={resources.crowd_control.deployed}
                total={resources.crowd_control.total}
                color="purple"
              />
            </div>

            <div className="mt-6 pt-6 border-t border-slate-700">
              <Button
  onClick={handleDeployEmergency}
  className="w-full bg-blue-600 hover:bg-blue-700"
  size="lg"
>

                <Navigation className="w-4 h-4 mr-2" />
                Deploy Emergency Team
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function ResourceCard({ icon: Icon, label, value, total, color, pulse }: any) {
  const colorClasses = {
    red: 'from-red-500 to-red-600',
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
    >
      <Card className="p-6 bg-slate-900/50 border-slate-700 backdrop-blur">
        <div className="flex items-center justify-between mb-4">
          <motion.div
            className={`p-3 rounded-xl bg-gradient-to-br ${colorClasses[color]}`}
            animate={pulse ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Icon className="w-6 h-6 text-white" />
          </motion.div>
        </div>
        <div className="text-sm text-slate-400 mb-1">{label}</div>
        <div className="text-3xl font-bold text-white">
          {value}
          <span className="text-lg text-slate-400 ml-1">/{total}</span>
        </div>
        <div className="text-xs text-slate-500 mt-1">Available / Total</div>
      </Card>
    </motion.div>
  );
}

function DeploymentBar({ label, icon: Icon, available, deployed, total, color }: any) {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    red: 'bg-red-500',
    purple: 'bg-purple-500',
  };

  const deployedPercentage = (deployed / total) * 100;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-slate-400" />
          <span className="text-slate-300 font-medium">{label}</span>
        </div>
        <div className="text-sm">
          <span className="text-white font-semibold">{available} available</span>
          <span className="text-slate-500 mx-1">•</span>
          <span className="text-slate-400">{deployed} deployed</span>
        </div>
      </div>
      <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
        <div className="flex h-full">
          <motion.div
            className={colorClasses[color]}
            initial={{ width: 0 }}
            animate={{ width: `${deployedPercentage}%` }}
            transition={{ duration: 0.5 }}
          />
          <div className="flex-1 bg-slate-600" />
        </div>
      </div>
    </div>
  );
}
