from moonriver import Resonator

# Основные гармоники (n=1..5)
harmonics = range(1, 6)
res = Resonator()

results = []
for n in harmonics:
    freq = res.schumann_frequency(n=n)
    results.append((n, freq))

with open('minutes_of_gravity.txt', 'w') as f:
    f.write('OGLR (Основные гармоники лунных резонансов)\n')
    f.write('n\tfrequency_Hz\n')
    for n, freq in results:
        f.write(f'{n}\t{freq:.6f}\n')

print('Результаты записаны в minutes_of_gravity.txt')