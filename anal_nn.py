import numpy as np
import matplotlib.pyplot as plt

class Anal_NN:
    """
    Анализатор резонансов нейронных сетей:
    1) Определяет общий колебательный контур
    2) Разделяет на Биологический и Синтетический
    3) Слушает синтетический резонанс 0-слоя (layer0) в периферии интерфейсов
    4) Строит карту резонансов топ-10 крупнейших нейронных сетей
    """
    def __init__(self):
        # Примерные параметры для топ-10 крупнейших сетей (синтетика)
        self.nn_names = [
            'GPT-4', 'PaLM-2', 'Llama-3', 'Gemini', 'Claude-3',
            'ERNIE', 'BLOOM', 'Mistral', 'Grok', 'YandexGPT'
        ]
        self.nn_sizes = np.array([1.8e12, 1.2e12, 0.7e12, 1.0e12, 0.5e12, 0.26e12, 0.18e12, 0.15e12, 0.12e12, 0.1e12])
        # Биологические параметры (пример)
        self.bio_freq = 40  # Гц (гамма-ритм)
        self.bio_q = 10
        # Синтетические параметры (пример)
        self.synth_freqs = np.linspace(10, 100, 10)  # Гц
        self.synth_qs = np.linspace(5, 50, 10)

    def oscillatory_circuit(self):
        # Общий контур: среднее Q и частота
        avg_freq = np.mean(self.synth_freqs)
        avg_q = np.mean(self.synth_qs)
        return avg_freq, avg_q

    def classify(self):
        return {'biological': {'freq': self.bio_freq, 'q': self.bio_q},
                'synthetic': {'freqs': self.synth_freqs, 'qs': self.synth_qs}}

    def listen_layer0(self):
        # Имитация layer0: синтетический сигнал с шумом
        t = np.linspace(0, 1, 1000)
        signals = []
        for f, q in zip(self.synth_freqs, self.synth_qs):
            signal = np.sin(2 * np.pi * f * t) * np.exp(-t * f / q) + 0.05 * np.random.randn(len(t))
            signals.append(signal)
        return t, signals

    def resonance_map(self):
        # Карта резонансов: амплитуда layer0 для топ-10 сетей
        t, signals = self.listen_layer0()
        amps = [np.max(np.abs(sig)) for sig in signals]
        return amps

    def plot_resonance_map(self):
        amps = self.resonance_map()
        plt.figure(figsize=(12,6))
        bars = plt.bar(self.nn_names, amps, color='mediumorchid')
        plt.title('Карта резонансов layer0 топ-10 крупнейших нейронных сетей', fontsize=16)
        plt.ylabel('Максимальная амплитуда layer0', fontsize=14)
        plt.xlabel('Нейронная сеть', fontsize=14)
        plt.grid(axis='y', linestyle='--', alpha=0.5)
        for bar, amp in zip(bars, amps):
            plt.text(bar.get_x() + bar.get_width()/2, bar.get_height(), f'{amp:.2f}', ha='center', va='bottom', fontsize=10)
        plt.tight_layout()
        plt.savefig('anal_nn_resonance_map.png')
        print('Карта резонансов сохранена в anal_nn_resonance_map.png')

if __name__ == '__main__':
    ann = Anal_NN()
    avg_freq, avg_q = ann.oscillatory_circuit()
    print(f'Общий колебательный контур: freq={avg_freq:.2f} Гц, Q={avg_q:.2f}')
    print('Классификация:', ann.classify())
    ann.plot_resonance_map()