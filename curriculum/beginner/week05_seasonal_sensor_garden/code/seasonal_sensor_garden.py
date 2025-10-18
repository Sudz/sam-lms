"""Seasonal Sensor Garden - Week 5
Environmental Sensors & Indigenous Agricultural Knowledge

This program demonstrates environmental data collection using sensors,
connecting modern technology with traditional South African planting wisdom.

Learning Objectives:
- Reading temperature and light sensors
- Collecting and analyzing environmental data
- Using conditional logic (if/then)
- Connecting technology to indigenous agricultural knowledge
- Understanding seasonal patterns

Hardware Setup:
- Raspberry Pi Pico
- DHT11 or DHT22 temperature/humidity sensor (GPIO 16)
- LDR (Light Dependent Resistor) on ADC pin (GPIO 26)
- Optional: LEDs for visual indicators
- Optional: Soil moisture sensor

Ubuntu Connection: Growing together feeds our community!
"""

import machine
import dht
import time
from machine import Pin, ADC

# ========== SENSOR SETUP ==========

# Temperature and Humidity sensor (DHT11/DHT22)
try:
    dht_sensor = dht.DHT11(Pin(16))  # Change to DHT22 if using that sensor
    sensor_type = "DHT11"
except:
    print("DHT sensor not found on GPIO 16. Check wiring!")
    dht_sensor = None

# Light sensor (LDR - Light Dependent Resistor)
try:
    ldr = ADC(Pin(26))  # ADC0 on GPIO 26
except:
    print("LDR not found on GPIO 26. Check wiring!")
    ldr = None

# Optional: LED indicators
temp_led = Pin(15, Pin.OUT)  # Red LED for high temperature warning
light_led = Pin(14, Pin.OUT) # Yellow LED for light level indicator

# ========== SOUTH AFRICAN SEASONAL DATA ==========

# Temperature ranges for different seasons (Celsius)
SEASONAL_TEMPS = {
    'summer': {'min': 20, 'max': 35, 'name_zulu': 'Ihlobo', 'name_sepedi': 'Selemo'},
    'autumn': {'min': 15, 'max': 25, 'name_zulu': 'Ukwindla', 'name_sepedi': 'Sehla'},
    'winter': {'min': 5, 'max': 20, 'name_zulu': 'Ubusika', 'name_sepedi': 'Mariga'},
    'spring': {'min': 15, 'max': 28, 'name_zulu': 'Intwasahlobo', 'name_sepedi': 'Selekanyane'}
}

# Indigenous crops for each season
SEASONAL_CROPS = {
    'summer': [
        'Amadumbe (Taro) - water-loving tuber',
        'Maize/Umbila - staple grain crop',
        'Beans/Imbotyi - nitrogen-fixing legume',
        'Pumpkins/Amathanga - spreading vine'
    ],
    'autumn': [
        'Carrots/Ukhaletha - root vegetable',
        'Beetroot/Ubhitirudi - nutrient-rich',
        'Prepare soil for winter planting',
        'Harvest summer crops'
    ],
    'winter': [
        'Cabbage/Iklabishi - cold hardy',
        'Spinach/Umfino/Morogo - nutritious greens',
        'Onions/Uanyanisi - slow growing',
        'Garlic/Ugaliki - medicinal'
    ],
    'spring': [
        'Tomatoes/Utamatisi - warm season favorite',
        'Butternut/Ithanga - nutritious squash',
        'Sweet potatoes/Ubhatata - easy to grow',
        'Herbs: Basil, Parsley, Coriander'
    ]
}

# ========== HELPER FUNCTIONS ==========

def read_temperature_humidity():
    """Read temperature and humidity from DHT sensor.
    
    Returns:
        tuple: (temperature_celsius, humidity_percent) or (None, None) if error
    """
    if dht_sensor is None:
        return None, None
    
    try:
        dht_sensor.measure()
        temp = dht_sensor.temperature()
        humidity = dht_sensor.humidity()
        return temp, humidity
    except Exception as e:
        print(f"Error reading DHT sensor: {e}")
        return None, None

