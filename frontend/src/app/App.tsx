import { useState } from 'react';
import { LandingPage } from '@/app/components/landing/LandingPage';
import { PilgrimDashboard } from '@/app/components/pilgrim/PilgrimDashboard';
import { AdminDashboard } from '@/app/components/admin/AdminDashboard';
import { SOSDashboard } from '@/app/components/sos/SOSDashboard';

type Role = 'landing' | 'pilgrim' | 'admin' | 'sos';

export default function App() {
  const [currentRole, setCurrentRole] = useState<Role>('landing');

  const handleRoleSelect = (role: 'pilgrim' | 'admin' | 'sos') => {
    setCurrentRole(role);
  };

  const handleBack = () => {
    setCurrentRole('landing');
  };

  return (
    <div className="min-h-screen">
      {currentRole === 'landing' && <LandingPage onRoleSelect={handleRoleSelect} />}
      {currentRole === 'pilgrim' && <PilgrimDashboard onBack={handleBack} />}
      {currentRole === 'admin' && <AdminDashboard onBack={handleBack} />}
      {currentRole === 'sos' && <SOSDashboard onBack={handleBack} />}
    </div>
  );
}
