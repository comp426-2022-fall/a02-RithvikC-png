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

if(args.w === undefined && args.e === undefined){
    console.log("Longitude must be in range");
    process.exit(0);
}else if (args.w !== undefined && args.e === undefined){
    arg.longitude = -args.w;
}else if (args.w === undefined && args.e !== undefined){
    arg.longitude = -args.e;
}else{
    console.log("Longitude must be in range");
    process.exit(0);
}

const longitude = arg.longitude;

if (arg.z === undefined){
    arg.z = moment.tz.guess();
}

const timezone = arg.z;

const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,precipitation_probability,wind_speed_10m,wind_from_direction_10m&timezone=${timezone}`);
const data = await response.json();

if (arg.j !== undefined){
    console.log(data);
    process.exit(0);
}

if (arg.d === undefined){
    arg.d = 1;
}

const day = arg.d;

process.stdout.write("You will ");

if(data.daily.precipitation_hours[days] === 0){
    process.stdout.write("not ");
}

process.stdout.write("need your galoshes today ")

if (days === 0) {
    console.log("today.")
}   else if (days > 1){
        console.log(`in ${days} days.`)
    }else{
        console.log("tomorrow.")
}
