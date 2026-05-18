"use client";

export interface AIEmployee {
  role: string;
  status: "Waiting" | "Walking" | "Planning" | "Working" | "Done";
  color: string;
  progress: number; // 0 to 100
}

export default function EmployeeStatusPanel({ employees }: { employees: AIEmployee[] }) {
  return (
    <div className="bg-[#111827] border border-gray-800 rounded-xl p-4 shadow-2xl flex flex-col h-full overflow-hidden">
      <h2 className="text-gray-400 font-mono text-xs tracking-wider uppercase mb-4 border-b border-gray-800 pb-2">Active Agents</h2>
      
      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {employees.map((emp) => (
          <div key={emp.role} className="bg-gray-900/50 rounded-lg p-3 border border-gray-800/50">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: emp.color, boxShadow: `0 0 8px ${emp.color}` }}></span>
                <span className="text-white font-medium text-sm">{emp.role}</span>
              </div>
              <span className={`text-xs font-mono px-2 py-0.5 rounded-full ${
                emp.status === "Done" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" :
                emp.status === "Working" || emp.status === "Planning" ? "bg-blue-500/20 text-blue-400 border border-blue-500/30 animate-pulse" :
                emp.status === "Walking" ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" :
                "bg-gray-700/30 text-gray-400 border border-gray-700/50"
              }`}>
                {emp.status}
              </span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-800 rounded-full h-1.5 mt-2 overflow-hidden">
              <div 
                className="h-1.5 rounded-full transition-all duration-300 ease-out"
                style={{ 
                  width: `${emp.progress}%`,
                  backgroundColor: emp.color,
                  boxShadow: `0 0 10px ${emp.color}`
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
