import time
from adafruit_circuitplayground import cp


def springbok_jump() -> None:
    for _ in range(3):
        cp.play_tone(800, 0.2)
        time.sleep(0.3)


def chameleon_movement() -> None:
    cp.pixels.fill((0, 255, 0))
    for index in range(10):
        cp.pixels[index] = (0, 180, 60)
        time.sleep(0.5)
    cp.pixels.fill((0, 0, 0))


def meerkat_alert() -> None:
    for frequency in range(400, 850, 75):
        cp.play_tone(frequency, 0.1)
    cp.red_led = True
    time.sleep(2)
    cp.red_led = False


while True:
    if cp.shake(shake_threshold=20):
        springbok_jump()
    if cp.touch_A1:
        chameleon_movement()
    if cp.touch_A2:
        meerkat_alert()
    time.sleep(0.1)
