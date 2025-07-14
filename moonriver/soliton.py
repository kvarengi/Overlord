import math

def spherical_soliton_profile(theta: float, phi: float, t: float = 0, amplitude: float = 1.0, width: float = 1.0) -> float:
    """
    Упрощённый профиль сферического солитона на сфере:
    theta, phi — сферические координаты (радианы)
    t — время
    amplitude — амплитуда
    width — ширина солитона
    Возвращает значение профиля в данной точке.
    """
    # Пример: гауссов солитон, центрированный в (theta0, phi0)
    theta0, phi0 = math.pi / 2, 0  # экватор, меридиан 0
    r2 = (theta - theta0) ** 2 + (phi - phi0) ** 2
    profile = amplitude * math.exp(-r2 / (2 * width ** 2)) * math.cos(t)
    return profile