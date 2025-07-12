// Демо-данные для случаев, когда реальные API недоступны
class DemoData {
    constructor() {
        this.demoAddresses = {
            ethereum: [
                {
                    address: '0x28C6c06298d514Db089934071355E5743bf21d60',
                    name: 'Binance Hot Wallet',
                    type: 'CEX',
                    description: 'Binance hot wallet for ETH',
                    balance: '1234567890000000000000000',
                    transactionCount: 15420,
                    entropy: 0.85
                },
                {
                    address: '0x21a31Ee1afC51d94C2eFcCAa2092aD1028285549',
                    name: 'Binance Cold Wallet',
                    type: 'CEX',
                    description: 'Binance cold storage',
                    balance: '9876543210000000000000000',
                    transactionCount: 8920,
                    entropy: 0.78
                },
                {
                    address: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
                    name: 'Uniswap V2 Router',
                    type: 'DEX',
                    description: 'Uniswap V2 router contract',
                    balance: '456789123000000000000000',
                    transactionCount: 45678,
                    entropy: 0.92
                },
                {
                    address: '0xE592427A0AEce92De3Edee1F18E0157C05861564',
                    name: 'Uniswap V3 Router',
                    type: 'DEX',
                    description: 'Uniswap V3 router',
                    balance: '789123456000000000000000',
                    transactionCount: 34567,
                    entropy: 0.89
                },
                {
                    address: '0x1111111254fb6c44bAC0beD2854e76F90643097d',
                    name: '1inch Router',
                    type: 'DEX',
                    description: '1inch aggregation router',
                    balance: '234567890000000000000000',
                    transactionCount: 23456,
                    entropy: 0.91
                },
                {
                    address: '0x7F367cC41522cE07553e823bf3be079A2cEe8212',
                    name: 'USDT Treasury',
                    type: 'Stablecoin',
                    description: 'USDT treasury wallet',
                    balance: '5678901230000000000000000',
                    transactionCount: 12345,
                    entropy: 0.76
                },
                {
                    address: '0x5754284f345afc66a98fbB0a0Afe71e0F007B949',
                    name: 'USDC Treasury',
                    type: 'Stablecoin',
                    description: 'USDC treasury wallet',
                    balance: '3456789010000000000000000',
                    transactionCount: 9876,
                    entropy: 0.74
                },
                {
                    address: '0xBE0eB53F46cd790Cd13851d5EFf43D12404d33E8',
                    name: 'Binance US',
                    type: 'CEX',
                    description: 'Binance US wallet',
                    balance: '6789012340000000000000000',
                    transactionCount: 11234,
                    entropy: 0.82
                }
            ],
            binance: [
                {
                    address: '0x8894e0a0c962cb723c1976a4421c95949be2d4e3',
                    name: 'Binance Hot Wallet BSC',
                    type: 'CEX',
                    description: 'Binance hot wallet on BSC',
                    balance: '9876543210000000000000000',
                    transactionCount: 8765,
                    entropy: 0.79
                },
                {
                    address: '0x3f5ce5fbfe3e9af3971dd833d26ba9b5c936f0be',
                    name: 'Binance Cold Wallet BSC',
                    type: 'CEX',
                    description: 'Binance cold storage on BSC',
                    balance: '12345678900000000000000000',
                    transactionCount: 5432,
                    entropy: 0.71
                },
                {
                    address: '0x10ed43c718714eb63d5aa57b78b54704e256024e',
                    name: 'PancakeSwap Router',
                    type: 'DEX',
                    description: 'PancakeSwap router contract',
                    balance: '234567890000000000000000',
                    transactionCount: 34567,
                    entropy: 0.88
                },
                {
                    address: '0x05ff2b0db69458a0750badebc4f9e13add608c7f',
                    name: 'PancakeSwap Factory',
                    type: 'DEX',
                    description: 'PancakeSwap factory contract',
                    balance: '123456789000000000000000',
                    transactionCount: 23456,
                    entropy: 0.85
                }
            ],
            polygon: [
                {
                    address: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
                    name: 'Polygon WMATIC',
                    type: 'Bridge',
                    description: 'Wrapped MATIC token',
                    balance: '4567891230000000000000000',
                    transactionCount: 15678,
                    entropy: 0.83
                },
                {
                    address: '0xa5e0829caced8ffdd4de3c43696c57f7d7a678ff',
                    name: 'QuickSwap Router',
                    type: 'DEX',
                    description: 'QuickSwap router contract',
                    balance: '345678901000000000000000',
                    transactionCount: 12345,
                    entropy: 0.87
                }
            ]
        };
    }

    getDemoVisualizationData() {
        const nodes = [];
        const connections = [];

        let nodeId = 0;
        const centerNode = {
            id: nodeId++,
            name: 'BitMoon',
            type: 'center',
            x: 0, y: 0, z: 0,
            color: 0xff6b6b,
            entropy: 0,
            size: 2
        };
        nodes.push(centerNode);

        for (const [chain, addresses] of Object.entries(this.demoAddresses)) {
            addresses.forEach((addr, index) => {
                const angle = (index / addresses.length) * Math.PI * 2;
                const radius = 15 + Math.random() * 10;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                const z = (Math.random() - 0.5) * 10;

                const color = this.getColorByType(addr.type);

                const node = {
                    id: nodeId++,
                    name: addr.name,
                    type: addr.type,
                    address: addr.address,
                    x, y, z,
                    color,
                    entropy: addr.entropy,
                    size: 1 + addr.entropy * 0.5,
                    balance: addr.balance,
                    transactionCount: addr.transactionCount
                };

                nodes.push(node);

                // Соединение с центром
                connections.push({
                    from: centerNode.id,
                    to: node.id,
                    entropy: addr.entropy
                });
            });
        }

        return { nodes, connections };
    }

    getColorByType(type) {
        const colors = {
            'CEX': 0xff6b6b,
            'DEX': 0x4ecdc4,
            'Stablecoin': 0x45b7d1,
            'Bridge': 0xffa726,
            'DeFi': 0xab47bc,
            'NFT': 0x26a69a,
            'Gaming': 0xef5350,
            'Social': 0x42a5f5
        };

        return colors[type] || 0x888888;
    }

    // Метод для получения демо транзакций
    getDemoTransactions() {
        const transactionTypes = [
            'DeFi Swap', 'NFT Mint', 'DAO Vote', 'Staking', 
            'Liquidity Provision', 'Cross-chain Transfer', 'Oracle Update'
        ];

        const transactions = [];
        for (let i = 0; i < 50; i++) {
            const timestamp = Date.now() - Math.random() * 86400000 * 7; // Последние 7 дней
            const type = transactionTypes[Math.floor(Math.random() * transactionTypes.length)];
            const value = Math.random() * 1000;
            const entropy = this.calculateTransactionEntropy(type, value);

            transactions.push({
                id: `demo_tx_${i}`,
                type,
                value,
                timestamp,
                entropy,
                blockHeight: Math.floor(Math.random() * 1000000)
            });
        }

        return transactions;
    }

    calculateTransactionEntropy(type, value) {
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
}

// Экспорт для использования в основном файле
window.DemoData = DemoData;