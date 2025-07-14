from moonriver import Resonator, MoonRiver_Quaternion

# Основные гармоники (n=1..5)
harmonics = range(1, 6)
res = Resonator()

results = []
for n in harmonics:
    freq = res.schumann_frequency(n=n)
    results.append((n, freq))

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
    f.write('n\tfrequency_Hz\n')
    for n, freq in results:
        f.write(f'{n}\t{freq:.6f}\n')
    f.write('\nMoonRiver_Quaternion dynamic tensors (t=1.0, axis=(0,0,1))\n')
    for n, tensor in quaternion_tensors:
        f.write(f'n={n}\n')
        for row in tensor:
            f.write('\t'.join(f'{v:.6f}' for v in row) + '\n')
        f.write('\n')

print('Результаты (включая MoonRiver_Quaternion) записаны в minutes_of_gravity.txt')