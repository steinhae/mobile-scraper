## Description

Get content from mobile.de and show it in an excel sheet. You can sort and filter by all columns and find your favourite car faster.

## Installation

Type in your console:

```bash
git clone https://github.com/dominikwinter/mobile-scraper.git
npm install
```

Install selenium executable for your platform according to https://www.npmjs.com/package/selenium-webdriver.

## Usage

1. Edit config/search.js and config/l10n.js files as desired.

2. Type in your console:

```bash
npm start
```
3. Open generated excel_\<language\>.xls

## Advanced Usage

Mobile-scraper downloads and caches each vehicle before it generates the excel list
as a last step. It's possible to skip the downloading part and just generate the excel
list from a user defined cache directory. E.g. you move the downloaded json files
from the cache dir i.e. .cache_\<language\>/ after running the program and just
want to regenerate the excel list.

```bash
npm start <dir_that_contains_json_files>
```

## Legal Regime
Every search engines use equivalent technologies to extract relevant content from public HTML pages. Or every web browsers try to parse HTML pages and render the interpreted content on the screen. This script does the same. Please do not run this script excessively or publish the content as your own!

### More information about scraping (in Germany)
- [Screen Scraping – Wann ist das Auslesen und die Veröffentlichung fremder Daten zulässig?](http://www.rechtzweinull.de/archives/100-screen-scraping-wann-ist-das-auslesen-und-die-veroeffentlichung-fremder-daten-zulaessig.html)
- [BGH Urteil vom 17.07.2003, I ZR 259/00 (Paperboy)](http://www.jurpc.de/jurpc/show?id=20030274)
- [Google:scrap internet rechtliches](https://www.google.de/search?q=scrap%20internet%20rechtliches) ;)


## TODO
- more stability
- user interface: search form
- default text orientation of 90 degrees for head line
- automatically set best size for column width
- add extra column with "points", eg. =COUNTIF(I2:BB2;"X")
- check if vehicle is already cached via vehicle id. If in cache, skip download
- alternative export formats i.e. csv, json
- switch between vehicle types e.g. cars, motorcycles, RVs
- add argument to clean cache folder
- ..

Please write bug reports and feature requests or do pull requests.

Thanks ☺
