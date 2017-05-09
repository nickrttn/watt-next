# Watt Now API
## Request & Response Examples
Note that these values are fictional and purely meant for this documentation.

### Initialize Generators and Stands
#### ```/api/v1/init/generator/:generator```
example: /api/v1/init/generator/side001

This will create the following record containing the information about the stand

    { 
        "_id" : "59109781a1cda50f18d2a280", 
        "name" : "side001", 
        "created_at" : 1494259585354.0
    }

#### ```/api/v1/init/generator/:generator/stand/:stand```
example: /api/v1/init/generator/side001/stand/pastabar

This will create the following record containing the information about the stand and the id of the generator that it's attached to

    { 
    "_id" : "59109ce4d578301d653e98e7", 
    "name" : "pastabar", 
    "generator" : "59109781a1cda50f18d2a280", 
    "created_at" : 1494260964309.0
    }

### Get Data
#### ```/api/v1/generator/:generator```
example: /api/v1/generator/side001

This will return the following JSON containing the information about the generator and the stands that are attached to it

    { generatorId: 59109781f1cda50f18d2a279,
        generatorName: 'side001',
        stands: [
            { 
                "_id" : "59109ce4d578301d653e98e7", 
                "name" : "pastabar", 
                "generator" : "59109781a1cda50f18d2a280", 
                "created_at" : 1494260964309.0
            },
            {
                "_id" : "59109ce4d578301d653e98e7", 
                "name" : "coffeestand", 
                "generator" : "5a46978191cda50f18d2a517", 
                "created_at" : 1494260969537.0
            } 
        ] 
    }

#### ```/api/v1/stand/:stand```
example: /api/v1/stand/pastabar

This will return the following JSON containing the information about the stand

    { 
        "_id" : "59109ce4d578301d653e98e7", 
        "name" : "pastabar", 
        "generator" : "59109781a1cda50f18d2a280", 
        "created_at" : 1494260964309.0
    }

#### ```/api/v1/stand/:stand/messages```
example: /api/v1/stand/pastabar/messages

This will return the following JSON containing all the messages for the stand

    {
    "generatorId": "59109781a1cda50f18d2a280",
    "standId": "59109ce4d578301d653e98e7",
    "standName": "pastabar",
    "messages": [{
        "_id": "59109ce4d578301d353e78e9",
        "stand": "59109ce4d578301d653e98e7",
        "generator": "59109781a1cda50f18d2a280",
        "timestamp": 1494260964546,
        "avr_va": 90557,
        "min_va": 86624,
        "max_va": 95518
    }, {
        "_id": "59109ce7d578301d353e78eb",
        "stand": "59109ce4d578301d653e98e7",
        "generator": "59109781a1cda50f18d2a280",
        "timestamp": 1494260967552,
        "avr_va": 90542,
        "min_va": 86541,
        "max_va": 95561
    }, {
        "_id": "59109cead578301d353e78ed",
        "stand": "59109ce4d578301d653e98e7",
        "generator": "59109781a1cda50f18d2a280",
        "timestamp": 1494260970552,
        "avr_va": 90591,
        "min_va": 86538,
        "max_va": 95424
    }, {
        "_id": "59109cedd578301d353e78ef",
        "stand": "59109ce4d578301d653e98e7",
        "generator": "59109781a1cda50f18d2a280",
        "timestamp": 1494260973554,
        "avr_va": 90538,
        "min_va": 86597,
        "max_va": 95464
    }],
    "timestamp": 1494265338755
    }

#### ```/api/v1/generator/:generator/messages```
example: /api/v1/generator/side001/messages

