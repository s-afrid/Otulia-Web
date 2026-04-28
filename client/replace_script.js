const fs = require('fs');
const path = '/Users/sudeepreddy/Documents/otulia/Otulia-Web/client/src/pages/Inventory.jsx';
let content = fs.readFileSync(path, 'utf8');

const startTag = "{/* INVENTORY TAB */}";
const endTag = "{/* LEADS TAB */}";

const startIndex = content.indexOf(startTag);
const endIndex = content.indexOf(endTag);

if (startIndex !== -1 && endIndex !== -1) {
    const replacement = `{/* INVENTORY TAB */}
                    {activeTab === 'inventory' && (
                        <div className="space-y-6 animate-in fade-in duration-500">
                            {/* Control Bar */}
                            <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm mb-6">
                                <div className="flex flex-1 items-center gap-3 w-full md:w-auto">
                                    <div className="relative flex-1 md:max-w-xs">
                                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input type="text" placeholder="Search assets..." className="w-full bg-gray-50 border-transparent rounded-[1.25rem] py-3 pl-11 pr-4 text-sm font-medium text-gray-900 focus:bg-white focus:border-[#D48D2A] focus:ring-0 transition-all outline-none shadow-inner" />
                                    </div>
                                    <div className="relative">
                                        <select
                                            value={inventoryCategoryFilter}
                                            onChange={(e) => setInventoryCategoryFilter(e.target.value)}
                                            className="appearance-none bg-gray-50 border-transparent rounded-[1.25rem] py-3 pl-5 pr-10 text-sm font-bold text-gray-600 focus:bg-white focus:border-[#D48D2A] cursor-pointer outline-none transition-all shadow-inner"
                                        >
                                            <option>All Categories</option>
                                            <option>Cars</option>
                                            <option>Yachts</option>
                                            <option>Real Estate</option>
                                            <option>Bikes</option>
                                        </select>
                                        <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                    </div>
                                    <div className="relative">
                                        <select
                                            value={inventoryStatusFilter}
                                            onChange={(e) => setInventoryStatusFilter(e.target.value)}
                                            className="appearance-none bg-gray-50 border-transparent rounded-[1.25rem] py-3 pl-5 pr-10 text-sm font-bold text-gray-600 focus:bg-white focus:border-[#D48D2A] cursor-pointer outline-none transition-all shadow-inner"
                                        >
                                            <option>All Status</option>
                                            <option>Active</option>
                                            <option>Draft</option>
                                            <option>Sold</option>
                                        </select>
                                        <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>

                                <button
                                    onClick={() => {
                                        const limit = user?.plan === 'Business VIP' ? 50 : user?.plan === 'Premium Basic' ? 25 : 5;
                                        if (isVerifiedDealer) {
                                            if ((data?.inventory?.length || 0) >= limit) {
                                                alert(\`You have reached your limit of \${limit} listings. Please upgrade your plan.\`);
                                                return;
                                            }
                                            setIsAddModalOpen(true);
                                        } else {
                                            if (user?.verificationStatus === 'Pending') {
                                                alert("Your dealer verification is currently pending approval. You will be notified once approved.");
                                            } else if (user?.verificationStatus === 'Rejected') {
                                                alert("Your previous verification documents were rejected. Please re-submit valid documents.");
                                                setIsVerificationModalOpen(true);
                                            } else {
                                                alert("Please complete dealer verification to start listing assets.");
                                                setIsVerificationModalOpen(true);
                                            }
                                        }
                                    }}
                                    className={\`px-6 py-3 rounded-xl flex items-center gap-2 font-bold text-sm transition-all whitespace-nowrap \${isVerifiedDealer
                                        ? 'bg-gray-900 text-white hover:bg-black shadow-md'
                                        : 'bg-gray-200 text-gray-500 cursor-not-allowed hover:bg-gray-300'
                                        }\`}
                                >
                                    <FiPlus className="text-base" /> Add New Asset
                                    {!isVerifiedDealer && <FiLock className="text-xs ml-1" />}
                                </button>
                            </div>

                            {/* Asset Cards Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {data.inventory.filter(item => {
                                    const matchesCategory = inventoryCategoryFilter === 'All Categories' ||
                                        ((item.category === 'CarAsset' || item.category === 'vehicles') && inventoryCategoryFilter === 'Cars') ||
                                        ((item.category === 'YachtAsset' || item.category === 'yachts') && inventoryCategoryFilter === 'Yachts') ||
                                        ((item.category === 'EstateAsset' || item.category === 'estates') && inventoryCategoryFilter === 'Real Estate') ||
                                        ((item.category === 'BikeAsset' || item.category === 'bikes') && inventoryCategoryFilter === 'Bikes');

                                    const matchesStatus = inventoryStatusFilter === 'All Status' ||
                                        (inventoryStatusFilter === 'Active' && item.status === 'Active') ||
                                        item.status === inventoryStatusFilter;

                                    return matchesCategory && matchesStatus;
                                }).map((item) => {
                                    const categoryName = (item.category === 'CarAsset' || item.category === 'vehicles') ? 'CARS' :
                                        (item.category === 'YachtAsset' || item.category === 'yachts') ? 'YACHTS' :
                                        (item.category === 'BikeAsset' || item.category === 'bikes') ? 'BIKES' :
                                            (item.category === 'EstateAsset' || item.category === 'estates') ? 'REAL ESTATE' :
                                                item.category?.replace('Asset', 'S')?.toUpperCase();

                                    return (
                                        <div key={item.id} className="bg-white rounded-[2rem] border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.03)] overflow-hidden group hover:border-[#D48D2A]/30 transition-all flex flex-col">
                                            {/* Card Image Header */}
                                            <div className="relative h-48 bg-gray-100 w-full overflow-hidden">
                                                <img src={item.images?.[0] || '/assets/placeholder.jpg'} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={item.title} />
                                                <div className="absolute top-4 left-4">
                                                    <span className="bg-black text-white px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest">{item.type || 'SALE'}</span>
                                                </div>
                                                <div className="absolute top-4 right-4 flex gap-2">
                                                    <button className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-gray-900 hover:bg-white transition-colors shadow-sm">
                                                        <FiMoreVertical className="text-sm" />
                                                    </button>
                                                </div>
                                            </div>
                                            
                                            {/* Card Body */}
                                            <div className="p-6 flex-1 flex flex-col">
                                                <p className="text-[10px] text-[#D48D2A] uppercase font-black tracking-widest mb-1">{categoryName}</p>
                                                <h3 className="text-xl font-bold text-gray-900 mb-2 truncate font-playfair">{item.title}</h3>
                                                <div className="flex justify-between items-end mb-5">
                                                    <p className="text-xl font-black text-gray-900">${numberWithCommas(item.price)}</p>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Est. Value</p>
                                                </div>
                                                
                                                <div className="border-t border-gray-100/80 py-4 flex items-center justify-between">
                                                    <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full shadow-inner">
                                                        <div className={\`w-2 h-2 rounded-full \${item.status === 'Active' ? 'bg-emerald-500' : 'bg-gray-400'}\`}></div>
                                                        <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest">{item.status === 'Active' ? 'Live' : item.status}</span>
                                                    </div>
                                                    <div className="flex items-center gap-3 text-gray-400 text-xs font-bold">
                                                        <span className="flex items-center gap-1.5"><FiEye className="text-[#D48D2A]" /> {item.views || 0}</span>
                                                        <span className="flex items-center gap-1.5"><FiUsers className="text-[#D48D2A]" /> {item.leads || 0}</span>
                                                    </div>
                                                </div>
                                                
                                                <div className="border-t border-gray-100/80 py-4 flex items-center justify-between mt-auto">
                                                    <div className="flex items-center gap-2 text-xs font-bold text-gray-900">
                                                        Public <FiActivity className="inline text-gray-400 ml-0.5" />
                                                    </div>
                                                    <div
                                                        onClick={() => handleTogglePublic(item)}
                                                        className={\`w-11 h-6 rounded-full relative cursor-pointer transition-colors duration-300 \${item.status === 'Active' ? 'bg-emerald-500 border border-emerald-600' : 'bg-gray-200 border border-gray-300'}\`}
                                                    >
                                                        {updatingId === item.id ? (
                                                            <div className="absolute inset-0 flex items-center justify-center">
                                                                <div className="w-2.5 h-2.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                            </div>
                                                        ) : (
                                                            <div className={\`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-md transition-all duration-300 \${item.status === 'Active' ? 'left-6' : 'left-0.5'}\`}></div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="border-t border-gray-100/80 pt-4 flex items-center justify-between gap-4">
                                                    <button onClick={() => { setEditingItem(item); setIsAddModalOpen(true); }} className="flex-1 flex items-center justify-center gap-2 text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors py-2 bg-gray-50 hover:bg-gray-100 rounded-xl">
                                                        <FiEdit2 /> Edit
                                                    </button>
                                                    <button onClick={() => confirmDelete(item.id)} className="flex-1 flex items-center justify-center gap-2 text-xs font-bold text-gray-500 hover:text-red-500 transition-colors py-2 bg-gray-50 hover:bg-red-50 rounded-xl">
                                                        <FiTrash2 /> Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Pagination */}
                            <div className="flex justify-center items-center py-8 mt-8 border-t border-gray-100">
                                <div className="flex items-center gap-2">
                                    <button className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-900 bg-white shadow-sm border border-gray-200 font-bold transition-colors">1</button>
                                    <span className="text-gray-400 font-bold px-2">...</span>
                                    <button className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-white hover:shadow-sm border border-transparent font-bold transition-all">6</button>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    `;
    
    const newContent = content.substring(0, startIndex) + replacement + content.substring(endIndex);
    fs.writeFileSync(path, newContent, 'utf8');
    console.log("Successfully replaced INVENTORY TAB");
} else {
    console.log("Could not find start or end tags");
}
