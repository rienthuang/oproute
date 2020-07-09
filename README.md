# OpRoute

This project is deployed on AWS EC2 and can be access via http://rient.tk

## Build

Ensure you are on the Angular 9+

`npm install` <br>
`ng serve`

On your Chrome browser, go to http://localhost:4200

## Tech Stack
This repository is the front end face of the project. It is built on Angular 9 and uses the [leaflet](https://leafletjs.com/) library at its core. It also uses [OneMap Singapore API](https://docs.onemap.sg/) to calculate the respective route geometry and distances between routes and [SLA's Tile Server](https://docs.onemap.sg/maps/) as the base map design.

The front end makes a REST API call to the project's Spring Boot Java backend to compute the solution Travelling Salesman Problem using Google's Optimization tools.

### Future Plans
To introduce CI/CD for personal experimental and exploration purposes
