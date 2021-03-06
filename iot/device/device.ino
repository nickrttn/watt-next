#define CONFIG_SSID "icu"
#define BACKUP_SSID "Sojasaus 5Ghz"
#define BACKUP_PASSWORD "treb3f@EsTx"

#include <ESP8266WiFi.h>
#include <WiFiManager.h>
#include <OpenWiFi.h>
#include <ESP8266HTTPClient.h>

OpenWiFi hotspot;
String chipID;
String serverURL = "http://watt-next-api.herokuapp.com/";
bool registered = false;

const int pot = A0;
int read_out = 0;
// Usage in Volt-Ampere
int minUsage = 2000; // 2 kW
int avgUsage = 2500; // 2.5 kW
int maxUsage = 3000; // 3 kW

String generateChipID() {
  String chipIDString = String(ESP.getChipId() & 0xffff, HEX);

  chipIDString.toUpperCase();
  while (chipIDString.length() < 4) {
    chipIDString = String("0") + chipIDString;
  }

  return chipIDString;
}

void setup() {
  Serial.begin(9600);
  chipID = generateChipID();
  WiFiManager wifiManager;

  while (WiFi.status() != WL_CONNECTED) {
  	delay(500);
  	Serial.print(".");
  }

  hotspot.begin(BACKUP_SSID, BACKUP_PASSWORD);

  String configSSID = String(CONFIG_SSID) + "_" + chipID;
  wifiManager.autoConnect(configSSID.c_str());

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());

  while (registered == false) {
    Serial.println(registered);
  	HTTPClient http;
		String requestString = serverURL + "api/v1/init/stand/nicks-tacos/real-device/taco-grill-" + chipID + "/label/C";
  	http.begin(requestString);
  	int httpCode = http.GET();
  	String response;
		response = http.getString();
		Serial.println(httpCode);
    Serial.println(response);

  	if (httpCode == 200) {
  		String response;
  		response = http.getString();
  		Serial.println(response);

  		if (response == "success") {
  			registered = true;
  		}
  	}

  	http.end();
  	delay(2000);
  }
}

void send_readout(int val) {
  Serial.println("in send_readout");
  HTTPClient http;
  String requestString = serverURL + "api/v1/stand/nicks-tacos/real-device/taco-grill-" + chipID + "/watt/" + val;
  http.begin(requestString);

  int httpCode = http.GET();

  if (httpCode == 200) {
    String response;
    response = http.getString();

    if (response == "success") {
      Serial.println(response);
    } else {
      // try again
      send_readout(val);
    }
  }

  http.end();
}

void loop() {
  // put your main code here, to run repeatedly:
	read_out = map(analogRead(pot), 0, 1024, minUsage, maxUsage);
	// Serial.println(read_out);
	send_readout(read_out);
  delay(1000);
}
