export default translate2Origin = (name) => {

  var short2Origin = {
       'BTC': 'bitcoin',
       'ETH': 'ethereum',
       'XRP': 'ripple',
       'QTUM': 'quantum',
       'BTG': 'bitcoin gold',
       'EOS': 'eos',
       'XMR': 'monero',
       'ZEC': 'zcash',
       'DASH': 'dash', 
       'LTC': 'litecoin',
       'BCH': 'bitcoin cash',
       'ETC': 'ethereum classic',
       'IOTA': 'iota',
       'ICX': 'icx',
       'VEN': 'vechain',
       'TRX': 'tron',
       'ELF': 'aelf',
       'MITH': 'mithril',
       'OMG': 'OmiseGO',
       'MCO': 'monaco',
  }
 
  return short2Origin[name];
}