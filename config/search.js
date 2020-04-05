module.exports = {
    options: {
        language: 'de', // currently 'en' and 'de' is supported
        ambitCountry: 'DE', // 'DE', 'GB', ...
        zipcode: '35390', // (obviously only in Germany)
        zipcodeRadius: 100, // km (obviously only in Germany)
        // categories: 'NakedBike', // values: NakedBike, EstateCar, etc.
        isSearchRequest: true,
        scopeId: '#scopeId#', // will be replaced with first index in models
        damageUnrepaired: 'NO_DAMAGE_UNREPAIRED',
        // minFirstRegistrationDate: '2016-01-01',
        maxMileage: 50000, // km
        maxPrice: 10000, // €
        // adLimitation: 'ONLY_DEALER_ADS',
        'makeModelVariant1.makeId': '#makeId#', // will be replaced with second index in models
        // fuels: ['PETROL', 'HYBRID'],
        // minPowerAsArray: [150, 'PS'],

    },
    models: [
        ["MB", 24400, '', 'Speed+Triple'],
        // ["MB", 3500,  '', 'S1000R'],
        // ["MB", 23600, '', 'GSX+R+600'],
        // ["MB", 13900, '', '690'],
        // ["MB", 23600, '', 'DR'],

        // ["C", 1900,   9], // Audi A4
        // ["C", 22500,   9, 'fr'], // Seat Leon
        // ["C", 22500,   9, 'Cupra'], // Seat Leon
        // ["C", 24100,  39], // Toyota Auris
        // ["C", 20700,  17], // Renault Megane
        // ["C", 11600,  30], // Hyundai i30
        // ["C", 11600,  33], // Hyundai i40
        // ["C",  9000,  20], // Ford Focus
        // ["C",  3500,  73], // BMW 1er
        // ["C",  3500,  73], // BMW 1er
        // ["C",  3500,   7], // BMW 3er
        // ["C", 19000,   5], // Opel Astra
        // ["C", 25200,  14], // Volkswagen Golf
        // ["C", 11000,   3], // Honda Civic
        // ["C", 11000,   2], // Honda Accord
        // ["C", 16800,   4], // Mazda 3
        // ["C", 16800,   7], // Mazda 6
        // ["C", 16800,  34], // Mazda CX-3
        // ["C", 16800,  33], // Mazda CX-5
        // ["C", 13200,  26], // Kia cee'd
        // ["C", 13200,  31], // Kia cee'd Sportwagon
        // ["C", 13200,  27], // Kia pro_cee'd
        // ["C", 24100,   6], // Toyota Camry
        // ["C", 24100,   9], // Toyota Corolla
        // ["C", 24100,   4], // Toyota Avensis
        // ["C", 22900,  10], // Skoda Octavia
        // ["C", 22900,  12], // Skoda Superb
    ]
};
