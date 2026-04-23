import React, { useState } from 'react';
import { FiX, FiUploadCloud, FiCheckCircle, FiChevronDown, FiInfo } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';

const CreateListingModal = ({ isOpen, onClose, onCreated, editData }) => {
    const { token } = useAuth();
    const [loading, setLoading] = useState(false);

    const normalizeCategory = (data) => {
        if (!data) return 'Car';
        const cat = (data.category || data.itemModel || '').toLowerCase();
        if (cat.includes('car') || cat === 'vehicles') return 'Car';
        if (cat.includes('bike') || cat === 'bikes') return 'Bike';
        if (cat.includes('yacht')) return 'Yacht';
        if (cat.includes('estate')) return 'Estate';
        return 'Car';
    };

    const [formData, setFormData] = useState({
        title: editData?.title || '',
        listingReference: editData?.listingReference || '',
        price: editData?.price || '',
        isPriceOnRequest: editData?.isPriceOnRequest || false,
        category: normalizeCategory(editData),
        type: editData?.type || 'Sale',
        location: editData?.location || '',
        description: editData?.description || '',
        videoUrl: editData?.videoUrl || '',
        isPublic: editData?.status === 'Active' ? true : true, // Default to true
        autoGenerateId: false,

        // Car/Bike Common
        make: editData?.brand || (editData?.specification?.brand) || '',
        model: editData?.specification?.model || '',
        variant: editData?.specification?.variant || '',
        year: editData?.specification?.yearOfConstruction || editData?.specification?.year || new Date().getFullYear(),
        mileage: editData?.specification?.mileage || editData?.specification?.mileageKM || '',
        fuelType: editData?.specification?.fuel || editData?.specification?.fuelType || '',
        transmission: editData?.specification?.transmission || '',
        exteriorColor: editData?.specification?.exteriorColor || '',
        interiorColor: editData?.specification?.interiorColor || '',
        condition: editData?.specification?.condition || '',
        accidentHistory: editData?.specification?.accidentHistory || '',

        // Car Specific
        horsepower: editData?.specification?.power || '',
        cylinderCapacity: editData?.specification?.cylinderCapacity || '',
        topSpeed: editData?.specification?.topSpeed || '',
        steering: editData?.specification?.steering || '',
        driveType: editData?.specification?.drive || '',
        bodyType: editData?.specification?.body || '',
        series: editData?.specification?.series || '',
        interiorMaterial: editData?.specification?.interiorMaterial || '',
        manufacturerColorCode: editData?.specification?.manufacturerColorCode || '',
        matchingNumbers: editData?.specification?.matchingNumbers || '',
        accidentFree: editData?.specification?.accidentFree || '',
        countryOfFirstDelivery: editData?.specification?.countryOfFirstDelivery || '',
        numberOfOwners: editData?.specification?.numberOfOwners || '1',
        currentCarLocation: editData?.specification?.carLocation || '',

        // Bike Specific
        brand: editData?.brand || editData?.specification?.brand || '',
        engineCapacity: editData?.specification?.engineCapacityCC || editData?.specification?.engineCapacity || '',
        maxPower: editData?.specification?.maxPower || '',
        maxTorque: editData?.specification?.maxTorque || '',
        abs: editData?.specification?.abs || '',
        tractionControl: editData?.specification?.tractionControl || '',
        color: editData?.specification?.color || '',
        ownershipCount: editData?.specification?.ownershipCount || '1',

        // Yacht Specific
        yachtName: editData?.title || '',
        builder: editData?.builder || editData?.specification?.builder || '',
        yachtLength: editData?.specification?.length || '',
        yachtBeam: editData?.specification?.beam || '',
        yachtDraft: editData?.specification?.draft || '',
        yachtCruisingSpeed: editData?.specification?.cruisingSpeed || '',
        yachtTopSpeed: editData?.specification?.topSpeed || '',
        yachtUsageHours: editData?.specification?.usageHours || '',
        yachtFuelConsumption: editData?.specification?.fuelConsumption || '',
        yachtGuestCapacity: editData?.specification?.guestCapacity || '',
        yachtCrewCapacity: editData?.specification?.crewCapacity || '',
        yachtEngineType: editData?.specification?.engineType || '',
        yachtHullMaterial: editData?.specification?.hullMaterial || '',
        yachtExteriorColor: editData?.specification?.exteriorColor || '',
        yachtNumberOfOwners: editData?.specification?.numberOfOwners || '',

        // Estate Specific
        propertyName: editData?.title || editData?.propertyName || '',
        propertyType: editData?.keySpecifications?.propertyType || editData?.specification?.propertyType || '',
        architectureStyle: editData?.specification?.architectureStyle || '',
        builtUpArea: editData?.specification?.builtUpArea || '',
        landArea: editData?.specification?.landArea || '',
        bedrooms: editData?.specification?.bedrooms || '',
        bathrooms: editData?.specification?.bathrooms || '',
        floors: editData?.specification?.floors || '',
        garageCapacity: editData?.specification?.garageCapacity || '',
        furnishingStatus: editData?.specification?.furnishingStatus || '',
        configuration: editData?.specification?.configuration || '',
        interiorColorTheme: editData?.specification?.interiorColorTheme || '',
        exteriorFinish: editData?.specification?.exteriorFinish || '',
        climateControl: editData?.specification?.climateControl || '',
        usageStatus: editData?.specification?.usageStatus || '',
        country: editData?.specification?.country || '',
        city: editData?.specification?.city || '',
        address: editData?.specification?.address || '',
        areaNeighborhood: editData?.specification?.areaNeighborhood || '',
        latitude: editData?.specification?.latitude || '',
        longitude: editData?.specification?.longitude || '',

        amenities: editData?.amenities || [],
        smartHomeSystems: editData?.smartHomeSystems || [],
        viewTypes: editData?.viewTypes || [],

        // Key Highlights
        highlight_hp: '', highlight_km: '', highlight_cc: '',
        highlight_length: '', highlight_baths: '', highlight_beds: '',
        highlight_area: '', highlight_kml: '', highlight_fuel: '',
        highlight_garage: '', highlight_built_area: '', highlight_floors: '',
        highlight_engine_hp: '', highlight_speed: '', highlight_engine_type: '',
    });

    const [images, setImages] = useState([]);
    const [documents, setDocuments] = useState([]);
    const [existingImages, setExistingImages] = useState(editData?.images || []);
    const [isSuccess, setIsSuccess] = useState(false);
    const [showDraftConfirm, setShowDraftConfirm] = useState(false);

    const handleCloseAttempt = () => {
        // Check if there is any data to save
        const hasData = formData.title || formData.price || formData.description || 
                        formData.make || formData.model || formData.brand || 
                        formData.propertyName || formData.yachtName ||
                        images.length > 0;
        if (!editData && hasData) {
            setShowDraftConfirm(true);
        } else {
            onClose();
        }
    };

    const saveAsDraft = async () => {
        await handleSubmit(null, false);
    };

    const handleRemoveFile = (index, type) => {
        if (type === 'images') {
            setImages(images.filter((_, i) => i !== index));
        }
    };

    // Reset form when editData changes or modal closes/opens
    React.useEffect(() => {
        if (!isOpen) {
            setImages([]);
            setExistingImages([]);
        }
        if (editData) {
            const images = editData.images || [];
            setExistingImages(images);
            setImages(images); // Pre-fill images state with URLs
            
            const spec = editData.specification || {};
            const keySpec = editData.keySpecifications || {};
            setFormData({
                title: editData.title || '',
                listingReference: editData.listingReference || '',
                price: editData.price || '',
                isPriceOnRequest: editData.isPriceOnRequest || false,
                category: normalizeCategory(editData),
                type: editData.type || 'Sale',
                location: editData.location || '',
                description: editData.description || '',
                videoUrl: editData.videoUrl || '',
                isPublic: editData.status === 'Active',
                autoGenerateId: false,

                make: editData.brand || spec.brand || '',
                model: spec.model || '',
                variant: spec.variant || '',
                year: spec.yearOfConstruction || spec.year || new Date().getFullYear(),
                mileage: spec.mileage || spec.mileageKM || '',
                fuelType: spec.fuel || spec.fuelType || '',
                transmission: spec.transmission || '',
                exteriorColor: spec.exteriorColor || '',
                interiorColor: spec.interiorColor || '',
                condition: spec.condition || '',
                accidentHistory: spec.accidentHistory || '',

                horsepower: spec.power || '',
                cylinderCapacity: spec.cylinderCapacity || '',
                topSpeed: spec.topSpeed || '',
                steering: spec.steering || '',
                driveType: spec.drive || '',
                bodyType: spec.body || '',
                series: spec.series || '',
                interiorMaterial: spec.interiorMaterial || '',
                manufacturerColorCode: spec.manufacturerColorCode || '',
                matchingNumbers: spec.matchingNumbers || '',
                accidentFree: spec.accidentFree || '',
                countryOfFirstDelivery: spec.countryOfFirstDelivery || '',
                numberOfOwners: spec.numberOfOwners || '1',
                currentCarLocation: spec.carLocation || '',

                brand: editData.brand || spec.brand || '',
                engineCapacity: spec.engineCapacityCC || spec.engineCapacity || '',
                maxPower: spec.maxPower || '',
                maxTorque: spec.maxTorque || '',
                abs: spec.abs || '',
                tractionControl: spec.tractionControl || '',
                color: spec.color || '',
                ownershipCount: spec.ownershipCount || '1',

                yachtName: editData.title || '',
                builder: editData.builder || spec.builder || spec.brandBuilder || '',
                yachtLength: spec.length || '',
                yachtBeam: spec.beam || '',
                yachtDraft: spec.draft || '',
                yachtCruisingSpeed: spec.cruisingSpeed || '',
                yachtTopSpeed: spec.topSpeed || '',
                yachtUsageHours: spec.usageHours || '',
                yachtFuelConsumption: spec.fuelConsumption || '',
                yachtGuestCapacity: spec.guestCapacity || '',
                yachtCrewCapacity: spec.crewCapacity || '',
                yachtEngineType: spec.engineType || '',
                yachtHullMaterial: spec.hullMaterial || '',
                yachtExteriorColor: spec.exteriorColor || '',
                yachtNumberOfOwners: spec.numberOfOwners || '',

                propertyName: editData.title || editData.propertyName || '',
                propertyType: keySpec.propertyType || spec.propertyType || '',
                architectureStyle: spec.architectureStyle || '',
                builtUpArea: spec.builtUpArea || '',
                landArea: spec.landArea || '',
                bedrooms: spec.bedrooms || '',
                bathrooms: spec.bathrooms || '',
                floors: spec.floors || '',
                garageCapacity: spec.garageCapacity || '',
                furnishingStatus: spec.furnishingStatus || '',
                configuration: spec.configuration || '',
                interiorColorTheme: spec.interiorColorTheme || '',
                exteriorFinish: spec.exteriorFinish || '',
                climateControl: spec.climateControl || '',
                usageStatus: spec.usageStatus || '',
                country: spec.country || '',
                city: spec.city || '',
                address: spec.address || '',
                areaNeighborhood: spec.areaNeighborhood || '',
                latitude: spec.latitude || '',
                longitude: spec.longitude || '',

                amenities: editData.amenities || [],
                smartHomeSystems: editData.smartHomeSystems || [],
                viewTypes: editData.viewTypes || [],

                // Fixed Highlights
                highlight_hp: (() => {
                    const val = keySpec.power || spec.power || spec.horsepower || '';
                    if (!val) return '';
                    const match = val.toString().match(/[\d.]+/);
                    return match ? match[0] : val;
                })(),
                highlight_km: (() => {
                    const val = keySpec.mileage || spec.mileage || '';
                    if (!val) return '';
                    const match = val.toString().match(/[\d.]+/);
                    return match ? match[0] : val;
                })(),
                highlight_cc: (() => {
                    const val = keySpec.cylinderCapacity || spec.cylinderCapacity || spec.engineCapacity || '';
                    if (!val) return '';
                    const match = val.toString().match(/[\d.]+/);
                    return match ? match[0] : val;
                })(),
                highlight_length: (() => {
                    const val = keySpec.length || spec.length || '';
                    if (!val) return '';
                    const match = val.toString().match(/[\d.]+/);
                    return match ? match[0] : val;
                })(),
                highlight_baths: (() => {
                    const val = keySpec.bathrooms || spec.bathrooms || '';
                    if (!val) return '';
                    const match = val.toString().match(/[\d.]+/);
                    return match ? match[0] : val;
                })(),
                highlight_beds: (() => {
                    const val = keySpec.bedrooms || spec.bedrooms || '';
                    if (!val) return '';
                    const match = val.toString().match(/[\d.]+/);
                    return match ? match[0] : val;
                })(),
                highlight_area: (() => {
                    const val = keySpec.landArea || spec.landArea || keySpec.builtUpArea || '';
                    if (!val) return '';
                    const match = val.toString().match(/[\d.]+/);
                    return match ? match[0] : val;
                })(),
                highlight_fuel: (() => {
                    const val = keySpec.fuelCapacity || spec.fuelCapacity || '';
                    if (!val) return '';
                    const match = val.toString().match(/[\d.]+/);
                    return match ? match[0] : val;
                })(),
                highlight_garage: (() => {
                    const val = keySpec.garageCapacity || spec.garageCapacity || '';
                    if (!val) return '';
                    const match = val.toString().match(/[\d.]+/);
                    return match ? match[0] : val;
                })(),
                highlight_built_area: (() => {
                    const val = keySpec.builtUpArea || spec.builtUpArea || '';
                    if (!val) return '';
                    const match = val.toString().match(/[\d.]+/);
                    return match ? match[0] : val;
                })(),
                highlight_floors: (() => {
                    const val = keySpec.floors || spec.floors || '';
                    if (!val) return '';
                    const match = val.toString().match(/[\d.]+/);
                    return match ? match[0] : val;
                })(),
                highlight_speed: (() => {
                    const val = keySpec.topSpeed || spec.topSpeed || '';
                    if (!val) return '';
                    const match = val.toString().match(/[\d.]+/);
                    return match ? match[0] : val;
                })(),
                highlight_engine_type: keySpec.engineType || spec.engineType || '',
                highlight_engine_hp: (() => {
                    const val = keySpec.engineType || spec.engineType || '';
                    if (!val) return '';
                    const match = val.toString().match(/[\d.]+/);
                    return match ? match[0] : val;
                })(),
            });
        } else {
            setFormData({
                title: '', listingReference: '', price: '', isPriceOnRequest: false, category: 'Car', type: 'Sale', location: '', description: '', videoUrl: '', isPublic: true, autoGenerateId: false,
                make: '', model: '', variant: '', year: new Date().getFullYear(),
                mileage: '', fuelType: '', transmission: '', exteriorColor: '', interiorColor: '',
                condition: '', accidentHistory: '', horsepower: '', cylinderCapacity: '', topSpeed: '',
                steering: '', driveType: '', bodyType: '', series: '', interiorMaterial: '', manufacturerColorCode: '',
                matchingNumbers: '', accidentFree: '', countryOfFirstDelivery: '',
                numberOfOwners: '1', currentCarLocation: '',
                brand: '', engineCapacity: '', maxPower: '', maxTorque: '', abs: '', tractionControl: '', color: '', ownershipCount: '1',
                yachtName: '', builder: '', yachtLength: '', yachtBeam: '', yachtDraft: '', yachtCruisingSpeed: '', yachtTopSpeed: '', yachtUsageHours: '', yachtFuelConsumption: '',
                yachtGuestCapacity: '', yachtCrewCapacity: '', yachtEngineType: '', yachtHullMaterial: '', yachtExteriorColor: '', yachtNumberOfOwners: '',
                propertyName: '', propertyType: '', architectureStyle: '', builtUpArea: '',
                landArea: '', bedrooms: '', bathrooms: '', floors: '', garageCapacity: '', furnishingStatus: '',
                configuration: '', interiorColorTheme: '', exteriorFinish: '',
                climateControl: '', usageStatus: '', country: '', city: '', address: '',
                areaNeighborhood: '', latitude: '', longitude: '',
                amenities: [], smartHomeSystems: [], viewTypes: [],
                highlight_hp: '', highlight_km: '', highlight_cc: '',
                highlight_length: '', highlight_baths: '', highlight_beds: '',
                highlight_area: '', highlight_kml: '', highlight_fuel: '',
                highlight_garage: '', highlight_built_area: '', highlight_floors: '',
                highlight_engine_hp: '', highlight_speed: '', highlight_engine_type: '',
            });
        }
    }, [editData, isOpen]);

    if (!isOpen) return null;

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleGenerateId = () => {
        const prefix = "#NJM";
        const randomDigits = Math.floor(1000000 + Math.random() * 9000000).toString();
        setFormData(prev => ({ ...prev, listingReference: `${prefix}${randomDigits}` }));
    };

    const handleFileChange = (e, type) => {
        const files = Array.from(e.target.files);
        const MAX_SIZE = 5 * 1024 * 1024; // 5MB

        // Size validation
        const oversizedFiles = files.filter(f => f.size > MAX_SIZE);
        if (oversizedFiles.length > 0) {
            alert(`Some files are too large. Maximum size per file is 5MB. Affected files: ${oversizedFiles.map(f => f.name).join(', ')}`);
            return;
        }

        if (type === 'images') {
            setImages(prev => [...prev, ...files].slice(0, 15));
        }
    };

    const handleSubmit = async (e, draftOverride = null) => {
        if (e) e.preventDefault();
        console.log("[CreateListing] handleSubmit called");
        
        const isDraft = draftOverride !== null ? draftOverride : !formData.isPublic;

        // Skip most validations for drafts except for basic identity fields
        if (!isDraft) {
            // Comprehensive Validation
            // Mandatory: NJM IDS, Photos, Key Highlights, Location, Title (for real estate), brand/model (for cars), Lat/Long, Price, Description
            const requiredCommon = ['location', 'description', 'listingReference', 'latitude', 'longitude'];
            
            if (formData.category === 'Estate') {
                requiredCommon.push('title');
            }

            if (formData.category === 'Car') {
                requiredCommon.push('make', 'model');
            }

            for (const field of requiredCommon) {
                if (!formData[field]) {
                    const label = field.replace(/([A-Z])/g, ' $1').toLowerCase();
                    alert(`Please fill in the ${label} field.`);
                    return;
                }
            }

            if (!formData.price && !formData.isPriceOnRequest) {
                alert("Please enter a price or select 'Price on Request'");
                return;
            }

            // Key Highlights Validation
            let highlightFields = [];
            if (formData.category === 'Car') {
                highlightFields = ['highlight_engine_type', 'highlight_hp', 'highlight_speed'];
            } else if (formData.category === 'Bike') {
                highlightFields = ['highlight_cc', 'highlight_speed', 'highlight_fuel'];
            } else if (formData.category === 'Yacht') {
                highlightFields = ['highlight_length', 'highlight_baths', 'highlight_fuel', 'highlight_engine_hp', 'highlight_beds', 'highlight_speed'];
            } else if (formData.category === 'Estate') {
                highlightFields = ['highlight_area', 'highlight_baths', 'highlight_garage', 'highlight_built_area', 'highlight_beds', 'highlight_floors'];
            }

            for (const field of highlightFields) {
                if (!formData[field] && formData[field] !== 0) {
                    const label = field.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').toLowerCase();
                    alert(`Please fill in the ${label} field (Key Highlight).`);
                    return;
                }
            }

            if (!editData && images.length === 0) {
                alert("Please upload at least one image.");
                return;
            }
        } else {
            // For drafts, we still need a few things
            if (!formData.title && !editData) formData.title = 'Draft Asset';
            if (!formData.listingReference && !editData) handleGenerateId();
        }

        setLoading(true);
        console.log(`[CreateListing] Starting ${editData ? 'update' : 'creation'} process (Draft: ${isDraft})...`);

        // Sync highlights to main fields
        if (formData.category === 'Car') {
            if (!formData.horsepower) formData.horsepower = formData.highlight_hp;
            if (!formData.topSpeed) formData.topSpeed = formData.highlight_speed;
            if (!formData.engineType) formData.engineType = formData.highlight_engine_type;
        } else if (formData.category === 'Yacht') {
            if (!formData.length) formData.length = formData.highlight_length;
            if (!formData.bathrooms) formData.bathrooms = formData.highlight_baths;
            if (!formData.topSpeed) formData.topSpeed = formData.highlight_speed;
            if (!formData.bedrooms) formData.bedrooms = formData.highlight_beds;
            if (!formData.fuelCapacity) formData.fuelCapacity = formData.highlight_fuel;
            if (!formData.engineType) formData.engineType = formData.highlight_engine_hp;
        } else if (formData.category === 'Estate') {
            if (!formData.landArea) formData.landArea = formData.highlight_area;
            if (!formData.bathrooms) formData.bathrooms = formData.highlight_baths;
            if (!formData.builtUpArea) formData.builtUpArea = formData.highlight_built_area;
            if (!formData.bedrooms) formData.bedrooms = formData.highlight_beds;
            if (!formData.floors) formData.floors = formData.highlight_floors;
            if (!formData.garageCapacity) formData.garageCapacity = formData.highlight_garage;
        } else if (formData.category === 'Bike') {
            if (!formData.engineCapacity) formData.engineCapacity = formData.highlight_cc;
            if (!formData.topSpeed) formData.topSpeed = formData.highlight_speed;
        }

        // Construct Highlights
        let constructedHighlights = [];
        if (formData.category === 'Car') {
            constructedHighlights = [
                formData.highlight_speed ? `${formData.highlight_speed} mph` : '',
                formData.highlight_engine_type ? `${formData.highlight_engine_type}` : '',
                formData.highlight_hp ? `${formData.highlight_hp} hp` : ''
            ].filter(Boolean);
        } else if (formData.category === 'Yacht') {
            constructedHighlights = [
                formData.highlight_length ? `${formData.highlight_length} M length` : '',
                formData.highlight_baths ? `Bathrooms: ${formData.highlight_baths}` : '',
                formData.highlight_fuel ? `${formData.highlight_fuel} L fuel capacity` : '',
                formData.highlight_engine_hp ? `${formData.highlight_engine_hp} HP total` : '',
                formData.highlight_beds ? `Bedrooms: ${formData.highlight_beds}` : '',
                formData.highlight_speed ? `TopSpeed: ${formData.highlight_speed} knots` : ''
            ].filter(Boolean);
        } else if (formData.category === 'Estate') {
            constructedHighlights = [
                formData.highlight_area ? `Land Area: ${formData.highlight_area} Acres` : '',
                formData.highlight_baths ? `Bathrooms: ${formData.highlight_baths}` : '',
                formData.highlight_garage ? `Garage: ${formData.highlight_garage} Cars` : '',
                formData.highlight_built_area ? `Built Area: ${formData.highlight_built_area} Sq Ft` : '',
                formData.highlight_beds ? `Bedrooms: ${formData.highlight_beds}` : '',
                formData.highlight_floors ? `Floors: ${formData.highlight_floors}` : ''
            ].filter(Boolean);
        } else if (formData.category === 'Bike') {
            constructedHighlights = [
                formData.highlight_cc ? `${formData.highlight_cc} cc` : '',
                formData.highlight_speed ? `${formData.highlight_speed} km/h` : '',
                formData.highlight_fuel ? `${formData.highlight_fuel} liters` : ''
            ].filter(Boolean);
        }

        const data = new FormData();
        Object.keys(formData).forEach(key => {
            if (['amenities', 'smartHomeSystems', 'viewTypes'].includes(key)) {
                data.append(key, JSON.stringify(formData[key]));
            } else if (key.startsWith('highlight_')) {
                return;
            } else if (key === 'isPublic' && draftOverride !== null) {
                data.append(key, !draftOverride);
            } else {
                data.append(key, formData[key]);
            }
        });

        data.append('highlights', JSON.stringify(constructedHighlights));
        images.forEach(img => {
            if (typeof img !== 'string') {
                data.append('images', img);
            }
        });

        try {
            const url = editData ? `/api/listings/${editData._id || editData.id}` : '/api/listings/create';
            const method = editData ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Authorization': `Bearer ${token}` },
                body: data
            });

            if (response.ok) {
                const result = await response.json();
                setIsSuccess(true);
                onCreated(result, !!editData);
                setTimeout(() => {
                    onClose();
                    setIsSuccess(false);
                }, 1500);
            } else {
                const errData = await response.json();
                alert(errData.error || errData.message || "Failed to save asset");
            }
        } catch (error) {
            console.error(error);
            alert("Connection error");
        } finally {
            setLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="fixed inset-0 z-[100] bg-gray-900/40 backdrop-blur-md flex items-center justify-center p-4">
                <div className="bg-white rounded-[2rem] w-full max-w-md p-12 text-center shadow-2xl animate-in zoom-in-95 duration-300">
                    <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
                        <FiCheckCircle />
                    </div>
                    <h2 className="text-3xl font-bold playfair-display text-gray-900 mb-2">Success!</h2>
                    <p className="text-gray-500">Your luxury listing has been {editData ? 'updated' : 'created'} successfully.</p>
                </div>
            </div>
        );
    }

    const handleCheckboxToggle = (listName, value) => {
        setFormData(prev => {
            const currentList = prev[listName] || [];
            if (currentList.includes(value)) {
                return { ...prev, [listName]: currentList.filter(item => item !== value) };
            } else {
                return { ...prev, [listName]: [...currentList, value] };
            }
        });
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold playfair-display">{editData ? 'Edit Listing' : 'Create New Listing'}</h2>
                    <button onClick={handleCloseAttempt} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <FiX className="text-xl" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col space-y-2">
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">Price ($)</label>
                            <input 
                                type="number" 
                                name="price" 
                                placeholder={formData.isPriceOnRequest ? "Price on Request" : "Enter Price"}
                                value={formData.price} 
                                required={false}
                                disabled={formData.isPriceOnRequest}
                                className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-black transition-colors disabled:opacity-50 disabled:bg-gray-100" 
                                onChange={handleInputChange} 
                            />
                            <div className="relative">
                                <select 
                                    name="isPriceOnRequest" 
                                    value={formData.isPriceOnRequest} 
                                    className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-black appearance-none cursor-pointer pr-10 text-xs font-bold uppercase tracking-wider text-gray-600"
                                    onChange={(e) => setFormData({ ...formData, isPriceOnRequest: e.target.value === 'true' })}
                                >
                                    <option value="false">Display Public Price</option>
                                    <option value="true">Price on Request</option>
                                </select>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                    <FiChevronDown />
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">{formData.category === 'Estate' ? 'Title *' : 'Title'}</label>
                            <input type="text" name="title" value={formData.title} required={formData.category === 'Estate'} className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-black transition-colors" onChange={handleInputChange} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Category</label>
                            <div className="relative">
                                <select name="category" value={formData.category} disabled={!!editData} className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-black disabled:opacity-50 appearance-none" onChange={handleInputChange}>
                                    <option value="Car">Car</option>
                                    <option value="Bike">Bike</option>
                                    <option value="Yacht">Yacht</option>
                                    <option value="Estate">Real Estate</option>
                                </select>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                    <FiChevronDown />
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Listing Type</label>
                            <div className="relative">
                                <select name="type" value={formData.type} className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-black appearance-none" onChange={handleInputChange}>
                                    <option value="Sale">For Sale</option>
                                    <option value="Rent">For Rent</option>
                                </select>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                    <FiChevronDown />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#FAFBFB] p-6 rounded-2xl border border-gray-100 space-y-4 shadow-sm">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Asset ID (Listing Reference)</label>
                            <div className="flex items-center gap-6">
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <input 
                                        type="radio" 
                                        name="idMode" 
                                        checked={!formData.autoGenerateId} 
                                        onChange={() => setFormData(prev => ({ ...prev, autoGenerateId: false }))}
                                        className="w-4 h-4 border-gray-300 text-[#D48D2A] focus:ring-[#D48D2A] cursor-pointer" 
                                    />
                                    <span className="text-[11px] font-bold text-gray-600 uppercase tracking-wider group-hover:text-black transition-colors">I have an ID</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <input 
                                        type="radio" 
                                        name="idMode" 
                                        checked={formData.autoGenerateId} 
                                        onChange={() => {
                                            setFormData(prev => ({ ...prev, autoGenerateId: true }));
                                            handleGenerateId();
                                        }}
                                        className="w-4 h-4 border-gray-300 text-[#D48D2A] focus:ring-[#D48D2A] cursor-pointer" 
                                    />
                                    <span className="text-[11px] font-bold text-gray-600 uppercase tracking-wider group-hover:text-black transition-colors">Generate ID</span>
                                </label>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-3">
                            <input 
                                type="text" 
                                name="listingReference" 
                                value={formData.listingReference} 
                                placeholder="e.g. #NJM8314201"
                                className="flex-1 p-3.5 bg-white rounded-xl border border-gray-200 focus:outline-none focus:border-[#D48D2A] transition-all font-mono text-sm shadow-sm"
                                onChange={handleInputChange} 
                                readOnly={formData.autoGenerateId}
                            />
                            {formData.autoGenerateId && (
                                <button 
                                    type="button"
                                    onClick={handleGenerateId}
                                    className="px-8 py-3.5 bg-gray-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-black transition-all whitespace-nowrap shadow-lg shadow-black/10"
                                >
                                    Generate ID
                                </button>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Location</label>
                        <LocationInputField value={formData.location} onChange={handleInputChange} />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Description</label>
                        <textarea name="description" value={formData.description} rows="3" required className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-black transition-colors" onChange={handleInputChange}></textarea>
                    </div>

                    {/* Category Specific Fields */}
                    <div className="pt-4 border-t border-gray-100">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-4">{formData.category} Specifications</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {formData.category === 'Car' && (
                                <>
                                    <InputField label="Horsepower" name="horsepower" value={formData.horsepower} onChange={handleInputChange} required={false} />
                                    <InputField label="Engine Capacity (L)" name="cylinderCapacity" value={formData.cylinderCapacity} onChange={handleInputChange} required={false} />
                                    <InputField label="Top Speed (Optional)" name="topSpeed" value={formData.topSpeed} onChange={handleInputChange} required={false} />
                                    <SelectField label="Fuel Type" name="fuelType" value={formData.fuelType} options={['Gasoline', 'Diesel', 'Hybrid', 'Electric']} onChange={handleInputChange} required={false} />
                                    <SelectField label="Transmission" name="transmission" value={formData.transmission} options={['Automatic', 'Manual', 'PDK', 'F1']} onChange={handleInputChange} required={false} />
                                    <SelectField label="Drive Type" name="driveType" value={formData.driveType} options={['AWD', 'RWD', 'FWD', '4WD']} onChange={handleInputChange} required={false} />
                                    <InputField label="Body Type" name="bodyType" value={formData.bodyType} onChange={handleInputChange} required={false} />
                                    <InputField label="Series" name="series" value={formData.series} onChange={handleInputChange} required={false} />
                                    <InputField label="Variant" name="variant" value={formData.variant} onChange={handleInputChange} required={false} />
                                    <SelectField label="Steering" name="steering" value={formData.steering} options={['Left Hand Drive', 'Right Hand Drive']} onChange={handleInputChange} required={false} />
                                    <InputField label="Exterior Color" name="exteriorColor" value={formData.exteriorColor} onChange={handleInputChange} required={false} />
                                    <InputField label="Interior Color" name="interiorColor" value={formData.interiorColor} onChange={handleInputChange} required={false} />
                                    <InputField label="Interior Material" name="interiorMaterial" value={formData.interiorMaterial} onChange={handleInputChange} required={false} />
                                    <InputField label="Manufacturer Color Code" name="manufacturerColorCode" value={formData.manufacturerColorCode} onChange={handleInputChange} required={false} />
                                    <SelectField label="Matching Numbers" name="matchingNumbers" value={formData.matchingNumbers} options={['Yes', 'No']} onChange={handleInputChange} required={false} />
                                    <SelectField label="Accident Free" name="accidentFree" value={formData.accidentFree} options={['Yes', 'No']} onChange={handleInputChange} required={false} />
                                    <SelectField label="Accident History" name="accidentHistory" value={formData.accidentHistory} options={['None', 'Minor', 'Repaired']} onChange={handleInputChange} required={false} />
                                    <InputField label="Latitude" name="latitude" value={formData.latitude} placeholder="e.g., 34.0522" onChange={handleInputChange} required />
                                    <InputField label="Longitude" name="longitude" value={formData.longitude} placeholder="e.g., -118.2437" onChange={handleInputChange} required />
                                </>
                            )}

                            {formData.category === 'Bike' && (
                                <>
                                    <InputField label="Engine Capacity (cc)" name="engineCapacity" type="number" value={formData.engineCapacity} onChange={handleInputChange} required={false} />
                                    <InputField label="Max Power" name="maxPower" value={formData.maxPower} onChange={handleInputChange} required={false} />
                                    <InputField label="Max Torque" name="maxTorque" value={formData.maxTorque} onChange={handleInputChange} required={false} />
                                    <SelectField label="Fuel Type" name="fuelType" value={formData.fuelType} options={['Petrol', 'Electric', 'Hybrid']} onChange={handleInputChange} required={false} />
                                    <SelectField label="Transmission" name="transmission" value={formData.transmission} options={['Manual', 'Automatic', 'Semi-Automatic']} onChange={handleInputChange} required={false} />
                                    <InputField label="Color" name="color" value={formData.color} onChange={handleInputChange} required={false} />
                                    <SelectField label="ABS" name="abs" value={formData.abs} options={['Yes', 'No']} onChange={handleInputChange} required={false} />
                                    <SelectField label="Traction Control" name="tractionControl" value={formData.tractionControl} options={['Yes', 'No']} onChange={handleInputChange} required={false} />
                                    <InputField label="Ownership Count" name="ownershipCount" type="number" value={formData.ownershipCount} onChange={handleInputChange} required={false} />
                                    <SelectField label="Accident History" name="accidentHistory" value={formData.accidentHistory} options={['None', 'Minor', 'Repaired']} onChange={handleInputChange} required={false} />
                                    <InputField label="Latitude" name="latitude" value={formData.latitude} placeholder="e.g., 34.0522" onChange={handleInputChange} required />
                                    <InputField label="Longitude" name="longitude" value={formData.longitude} placeholder="e.g., -118.2437" onChange={handleInputChange} required />
                                </>
                            )}

                            {formData.category === 'Yacht' && (
                                <>
                                    <InputField label="Builder" name="builder" value={formData.builder} onChange={handleInputChange} required={false} />
                                    <InputField label="Length (m)" name="yachtLength" type="number" value={formData.yachtLength} onChange={handleInputChange} required={false} />
                                    <InputField label="Beam (m)" name="yachtBeam" type="number" value={formData.yachtBeam} onChange={handleInputChange} required={false} />
                                    <InputField label="Draft (m)" name="yachtDraft" type="number" value={formData.yachtDraft} onChange={handleInputChange} required={false} />
                                    <InputField label="Engine Type" name="yachtEngineType" value={formData.yachtEngineType} onChange={handleInputChange} required={false} />
                                    <InputField label="Cruising Speed (knots)" name="yachtCruisingSpeed" type="number" value={formData.yachtCruisingSpeed} onChange={handleInputChange} required={false} />
                                    <InputField label="Top Speed (knots)" name="yachtTopSpeed" type="number" value={formData.yachtTopSpeed} onChange={handleInputChange} required={false} />
                                    <InputField label="Usage Hours" name="yachtUsageHours" value={formData.yachtUsageHours} onChange={handleInputChange} required={false} />
                                    <InputField label="Fuel Consumption" name="yachtFuelConsumption" value={formData.yachtFuelConsumption} onChange={handleInputChange} required={false} />
                                    <InputField label="Guest Capacity" name="yachtGuestCapacity" type="number" value={formData.yachtGuestCapacity} onChange={handleInputChange} required={false} />
                                    <InputField label="Crew Capacity" name="yachtCrewCapacity" type="number" value={formData.yachtCrewCapacity} onChange={handleInputChange} required={false} />
                                    <SelectField label="Fuel Type" name="fuelType" value={formData.fuelType} options={['Diesel', 'Gasoline', 'Hybrid', 'Electric']} onChange={handleInputChange} required={false} />
                                    <SelectField label="Hull Material" name="yachtHullMaterial" value={formData.yachtHullMaterial} options={['Fiberglass', 'Steel', 'Aluminum', 'Carbon Fiber', 'Wood']} onChange={handleInputChange} required={false} />
                                    <InputField label="Interior Material" name="interiorMaterial" value={formData.interiorMaterial} onChange={handleInputChange} required={false} />
                                    <InputField label="Exterior Color" name="yachtExteriorColor" value={formData.yachtExteriorColor} onChange={handleInputChange} required={false} />
                                    <InputField label="Number of Owners" name="yachtNumberOfOwners" type="number" value={formData.yachtNumberOfOwners} onChange={handleInputChange} required={false} />
                                    <InputField label="Latitude" name="latitude" value={formData.latitude} placeholder="e.g., 34.0522" onChange={handleInputChange} required />
                                    <InputField label="Longitude" name="longitude" value={formData.longitude} placeholder="e.g., -118.2437" onChange={handleInputChange} required />
                                </>
                            )}

                            {formData.category === 'Estate' && (
                                <>
                                    <SelectField label="Property Type" name="propertyType" value={formData.propertyType} options={['Villa', 'Penthouse', 'Apartment', 'Mansion', 'Estate']} onChange={handleInputChange} required={false} />
                                    <InputField label="Built-up Area (sq ft)" name="builtUpArea" type="number" value={formData.builtUpArea} onChange={handleInputChange} required={false} />
                                    <InputField label="Land Area (sq ft)" name="landArea" type="number" value={formData.landArea} onChange={handleInputChange} required={false} />
                                    <InputField label="Bedrooms" name="bedrooms" type="number" value={formData.bedrooms} onChange={handleInputChange} required={false} />
                                    <InputField label="Bathrooms" name="bathrooms" type="number" value={formData.bathrooms} onChange={handleInputChange} required={false} />
                                    <InputField label="Floors" name="floors" type="number" value={formData.floors} onChange={handleInputChange} required={false} />
                                    <InputField label="Garage Capacity (Cars)" name="garageCapacity" type="number" value={formData.garageCapacity} onChange={handleInputChange} required={false} />
                                    <SelectField label="Furnishing Status" name="furnishingStatus" value={formData.furnishingStatus} options={['Unfurnished', 'Partially Furnished', 'Fully Furnished', 'Designer Furnished']} onChange={handleInputChange} required={false} />
                                    <InputField label="Configuration" name="configuration" value={formData.configuration} placeholder="e.g. 5BR + Study" onChange={handleInputChange} required={false} />
                                    <InputField label="Architecture Style" name="architectureStyle" value={formData.architectureStyle} onChange={handleInputChange} required={false} />
                                    <InputField label="Interior Material" name="interiorMaterial" value={formData.interiorMaterial} onChange={handleInputChange} required={false} />
                                    <InputField label="Interior Color Theme" name="interiorColorTheme" value={formData.interiorColorTheme} onChange={handleInputChange} required={false} />
                                    <InputField label="Exterior Finish" name="exteriorFinish" value={formData.exteriorFinish} onChange={handleInputChange} required={false} />
                                    <InputField label="Climate Control" name="climateControl" value={formData.climateControl} onChange={handleInputChange} required={false} />
                                    <SelectField label="Usage Status" name="usageStatus" value={formData.usageStatus} options={['Vacant', 'Owner Occupied', 'Tenanted']} onChange={handleInputChange} required={false} />
                                    <InputField label="Country" name="country" value={formData.country} onChange={handleInputChange} required={false} />
                                    <InputField label="City" name="city" value={formData.city} onChange={handleInputChange} required={false} />
                                    <InputField label="Address" name="address" value={formData.address} onChange={handleInputChange} required={false} />
                                    <InputField label="Area / Neighborhood" name="areaNeighborhood" value={formData.areaNeighborhood} onChange={handleInputChange} required={false} />
                                    <InputField label="Latitude" name="latitude" value={formData.latitude} onChange={handleInputChange} required />
                                    <InputField label="Longitude" name="longitude" value={formData.longitude} onChange={handleInputChange} required />
                                </>
                            )}
                        </div>

                        {formData.category === 'Estate' && (
                            <div className="mt-8 space-y-6">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Amenities</label>
                                    <div className="flex flex-wrap gap-2">
                                        {['Pool', 'Garden', 'Parking', 'Security', 'Smart Home', 'Gym', 'Wine Cellar', 'Home Theater', 'Elevator'].map(item => (
                                            <button
                                                key={item}
                                                type="button"
                                                onClick={() => handleCheckboxToggle('amenities', item)}
                                                className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all ${formData.amenities.includes(item) ? 'bg-black text-white border-black' : 'bg-white text-gray-600 border-gray-200 hover:border-black'}`}
                                            >
                                                {item}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Smart Home Systems</label>
                                    <div className="flex flex-wrap gap-2">
                                        {['Lighting', 'Climate', 'Security', 'Entertainment', 'Voice Assistant', 'Blinds'].map(item => (
                                            <button
                                                key={item}
                                                type="button"
                                                onClick={() => handleCheckboxToggle('smartHomeSystems', item)}
                                                className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all ${formData.smartHomeSystems.includes(item) ? 'bg-black text-white border-black' : 'bg-white text-gray-600 border-gray-200 hover:border-black'}`}
                                            >
                                                {item}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">View Types</label>
                                    <div className="flex flex-wrap gap-2">
                                        {['Sea', 'City', 'Marina', 'Mountain', 'Golf', 'Park', 'River'].map(item => (
                                            <button
                                                key={item}
                                                type="button"
                                                onClick={() => handleCheckboxToggle('viewTypes', item)}
                                                className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all ${formData.viewTypes.includes(item) ? 'bg-black text-white border-black' : 'bg-white text-gray-600 border-gray-200 hover:border-black'}`}
                                            >
                                                {item}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Key Highlights (Key Specification) Section */}
                    <div className="pt-4 border-t border-gray-100">
                        <div className="flex flex-col mb-4">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900">Key Highlights</h3>
                            <p className="text-xs text-gray-400 italic">These specific details will be highlighted on your listing</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {formData.category === 'Car' && (
                                <>
                                    <InputField label="Top Speed (mph) *" name="highlight_speed" value={formData.highlight_speed} placeholder="e.g. 211" onChange={handleInputChange} required={true} />
                                    <InputField label="Engine Type" name="highlight_engine_type" value={formData.highlight_engine_type} placeholder="e.g. V12" onChange={handleInputChange} required />
                                    <InputField label="Horsepower (hp)" name="highlight_hp" value={formData.highlight_hp} placeholder="e.g. 789" onChange={handleInputChange} required />
                                </>
                            )}
                            {formData.category === 'Yacht' && (
                                <>
                                    <InputField label="Length (M)" name="highlight_length" value={formData.highlight_length} placeholder="e.g. 27" onChange={handleInputChange} required />
                                    <InputField label="Bathrooms" name="highlight_baths" value={formData.highlight_baths} placeholder="e.g. 6" onChange={handleInputChange} required />
                                    <InputField label="Fuel Capacity (L)" name="highlight_fuel" value={formData.highlight_fuel} placeholder="e.g. 9500" onChange={handleInputChange} required />
                                    <InputField label="Engine (HP total)" name="highlight_engine_hp" value={formData.highlight_engine_hp} placeholder="e.g. 3800" onChange={handleInputChange} required />
                                    <InputField label="Bedrooms" name="highlight_beds" value={formData.highlight_beds} placeholder="e.g. 7" onChange={handleInputChange} required />
                                    <InputField label="Top Speed (knots)" name="highlight_speed" value={formData.highlight_speed} placeholder="e.g. 28" onChange={handleInputChange} required />
                                </>
                            )}
                            {formData.category === 'Estate' && (
                                <>
                                    <InputField label="Land Area (Acres)" name="highlight_area" value={formData.highlight_area} placeholder="e.g. 0.5" onChange={handleInputChange} required />
                                    <InputField label="Bathrooms" name="highlight_baths" value={formData.highlight_baths} placeholder="e.g. 6" onChange={handleInputChange} required />
                                    <InputField label="Garage (Cars)" name="highlight_garage" value={formData.highlight_garage} placeholder="e.g. 3" onChange={handleInputChange} required />
                                    <InputField label="Built Area (Sq Ft)" name="highlight_built_area" value={formData.highlight_built_area} placeholder="e.g. 6500" onChange={handleInputChange} required />
                                    <InputField label="Bedrooms" name="highlight_beds" value={formData.highlight_beds} placeholder="e.g. 5" onChange={handleInputChange} required />
                                    <InputField label="Floors" name="highlight_floors" value={formData.highlight_floors} placeholder="e.g. 3" onChange={handleInputChange} required />
                                </>
                            )}
                            {formData.category === 'Bike' && (
                                <>
                                    <InputField label="Engine (cc)" name="highlight_cc" value={formData.highlight_cc} placeholder="e.g. 803" onChange={handleInputChange} required />
                                    <InputField label="Top Speed (km/h)" name="highlight_speed" value={formData.highlight_speed} placeholder="e.g. 175" onChange={handleInputChange} required />
                                    <InputField label="Fuel Capacity (L)" name="highlight_fuel" value={formData.highlight_fuel} placeholder="e.g. 13.5" onChange={handleInputChange} required />
                                </>
                            )}
                        </div>
                    </div>

                    {/* Media Upload Section */}
                    <div className="space-y-6 pt-4 border-t border-gray-100">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-4">Media & Documents</h3>

                        {/* Image Upload */}
                        <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-400">
                                    <FiUploadCloud />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-gray-900">Asset Images</h4>
                                    <p className="text-xs text-gray-400">Upload high-quality images (Max 15)</p>
                                </div>
                            </div>

                            {/* Show existing images if editing */}
                            {editData && existingImages.length > 0 && (
                                <div className="mb-6">
                                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Current Images</label>
                                    <div className="grid grid-cols-5 gap-3">
                                        {existingImages.map((img, idx) => (
                                            <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-gray-100 group">
                                                <img src={img} alt="" className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <span className="text-[8px] text-white font-bold uppercase tracking-wider">Existing</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <p className="text-[10px] text-amber-600 mt-3 font-bold uppercase tracking-wider bg-amber-50 p-2 rounded-lg border border-amber-100">
                                        ⚠️ Uploading new images will replace all current ones.
                                    </p>
                                </div>
                            )}

                            <label className="block">
                                <input type="file" multiple accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, 'images')} />
                                <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 cursor-pointer transition-all hover:border-black hover:bg-white group text-center">
                                    <div className="flex flex-col items-center gap-2 text-gray-400 group-hover:text-black">
                                        <FiUploadCloud className="text-2xl" />
                                        <p className="text-xs font-bold uppercase tracking-widest">Click to upload images</p>
                                    </div>
                                </div>
                            </label>

                            {images.length > 0 && (
                                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {images.map((file, idx) => (
                                        <div key={idx} className="relative group aspect-video rounded-xl overflow-hidden border border-emerald-100 shadow-sm">
                                            <img 
                                                src={typeof file === 'string' ? file : URL.createObjectURL(file)} 
                                                alt={file.name || 'image'} 
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2 text-center">
                                                <p className="text-[8px] text-white font-bold truncate w-full mb-1">{file.name}</p>
                                                <button 
                                                    type="button" 
                                                    onClick={() => handleRemoveFile(idx, 'images')}
                                                    className="bg-white/20 hover:bg-red-500 text-white p-1 rounded-lg transition-all"
                                                >
                                                    <FiX className="text-sm" />
                                                </button>
                                            </div>
                                            <div className="absolute top-1 right-1 w-4 h-4 rounded bg-emerald-500 flex items-center justify-center text-white shadow-sm">
                                                <FiCheckCircle className="text-[10px]" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="mt-6">
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Video URL (YouTube/Vimeo)</label>
                            <input 
                                type="text" 
                                name="videoUrl" 
                                value={formData.videoUrl} 
                                placeholder="https://youtube.com/watch?v=..." 
                                className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-black transition-colors" 
                                onChange={handleInputChange} 
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex gap-4">
                        <button type="button" onClick={handleCloseAttempt} className="flex-1 py-4 bg-gray-100 text-gray-500 font-bold uppercase tracking-widest rounded-xl hover:bg-gray-200 transition-all">
                            Cancel
                        </button>
                        <button disabled={loading} type="submit" className="flex-1 py-4 bg-black text-white font-bold uppercase tracking-widest rounded-xl hover:bg-gray-800 transition-all disabled:opacity-50">
                            {loading ? 'Processing...' : (editData ? 'Update Listing' : 'Submit Listing')}
                        </button>
                    </div>
                </form>
            </div>

            {/* Draft Confirmation Modal */}
            {showDraftConfirm && (
                <div className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2rem] w-full max-w-md p-8 shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mb-6 text-2xl">
                            <FiInfo />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Save as Draft?</h3>
                        <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                            You have unsaved changes. Would you like to save this asset as a draft so you can finish it later?
                        </p>
                        <div className="flex flex-col gap-3">
                            <button 
                                onClick={saveAsDraft}
                                disabled={loading}
                                className="w-full py-4 bg-black text-white font-bold uppercase text-xs tracking-widest rounded-xl hover:bg-gray-800 transition-all disabled:opacity-50"
                            >
                                {loading ? 'Saving Draft...' : 'Yes, Save as Draft'}
                            </button>
                            <button 
                                onClick={onClose}
                                className="w-full py-4 bg-gray-50 text-red-500 font-bold uppercase text-xs tracking-widest rounded-xl hover:bg-red-50 transition-all border border-gray-100"
                            >
                                Discard Changes
                            </button>
                            <button 
                                onClick={() => setShowDraftConfirm(false)}
                                className="w-full py-4 bg-white text-gray-400 font-bold uppercase text-xs tracking-widest rounded-xl hover:text-gray-600 transition-all"
                            >
                                Keep Editing
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const InputField = ({ label, name, value, type = "text", placeholder, onChange, required = false }) => (
    <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">{label}</label>
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-black transition-colors"
        />
    </div>
);

const SelectField = ({ label, name, value, options, onChange, required = false }) => (
    <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">{label}</label>
        <div className="relative">
            <select
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-black cursor-pointer appearance-none"
            >
                <option value="">Select {label}</option>
                {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <FiChevronDown />
            </div>
        </div>
    </div>
);

const LocationInputField = ({ value, onChange }) => {
    const [suggestions, setSuggestions] = React.useState([]);
    const [showSuggestions, setShowSuggestions] = React.useState(false);
    const locationRef = React.useRef(null);

    React.useEffect(() => {
        const handler = setTimeout(async () => {
            if (value && value.length > 0) {
                try {
                    const response = await fetch(`/api/assets/location-suggestions?q=${encodeURIComponent(value)}`);
                    const data = await response.json();
                    setSuggestions(Array.isArray(data) ? data : []);
                } catch (error) {
                    console.error("Failed to fetch location suggestions", error);
                }
            } else {
                setSuggestions([]);
            }
        }, 300);

        return () => clearTimeout(handler);
    }, [value]);

    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (locationRef.current && !locationRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={locationRef}>
            <input
                type="text"
                name="location"
                value={value}
                required={false} 

                onChange={(e) => {
                    onChange(e);
                    setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-black transition-colors"
                autoComplete="off"
            />
            {showSuggestions && suggestions.length > 0 && (
                <ul className="absolute z-[110] w-full bg-white border border-gray-100 rounded-xl mt-2 shadow-2xl left-0 p-2 overflow-hidden max-h-64 overflow-y-auto">
                    {suggestions.map((s, idx) => {
                        const labelText = typeof s === 'string' ? s : s.value;
                        return (
                            <li
                                key={idx}
                                className="p-3 rounded-lg hover:bg-gray-50 cursor-pointer text-gray-600 text-sm font-medium transition-colors"
                                onClick={() => {
                                    onChange({ target: { name: 'location', value: labelText, type: 'text' } });
                                    setShowSuggestions(false);
                                }}
                            >
                                {labelText}
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
};

export default CreateListingModal;
