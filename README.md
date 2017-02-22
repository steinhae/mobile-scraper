## Description

Get content from mobile.de and show it in an excel sheet. You can sort and filter by all columns and find your favourite car faster.

## Installation

Type in your console:

```bash
git clone https://github.com/dominikwinter/mobile-scraper.git
npm install
```

## Usage

1. Edit index.js file as desired.

2. Type in your console:

```bash
node index.js
```

3. Open generated excel.xls

## Legal Regime
Every search engines use equivalent technologies to extract relevant content from public HTML pages. Or every web browsers try to parse HTML pages and render the interpreted content on the screen. This script does the same. Please do not publish the content as your own!

### More information about scraping (in Germany)
- [Screen Scraping – Wann ist das Auslesen und die Veröffentlichung fremder Daten zulässig?](http://www.rechtzweinull.de/archives/100-screen-scraping-wann-ist-das-auslesen-und-die-veroeffentlichung-fremder-daten-zulaessig.html)
- [BGH Urteil vom 17.07.2003, I ZR 259/00 (Paperboy)](http://www.jurpc.de/jurpc/show?id=20030274)
- [Google:scrap internet rechtliches](https://www.google.de/search?q=scrap%20internet%20rechtliches) ;)


## TODO
- temporary broken .. mobile.de changed its html :-/
- more stability
- user interface: search form
- default text orientation of 90 degrees for head line
- automatically set best size for column width
- add extra column with "points", eg. =COUNTIF(I2:BB2;"X")
- ..

Please write bug reports and feature requests or do pull requests.

Thanks ☺
