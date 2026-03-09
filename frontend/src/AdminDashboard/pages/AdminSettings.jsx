import React, { useState } from 'react';
import { 
  FiUser, FiShield, FiSettings, FiSave, 
  FiBell, FiGlobe, FiMail, FiLock 
} from 'react-icons/fi';

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* 1. PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">System Configuration</h1>
          <p className="text-slate-500 text-sm font-medium uppercase tracking-[0.2em] text-[10px] mt-1">
            Manage Admin Identity & Global Parameters
          </p>
        </div>
        <button className="bg-[#007074] text-white px-8 py-3.5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-[#005a5d] shadow-xl shadow-[#007074]/20 transition-all active:scale-95 flex items-center gap-2">
          <FiSave size={16} /> Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* 2. SETTINGS NAVIGATION (Left Sidebar) */}
        <div className="lg:col-span-3 bg-white rounded-[2.5rem] border border-slate-100 p-4 shadow-sm sticky top-24">
           <nav className="space-y-2">
             <SettingTab 
               icon={<FiUser />} label="Admin Profile" 
               isActive={activeTab === 'profile'} onClick={() => setActiveTab('profile')} 
             />
             <SettingTab 
               icon={<FiShield />} label="Security & Access" 
               isActive={activeTab === 'security'} onClick={() => setActiveTab('security')} 
             />
             <SettingTab 
               icon={<FiGlobe />} label="Store Preferences" 
               isActive={activeTab === 'store'} onClick={() => setActiveTab('store')} 
             />
             <SettingTab 
               icon={<FiBell />} label="Notifications" 
               isActive={activeTab === 'notifications'} onClick={() => setActiveTab('notifications')} 
             />
           </nav>
        </div>

        {/* 3. SETTINGS CONTENT AREA (Right Form) */}
        <div className="lg:col-span-9 bg-white rounded-[2.5rem] border border-slate-100 p-8 md:p-12 shadow-sm min-h-[500px]">
           
           {/* TAB: PROFILE */}
           {activeTab === 'profile' && (
             <div className="animate-[slideUp_0.4s_ease-out] space-y-8">
                <div className="flex items-center gap-4 border-b border-slate-50 pb-6">
                   <div className="w-16 h-16 rounded-2xl bg-teal-50 flex items-center justify-center text-[#007074] font-black text-xl shadow-inner">
                      AN
                   </div>
                   <div>
                      <h3 className="text-lg font-bold text-slate-900">Allah Nawaz</h3>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Super Admin • Root Access</p>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <InputField icon={<FiUser />} label="Display Name" defaultValue="Allah Nawaz" />
                   <InputField icon={<FiMail />} label="Admin Email" defaultValue="nawaz51412@gmail.com" />
                   <InputField icon={<FiGlobe />} label="Timezone" defaultValue="Asia/Karachi (PKT)" />
                   <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Admin Role</label>
                     <input type="text" value="Super Administrator" disabled className="w-full bg-slate-100 border-2 border-transparent rounded-2xl py-4 px-6 text-sm font-bold text-slate-400 cursor-not-allowed" />
                   </div>
                </div>
             </div>
           )}

           {/* TAB: SECURITY */}
           {activeTab === 'security' && (
             <div className="animate-[slideUp_0.4s_ease-out] space-y-8">
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-[#007074] border-b border-teal-50 pb-4">Cryptographic Credentials</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="md:col-span-2">
                     <InputField type="password" icon={<FiLock />} label="Current Password" placeholder="••••••••" />
                   </div>
                   <InputField type="password" icon={<FiShield />} label="New Password" placeholder="••••••••" />
                   <InputField type="password" icon={<FiShield />} label="Confirm New Password" placeholder="••••••••" />
                </div>

                <div className="bg-orange-50/50 border border-orange-100 rounded-[2rem] p-6 flex items-start gap-4 mt-8">
                   <FiShield className="text-orange-500 mt-1" size={20} />
                   <div>
                      <h4 className="text-orange-700 font-bold text-sm">Two-Factor Authentication (2FA)</h4>
                      <p className="text-xs text-orange-500/80 font-medium mt-1 mb-4">Add an extra layer of security to your admin account.</p>
                      <button className="px-6 py-2 bg-orange-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-600 transition-colors shadow-md shadow-orange-500/20">Enable 2FA</button>
                   </div>
                </div>
             </div>
           )}

           {/* TAB: STORE PREFERENCES */}
           {activeTab === 'store' && (
             <div className="animate-[slideUp_0.4s_ease-out] space-y-8">
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-[#007074] border-b border-teal-50 pb-4">Global Operations</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <InputField label="Store Name" defaultValue="Stylogist.pk" />
                   <InputField label="Support Email" defaultValue="support@stylogist.pk" />
                   <InputField label="Default Currency" defaultValue="PKR (Rs.)" />
                   <InputField label="Order Prefix" defaultValue="ST-" />
                   <div className="md:col-span-2 space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Store Address (Appears on Invoices)</label>
                     <textarea className="w-full bg-slate-50 border-2 border-transparent rounded-2xl py-4 px-6 text-sm font-bold text-slate-900 outline-none focus:border-[#007074]/20 focus:bg-white transition-all h-24" defaultValue="Commercial Area, Bahawalpur, Punjab, Pakistan"></textarea>
                   </div>
                </div>
             </div>
           )}

           {/* TAB: NOTIFICATIONS */}
           {activeTab === 'notifications' && (
             <div className="animate-[slideUp_0.4s_ease-out] space-y-8">
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-[#007074] border-b border-teal-50 pb-4">System Alerts</h3>
                
                <div className="space-y-4">
                   <ToggleRow title="New Order Alerts" desc="Receive an email when a new COD order is placed." defaultChecked />
                   <ToggleRow title="Low Stock Warnings" desc="Get notified when a product falls below 5 units." defaultChecked />
                   <ToggleRow title="Review Moderation" desc="Alert when a new customer review requires approval." defaultChecked={false} />
                   <ToggleRow title="Security Alerts" desc="Notify on new admin logins from unknown devices." defaultChecked />
                </div>
             </div>
           )}

        </div>
      </div>
    </div>
  );
}

// --- Sub Components ---

function SettingTab({ icon, label, isActive, onClick }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
        isActive 
        ? 'bg-[#007074] text-white shadow-lg shadow-[#007074]/20 translate-x-1' 
        : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900'
      }`}
    >
      <span className="text-lg">{icon}</span>
      {label}
    </button>
  );
}

function InputField({ label, defaultValue, placeholder, type = "text", icon }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">{label}</label>
      <div className="relative group">
        {icon && <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#007074] transition-colors">{icon}</div>}
        <input 
          type={type}
          defaultValue={defaultValue}
          placeholder={placeholder}
          className={`w-full bg-slate-50 border-2 border-transparent rounded-2xl py-4 ${icon ? 'pl-12 pr-6' : 'px-6'} text-sm font-bold text-slate-900 outline-none focus:border-[#007074]/20 focus:bg-white transition-all shadow-sm`}
        />
      </div>
    </div>
  );
}

function ToggleRow({ title, desc, defaultChecked }) {
  const [checked, setChecked] = useState(defaultChecked);
  return (
    <div className="flex items-center justify-between p-6 rounded-[2rem] border border-slate-50 bg-slate-50/30 hover:bg-slate-50 transition-colors">
       <div>
          <h4 className="font-bold text-slate-800 text-sm">{title}</h4>
          <p className="text-xs text-slate-400 font-medium mt-1">{desc}</p>
       </div>
       <div 
         onClick={() => setChecked(!checked)}
         className={`w-14 h-8 rounded-full relative cursor-pointer shadow-inner transition-all duration-300 ${checked ? 'bg-[#007074]' : 'bg-slate-200'}`}
       >
          <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-all duration-300 ${checked ? 'right-1' : 'left-1'}`} />
       </div>
    </div>
  );
}