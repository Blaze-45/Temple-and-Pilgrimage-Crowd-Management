import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { Calendar, QrCode, Bell, Clock, MapPin, AlertCircle, Users, CheckCircle, Accessibility, Baby, Heart } from 'lucide-react';
import QRCode from 'react-qr-code';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Progress } from '@/app/components/ui/progress';
import { createBooking } from "@/app/api/booking.api";
interface PilgrimDashboardProps {
  onBack: () => void;
}

export function PilgrimDashboard({ onBack }: PilgrimDashboardProps) {
  const [hasBooking, setHasBooking] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [selectedPriority, setSelectedPriority] = useState<string | null>(null);
  const [queuePosition, setQueuePosition] = useState(247);
  const [waitTime, setWaitTime] = useState(23);
  const [notifications, setNotifications] = useState<any[]>([]);
  const devoteeId = "DEV123"; // later from auth/session
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState("booking");
  const [bookingData, setBookingData] = useState<any>(null);
  const [isBooking, setIsBooking] = useState(false);
  const [sosActive, setSosActive] = useState(false);
const [qrValue, setQrValue] = useState<string | null>(null);
const QR_VALIDITY_MINUTES = 1;

const [qrExpiry, setQrExpiry] = useState<number | null>(null);
const [qrExpired, setQrExpired] = useState(false);

useEffect(() => {
  const stored = localStorage.getItem("sosResponse");
  if (!stored) return;

  const payload = JSON.parse(stored);

  setNotifications(prev => {
    // prevent duplicate insertion
    if (prev.some(n => n.message === payload.message)) return prev;

    return [
      {
        id: Date.now(),
        type: "warning",
        message: payload.message,
        time: payload.time,
      },
      ...prev,
    ];
  });
}, []);

  useEffect(() => {
  if (!hasBooking) return;

  const interval = setInterval(() => {
    setQueuePosition(prev => Math.max(1, prev - Math.floor(Math.random() * 5)));
    setWaitTime(prev => Math.max(5, prev - 1));
  }, 3000);

  return () => clearInterval(interval);
}, [hasBooking]);

useEffect(() => {
  if (!qrExpiry) return;

  const interval = setInterval(() => {
    if (Date.now() >= qrExpiry) {
      setQrExpired(true);
      setQrValue(null);

      setNotifications(prev => [
        {
          id: Date.now(),
          type: "warning",
          message: "Your QR code has expired. Please rebook or contact support.",
          time: "Just now",
        },
        ...prev,
      ]);

      clearInterval(interval);
    }
  }, 1000);

  return () => clearInterval(interval);
}, [qrExpiry]);


  const timeSlots = [
    { id: '1', time: '06:00 AM', available: 45, total: 150, price: 'Free' },
    { id: '2', time: '08:00 AM', available: 12, total: 150, price: 'Free' },
    { id: '3', time: '10:00 AM', available: 89, total: 150, price: 'Free' },
    { id: '4', time: '12:00 PM', available: 124, total: 150, price: 'Free' },
    { id: '5', time: '02:00 PM', available: 67, total: 150, price: 'Free' },
    { id: '6', time: '04:00 PM', available: 142, total: 150, price: 'Free' },
    { id: '7', time: '06:00 PM', available: 0, total: 150, price: 'Free' },
  ];

  const priorityOptions = [
    { id: 'elderly', label: 'Elderly (60+)', icon: Accessibility, color: 'bg-orange-500' },
    { id: 'disabled', label: 'Differently Abled', icon: Accessibility, color: 'bg-purple-500' },
    { id: 'women-children', label: 'Women with Children', icon: Baby, color: 'bg-pink-500' },
    { id: 'medical', label: 'Medical Conditions', icon: Heart, color: 'bg-red-500' },
  ];

  const handleBookSlot = () => {
  if (!selectedSlot) return;

  const bookingId = `TMP-${selectedSlot}-${Date.now()}`;
  const expiryTime = Date.now() + QR_VALIDITY_MINUTES * 60 * 1000;

  setQrValue(bookingId);
  setQrExpiry(expiryTime);
  setQrExpired(false);
  setHasBooking(true);

  setNotifications(prev => [
    {
      id: Date.now(),
      type: "info",
      message: `Darshan slot booked. QR valid for ${QR_VALIDITY_MINUTES} minutes.`,
      time: "Just now",
    },
    ...prev,
  ]);
};

const handleSOS = () => {
  const emergency = {
    id: "EMG-" + Date.now(),
    devoteeId,
    zone: "Main Entrance",
    severity: "HIGH",
    status: "REPORTED",
    timestamp: new Date().toISOString(),
  };

  // Store emergency globally
  localStorage.setItem("activeEmergency", JSON.stringify(emergency));

  // Notify Admin & SOS dashboards
  window.dispatchEvent(new Event("EMERGENCY_ALERT"));

  setSosActive(true);
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Button variant="ghost" onClick={onBack} className="mb-4">← Back</Button>
            <h1 className="text-4xl font-bold text-slate-900">Devotee Dashboard</h1>
            <p className="text-slate-600 mt-2">Book your darshan slot and manage your visit</p>
          </div>
          
          <div className="relative">
            <Bell className="w-6 h-6 text-slate-600 cursor-pointer" />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {notifications.length}
              </span>
            )}
          </div>
        </div>
{sosActive && (
  <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4 flex items-center gap-3"
  >
    <AlertCircle className="w-5 h-5 text-red-600" />
    <span className="text-red-800 font-medium">
      Emergency alert sent. Help is on the way.
    </span>
  </motion.div>
)}

        <Tabs defaultValue="booking" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto">
            <TabsTrigger value="booking">Slot Booking</TabsTrigger>
            <TabsTrigger value="ticket">My Ticket</TabsTrigger>
            <TabsTrigger value="queue" disabled={!hasBooking}>
  Live Queue
