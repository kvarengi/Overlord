// Модуль для работы с реальными блокчейн API
class BlockchainAPI {
    constructor() {
        this.apis = {
            ethereum: {
                baseUrl: 'https://api.etherscan.io/api',
                apiKey: 'YourApiKeyToken', // Замените на ваш ключ
                endpoints: {
                    balance: '/api?module=account&action=balance',
                    transactions: '/api?module=account&action=txlist',
                    tokenBalance: '/api?module=account&action=tokentx'
                }
            },
            binance: {
                baseUrl: 'https://api.bscscan.com/api',
                apiKey: 'YourApiKeyToken', // Замените на ваш ключ
                endpoints: {
                    balance: '/api?module=account&action=balance',
                    transactions: '/api?module=account&action=txlist'
                }
            },
            polygon: {
                baseUrl: 'https://api.polygonscan.com/api',
                apiKey: 'YourApiKeyToken', // Замените на ваш ключ
                endpoints: {
                    balance: '/api?module=account&action=balance',
                    transactions: '/api?module=account&action=txlist'
                }
            }
        };

        // Самые ликвидные адреса (Top DeFi, DEX, CEX)
        this.liquidAddresses = {
            ethereum: [
                {
                    address: '0x28C6c06298d514Db089934071355E5743bf21d60',
                    name: 'Binance Hot Wallet',
                    type: 'CEX',
                    description: 'Binance hot wallet for ETH'
                },
                {
                    address: '0x21a31Ee1afC51d94C2eFcCAa2092aD1028285549',
                    name: 'Binance Cold Wallet',
                    type: 'CEX',
                    description: 'Binance cold storage'
                },
                {
                    address: '0x47ac0FcbF2F8024A0C4C3C3C3C3C3C3C3C3C3C3',
                    name: 'Uniswap V3 Router',
                    type: 'DEX',
                    description: 'Uniswap V3 router contract'
                },
                {
                    address: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
                    name: 'Uniswap V2 Router',
                    type: 'DEX',
                    description: 'Uniswap V2 router contract'
                },
                {
                    address: '0xE592427A0AEce92De3Edee1F18E0157C05861564',
                    name: 'Uniswap V3 Router',
                    type: 'DEX',
                    description: 'Uniswap V3 router'
                },
                {
                    address: '0x1111111254fb6c44bAC0beD2854e76F90643097d',
                    name: '1inch Router',
                    type: 'DEX',
                    description: '1inch aggregation router'
                },
                {
                    address: '0x7F367cC41522cE07553e823bf3be079A2cEe8212',
                    name: 'USDT Treasury',
                    type: 'Stablecoin',
                    description: 'USDT treasury wallet'
                },
                {
                    address: '0x5754284f345afc66a98fbB0a0Afe71e0F007B949',
                    name: 'USDC Treasury',
                    type: 'Stablecoin',
                    description: 'USDC treasury wallet'
                },
                {
                    address: '0xBE0eB53F46cd790Cd13851d5EFf43D12404d33E8',
                    name: 'Binance US',
                    type: 'CEX',
                    description: 'Binance US wallet'
                },
                {
                    address: '0x28C6c06298d514Db089934071355E5743bf21d60',
                    name: 'Binance Hot Wallet 2',
                    type: 'CEX',
                    description: 'Another Binance hot wallet'
                }
            ],
            binance: [
                {
                    address: '0x8894e0a0c962cb723c1976a4421c95949be2d4e3',
                    name: 'Binance Hot Wallet BSC',
                    type: 'CEX',
                    description: 'Binance hot wallet on BSC'
                },
                {
                    address: '0x3f5ce5fbfe3e9af3971dd833d26ba9b5c936f0be',
                    name: 'Binance Cold Wallet BSC',
                    type: 'CEX',
                    description: 'Binance cold storage on BSC'
                },
                {
                    address: '0x10ed43c718714eb63d5aa57b78b54704e256024e',
                    name: 'PancakeSwap Router',
                    type: 'DEX',
                    description: 'PancakeSwap router contract'
                },
                {
                    address: '0x05ff2b0db69458a0750badebc4f9e13add608c7f',
                    name: 'PancakeSwap Factory',
                    type: 'DEX',
                    description: 'PancakeSwap factory contract'
                }
            ],
            polygon: [
                {
                    address: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
                    name: 'Polygon WMATIC',
                    type: 'Bridge',
                    description: 'Wrapped MATIC token'
                },
                {
                    address: '0xa5e0829caced8ffdd4de3c43696c57f7d7a678ff',
                    name: 'QuickSwap Router',
                    type: 'DEX',
                    description: 'QuickSwap router contract'
                }
            ]
        };

        this.cache = new Map();
        this.cacheTimeout = 5 * 60 * 1000; // 5 минут
    }

    async fetchData(url, options = {}) {
        try {
            const response = await fetch(url, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API fetch error:', error);
            return null;
        }
    }

    async getAddressBalance(chain, address) {
        const cacheKey = `balance_${chain}_${address}`;
        const cached = this.cache.get(cacheKey);
        
        if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
            return cached.data;
        }

        const api = this.apis[chain];
        if (!api) return null;

        const url = `${api.baseUrl}${api.endpoints.balance}&address=${address}&apikey=${api.apiKey}`;
        const data = await this.fetchData(url);

        if (data && data.status === '1') {
            const result = {
                address,
                balance: data.result,
                timestamp: Date.now()
            };

            this.cache.set(cacheKey, {
                data: result,
                timestamp: Date.now()
            });

            return result;
        }

        return null;
    }

