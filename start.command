#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR"
echo ""
echo "=============================="
echo "  Gachafy アプリ 起動中..."
echo "=============================="
echo ""
echo "① パッケージをインストール中..."
npm install
echo ""
echo "② バージョンを自動修正中..."
npx expo install --fix
npm install
echo ""
echo "③ アプリ起動中（QRコードが表示されます）"
echo ""
npx expo start --tunnel
