###
The MIT License (MIT)

Copyright (c) <2015> Dominik Winter <info at edge-project.org>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
###

fs      = require "fs"
crypto  = require "crypto"
http    = require "http"
request = require "request"
cheerio = require "cheerio"
async   = require "async"
xlsx    = require "node-xlsx"
config  = require "./config"


# create cache files
async.concatSeries [
        "#{__dirname}/cache"
        "#{__dirname}/cache/search"
        "#{__dirname}/cache/cars"
    ],
    (dir, next) ->
        fs.exists dir, (exists) ->
            if exists
                next() # it's ok
            else
                fs.mkdir dir, "2777", next
    (err) ->
        throw err if err
        console.info "cache tree created successfully"


###
# unique array
#
# @see https://coffeescript-cookbook.github.io/chapters/arrays/removing-duplicate-elements-from-arrays
###
Array::unique = ->
    console.info "=== Array::unique"

    output = {}
    output[@[key]] = @[key] for key in [0...@length]
    value for key, value of output

###
# parse html and extract content
#
# @param Error err
# @param String html
# @param Integer id
# @param String filename
# @param function cb(Error err, Object data)
###
parseHtml = (err, html, id, filename, cb) ->
    console.info "=== parseHtml"

    if err
        return cb err
    else
        $ = cheerio.load html

        console.info "done"
        console.info "retrieving data"

        $mainTechnicalData = $ ".mainTechnicalData p"

        if $mainTechnicalData.length is 0
            return cb Error("#{id} doesn't exist anymore. please delete cache files."), null

        $secondData = []

        $mainTechnicalData.each () ->
            $cur = $ this

            if $cur.has("strong").length is 0
                $secondData.push $cur.text().trim()

        console.info $secondData

        data =
            data:
                url:                "http://suchen.mobile.de/fahrzeuge/details.html?id=#{id}"
                price:              $(".mainInfo .pricePrimaryCountryOfSale").text().replace(" (Brutto)", "").trim()

                title:              $("h1").eq(0).text().trim()
                registration_date:  $secondData[0]
                mileage:            $secondData[1]
                mileage:            $secondData[1]
                fuels:              $secondData[2]
                power:              $secondData[3]
                transmissions:      $secondData[4]

            interior: $(".interior li span").map(() -> $(this).text().trim()).get()
            exterior: $(".exterior li span").map(() -> $(this).text().trim()).get()
            extras:   $(".extras   li span").map(() -> $(this).text().trim()).get()
            safety:   $(".safety   li span").map(() -> $(this).text().trim()).get()

        fs.writeFile filename, "module.exports = " + JSON.stringify(data, null, 4), (err) ->
            console.error "couldn't write cache file to", filename if err

        cb err, data

###
# provide request if not yet cached
#
# @param Integer id
# @param function cb(Error err, Object data)
###
doRequest = (id, cb) ->
    console.info "=== doRequest"

    file = "#{__dirname}/cache/cars/#{id}"

    fs.exists "#{file}.js", (exists) ->
        if exists
            console.info "load cache file", file

            cb null, require file
        else
            url = "http://suchen.mobile.de/fahrzeuge/details.html?id=#{id}"

            console.info "request", url

            request {
                "url":  url
                "gzip": true
                "headers":
                    "Accept":           "text/html,application/xhtml+xml,application/xml"
                    "User-Agent":       "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36"
                    "Accept-Encoding":  "gzip, deflate, sdch"
                    "Accept-Language":  config.language + ",de;q=0.8,en-US;q=0.6,en;q=0.4"
                    "Cookie":           "featureVariant.copenhagen.1=NO_VARIANT; psv=b; featureVariant.recommendationEvaluation.1=NO_VARIANT; featureVariant.CallButtonABtest.1=NO_VARIANT; __utma=1.477301246.1426285825.1426396968.1426396968.1; globalSessionId=5c379adf-3612-4c80-bcf4-87700d40700a; via=google; loc=DE|50.4262|8.6639; screenWidthCookie=1440; JSESSIONID=36399062CF7BD2B7CB9CB5A8BE4A7631.search46-2_i07_3007; recent=205220350%2C190869164%2C204351322%2C131474296%2C200015864%2C201103843%2C196035740%2C207542649%2C203302749%2C198499705; POPUPCHECK=1428098261509; _ga=GA1.2.477301246.1426285825; _gat=1; _m_u=8d32b260-89f5-453b-b5dd-8d87b9884172; nuggAdCookie=001%7C006%7C012%7C014%7C024%7C031%7C032%7C035%7C038%7C042%7C044%7C051%7C063%7C068%7C073%7C075%7C077%7C081%7C092%7C095%7C096%7C099%7C100%7C103%7C105%7C106%7C108%7C110%7C112%7C114%7C116%7C119%7C121%7C123%7C125%7C999"
            }, (err, response, html) ->
                console.info "response", url
                parseHtml err, html, id, "#{file}.js", cb

