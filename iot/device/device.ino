#define CONFIG_SSID "icu"
#define BACKUP_SSID "Sojasaus 5Ghz"
#define BACKUP_PASSWORD "treb3f@EsTx"

#include <OpenWiFi.h>
#include <ESP8266HTTPClient.h>
#include <ESP8266WiFi.h>
#include <WiFiManager.h>

OpenWiFi hotspot;

const int pot = A0;
int read_out = 0;
String chipID;

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);

  WiFiManager wifiManager;

  while (WiFi.status() != WL_CONNECTED) {
  	delay(500);
  	Serial.print(".");
  }

  hotspot.begin(BACKUP_SSID, BACKUP_PASSWORD);

  chipID = generateChipID();
  String configSSID = String(CONFIG_SSID) + "_" + chipID;
  wifiManager.autoConnect(configSSID.c_str());

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
}

void loop() {
  // put your main code here, to run repeatedly:
	read_out = analogRead(pot);
	Serial.println(read_out);
}

String generateChipID()
{
  String chipIDString = String(ESP.getChipId() & 0xffff, HEX);

  chipIDString.toUpperCase();
  while (chipIDString.length() < 4)
    chipIDString = String("0") + chipIDString;

  return chipIDString;
}
