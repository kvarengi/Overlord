import matplotlib.pyplot as plt
import numpy as np

# Чтение данных из minutes_of_gravity.txt
harmonics = []
frequencies = []
abs_amplitudes = []
rel_amplitudes = []
entropies = []

with open('minutes_of_gravity.txt') as f:
    for line in f:
        if line.startswith('n\t') or line.strip() == '' or line.startswith('OGLR'):
            continue
        if line.startswith('MoonRiver_Quaternion'):
            break
        parts = line.strip().split('\t')
        if len(parts) >= 5:
            n, freq, amp_abs, amp_rel, ent = parts[:5]
            harmonics.append(int(n))
            frequencies.append(float(freq))
            abs_amplitudes.append(float(amp_abs))
            rel_amplitudes.append(float(amp_rel))
            entropies.append(float(ent))

harmonics = np.array(harmonics)

plt.figure(figsize=(10, 6))
plt.subplot(3, 1, 1)
plt.plot(harmonics, abs_amplitudes, 'o-', label='Абсолютная амплитуда')
plt.ylabel('Абс. амплитуда')
plt.grid(True)
plt.legend()

plt.subplot(3, 1, 2)
plt.plot(harmonics, rel_amplitudes, 's-', label='Относительная амплитуда')
plt.ylabel('Отн. амплитуда')
plt.grid(True)
plt.legend()

plt.subplot(3, 1, 3)
plt.plot(harmonics, entropies, 'd-', label='Энтропия')
plt.xlabel('Гармоника n')
plt.ylabel('Энтропия')
plt.grid(True)
plt.legend()

plt.tight_layout()
plt.savefig('minutes_of_gravity_plots.png')
print('Графики сохранены в minutes_of_gravity_plots.png')