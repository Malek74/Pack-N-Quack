import Amadeus from "amadeus";

export const listHotels = async (req, res) => {
    const cityName = req.body.cityName;

    const amadeus = new Amadeus({
        clientId: process.env.AMADEUS_API_KEY,
        clientSecret: process.env.AMADEUS_API_SECRET
    });

    // Function to get IATA code dynamically
    const response = await amadeus.referenceData.locations.get({
        keyword: cityName,
        subType: "CITY",
    });

    const cities = await amadeus.referenceData.location.cities
    const cityData = JSON.parse(response.body).data[0];
    console.log(cityData);

    try {
        const response = await amadeus.referenceData.locations.hotels.byCity.get({
            cityCode: cityData.cityCode,
        });
        const data = JSON.parse(response.body).data;
        return res.json(data);
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
}