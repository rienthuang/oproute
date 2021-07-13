# OpRoute

This project is deployed on Google Cloud Platform Cloud Storage Bucket and can be accessed via http://oproute-server.et.r.appspot.com. Please ensure you access the link without https.

The backend server is currently hosted on Google Cloud Platform Compute Engine. The server will be down at times as I've yet to optimise it to be always free.

The backend server does not have an SSL certificate and there is no intention to get one as it will bring up the cost of running it.

## Build

Project is built on Angular 9+

`npm install` <br>
`ng serve`

On your Chrome browser, http://localhost:4200

## Tech Stack
This repository is the front end face of the project. It is built on Angular 9 and uses the [leaflet](https://leafletjs.com/) library at its core. It also uses [OneMap Singapore API](https://docs.onemap.sg/) to calculate the respective route geometry and distances between routes and [SLA's Tile Server](https://docs.onemap.sg/maps/) as the base map design.

This project communicates (REST) with a back-end server that I built on Java Spring Boot that computes the Travelling Salesman Problem (TSP) using Google's Optimization Tools. The server also supplies the OneMap API token that is used to generate the point-to-point route data. An alternative to this is Google Maps API.

## Known Bugs
This project is not fully mobile optimized. While its core functionality works fine, mobile users will not be able to fully make use of the "autocomplete" feature due to a bug in the project's CSS where the autocomplete dropdown menu gets cut off by the phone's status bar.

### Future Plans
1. To introduce CI/CD for personal experimental and exploration purposes
2. Tidy Up CSS 
