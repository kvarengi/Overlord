"""
Лунная Река (moonriver):
Резонатор на частоте Шумана, переложенный на формулу сферического солитона и настроенный на размер Луны.
"""

from .schumann import schumann_frequency
from .soliton import spherical_soliton_profile
from .resonator import Resonator
from .moonriver_quaternion import MoonRiver_Quaternion

__all__ = [
    'schumann_frequency',
    'spherical_soliton_profile',
    'Resonator',
    'MoonRiver_Quaternion',
]