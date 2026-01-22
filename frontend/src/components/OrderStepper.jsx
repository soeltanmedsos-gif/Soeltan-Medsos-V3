import { Check, Clock, Package, X } from 'lucide-react';

export default function OrderStepper({ status }) {
  const steps = [
    { key: 'pending', label: 'Menunggu', icon: Clock },
    { key: 'processing', label: 'Diproses', icon: Package },
    { key: 'completed', label: 'Selesai', icon: Check },
  ];

  // Determine current step index
  let currentStep = 0;
  let isError = false;

  if (status === 'processing') currentStep = 1;
  if (status === 'completed' || status === 'success') currentStep = 2;
  if (['canceled', 'error', 'partial'].includes(status)) {
    isError = true;
    currentStep = 2; // Show as finished state but error
  }

  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between relative">
        {/* Progress Bar Background */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-700 -translate-y-1/2 rounded-full z-0"></div>
        
        {/* Active Progress Bar */}
        <div 
          className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-600 -translate-y-1/2 rounded-full z-0 transition-all duration-500"
          style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        ></div>

        {/* Steps */}
        {steps.map((step, index) => {
          const Icon = isError && index === 2 ? X : step.icon;
          const isActive = index <= currentStep;
          const isCurrent = index === currentStep;

          return (
            <div key={step.key} className="relative z-10 flex flex-col items-center gap-2">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                  isActive 
                    ? isError && index === 2 
                      ? 'bg-red-500 border-red-500 text-white shadow-lg shadow-red-500/30'
                      : 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                    : 'bg-slate-800 border-slate-600 text-slate-500'
                }`}
              >
                <Icon size={18} />
              </div>
              <span className={`text-xs font-semibold ${
                isActive ? 'text-white' : 'text-slate-500'
              }`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
