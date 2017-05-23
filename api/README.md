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
	"devices" : [], 
	"created_at" : 1494260964309.0
	}

#### ```/api/v1/init/stand/:stand/device/:device/label/:label```
example: /api/v1/init/stand/pastabar/device/pastacooker/label/A

This will create the following record containing the information about the device and the id of the stand that it's attached to. The energy labels, ranging from A - E, will determin how much energy the device consumes.

	{ 
	"_id" : "59109ce4d578301d653e98e7", 
	"name" : "rijstkoker", 
	"energyLabel" : "A",
	"real" : false,
	"stand" : "59109ce4d578301d653e98e7",
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
	  "_id":"59109ce4d578301d653e98e7",
	  "name":"pastabar",
	  "generator":"59109781a1cda50f18d2a280",
	  "devices":[  
	    {  
	      "name":"rijstkoker",
	      "energyLabel":"A",
	      "real" : false,
		  "stand" : "59109ce4d578301d653e98e7",
		  "created_at" : 1494260964309.0
	      "_id":"59158630ae9c4d107a2f72b5"
	    },
	    {  
	      "name":"koelkast",
	      "energyLabel":"A",
	      "real":false,
	      "created_at":1494582835440,
	      "stand":"59109ce4d578301d653e98e7",
	      "_id":"59158633ae9c4d107a2f72dd"
	    },
	    {  
	      "name":"frituur",
	      "energyLabel":"D",
	      "real":false,
	      "created_at":1494582839038,
	      "stand":"59109ce4d578301d653e98e7",
	      "_id":"59158637ae9c4d107a2f7316"
	    },
	    {  
	      "name":"magnetron",
	      "energyLabel":"C",
	      "real":false,
	      "created_at":1494582842552,
	      "stand":"59109ce4d578301d653e98e7",
	      "_id":"5915863aae9c4d107a2f7344"
	    }
	  ],
	  "created_at":1494260964309.0
	}

#### ```/api/v1/stand/:stand/messages```
example: /api/v1/stand/pastabar/messages

This will return the following JSON containing all the messages for the stand. For each device and the stand as a whole the currrent usage and total usage are returned/

	{  
	  "standName":"pastabar",
	  "timestamp":1494582776789,
	  "currentUsage":6.060879999999999,
	  "averageUsage":14.464521794079834,
	  "totalUsage":310.1790897580039,
	  "devices":[  
	    {  
	      "name":"rijstkoker",
	      "dev_id":"59158630ae9c4d107a2f72b5",
	      "stand":"59109ce4d578301d653e98e7",
	      "energyLabel":"A",
	      "currentUsage":0.99197,
	      "averageUsage":1.3108802229712266,
	      "totalUsage":28.09026932048459
	    },
	    {  
	      "name":"frituur",
	      "dev_id":"59158637ae9c4d107a2f7316",
	      "stand":"59109ce4d578301d653e98e7",
	      "energyLabel":"D",
	      "currentUsage":3.3066999999999998,
	      "averageUsage":9.207834834565919,
	      "totalUsage":197.29268082919467
	    },
	    {  
	      "name":"magnetron",
	      "dev_id":"5915863aae9c4d107a2f7344",
	      "stand":"59109ce4d578301d653e98e7",
	      "energyLabel":"C",
	      "currentUsage":1.6359099999999998,
	      "averageUsage":3.8737723429387385,
	      "totalUsage":82.99857354498037
	    },
	    {  
	      "name":"koelkast",
	      "dev_id":"59158633ae9c4d107a2f72dd",
	      "stand":"59109ce4d578301d653e98e7",
	      "energyLabel":"A",
	      "currentUsage":0.1263,
	      "averageUsage":0.1904913889249122,
	      "totalUsage":4.081796461779768
	    }
	  ]
	}
