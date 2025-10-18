#!/usr/bin/env python3
"""
Week 4: Weather Environment Sensing
SAM LMS - Foundation Phase Physical Computing

This program reads temperature and humidity data from a DHT sensor
and provides visual feedback using LEDs. It demonstrates pattern
recognition, data collection, and environmental monitoring.

Ubuntu Connection: We monitor our shared environment because
"I am because we are" - our environment affects us all.

Hardware Requirements:
- Raspberry Pi Pico
- DHT11 or DHT22 temperature/humidity sensor
- LEDs (Red, Yellow, Green) for status indicators
- Breadboard and jumper wires
"""

import machine
import time
import dht

# Pin Configuration
SENSOR_PIN = 15  # DHT sensor data pin
LED_COLD_PIN = 16  # Blue/Cold indicator
LED_WARM_PIN = 17  # Yellow/Comfortable indicator
LED_HOT_PIN = 18   # Red/Hot indicator

# Initialize sensor and LEDs
sensor = dht.DHT11(machine.Pin(SENSOR_PIN))  # Use DHT22 if you have it
led_cold = machine.Pin(LED_COLD_PIN, machine.Pin.OUT)
led_warm = machine.Pin(LED_WARM_PIN, machine.Pin.OUT)
led_hot = machine.Pin(LED_HOT_PIN, machine.Pin.OUT)

# Temperature thresholds (in Celsius)
COLD_THRESHOLD = 18
WARM_THRESHOLD = 25

def read_sensor():
    """Read temperature and humidity from DHT sensor."""
    try:
        sensor.measure()
        temp = sensor.temperature()
        humidity = sensor.humidity()
        return temp, humidity
    except OSError as e:
        print(f"Error reading sensor: {e}")
        return None, None

def update_leds(temperature):
    """
    Update LED indicators based on temperature.
    
    Pattern Recognition:
    - Cold: temp < 18°C → Blue LED
    - Comfortable: 18°C ≤ temp < 25°C → Yellow LED
    - Hot: temp ≥ 25°C → Red LED
    """
    # Turn off all LEDs first
    led_cold.value(0)
    led_warm.value(0)
    led_hot.value(0)
    
    # Pattern-based LED control
    if temperature < COLD_THRESHOLD:
        led_cold.value(1)
        status = "Cold"
    elif temperature < WARM_THRESHOLD:
        led_warm.value(1)
        status = "Comfortable"
    else:
        led_hot.value(1)
        status = "Hot"
    
    return status

def display_reading(temp, humidity, status):
    """Display sensor readings in a child-friendly format."""
    print("\n" + "="*40)
    print("🌡️  WEATHER STATION REPORT 🌡️")
    print("="*40)
    print(f"Temperature: {temp}°C")
    print(f"Humidity: {humidity}%")
    print(f"Status: {status}")
    print("="*40)
    
    # Educational prompts for learners
    if status == "Cold":
        print("💙 It's cold! Remember to wear a jacket.")
    elif status == "Comfortable":
        print("💛 Perfect weather for outdoor learning!")
    else:
        print("❤️ It's hot! Stay hydrated and find shade.")

def log_data(temp, humidity):
    """
    Log data for pattern analysis (simplified version).
    In a full implementation, this would write to a file.
    """
    timestamp = time.localtime()
    print(f"\nData logged at {timestamp[3]:02d}:{timestamp[4]:02d}:{timestamp[5]:02d}")
    print(f"Pattern observation: Temp={temp}°C, Humidity={humidity}%")

def main():
    """
    Main monitoring loop.
    
    Computational Thinking:
    - Sequencing: Follow step-by-step monitoring process
    - Pattern Recognition: Identify temperature trends
    - Abstraction: Convert sensor data to meaningful indicators
    - Data Collection: Gather environmental information
    """
    print("\n" + "*"*50)
    print("🌍 WEATHER ENVIRONMENT SENSING - Week 4 🌍")
    print("Ubuntu: Caring for our shared environment")
    print("*"*50 + "\n")
    
    print("Starting weather monitoring...")
    print("Press Ctrl+C to stop\n")
    
    reading_count = 0
    
    try:
        while True:
            # Read sensor
            temp, humidity = read_sensor()
            
            if temp is not None and humidity is not None:
                # Update visual indicators
                status = update_leds(temp)
                
                # Display information
                display_reading(temp, humidity, status)
                
                # Log for pattern analysis
                log_data(temp, humidity)
                
                reading_count += 1
                print(f"\nTotal readings collected: {reading_count}")
                
                # Cultural connection
                if reading_count % 5 == 0:
                    print("\n🌟 Ubuntu Reflection:")
                    print("We monitor our environment together.")
                    print("Our actions affect everyone in our community.\n")
            else:
                print("Waiting for sensor to stabilize...")
            
            # Wait before next reading (2 seconds)
            time.sleep(2)
            
    except KeyboardInterrupt:
        print("\n\nMonitoring stopped.")
        print(f"Total readings collected: {reading_count}")
        print("\n🌍 Remember: Caring for our environment is Ubuntu in action!")
        
        # Turn off all LEDs
        led_cold.value(0)
        led_warm.value(0)
        led_hot.value(0)

if __name__ == "__main__":
    main()

"""
Differentiation Ideas:

For Emerging Learners:
- Focus on simple hot/cold observations
- Use larger temperature ranges
- Single LED indicator
- Teacher-guided data collection

For Advancing Learners:
- Track data over multiple days
- Create simple graphs
- Compare morning vs afternoon readings
- Design alert system for extreme conditions
- Explore humidity patterns

CAPS Connections:
- Natural Sciences: Weather and seasons
- Mathematics: Measuring and comparing quantities
- Life Skills: Environmental awareness
- Languages: Multilingual weather descriptions

Cultural Extension:
- Research traditional weather prediction methods
- Interview family about seasonal patterns
- Connect temperature to traditional clothing
- Discuss Ubuntu and environmental stewardship
"""
