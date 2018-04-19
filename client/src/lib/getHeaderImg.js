export default getHeaderImage = (name) => {
    
  switch(name){
      case 'BTC':{
          return require('../../assets/images/coin/BTC.png');
      }

      case 'ETH':{
          return require('../../assets/images/coin/ETH.png');
      }

      case 'XRP':{
          return require('../../assets/images/coin/XRP.png');
      }

      case 'QTUM':{
          return require('../../assets/images/coin/QTUM.png');
      }

      case 'BTG':{
          return require('../../assets/images/coin/BTG.png');
      }

      case 'EOS':{
          return require('../../assets/images/coin/EOS.png');
      }

      case 'XMR':{
          return require('../../assets/images/coin/XMR.png');
      }

      case 'ZEC':{
          return require('../../assets/images/coin/ZEC.png');
      }

      case 'DASH':{
          return require('../../assets/images/coin/DASH.png');
      }

      case 'LTC':{
          return require('../../assets/images/coin/LTC.png');
      }

      case 'BCH':{
          return require('../../assets/images/coin/BCH.png');
      }

      case 'ETC':{
          return require('../../assets/images/coin/ETC.png');
      }
        
      case 'IOTA':{
          return require('../../assets/images/coin/IOTA.png');
      }

      case 'ICX': {
          return require('../../assets/images/coin/ICX.png')
      }

      case 'VEN': {
        return require('../../assets/images/coin/VEN.png')
      }

      case 'TRX': {
        return require('../../assets/images/coin/TRX.png')
      }

      case 'ELF': {
        return require('../../assets/images/coin/ELF.png')
      }

      case 'MITH': {
        return require('../../assets/images/coin/MITH.png')
      }

      case 'OMG': {
        return require('../../assets/images/coin/OMG.png')
      }

      default:
          return;
  }
}