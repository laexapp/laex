"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.marketCatalog = void 0;
exports.findMarketAsset = findMarketAsset;
exports.marketCatalog = [
    { assetId: "bitcoin:btc", slug: "bitcoin", providerId: "bitcoin", binanceSymbol: "BTCUSDT", networkId: "bitcoin", contractAddress: null, symbol: "BTC", name: "Bitcoin", status: "active" },
    { assetId: "ethereum:eth", slug: "ethereum", providerId: "ethereum", binanceSymbol: "ETHUSDT", networkId: "ethereum", contractAddress: null, symbol: "ETH", name: "Ethereum", status: "active" },
    { assetId: "ethereum:usdt", slug: "tether", providerId: "tether", binanceSymbol: "USDTUSDC", networkId: "multi-chain", contractAddress: null, symbol: "USDT", name: "Tether", status: "active" },
    { assetId: "bsc:bnb", slug: "bnb", providerId: "binancecoin", binanceSymbol: "BNBUSDT", networkId: "bnb-smart-chain", contractAddress: null, symbol: "BNB", name: "BNB", status: "active" },
    { assetId: "solana:sol", slug: "solana", providerId: "solana", binanceSymbol: "SOLUSDT", networkId: "solana", contractAddress: null, symbol: "SOL", name: "Solana", status: "active" },
    { assetId: "xrpl:xrp", slug: "xrp", providerId: "ripple", binanceSymbol: "XRPUSDT", networkId: "xrp-ledger", contractAddress: null, symbol: "XRP", name: "XRP", status: "active" },
    { assetId: "cardano:ada", slug: "cardano", providerId: "cardano", binanceSymbol: "ADAUSDT", networkId: "cardano", contractAddress: null, symbol: "ADA", name: "Cardano", status: "active" },
    { assetId: "dogecoin:doge", slug: "dogecoin", providerId: "dogecoin", binanceSymbol: "DOGEUSDT", networkId: "dogecoin", contractAddress: null, symbol: "DOGE", name: "Dogecoin", status: "active" },
    { assetId: "tron:trx", slug: "tron", providerId: "tron", binanceSymbol: "TRXUSDT", networkId: "tron", contractAddress: null, symbol: "TRX", name: "TRON", status: "active" },
    { assetId: "avalanche:avax", slug: "avalanche", providerId: "avalanche-2", binanceSymbol: "AVAXUSDT", networkId: "avalanche-c-chain", contractAddress: null, symbol: "AVAX", name: "Avalanche", status: "active" },
    { assetId: "ethereum:link", slug: "chainlink", providerId: "chainlink", binanceSymbol: "LINKUSDT", networkId: "ethereum", contractAddress: "0x514910771AF9Ca656af840dff83E8264EcF986CA", symbol: "LINK", name: "Chainlink", status: "active" },
    { assetId: "polkadot:dot", slug: "polkadot", providerId: "polkadot", binanceSymbol: "DOTUSDT", networkId: "polkadot", contractAddress: null, symbol: "DOT", name: "Polkadot", status: "active" },
    { assetId: "ton:ton", slug: "toncoin", providerId: "the-open-network", binanceSymbol: "TONUSDT", networkId: "ton", contractAddress: null, symbol: "TON", name: "Toncoin", status: "active" },
    { assetId: "polygon:pol", slug: "polygon", providerId: "matic-network", binanceSymbol: "POLUSDT", networkId: "polygon-pos", contractAddress: "0x455e53CBB86018Ac2B8092FdCd39d8444AffC3F6", symbol: "POL", name: "Polygon Ecosystem Token", status: "active" },
    { assetId: "pending:omd", slug: "omd", providerId: null, binanceSymbol: null, networkId: "pending-ceo-confirmation", contractAddress: null, symbol: "OMD", name: "OMD / OMDB pendiente", status: "identity-pending" },
    { assetId: "concept:laex", slug: "laex", providerId: null, binanceSymbol: null, networkId: "planned", contractAddress: null, symbol: "LAEX", name: "LAEX Token (concepto)", status: "conceptual" }
];
function findMarketAsset(slug) { return exports.marketCatalog.find(asset => asset.slug === slug); }
