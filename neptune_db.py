import numpy as np
import matplotlib.pyplot as plt
from moonriver import Resonator, SeaResonance, MoonRiver_Quaternion

# Параметры
num_records = 100
sample_duration = 600  # секунд (10 минут)
sample_rate = 1.0  # Гц

# Инициализация резонаторов
sea_res = SeaResonance()
lunar_res = Resonator()
q = MoonRiver_Quaternion()

# Сбор данных
records = []
for i in range(num_records):
    t0 = i * sample_duration
    t_arr = np.linspace(t0, t0 + sample_duration, int(sample_duration * sample_rate))
    # Сигналы
    _, sea_signal = sea_res.sea_resonance_signal(n=1, duration=sample_duration, sample_rate=sample_rate)
    lunar_signal = np.array([
        lunar_res.spherical_soliton_profile(theta=0.5, phi=1.0, t=t, amplitude=1.0, width=1.0)
        for t in t_arr
    ])
    # Кватернион-разница: разность средних амплитуд, как амплитуда для динамического тензора
    amp_diff = float(np.mean(sea_signal) - np.mean(lunar_signal))
    tensor = q.dynamic_tensor(t=i, omega=1.0, axis=(0,0,1))
    records.append({
        'index': i,
        'amp_diff': amp_diff,
        'tensor': tensor
    })

# Сохраняем базу
with open('neptune_db.txt', 'w') as f:
    f.write('# Neptune DB: кватернион-разница резонанса между Морем и Луной\n')
    f.write('# index\tamp_diff\ttensor_flat\n')
    for rec in records:
        tensor_flat = [f'{v:.6f}' for row in rec['tensor'] for v in row]
        f.write(f"{rec['index']}\t{rec['amp_diff']:.6f}\t" + '\t'.join(tensor_flat) + '\n')

# Визуализация
amp_diffs = [rec['amp_diff'] for rec in records]
plt.figure(figsize=(10,5))
plt.plot(range(num_records), amp_diffs, marker='o', label='Кватернион-разница (амплитуда)')
plt.title('Кватернион-разница резонанса: Море vs Луна')
plt.xlabel('Запись')
plt.ylabel('Разница средних амплитуд')
plt.grid(True, linestyle='--', alpha=0.5)
plt.legend()
plt.tight_layout()
plt.savefig('neptune_db_plot.png')
print('База Neptune и график сохранены.')