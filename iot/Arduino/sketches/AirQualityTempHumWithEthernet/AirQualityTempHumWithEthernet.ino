#include <SPI.h>
#include <Ethernet.h>
#include <PubSubClient.h>
#include <dht11.h>
//#include"AirQuality.h"


#define DHT11PIN 2
#define greenLed 3
#define redLed 4
#define yellLed 5
#define airPin A0
// Update this to either the MAC address found on the sticker on your Ethernet shield (newer shields)
// or a different random hexadecimal value (change at least the last four bytes)
byte mac[] = { 0x9C, 0xA9, 0x49, 0xBA, 0xB3, 0x08 };
char macstr[] = "9CA949BAB308";
// Note this next value is only used if you intend to test against a local MQTT server
byte localserver[] = {192, 168, 1, 44 };


//-------- Customise these values -----------
#define ORG "###"
#define DEVICE_TYPE "###"
#define DEVICE_ID "###"
#define TOKEN "###"
//-------- Customise the above values --------

char server[] = ORG ".messaging.staging.internetofthings.ibmcloud.com";
char authMethod[] = "use-token-auth";
char token[] = TOKEN;
char clientId[] = "d:" ORG ":" DEVICE_TYPE ":" DEVICE_ID;

char servername[]="quickstart.messaging.staging.internetofthings.ibmcloud.com";
String clientName = String("d:quickstart:arduino:") + macstr;
String topicName = String("iot-2/evt/environment/fmt/json");
dht11 DHT11;

float tempC = 0.0;
float humidity = 0.0;

//AirQuality airqualitysensor;
int current_quality =-1;


EthernetClient ethClient;

// Callback function header
void callback(char* topic, byte* payload, unsigned int length);
// Uncomment this next line and comment out the line after it to test against a local MQTT server
//PubSubClient client(localserver, 1884, 0, ethClient);
//quickstart
//PubSubClient client(servername, 1883, callback, ethClient);
PubSubClient client(server, 1883, NULL, ethClient);

void setup() {
  pinMode(greenLed, OUTPUT);
  pinMode(redLed, OUTPUT);
  pinMode(yellLed, OUTPUT);

  digitalWrite(yellLed, HIGH);
  
  Serial.begin(9600);

  delay(10000);// wait for 10 s to prepare Air quality sensor
  digitalWrite(yellLed, LOW);
  digitalWrite(greenLed, HIGH);
  digitalWrite(redLed, HIGH);
  // put your setup code here, to run once:
  if (Ethernet.begin(mac) == 0) {
    Serial.println("Failed to configure Ethernet using DHCP");
    // no point in carrying on, so do nothing forevermore:
    for (;;){
      digitalWrite(redLed, LOW);
      delay(1000);
      digitalWrite(redLed, HIGH);
      delay(1000);
    }
  }
  printIPAddress();
  
}

void loop() {
  digitalWrite(greenLed, LOW);
  digitalWrite(redLed, LOW);
  current_quality=analogRead(airPin);
 
  // put your main code here, to run repeatedly:
    char clientStr[34];
  clientName.toCharArray(clientStr,34);
  char topicStr[31];
  topicName.toCharArray(topicStr,31);
  getData();

  if (!!!client.connected()) {
    Serial.print("Reconnecting client to ");
    Serial.println(server);
    digitalWrite(redLed, HIGH);
    //while (!!!client.connect(clientStr)) {
    while (!!!client.connect(clientId, authMethod, token)) {
        digitalWrite(redLed, LOW);
        Serial.print(".");
        digitalWrite(redLed, HIGH);
        delay(500);
    }
    Serial.println();
    digitalWrite(redLed, LOW);
 }
  
 
  digitalWrite(redLed, LOW);
  if (client.connected() ) {
    String json = buildJson();
    char jsonStr[100];
    json.toCharArray(jsonStr,100);
    boolean pubresult = client.publish(topicStr,jsonStr);
    Serial.print("attempt to send ");
    Serial.println(jsonStr);
    Serial.print("to ");
    Serial.println(topicStr);
    if (pubresult){
      digitalWrite(greenLed, HIGH);
      Serial.println("successfully sent");
      delay(500);
      digitalWrite(greenLed, LOW);
    }else{
      Serial.println("unsuccessfully sent");
    }
  }
  
  delay(5*60000);

}

void getData() {
  int chk = DHT11.read(DHT11PIN);
  switch (chk)
  {
  case 0:
    Serial.println("Read OK");
    humidity = (float)DHT11.humidity;
    tempC = DHT11.temperature;
    break;
  case -1:
    Serial.println("Checksum error");
    break;
  case -2:
    Serial.println("Time out error");
    break;
  default:
    Serial.println("Unknown error");
    break;
  }
}

String buildJson() {
   
  String data = "{";
  data+="\n";
  data+= "\"d\": {";
  data+="\n";
  data+="\"n\": \"Arduino DHT11\",";
  data+="\n";
  data+="\"t\": ";
  data+=(int)tempC;
  data+= ",";
  data+="\n";
  data+="\"h\": ";
  data+=(int)humidity;
  data+= ",";
  data+="\n";
  data+="\"a\": ";
  data+=current_quality;
  data+="\n";
  data+="}";
  data+="\n";
  data+="}";
  //current_quality
  return data;
}

void callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Message arrived [");
  Serial.print(topic);
  Serial.print("] ");
  for (int i=0;i<length;i++) {
    Serial.print((char)payload[i]);
  }
  Serial.println();
}


void printIPAddress()
{
  Serial.print("My IP address: ");
  for (byte thisByte = 0; thisByte < 4; thisByte++) {
    // print the value of each byte of the IP address:
    Serial.print(Ethernet.localIP()[thisByte], DEC);
    Serial.print(".");
  }

  Serial.println();
}
