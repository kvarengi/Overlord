import numpy as np
from typing import List, Any
from .resonator import Resonator
from .moonriver_quaternion import MoonRiver_Quaternion

class TheMoon_Int:
    """
    Кватернионный Интерпретатор Лунного Кода.
    Интерпретирует сигналы с резонатора OGL как строки кода.
    Настройки:
      - clock_rate: тактовая частота считывания (Hz)
      - fractal_integrity: фрактальная целостность структуры кодовой базы (0..1)
    """
    def __init__(self, clock_rate: float = 1.0, fractal_integrity: float = 1.0):
        self.clock_rate = clock_rate
        self.fractal_integrity = fractal_integrity
        self.resonator = Resonator()
        self.quaternion = MoonRiver_Quaternion()

    def read_signal(self, n: int = 1, duration: float = 1.0) -> List[float]:
        """
        Считывает сигнал с резонатора OGL для гармоники n за время duration.
        Возвращает временной ряд амплитуд.
        """
        freq = self.resonator.schumann_frequency(n=n)
        tacts = int(duration * self.clock_rate)
        times = np.linspace(0, duration, tacts)
        signal = [self.resonator.spherical_soliton_profile(theta=0.5, phi=1.0, t=t, amplitude=1.0, width=1.0) for t in times]
        return signal

    def interpret(self, n: int = 1, duration: float = 1.0) -> str:
        """
        Интерпретирует сигнал как строку кода с учетом фрактальной целостности.
        """
        signal = self.read_signal(n=n, duration=duration)
        # Фрактальная обработка: повторение и масштабирование паттернов
        code = ''
        base_symbols = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
        for i, amp in enumerate(signal):
            # Фрактальная целостность влияет на повторяемость и вложенность
            idx = int(abs(amp * self.fractal_integrity * 10)) % len(base_symbols)
            code += base_symbols[idx]
            # Фрактальное повторение на разных масштабах
            if self.fractal_integrity > 0.5 and i % int(max(1, self.clock_rate // 2)) == 0:
                code += base_symbols[(idx + i) % len(base_symbols)]
        return code