import Amadeus from "amadeus";

const cities = [
    { "city": "New York", "iata_code": "JFK" },
    { "city": "Los Angeles", "iata_code": "LAX" },
    { "city": "Chicago", "iata_code": "ORD" },
    { "city": "London", "iata_code": "LHR" },
    { "city": "Paris", "iata_code": "CDG" },
    { "city": "Tokyo", "iata_code": "HND" },
    { "city": "Cairo", "iata_code": "CAI" },
    { "city": "Beijing", "iata_code": "PEK" },
    { "city": "Dubai", "iata_code": "DXB" },
    { "city": "Sydney", "iata_code": "SYD" },
    { "city": "Berlin", "iata_code": "TXL" },
    { "city": "Toronto", "iata_code": "YYZ" },
    { "city": "Mexico City", "iata_code": "MEX" },
    { "city": "Moscow", "iata_code": "SVO" },
    { "city": "Seoul", "iata_code": "ICN" },
    { "city": "Sao Paulo", "iata_code": "GRU" },
    { "city": "Mumbai", "iata_code": "BOM" },
    { "city": "Hong Kong", "iata_code": "HKG" },
    { "city": "Bangkok", "iata_code": "BKK" },
    { "city": "Istanbul", "iata_code": "IST" }

]


export const listHotels = async (req, res) => {
    const cityName = req.body.cityName;

    const amadeus = new Amadeus({
        clientId: process.env.AMADEUS_API_KEY,
        clientSecret: process.env.AMADEUS_API_SECRET
    });

    const cityCode = cities.find(city => city.city === cityName);
    try {
        const response = await amadeus.referenceData.locations.hotels.byCity.get({
            cityCode: cityCode.iata_code
        });
        const data = JSON.parse(response.body).data;
        return res.json(data);
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
}

export const listHotelRooms = async (req, res) => {
    console.log(hotelID, adults, checkInDate, checkOutDate);
    const amadeus = new Amadeus({
        clientId: process.env.AMADEUS_API_KEY,
        clientSecret: process.env.AMADEUS_API_SECRET
    });

    console.log("Parameters received:", { hotelID, adults, checkInDate, checkOutDate });
    let response = {};
    try {
        response = await amadeus.shopping.hotelOffersSearch.get({
            hotelIds: hotelID,
            adults: adults,
            checkInDate: checkInDate,
            checkOutDate: checkOutDate
        });

        const data = JSON.parse(response.body).data;
        if (data.length === 0) {
            return res.status(404).json({ message: "No rooms available for the selected dates" });
        }
        const roomData = data[0].offers;

        let rooms = []
        for (let i = 0; i < roomData.length; i++) {
            const room = {
                hotel: roomData[i].hotel.name,
                type: roomData[i].room.typeEstimated.category,
                beds: roomData[i].room.typeEstimated.beds,
                bedType: roomData[i].room.typeEstimated.bedType,
                description: roomData[i].room.description,
                price: roomData[i].price.total
            }

            rooms.push(room);
        }

        return res.json(rooms);



    } catch (error) {
        // Log the full error for debugging
        console.log(error);

        try {
            const codeError = error.response.result.errors[0].code;
            if (codeError == 3664) return res.status(404).json({ message: "No rooms available for the selected dates" });

        } catch (error) {
            return res.status(404).json({ message: error.message });
        }


    }
};

export const bookRoom = async (req, res) => {
}