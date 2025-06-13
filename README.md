# 智能超市客服 (Smart Supermarket Customer Service)

这是一个使用 Google Gemini API 构建的智能聊天机器人，旨在为超市顾客提供中文客户服务。它可以回答有关产品、服务、促销、营业时间等方面的问题。

## ✨ 特性

- **中文交互界面**: 专为中文用户设计，提供流畅自然的对话体验。
- **智能问答**: 基于 Google Gemini API (`gemini-2.5-flash-preview-04-17` 模型) 提供智能回复。
- **超市业务咨询**: 解答关于商品查询、服务介绍、促销活动、门店信息、营业时间等常见问题。
- **实时响应**: 快速处理用户输入并给出答复。
- **美观易用的界面**: 使用 React 和 Tailwind CSS (CDN) 构建，提供响应式且用户友好的聊天界面。
- **纯前端实现**: 所有逻辑均在客户端浏览器中运行，通过 `esm.sh` 动态加载和转译模块。

## 🛠️ 技术栈

- **Frontend**: React (v19), TypeScript
- **AI**: Google Gemini API (`@google/genai` SDK v1.5.0)
- **Styling**: Tailwind CSS (via CDN)
- **Module Loading**: ES Modules with `esm.sh` (实时 CDN 模块解析和转译)

## ⚙️ API 密钥配置

此应用程序需要 Google Gemini API 密钥才能运行。

1.  **获取 API 密钥**:
    *   访问 [Google AI Studio](https://aistudio.google.com/app/apikey).
    *   登录并创建一个新的 API 密钥。

2.  **设置 API 密钥**:
    *   **重要**: 应用程序代码 (`services/geminiService.ts`) 期望 API 密钥通过 `process.env.API_KEY` 环境变量提供。
    *   **Vercel 部署 (推荐)**:
        1.  在您的 Vercel 项目设置中，导航到 "Settings" -> "Environment Variables"。
        2.  添加一个名为 `API_KEY` 的新变量，并将其值设置为您的 Gemini API 密钥。
    *   **本地运行**:
        您需要确保在运行 `index.html` 的环境中 `process.env.API_KEY` 是可访问的。
        *   直接在浏览器中通过 `file:///` 协议打开 `index.html` 通常**不会**自动填充 `process.env`。
        *   `services/geminiService.ts` 文件在 `process.env.API_KEY` 未定义时会抛出错误。
        *   为了本地测试，您可能需要：
            1.  使用一个支持注入环境变量的本地 HTTP 服务器。
            2.  或者，临时修改 `services/geminiService.ts` 中的 `apiKey` 变量直接赋值（**非常不推荐，切勿提交到版本控制**）。
            3.  更佳的本地开发方式是使用如 Vite 或 Parcel 等构建工具，它们支持 `.env` 文件来管理环境变量，但这需要更改当前项目的设置。

## 🚀 本地运行与开发

此项目设计为可以直接在现代浏览器中运行 `index.html`，依赖 `esm.sh` 进行模块解析和 Tailwind CSS CDN 进行样式加载。

1.  **克隆仓库**:
    ```bash
    git clone https://github.com/your-username/your-repository-name.git
    cd your-repository-name
    ```
    (请将 `your-username/your-repository-name` 替换为您的实际仓库地址)

2.  **配置 API 密钥**:
    确保您的执行环境已设置 `API_KEY` 环境变量，如上一节“API 密钥配置”中所述。如果直接用浏览器打开本地文件，请注意相关的说明。

3.  **打开应用**:
    直接在您的网页浏览器中打开项目根目录下的 `index.html` 文件。

## 🌐 部署到 Vercel

Vercel 可以轻松部署此类静态站点。

1.  **注册/登录 Vercel**: 访问 [Vercel](https://vercel.com) 并使用您的 GitHub, GitLab, 或 Bitbucket 帐户登录。

2.  **导入项目**:
    *   点击 "Add New..." -> "Project"。
    *   选择您克隆并推送到您自己 Git 提供商的仓库。

3.  **配置项目**:
    *   **Framework Preset**: Vercel 应该会自动识别为静态站点，或者您可以选择 "Other"。
    *   **Build Command**: 对于当前设置 (无需构建步骤)，可以留空。
    *   **Output Directory**: 可以留空 (Vercel 将默认使用根目录作为静态文件来源)。
    *   **Install Command**: 可以留空。

4.  **配置环境变量**:
    *   在 Vercel 项目的 "Settings" -> "Environment Variables" 中，添加 `API_KEY` 并将其值设置为您的 Google Gemini API 密钥。这是使部署的应用能够成功调用 Gemini API 的关键步骤。

5.  **部署**: 点击 "Deploy"。Vercel 将部署您的应用，之后您会得到一个可公开访问的 URL。

## 🔬 工作原理

此应用完全在客户端浏览器中运行：
1.  用户在聊天界面输入问题。
2.  React 应用 (`App.tsx`) 管理聊天状态，并将用户输入（通过 `Chat` 对象维护上下文）传递给 `services/geminiService.ts`。
3.  `geminiService.ts` 使用 `@google/genai` SDK，配置好 API 密钥后，直接从用户的浏览器向 Google Gemini API 发起请求。
4.  Gemini API 返回的响应在界面上显示为机器人的回复。
5.  所有状态管理、UI渲染和 API 调用都在用户的浏览器中进行。Tailwind CSS 通过 CDN 提供样式，`esm.sh` 用于实时加载和转译 React/TypeScript 模块，无需本地构建步骤即可运行。

## 📂 项目结构

```
.
├── components/                 # React UI 组件
│   ├── ChatHeader.tsx          # 聊天头部组件
│   ├── ChatInput.tsx           # 聊天输入框组件
│   ├── LoadingSpinner.tsx      # 加载指示器组件
│   └── MessageBubble.tsx       # 聊天消息气泡组件
├── services/                   # 服务相关模块
│   └── geminiService.ts        # 与 Gemini API 交互的逻辑封装
├── App.tsx                     # 主要的 React 应用组件，处理聊天逻辑和状态
├── index.html                  # 应用的 HTML 入口文件，引入 Tailwind 和 importmap
├── index.tsx                   # React 应用的根渲染文件
├── metadata.json               # 应用元数据 (例如名称、描述)
├── README.md                   # 本文档
└── types.ts                    # TypeScript 类型定义 (如 Message, MessageSender)
```

## 📄 许可证

本项目建议采用 [MIT 许可证](LICENSE)。您可以根据需要添加一个 `LICENSE` 文件。

---

希望这个 README 对您有所帮助！
