import re
with open('/Users/sudeepreddy/Documents/otulia/Otulia-Web/client/src/pages/Inventory.jsx', 'r') as f:
    content = f.read()

start_marker = "{/* SUBSCRIPTION TAB */}"
end_marker = "</main >"

start_index = content.find(start_marker)
end_index = content.find(end_marker)

if start_index != -1 and end_index != -1:
    new_content = """{/* SUBSCRIPTION TAB */}
                    {activeTab === 'subscription' && (
                        <div className="space-y-6 animate-in fade-in duration-700 pb-12 max-w-[1200px] mx-auto">
                            
                            <div className="flex justify-between items-end mb-2">
                                <div>
                                    <h2 className="text-[28px] font-bold text-gray-900 font-playfair mb-1 leading-tight">Subscription</h2>
                                </div>
                            </div>
                            
                            {/* Current Plan Block */}
                            <div className="bg-white rounded-[1.5rem] border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.02)] p-8">
                                <div className="flex justify-between items-start mb-8">
                                    <div>
                                        <h3 className="text-[20px] font-bold text-gray-900 font-playfair mb-1">Current Plan</h3>
                                    </div>
                                    <button className="px-5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 bg-white hover:bg-gray-50 flex items-center gap-2 shadow-sm transition-all"><FiCreditCard/> Manage Billing</button>
                                </div>
                                
                                <div className="flex gap-4 items-center mb-2">
                                    <h4 className="text-[24px] font-bold text-gray-900 font-playfair leading-tight">{user?.plan || 'Premium Basic'}</h4>
                                    <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-md text-[10px] font-black uppercase tracking-widest border border-emerald-100 shadow-sm">Active</span>
                                </div>
                                <p className="text-[13px] text-gray-500 font-medium mb-8">You're on the {user?.plan || 'Premium Basic'} plan.</p>
                                
                                <div className="grid grid-cols-4 gap-6">
                                    <div className="flex flex-col gap-1 border-r border-gray-100 pr-6">
                                        <span className="text-[10px] uppercase font-bold text-gray-400 tracking-widest flex items-center gap-1.5"><FiPackage className="text-gray-300"/> Active Listings</span>
                                        <span className="text-[16px] font-bold text-gray-900">{data?.inventory?.length || 1} of {user?.plan === 'Business VIP' ? 50 : user?.plan === 'Basic' ? 5 : 25}</span>
                                    </div>
                                    <div className="flex flex-col gap-1 border-r border-gray-100 pr-6">
                                        <span className="text-[10px] uppercase font-bold text-gray-400 tracking-widest flex items-center gap-1.5"><FiActivity className="text-gray-300"/> Analytics Level</span>
                                        <span className="text-[16px] font-bold text-gray-900">{user?.plan === 'Business VIP' ? 'Full Suite' : 'Advanced'}</span>
                                    </div>
                                    <div className="flex flex-col gap-1 border-r border-gray-100 pr-6">
                                        <span className="text-[10px] uppercase font-bold text-gray-400 tracking-widest flex items-center gap-1.5"><FiMessageSquare className="text-gray-300"/> Support</span>
                                        <span className="text-[16px] font-bold text-gray-900">{user?.plan === 'Business VIP' ? 'Priority Phone & Email' : 'Priority Email'}</span>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[10px] uppercase font-bold text-gray-400 tracking-widest flex items-center gap-1.5"><FiCalendar className="text-gray-300"/> Renewal Date</span>
                                        <span className="text-[16px] font-bold text-gray-900">{companyInfo.planExpiresAt ? new Date(companyInfo.planExpiresAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'May 24, 2026'}</span>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Nav Bar */}
                            <div className="flex gap-2 items-center text-sm font-bold pt-2 pb-6 border-b border-gray-50/50">
                                <button className="px-4 py-2 text-gray-500 hover:text-gray-900 transition-colors">Billing History</button>
                                <button className="px-4 py-2 text-gray-500 hover:text-gray-900 transition-colors">Invoices</button>
                                <button className="px-4 py-2 text-gray-500 hover:text-gray-900 transition-colors">Payment Methods</button>
                                <button className="px-4 py-2 text-[#D48D2A] relative flex justify-center after:absolute after:bottom-[-24px] after:w-full after:h-0.5 after:bg-[#D48D2A]">Update Plan</button>
                                <div className="flex-1"></div>
                                <button className="px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg flex items-center gap-2 transition-colors"><FiX /> Cancel Subscription</button>
                            </div>
                            
                            {/* Available Plans */}
                            <div className="pt-2">
                                <div className="flex justify-between items-center mb-8">
                                    <h3 className="text-[20px] font-bold text-gray-900 font-playfair">Available Plans</h3>
                                    <div className="bg-gray-100 p-1 rounded-xl flex shadow-inner">
                                        <button className="px-6 py-2 rounded-lg text-[11px] font-bold bg-white text-gray-900 shadow-sm uppercase tracking-widest transition-colors">Monthly</button>
                                        <button className="px-6 py-2 rounded-lg text-[11px] font-bold text-gray-500 hover:text-gray-900 uppercase tracking-widest transition-colors flex items-center gap-2">Yearly <span className="bg-[#D48D2A] text-white px-2 py-0.5 rounded text-[8px]">SAVE 20%</span></button>
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-3 gap-6">
                                    {/* Premium Basic Plan */}
                                    <div className={`p-8 rounded-[1.5rem] border-2 flex flex-col transition-all ${(user?.plan || 'Premium Basic') === 'Premium Basic' ? 'bg-[#FFF8F0]/30 border-[#D48D2A]/30 relative' : 'bg-white border-gray-100 hover:border-[#D48D2A]/30'}`}>
                                        {(user?.plan || 'Premium Basic') === 'Premium Basic' && (
                                            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                                <span className="px-4 py-1.5 bg-gray-900 text-white text-[9px] font-black uppercase tracking-widest rounded shadow-md">Current Plan</span>
                                            </div>
                                        )}
                                        <h4 className="text-[22px] font-bold text-gray-900 font-playfair mb-1">Premium Basic</h4>
                                        <div className="flex items-baseline gap-1 py-4">
                                            <span className="text-[40px] font-black text-gray-900 leading-none tracking-tight">$99</span>
                                            <span className="text-[12px] font-bold text-gray-400">/mo</span>
                                        </div>
                                        <ul className="space-y-4 mb-8 flex-1 mt-4">
                                            {['25 Active Listings', 'Advanced Analytics', 'Priority Email Support', 'Enhanced Visibility', 'Lead Management'].map((f, i) => (
                                                <li key={i} className="flex items-start gap-3 text-[13px] font-bold text-gray-600">
                                                    <FiCheckCircle className="text-emerald-500 shrink-0 mt-0.5" /> <span>{f}</span>
                                                </li>
                                            ))}
                                        </ul>
                                        {(user?.plan || 'Premium Basic') === 'Premium Basic' ? <button disabled className="w-full py-3.5 bg-[#FFF8F0] border border-[#F2E8DB] text-[#D48D2A] rounded-xl font-bold text-xs uppercase tracking-widest shadow-sm">Current Plan</button> : <button className="w-full py-3.5 bg-white border border-gray-200 text-gray-900 rounded-xl font-bold text-xs hover:border-[#D48D2A] transition-colors uppercase tracking-widest">Select Plan</button>}
                                    </div>
                                    
                                    {/* Business VIP Plan */}
                                    <div className={`p-8 rounded-[1.5rem] flex flex-col relative transition-all border-2 text-white bg-gray-900 ${(user?.plan || 'Premium Basic') === 'Business VIP' ? 'border-[#D48D2A]' : 'border-gray-900 shadow-xl shadow-gray-900/10 hover:-translate-y-1'}`}>
                                        <div className="absolute top-0 right-0 w-48 h-48 bg-[#D48D2A]/20 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
                                        {(user?.plan || 'Premium Basic') === 'Business VIP' && (
                                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                                                <span className="px-4 py-1.5 bg-[#D48D2A] text-white text-[9px] font-black uppercase tracking-widest rounded shadow-md">Current Plan</span>
                                            </div>
                                        )}
                                        <h4 className="text-[22px] font-bold text-white font-playfair mb-1 relative z-10">Business VIP</h4>
                                        <div className="flex items-baseline gap-1 py-4 relative z-10">
                                            <span className="text-[40px] font-black text-white leading-none tracking-tight">$299</span>
                                            <span className="text-[12px] font-bold text-white/50">/mo</span>
                                        </div>
                                        <ul className="space-y-4 mb-8 flex-1 mt-4 relative z-10">
                                            {['50 Active Listings', 'Full Analytics Suite', 'Priority Phone & Email Support', 'Premium Visibility', 'Lead Scoring', 'Dedicated Account Manager'].map((f, i) => (
                                                <li key={i} className="flex items-start gap-3 text-[13px] font-bold text-white/90">
                                                    <FiCheckCircle className="text-[#D48D2A] shrink-0 mt-0.5" /> <span>{f}</span>
                                                </li>
                                            ))}
                                        </ul>
                                        {(user?.plan || 'Premium Basic') === 'Business VIP' ? <button disabled className="w-full py-3.5 bg-white/10 text-white rounded-xl font-bold text-xs uppercase tracking-widest relative z-10">Current Plan</button> : <button className="w-full py-3.5 bg-[#D48D2A] text-white rounded-xl font-bold text-xs hover:bg-[#b5751c] transition-colors shadow-[0_4px_15px_rgba(212,141,42,0.3)] uppercase tracking-widest relative z-10">Upgrade to Business VIP</button>}
                                    </div>
                                    
                                    {/* Enterprise Elite Plan */}
                                    <div className="p-8 rounded-[1.5rem] bg-white border-2 border-gray-100 flex flex-col hover:border-[#D48D2A]/30 transition-all">
                                        <h4 className="text-[22px] font-bold text-gray-900 font-playfair mb-1">Enterprise Elite</h4>
                                        <div className="flex items-baseline gap-1 py-4">
                                            <span className="text-[40px] font-black text-gray-900 leading-none tracking-tight">$599</span>
                                            <span className="text-[12px] font-bold text-gray-400">/mo</span>
                                        </div>
                                        <ul className="space-y-4 mb-8 flex-1 mt-4">
                                            {['Unlimited Listings', 'Custom API Integrations', '24/7 Dedicated Support', 'White-labeled Dashboards', 'Multi-location Management', 'Custom Contract Terms'].map((f, i) => (
                                                <li key={i} className="flex items-start gap-3 text-[13px] font-bold text-gray-600">
                                                    <FiCheckCircle className="text-emerald-500 shrink-0 mt-0.5" /> <span>{f}</span>
                                                </li>
                                            ))}
                                        </ul>
                                        <button className="w-full py-3.5 bg-white border border-gray-200 text-gray-900 rounded-xl font-bold text-xs hover:border-[#D48D2A] transition-colors uppercase tracking-widest">Contact Sales</button>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Bottom Upsell / Footer */}
                            <div className="bg-[#FFF8F0] border border-[#F2E8DB] rounded-[1.5rem] p-8 flex justify-between items-center mt-6">
                                <div className="flex flex-col gap-1">
                                    <h4 className="text-[16px] font-bold text-gray-900 font-playfair">Need more listings or custom features?</h4>
                                    <p className="text-[13px] text-gray-500 font-medium">Get in touch with our sales team to discuss how Otulia can scale with your business.</p>
                                </div>
                                <button className="px-6 py-3 bg-white border border-gray-200 text-gray-900 rounded-xl font-bold text-xs shadow-sm hover:border-[#D48D2A] hover:text-[#D48D2A] transition-all flex items-center gap-2">Contact Enterprise Sales <FiArrowRight/></button>
                            </div>
                            
                        </div>
                    )}

                </main >"""

    content = content[:start_index] + new_content + content[end_index+len(end_marker):]

    with open('/Users/sudeepreddy/Documents/otulia/Otulia-Web/client/src/pages/Inventory.jsx', 'w') as f:
        f.write(content)
        print("Success")
else:
    if start_index == -1: print("Start marker not found")
    if end_index == -1: print("End marker not found")

