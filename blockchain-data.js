// Модуль для работы с блокчейн данными и эмиссией энтропии
class BlockchainDataManager {
    constructor() {
        this.transactions = [];
        this.entropyEmission = 0;
        this.lastBlockHeight = 0;
        this.entropyHistory = [];
        
        this.initMockData();
    }

    initMockData() {
        // Имитация блокчейн транзакций BitMoon
        this.generateMockTransactions();
        this.startEntropyEmission();
    }

    generateMockTransactions() {
        const transactionTypes = [
            'DeFi Swap', 'NFT Mint', 'DAO Vote', 'Staking', 
            'Liquidity Provision', 'Cross-chain Transfer', 'Oracle Update'
        ];

        // Генерация исторических транзакций
        for (let i = 0; i < 100; i++) {
            const timestamp = Date.now() - Math.random() * 86400000 * 30; // Последние 30 дней
            const type = transactionTypes[Math.floor(Math.random() * transactionTypes.length)];
            const value = Math.random() * 1000;
            const entropy = this.calculateTransactionEntropy(type, value);

            this.transactions.push({
                id: `tx_${i}`,
                type,
                value,
                timestamp,
                entropy,
                blockHeight: Math.floor(Math.random() * 1000000)
            });
        }
    }

    calculateTransactionEntropy(type, value) {
        // Расчет энтропии транзакции на основе типа и значения
        const baseEntropy = {
            'DeFi Swap': 0.8,
            'NFT Mint': 0.9,
            'DAO Vote': 0.7,
            'Staking': 0.6,
            'Liquidity Provision': 0.85,
            'Cross-chain Transfer': 0.95,
            'Oracle Update': 0.75
        };

        const typeEntropy = baseEntropy[type] || 0.5;
        const valueFactor = Math.min(value / 1000, 1);
        const timeFactor = Math.random() * 0.2;

        return Math.min(1, typeEntropy * (0.8 + valueFactor * 0.2 + timeFactor));
    }

    startEntropyEmission() {
        // Эмиссия энтропии каждые 5 секунд
        setInterval(() => {
            this.emitEntropy();
        }, 5000);
    }

    emitEntropy() {
        const emission = Math.random() * 0.1 + 0.05; // 0.05 - 0.15
        this.entropyEmission += emission;
        
        // Добавление в историю
        this.entropyHistory.push({
            timestamp: Date.now(),
            emission,
            total: this.entropyEmission
        });

        // Ограничение истории до последних 100 записей
        if (this.entropyHistory.length > 100) {
            this.entropyHistory.shift();
        }

        // Генерация новой транзакции
        this.generateNewTransaction();
    }

    generateNewTransaction() {
        const transactionTypes = [
            'DeFi Swap', 'NFT Mint', 'DAO Vote', 'Staking', 
            'Liquidity Provision', 'Cross-chain Transfer', 'Oracle Update'
        ];

        const type = transactionTypes[Math.floor(Math.random() * transactionTypes.length)];
        const value = Math.random() * 1000;
        const entropy = this.calculateTransactionEntropy(type, value);

        const newTransaction = {
            id: `tx_${Date.now()}`,
            type,
            value,
            timestamp: Date.now(),
            entropy,
            blockHeight: this.lastBlockHeight + Math.floor(Math.random() * 10) + 1
        };

        this.transactions.push(newTransaction);
        this.lastBlockHeight = newTransaction.blockHeight;

        // Ограничение транзакций до последних 1000
        if (this.transactions.length > 1000) {
            this.transactions = this.transactions.slice(-1000);
        }

        // Уведомление о новой транзакции
        this.notifyNewTransaction(newTransaction);
    }

    notifyNewTransaction(transaction) {
        // Создание события для уведомления о новой транзакции
        const event = new CustomEvent('newTransaction', {
            detail: {
                transaction,
                entropyEmission: this.entropyEmission
            }
        });
        document.dispatchEvent(event);
    }

    getRecentTransactions(limit = 10) {
        return this.transactions
            .sort((a, b) => b.timestamp - a.timestamp)
            .slice(0, limit);
    }

    getEntropyStats() {
        const recentTransactions = this.getRecentTransactions(50);
        const avgEntropy = recentTransactions.reduce((sum, tx) => sum + tx.entropy, 0) / recentTransactions.length;
        
        return {
            totalEmission: this.entropyEmission,
            averageEntropy: avgEntropy,
            transactionCount: this.transactions.length,
            recentEmission: this.entropyHistory.slice(-10).reduce((sum, h) => sum + h.emission, 0)
        };
    }

    getTransactionByType(type) {
        return this.transactions.filter(tx => tx.type === type);
    }

    getEntropyHistory() {
        return this.entropyHistory;
    }

    // Метод для расчета влияния интерфейсов на экосистему
    calculateInterfaceImpact(interfaceType, dataWeight) {
        const impactFactors = {
            'DeFi': 0.9,
            'NFT': 0.8,
            'DAO': 0.7,
            'Cross-chain': 0.95,
            'Oracle': 0.85,
            'Privacy': 0.75,
            'Gaming': 0.6,
            'Social': 0.65
        };

        const baseImpact = impactFactors[interfaceType] || 0.5;
        const weightedImpact = baseImpact * dataWeight;
        const entropyContribution = weightedImpact * this.entropyEmission * 0.1;

        return {
            impact: weightedImpact,
            entropyContribution,
            interfaceType,
            dataWeight
        };
    }

    // Метод для получения данных о влиянии на нулевой слой
    getZeroLayerImpact() {
        const zeroLayerInterfaces = [
            { type: 'BitMoon Core', weight: 1.0, entropy: 0.0 },
            { type: 'Consensus Layer', weight: 0.95, entropy: 0.1 },
            { type: 'Network Layer', weight: 0.9, entropy: 0.15 },
            { type: 'Data Layer', weight: 0.85, entropy: 0.2 }
        ];

        return zeroLayerInterfaces.map(interface => ({
            ...interface,
            impact: this.calculateInterfaceImpact(interface.type, interface.weight)
        }));
    }
}

// Экспорт для использования в основном файле
window.BlockchainDataManager = BlockchainDataManager;