    async getAddressTransactions(chain, address, startBlock = 0, endBlock = 99999999) {
        const cacheKey = `tx_${chain}_${address}_${startBlock}_${endBlock}`;
        const cached = this.cache.get(cacheKey);
        
        if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
            return cached.data;
        }

        const api = this.apis[chain];
        if (!api) return null;

        const url = `${api.baseUrl}${api.endpoints.transactions}&address=${address}&startblock=${startBlock}&endblock=${endBlock}&apikey=${api.apiKey}`;
        const data = await this.fetchData(url);

        if (data && data.status === '1') {
            const result = {
                address,
                transactions: data.result,
                count: data.result.length,
                timestamp: Date.now()
            };

            this.cache.set(cacheKey, {
                data: result,
                timestamp: Date.now()
            });

            return result;
        }

        return null;
    }

    async getLiquidAddressesData(chain = 'ethereum') {
        const addresses = this.liquidAddresses[chain] || [];
        const results = [];

        for (const addrInfo of addresses) {
            try {
                const balance = await this.getAddressBalance(chain, addrInfo.address);
                const transactions = await this.getAddressTransactions(chain, addrInfo.address);

                if (balance || transactions) {
                    results.push({
                        ...addrInfo,
                        balance: balance?.balance || '0',
                        transactionCount: transactions?.count || 0,
                        lastUpdated: Date.now()
                    });
                }
            } catch (error) {
                console.error(`Error fetching data for ${addrInfo.address}:`, error);
            }
        }

        return results;
    }

    // Метод для получения данных без API ключей (используя публичные эндпоинты)
    async getPublicData(chain, address) {
        const publicApis = {
            ethereum: {
                balance: `https://api.etherscan.io/api?module=account&action=balance&address=${address}`,
                transactions: `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999`
            },
            binance: {
                balance: `https://api.bscscan.com/api?module=account&action=balance&address=${address}`,
                transactions: `https://api.bscscan.com/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999`
            }
        };

        const api = publicApis[chain];
        if (!api) return null;

        try {
            const [balanceData, txData] = await Promise.all([
                this.fetchData(api.balance),
                this.fetchData(api.transactions)
            ]);

            return {
                address,
                balance: balanceData?.result || '0',
                transactions: txData?.result || [],
                transactionCount: txData?.result?.length || 0,
                timestamp: Date.now()
            };
        } catch (error) {
            console.error('Error fetching public data:', error);
            return null;
        }
    }

    // Метод для получения всех ликвидных адресов с публичными данными
    async getAllLiquidAddressesData() {
        const allData = {};

        for (const chain of Object.keys(this.liquidAddresses)) {
            const addresses = this.liquidAddresses[chain];
            const chainData = [];

            for (const addrInfo of addresses) {
                const data = await this.getPublicData(chain, addrInfo.address);
                if (data) {
                    chainData.push({
                        ...addrInfo,
                        ...data
                    });
                }

                // Задержка между запросами чтобы не превысить лимиты API
                await new Promise(resolve => setTimeout(resolve, 200));
            }

            allData[chain] = chainData;
        }

        return allData;
    }

    // Расчет энтропии на основе транзакций
    calculateTransactionEntropy(transactions) {
        if (!transactions || transactions.length === 0) return 0;

        const txTypes = {};
        const values = [];

        transactions.forEach(tx => {
            const type = tx.value > 0 ? 'incoming' : 'outgoing';
            txTypes[type] = (txTypes[type] || 0) + 1;
            values.push(Math.abs(parseFloat(tx.value) || 0));
        });

        // Энтропия на основе разнообразия транзакций
        const totalTx = transactions.length;
        const typeEntropy = Object.values(txTypes).reduce((entropy, count) => {
            const p = count / totalTx;
            return entropy - p * Math.log2(p);
        }, 0);

        // Энтропия на основе значений транзакций
        const avgValue = values.reduce((sum, val) => sum + val, 0) / values.length;
        const valueVariance = values.reduce((sum, val) => sum + Math.pow(val - avgValue, 2), 0) / values.length;
        const valueEntropy = Math.log2(1 + valueVariance);

        return (typeEntropy + valueEntropy) / 2;
    }

    // Получение данных для визуализации
    async getVisualizationData() {
        const allData = await this.getAllLiquidAddressesData();
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

        for (const [chain, addresses] of Object.entries(allData)) {
            addresses.forEach((addr, index) => {
                const angle = (index / addresses.length) * Math.PI * 2;
                const radius = 15 + Math.random() * 10;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                const z = (Math.random() - 0.5) * 10;

                const entropy = this.calculateTransactionEntropy(addr.transactions);
                const color = this.getColorByType(addr.type);

                const node = {
                    id: nodeId++,
                    name: addr.name,
                    type: addr.type,
                    address: addr.address,
                    x, y, z,
                    color,
                    entropy,
                    size: 1 + entropy * 0.5,
                    balance: addr.balance,
                    transactionCount: addr.transactionCount
                };

                nodes.push(node);

                // Соединение с центром
                connections.push({
                    from: centerNode.id,
                    to: node.id,
                    entropy
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
}

// Экспорт для использования в основном файле
window.BlockchainAPI = BlockchainAPI;