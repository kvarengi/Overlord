import numpy as np
from .resonator import Resonator

class SeaResonance:
    """
    Резонатор OGL-S с волнами мирового океана на основе данных seaman.
    Позволяет моделировать резонансные явления с учётом океанических волн.
    """
    def __init__(self, ocean_wave_data=None, ocean_scale=1.0):
        """
        ocean_wave_data: np.ndarray или list — временной ряд высот волн (или None для генерации синтетических данных)
        ocean_scale: коэффициент масштабирования влияния океана
        """
        self.resonator = Resonator()
        if ocean_wave_data is None:
            # Генерируем синтетические данные: суперпозиция синусов с шумом
            t = np.linspace(0, 24*3600, 1024)
            waves = np.sin(2 * np.pi * t / 43200) + 0.5 * np.sin(2 * np.pi * t / 21600) + 0.1 * np.random.randn(len(t))
            self.ocean_wave_data = waves
            self.time = t
        else:
            self.ocean_wave_data = np.array(ocean_wave_data)
            self.time = np.arange(len(self.ocean_wave_data))
        self.ocean_scale = ocean_scale

    def get_ocean_wave(self, t: float) -> float:
        """
        Возвращает высоту волны в момент времени t (секунды).
        """
        idx = int((t / self.time[-1]) * (len(self.ocean_wave_data) - 1))
        return self.ocean_wave_data[idx] * self.ocean_scale

    def sea_resonance_signal(self, n: int = 1, duration: float = 3600, sample_rate: float = 1.0) -> np.ndarray:
        """
        Моделирует сигнал резонатора OGL-S с учётом влияния океанических волн.
        n: гармоника
        duration: длительность (сек)
        sample_rate: частота дискретизации (Гц)
        Возвращает временной ряд сигнала.
        """
        num_points = int(duration * sample_rate)
        t_arr = np.linspace(0, duration, num_points)
        base_signal = np.array([
            self.resonator.spherical_soliton_profile(theta=0.5, phi=1.0, t=t, amplitude=1.0, width=1.0)
            for t in t_arr
        ])
        ocean_mod = np.array([self.get_ocean_wave(t) for t in t_arr])
        signal = base_signal * (1 + ocean_mod)
        return t_arr, signal