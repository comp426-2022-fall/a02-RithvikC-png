#!/usr/bin/env node

import minimist from 'minimist';
import moment from 'moment-timezone';
import fetch from "node-fetch";

const arg = minimist(process.argv.slice(2));

if(arg.h !== undefined || arg.help !== undefined){
    console.log(`Usage: galosh.js [options] -[n|s] LATITUDE -[e|w] LONGITUDE -z TIME_ZONE
    -h            Show this help message and exit.
    -n, -s        Latitude: N positive; S negative.
    -e, -w        Longitude: E positive; W negative.
    -z            Time zone: uses tz.guess() from moment-timezone by default.
    -d 0-6        Day to retrieve weather: 0 is today; defaults to 1.
    -j            Echo pretty JSON from open-meteo API and exit.
`)
    process.exit(0)
}

if(arg.n === undefined && arg.s === undefined){
    console.log("Latitude must be in range");
    process.exit(0);
}else if(arg.n !== undefined && arg.s === undefined){
    arg.latitude = arg.n;
}else if(arg.n === undefined && arg.s !== undefined){
    arg.latitude = -arg.s;
}else{
    console.log("Latitude must be in range");
    process.exit(0);
}

const latitude = arg.latitude;

if(arg.w === undefined && arg.e === undefined){
    console.log("Longitude must be in range");
    process.exit(0);
}else if (arg.w !== undefined && arg.e === undefined){
    arg.longitude = arg.w;
}else if (arg.w === undefined && arg.e !== undefined){
    arg.longitude = -arg.e;
}else{
    console.log("Longitude must be in range");
    process.exit(0);
}

const longitude = arg.longitude;

if (arg.z === undefined){
    arg.z = moment.tz.guess();
}

const timezone = arg.z;

const response = await fetch("https://api.open-meteo.com/v1/forecast?latitude="+latitude+"&longitude="+longitude+"&daily=precipitation_hours&timezone="+timezone);
const data = await response.json();

if (arg.j !== undefined){
    console.log(data);
    process.exit(0);
}

if (arg.d === undefined){
    arg.d = 1;
}

const days = arg.d;

process.stdout.write("You will ");

if(data.daily.precipitation_hours[days] === 0.0){
    process.stdout.write("not ");
}

process.stdout.write("need your galoshes ")

if (days === 0) {
    console.log("today.")
}   else if (days > 1){
        console.log(`in ${days} days.`)
    }else{
        console.log("tomorrow.")
}
