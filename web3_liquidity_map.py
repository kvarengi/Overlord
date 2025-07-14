import numpy as np
import matplotlib.pyplot as plt
from moonriver import MoonRiver_Quaternion, Resonator

# Примерные данные по Web3 виртуальным машинам
vm_names = [
    'EVM', 'WASM', 'SolanaVM', 'MoveVM', 'CosmWasm',
    'FuelVM', 'NearVM', 'PolkadotVM', 'AptosVM', 'SuiVM'
]

# Синтетические данные: активность пользователей (амплитуда состояний)
np.random.seed(42)
user_activity = np.abs(np.random.normal(loc=1.0, scale=0.3, size=len(vm_names)))

# Кватернион лунного резонанса (стабильный эталон)
lunar_q = MoonRiver_Quaternion(amplitude=1.0)
lunar_tensor = lunar_q.dynamic_tensor(t=0, omega=1.0, axis=(0,0,1))
lunar_amp = np.linalg.norm(lunar_tensor)

# Ликвидность: соответствие амплитуд резонансов пользователей с лунным эталоном
liquidity = []
for i, act in enumerate(user_activity):
    # Имитация: чем ближе амплитуда к лунному эталону, тем выше ликвидность
    diff = abs(act - lunar_amp)
    score = np.exp(-diff)  # экспоненциальное затухание
    liquidity.append(score)
liquidity = np.array(liquidity)

# Визуализация
plt.figure(figsize=(12,6))
bars = plt.bar(vm_names, liquidity, color='deepskyblue')
plt.title('Карта Ликвидности Web3 Виртуальных Машин', fontsize=16)
plt.ylabel('Ликвидность (соответствие лунному резонансу)', fontsize=14)
plt.xlabel('Виртуальная машина', fontsize=14)
plt.grid(axis='y', linestyle='--', alpha=0.5)
for bar, score in zip(bars, liquidity):
    plt.text(bar.get_x() + bar.get_width()/2, bar.get_height(), f'{score:.2f}', ha='center', va='bottom', fontsize=10)
plt.tight_layout()
plt.savefig('web3_liquidity_map.png')
print('Карта ликвидности сохранена в web3_liquidity_map.png')