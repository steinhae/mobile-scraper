module.exports = {
    options: {
        language: 'en', // currently 'en' and 'de' is supported
        ambitCountry: 'DE', // 'DE', 'GB', ...
        zipcode: '35390', // (obviously only in Germany)
        zipcodeRadius: 55, // km (obviously only in Germany)
        categories: 'EstateCar',
        isSearchRequest: true,
        scopeId: 'C',
        damageUnrepaired: 'NO_DAMAGE_UNREPAIRED',
        minFirstRegistrationDate: '2016-01-01',
        maxMileage: 50000, // km
        maxPrice: 24000, // €
        adLimitation: 'ONLY_DEALER_ADS',
        'makeModelVariant1.makeId': '#makeId#',
        'makeModelVariant1.modelId': '#modelId#',
        fuels: ['PETROL', 'HYBRID'],
        minPowerAsArray: [150, 'PS'],
    },
    models: [
        [ 1900,   8], // Audi A3
        //[ 1900,   9], // Audi A4
        //[22500,   9, 'fr'], // Seat Leon
        //[22500,   9, 'cubra'], // Seat Leon
        //[24100,  39], // Toyota Auris
        //[20700,  17], // Renault Megane
        //[11600,  30], // Hyundai i30
        //[11600,  33], // Hyundai i40
        [ 9000,  20], // Ford Focus
        //[ 3500,  73], // BMW 1er
        //[ 3500,  73], // BMW 1er
        [ 3500,   7], // BMW 3er
        //[19000,   5], // Opel Astra
        //[25200,  14], // Volkswagen Golf
        //[11000,   3], // Honda Civic
        //[11000,   2], // Honda Accord
        [16800,   4], // Mazda 3
        //[16800,   7], // Mazda 6
        //[16800,  34], // Mazda CX-3
        //[16800,  33], // Mazda CX-5
        //[13200,  26], // Kia cee'd
        //[13200,  31], // Kia cee'd Sportwagon
        //[13200,  27], // Kia pro_cee'd
        //[24100,   6], // Toyota Camry
        //[24100,   9], // Toyota Corolla
        //[24100,   4], // Toyota Avensis
        //[22900,  10], // Skoda Octavia
        //[22900,  12], // Skoda Superb
    ]
};
