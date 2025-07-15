from .schumann import schumann_frequency
from .soliton import spherical_soliton_profile
from .constants import MOON_RADIUS

class Resonator:
    def __init__(self, radius: float = MOON_RADIUS):
        self.radius = radius

    def schumann_frequency(self, n: int = 1) -> float:
        return schumann_frequency(n=n, radius=self.radius)

    def spherical_soliton_profile(self, theta: float, phi: float, t: float = 0, amplitude: float = 1.0, width: float = 1.0) -> float:
        return spherical_soliton_profile(theta, phi, t, amplitude, width)