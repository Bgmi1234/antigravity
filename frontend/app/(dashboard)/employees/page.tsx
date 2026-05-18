"use client";

import { useEffect, useState } from "react";
import { 
  Employee, 
  getEmployees, 
  deleteEmployee, 
  createEmployee, 
  updateEmployee 
} from "@/services/api";
import { EmployeeCard } from "@/components/employees/employee-card";
import { 
  Search, 
  Filter, 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  AlertTriangle, 
  Terminal, 
  X, 
  Loader2, 
  Settings, 
  Zap 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function EmployeesList() {
  const [role, setRole] = useState<"admin" | "user">("admin");

  useEffect(() => {
    const savedRole = localStorage.getItem("emplod_role") as "admin" | "user" | null;
    if (savedRole) {
      setRole(savedRole);
    }

    const handleRoleChange = () => {
      const updatedRole = localStorage.getItem("emplod_role") as "admin" | "user" | null;
      if (updatedRole) {
        setRole(updatedRole);
      }
    };
    window.addEventListener("role-change", handleRoleChange);
    return () => window.removeEventListener("role-change", handleRoleChange);
  }, []);

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Search, Filter, Pagination
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All");
  const [page, setPage] = useState(1);
  const limit = 6; // low limit for pagination testing

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    department: "Engineering",
    productivity: 80,
    status: "Active",
    avatar: "",
    goal: "",
    tools: "",
    approval_rules: ""
  });

  const fetchEmployees = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const skip = (page - 1) * limit;
      const data = await getEmployees(search, department, skip, limit);
      setEmployees(data);
    } catch (err: any) {
      setError(err.message || "Failed to load employees.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1); // Reset page on new search/filter
      fetchEmployees();
    }, 300);
    return () => clearTimeout(timer);
  }, [search, department]);

  useEffect(() => {
    fetchEmployees();
  }, [page]);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to terminate this operator node?")) return;
    
    // Optimistic UI update
    const previousEmployees = [...employees];
    setEmployees(employees.filter(e => e.id !== id));
    
    try {
      await deleteEmployee(id);
    } catch (err: any) {
      // Revert on failure
      setEmployees(previousEmployees);
      alert(err.message || "Failed to delete employee");
    }
  };

  // Open Create Modal
  const handleOpenCreate = () => {
    setFormData({
      name: "",
      role: "",
      department: "Engineering",
      productivity: 100,
      status: "Active",
      avatar: "",
      goal: "",
      tools: "",
      approval_rules: ""
    });
    setModalError(null);
    setIsCreateOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    setFormData({
      name: employee.name || "",
      role: employee.role || "",
      department: employee.department || "Engineering",
      productivity: employee.productivity ?? 100,
      status: employee.status || "Active",
      avatar: employee.avatar || "",
      goal: employee.goal || "",
      tools: employee.tools || "",
      approval_rules: employee.approval_rules || ""
    });
    setModalError(null);
    setIsEditOpen(true);
  };

  // Handle Form Input Changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "productivity" ? parseInt(value) || 0 : value
    }));
  };

  // Create Employee
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setModalError("Operator name is required.");
      return;
    }

    setModalLoading(true);
    setModalError(null);
    try {
      const newEmp = await createEmployee(formData);
      setEmployees(prev => [newEmp, ...prev]);
      setIsCreateOpen(false);
    } catch (err: any) {
      setModalError(err.message || "Failed to deploy operator node.");
    } finally {
      setModalLoading(false);
    }
  };

  // Edit Employee
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEmployee) return;
    if (!formData.name.trim()) {
      setModalError("Operator name is required.");
      return;
    }

    setModalLoading(true);
    setModalError(null);
    try {
      const updatedEmp = await updateEmployee(editingEmployee.id, formData);
      setEmployees(prev => prev.map(emp => emp.id === editingEmployee.id ? updatedEmp : emp));
      setIsEditOpen(false);
      setEditingEmployee(null);
    } catch (err: any) {
      setModalError(err.message || "Failed to update operator node config.");
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12 px-4 md:px-0 text-slate-800">
      
      {/* Top Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-pixel text-slate-850 tracking-tight uppercase">Network Nodes</h1>
          <p className="text-slate-500 mt-2 font-mono text-xs uppercase tracking-widest font-bold">Manage autonomous workforce operators.</p>
        </div>
        {role === "admin" && (
          <button 
            onClick={handleOpenCreate}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-bold transition-all flex items-center justify-center gap-2 font-mono text-xs uppercase tracking-wider cursor-pointer shadow-md shadow-indigo-100 border-transparent"
          >
            <Plus className="w-4 h-4 text-white" />
            Deploy Node
          </button>
        )}
      </div>

      {/* Controls Bar */}
      <div className="bg-white/80 p-4 rounded-xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row gap-4 relative z-10">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search identity, tags, or operational role..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 pl-9 pr-4 text-xs text-slate-850 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-all font-mono shadow-inner"
          />
        </div>
        <div className="relative w-full sm:w-48">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <select 
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 pl-9 pr-4 text-xs text-slate-850 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-all font-mono cursor-pointer"
          >
            <option value="All">All Sectors</option>
            <option value="Engineering">Engineering</option>
            <option value="Marketing">Marketing</option>
            <option value="Operations">Operations</option>
            <option value="Finance">Finance</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-600 px-4 py-3 rounded-xl flex items-center gap-3 font-mono text-xs font-bold shadow-sm">
          <AlertTriangle className="w-5 h-5 text-rose-550" />
          <span>SYS_ERROR: {error}</span>
          <button onClick={() => fetchEmployees()} className="ml-auto underline font-bold hover:text-rose-700 cursor-pointer">RETRY</button>
        </div>
      )}

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-white/50 border border-slate-200 rounded-2xl h-64 animate-pulse" />
          ))}
        </div>
      ) : employees.length === 0 ? (
        <div className="bg-white/50 rounded-2xl p-16 text-center border-2 border-dashed border-slate-250">
          <Terminal className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold font-sans text-slate-850 mb-2">0 NODES ACTIVE</h3>
          <p className="text-slate-500 font-mono text-xs max-w-md mx-auto mb-6 uppercase tracking-widest font-bold">No active nodes match the specified core filter parameters.</p>
          {search || department !== 'All' ? (
            <button onClick={() => { setSearch(''); setDepartment('All'); }} className="text-indigo-650 hover:text-indigo-850 font-mono text-xs font-bold underline cursor-pointer">
              Clear Filters
            </button>
          ) : (
            <button onClick={handleOpenCreate} className="text-indigo-650 hover:text-indigo-850 font-mono text-xs font-bold underline cursor-pointer">
              Deploy your first node
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {employees.map((employee, i) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                  transition={{ delay: i * 0.05 }}
                  key={employee.id}
                  className="relative group"
                >
                  {role === "admin" && (
                    <button 
                      onClick={() => handleDelete(employee.id)}
                      className="absolute -top-2.5 -right-2.5 w-7 h-7 bg-white border border-rose-200 text-rose-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20 hover:bg-rose-50 hover:text-rose-700 cursor-pointer shadow-md font-mono text-sm font-bold"
                      title="Terminate Node"
                    >
                      ×
                    </button>
                  )}
                  <EmployeeCard employee={employee} onEdit={handleOpenEdit} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between bg-white/80 p-4 rounded-xl border border-slate-200/80 shadow-sm relative z-10">
            <p className="text-xs font-mono text-slate-500 font-semibold">
              Showing {(page - 1) * limit + 1} to {(page - 1) * limit + employees.length} nodes
            </p>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-650 hover:bg-slate-100 disabled:opacity-50 transition-colors cursor-pointer disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-mono text-xs font-bold text-indigo-650 w-8 text-center">{page}</span>
              <button 
                onClick={() => setPage(p => p + 1)}
                disabled={employees.length < limit}
                className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-650 hover:bg-slate-100 disabled:opacity-50 transition-colors cursor-pointer disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </>
      )}

      {/* --- CREATE NODE MODAL --- */}
      <AnimatePresence>
        {isCreateOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-2xl rounded-2xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col relative"
            >
              {/* Top Accent line */}
              <div className="h-1.5 bg-indigo-600 w-full absolute top-0 left-0" />
              
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center mt-1.5">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-indigo-500" />
                  <h3 className="font-bold text-slate-800 font-pixel text-[11px] uppercase tracking-wide">Deploy Operator Node</h3>
                </div>
                <button onClick={() => setIsCreateOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto font-mono text-xs">
                {modalError && (
                  <div className="bg-rose-50 border border-rose-200 text-rose-600 p-3 rounded-lg text-xs font-mono flex items-center gap-2 font-bold shadow-inner">
                    <AlertTriangle className="w-4 h-4 text-rose-500" />
                    <span>ERR: {modalError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] font-mono uppercase text-slate-400 mb-1.5 font-bold">Operator Name *</label>
                    <input 
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g. SKY-01 or Alex"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-colors font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-mono uppercase text-slate-400 mb-1.5 font-bold">Role / Function</label>
                    <input 
                      type="text"
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      placeholder="e.g. Lead QA Agent"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-colors font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[9px] font-mono uppercase text-slate-400 mb-1.5 font-bold">Sector / Sector</label>
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-colors font-mono cursor-pointer"
                    >
                      <option value="Engineering">Engineering</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Operations">Operations</option>
                      <option value="Finance">Finance</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[9px] font-mono uppercase text-slate-400 mb-1.5 font-bold">Initial Productivity (%)</label>
                    <input 
                      type="number"
                      name="productivity"
                      min="0"
                      max="100"
                      value={formData.productivity}
                      onChange={handleInputChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-colors font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-mono uppercase text-slate-400 mb-1.5 font-bold">Status</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-colors font-mono cursor-pointer"
                    >
                      <option value="Active">Active (Online)</option>
                      <option value="Training">Training</option>
                      <option value="Offline">Offline</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] font-mono uppercase text-slate-400 mb-1.5 font-bold">Avatar URL</label>
                  <input 
                    type="text"
                    name="avatar"
                    value={formData.avatar}
                    onChange={handleInputChange}
                    placeholder="https://example.com/avatar.png"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-colors font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-mono uppercase text-slate-400 mb-1.5 font-bold">Core Objective / Goal</label>
                  <textarea 
                    name="goal"
                    rows={2}
                    value={formData.goal}
                    onChange={handleInputChange}
                    placeholder="Provide primary directives for model logic..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-colors font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-mono uppercase text-slate-400 mb-1.5 font-bold">Allocated API Tools (JSON Array format)</label>
                  <input 
                    type="text"
                    name="tools"
                    value={formData.tools}
                    onChange={handleInputChange}
                    placeholder='e.g. ["web-scrape", "postgres-write"]'
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-colors font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-mono uppercase text-slate-400 mb-1.5 font-bold">Compliance / Approval Gates</label>
                  <input 
                    type="text"
                    name="approval_rules"
                    value={formData.approval_rules}
                    onChange={handleInputChange}
                    placeholder="e.g. Require admin check before Supabase updates"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-colors font-mono"
                  />
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end gap-3 mt-4">
                  <button 
                    type="button" 
                    onClick={() => setIsCreateOpen(false)}
                    className="px-4 py-2.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={modalLoading}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-6 rounded-lg transition-all flex items-center gap-2 shadow-md shadow-indigo-100 disabled:opacity-50 cursor-pointer border-transparent"
                  >
                    {modalLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                        <span>Deploying...</span>
                      </>
                    ) : (
                      <span>Deploy Node</span>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- EDIT NODE CONFIG MODAL --- */}
      <AnimatePresence>
        {isEditOpen && editingEmployee && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-2xl rounded-2xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col relative"
            >
              {/* Top Accent line */}
              <div className="h-1.5 bg-indigo-600 w-full absolute top-0 left-0" />
              
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center mt-1.5">
                <div className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-indigo-500" />
                  <h3 className="font-bold text-slate-800 font-pixel text-[11px] uppercase tracking-wide">Configure: {editingEmployee.name}</h3>
                </div>
                <button onClick={() => { setIsEditOpen(false); setEditingEmployee(null); }} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleEditSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto font-mono text-xs">
                {modalError && (
                  <div className="bg-rose-50 border border-rose-200 text-rose-600 p-3 rounded-lg text-xs font-mono flex items-center gap-2 font-bold shadow-inner">
                    <AlertTriangle className="w-4 h-4 text-rose-500" />
                    <span>ERR: {modalError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] font-mono uppercase text-slate-400 mb-1.5 font-bold">Operator Name *</label>
                    <input 
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g. SKY-01 or Alex"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-colors font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-mono uppercase text-slate-400 mb-1.5 font-bold">Role / Function</label>
                    <input 
                      type="text"
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      placeholder="e.g. Lead QA Agent"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-colors font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[9px] font-mono uppercase text-slate-400 mb-1.5 font-bold">Sector / Sector</label>
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-colors font-mono cursor-pointer"
                    >
                      <option value="Engineering">Engineering</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Operations">Operations</option>
                      <option value="Finance">Finance</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[9px] font-mono uppercase text-slate-400 mb-1.5 font-bold">Node Productivity (%)</label>
                    <input 
                      type="number"
                      name="productivity"
                      min="0"
                      max="100"
                      value={formData.productivity}
                      onChange={handleInputChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-colors font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-mono uppercase text-slate-400 mb-1.5 font-bold">Status</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-colors font-mono cursor-pointer"
                    >
                      <option value="Active">Active (Online)</option>
                      <option value="Training">Training</option>
                      <option value="Offline">Offline</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] font-mono uppercase text-slate-400 mb-1.5 font-bold">Avatar URL</label>
                  <input 
                    type="text"
                    name="avatar"
                    value={formData.avatar}
                    onChange={handleInputChange}
                    placeholder="https://example.com/avatar.png"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-colors font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-mono uppercase text-slate-400 mb-1.5 font-bold">Core Objective / Goal</label>
                  <textarea 
                    name="goal"
                    rows={2}
                    value={formData.goal}
                    onChange={handleInputChange}
                    placeholder="Provide primary directives for model logic..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-colors font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-mono uppercase text-slate-400 mb-1.5 font-bold">Allocated API Tools (JSON Array format)</label>
                  <input 
                    type="text"
                    name="tools"
                    value={formData.tools}
                    onChange={handleInputChange}
                    placeholder='e.g. ["web-scrape", "postgres-write"]'
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-colors font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-mono uppercase text-slate-400 mb-1.5 font-bold">Compliance / Approval Gates</label>
                  <input 
                    type="text"
                    name="approval_rules"
                    value={formData.approval_rules}
                    onChange={handleInputChange}
                    placeholder="e.g. Require admin check before Supabase updates"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-colors font-mono"
                  />
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end gap-3 mt-4">
                  <button 
                    type="button" 
                    onClick={() => { setIsEditOpen(false); setEditingEmployee(null); }}
                    className="px-4 py-2.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={modalLoading}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-6 rounded-lg transition-all flex items-center gap-2 shadow-md shadow-indigo-100 disabled:opacity-50 cursor-pointer border-transparent"
                  >
                    {modalLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                        <span>Saving Changes...</span>
                      </>
                    ) : (
                      <span>Save Config</span>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
