

## Concept: Watt-Next

Watt-Next is a Dutch company, they monitor power usage of generators. Their goal is to make 'off grid energy', as they call it, more sustainable and efficient. They also strive to emit less carbon dioxide (CO2).

We created a dashboard that displays the power usage of generators and stands at festivals. This dashboard has two intended users: stand owners and Watt-Now/Infra-crew. 

## Index:
- [Collecting input data](#collecting-input-data)
- [Smart power sockets](#smart-power-sockets)
- [The stand owner](#the-stand-owner)
- [Watt-Now](#watt-now)
- [Architecture](#architecture)
- [Installation](#installation)


## [Collecting input data](#collecting-input-data)

Our API requests data every minute, to better show the effect of our concept we've made our demo request data every second. The data is visualized per zone and per stand via line graphs. The desired effect of our application is making people more conscious of their power usage. 

## [Smart power sockets](#smart-power-sockets)

All stands need to be supplied with smart power sockets (sockets that monitor power usage), every appliance in the stand needs to have its own socket so individual devices can be displayed on the dashboard. 

## [The stand owner](#the-stand-owner)

The stand owner is able to see per device how much power is used. With this information they can choose to reduce their energy usage. The dashboard also has an overview of the total power usage at that moment, the energy used until that point, and the overall cost of the used energy until that point.

### Use case: stand owner

Fleur van Mourik just started her own foodtruck, the Deli Lama. Fleur traveled through Vietnam and lived in Indonesia for a while. She took a couple delicious dishes back to the Netherlands.

(http://www.cityguys.nl/amsterdam/amsterdam-cityguys-foodtruck-guide/)

As a startup it's as much an opportunity as a risk to go to Mysteryland with her foodtruck. She has a lot of costs she has to estimate beforehand, like ingredients with limited shelf life. Mysteryland has decided to make all stands pay for their actual power usage, in stead of a pre-discussed amount for the entire festival. This is the first time she's using her foodtruck on a festival and has no idea how much power she will use.

With Watt-Next Fleur gets more insight in her energy consumption. All devices are connected with smart power sockets so Fleur can monitor all devices that are using power. This is transformed into a clear visual overview of the total usage and price, which Fleur can check whenever she wants. She can take action according to this data to reduce for example the amount of power.

### [Watt-Now](#watt-now)

Watt-Now already monitors the power usage per generator, but not per stand or even device. With this data they can make a plan to make the festival more environmentally friendly and lower the costs for the festival owner. One of their services is to monitor the power usage on-site. With our dashboard they can see which generator supplies which stands and stages, and monitor when a generator is overloaded. When a generator is overloaded they can send an infra-crew to the generator to fix the problem. 

If Watt-Now isn't on-site the infra-crew can use the dashboard to keep the generators under control. 

Besides monitoring power usage, the dashboard can also be used as a community. Stand owners are able to see how other stands manage their energy and learn from eachother. The dashboard also creates a social aspect and for the competitive stand owners it also creates a challenge to be the most energy conscious. 

### Use case: Watt-Now

Anton Frankfurt works for Watt-Now. He mainly works on site at festivals. He monitors the power usage of the generators. In case something happens he needs to alert the infra-crew and send them to the generator. With Watt-Next Anton can see which stands are hooked up to the generator. With this information he can also see which stand is causing the generator to overload. By knowing this he can take action accordingly. The added value of our concept to Watt-Now's current method is that they can see per stand and even per device what is overloading the generators.

### Functionality

Viewing how much power is used:

- Per generator/zone 
- Per stand
	- Per device

### Sensors used

Potentiometer

### Nice to have

- Login for the stand owners
- Automatic notifications to standowners when a maximum is reached.
- Leaderboard

## [Architecture](#architecture)

![](https://s3-us-west-2.amazonaws.com/notion-static/c0e40495f02a4825bfdb9d46d7742f5b/WattNow2.png)

## [Installation](#installation)

- [App](#app)
- [Api](#api)

## [App](#app)

First clone the repo:

```git

git clone [https://github.com/nickrttn/watt-next.git](https://github.com/nickrttn/watt-next.git) 

```

After that:

```git

npm install

```

Create an .env file:

```

PORT=3000

API_ENDPOINT=http://localhost:1337

```

Now start up the server:

```git

npm start

```



## [Api](#api)

Create a .env file:

```

PORT=1337

MONGODB_URI=mongodb://localhost:27017/watt_next

```

In order for this to work you have to have a MongoDB running.

See: [API README](https://github.com/nickrttn/watt-next/tree/develop/api)
