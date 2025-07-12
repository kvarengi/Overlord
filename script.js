// Карта Веб3 Вселенной ДАО 23m00n
class Web3UniverseMap {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.nodes = [];
        this.connections = [];
        this.animationId = null;
        this.isAnimating = true;
        this.entropyCenter = { x: 0, y: 0, z: 0 };
        this.totalEntropy = 0;
        this.blockchainManager = new BlockchainDataManager();
        this.blockchainAPI = new BlockchainAPI();
        this.demoData = new DemoData();
        this.realDataLoaded = false;
        
        this.init();
        this.setupEventListeners();
        this.animate();
    }

    init() {
        // Инициализация Three.js
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x000000, 0);
        document.getElementById('canvas-container').appendChild(this.renderer.domElement);

        // Настройка камеры
        this.camera.position.set(0, 0, 50);
        this.camera.lookAt(0, 0, 0);

        // Добавление освещения
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 10, 5);
        this.scene.add(directionalLight);

        // Создание центра энтропии - BitMoon
        this.createBitMoonCenter();
        
        // Создание начальных узлов
        this.createInitialNodes();
        
        // Загрузка реальных блокчейн данных
        this.loadRealBlockchainData();
    }

    createBitMoonCenter() {
        // Создание центра энтропии - BitMoon (точка нулевой энтропии)
        const geometry = new THREE.SphereGeometry(2, 32, 32);
        const material = new THREE.MeshPhongMaterial({
            color: 0xff6b6b,
            emissive: 0x330000,
            shininess: 100
        });
        
        const bitMoon = new THREE.Mesh(geometry, material);
        bitMoon.position.set(0, 0, 0);
        this.scene.add(bitMoon);

        // Добавление свечения
        const glowGeometry = new THREE.SphereGeometry(2.5, 32, 32);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: 0xff6b6b,
            transparent: true,
            opacity: 0.3
        });
        
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        this.scene.add(glow);

        // Анимация пульсации
        const animateGlow = () => {
            const time = Date.now() * 0.001;
            glow.scale.setScalar(1 + Math.sin(time * 2) * 0.1);
            bitMoon.rotation.y += 0.01;
            requestAnimationFrame(animateGlow);
        };
        animateGlow();
    }

    createInitialNodes() {
        // Создание узлов с кватернионами и максимальной энтропией
        const nodeTypes = [
            { name: 'DeFi Protocol', color: 0x4ecdc4, entropy: 0.85 },
            { name: 'NFT Marketplace', color: 0x45b7d1, entropy: 0.92 },
            { name: 'DAO Governance', color: 0xffa726, entropy: 0.78 },
            { name: 'Cross-chain Bridge', color: 0xab47bc, entropy: 0.95 },
            { name: 'Oracle Network', color: 0x26a69a, entropy: 0.88 },
            { name: 'Lending Protocol', color: 0xef5350, entropy: 0.82 },
            { name: 'DEX Aggregator', color: 0x42a5f5, entropy: 0.90 },
            { name: 'Staking Platform', color: 0x66bb6a, entropy: 0.75 }
        ];

        nodeTypes.forEach((nodeType, index) => {
            const angle = (index / nodeTypes.length) * Math.PI * 2;
            const radius = 15 + Math.random() * 10;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            const z = (Math.random() - 0.5) * 10;

            this.createNode(x, y, z, nodeType.name, nodeType.color, nodeType.entropy);
        });
    }

    createNode(x, y, z, name, color, entropy) {
        // Создание узла с кватернионной геометрией
        const geometry = new THREE.OctahedronGeometry(1, 0);
        const material = new THREE.MeshPhongMaterial({
            color: color,
            emissive: color,
            emissiveIntensity: 0.2,
            shininess: 50
        });

        const node = new THREE.Mesh(geometry, material);
        node.position.set(x, y, z);
        node.userData = { name, entropy, color, originalPosition: { x, y, z } };
        
        this.scene.add(node);
        this.nodes.push(node);

        // Создание соединения с центром
        this.createConnection(this.entropyCenter, node.position, entropy);

        // Добавление текста
        this.createNodeLabel(node, name);
    }

    createConnection(start, end, entropy) {
        const points = [];
        points.push(new THREE.Vector3(start.x, start.y, start.z));
        points.push(new THREE.Vector3(end.x, end.y, end.z));

        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({
            color: 0x4ecdc4,
            transparent: true,
            opacity: 0.6
        });

        const line = new THREE.Line(geometry, material);
        line.userData = { entropy };
        this.scene.add(line);
        this.connections.push(line);
    }

    createNodeLabel(node, name) {
        // Создание HTML элемента для метки
        const label = document.createElement('div');
        label.className = 'node-label';
        label.textContent = name;
        label.style.position = 'absolute';
        label.style.color = '#ffffff';
        label.style.fontSize = '12px';
        label.style.fontWeight = 'bold';
        label.style.textShadow = '0 0 5px rgba(0,0,0,0.8)';
        label.style.pointerEvents = 'none';
        label.style.zIndex = '1000';
        
        document.body.appendChild(label);
        node.userData.label = label;
    }

    updateNodeLabels() {
        this.nodes.forEach(node => {
            if (node.userData.label) {
                const vector = new THREE.Vector3();
                vector.setFromMatrixPosition(node.matrixWorld);
                vector.project(this.camera);

                const x = (vector.x * 0.5 + 0.5) * window.innerWidth;
                const y = (-(vector.y * 0.5) + 0.5) * window.innerHeight;

                node.userData.label.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
            }
        });
    }

    calculateEntropy(node) {
        // Расчет энтропии на основе кватернионов и влияния на экосистему
        const baseEntropy = node.userData.entropy;
        const distance = node.position.distanceTo(new THREE.Vector3(0, 0, 0));
        const timeFactor = Date.now() * 0.0001;
        
        // Кватернионная энтропия
        const quaternion = new THREE.Quaternion();
        quaternion.setFromAxisAngle(new THREE.Vector3(1, 1, 1), timeFactor);
        
        const entropy = baseEntropy * (1 + Math.sin(timeFactor) * 0.1) * 
                      (1 - distance / 50) * (1 + Math.random() * 0.1);
        
        return Math.max(0, Math.min(1, entropy));
    }

    updateEntropy() {
        let totalEntropy = 0;
        
        this.nodes.forEach(node => {
            const entropy = this.calculateEntropy(node);
            node.userData.currentEntropy = entropy;
            totalEntropy += entropy;
            
            // Обновление цвета на основе энтропии
            const intensity = 0.2 + entropy * 0.8;
            node.material.emissiveIntensity = intensity;
        });

        this.totalEntropy = totalEntropy;
        document.getElementById('total-entropy').textContent = totalEntropy.toFixed(2);
        document.getElementById('active-nodes').textContent = this.nodes.length;
    }

    animate() {
        if (!this.isAnimating) return;

        this.animationId = requestAnimationFrame(() => this.animate());

        // Анимация узлов
        this.nodes.forEach(node => {
            const time = Date.now() * 0.001;
            const originalPos = node.userData.originalPosition;
            
            // Кватернионная анимация
            const quaternion = new THREE.Quaternion();
            quaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), time * 0.5);
            node.quaternion.multiply(quaternion);
            
            // Плавающее движение
            node.position.x = originalPos.x + Math.sin(time + node.position.x) * 0.5;
            node.position.y = originalPos.y + Math.cos(time + node.position.y) * 0.5;
            node.position.z = originalPos.z + Math.sin(time * 0.7 + node.position.z) * 0.3;
        });

        // Обновление соединений
        this.connections.forEach((connection, index) => {
            if (index < this.nodes.length) {
                const points = connection.geometry.attributes.position;
                points.setXYZ(0, 0, 0, 0);
                points.setXYZ(1, this.nodes[index].position.x, this.nodes[index].position.y, this.nodes[index].position.z);
                points.needsUpdate = true;
            }
        });

        this.updateEntropy();
        this.updateNodeLabels();
        this.renderer.render(this.scene, this.camera);
    }

    addRandomNode() {
        const nodeTypes = [
            'Smart Contract', 'Layer 2', 'Privacy Protocol', 'Gaming Platform',
            'Social Network', 'Identity System', 'Data Oracle', 'Insurance Protocol'
        ];
        
        const randomType = nodeTypes[Math.floor(Math.random() * nodeTypes.length)];
        const angle = Math.random() * Math.PI * 2;
        const radius = 20 + Math.random() * 15;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        const z = (Math.random() - 0.5) * 20;
        
        const colors = [0x4ecdc4, 0x45b7d1, 0xffa726, 0xab47bc, 0x26a69a, 0xef5350, 0x42a5f5, 0x66bb6a];
        const color = colors[Math.floor(Math.random() * colors.length)];
        const entropy = 0.7 + Math.random() * 0.3;
        
        this.createNode(x, y, z, randomType, color, entropy);
    }

    resetView() {
        this.camera.position.set(0, 0, 50);
        this.camera.lookAt(0, 0, 0);
    }

    handleNewTransaction(transactionData) {
        const { transaction, entropyEmission } = transactionData;
        
        // Обновление статистики
        const stats = this.blockchainManager.getEntropyStats();
        document.getElementById('total-entropy').textContent = stats.totalEmission.toFixed(2);
        
        // Создание визуального эффекта для новой транзакции
        this.createTransactionEffect(transaction);
        
        // Обновление узлов на основе новой энтропии
        this.updateNodesWithEntropy(entropyEmission);
    }

    createTransactionEffect(transaction) {
        // Создание временного эффекта для новой транзакции
        const geometry = new THREE.SphereGeometry(0.5, 16, 16);
        const material = new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            transparent: true,
            opacity: 0.8
        });
        
        const effect = new THREE.Mesh(geometry, material);
        effect.position.set(
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 20
        );
        
        this.scene.add(effect);
        
        // Анимация исчезновения
        let opacity = 0.8;
        const fadeOut = () => {
            opacity -= 0.02;
            effect.material.opacity = opacity;
            
            if (opacity > 0) {
                requestAnimationFrame(fadeOut);
            } else {
                this.scene.remove(effect);
            }
        };
        
        setTimeout(fadeOut, 1000);
    }

    updateNodesWithEntropy(entropyEmission) {
        // Обновление узлов на основе новой энтропии
        this.nodes.forEach(node => {
            const baseEntropy = node.userData.entropy;
            const newEntropy = baseEntropy * (1 + entropyEmission * 0.1);
            node.userData.currentEntropy = Math.min(1, newEntropy);
            
            // Обновление свечения
            const intensity = 0.2 + node.userData.currentEntropy * 0.8;
            node.material.emissiveIntensity = intensity;
        });
    }

    async loadRealBlockchainData() {
        try {
            console.log('Загрузка реальных блокчейн данных...');
            
            // Показываем индикатор загрузки
            this.showLoadingIndicator();
            
            // Получаем данные для визуализации
            const visualizationData = await this.blockchainAPI.getVisualizationData();
            
            if (visualizationData && visualizationData.nodes.length > 1) {
                // Очищаем существующие узлы (кроме центра)
                this.clearNodesExceptCenter();
                
                // Создаем узлы из реальных данных
                this.createNodesFromRealData(visualizationData.nodes);
                
                // Создаем соединения
                this.createConnectionsFromRealData(visualizationData.connections);
                
                this.realDataLoaded = true;
                console.log('Реальные данные загружены:', visualizationData.nodes.length, 'узлов');
                
                // Обновляем статистику
                this.updateRealDataStats(visualizationData.nodes);
            } else {
                console.log('Используем демо данные');
                this.loadDemoData();
            }
            
            this.hideLoadingIndicator();
        } catch (error) {
            console.error('Ошибка загрузки реальных данных:', error);
            this.hideLoadingIndicator();
        }
    }

    showLoadingIndicator() {
        const loading = document.createElement('div');
        loading.id = 'loading-indicator';
        loading.innerHTML = `
            <div style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(0,0,0,0.9);
                color: white;
                padding: 20px;
                border-radius: 10px;
                z-index: 10000;
                text-align: center;
            ">
                <div style="margin-bottom: 10px;">🌙 Загрузка реальных блокчейн данных...</div>
                <div style="width: 200px; height: 4px; background: #333; border-radius: 2px;">
                    <div style="width: 100%; height: 100%; background: #4ecdc4; border-radius: 2px; animation: loading 2s infinite;"></div>
                </div>
                <style>
                    @keyframes loading {
                        0% { width: 0%; }
                        50% { width: 100%; }
                        100% { width: 0%; }
                    }
                </style>
            </div>
        `;
        document.body.appendChild(loading);
    }

    hideLoadingIndicator() {
        const loading = document.getElementById('loading-indicator');
        if (loading) {
            loading.remove();
        }
    }

    clearNodesExceptCenter() {
        // Удаляем все узлы кроме центра (BitMoon)
        this.nodes.forEach((node, index) => {
            if (index > 0) { // Оставляем только первый узел (центр)
                this.scene.remove(node);
                if (node.userData.label) {
                    node.userData.label.remove();
                }
            }
        });
        
        // Очищаем соединения
        this.connections.forEach(connection => {
            this.scene.remove(connection);
        });
        
        this.nodes = this.nodes.slice(0, 1); // Оставляем только центр
        this.connections = [];
    }

    createNodesFromRealData(nodesData) {
        nodesData.forEach((nodeData, index) => {
            if (index === 0) return; // Пропускаем центр, он уже создан
            
            const geometry = new THREE.OctahedronGeometry(nodeData.size || 1, 0);
            const material = new THREE.MeshPhongMaterial({
                color: nodeData.color,
                emissive: nodeData.color,
                emissiveIntensity: 0.2,
                shininess: 50
            });

            const node = new THREE.Mesh(geometry, material);
            node.position.set(nodeData.x, nodeData.y, nodeData.z);
            node.userData = {
                name: nodeData.name,
                type: nodeData.type,
                address: nodeData.address,
                entropy: nodeData.entropy || 0.5,
                balance: nodeData.balance,
                transactionCount: nodeData.transactionCount,
                originalPosition: { x: nodeData.x, y: nodeData.y, z: nodeData.z }
            };
            
            this.scene.add(node);
            this.nodes.push(node);

            // Создание соединения с центром
            this.createConnection(this.entropyCenter, node.position, nodeData.entropy);

            // Добавление текста
            this.createNodeLabel(node, nodeData.name);
        });
    }

    createConnectionsFromRealData(connectionsData) {
        connectionsData.forEach(connectionData => {
            if (connectionData.from === 0) { // Соединения с центром уже созданы
                return;
            }
            
            const fromNode = this.nodes[connectionData.from];
            const toNode = this.nodes[connectionData.to];
            
            if (fromNode && toNode) {
                this.createConnection(fromNode.position, toNode.position, connectionData.entropy);
            }
        });
    }

    updateRealDataStats(nodes) {
        const realAddresses = nodes.filter(node => node.address).length;
        const totalTransactions = nodes.reduce((sum, node) => sum + (node.transactionCount || 0), 0);
        
        document.getElementById('real-addresses').textContent = realAddresses;
        document.getElementById('total-transactions').textContent = totalTransactions;
        document.getElementById('active-nodes').textContent = nodes.length;
    }

    loadDemoData() {
        console.log('Загрузка демо данных...');
        
        const demoData = this.demoData.getDemoVisualizationData();
        
        // Очищаем существующие узлы (кроме центра)
        this.clearNodesExceptCenter();
        
        // Создаем узлы из демо данных
        this.createNodesFromRealData(demoData.nodes);
        
        // Создаем соединения
        this.createConnectionsFromRealData(demoData.connections);
        
        // Обновляем статистику
        this.updateRealDataStats(demoData.nodes);
        
        console.log('Демо данные загружены:', demoData.nodes.length, 'узлов');
    }

    setupEventListeners() {
        // Обработчики кнопок
        document.getElementById('add-node').addEventListener('click', () => {
            this.addRandomNode();
        });

        document.getElementById('reset-view').addEventListener('click', () => {
            this.resetView();
        });

        document.getElementById('toggle-animation').addEventListener('click', () => {
            this.isAnimating = !this.isAnimating;
            if (this.isAnimating) {
                this.animate();
            } else {
                cancelAnimationFrame(this.animationId);
            }
        });

        document.getElementById('load-real-data').addEventListener('click', () => {
            this.loadRealBlockchainData();
        });

        // Обработка событий блокчейна
        document.addEventListener('newTransaction', (event) => {
            this.handleNewTransaction(event.detail);
        });

        // Обработка изменения размера окна
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });

        // Управление камерой мышью
        let isMouseDown = false;
        let mouseX = 0;
        let mouseY = 0;

        document.addEventListener('mousedown', (event) => {
            isMouseDown = true;
            mouseX = event.clientX;
            mouseY = event.clientY;
        });

        document.addEventListener('mouseup', () => {
            isMouseDown = false;
        });

        document.addEventListener('mousemove', (event) => {
            if (isMouseDown) {
                const deltaX = event.clientX - mouseX;
                const deltaY = event.clientY - mouseY;
                
                this.camera.position.x += deltaX * 0.01;
                this.camera.position.y -= deltaY * 0.01;
                this.camera.lookAt(0, 0, 0);
                
                mouseX = event.clientX;
                mouseY = event.clientY;
            }
        });

        // Зум колесиком мыши
        document.addEventListener('wheel', (event) => {
            const zoomSpeed = 0.1;
            const zoom = event.deltaY > 0 ? 1 + zoomSpeed : 1 - zoomSpeed;
            this.camera.position.multiplyScalar(zoom);
        });
    }
}

// Инициализация карты при загрузке страницы
window.addEventListener('load', () => {
    new Web3UniverseMap();
});