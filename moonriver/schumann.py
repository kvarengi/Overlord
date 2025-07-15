from .constants import MOON_RADIUS, SPEED_OF_LIGHT
import math

def schumann_frequency(n: int = 1, radius: float = MOON_RADIUS) -> float:
    """
    Вычисляет частоту Шумана для сферы радиусом radius (по умолчанию — радиус Луны).
    n: номер гармоники (n=1 — основная частота)
    Возвращает частоту в герцах (Hz).
    """
    return (SPEED_OF_LIGHT / (2 * math.pi * radius)) * math.sqrt(n * (n + 1))