###
# tranform data object to array
#
# @param Object
# @return Array
###
tranformDataToArray = (data) ->
    console.info "=== tranformDataToArray"

    sections = [
        "interior"
        "exterior"
        "extras"
        "safety"
    ]

    possible_section = {}

    # initiate possible sections
    for s in sections
        possible_section[s] = []

    # fill possible sections
    for cur in data
        for s in sections
            possible_section[s].push cur[s]...

    # unique possible sections
    for s in sections
        possible_section[s] = possible_section[s].unique()

    cars = []

    # if present set X else O
    for d in data
        car = d.data

        for s in sections
            for cur in possible_section[s]
                car[cur] = if d[s].indexOf(cur) is -1 then "O" else "X"

        cars.push car

    ## remove columns that have all the same content in cells
    #for key, value of cars[0]
    #    values = []
    #
    #    for car in cars
    #        values.push(car[key])
    #
    #    if values.unique().length is 1
    #        for car in cars
    #            delete car[key]

    data = []
    row  = []

    # write exel header
    for key, value of cars[0]
        row.push key

    data.push row

    # write exel rows
    for car in cars
        row = []

        for key, value of car
            row.push value

        data.push row

    data


sendData = (err, res, data) ->
    console.info "=== sendData"

    res.writeHead 200, {
        #"Content-Type": "text/plain; charset=utf-8"
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; charset=utf-8"
    }

    #res.end JSON.stringify data, null, 4
    res.end xlsx.build([{ name: "mySheetName", data: tranformDataToArray(data) }]), "binary"


getIds = (url, cb) ->
    console.info "=== getIds"

    request {
        "url": url
        "gzip": true
        "headers":
            "Accept":           "text/html,application/xhtml+xml,application/xml"
            "User-Agent":       "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36"
            "Accept-Encoding":  "gzip, deflate, sdch"
            "Accept-Language":  config.language + ",de;q=0.8,en-US;q=0.6,en;q=0.4"
            "Cookie":           "featureVariant.copenhagen.1=NO_VARIANT; psv=b; featureVariant.recommendationEvaluation.1=NO_VARIANT; featureVariant.CallButtonABtest.1=NO_VARIANT; __utma=1.477301246.1426285825.1426396968.1426396968.1; globalSessionId=5c379adf-3612-4c80-bcf4-87700d40700a; via=google; loc=DE|50.4262|8.6639; screenWidthCookie=1440; JSESSIONID=36399062CF7BD2B7CB9CB5A8BE4A7631.search46-2_i07_3007; recent=205220350%2C190869164%2C204351322%2C131474296%2C200015864%2C201103843%2C196035740%2C207542649%2C203302749%2C198499705; POPUPCHECK=1428098261509; _ga=GA1.2.477301246.1426285825; _gat=1; _m_u=8d32b260-89f5-453b-b5dd-8d87b9884172; nuggAdCookie=001%7C006%7C012%7C014%7C024%7C031%7C032%7C035%7C038%7C042%7C044%7C051%7C063%7C068%7C073%7C075%7C077%7C081%7C092%7C095%7C096%7C099%7C100%7C103%7C105%7C106%7C108%7C110%7C112%7C114%7C116%7C119%7C121%7C123%7C125%7C999"
    }, (err, response, html) ->
        $   = cheerio.load html
        ids = $(".result-items a.btn-static-text-color").map(() ->
            $(this).attr("href").match(/\?id=(\d+)/)[1]
        ).get()

        cb err, { html: html, ids: ids }


http.createServer((req, res) ->
    console.info "=== createServer"

    search_params   = config.search_params
    cache_file      = crypto.createHash("sha256").update(JSON.stringify(search_params)).digest("hex")
    filename        = "#{__dirname}/cache/search/#{cache_file}.js"

    fs.exists filename, (exists) ->
        console.info "=== fs.exists", "#{__dirname}/cache/search/#{cache_file}.js"

        if exists
            ids = require filename

            async.mapLimit ids, 2, doRequest, (err, data) ->
                sendData err, res, data
        else
            search_url = do (search_params) ->
                # search url generated from search params from config file
                console.info "=== search_url"

                "http://suchen.mobile.de/auto/search.html?" + (do () ->
                    for key, value of search_params
                        value = value.join "&#{key}=" if Array.isArray(value)
                        "#{key}=#{value}"
                ).join "&"

            getIds search_url, (err, result) ->
                html    = result.html
                ids     = result.ids
                $       = cheerio.load html
                pages   = $("ul.pagination a").map(() -> "http://suchen.mobile.de/auto/search.html" + $(this).attr("href")).get()

                async.mapLimit pages, 2, getIds, (err, result) ->
                    console.info "=== async.mapLimit"

                    for cur in result
                        ids = ids.concat(cur.ids)

                    ids = ids.unique()

                    fs.writeFile filename, "module.exports = " + JSON.stringify(ids, null, 4), (err) ->
                        console.error "couldn't write cache file to", filename if err

                    async.mapLimit ids, 2, doRequest, (err, data) ->
                        sendData err, res, data
).listen 8081

console.info "listening on localhost:8081"

