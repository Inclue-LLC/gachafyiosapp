import { Product, CartItem, PlayHistory } from '../types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    slug: 'limited-sneaker-gacha',
    title: '限定スニーカーガチャ',
    seller_name: 'SneakerBox Japan',
    play_cost: 500,
    shipping_cost_label: 'プレイ1回ごとに550円',
    delivery: '通常7〜14日以内に発送',
    description:
      '人気ブランドの限定スニーカーが当たるガチャです。Nike・Adidas・New Balanceなどのレアモデルが揃っています。封入率は在庫数に基づいて算出されています。',
    trade_law:
      '販売業者: SneakerBox Japan\n代表者: 山田太郎\n所在地: 東京都渋谷区神宮前1-2-3\n電話番号: 03-1234-5678\n販売価格: 各商品ページに記載\n送料: プレイ1回ごとに550円\n支払い方法: クレジットカード（Stripe）\n引き渡し時期: お支払い確認後7〜14日以内',
    return_policy:
      '商品到着後7日以内に未使用・未開封の状態でご連絡ください。ただし、ガチャの性質上、当選アイテムの交換・選択はできません。',
    picture_url: 'https://picsum.photos/seed/sneaker/800/400',
    remain_count: 45,
    status: 'active',
    lineups: [
      { id: 'l1', product_id: '1', priority: 1, name: 'Nike Air Jordan 1 限定カラー', picture_url: 'https://picsum.photos/seed/shoe1/400/400', count: 1, pickup_rate: 2.0 },
      { id: 'l2', product_id: '1', priority: 2, name: 'Adidas Yeezy Boost 350', picture_url: 'https://picsum.photos/seed/shoe2/400/400', count: 2, pickup_rate: 4.1 },
      { id: 'l3', product_id: '1', priority: 3, name: 'New Balance 990v5', picture_url: 'https://picsum.photos/seed/shoe3/400/400', count: 5, pickup_rate: 10.2 },
      { id: 'l4', product_id: '1', priority: 4, name: 'Nike Air Max 90', picture_url: 'https://picsum.photos/seed/shoe4/400/400', count: 10, pickup_rate: 20.4 },
      { id: 'l5', product_id: '1', priority: 5, name: 'Converse Chuck Taylor', picture_url: 'https://picsum.photos/seed/shoe5/400/400', count: 31, pickup_rate: 63.3 },
    ],
  },
  {
    id: '2',
    slug: 'vintage-watch-gacha',
    title: 'ヴィンテージ時計ガチャ',
    seller_name: 'Tokyo Watch Collectors',
    play_cost: 1000,
    shipping_cost_label: '1プレイあたり660円',
    delivery: 'お支払い確認後10〜21日以内に発送',
    description:
      '1960〜1990年代のヴィンテージ時計が当たるガチャ。セイコー・シチズン・オリエントなど国産名機を中心に揃えました。すべて実動確認済みです。',
    trade_law:
      '販売業者: Tokyo Watch Collectors\n代表者: 鈴木一郎\n所在地: 東京都台東区上野1-5-8\n電話番号: 03-5678-1234\n販売価格: 各商品ページに記載\n送料: 1プレイあたり660円\n支払い方法: クレジットカード（Stripe）\n引き渡し時期: お支払い確認後10〜21日以内',
    return_policy:
      '商品の状態は写真をご確認の上お申し込みください。ヴィンテージ品の性質上、経年劣化による傷・汚れがある場合がございます。原則として返品不可となります。',
    picture_url: 'https://picsum.photos/seed/watch/800/400',
    remain_count: 12,
    status: 'active',
    lineups: [
      { id: 'l6', product_id: '2', priority: 1, name: 'SEIKO グランドセイコー 1960年代', picture_url: 'https://picsum.photos/seed/watch1/400/400', count: 1, pickup_rate: 8.3 },
      { id: 'l7', product_id: '2', priority: 2, name: 'CITIZEN クロノマスター 自動巻き', picture_url: 'https://picsum.photos/seed/watch2/400/400', count: 2, pickup_rate: 16.7 },
      { id: 'l8', product_id: '2', priority: 3, name: 'ORIENT スター 自動巻き', picture_url: 'https://picsum.photos/seed/watch3/400/400', count: 3, pickup_rate: 25.0 },
      { id: 'l9', product_id: '2', priority: 4, name: 'SEIKO 5 スポーツ', picture_url: 'https://picsum.photos/seed/watch4/400/400', count: 6, pickup_rate: 50.0 },
    ],
  },
  {
    id: '3',
    slug: 'retro-game-gacha',
    title: 'レトロゲーム福袋ガチャ',
    seller_name: 'Retro Games Osaka',
    play_cost: 300,
    shipping_cost_label: 'まとめて発送 1回分880円',
    delivery: '随時発送（目安5〜10営業日）',
    description:
      'ファミコン・スーパーファミコン・ゲームボーイなど懐かしのレトロゲームソフトが当たります。動作未確認のジャンク品ですが、クリーニング済みです。',
    trade_law:
      '販売業者: Retro Games Osaka\n代表者: 中村健一\n所在地: 大阪府大阪市浪速区難波1-10-1\n電話番号: 06-1234-5678\n販売価格: 各商品ページに記載\n送料: まとめて発送 1回分880円\n支払い方法: クレジットカード（Stripe）\n引き渡し時期: 随時発送（目安5〜10営業日）',
    return_policy:
      'ジャンク品として出品しています。ソフトの動作保証はしておりません。返品・交換には応じかねます。あらかじめご了承ください。',
    picture_url: 'https://picsum.photos/seed/retrogame/800/400',
    remain_count: 0,
    status: 'sold_out',
    lineups: [
      { id: 'l10', product_id: '3', priority: 1, name: 'ドラゴンクエスト3（ファミコン）', picture_url: 'https://picsum.photos/seed/game1/400/400', count: 1, pickup_rate: 5.0 },
      { id: 'l11', product_id: '3', priority: 2, name: 'ファイナルファンタジー6（SFC）', picture_url: 'https://picsum.photos/seed/game2/400/400', count: 2, pickup_rate: 10.0 },
      { id: 'l12', product_id: '3', priority: 3, name: 'ポケモン赤・青（ゲームボーイ）', picture_url: 'https://picsum.photos/seed/game3/400/400', count: 5, pickup_rate: 25.0 },
      { id: 'l13', product_id: '3', priority: 4, name: 'マリオカート（スーファミ）', picture_url: 'https://picsum.photos/seed/game4/400/400', count: 12, pickup_rate: 60.0 },
    ],
  },
  {
    id: '4',
    slug: 'trading-card-gacha',
    title: 'トレカBOXガチャ',
    seller_name: 'CardShop Akihabara',
    play_cost: 800,
    shipping_cost_label: '一律550円',
    delivery: '翌営業日〜3営業日以内に発送',
    description:
      'ポケモンカード・遊戯王・ワンピースカードなどの未開封BOXが当たるガチャ。すべて正規品・未開封品です。封入率はそのままお楽しみいただけます。',
    trade_law:
      '販売業者: CardShop Akihabara\n代表者: 田中誠\n所在地: 東京都千代田区外神田1-3-5\n電話番号: 03-9876-5432\n販売価格: 各商品ページに記載\n送料: 一律550円\n支払い方法: クレジットカード（Stripe）\n引き渡し時期: 翌営業日〜3営業日以内',
    return_policy:
      '未開封商品のみ返品対応可能（商品到着後3日以内）。開封後の返品・交換は承りかねます。',
    picture_url: 'https://picsum.photos/seed/tradecard/800/400',
    remain_count: 28,
    status: 'active',
    lineups: [
      { id: 'l14', product_id: '4', priority: 1, name: 'ポケモンカード 拡張パック BOX', picture_url: 'https://picsum.photos/seed/card1/400/400', count: 3, pickup_rate: 10.7 },
      { id: 'l15', product_id: '4', priority: 2, name: '遊戯王 ストラクチャーデッキ BOX', picture_url: 'https://picsum.photos/seed/card2/400/400', count: 5, pickup_rate: 17.9 },
      { id: 'l16', product_id: '4', priority: 3, name: 'ワンピースカード BOX', picture_url: 'https://picsum.photos/seed/card3/400/400', count: 8, pickup_rate: 28.6 },
      { id: 'l17', product_id: '4', priority: 4, name: 'デュエルマスターズ BOX', picture_url: 'https://picsum.photos/seed/card4/400/400', count: 12, pickup_rate: 42.9 },
    ],
  },
  {
    id: '5',
    slug: 'streetwear-gacha',
    title: 'ストリートウェア福袋',
    seller_name: 'Street Select Shop',
    play_cost: 2000,
    shipping_cost_label: 'プレイ1回ごとに880円',
    delivery: '確認後3〜7営業日以内',
    description:
      'Supreme・Off-White・Palaceなどのストリートブランドアイテムが当たります。すべて正規品保証付き。万が一正規品でない場合は全額返金いたします。',
    trade_law:
      '販売業者: Street Select Shop\n代表者: 吉田真一\n所在地: 東京都渋谷区宇田川町2-1\n電話番号: 03-2468-1357\n販売価格: 各商品ページに記載\n送料: プレイ1回ごとに880円\n支払い方法: クレジットカード（Stripe）\n引き渡し時期: 確認後3〜7営業日以内',
    return_policy:
      '商品はすべて正規品です。万が一正規品でない場合は全額返金いたします。その他の理由による返品は受け付けておりません。',
    picture_url: 'https://picsum.photos/seed/streetwear/800/400',
    remain_count: 7,
    status: 'active',
    lineups: [
      { id: 'l18', product_id: '5', priority: 1, name: 'Supreme Box Logo Tee', picture_url: 'https://picsum.photos/seed/street1/400/400', count: 1, pickup_rate: 14.3 },
      { id: 'l19', product_id: '5', priority: 2, name: 'Off-White Industrial Belt', picture_url: 'https://picsum.photos/seed/street2/400/400', count: 2, pickup_rate: 28.6 },
      { id: 'l20', product_id: '5', priority: 3, name: 'Palace Tri-Ferg Hoodie', picture_url: 'https://picsum.photos/seed/street3/400/400', count: 4, pickup_rate: 57.1 },
    ],
  },
];

export const MOCK_CART_ITEMS: CartItem[] = [
  {
    id: 'c1',
    lineup: MOCK_PRODUCTS[0].lineups[3],
    product_id: '1',
    product_title: '限定スニーカーガチャ',
    product_picture_url: MOCK_PRODUCTS[0].picture_url,
    won_at: '2026-03-25T10:30:00Z',
    shipping_requested: false,
  },
];

export const MOCK_PLAY_HISTORY: PlayHistory[] = [
  {
    id: 'ph1',
    product_id: '1',
    product_title: '限定スニーカーガチャ',
    played_at: '2026-03-25T10:30:00Z',
    cost: 500,
    lineup: MOCK_PRODUCTS[0].lineups[3],
  },
  {
    id: 'ph2',
    product_id: '4',
    product_title: 'トレカBOXガチャ',
    played_at: '2026-03-20T15:00:00Z',
    cost: 800,
    lineup: MOCK_PRODUCTS[3].lineups[1],
  },
];
