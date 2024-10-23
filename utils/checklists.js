const { BadRequestError } = require("../errors");

const getLuggageChecklist = (weatherForecast, duration, reason) => {

    let luggageRecommendation = [];
    let totalCode = 0;
    weatherForecast.forEach(daily => {
        totalCode += daily.weatherCode;
    });
    let averageCode = totalCode / weatherForecast.length;

    const packingListByDuration = {
        5: {
            leasure: [
                "Casual clothing",
                "Toiletries",
                "Comfortable Footwear",
                "Electronics (e.g., phone charger)",
                "Entertainment (e.g., a book)",
                "Small backpack for day trips"
            ],
            business: [
                "Professional Clothing",
                "Toiletries",
                "Laptop",
                "Business Cards",
                "Notepad and Pen",
                "Dress Shoes"
            ]
        },
        10: {
            leasure: [
                "A mix of casual clothing and semi-formal outfits",
                "Full-sized toiletries",
                "Comfortable shoes for walking and evening shoes",
                "Electronics",
                "Travel Guide/Map"
            ],
            business: [
                "Professional Clothing",
                "Full-sized toiletries: Comprehensive grooming kit, including makeup if applicable",
                "Laptop along with necessary chargers and accessories",
                "Business Documents: All necessary contracts, proposals, and presentation materials",
                "Comfortable Professional Footwear"
            ]
        },
        999: {
            leasure: [
                "Enough clothing for various activities",
                "Full-sized toiletries and a basic first-aid kit",
                "Footwear: Multiple pairs of shoes (e.g., casual, formal, hiking)",
                "Electronics",
                "Reusable Water Bottle: Stay hydrated while exploring"
            ],
            business: [
                "Professional Clothing including accessories",
                "Full-sized toiletries including grooming\makeup kit and a first-aid kit",
                "Laptop along with necessary chargers and accessories",
                "Business Documents: All necessary contracts, proposals, and presentation materials",
                "Network Materials: Business cards and marketing materials for presentations",
                "Comfortable Professional Shoes"
            ]
        }
    };

    const packingListByWeather = {
        50: {
            commonItems: [
                "Lightweight clothing",
                "Sunscreen and sunglasses",
                "Comfortable walking shoes"
            ]
        },
        65: {
            commonItems: [
                "Waterproof jackets with hoods",
                "Umbrellas",
                "Waterproof shoes or boots"
            ]
        },
        79: {
            commonItems: [
                "Warm, insulated jackets",
                "Thermal layers",
                "Winter boots with good grip"
            ]
        },
        100: {
            commonItems: [
                "Waterproof jackets",
                "Sturdy shoes (water-resistant if possible)",
                "Flashlights with extra batteries"
            ]
        }
    };
    // let averageCode = 23.6

    const suitableKeyForDuration = Object.keys(packingListByDuration)
        .map(Number)
        .filter(key => key >= Number(duration))
        .sort((a, b) => a - b)
        .shift()
    if (suitableKeyForDuration) {
        luggageRecommendation.push(...packingListByDuration[suitableKeyForDuration][reason]);
    } else {
        throw new BadRequestError("Can't find the suitable packing list!");
    }
    
    const suitableKeyForWeather = Object.keys(packingListByWeather)
        .map(Number)
        .filter(key => key >= Number(averageCode))
        .sort((a, b) => a - b)
        .shift()

    if (suitableKeyForWeather) {
        luggageRecommendation.push(...packingListByWeather[suitableKeyForWeather].commonItems);

    } else {
        throw new BadRequestError("Can't find the suitable packing list!");
    }

    return luggageRecommendation;

};

const getPreparationChecklist = (user, trip, luggage) => {

    const defaultCheckList = {
        transportation: {
            "flight": `URL to check flights from ${user.homecity} to ${trip.destination}`,
            "car": `URL to rent a car in ${trip.destination}`,
        },
        accommodation: {
            "hotel": `URL to search for a hotel in ${trip.destination} for ${trip.duration} days`,
            "airbnb": `URL to search for a apartaments in ${trip.destination} for ${trip.duration} days`,
        },
        planning: {
            "business": "Schedule meetings and meetings rooms",
            "leasure": "Schedule tours, organize sightseeing or parties", 
        },
        documents: {
            "business": "Travel requirements (passports, visas, tickets), Business documents (presentation materials, contracts)",
            "leasure": "Travel requirements (passports, visas, tickets), printed guides",
        },
        packaging: {
            "luggage recommendations": "Clothing and Toiletries",
        },
    };

    const tailoredCheckList = {
        transportation: {
            flight: defaultCheckList.transportation.flight,
            car: defaultCheckList.transportation.car,
        },
        accommodation: {
            hotel: defaultCheckList.accommodation.hotel,
            airbnb: defaultCheckList.accommodation.airbnb,
        },
        planning: {
            [trip.reason]: defaultCheckList.planning[trip.reason],
        },
        documents: {
            [trip.reason]: defaultCheckList.documents[trip.reason],
        },
        packaging: {
            luggage: luggage,
        },
    };

    return tailoredCheckList;
};

module.exports = { getLuggageChecklist, getPreparationChecklist };