</TabsTrigger>

            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          {/* Booking Tab */}
          <TabsContent value="booking" className="space-y-6">
            {/* Priority Selection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Users className="w-6 h-6 text-orange-500" />
                  Priority Access
                </h2>
                <p className="text-slate-600 mb-6">Select if you qualify for priority darshan</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {priorityOptions.map((option) => (
                    <motion.button
                      key={option.id}
                      className={`relative p-6 rounded-xl border-2 transition-all ${
                        selectedPriority === option.id
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-slate-200 bg-white hover:border-orange-300'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() =>
  setSelectedPriority(prev =>
    prev === option.id ? null : option.id
  )
}

                    >
                      <option.icon className={`w-10 h-10 text-white ${option.color} p-2 rounded-lg mb-3`} />
                      <div className="font-semibold text-slate-900 text-sm">{option.label}</div>
                      {selectedPriority === option.id && (
                        <CheckCircle className="absolute top-2 right-2 w-5 h-5 text-orange-500" />
                      )}
                    </motion.button>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Time Slot Selection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-orange-500" />
                  Select Darshan Slot
                </h2>
                <p className="text-slate-600 mb-6">Today • January 17, 2026</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {timeSlots.map((slot) => {
                    const percentage = (slot.available / slot.total) * 100;
                    const isAvailable = slot.available > 0;
                    const isSelected = selectedSlot === slot.id;

                    return (
                      <motion.button
                        key={slot.id}
                        className={`relative p-5 rounded-xl border-2 transition-all ${
                          !isAvailable
                            ? 'border-slate-200 bg-slate-100 cursor-not-allowed opacity-60'
                            : isSelected
                            ? 'border-orange-500 bg-orange-50 shadow-lg'
                            : 'border-slate-200 bg-white hover:border-orange-300 hover:shadow'
                        }`}
                        whileHover={isAvailable ? { scale: 1.02 } : {}}
                        whileTap={isAvailable ? { scale: 0.98 } : {}}
                        onClick={() => {
  if (!isAvailable) return;
  setSelectedSlot(prev =>
    prev === slot.id ? null : slot.id
  );
}}

                        disabled={!isAvailable}
                      >
                        <div className="text-2xl font-bold text-slate-900 mb-2">{slot.time}</div>
                        <div className="text-sm text-slate-600 mb-3">{slot.price}</div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-500">Available</span>
                            <span className={`font-semibold ${isAvailable ? 'text-green-600' : 'text-red-600'}`}>
                              {slot.available}/{slot.total}
                            </span>
                          </div>
                          <Progress value={percentage} className="h-2" />
                        </div>

                        {!isAvailable && (
                          <Badge variant="destructive" className="absolute top-2 right-2">Full</Badge>
                        )}
                        {isSelected && (
                          <CheckCircle className="absolute top-2 right-2 w-5 h-5 text-orange-500" />
                        )}
                      </motion.button>
                    );
                  })}
                </div>

                {selectedSlot && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-6 pt-6 border-t"
                  >
                    <Button onClick={handleBookSlot} className="w-full md:w-auto bg-orange-500 hover:bg-orange-600" size="lg">
                      Confirm Booking →
                    </Button>
                  </motion.div>
                )}
              </Card>
            </motion.div>
          </TabsContent>

          {/* Ticket Tab */}
          <TabsContent value="ticket">
            {hasBooking ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-2xl mx-auto"
              >
                <Card className="p-8 bg-gradient-to-br from-orange-500 to-pink-500 text-white">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h2 className="text-3xl font-bold">Digital Darshan Pass</h2>
                      <p className="text-orange-100 mt-1">Sri Mandir Temple</p>
                    </div>
                    <Badge variant="secondary" className="bg-white text-orange-600 px-4 py-2">
                      {selectedPriority ? 'Priority Access' : 'General Entry'}
                    </Badge>
                  </div>

                  <div className="bg-white rounded-xl p-6 text-slate-900">
                    <div className="grid grid-cols-2 gap-6 mb-6">
                      <div>
                        <div className="text-sm text-slate-500 mb-1">Devotee Name</div>
                        <div className="font-semibold">John Doe</div>
                      </div>
                      <div>
                        <div className="text-sm text-slate-500 mb-1">Booking ID</div>
                        <div className="font-semibold">#TMP{selectedSlot}2401</div>
                      </div>
                      <div>
                        <div className="text-sm text-slate-500 mb-1">Slot Time</div>
                        <div className="font-semibold text-orange-600">
                          {timeSlots.find(s => s.id === selectedSlot)?.time}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-slate-500 mb-1">Entry Gate</div>
                        <div className="font-semibold">Gate 2A</div>
                      </div>
                    </div>

                    <div className="border-t pt-6 flex justify-center">
                      <div className="bg-white p-4 rounded-xl shadow-lg">
                        {qrExpired || !qrValue ? (
  <div className="text-center text-red-600 font-semibold">
    QR Code Expired
  </div>
) : (
  <QRCode value={qrValue} size={180} />
)}
{qrExpiry && !qrExpired && (
  <p className="text-center text-xs text-slate-500 mt-2">
    Valid until {new Date(qrExpiry).toLocaleTimeString()}
  </p>
)}


                      </div>
                    </div>
                    
                    <p className="text-center text-sm text-slate-500 mt-4">
                      Show this QR code at the entry gate
                    </p>
                  </div>

                  <div className="mt-6 flex items-center gap-2 text-sm text-orange-100">
                    <AlertCircle className="w-4 h-4" />
                    <span>Please arrive 15 minutes before your slot time</span>
                  </div>
                </Card>
              </motion.div>
            ) : (
              <Card className="p-12 text-center">
                <QrCode className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">No Active Booking</h3>
                <p className="text-slate-600">Book a slot to view your digital pass</p>
              </Card>
            )}
          </TabsContent>
{!hasBooking && (
  <Card className="p-6 text-center bg-yellow-50 border border-yellow-200 mb-6">
    <AlertCircle className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
    <p className="text-yellow-800 font-medium">
      Please book a darshan slot to view live queue status.
    </p>
  </Card>
)}

          {/* Queue Tab */}
          <TabsContent value="queue">
            <div className="grid md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card className="p-6">
                  <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-orange-500" />
                    Your Queue Status
                  </h3>
                  
                  <div className="space-y-6">
                    <div className="text-center py-8">
                      <motion.div
                        key={queuePosition}
                        initial={{ scale: 1.2, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-6xl font-bold text-orange-500 mb-2"
                      >
                        #{queuePosition}
                      </motion.div>
                      <div className="text-slate-600">Position in Queue</div>
                    </div>

                    <div className="bg-orange-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-slate-600">Estimated Wait Time</span>
                        <motion.span
                          key={waitTime}
                          initial={{ scale: 1.1 }}
                          animate={{ scale: 1 }}
                          className="text-2xl font-bold text-orange-600"
                        >
                          {waitTime} min
                        </motion.span>
                      </div>
                      <Progress value={(30 - waitTime) / 30 * 100} className="h-2" />
                    </div>
                  </div>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card className="p-6">
                  <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-orange-500" />
                    Current Zone Info
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-3 border-b">
                      <span className="text-slate-600">Zone</span>
                      <span className="font-semibold">Main Entrance</span>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b">
                      <span className="text-slate-600">Crowd Level</span>
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Moderate</Badge>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b">
                      <span className="text-slate-600">Nearest Medical</span>
                      <span className="font-semibold text-green-600">50m North</span>
                    </div>
                    <div className="flex items-center justify-between py-3">
                      <span className="text-slate-600">Security Post</span>
                      <span className="font-semibold text-blue-600">30m East</span>
                    </div>
                  </div>

                  <motion.button
  onClick={handleSOS}
  disabled={sosActive}
  className={`w-full mt-6 ${
    sosActive ? "bg-red-300" : "bg-red-500 hover:bg-red-600"
  } text-white font-bold py-4 rounded-lg flex items-center justify-center gap-2`}
  whileHover={{ scale: sosActive ? 1 : 1.02 }}
  whileTap={{ scale: sosActive ? 1 : 0.98 }}
>
  <AlertCircle className="w-5 h-5" />
  {sosActive ? "Emergency Reported" : "Emergency SOS"}
</motion.button>

                </Card>
              </motion.div>
            </div>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-6">Live Notifications</h3>
              <div className="space-y-4">
                {notifications.map((notif) => (
                  <motion.div
                    key={notif.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg"
                  >
                    <Bell className={`w-5 h-5 ${notif.type === 'warning' ? 'text-yellow-500' : 'text-blue-500'} mt-0.5`} />
                    <div className="flex-1">
                      <p className="text-slate-900">{notif.message}</p>
                      <span className="text-sm text-slate-500">{notif.time}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
