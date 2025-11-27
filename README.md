# ZettAI Projects - 案件管理システム

開発プロジェクトを効率的に管理するためのWebベースの案件管理システムです。

## 機能

- **ダッシュボード**: プロジェクト全体の状況を一目で把握
- **案件一覧**: プロジェクトの作成・編集・管理
- **メンバー管理**: チームメンバーの管理
- **テンプレート管理**: プロジェクトテンプレートの作成・管理
- **設定**: システム設定のカスタマイズ

## 技術スタック

- HTML5
- CSS3 (カスタムスタイル・アニメーション)
- JavaScript (ES Modules)
- Google Fonts (Inter, Noto Sans JP)

## プロジェクト構成

```
KAIHATSUKANRI/
├── index.html          # メインエントリーポイント
├── package.json        # プロジェクト設定
├── js/
│   ├── app.js          # アプリケーションメイン
│   ├── data.js         # データ管理
│   ├── components/     # UIコンポーネント
│   ├── utils/          # ユーティリティ関数
│   └── views/          # ページビュー
└── styles/
    ├── main.css        # メインスタイル
    ├── components.css  # コンポーネントスタイル
    ├── animations.css  # アニメーション
    ├── panels.css      # パネルスタイル
    └── pages.css       # ページスタイル
```

## セットアップ

### 必要条件

- Node.js (npxが使用可能であること)

### 起動方法

```bash
# 開発サーバーを起動
npm run dev
```

ブラウザで http://localhost:3000 にアクセスしてください。

## ライセンス

MIT
