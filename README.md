# 🌌 Solar System Simulation | 太阳系模拟器

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Three.js](https://img.shields.io/badge/Three.js-r128-blue.svg)](https://threejs.org/)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26.svg)](https://developer.mozilla.org/en-US/docs/Web/HTML)

一个基于 **Three.js** 构建的交互式 3D 太阳系模拟器，提供沉浸式的宇宙探索体验。从内行星到柯伊伯带和奥尔特云，体验完整的太阳系结构，并观察遥远的星系和宇宙奇观。

## 🚀 在线演示

> [点击这里体验在线版本](https://solar-system.renhongchang.top/)

## ✨ 核心特性

### 🌞 太阳系天体

- **太阳** - 动态表面纹理，太阳黑子，色球层效果
- **八大行星** - 水星、金星、地球、火星、木星、土星、天王星、海王星
- **真实物理特性** - 基于真实比例的大小、距离和轨道速度
- **行星特色**：
  - 🌍 地球：大气层、月球、云层系统
  - 🔴 火星：极地冰帽、峡谷地形
  - 🌪️ 木星：大红斑、气体条纹
  - 💍 土星：壮观的光环系统
  - ❄️ 天王星/海王星：冰巨星表面纹理

### 🌌 太阳系边缘

- **小行星带** - 火星和木星之间的800个小行星
- **柯伊伯带** - 海王星外的1500个冰质天体
- **奥尔特云** - 长周期彗星的起源地（球状分布）

### 🌌 深空天体

- **近邻星系**：
  - 银河系中心（人马座A*）
  - 大小麦哲伦云
  - 仙女座星系
  - 三角座星系
- **宇宙奇观**：
  - 创生之柱（鹰状星云）
  - 马头星云
  - 蟹状星云
  - 玫瑰星云
  - 猫眼星云
  - 面纱星云

### 🎮 交互功能

- **自由视角** - 鼠标拖拽旋转，滚轮缩放
- **平滑控制** - 阻尼效果，流畅的相机运动
- **实时动画** - 天体自转和公转
- **响应式设计** - 适配各种屏幕尺寸
- **全屏模式** - 按F11进入全屏体验

## 🛠️ 技术栈

- **核心引擎**: Three.js r128
- **语言**: JavaScript (ES6+)
- **渲染**: WebGL
- **UI**: HTML5 + CSS3
- **数学库**: Three.js 内置数学库
- **控制器**: OrbitControls

## 📁 项目结构

```text
solar-system/
├── index.html          # 主页面
├── script.js           # 核心JavaScript逻辑
├── README.md           # 项目文档
└── .git/              # Git版本控制
```

## 🚀 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/rhczz/solar-system.git
cd solar-system
```

### 2. 本地运行

由于使用了Three.js CDN，您可以直接在浏览器中打开：

```bash
# 方法1: 直接打开
open index.html

# 方法2: 使用本地服务器（推荐）
# Python 3
python -m http.server 8000

# Node.js
npx http-server

# VS Code Live Server 扩展
# 右键 index.html -> "Open with Live Server"
```

### 3. 访问应用

打开浏览器访问 `http://localhost:8000`

## 🎯 使用指南

### 基本操作

- **旋转视角**: 按住鼠标左键拖拽
- **缩放**: 使用鼠标滚轮
- **重置视角**: 刷新页面
- **全屏模式**: 按F11键

### 探索建议

1. **内太阳系**: 缩放到太阳附近，观察行星细节
2. **木星系统**: 关注木星的大红斑和卫星
3. **土星光环**: 欣赏土星美丽的光环结构
4. **柯伊伯带**: 向外缩放观察海王星外的天体
5. **奥尔特云**: 最大缩放观察太阳系边界
6. **深空探索**: 寻找遥远的星系和星云

## 🔧 核心算法

### 轨道运动

```javascript
// 基于开普勒定律的轨道计算
planetData.angle += planetData.orbitSpeed;
planet.position.x = Math.cos(planetData.angle) * planetData.distance;
planet.position.z = Math.sin(planetData.angle) * planetData.distance;
```

### 纹理生成

```javascript
// 程序化生成行星表面纹理
createPlanetTexture(type) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    // 基于行星类型生成真实纹理
}
```

### 粒子系统

```javascript
// 星空背景和天体系统
createStarField(starCount) {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);
    // 程序化生成星空
}
```

## 🎨 视觉特效

- **动态太阳**: 实时表面活动，太阳黑子动画
- **大气效果**: 行星大气层渲染
- **光照系统**: 真实的光影效果
- **粒子系统**: 15000+个背景恒星
- **材质系统**: PBR着色，法线贴图
- **后处理**: 光晕效果，大气散射

## 📊 性能优化

- **LOD系统**: 基于距离的细节层次
- **批量渲染**: 小行星和粒子批处理
- **纹理优化**: 动态纹理生成，内存友好
- **帧率控制**: 60FPS稳定渲染
- **响应式渲染**: 自适应屏幕分辨率

## 🌟 未来规划

- [ ] **VR支持** - WebVR/WebXR集成
- [ ] **行星大气** - 体积渲染大气层
- [ ] **卫星系统** - 主要行星的卫星
- [ ] **彗星轨道** - 动态彗星和彗尾
- [ ] **时间控制** - 时间缩放和暂停
- [ ] **信息面板** - 天体详细信息
- [ ] **轨道预测** - 未来位置计算
- [ ] **声音效果** - 沉浸式音频体验

## 🤝 贡献指南

欢迎贡献代码！请遵循以下步骤：

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

### 代码规范

- 使用 ES6+ 语法
- 保持代码简洁和注释清晰
- 遵循现有的命名约定
- 确保跨浏览器兼容性

## 🐛 问题反馈

如果您发现bug或有功能建议，请：

1. 检查 [Issues](https://github.com/rhczz/solar-system/issues) 是否已存在
2. 创建新的 Issue，详细描述问题
3. 提供复现步骤和环境信息

## 📱 浏览器支持

| Browser | Version | Support |
|---------|---------|---------|
| Chrome  | 60+     | ✅ 完全支持 |
| Firefox | 55+     | ✅ 完全支持 |
| Safari  | 11+     | ✅ 完全支持 |
| Edge    | 79+     | ✅ 完全支持 |
| Mobile  | iOS 11+ | ✅ 部分支持 |

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🙏 致谢

- **Three.js** - 强大的3D JavaScript库
- **NASA** - 提供太阳系数据参考
- **ESA** - 深空天体图像参考
- **开源社区** - 持续的灵感和支持

## 📞 联系方式

- **项目维护者**: [Leo](https://github.com/rhczz)
- **邮箱**: [leo.r.hc@outlook.com](mailto:leo.r.hc@outlook.com)

---

## 🌟 支持项目

如果这个项目对您有帮助，请给个Star！

[⭐ Star](https://github.com/rhczz/solar-system) • [🐛 Report Bug](https://github.com/rhczz/solar-system/issues) • [💡 Request Feature](https://github.com/rhczz/solar-system/issues)

## 🚀 探索宇宙

探索宇宙，从这里开始！
