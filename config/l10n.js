module.exports = {
    'en': {
        'url': {
            'start': 'https://www.mobile.de/?lang=en',
            'search': 'https://suchen.mobile.de/fahrzeuge/search.html?',
        },
        'browser_language': 'en-GB',
        'mileage': 'Mileage',
        'power': 'Power',
        'first_registration': 'First Registration',
        'features_excludes': [],  // TODO
        'technical_excludes': [
            'Price',
            'Financing',
            'Fuel Consumption',
            'CO2 Emissions',
            'CO2 efficiency',
            'Emission Class',
            'Emissions Sticker',
            'Airbags',
        ], // TOOD
    },
    'de': {
        'url': {
            'start': 'https://www.mobile.de/?lang=de',
            'search': 'https://suchen.mobile.de/fahrzeuge/search.html?',
        },
        'browser_language': 'de-DE',
        'mileage': 'Kilometerstand',
        'power': 'Leistung',
        'first_registration': 'Erstzulassung',
        'features_excludes': [
            'Bordcomputer', 'Elektr. Fensterheber', 'Elektr. Seitenspiegel', 'Elektr. Wegfahrsperre',
            'ESP', 'Isofix (Kindersitzbefestigung)', 'Servolenkung',
            'Traktionskontrolle', 'Tuner/Radio', 'Zentralverriegelung', 'Partikelfilter', 'Nebelscheinwerfer',
            'Nichtraucher-Fahrzeug', 'Tagfahrlicht', 'Regensensor', 'CD-Spieler', 'Dachreling', 'Standheizung',
            'Sportpaket', 'Sportfahrwerk', 'Elektr. Sitzeinstellung', 'Sportsitze', 'Xenonscheinwerfer',
            'MP3-Schnittstelle', 'Lichtsensor', 'Freisprecheinrichtung', 'Multifunktionslenkrad', 'Tempomat',
            'Start/Stopp-Automatik', 'Katalysator', 'Elektrostarter', 'Kategorie',
        ],
        'technical_excludes': [
            'Preis',
            'Finanzierung',
            'Verbrauch',
            'CO2-Emissionen',
            'CO2-Effizienz',
            'Katalysator',
            'Antriebsart',
            'Getriebe',
            'Kategorie',
            'Elektrostarter',
            'Airbags',
            //'Kategorie',
            'Kraftstoffart',
            'Zugr.-lgd. Treibstoffart',
            'Energieeffizienzklasse',
            'Anzahl Sitzplätze',
            'Anzahl der Türen',
            'Schadstoffklasse',
            'Umweltplakette',
            'Klimatisierung',
            'Airbags',
            'Farbe (Hersteller)',
            'Innenausstattung',
            'Fahrzeugnummer',
            'Verfügbarkeit',
            'Baujahr',
            'Herkunft',
            'Hubraum',
            'Fahrzeugzustand', // TODO
        ]
    },
};
