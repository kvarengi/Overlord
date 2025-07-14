import math
from typing import Tuple, List

class MoonRiver_Quaternion:
    """
    Класс для моделирования динамического тензора движения нормированной амплитуды с использованием кватернионов.
    """
    def __init__(self, amplitude: float = 1.0):
        self.amplitude = amplitude

    @staticmethod
    def normalize_quaternion(q: Tuple[float, float, float, float]) -> Tuple[float, float, float, float]:
        norm = math.sqrt(sum(x*x for x in q))
        return tuple(x / norm for x in q)

    def dynamic_tensor(self, t: float, omega: float = 1.0, axis: Tuple[float, float, float] = (0, 0, 1)) -> List[List[float]]:
        """
        Вычисляет динамический тензор движения нормированной амплитуды на момент времени t.
        omega — угловая скорость (рад/с)
        axis — ось вращения (нормированный вектор)
        Возвращает 3x3 матрицу (тензор вращения).
        """
        ax, ay, az = axis
        norm = math.sqrt(ax*ax + ay*ay + az*az)
        if norm == 0:
            ax, ay, az = 0, 0, 1
        else:
            ax, ay, az = ax/norm, ay/norm, az/norm
        theta = omega * t
        w = math.cos(theta/2)
        x = ax * math.sin(theta/2)
        y = ay * math.sin(theta/2)
        z = az * math.sin(theta/2)
        q = self.normalize_quaternion((w, x, y, z))
        # Кватернион в матрицу вращения (тензор)
        w, x, y, z = q
        tensor = [
            [1 - 2*(y*y + z*z),     2*(x*y - z*w),     2*(x*z + y*w)],
            [    2*(x*y + z*w), 1 - 2*(x*x + z*z),     2*(y*z - x*w)],
            [    2*(x*z - y*w),     2*(y*z + x*w), 1 - 2*(x*x + y*y)]
        ]
        # Масштабируем на амплитуду
        return [[self.amplitude * v for v in row] for row in tensor]