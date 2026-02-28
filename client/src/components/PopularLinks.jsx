import React from 'react'

const PopularLinks = () => {
    const linkGroups = [
        {
            title: 'Cities & Regions',
            links: [
                { name: 'Private islands for sale', path: '/category/estates?type=Island' },
                { name: 'Balearic islands homes for sale', path: '/category/estates?location=Balearic' },
                { name: 'Dubai apartments for sale', path: '/category/estates?location=Dubai' },
                { name: 'London property for sale', path: '/category/estates?location=London' },
                { name: 'Marbella homes for sale', path: '/category/estates?location=Marbella' }
            ]
        },
        {
            title: 'Countries',
            links: [
                { name: 'Homes for sale in Australia', path: '/category/estates?location=Australia' },
                { name: 'Homes for sale in British Virgin Islands', path: '/category/estates?location=British%20Virgin%20Islands' },
                { name: 'Homes for sale in France', path: '/category/estates?location=France' },
                { name: 'Homes for sale in Greece', path: '/category/estates?location=Greece' },
                { name: 'Homes for sale in Italy', path: '/category/estates?location=Italy' }
            ]
        },
        {
            title: 'Cars',
            links: [
                { name: 'Ferrari for sale', path: '/category/cars?brand=Ferrari' },
                { name: 'Aston Martin for sale', path: '/category/cars?brand=Aston%20Martin' },
                { name: 'Lamborghini for sale', path: '/category/cars?brand=Lamborghini' },
                { name: 'Porsche for sale', path: '/category/cars?brand=Porsche' },
                { name: 'Rolls-Royce for sale', path: '/category/cars?brand=Rolls-Royce' }
            ]
        },
        {
            title: 'Jets & Helicopters',
            links: [
                { name: 'Bombardier for sale', path: '/shop?search=Bombardier' },
                { name: 'Cessna for sale', path: '/shop?search=Cessna' },
                { name: 'Gulfstream for sale', path: '/shop?search=Gulfstream' },
                { name: 'Eurocopter for sale', path: '/shop?search=Eurocopter' },
                { name: 'Bell for sale', path: '/shop?search=Bell' }
            ]
        },
        {
            title: 'Yachts',
            links: [
                { name: 'Ferretti for sale', path: '/category/yachts?brand=Ferretti' },
                { name: 'Benetti for sale', path: '/category/yachts?brand=Benetti' },
                { name: 'Azimut for sale', path: '/category/yachts?brand=Azimut' },
                { name: 'Feadship for sale', path: '/category/yachts?brand=Feadship' },
                { name: 'Sunseeker for sale', path: '/category/yachts?brand=Sunseeker' }
            ]
        },
        {
            title: 'Watches',
            links: [
                { name: 'IWC for sale', path: '/shop?search=IWC' },
                { name: 'Patek Philippe for sale', path: '/shop?search=Patek%20Philippe' },
                { name: 'Richard Mille for sale', path: '/shop?search=Richard%20Mille' },
                { name: 'Rolex for sale', path: '/shop?search=Rolex' },
                { name: 'Audemars Piguet for sale', path: '/shop?search=Audemars%20Piguet' }
            ]
        }
    ]

    return (
        <section className="w-full px-3 md:px-16 py-6 bg-white border-t border-gray-100">
            <h2 className="text-3xl playfair-display text-black mb-12">Popular Links</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
                {linkGroups.map((group, idx) => (
                    <div key={idx} className="flex flex-col gap-4">
                        <h3 className="text-sm font-bold text-black uppercase tracking-wider">{group.title}</h3>
                        <ul className="flex flex-col gap-2">
                            {group.links.map((link, lIdx) => (
                                <li key={lIdx}>
                                    <a href={link.path} className="text-sm text-gray-500 hover:text-black transition-colors">
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default PopularLinks