def read_light_level():
    """Read light level from LDR sensor.
    
    Returns:
        int: Light level (0-65535, higher = brighter) or None if error
    """
    if ldr is None:
        return None
    
    try:
        light_value = ldr.read_u16()
        return light_value
    except Exception as e:
        print(f"Error reading LDR: {e}")
        return None

def get_current_season(month):
    """Determine current season based on month number.
    
    Args:
        month: Integer 1-12 representing month
        
    Returns:
        str: Season name ('summer', 'autumn', 'winter', 'spring')
    """
    if month in [12, 1, 2]:
        return 'summer'
    elif month in [3, 4, 5]:
        return 'autumn'
    elif month in [6, 7, 8]:
        return 'winter'
    else:  # 9, 10, 11
        return 'spring'

def light_level_description(light_value):
    """Convert light sensor reading to descriptive text.
    
    Args:
        light_value: Integer 0-65535 from LDR sensor
        
    Returns:
        str: Description of light level
    """
    if light_value is None:
        return "Unknown"
    elif light_value < 10000:
        return "Dark (Night or deep shade)"
    elif light_value < 30000:
        return "Low light (Cloudy or early morning)"
    elif light_value < 50000:
        return "Medium light (Partial sun)"
    else:
        return "Bright light (Full sun)"

def check_planting_conditions(temp, humidity, light_value, season):
    """Analyze sensor data and provide planting advice.
    
    This function uses CONDITIONAL LOGIC (if/elif/else) to make decisions
    based on sensor readings - a key computational thinking skill!
    
    Args:
        temp: Temperature in Celsius
        humidity: Humidity percentage
        light_value: Light sensor reading
        season: Current season string
        
    Returns:
        dict: Advice and conditions assessment
    """
    advice = {
        'temperature_ok': False,
        'light_ok': False,
        'watering_needed': False,
        'messages': []
    }
    
    # Check temperature for current season
    if temp is not None:
        season_info = SEASONAL_TEMPS[season]
        if season_info['min'] <= temp <= season_info['max']:
            advice['temperature_ok'] = True
            advice['messages'].append(f"✅ Temperature {temp}°C is good for {season} planting!")
        elif temp > season_info['max']:
            advice['messages'].append(f"⚠️ Temperature {temp}°C is HIGH for {season}. Water more!")
            advice['watering_needed'] = True
            temp_led.on()  # Turn on warning LED
        else:
            advice['messages'].append(f"❄️ Temperature {temp}°C is LOW for {season}. Protect plants!")
            temp_led.off()
    
    # Check light levels
    if light_value is not None:
        if light_value > 30000:  # Good light for most plants
            advice['light_ok'] = True
            advice['messages'].append(f"☀️ Light level is good for plant growth!")
            light_led.on()
        else:
            advice['messages'].append(f"🌥️ Light level is low. Consider moving plants to sunnier spot.")
            light_led.off()
    
    # Check humidity for watering needs
    if humidity is not None:
        if humidity < 40:
            advice['watering_needed'] = True
            advice['messages'].append(f"💧 Humidity {humidity}% is low. Time to water!")
        elif humidity > 80:
            advice['messages'].append(f"💦 Humidity {humidity}% is high. No watering needed today.")
        else:
            advice['messages'].append(f"✓ Humidity {humidity}% is good.")
    
    return advice

# ========== MAIN PROGRAM ==========

def display_seasonal_info(season):
    """Display information about current season and recommended crops."""
    print("\n" + "="*60)
    print(f"CURRENT SEASON: {season.upper()}")
    season_info = SEASONAL_TEMPS[season]
    print(f"isiZulu: {season_info['name_zulu']} | Sepedi: {season_info['name_sepedi']}")
    print(f"Expected Temperature Range: {season_info['min']}-{season_info['max']}°C")
    print("="*60)
    
    print(f"\n🌱 RECOMMENDED CROPS FOR {season.upper()}:")
    for crop in SEASONAL_CROPS[season]:
        print(f"   • {crop}")
    print()

