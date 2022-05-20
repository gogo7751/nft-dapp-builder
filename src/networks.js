
const networks = {
    mainnet: [
        {
            chainId: '1',
            networkName: 'Ethereum',
            symbol: 'ETH',
            rpcURL: '',
            explorerURL: 'https://etherscan.io'
        },        
        {
            chainId: '56',
            networkName: 'Binance Smart Chain',
            symbol: 'BNB',
            rpcURL: '',
            explorerURL: 'https://bscscan.com'
        },        
        {
            chainId: '137',
            networkName: 'Polygon (MATIC)',
            symbol: 'MATIC',
            rpcURL: '',
            explorerURL: 'https://polygonscan.com'
        },        
    ],
    testnet: [
        {
            chainId: '4',
            networkName: 'Rinkeby',
            symbol: 'ETH',
            rpcURL: '',
            explorerURL: 'https://rinkeby.etherscan.io'
        },        
        {
            chainId: '97',
            networkName: 'Binance Smart Chain Testnet',
            symbol: 'BNB',
            rpcURL: '',
            explorerURL: 'https://testnet.bscscan.com'
        },        
        {
            chainId: '80001',
            networkName: 'Mumbai - Polygon Testnet',
            symbol: 'MATIC',
            rpcURL: '',
            explorerURL: 'https://mumbai.polygonscan.com'
        },
    ]
}

const getNetworkInfo = (chainId) => {
    let infos = networks['mainnet'].filter((network) => network.chainId === chainId);
    if(infos.length === 0) {
        infos = networks['testnet'].filter((network) => network.chainId === chainId);
    }
    return infos.length > 0 ? infos[0] : null;
}

export { networks, getNetworkInfo }