module.exports = (language) => {
    return {
        'Pragma': 'no-cache',
        'Cache-Control': 'no-cache',
        'Upgrade-Insecure-Requests': '1',
        'User-Agent': 'Mozilla/6.1 (Macintosh; ARM Mac OS X 12_12_3) AppleWebKit/737.36 (KHTML, like Gecko) Chrome/62.0.2821.0 Safari/737.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Encoding': 'gzip, deflate, sdch',
        'Accept-Language': language + ';q=0.8,en;q=0.6',
    };
};
