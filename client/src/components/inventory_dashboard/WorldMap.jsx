import React from 'react';
import worldPaths from './world_paths.json';

const WorldMap = ({ data = [] }) => {
    // Mapping from lead data country names to ISO codes in world_paths.json
    const nameToId = {
        'united states': 'us',
        'usa': 'us',
        'united arab emirates': 'ae',
        'uae': 'ae',
        'united kingdom': 'gb',
        'uk': 'gb',
        'india': 'in',
        'canada': 'ca',
        'south korea': 'kr',
        'korea': 'kr',
        'france': 'fr',
        'germany': 'de',
        'saudi arabia': 'sa',
        'australia': 'au',
        'russia': 'ru',
        'china': 'cn',
        'brazil': 'br',
        'italy': 'it',
        'spain': 'es',
        'japan': 'jp',
        'mexico': 'mx',
        'south africa': 'za',
        'turkey': 'tr',
        'netherlands': 'nl',
        'switzerland': 'ch',
        'sweden': 'se',
        'norway': 'no',
        'denmark': 'dk',
        'finland': 'fi',
        'belgium': 'be',
        'austria': 'at',
        'portugal': 'pt',
        'greece': 'gr',
        'ireland': 'ie',
    };

    const maxLeads = Math.max(...data.map(l => l.leads), 1);

    // Group paths by ID to apply same style to all parts of a country
    const countryStyles = {};
    data.forEach(loc => {
        const id = nameToId[loc.country.toLowerCase()];
        if (id) {
            const density = loc.leads / maxLeads;
            countryStyles[id] = {
                opacity: 0.1 + (density * 0.9),
                fill: "#EAB308", // Bright yellow
                stroke: "#CA8A04",
                strokeWidth: "0.4"
            };
        }
    });

    return (
        <div className="w-full h-full flex items-center justify-center">
            <svg 
                viewBox="30 240 790 460" 
                className="w-full h-full drop-shadow-sm" 
                preserveAspectRatio="xMidYMid contain"
            >
                {worldPaths.map((path, idx) => {
                    const style = countryStyles[path.id] || {
                        opacity: 0.10,
                        fill: "#EAB308", // Yellow for all countries
                        stroke: "#E5E7EB",
                        strokeWidth: "0.1"
                    };

                    return (
                        <path
                            key={`${path.id}-${idx}`}
                            d={path.d}
                            fill={style.fill}
                            opacity={style.opacity}
                            stroke={style.stroke}
                            strokeWidth={style.strokeWidth}
                            className="transition-all duration-300 hover:opacity-100 cursor-pointer"
                        >
                            <title>{path.id}</title>
                        </path>
                    );
                })}
            </svg>
        </div>
    );
};

export default WorldMap;
