import React from 'react';
import {
    FiWifi, FiDroplet, FiWind, FiSun, FiAnchor, FiShield, 
    FiLock, FiKey, FiStar, FiActivity, FiMusic, FiCompass, 
    FiSmile, FiMic, FiScissors, FiMapPin
} from 'react-icons/fi';
import { 
  MdOutlinePool, MdOutlineFitnessCenter, MdOutlineSpa, MdOutlineHotTub, 
  MdOutlineCasino, MdOutlineWineBar, MdOutlineLocalBar, MdOutlineOutdoorGrill, 
  MdOutlineChildCare, MdOutlinePets, MdOutlineElevator, MdOutlineLocalLaundryService, 
  MdOutlineStorage, MdOutlineRoomService, MdOutlineNetworkWifi, MdOutlineWaves, 
  MdOutlineTerrain, MdOutlinePark, MdOutlineNaturePeople, MdOutlineDirectionsCar, 
  MdOutlineEvStation, MdOutlineLocationCity, MdOutlineWbSunny, MdOutlineGolfCourse, 
  MdOutlineDeck, MdOutlineFireplace, MdOutlineMeetingRoom, MdOutlineFace, 
  MdOutlineSensors, MdOutlineSettingsVoice, MdOutlineLightbulb, MdOutlineThermostat, 
  MdOutlineAcUnit, MdOutlineDashboard, MdOutlineSmartphone, MdOutlineToggleOn, 
  MdOutlineSmartToy, MdOutlineCastle, MdOutlineStairs, MdOutlineWindow, 
  MdOutlineHouseSiding, MdOutlineSecurity, MdOutlineLocalDining, MdOutlineBathtub,
  MdOutlineVideocam
} from "react-icons/md";
import { BiCameraMovie } from "react-icons/bi";
import { FaInfinity, FaHorse, FaHelicopter, FaShip } from "react-icons/fa";
import { GiTennisRacket, GiCigar, GiGrapes, GiBowlingStrike, GiWineBottle, GiDiamondTrophy } from "react-icons/gi";

/**
 * Returns a React component (Icon) based on the amenity name.
 * @param {string} name - The name of the amenity or feature.
 * @param {string} className - Optional CSS classes for the icon.
 * @returns {JSX.Element}
 */
