
const networks = {
    mainnet: [
        {
            chainId: '1',
            networkName: 'Ethereum',
            symbol: 'ETH',
            rpcURL: '',
            explorerURL: ''
        },        
        {
            chainId: '56',
            networkName: 'Binance Smart Chain',
            symbol: 'BNB',
            rpcURL: '',
            explorerURL: ''
        },        
        {
            chainId: '137',
            networkName: 'Polygon (MATIC)',
            symbol: 'MATIC',
            rpcURL: '',
            explorerURL: ''
        },        
    ],
    testnet: [
        {
            chainId: '4',
            networkName: 'Rinkeby',
            symbol: 'ETH',
            rpcURL: '',
            explorerURL: ''
        },        
        {
            chainId: '97',
            networkName: 'Binance Smart Chain Testnet',
            symbol: 'BNB',
            rpcURL: '',
            explorerURL: ''
        },        
        {
            chainId: '80001',
            networkName: 'Mumbai - Polygon Testnet',
            symbol: 'MATIC',
            rpcURL: '',
            explorerURL: ''
        },
    ]
}

export { networks }