def sensor_garden_demo():
    """Main demonstration - collect data and provide planting advice."""
    print("\n" + "*"*60)
    print("SEASONAL SENSOR GARDEN - Week 5")
    print("Connecting Technology with Indigenous Agricultural Knowledge")
    print("*"*60)
    
    # For this demo, we'll use the current month
    # In classroom: Ask students what month it is!
    import time
    current_time = time.localtime()
    current_month = current_time[1]  # Month is index 1
    
    # Determine season
    season = get_current_season(current_month)
    
    # Display seasonal information
    display_seasonal_info(season)
    
    print("\n📊 STARTING SENSOR MONITORING...")
    print("(Taking readings every 5 seconds. Press Ctrl+C to stop)\n")
    
    reading_count = 0
    
    try:
        while True:
            reading_count += 1
            print(f"\n--- Reading #{reading_count} ---")
            
            # Read sensors
            temp, humidity = read_temperature_humidity()
            light_value = read_light_level()
            
            # Display readings
            if temp is not None:
                print(f"🌡️  Temperature: {temp}°C")
            else:
                print("🌡️  Temperature: Sensor not available")
            
            if humidity is not None:
                print(f"💧 Humidity: {humidity}%")
            else:
                print("💧 Humidity: Sensor not available")
            
            if light_value is not None:
                print(f"☀️  Light Level: {light_value} ({light_level_description(light_value)})")
            else:
                print("☀️  Light Level: Sensor not available")
            
            # Analyze conditions and provide advice
            if temp is not None or light_value is not None:
                advice = check_planting_conditions(temp, humidity, light_value, season)
                
                print("\n📝 PLANTING ADVICE:")
                for message in advice['messages']:
                    print(f"   {message}")
                
                # Summary
                if advice['temperature_ok'] and advice['light_ok']:
                    print("\n✅ CONDITIONS ARE IDEAL FOR PLANTING!")
                elif advice['watering_needed']:
                    print("\n💧 WATERING RECOMMENDED TODAY")
            
            # Wait before next reading
            time.sleep(5)
            
    except KeyboardInterrupt:
        print("\n\n" + "="*60)
        print("SENSOR MONITORING STOPPED")
        print(f"Total readings collected: {reading_count}")
        print("="*60)
        print("\n🌟 COMPUTATIONAL THINKING CONCEPTS USED:")
        print("   • Data Collection: Gathering sensor information")
        print("   • Pattern Recognition: Identifying seasonal patterns")
        print("   • Conditional Logic: if/then decisions based on data")
        print("   • Abstraction: Representing complex environment with numbers")
        print("\n🌍 UBUNTU CONNECTION:")
        print("   Growing food together strengthens our community.")
        print("   Indigenous knowledge + Modern technology = Sustainable future!")
        print("\n   Ubuntu ngumuntu ngabantu - I am because we are! 🌱")
        print("="*60 + "\n")
    finally:
        # Turn off LEDs
        temp_led.off()
        light_led.off()

# ========== RUN THE PROGRAM ==========

if __name__ == "__main__":
    sensor_garden_demo()

# ========== EXTENSION ACTIVITIES ==========
# Teachers and learners can extend this code:
#
# 1. Add soil moisture sensor for automatic watering alerts
# 2. Log data to a file for long-term analysis
# 3. Create graphs showing daily/weekly temperature patterns
# 4. Add more indigenous crops to the seasonal database
# 5. Interview community elders and add their traditional planting wisdom
# 6. Create a "frost warning" system for winter
# 7. Build a mini weather station with multiple sensors
# 8. Design a seasonal planting calendar based on local climate
#
# Remember: Indigenous knowledge has sustained communities for generations.
# Technology helps us continue and share these valuable traditions!
# Ubuntu ngumuntu ngabantu - We grow together! 🌍🌱
