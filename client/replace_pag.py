import re
with open('/Users/sudeepreddy/Documents/otulia/Otulia-Web/client/src/pages/Inventory.jsx', 'r') as f:
    content = f.read()

state_add = """    const [inventoryCategoryFilter, setInventoryCategoryFilter] = useState('All Categories');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);"""
content = content.replace("    const [inventoryCategoryFilter, setInventoryCategoryFilter] = useState('All Categories');", state_add)

# Find the start of the mapping for inventory tab:
# "{(data.inventory || []).filter(item => {"
search_filter = r"\{\(data\.inventory\s*\|\|\s*\[\]\)\.filter\(\s*item\s*=>\s*\{.*?\n.*?return matchesCategory && matchesStatus;\n\s*\}\)\.map\(\(item\)\s*=>\s*\{"

def get_paginated_array():
    return """
                                { (() => {
                                    const filtered = (data.inventory || []).filter(item => {
                                        const matchesCategory = inventoryCategoryFilter === 'All Categories' ||
                                            ((item.category === 'CarAsset' || item.category === 'vehicles') && inventoryCategoryFilter === 'Cars') ||
                                            ((item.category === 'YachtAsset' || item.category === 'yachts') && inventoryCategoryFilter === 'Yachts') ||
                                            ((item.category === 'EstateAsset' || item.category === 'estates') && inventoryCategoryFilter === 'Real Estate') ||
                                            ((item.category === 'BikeAsset' || item.category === 'bikes') && inventoryCategoryFilter === 'Bikes');
        
                                        const matchesStatus = inventoryStatusFilter === 'All Status' ||
                                            (inventoryStatusFilter === 'Active' && item.status === 'Active') ||
                                            item.status === inventoryStatusFilter;
        
                                        return matchesCategory && matchesStatus;
                                    });
                                    const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
                                    return paginated.map((item) => {
"""

content = re.sub(search_filter, get_paginated_array().strip(), content, flags=re.DOTALL)

# Replace the closing tag for the grid and the pagination html
search_pagination = r"\}\)\}\n\s*</div >\n\s*<!-- Pagination \(Visual Only\) -->\s*.*?</div>\n\s*</div >\n\s*\)\}\n\s*<!-- LEADS TAB -->"

# Wait, let's use string.find for the pagination block
target_pag_start = "{/* Pagination (Visual Only) */}"
target_pag_end = "{/* LEADS TAB */}"
idx_start = content.find(target_pag_start)
idx_end = content.find(target_pag_end)

if idx_start != -1 and idx_end != -1:
    pag_ui = """{/* Dynamic Pagination */}
                            {(() => {
                                const filtered = (data.inventory || []).filter(item => {
                                    const matchesCategory = inventoryCategoryFilter === 'All Categories' ||
                                        ((item.category === 'CarAsset' || item.category === 'vehicles') && inventoryCategoryFilter === 'Cars') ||
                                        ((item.category === 'YachtAsset' || item.category === 'yachts') && inventoryCategoryFilter === 'Yachts') ||
                                        ((item.category === 'EstateAsset' || item.category === 'estates') && inventoryCategoryFilter === 'Real Estate') ||
                                        ((item.category === 'BikeAsset' || item.category === 'bikes') && inventoryCategoryFilter === 'Bikes');
    
                                    const matchesStatus = inventoryStatusFilter === 'All Status' ||
                                        (inventoryStatusFilter === 'Active' && item.status === 'Active') ||
                                        item.status === inventoryStatusFilter;
    
                                    return matchesCategory && matchesStatus;
                                });
                                const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
                                
                                return (
                                    <div className="flex justify-between items-center py-6 mt-4 border-t border-gray-100 relative">
                                        <div className="w-1/3"></div>
                                        <div className="flex items-center gap-1.5 justify-center w-1/3">
                                            <button 
                                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                                disabled={currentPage === 1}
                                                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-gray-50 transition-colors disabled:opacity-50"
                                            >
                                                &lt;
                                            </button>
                                            
                                            {Array.from({ length: totalPages }).map((_, i) => {
                                                const p = i + 1;
                                                if (p === 1 || p === totalPages || (p >= currentPage - 1 && p <= currentPage + 1)) {
                                                    return (
                                                        <button 
                                                            key={p} 
                                                            onClick={() => setCurrentPage(p)}
                                                            className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs transition-colors ${currentPage === p ? 'text-[#D48D2A] bg-[#FFF8F0] border border-[#F2E8DB] shadow-sm' : 'text-gray-500 hover:text-gray-900 border border-transparent'}`}
                                                        >
                                                            {p}
                                                        </button>
                                                    );
                                                } else if (p === currentPage - 2 || p === currentPage + 2) {
                                                    return <span key={p} className="text-gray-300 font-bold px-1 text-xs">...</span>;
                                                }
                                                return null;
                                            })}
                                            
                                            <button 
                                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                                disabled={currentPage === totalPages}
                                                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-gray-50 transition-colors disabled:opacity-50"
                                            >
                                                &gt;
                                            </button>
                                        </div>
                                        
                                        <div className="flex items-center justify-end w-1/3 relative z-10">
                                            <div className="relative">
                                                <select 
                                                    value={itemsPerPage} 
                                                    onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                                                    className="appearance-none bg-white border border-gray-200 rounded-xl py-2 pl-4 pr-10 text-[11px] font-bold text-gray-600 focus:outline-none hover:border-gray-300 shadow-sm cursor-pointer"
                                                >
                                                    <option value={10}>10 per page</option>
                                                    <option value={20}>20 per page</option>
                                                    <option value={50}>50 per page</option>
                                                </select>
                                                <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-[10px]" />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })()}
                        </div>
                    )}

                    """
    content = content[:idx_start] + pag_ui + content[idx_end:]


with open('/Users/sudeepreddy/Documents/otulia/Otulia-Web/client/src/pages/Inventory.jsx', 'w') as f:
    f.write(content)
    print("Success Pagination")
