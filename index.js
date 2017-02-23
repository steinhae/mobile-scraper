/**
 * The MIT License (MIT)
 * 
 * Copyright (c) <2015> Dominik Winter <info at edge-project.org>
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

const fs = require('fs');
const request = require('request').defaults({ jar: true });
const cheerio = require('cheerio');
const async = require('async');
const xlsx = require('node-xlsx');

const headers = {
    'Pragma': 'no-cache',
    'Cache-Control': 'no-cache',
    'Upgrade-Insecure-Requests': 1,
    'User-Agent': 'Mozilla/6.1 (Macintosh; ARM Mac OS X 12_12_3) AppleWebKit/737.36 (KHTML, like Gecko) Chrome/62.0.2821.0 Safari/737.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Encoding': 'gzip, deflate, sdch',
    'Accept-Language': 'de-DE;q=0.8,en;q=0.6',
};

const postcode = '35390';

const models = [
    [ 1900,  8], // Audi A3
    [22500,  9], // Seat Leon
//    [13200, 26], // Kia Cee'd
//    [24100, 39], // Toyota Auris
//    [20700, 17], // Renault Megane
//    [11600, 30], // Hyundai i30
    [ 9000, 20], // Ford Focus
    [ 3500, 73], // BMW 1er
//    [19000,  5], // Opel Astra
    [25200, 14], // Volkswagen Golf
    [16800,  4], // Mazda 3
    [16800, 34], // Mazda CX-3
    [16800, 33], // Mazda CX-5    
];

const templasteSearchUrl =
'http://suchen.mobile.de/fahrzeuge/search.html?isSearchRequest=true&scopeId=C&damageUnrepaired=NO_DAMAGE_UNREPAIRED&minFirstRegistrationDate=2015-01-01&' +
'maxMileage=50000&maxPrice=17500&climatisation=AUTOMATIC_CLIMATISATION&features=CRUISE_CONTROL&makeModelVariant1.makeId=#makeId#&makeModelVariant1.modelId=#modelId#&' +
'doorCount=FOUR_OR_FIVE&ambitCountry=DE&zipcode=' + postcode + '&zipcodeRadius=50&fuels=PETROL&fuels=HYBRID&minPowerAsArray=74&maxPowerAsArray=KW&minPowerAsArray=KW';

const _getTechnical = $ => {
    const items = {};

    $('#rbt-td-box .g-row.u-margin-bottom-9').each((k, v) => {
        let key = $(v.children[0]).text().trim();
        let val = $(v.children[1]).text().trim();

        switch (key) {
            case 'Kilometerstand':  key += ' (km)';     val = val.replace(/[^\d]/g, '') * 1;        break;
            case 'Leistung':        key += ' (PS)';     val = val.match(/(\d+)\s+PS/)[1] * 1;       break;
            case 'Erstzulassung':                       val = val.split('/').reverse().join('-');   break;
        }

        items[key] = val;
    })

    return items;
};

const _getFeatures = $ => {
    const items = {};

    $('#rbt-features p').each((k, v) => {
        const key = $(v).text().trim();
        const val = 'X';

        items[key] = val;
    })

    return items;
};

const _handleData = (data) => {
    console.info('cars found:', data.length);

    const possible_technical = [];
    const possible_features = [];

    data.forEach((items) => {
        Object.keys(items.technical).forEach(key => {
            if (possible_technical.indexOf(key) === -1) {
                possible_technical.push(key);
            }
        });

        Object.keys(items.features).forEach(key => {
            if (possible_features.indexOf(key) === -1) {
                possible_features.push(key);
            }
        });
    });

    const excel = [];
    const row = [];

    Object.keys(data[0]).forEach(key => {
        switch (key) {
            case 'technical': return possible_technical.forEach(key => row.push(key));
            case 'features':  return possible_features.forEach(key  => row.push(key));
            default:          return row.push(key);
        }
    });

    excel.push(row);

    data.forEach((items) => {
        const row = [];

        Object.keys(items).forEach((item) => {
            switch (item) {
                case 'technical': return possible_technical.forEach((key) => row.push(items[item][key] || ''));
                case 'features':  return possible_features.forEach((key)  => row.push(items[item][key] || ''));
                default:          return row.push(items[item]);
            }
        });
        
        excel.push(row);
    });

    const stream = fs.createWriteStream('excel.xls', (err) => { if (err) throw err });
    stream.write(xlsx.build([{ name: "mySheetName", data: excel }]));
    stream.end();
};

const _parseResultPage = (url, cb) => {
    console.info('SEARCH GET', url)

    request({
        'url': url,
        'gzip': true,
        'headers': headers
    }, (err, response, html) => {
        if (err) {
            console.error(err, response, html);
            throw err;
        }

        const $ = cheerio.load(html);
        const currentLinks = [];

        $('a.link--muted.no--text--decoration.result-item').each((k, v) => currentLinks.push($(v).attr('href').match(/.+details.html\?id=(\d+)/).slice(0, 2)));

        const next = $('.rbt-page-forward').attr('data-href');

        if (next) {
            _parseResultPage(next, (links) => cb(links.concat(currentLinks)));
        } else {
            cb(currentLinks);
        }
    });
};

const _parseItemPage = (links, next) => {
    console.info("INFO", "_parseItemPage");

    async.mapLimit(links, 2, (info, cb) => {
        const url  = info[0];
        const id   = info[1];
        const file = './cache/' + id + '.json';

        if (fs.exists(file, exists => {
            if (exists) {
                return cb();
            }

            console.info('CAR GET', url);

            request({
                'url': url,
                'gzip': true,
                'headers': headers
            }, (err, response, html) => {
                if (err) {
                    console.error(err, response, html);
                    throw err;
                }

                const $ = cheerio.load(html);
                $('.tooltip-wrapper').remove();

                const data = {
                    'id': id * 1,
                    'title': $('#rbt-ad-title').text().trim(),
                    //'dealer_name': $('#dealer-hp-link-bottom').text().trim(),
                    //'dealer_address': $('#rbt-db-address').text().trim(),
                    //'dealer_phone': $('#rbt-db-phone').text().trim(),
                    //'dealer_no': $('#rbt-db-sku b').text().trim(),
                    'price': $('.rbt-prime-price').text().replace(/[^\d]/g, '').trim() * 1,
                    'technical': _getTechnical($),
                    'features': _getFeatures($)
                };

                fs.writeFile(file, JSON.stringify(data, null, 4), (err) => { if (err) throw err });

                cb();
            });
        }));
    }, () => {
        next();
    });
};


const technical_filter = [
    'Verbrauch',
    'CO2-Emissionen',
    'CO2-Effizienz',
    'Airbags',
    'Kategorie',
    'Kraftstoffart',
    'Zugr.-lgd. Treibstoffart',
    'Energieeffizienzklasse',
    'Anzahl Sitzplätze',
    'Anzahl der Türen',
    'Getriebe',
    'Schadstoffklasse',
    'Umweltplakette',
    'Anzahl der Fahrzeughalter',
    'HU',
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
];

const features_filter = [
    'ABS', 'Bordcomputer', 'Elektr. Fensterheber', 'Elektr. Seitenspiegel', 'Elektr. Wegfahrsperre', 
    'ESP', 'Isofix (Kindersitzbefestigung)', 'Leichtmetallfelgen', 'Servolenkung', 'Tempomat', 
    'Traktionskontrolle', 'Tuner/Radio', 'Zentralverriegelung', 'Partikelfilter', 'Nebelscheinwerfer',
    'Nichtraucher-Fahrzeug', 'Tagfahrlicht', 'Regensensor', 'CD-Spieler', 'Dachreling',
];

fs.existsSync('./cache') || fs.mkdirSync('./cache');

async.mapLimit(models, 2, (model, cb) => {
    const url = templasteSearchUrl.replace('#makeId#', model[0]).replace('#modelId#', model[1]);

    _parseResultPage(url, (links) => {
        _parseItemPage(links, cb);
    });
}, () => {
    fs.readdir('./cache', (err, items) => {
        const data = [];

        items.forEach((item) => {
            let entry = require('./cache/' + item);

            Object.keys(entry.technical).forEach((name) => {
                if (technical_filter.indexOf(name) > -1) {
                    delete entry.technical[name];
                }
            });

            Object.keys(entry.features).forEach((name) => {
                if (features_filter.indexOf(name) > -1) {
                    delete entry.features[name];
                }
            });

            data.push(entry);
        });

        if (!data.length) {
            console.info('nothing to do');
        } else {
            _handleData(data);
        }
    });
});


