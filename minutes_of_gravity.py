from moonriver import Resonator, MoonRiver_Quaternion
import numpy as np
from scipy.stats import entropy

# Основные гармоники (n=1..5)
harmonics = range(1, 6)
res = Resonator()

results = []
abs_amplitudes = []
rel_amplitudes = []
entropies = []

# Тонкая настройка: частота +-1% от резонансной
fine_tune_range = np.linspace(-0.01, 0.01, 21)

for n in harmonics:
    freq = res.schumann_frequency(n=n)
    # Абсолютная амплитуда: максимум профиля солитона при резонансной частоте
    amp_abs = abs(res.spherical_soliton_profile(theta=0.5, phi=1.0, t=0, amplitude=1.0, width=1.0))
    # Относительная амплитуда: максимум профиля при тонкой настройке (относительно резонансной)
    amps = []
    for delta in fine_tune_range:
        f_tuned = freq * (1 + delta)
        t = 1.0 / f_tuned
        amps.append(abs(res.spherical_soliton_profile(theta=0.5, phi=1.0, t=t, amplitude=1.0, width=1.0)))
    amp_rel = max(amps) / amp_abs if amp_abs != 0 else 0
    # Энтропия: по нормированному ряду амплитуд
    amps_norm = np.array(amps) / np.sum(amps) if np.sum(amps) > 0 else np.zeros_like(amps)
    ent = entropy(amps_norm)
    results.append((n, freq))
    abs_amplitudes.append(amp_abs)
    rel_amplitudes.append(amp_rel)
    entropies.append(ent)

# Замер динамического тензора для каждой гармоники
q = MoonRiver_Quaternion(amplitude=1.0)
t = 1.0
omega = 1.0
axis = (0, 0, 1)
quaternion_tensors = []
for n in harmonics:
    tensor = q.dynamic_tensor(t=t, omega=omega * n, axis=axis)
    quaternion_tensors.append((n, tensor))

with open('minutes_of_gravity.txt', 'w') as f:
    f.write('OGLR (Основные гармоники лунных резонансов)\n')
    f.write('n\tfrequency_Hz\tabs_amplitude\trel_amplitude\tentropy\n')
    for i, (n, freq) in enumerate(results):
        f.write(f'{n}\t{freq:.6f}\t{abs_amplitudes[i]:.6f}\t{rel_amplitudes[i]:.6f}\t{entropies[i]:.6f}\n')
    f.write('\nMoonRiver_Quaternion dynamic tensors (t=1.0, axis=(0,0,1))\n')
    for n, tensor in quaternion_tensors:
        f.write(f'n={n}\n')
        for row in tensor:
            f.write('\t'.join(f'{v:.6f}' for v in row) + '\n')
        f.write('\n')

print('Результаты (амплитуды, энтропия, тензоры) записаны в minutes_of_gravity.txt')