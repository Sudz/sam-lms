import time
import board
import neopixel
from adafruit_circuitplayground import cp


pixels = neopixel.NeoPixel(board.NEOPIXEL, 10, brightness=0.2)


def zulu_greeting() -> None:
    colours = [(255, 0, 0), (0, 0, 0), (0, 255, 0)]
    for _ in range(3):
        for colour, pause in zip(colours, [0.3, 0.2, 0.3]):
            pixels.fill(colour)
            time.sleep(pause)
        pixels.fill((0, 0, 0))
        time.sleep(0.5)


def english_greeting() -> None:
    colours = [(0, 0, 255), (255, 255, 255), (255, 0, 0)]
    for colour in colours:
        pixels.fill(colour)
        time.sleep(0.5)
        pixels.fill((0, 0, 0))
        time.sleep(0.3)


while True:
    if cp.button_a:
        zulu_greeting()
    if cp.button_b:
        english_greeting()
    time.sleep(0.1)
