import matplotlib.pyplot as plt
import numpy as np

# Чтение исторических данных
times = []
amplitudes = []
with open('ogl1_history.txt') as f:
    for line in f:
        if line.startswith('#') or line.strip() == '':
            continue
        t, a = line.strip().split('\t')
        times.append(float(t) / 3600)  # переводим в часы
        amplitudes.append(float(a))

plt.figure(figsize=(12, 6))
plt.plot(times, amplitudes, color='royalblue', linewidth=2, label='Амплитуда OGL1')
plt.title('Исторические данные сигнального резонанса OGL1 (n=1)', fontsize=16)
plt.xlabel('Время, часы', fontsize=14)
plt.ylabel('Амплитуда', fontsize=14)
plt.grid(True, linestyle='--', alpha=0.5)
plt.legend(loc='upper right', fontsize=12, frameon=True, facecolor='white', edgecolor='gray')
plt.tight_layout()
plt.savefig('ogl1_history_plot.png')
print('График сохранён в ogl1_history_plot.png')