This will return the following JSON containing all the messages for the stands attached to the generator

    {
    "generatorId": "59109781a1cda50f18d2a280",
    "standName": "davenator",
    "messages": [{
        "_id": "59109b75d8a39719f731cca8",
        "stand": "59109ce4d578301d653e98e7",
        "generator": "59109781a1cda50f18d2a280",
        "timestamp": 1494260597301,
        "avr_va": 90548,
        "min_va": 86639,
        "max_va": 95598
    }, {
        "_id": "59109b78d8a39719f731cca9",
        "stand": "59109ce4d578301d653e98e7",
        "generator": "59109781a1cda50f18d2a280",
        "timestamp": 1494260600297,
        "avr_va": 90582,
        "min_va": 86651,
        "max_va": 95477
    }, {
        "_id": "59109b7bd8a39719f731ccaa",
        "stand": "59109ce4d578301d653e98e7",
        "generator": "59109781a1cda50f18d2a280",
        "timestamp": 1494260603301,
        "avr_va": 90533,
        "min_va": 86661,
        "max_va": 95545
    }, {
        "_id": "59109b7ed8a39719f731ccab",
        "stand": "59109ce4d578301d653e98e7",
        "generator": "59109781a1cda50f18d2a280",
        "timestamp": 1494260606303,
        "avr_va": 90529,
        "min_va": 86529,
        "max_va": 95511
    }, {
        "_id": "59109b81d8a39719f731ccac",
        "stand": "59109ce4d578301d653e98e7",
        "generator": "59109781a1cda50f18d2a280",
        "timestamp": 1494260609310,
        "avr_va": 90534,
        "min_va": 86672,
        "max_va": 95480
    }, {
        "_id": "59109cd8d578301d353e78e3",
        "stand": "59109ce4d578301d653e98e7",
        "generator": "59109781a1cda50f18d2a280",
        "timestamp": 1494260952543,
        "avr_va": 90545,
        "min_va": 86565,
        "max_va": 95492
    }, {
        "_id": "59109cdbd578301d353e78e4",
        "stand": "59109ce4d578301d653e98e7",
        "generator": "59109781a1cda50f18d2a280",
        "timestamp": 1494260955540,
        "avr_va": 90501,
        "min_va": 86572,
        "max_va": 95538
    }, {
        "_id": "59109cded578301d353e78e5",
        "stand": "59109ce4d578301d653e98e7",
        "generator": "59109781a1cda50f18d2a280",
        "timestamp": 1494260958542,
        "avr_va": 90592,
        "min_va": 86644,
        "max_va": 95525
    }, {
        "_id": "59109ce1d578301d353e78e6",
        "stand": "59109ce4d578301d653e98e7",
        "generator": "59109781a1cda50f18d2a280",
        "timestamp": 1494260961546,
        "avr_va": 90511,
        "min_va": 86689,
        "max_va": 95536
    }, {
        "_id": "59109ce4d578301d353e78e8",
        "stand": "59109ce4d578301d653e98e7",
        "generator": "59109781a1cda50f18d2a280",
        "timestamp": 1494260964546,
        "avr_va": 90586,
        "min_va": 86684,
        "max_va": 95407
    }, {
        "_id": "59109ce4d578301d353e78e9",
        "stand": "59109ce4d578301d653e98e7",
        "generator": "59109781a1cda50f18d2a280",
        "timestamp": 1494260964546,
        "avr_va": 90557,
        "min_va": 86624,
        "max_va": 95518
    }, {
        "_id": "59109ce7d578301d353e78ea",
        "stand": "5910997853f3ad156b45bf8f",
        "generator": "59109781a1cda50f18d2a280",
        "timestamp": 1494260967551,
        "avr_va": 90546,
        "min_va": 86672,
        "max_va": 95514
    }, {
        "_id": "59109ce7d578301d353e78eb",
        "stand": "59109ce4d578301d653e98e7",
        "generator": "59109781a1cda50f18d2a280",
        "timestamp": 1494260967552,
        "avr_va": 90542,
        "min_va": 86541,
        "max_va": 95561
    }, {
        "_id": "59109cead578301d353e78ec",
        "stand": "5910997853f3ad156b45bf8f",
        "generator": "59109781a1cda50f18d2a280",
        "timestamp": 1494260970552,
        "avr_va": 90500,
        "min_va": 86547,
        "max_va": 95488
    }, {
        "_id": "59109cead578301d353e78ed",
        "stand": "59109ce4d578301d653e98e7",
        "generator": "59109781a1cda50f18d2a280",
        "timestamp": 1494260970552,
        "avr_va": 90591,
        "min_va": 86538,
        "max_va": 95424
    }, {
        "_id": "59109cedd578301d353e78ee",
        "stand": "5910997853f3ad156b45bf8f",
        "generator": "59109781a1cda50f18d2a280",
        "timestamp": 1494260973553,
        "avr_va": 90580,
        "min_va": 86521,
        "max_va": 95558
    }, {
        "_id": "59109cedd578301d353e78ef",
        "stand": "59109ce4d578301d653e98e7",
        "generator": "59109781a1cda50f18d2a280",
        "timestamp": 1494260973554,
        "avr_va": 90538,
        "min_va": 86597,
        "max_va": 95464
    }],
    "timestamp": 1494265506066
    }