export const getAmenityIcon = (name, className = "w-5 h-5") => {
    if (!name) return <FiStar className={className} />;
    
    const lower = name.toLowerCase();

    // Exact matches first (synced with AddAssetModal)
    switch(name) {
        // Lifestyle
        case "Swimming Pool": return <MdOutlinePool className={className} />;
        case "Infinity Pool": return <FaInfinity className={className} />;
        case "Gym / Fitness Center": return <MdOutlineFitnessCenter className={className} />;
        case "Spa & Wellness Center": return <MdOutlineSpa className={className} />;
        case "Sauna / Steam Room": return <MdOutlineHotTub className={className} />;
        case "Jacuzzi": return <MdOutlineBathtub className={className} />;
        case "Clubhouse": return <MdOutlineCastle className={className} />;
        case "Private Theater": return <BiCameraMovie className={className} />;
        case "Game Room": return <GiTennisRacket className={className} />;
        case "Bar / Lounge": return <MdOutlineLocalBar className={className} />;
        case "BBQ Area": return <MdOutlineOutdoorGrill className={className} />;
        case "Outdoor Dining Area": return <MdOutlineLocalDining className={className} />;
        case "Kids Play Area": return <MdOutlineChildCare className={className} />;
        case "Pet Friendly": return <MdOutlinePets className={className} />;
        case "Jogging Track": return <FiActivity className={className} />;
        case "Garden / Lawn": return <MdOutlineNaturePeople className={className} />;
        case "Landscaped Gardens": return <MdOutlinePark className={className} />;
        case "Elevator": return <MdOutlineElevator className={className} />;
        case "Private Parking": return <MdOutlineDirectionsCar className={className} />;
        case "EV Charging": return <MdOutlineEvStation className={className} />;
        case "Laundry Room": return <MdOutlineLocalLaundryService className={className} />;
        case "Storage Room": return <MdOutlineStorage className={className} />;
        case "Servant Quarters": return <MdOutlineRoomService className={className} />;
        case "Smart Entry": return <FiKey className={className} />;
        case "High-Speed WiFi": return <FiWifi className={className} />;

        // Views
        case "Sea View": return <MdOutlineWaves className={className} />;
        case "Oceanfront": return <FiAnchor className={className} />;
        case "Lake View": return <FiDroplet className={className} />;
        case "River View": return <MdOutlineWaves className={className} />;
        case "Mountain View": return <MdOutlineTerrain className={className} />;
        case "Forest View": return <MdOutlinePark className={className} />;
        case "Garden View": return <MdOutlineNaturePeople className={className} />;
        case "Park View": return <MdOutlinePark className={className} />;
        case "City Skyline View": return <MdOutlineLocationCity className={className} />;
        case "Panoramic View": return <FiCompass className={className} />;
        case "Sunset View": return <MdOutlineWbSunny className={className} />;
        case "Sunrise View": return <FiSun className={className} />;
        case "Pool View": return <MdOutlinePool className={className} />;
        case "Golf Course View": return <MdOutlineGolfCourse className={className} />;
        case "Marina View": return <FaShip className={className} />;
        case "Private Beach Access": return <MdOutlineWaves className={className} />;
        case "Waterfront Property": return <MdOutlineHouseSiding className={className} />;
        case "Rooftop Terrace": return <MdOutlineDeck className={className} />;
        case "Balcony with View": return <MdOutlineWindow className={className} />;
        case "Outdoor Lounge": return <MdOutlineDeck className={className} />;
        case "Fire Pit Area": return <MdOutlineFireplace className={className} />;
        case "Outdoor Entertainment Area": return <FiMusic className={className} />;

        // Security
        case "Smart Door Lock": return <FiLock className={className} />;
        case "Video Doorbell": return <MdOutlineMeetingRoom className={className} />;
        case "Face Recognition Entry": return <MdOutlineFace className={className} />;
        case "Motion Sensors": return <MdOutlineSensors className={className} />;
        case "Smart Surveillance": return <MdOutlineVideocam className={className} />;
        case "24/7 Security": return <MdOutlineSecurity className={className} />;
        case "Gated Community Access": return <FiShield className={className} />;
        case "Voice Control": return <MdOutlineSettingsVoice className={className} />;
        case "Smart Lighting": return <MdOutlineLightbulb className={className} />;
        case "Automated Curtains": return <MdOutlineWindow className={className} />;
        case "Smart Thermostat": return <MdOutlineThermostat className={className} />;
        case "Climate Control": return <MdOutlineAcUnit className={className} />;
        case "Central Control Panel": return <MdOutlineDashboard className={className} />;
        case "Mobile App Control": return <MdOutlineSmartphone className={className} />;
        case "Smart Switches": return <MdOutlineToggleOn className={className} />;
        case "AI Assistant Integration": return <MdOutlineSmartToy className={className} />;
        case "High-Speed Internet Ready": return <MdOutlineNetworkWifi className={className} />;
        case "Fiber Connection": return <FiScissors className={className} />;
        case "Smart Intercom": return <FiMic className={className} />;

        // Ultra Luxury
        case "Private Island": return <FiMapPin className={className} />;
        case "Private Dock / Yacht Berth": return <FiAnchor className={className} />;
        case "Vineyard / Orchard": return <GiGrapes className={className} />;
        case "Equestrian Facilities": return <FaHorse className={className} />;
        case "Multi-Car Garage (10+)": return <MdOutlineDirectionsCar className={className} />;
        case "Car Showroom Garage": return <MdOutlineDirectionsCar className={className} />;
        case "Underground Garage": return <MdOutlineDirectionsCar className={className} />;
        case "Car Lift System": return <MdOutlineElevator className={className} />;
        case "Private Car Gallery": return <MdOutlineDirectionsCar className={className} />;
        case "EV Fleet Charging": return <MdOutlineEvStation className={className} />;
        case "Private Cinema": return <BiCameraMovie className={className} />;
        case "Bowling Alley": return <GiBowlingStrike className={className} />;
        case "Casino Room": return <MdOutlineCasino className={className} />;
        case "Wine Cellar": return <GiWineBottle className={className} />;
        case "Cigar Lounge": return <GiCigar className={className} />;
        case "Private Bar": return <MdOutlineWineBar className={className} />;
        case "Ballroom / Event Hall": return <GiDiamondTrophy className={className} />;
        case "Private Library": return <MdOutlineHouseSiding className={className} />;
        case "Private Spa Suite": return <MdOutlineSpa className={className} />;
        case "Ice Bath": return <MdOutlineHotTub className={className} />;
        case "Indoor Lap Pool": return <MdOutlinePool className={className} />;
        case "Meditation Room": return <FiSmile className={className} />;
        case "Yoga Pavilion": return <FiActivity className={className} />;
        case "Massage Room": return <MdOutlineSpa className={className} />;
        case "Double-Height Ceilings": return <MdOutlineStairs className={className} />;
        case "Grand Staircase": return <MdOutlineStairs className={className} />;
        case "Floating Staircase": return <MdOutlineStairs className={className} />;
        case "Floor-to-Ceiling Glass": return <MdOutlineWindow className={className} />;
        case "Sky Bridge": return <MdOutlineTerrain className={className} />;
        case "Smart Glass": return <MdOutlineWindow className={className} />;
        case "Waterfront Estate": return <MdOutlineHouseSiding className={className} />;
        case "Gated Estate": return <MdOutlineCastle className={className} />;
        case "Helipad": return <FaHelicopter className={className} />;
    }

    // Fallback to keyword matching if exact match fails
    if (lower.includes('wifi') || lower.includes('internet')) return <FiWifi className={className} />;
    if (lower.includes('pool')) return <MdOutlinePool className={className} />;
    if (lower.includes('gym') || lower.includes('fitness')) return <MdOutlineFitnessCenter className={className} />;
    if (lower.includes('spa') || lower.includes('sauna') || lower.includes('steam') || lower.includes('massage')) return <MdOutlineSpa className={className} />;
    if (lower.includes('parking') || lower.includes('garage') || lower.includes('car')) return <MdOutlineDirectionsCar className={className} />;
    if (lower.includes('garden') || lower.includes('lawn') || lower.includes('nature') || lower.includes('park')) return <MdOutlineNaturePeople className={className} />;
    if (lower.includes('security') || lower.includes('guard') || lower.includes('surveillance')) return <MdOutlineSecurity className={className} />;
    if (lower.includes('smart') || lower.includes('automation') || lower.includes('ai')) return <MdOutlineSmartToy className={className} />;
    if (lower.includes('theater') || lower.includes('cinema') || lower.includes('movie')) return <BiCameraMovie className={className} />;
    if (lower.includes('wine') || lower.includes('cellar')) return <GiWineBottle className={className} />;
    if (lower.includes('bar') || lower.includes('lounge') || lower.includes('dining')) return <MdOutlineLocalBar className={className} />;
    if (lower.includes('view')) return <FiSun className={className} />;
    if (lower.includes('bath') || lower.includes('jacuzzi')) return <MdOutlineBathtub className={className} />;
    if (lower.includes('climate') || lower.includes('ac') || lower.includes('hvac')) return <MdOutlineAcUnit className={className} />;
    if (lower.includes('storage')) return <MdOutlineStorage className={className} />;
    if (lower.includes('elevator') || lower.includes('lift')) return <MdOutlineElevator className={className} />;
    
    return <FiHome className={className} />;
};
