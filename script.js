// 太阳系模拟脚本
class SolarSystem {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.controls = null;
        
        // 存储所有天体
        this.celestialBodies = {};
        this.orbits = [];
        this.asteroidBelt = [];
        this.kuiperBelt = [];
        
        // 时间变量
        this.time = 0;
        
        this.init();
        this.createSolarSystem();
        this.animate();
    }

    init() {
        // 设置渲染器
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x000000);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        document.getElementById('container').appendChild(this.renderer.domElement);

        // 设置相机位置
        this.camera.position.set(0, 50, 100);
        this.camera.lookAt(0, 0, 0);

        // 设置轨道控制
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.1;
        this.controls.minDistance = 5;
        this.controls.maxDistance = 500;

        // 添加星空背景
        this.createStarField();

        // 窗口大小改变事件
        window.addEventListener('resize', () => this.onWindowResize());
    }

    createStarField() {
        const starGeometry = new THREE.BufferGeometry();
        const starCount = 15000;
        const positions = new Float32Array(starCount * 3);
        const colors = new Float32Array(starCount * 3);
        
        for (let i = 0; i < starCount; i++) {
            // 在球面上分布星星
            const radius = Math.random() * 2000 + 500;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            
            positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            positions[i * 3 + 2] = radius * Math.cos(phi);
            
            // 随机颜色 - 模拟不同类型的恒星
            const starType = Math.random();
            if (starType < 0.7) {
                // 白色恒星
                colors[i * 3] = 1;
                colors[i * 3 + 1] = 1;
                colors[i * 3 + 2] = 1;
            } else if (starType < 0.85) {
                // 蓝色恒星
                colors[i * 3] = 0.7;
                colors[i * 3 + 1] = 0.8;
                colors[i * 3 + 2] = 1;
            } else if (starType < 0.95) {
                // 红色恒星
                colors[i * 3] = 1;
                colors[i * 3 + 1] = 0.6;
                colors[i * 3 + 2] = 0.4;
            } else {
                // 黄色恒星
                colors[i * 3] = 1;
                colors[i * 3 + 1] = 1;
                colors[i * 3 + 2] = 0.6;
            }
        }
        
        starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        starGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        const starMaterial = new THREE.PointsMaterial({
            size: 2,
            transparent: true,
            opacity: 0.8,
            vertexColors: true,
            sizeAttenuation: true
        });
        
        const stars = new THREE.Points(starGeometry, starMaterial);
        this.scene.add(stars);
    }

    createSolarSystem() {
        // 太阳系天体数据
        const celestialData = {
            sun: {
                radius: 5,
                color: 0xFDB813,
                distance: 0,
                rotationSpeed: 0.005,
                orbitSpeed: 0,
                emissive: 0xFDB813,
                intensity: 0.3
            },
            mercury: {
                radius: 0.38,
                color: 0x8C7853,
                distance: 12,
                rotationSpeed: 0.01,
                orbitSpeed: 0.02,
                textureType: 'rocky'
            },
            venus: {
                radius: 0.95,
                color: 0xFFC649,
                distance: 18,
                rotationSpeed: -0.007,
                orbitSpeed: 0.015,
                textureType: 'volcanic',
                hasAtmosphere: true,
                atmosphereColor: 0xFFD700
            },
            earth: {
                radius: 1,
                color: 0x6B93D6,
                distance: 25,
                rotationSpeed: 0.02,
                orbitSpeed: 0.01,
                hasAtmosphere: true,
                hasMoon: true,
                textureType: 'earth',
                atmosphereColor: 0x87CEEB
            },
            mars: {
                radius: 0.53,
                color: 0xCD5C5C,
                distance: 35,
                rotationSpeed: 0.018,
                orbitSpeed: 0.008,
                textureType: 'mars',
                hasAtmosphere: true,
                atmosphereColor: 0xFFB347
            },
            jupiter: {
                radius: 3.5,
                color: 0xD8CA9D,
                distance: 55,
                rotationSpeed: 0.04,
                orbitSpeed: 0.005,
                hasRings: true,
                textureType: 'gas_giant',
                stormSpots: true
            },
            saturn: {
                radius: 2.9,
                color: 0xFAD5A5,
                distance: 75,
                rotationSpeed: 0.035,
                orbitSpeed: 0.003,
                hasRings: true,
                prominentRings: true,
                textureType: 'gas_giant'
            },
            uranus: {
                radius: 2,
                color: 0x4FD0E7,
                distance: 95,
                rotationSpeed: 0.025,
                orbitSpeed: 0.002,
                textureType: 'ice_giant',
                hasRings: true,
                tiltedAxis: true
            },
            neptune: {
                radius: 1.9,
                color: 0x4B70DD,
                distance: 115,
                rotationSpeed: 0.02,
                orbitSpeed: 0.001,
                textureType: 'ice_giant',
                hasStorms: true
            }
        };

        // 创建太阳
        this.createSun(celestialData.sun);

        // 创建行星
        Object.keys(celestialData).forEach(key => {
            if (key !== 'sun') {
                this.createPlanet(key, celestialData[key]);
            }
        });

        // 创建小行星带（火星和木星之间）
        this.createAsteroidBelt(45, 48, 800);

        // 创建柯伊伯带（海王星外侧）
        this.createKuiperBelt(130, 180, 1500);

        // 创建轨道线
        this.createOrbits(celestialData);

        // 创建近邻星系
        this.createNearbyGalaxies();
    }

    createSun(data) {
        // 创建太阳组合体
        const sunGroup = new THREE.Group();
        
        // 1. 太阳核心 - 高分辨率球体
        const coreGeometry = new THREE.SphereGeometry(data.radius, 64, 64);
        
        // 创建动态太阳表面纹理
        const coreTexture = this.createAdvancedSunTexture();
        const normalTexture = this.createSunNormalTexture();
        
        const coreMaterial = new THREE.MeshStandardMaterial({
            map: coreTexture,
            normalMap: normalTexture,
            emissive: new THREE.Color(0xFF4500),
            emissiveIntensity: 0.6,
            roughness: 0.8,
            metalness: 0.1
        });

        const sunCore = new THREE.Mesh(coreGeometry, coreMaterial);
        sunCore.userData = { ...data, layer: 'core' };
        sunGroup.add(sunCore);

        // 2. 太阳大气层（色球层）
        const chromosphereGeometry = new THREE.SphereGeometry(data.radius * 1.02, 32, 32);
        const chromosphereTexture = this.createChromosphereTexture();
        
        const chromosphereMaterial = new THREE.MeshBasicMaterial({
            map: chromosphereTexture,
            transparent: true,
            opacity: 0.7,
            blending: THREE.AdditiveBlending,
            side: THREE.DoubleSide
        });
        
        const chromosphere = new THREE.Mesh(chromosphereGeometry, chromosphereMaterial);
        chromosphere.userData = { layer: 'chromosphere' };
        sunGroup.add(chromosphere);

        // 3. 多层光晕效果
        this.createAdvancedSunGlow(sunGroup, data.radius);
        
        // 5. 太阳黑子（动态）
        this.createSunspots(sunCore, data.radius);
        
        // 存储太阳组件用于动画
        sunGroup.userData = { 
            ...data, 
            core: sunCore,
            chromosphere: chromosphere,
            time: 0
        };
        
        // 添加光源系统
        this.createSunLighting();
        
        this.scene.add(sunGroup);
        this.celestialBodies.sun = sunGroup;
    }

    createAdvancedSunTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 1024;
        const context = canvas.getContext('2d');
        
        // 创建太阳表面的复杂纹理
        // 1. 基础等离子体背景
        const baseGradient = context.createRadialGradient(512, 512, 0, 512, 512, 512);
        baseGradient.addColorStop(0, '#FFF700');    // 中心最热
        baseGradient.addColorStop(0.3, '#FFD700');  // 金黄色
        baseGradient.addColorStop(0.6, '#FF8C00');  // 橙色
        baseGradient.addColorStop(0.8, '#FF4500');  // 红橙色
        baseGradient.addColorStop(1, '#DC143C');    // 边缘深红
        
        context.fillStyle = baseGradient;
        context.fillRect(0, 0, 1024, 1024);
        
        // 2. 对流层纹理 - 创建颗粒状结构
        for (let i = 0; i < 300; i++) {
            const x = Math.random() * 1024;
            const y = Math.random() * 1024;
            const size = Math.random() * 40 + 10;
            const intensity = Math.random() * 0.6 + 0.4;
            
            const cellGradient = context.createRadialGradient(x, y, 0, x, y, size);
            cellGradient.addColorStop(0, `rgba(255, 255, 100, ${intensity})`);
            cellGradient.addColorStop(0.5, `rgba(255, 200, 50, ${intensity * 0.7})`);
            cellGradient.addColorStop(1, `rgba(255, 100, 0, 0)`);
            
            context.fillStyle = cellGradient;
            context.beginPath();
            context.arc(x, y, size, 0, Math.PI * 2);
            context.fill();
        }
        
        // 3. 磁场线和等离子流
        context.strokeStyle = 'rgba(255, 255, 200, 0.3)';
        context.lineWidth = 2;
        for (let i = 0; i < 50; i++) {
            context.beginPath();
            const startX = Math.random() * 1024;
            const startY = Math.random() * 1024;
            context.moveTo(startX, startY);
            
            let x = startX, y = startY;
            for (let j = 0; j < 20; j++) {
                const angle = Math.random() * Math.PI * 2;
                const distance = Math.random() * 30 + 10;
                x += Math.cos(angle) * distance;
                y += Math.sin(angle) * distance;
                context.lineTo(x, y);
            }
            context.stroke();
        }
        
        // 4. 高温区域 - 更亮的斑点
        for (let i = 0; i < 100; i++) {
            const x = Math.random() * 1024;
            const y = Math.random() * 1024;
            const radius = Math.random() * 15 + 5;
            const brightness = Math.random() * 0.8 + 0.2;
            
            context.fillStyle = `rgba(255, 255, 255, ${brightness})`;
            context.beginPath();
            context.arc(x, y, radius, 0, Math.PI * 2);
            context.fill();
        }
        
        return new THREE.CanvasTexture(canvas);
    }

    createSunNormalTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const context = canvas.getContext('2d');
        
        // 创建法线贴图来模拟表面凹凸
        const imageData = context.createImageData(512, 512);
        const data = imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
            const noise = Math.random() * 0.3 + 0.7;
            
            // RGB 表示法线向量 (映射到 0-255)
            data[i] = Math.floor(128 + (Math.random() - 0.5) * 50);     // R: X
            data[i + 1] = Math.floor(128 + (Math.random() - 0.5) * 50); // G: Y  
            data[i + 2] = Math.floor(255 * noise);                      // B: Z
            data[i + 3] = 255;                                          // A: Alpha
        }
        
        context.putImageData(imageData, 0, 0);
        return new THREE.CanvasTexture(canvas);
    }

    createChromosphereTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const context = canvas.getContext('2d');
        
        // 创建色球层效果 - 红色调的大气层
        const gradient = context.createRadialGradient(256, 256, 0, 256, 256, 256);
        gradient.addColorStop(0, 'rgba(255, 100, 100, 0.8)');
        gradient.addColorStop(0.5, 'rgba(255, 69, 0, 0.6)');
        gradient.addColorStop(0.8, 'rgba(220, 20, 60, 0.4)');
        gradient.addColorStop(1, 'rgba(139, 0, 0, 0.2)');
        
        context.fillStyle = gradient;
        context.fillRect(0, 0, 512, 512);
        
        // 添加湍流效果
        for (let i = 0; i < 100; i++) {
            const x = Math.random() * 512;
            const y = Math.random() * 512;
            const radius = Math.random() * 30 + 10;
            const alpha = Math.random() * 0.4 + 0.2;
            
            context.fillStyle = `rgba(255, 150, 100, ${alpha})`;
            context.beginPath();
            context.arc(x, y, radius, 0, Math.PI * 2);
            context.fill();
        }
        
        return new THREE.CanvasTexture(canvas);
    }

    createAdvancedSunGlow(sunGroup, radius) {
        // 多层光晕效果
        const glowLayers = [
            { size: 1.2, color: 0xFFFFAA, opacity: 0.3 },
            { size: 1.8, color: 0xFFAA55, opacity: 0.2 },
            { size: 2.5, color: 0xFF6600, opacity: 0.1 },
            { size: 3.5, color: 0xFF3300, opacity: 0.05 }
        ];
        
        glowLayers.forEach((layer, index) => {
            const glowGeometry = new THREE.SphereGeometry(radius * layer.size, 16, 16);
            const glowMaterial = new THREE.MeshBasicMaterial({
                color: layer.color,
                transparent: true,
                opacity: layer.opacity,
                side: THREE.BackSide,
                blending: THREE.AdditiveBlending
            });
            
            const glow = new THREE.Mesh(glowGeometry, glowMaterial);
            glow.userData = {
                originalOpacity: layer.opacity,
                pulseSpeed: 0.01 + index * 0.005,
                phase: Math.random() * Math.PI * 2
            };
            
            sunGroup.add(glow);
        });
    }

    createSunspots(sunCore, radius) {
        // 动态太阳黑子系统
        const sunspotCount = 15;
        
        for (let i = 0; i < sunspotCount; i++) {
            const spotGeometry = new THREE.SphereGeometry(radius * (0.05 + Math.random() * 0.1), 8, 8);
            const spotMaterial = new THREE.MeshBasicMaterial({
                color: 0x330000,
                transparent: true,
                opacity: 0.8
            });
            
            const sunspot = new THREE.Mesh(spotGeometry, spotMaterial);
            
            // 随机位置在太阳表面
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;
            
            sunspot.position.x = Math.sin(phi) * Math.cos(theta) * radius * 1.01;
            sunspot.position.y = Math.cos(phi) * radius * 1.01;
            sunspot.position.z = Math.sin(phi) * Math.sin(theta) * radius * 1.01;
            
            sunspot.userData = {
                lifecycle: Math.random() * 100,
                maxLifecycle: 200 + Math.random() * 300,
                originalScale: sunspot.scale.clone()
            };
            
            sunCore.add(sunspot);
        }
    }

    createSunLighting() {
        // 主光源 - 太阳光
        const mainLight = new THREE.PointLight(0xFFFFDD, 3, 300);
        mainLight.position.set(0, 0, 0);
        mainLight.castShadow = true;
        mainLight.shadow.mapSize.width = 4096;
        mainLight.shadow.mapSize.height = 4096;
        mainLight.shadow.camera.near = 1;
        mainLight.shadow.camera.far = 300;
        this.scene.add(mainLight);
        
        // 辅助光源 - 模拟太阳大气层
        const atmosphereLight = new THREE.PointLight(0xFFAA44, 1.5, 200);
        atmosphereLight.position.set(0, 0, 0);
        this.scene.add(atmosphereLight);
        
        // 环境光
        const ambientLight = new THREE.AmbientLight(0x404040, 0.15);
        this.scene.add(ambientLight);
        
        // 存储光源用于动画
        this.sunLights = {
            main: mainLight,
            atmosphere: atmosphereLight
        };
    }

    createPlanet(name, data) {
        const geometry = new THREE.SphereGeometry(data.radius, 32, 32);
        
        // 创建更真实的行星纹理
        const texture = this.createRealisticTexture(name, data);
        
        // 使用更高级的材质
        const material = new THREE.MeshPhongMaterial({ 
            map: texture,
            shininess: data.textureType === 'ice_giant' ? 100 : 10,
            specular: data.textureType === 'earth' ? 0x111111 : 0x000000
        });
        
        const planet = new THREE.Mesh(geometry, material);
        planet.userData = data;
        planet.userData.angle = Math.random() * Math.PI * 2; // 随机初始位置
        planet.castShadow = true;
        planet.receiveShadow = true;
        
        // 如果有倾斜轴（天王星）
        if (data.tiltedAxis) {
            planet.rotation.z = Math.PI / 2;
        }
        
        // 如果有大气层
        if (data.hasAtmosphere) {
            this.createAtmosphere(planet, data.atmosphereColor || 0x87CEEB);
        }
        
        // 如果有光环
        if (data.hasRings) {
            this.createRings(planet);
        }
        
        // 如果有月亮
        if (data.hasMoon) {
            this.createMoon(planet);
        }
        
        // 如果有风暴斑点（木星）
        if (data.stormSpots) {
            this.createStormSpots(planet);
        }
        
        this.scene.add(planet);
        this.celestialBodies[name] = planet;
    }

    createRealisticTexture(name, data) {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const context = canvas.getContext('2d');
        
        // 根据行星类型创建真实纹理
        switch(data.textureType) {
            case 'earth':
                this.createEarthTexture(context);
                break;
            case 'mars':
                this.createMarsTexture(context);
                break;
            case 'rocky':
                this.createRockyTexture(context, data.color);
                break;
            case 'volcanic':
                this.createVolcanicTexture(context);
                break;
            case 'gas_giant':
                this.createGasGiantTexture(context, name, data.color);
                break;
            case 'ice_giant':
                this.createIceGiantTexture(context, data.color);
                break;
            default:
                this.createBasicTexture(context, data.color);
        }
        
        return new THREE.CanvasTexture(canvas);
    }

    createEarthTexture(context) {
        const width = 512, height = 512;
        
        // 海洋背景
        const oceanGradient = context.createLinearGradient(0, 0, 0, height);
        oceanGradient.addColorStop(0, '#4682B4');
        oceanGradient.addColorStop(0.5, '#1E90FF');
        oceanGradient.addColorStop(1, '#191970');
        context.fillStyle = oceanGradient;
        context.fillRect(0, 0, width, height);
        
        // 大陆和岛屿
        context.fillStyle = '#228B22';
        for (let i = 0; i < 15; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const w = Math.random() * 120 + 40;
            const h = Math.random() * 80 + 30;
            
            context.beginPath();
            context.ellipse(x, y, w/2, h/2, Math.random() * Math.PI, 0, Math.PI * 2);
            context.fill();
        }
        
        // 云层
        context.fillStyle = 'rgba(255, 255, 255, 0.4)';
        for (let i = 0; i < 20; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const radius = Math.random() * 40 + 20;
            context.beginPath();
            context.arc(x, y, radius, 0, Math.PI * 2);
            context.fill();
        }
        
        // 极地冰帽
        context.fillStyle = '#F0F8FF';
        context.fillRect(0, 0, width, 30);
        context.fillRect(0, height - 30, width, 30);
    }

    createMarsTexture(context) {
        const width = 512, height = 512;
        
        // 火星红色基础
        const marsGradient = context.createRadialGradient(width/2, height/2, 0, width/2, height/2, width/2);
        marsGradient.addColorStop(0, '#CD853F');
        marsGradient.addColorStop(0.7, '#A0522D');
        marsGradient.addColorStop(1, '#8B4513');
        context.fillStyle = marsGradient;
        context.fillRect(0, 0, width, height);
        
        // 峡谷和山脉
        context.strokeStyle = '#654321';
        context.lineWidth = 3;
        for (let i = 0; i < 10; i++) {
            context.beginPath();
            context.moveTo(Math.random() * width, Math.random() * height);
            for (let j = 0; j < 5; j++) {
                context.lineTo(Math.random() * width, Math.random() * height);
            }
            context.stroke();
        }
        
        // 陨石坑
        context.fillStyle = '#8B4513';
        for (let i = 0; i < 30; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const radius = Math.random() * 15 + 5;
            context.beginPath();
            context.arc(x, y, radius, 0, Math.PI * 2);
            context.fill();
        }
        
        // 极地冰帽
        context.fillStyle = '#F5F5DC';
        context.fillRect(0, 0, width, 20);
        context.fillRect(0, height - 20, width, 20);
    }

    createGasGiantTexture(context, name, color) {
        const width = 512, height = 512;
        
        // 基础颜色
        context.fillStyle = `#${color.toString(16).padStart(6, '0')}`;
        context.fillRect(0, 0, width, height);
        
        // 气体条纹
        const stripeColors = name === 'jupiter' ? 
            ['#D2691E', '#DEB887', '#F4A460', '#CD853F'] : 
            ['#F0E68C', '#DDD', '#E6E6FA', '#D3D3D3'];
            
        for (let i = 0; i < height; i += 15) {
            const stripeColor = stripeColors[Math.floor(Math.random() * stripeColors.length)];
            context.fillStyle = stripeColor;
            const thickness = Math.random() * 10 + 5;
            context.fillRect(0, i, width, thickness);
            
            // 添加波浪效果
            context.fillStyle = `${stripeColor}80`;
            context.beginPath();
            context.moveTo(0, i + thickness/2);
            for (let x = 0; x < width; x += 20) {
                context.lineTo(x, i + thickness/2 + Math.sin(x * 0.05) * 3);
            }
            context.lineWidth = 2;
            context.stroke();
        }
        
        // 木星大红斑
        if (name === 'jupiter') {
            context.fillStyle = '#8B0000';
            context.beginPath();
            context.ellipse(width * 0.3, height * 0.4, 40, 25, 0, 0, Math.PI * 2);
            context.fill();
        }
    }

    createIceGiantTexture(context, color) {
        const width = 512, height = 512;
        
        // 基础冰蓝色
        const iceGradient = context.createRadialGradient(width/2, height/2, 0, width/2, height/2, width/2);
        iceGradient.addColorStop(0, `#${color.toString(16).padStart(6, '0')}`);
        iceGradient.addColorStop(0.6, '#B0E0E6');
        iceGradient.addColorStop(1, '#4682B4');
        context.fillStyle = iceGradient;
        context.fillRect(0, 0, width, height);
        
        // 冰晶纹理
        context.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        context.lineWidth = 1;
        for (let i = 0; i < 50; i++) {
            context.beginPath();
            const x = Math.random() * width;
            const y = Math.random() * height;
            context.moveTo(x, y);
            context.lineTo(x + Math.random() * 20 - 10, y + Math.random() * 20 - 10);
            context.stroke();
        }
    }

    createRockyTexture(context, color) {
        const width = 512, height = 512;
        
        // 基础岩石色
        context.fillStyle = `#${color.toString(16).padStart(6, '0')}`;
        context.fillRect(0, 0, width, height);
        
        // 陨石坑
        context.fillStyle = 'rgba(0, 0, 0, 0.3)';
        for (let i = 0; i < 40; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const radius = Math.random() * 20 + 3;
            context.beginPath();
            context.arc(x, y, radius, 0, Math.PI * 2);
            context.fill();
        }
        
        // 岩石纹理
        context.fillStyle = 'rgba(255, 255, 255, 0.1)';
        for (let i = 0; i < 100; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const size = Math.random() * 3 + 1;
            context.fillRect(x, y, size, size);
        }
    }

    createVolcanicTexture(context) {
        const width = 512, height = 512;
        
        // 金星的火山表面
        const volcGradient = context.createRadialGradient(width/2, height/2, 0, width/2, height/2, width/2);
        volcGradient.addColorStop(0, '#FFD700');
        volcGradient.addColorStop(0.5, '#FFA500');
        volcGradient.addColorStop(1, '#FF4500');
        context.fillStyle = volcGradient;
        context.fillRect(0, 0, width, height);
        
        // 火山口
        context.fillStyle = '#8B0000';
        for (let i = 0; i < 20; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const radius = Math.random() * 15 + 5;
            context.beginPath();
            context.arc(x, y, radius, 0, Math.PI * 2);
            context.fill();
        }
        
        // 熔岩流
        context.strokeStyle = '#FF6347';
        context.lineWidth = 2;
        for (let i = 0; i < 15; i++) {
            context.beginPath();
            const startX = Math.random() * width;
            const startY = Math.random() * height;
            context.moveTo(startX, startY);
            
            let x = startX, y = startY;
            for (let j = 0; j < 10; j++) {
                x += Math.random() * 20 - 10;
                y += Math.random() * 20 - 10;
                context.lineTo(x, y);
            }
            context.stroke();
        }
    }

    createBasicTexture(context, color) {
        const width = 512, height = 512;
        context.fillStyle = `#${color.toString(16).padStart(6, '0')}`;
        context.fillRect(0, 0, width, height);
        
        // 基础表面细节
        context.fillStyle = 'rgba(0, 0, 0, 0.2)';
        for (let i = 0; i < 50; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const radius = Math.random() * 8 + 2;
            context.beginPath();
            context.arc(x, y, radius, 0, Math.PI * 2);
            context.fill();
        }
    }

    createAtmosphere(planet, color = 0x87CEEB) {
        const atmosGeometry = new THREE.SphereGeometry(planet.userData.radius * 1.1, 16, 16);
        const atmosMaterial = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.2,
            side: THREE.BackSide
        });
        const atmosphere = new THREE.Mesh(atmosGeometry, atmosMaterial);
        planet.add(atmosphere);
    }

    createStormSpots(planet) {
        // 为木星创建大红斑等风暴特征
        const spotGeometry = new THREE.SphereGeometry(planet.userData.radius * 0.15, 8, 8);
        const spotMaterial = new THREE.MeshBasicMaterial({
            color: 0x8B0000,
            transparent: true,
            opacity: 0.8
        });
        const spot = new THREE.Mesh(spotGeometry, spotMaterial);
        spot.position.set(planet.userData.radius * 0.8, 0, 0);
        planet.add(spot);
    }

    createAsteroidBelt(innerRadius, outerRadius, count) {
        for (let i = 0; i < count; i++) {
            const distance = innerRadius + Math.random() * (outerRadius - innerRadius);
            const angle = Math.random() * Math.PI * 2;
            const height = (Math.random() - 0.5) * 2; // 垂直分布
            
            // 不同大小的小行星
            const size = Math.random() * 0.08 + 0.02;
            const geometry = new THREE.DodecahedronGeometry(size, 0);
            
            // 小行星材质
            const material = new THREE.MeshLambertMaterial({
                color: new THREE.Color().setHSL(0.1, 0.3, 0.3 + Math.random() * 0.4)
            });
            
            const asteroid = new THREE.Mesh(geometry, material);
            
            // 位置
            asteroid.position.x = Math.cos(angle) * distance;
            asteroid.position.z = Math.sin(angle) * distance;
            asteroid.position.y = height;
            
            // 随机旋转
            asteroid.rotation.x = Math.random() * Math.PI;
            asteroid.rotation.y = Math.random() * Math.PI;
            asteroid.rotation.z = Math.random() * Math.PI;
            
            // 存储轨道信息
            asteroid.userData = {
                distance: distance,
                angle: angle,
                orbitSpeed: 0.001 + Math.random() * 0.002,
                rotationSpeed: Math.random() * 0.02,
                rotationAxis: new THREE.Vector3(
                    Math.random() - 0.5,
                    Math.random() - 0.5,
                    Math.random() - 0.5
                ).normalize()
            };
            
            asteroid.castShadow = true;
            asteroid.receiveShadow = true;
            
            this.scene.add(asteroid);
            this.asteroidBelt.push(asteroid);
        }
    }

    createKuiperBelt(innerRadius, outerRadius, count) {
        for (let i = 0; i < count; i++) {
            const distance = innerRadius + Math.random() * (outerRadius - innerRadius);
            const angle = Math.random() * Math.PI * 2;
            const height = (Math.random() - 0.5) * 5; // 更大的垂直分布
            
            // 柯伊伯带天体大小
            const size = Math.random() * 0.15 + 0.05;
            const geometry = new THREE.IcosahedronGeometry(size, 0);
            
            // 冰质材质
            const material = new THREE.MeshLambertMaterial({
                color: new THREE.Color().setHSL(0.55 + Math.random() * 0.1, 0.4, 0.6 + Math.random() * 0.3)
            });
            
            const kuiperObject = new THREE.Mesh(geometry, material);
            
            // 位置
            kuiperObject.position.x = Math.cos(angle) * distance;
            kuiperObject.position.z = Math.sin(angle) * distance;
            kuiperObject.position.y = height;
            
            // 随机旋转
            kuiperObject.rotation.x = Math.random() * Math.PI;
            kuiperObject.rotation.y = Math.random() * Math.PI;
            kuiperObject.rotation.z = Math.random() * Math.PI;
            
            // 存储轨道信息
            kuiperObject.userData = {
                distance: distance,
                angle: angle,
                orbitSpeed: 0.0005 + Math.random() * 0.001,
                rotationSpeed: Math.random() * 0.01,
                rotationAxis: new THREE.Vector3(
                    Math.random() - 0.5,
                    Math.random() - 0.5,
                    Math.random() - 0.5
                ).normalize()
            };
            
            kuiperObject.castShadow = true;
            kuiperObject.receiveShadow = true;
            
            this.scene.add(kuiperObject);
            this.kuiperBelt.push(kuiperObject);
        }
    }

    createRings(planet) {
        const ringGeometry = new THREE.RingGeometry(
            planet.userData.radius * 1.5, 
            planet.userData.radius * 2.5, 
            32
        );
        
        let ringMaterial;
        if (planet.userData.prominentRings) {
            // 土星的显著光环
            ringMaterial = new THREE.MeshBasicMaterial({
                color: 0xC0C0C0,
                transparent: true,
                opacity: 0.8,
                side: THREE.DoubleSide
            });
        } else {
            // 其他行星的微弱光环
            ringMaterial = new THREE.MeshBasicMaterial({
                color: 0x888888,
                transparent: true,
                opacity: 0.3,
                side: THREE.DoubleSide
            });
        }
        
        const rings = new THREE.Mesh(ringGeometry, ringMaterial);
        rings.rotation.x = Math.PI / 2;
        planet.add(rings);
    }

    createMoon(planet) {
        const moonGeometry = new THREE.SphereGeometry(0.27, 8, 8);
        const moonMaterial = new THREE.MeshLambertMaterial({ color: 0xC0C0C0 });
        const moon = new THREE.Mesh(moonGeometry, moonMaterial);
        
        moon.userData = {
            distance: planet.userData.radius * 3,
            orbitSpeed: 0.05,
            angle: 0
        };
        
        planet.add(moon);
        planet.userData.moon = moon;
    }

    createOrbits(celestialData) {
        Object.keys(celestialData).forEach(key => {
            if (key !== 'sun') {
                const data = celestialData[key];
                const orbitGeometry = new THREE.RingGeometry(data.distance - 0.1, data.distance + 0.1, 64);
                const orbitMaterial = new THREE.MeshBasicMaterial({
                    color: 0x444444,
                    transparent: true,
                    opacity: 0.3,
                    side: THREE.DoubleSide
                });
                const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
                orbit.rotation.x = Math.PI / 2;
                this.scene.add(orbit);
                this.orbits.push(orbit);
            }
        });
    }

    createNearbyGalaxies() {
        // 近邻星系数据 (距离单位：光年，这里按比例缩放)
        const galaxies = [
            {
                name: 'Sagittarius A*',
                type: 'galaxy_center',
                distance: 800,
                size: 50,
                color: 0xFFD700,
                brightness: 0.8,
                position: { x: 600, y: -200, z: -500 }
            },
            {
                name: 'Large Magellanic Cloud',
                type: 'irregular_galaxy',
                distance: 600,
                size: 30,
                color: 0x9370DB,
                brightness: 0.6,
                position: { x: -400, y: 150, z: 450 }
            },
            {
                name: 'Small Magellanic Cloud',
                type: 'irregular_galaxy',
                distance: 550,
                size: 20,
                color: 0x8A2BE2,
                brightness: 0.5,
                position: { x: -350, y: 100, z: 400 }
            },
            {
                name: 'Andromeda Galaxy',
                type: 'spiral_galaxy',
                distance: 1000,
                size: 80,
                color: 0x4169E1,
                brightness: 0.7,
                position: { x: 700, y: 300, z: -600 }
            },
            {
                name: 'Triangulum Galaxy',
                type: 'spiral_galaxy',
                distance: 900,
                size: 40,
                color: 0x6495ED,
                brightness: 0.6,
                position: { x: 500, y: -300, z: 650 }
            }
        ];

        galaxies.forEach(galaxy => {
            this.createGalaxy(galaxy);
        });
    }

    createGalaxy(galaxyData) {
        const group = new THREE.Group();
        
        // 创建星系核心
        this.createGalaxyCore(group, galaxyData);
        
        // 根据星系类型添加特殊效果
        switch(galaxyData.type) {
            case 'spiral_galaxy':
                this.createSpiralArms(group, galaxyData);
                break;
            case 'irregular_galaxy':
                this.createIrregularStructure(group, galaxyData);
                break;
            case 'galaxy_center':
                this.createGalacticCenter(group, galaxyData);
                break;
        }
        
        // 设置位置
        group.position.set(galaxyData.position.x, galaxyData.position.y, galaxyData.position.z);
        
        // 添加到场景
        this.scene.add(group);
    }

    createGalaxyCore(group, galaxyData) {
        // 创建星系核心球体
        const coreGeometry = new THREE.SphereGeometry(galaxyData.size * 0.3, 16, 16);
        const coreTexture = this.createGalaxyCoreTexture(galaxyData);
        
        const coreMaterial = new THREE.MeshBasicMaterial({
            map: coreTexture,
            transparent: true,
            opacity: galaxyData.brightness,
            emissive: galaxyData.color,
            emissiveIntensity: 0.3
        });
        
        const core = new THREE.Mesh(coreGeometry, coreMaterial);
        group.add(core);
        
        // 添加光晕效果
        const glowGeometry = new THREE.SphereGeometry(galaxyData.size * 0.8, 16, 16);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: galaxyData.color,
            transparent: true,
            opacity: galaxyData.brightness * 0.3,
            side: THREE.BackSide
        });
        
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        group.add(glow);
    }

    createSpiralArms(group, galaxyData) {
        // 创建螺旋臂
        const armCount = 2;
        for (let arm = 0; arm < armCount; arm++) {
            const points = [];
            const armAngleOffset = (arm * Math.PI * 2) / armCount;
            
            for (let i = 0; i < 100; i++) {
                const t = i / 100;
                const radius = galaxyData.size * 0.5 + t * galaxyData.size * 1.5;
                const angle = armAngleOffset + t * Math.PI * 4;
                
                const x = Math.cos(angle) * radius;
                const z = Math.sin(angle) * radius;
                const y = (Math.random() - 0.5) * galaxyData.size * 0.1;
                
                points.push(new THREE.Vector3(x, y, z));
            }
            
            // 创建螺旋臂的粒子系统
            this.createSpiralArmParticles(group, points, galaxyData);
        }
    }

    createSpiralArmParticles(group, points, galaxyData) {
        const particleCount = points.length * 5;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount; i++) {
            const pointIndex = Math.floor(i / 5);
            const basePoint = points[pointIndex] || points[points.length - 1];
            
            // 在每个点周围添加随机偏移
            positions[i * 3] = basePoint.x + (Math.random() - 0.5) * galaxyData.size * 0.2;
            positions[i * 3 + 1] = basePoint.y + (Math.random() - 0.5) * galaxyData.size * 0.1;
            positions[i * 3 + 2] = basePoint.z + (Math.random() - 0.5) * galaxyData.size * 0.2;
            
            // 设置颜色
            const color = new THREE.Color(galaxyData.color);
            color.multiplyScalar(0.5 + Math.random() * 0.5);
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        const material = new THREE.PointsMaterial({
            size: 0.5,
            transparent: true,
            opacity: 0.6,
            vertexColors: true,
            sizeAttenuation: true
        });
        
        const particles = new THREE.Points(geometry, material);
        group.add(particles);
    }

    createIrregularStructure(group, galaxyData) {
        // 创建不规则星系结构
        const cloudCount = 3;
        for (let i = 0; i < cloudCount; i++) {
            const cloudGeometry = new THREE.SphereGeometry(
                galaxyData.size * (0.3 + Math.random() * 0.4), 
                8, 8
            );
            
            const cloudTexture = this.createNebulaTexture(galaxyData.color);
            const cloudMaterial = new THREE.MeshBasicMaterial({
                map: cloudTexture,
                transparent: true,
                opacity: 0.4,
                side: THREE.DoubleSide
            });
            
            const cloud = new THREE.Mesh(cloudGeometry, cloudMaterial);
            cloud.position.set(
                (Math.random() - 0.5) * galaxyData.size,
                (Math.random() - 0.5) * galaxyData.size * 0.3,
                (Math.random() - 0.5) * galaxyData.size
            );
            
            group.add(cloud);
        }
        
        // 添加星团
        this.createStarClusters(group, galaxyData);
    }

    createGalacticCenter(group, galaxyData) {
        // 创建银河系中心的特殊效果
        const jetGeometry = new THREE.CylinderGeometry(1, 3, galaxyData.size * 2, 8);
        const jetMaterial = new THREE.MeshBasicMaterial({
            color: galaxyData.color,
            transparent: true,
            opacity: 0.3,
            emissive: galaxyData.color,
            emissiveIntensity: 0.2
        });
        
        // 创建喷流
        const jet1 = new THREE.Mesh(jetGeometry, jetMaterial);
        jet1.position.y = galaxyData.size;
        group.add(jet1);
        
        const jet2 = new THREE.Mesh(jetGeometry, jetMaterial);
        jet2.position.y = -galaxyData.size;
        group.add(jet2);
        
        // 添加吸积盘
        const diskGeometry = new THREE.RingGeometry(galaxyData.size * 0.5, galaxyData.size * 1.5, 32);
        const diskTexture = this.createAccretionDiskTexture();
        const diskMaterial = new THREE.MeshBasicMaterial({
            map: diskTexture,
            transparent: true,
            opacity: 0.6,
            side: THREE.DoubleSide
        });
        
        const disk = new THREE.Mesh(diskGeometry, diskMaterial);
        disk.rotation.x = Math.PI / 2;
        group.add(disk);
    }

    createStarClusters(group, galaxyData) {
        const clusterCount = 20;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(clusterCount * 3);
        const colors = new Float32Array(clusterCount * 3);
        
        for (let i = 0; i < clusterCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * galaxyData.size * 2;
            positions[i * 3 + 1] = (Math.random() - 0.5) * galaxyData.size * 0.5;
            positions[i * 3 + 2] = (Math.random() - 0.5) * galaxyData.size * 2;
            
            const color = new THREE.Color();
            color.setHSL(Math.random(), 0.7, 0.8);
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        const material = new THREE.PointsMaterial({
            size: 2,
            transparent: true,
            opacity: 0.8,
            vertexColors: true
        });
        
        const clusters = new THREE.Points(geometry, material);
        group.add(clusters);
    }

    createGalaxyCoreTexture(galaxyData) {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const context = canvas.getContext('2d');
        
        // 创建径向渐变
        const gradient = context.createRadialGradient(128, 128, 0, 128, 128, 128);
        const color = new THREE.Color(galaxyData.color);
        
        gradient.addColorStop(0, `rgba(${Math.floor(color.r * 255)}, ${Math.floor(color.g * 255)}, ${Math.floor(color.b * 255)}, 1)`);
        gradient.addColorStop(0.3, `rgba(${Math.floor(color.r * 255)}, ${Math.floor(color.g * 255)}, ${Math.floor(color.b * 255)}, 0.8)`);
        gradient.addColorStop(0.7, `rgba(${Math.floor(color.r * 255)}, ${Math.floor(color.g * 255)}, ${Math.floor(color.b * 255)}, 0.3)`);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        context.fillStyle = gradient;
        context.fillRect(0, 0, 256, 256);
        
        // 添加星点
        context.fillStyle = 'rgba(255, 255, 255, 0.8)';
        for (let i = 0; i < 100; i++) {
            const x = Math.random() * 256;
            const y = Math.random() * 256;
            const size = Math.random() * 2 + 0.5;
            context.beginPath();
            context.arc(x, y, size, 0, Math.PI * 2);
            context.fill();
        }
        
        return new THREE.CanvasTexture(canvas);
    }

    createNebulaTexture(color) {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const context = canvas.getContext('2d');
        
        const baseColor = new THREE.Color(color);
        
        // 创建星云效果
        for (let i = 0; i < 10; i++) {
            const x = Math.random() * 256;
            const y = Math.random() * 256;
            const radius = Math.random() * 60 + 20;
            
            const gradient = context.createRadialGradient(x, y, 0, x, y, radius);
            gradient.addColorStop(0, `rgba(${Math.floor(baseColor.r * 255)}, ${Math.floor(baseColor.g * 255)}, ${Math.floor(baseColor.b * 255)}, 0.6)`);
            gradient.addColorStop(0.5, `rgba(${Math.floor(baseColor.r * 255)}, ${Math.floor(baseColor.g * 255)}, ${Math.floor(baseColor.b * 255)}, 0.3)`);
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
            
            context.fillStyle = gradient;
            context.fillRect(0, 0, 256, 256);
        }
        
        return new THREE.CanvasTexture(canvas);
    }

    createAccretionDiskTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const context = canvas.getContext('2d');
        
        // 创建吸积盘纹理
        const centerX = 128, centerY = 128;
        
        for (let angle = 0; angle < Math.PI * 2; angle += 0.1) {
            for (let radius = 60; radius < 120; radius += 2) {
                const x = centerX + Math.cos(angle) * radius;
                const y = centerY + Math.sin(angle) * radius;
                
                const intensity = (Math.sin(angle * 3) + 1) * 0.5;
                const alpha = intensity * (1 - (radius - 60) / 60) * 0.8;
                
                context.fillStyle = `rgba(255, 200, 100, ${alpha})`;
                context.fillRect(x - 1, y - 1, 2, 2);
            }
        }
        
        return new THREE.CanvasTexture(canvas);
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        this.time += 0.01;
        this.updateCelestialBodies();

        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }

    updateCelestialBodies() {
        Object.keys(this.celestialBodies).forEach(key => {
            const body = this.celestialBodies[key];
            
            if (key === 'sun') {
                // 太阳是组合体，处理核心的自转
                if (body.userData && body.userData.core) {
                    const core = body.userData.core;
                    const data = core.userData;
                    core.rotation.y += data.rotationSpeed;
                }
            } else {
                // 普通行星处理
                const data = body.userData;

                // 自转
                body.rotation.y += data.rotationSpeed;

                // 公转
                data.angle += data.orbitSpeed;
                body.position.x = Math.cos(data.angle) * data.distance;
                body.position.z = Math.sin(data.angle) * data.distance;

                // 更新月亮位置
                if (data.moon) {
                    const moon = data.moon;
                    moon.userData.angle += moon.userData.orbitSpeed;
                    moon.position.x = Math.cos(moon.userData.angle) * moon.userData.distance;
                    moon.position.z = Math.sin(moon.userData.angle) * moon.userData.distance;
                }
            }
        });

        // 更新小行星带
        this.asteroidBelt.forEach(asteroid => {
            const data = asteroid.userData;
            
            // 公转
            data.angle += data.orbitSpeed;
            asteroid.position.x = Math.cos(data.angle) * data.distance;
            asteroid.position.z = Math.sin(data.angle) * data.distance;
            
            // 自转
            asteroid.rotateOnAxis(data.rotationAxis, data.rotationSpeed);
        });

        // 更新柯伊伯带
        this.kuiperBelt.forEach(kuiperObject => {
            const data = kuiperObject.userData;
            
            // 公转
            data.angle += data.orbitSpeed;
            kuiperObject.position.x = Math.cos(data.angle) * data.distance;
            kuiperObject.position.z = Math.sin(data.angle) * data.distance;
            
            // 自转
            kuiperObject.rotateOnAxis(data.rotationAxis, data.rotationSpeed);
        });

        // 更新太阳表面活动
        this.updateSunActivity();
    }

    updateSunActivity() {
        const sun = this.celestialBodies.sun;
        if (!sun || !sun.userData) return;
        
        sun.userData.time += 0.01;
        const time = sun.userData.time;
        
        // 1. 更新太阳核心发光强度
        const core = sun.userData.core;
        if (core && core.material.emissiveIntensity !== undefined) {
            const baseIntensity = 0.6;
            const variation = Math.sin(time * 2) * 0.1 + Math.cos(time * 3.7) * 0.05;
            const flicker = (Math.random() - 0.5) * 0.02;
            core.material.emissiveIntensity = baseIntensity + variation + flicker;
        }
        
        // 2. 更新色球层动画
        const chromosphere = sun.userData.chromosphere;
        if (chromosphere) {
            chromosphere.rotation.y += 0.002;
            chromosphere.rotation.x += 0.001;
        }
        
        // 3. 更新多层光晕效果
        sun.children.forEach(child => {
            if (child.material && child.userData.pulseSpeed) {
                child.userData.phase += child.userData.pulseSpeed;
                const pulse = Math.sin(child.userData.phase) * 0.3 + 0.7;
                child.material.opacity = child.userData.originalOpacity * pulse;
                
                // 轻微的尺寸变化
                const scale = 1 + Math.sin(child.userData.phase * 0.7) * 0.02;
                child.scale.setScalar(scale);
            }
        });
        
        // 5. 更新太阳黑子生命周期
        if (core) {
            core.children.forEach(sunspot => {
                if (sunspot.userData.lifecycle !== undefined) {
                    sunspot.userData.lifecycle++;
                    
                    const lifecycleRatio = sunspot.userData.lifecycle / sunspot.userData.maxLifecycle;
                    
                    if (lifecycleRatio < 0.3) {
                        // 成长期
                        const growth = lifecycleRatio / 0.3;
                        sunspot.scale.copy(sunspot.userData.originalScale).multiplyScalar(growth);
                    } else if (lifecycleRatio > 0.7) {
                        // 衰退期
                        const decay = (1 - lifecycleRatio) / 0.3;
                        sunspot.scale.copy(sunspot.userData.originalScale).multiplyScalar(decay);
                        sunspot.material.opacity = 0.8 * decay;
                    }
                    
                    // 重生
                    if (sunspot.userData.lifecycle > sunspot.userData.maxLifecycle) {
                        sunspot.userData.lifecycle = 0;
                        sunspot.userData.maxLifecycle = 200 + Math.random() * 300;
                        
                        // 新位置
                        const theta = Math.random() * Math.PI * 2;
                        const phi = Math.random() * Math.PI;
                        const radius = sun.userData.radius || 5;
                        
                        sunspot.position.x = Math.sin(phi) * Math.cos(theta) * radius * 1.01;
                        sunspot.position.y = Math.cos(phi) * radius * 1.01;
                        sunspot.position.z = Math.sin(phi) * Math.sin(theta) * radius * 1.01;
                        
                        sunspot.material.opacity = 0.8;
                    }
                }
            });
        }
        
        // 6. 更新光源强度
        if (this.sunLights) {
            const mainIntensity = 3 + Math.sin(time * 1.5) * 0.3 + Math.random() * 0.1;
            const atmIntensity = 1.5 + Math.cos(time * 2.3) * 0.2;
            
            this.sunLights.main.intensity = mainIntensity;
            this.sunLights.atmosphere.intensity = atmIntensity;
        }
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}

// 初始化太阳系
document.addEventListener('DOMContentLoaded', () => {
    new SolarSystem();
});

// 全屏功能
document.addEventListener('keydown', (event) => {
    if (event.key === 'F11') {
        event.preventDefault();
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }
});
