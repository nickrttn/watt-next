#include <ESP8266WiFi.h>

const char ssid = "HvA Open Wi-Fi";
const char password = "";


const int pot = A0;
int read_out = 0;

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);

  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
  	delay(500);
  	Serial.print(".");
  }

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
