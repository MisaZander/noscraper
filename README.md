# NHL Ice Scraper
...more like a news article scraper. Scrapes the NHL homepage for headlines and stores the newest ones in a MongoDB.

### Description
When prompted, the application makes a request to the NHL main page and loads the HTML response into Cheerio. 
Cheerio specifcally picks out the articles on the front page and stores the results in a local or remote database.
All the stored articles are shown when the app loads the home page.

### Insall Requirements
- Node Package Manager(NPM)
- A MongoDB server listening to the default port on localhost

### Install Guide
- Clone the repo onto your machine
- `cd` into the repo from your machine's terminal
- Run `npm install` from the terminal to install the dependencies
- Run `npm start` to start the server
- Go to http://localhost:8080 in a browser to see the app

### Live Demo
https://noscraper-zs.herokuapp.com/
