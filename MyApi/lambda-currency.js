// Lambda handler
export const handler = async (event) => {
  console.log('Event:', JSON.stringify(event, null, 2));

    //source https://cdn.moneyconvert.net/api/latest.json
  const data = {"base":"USD","disclaimer":"Usage subject to terms: https://moneyconvert.net/company/terms/","license":"https://moneyconvert.net/company/license/","rates":{"AED":3.6725,"AFN":65.93476051,"ALL":81.75839451,"AMD":376.92665426,"ANG":1.79964347,"AOA":915.40778598,"ARS":1444.7876836,"ASPAR":7.698,"AUD":1.42380163,"AWG":1.79,"AZN":1.70000155,"BAM":1.65527385,"BBD":2,"BDT":122.10707162,"BGN":1.65527385,"BHD":0.376,"BIF":2950.40978888,"BMD":1,"BND":1.2717288,"BOB":6.93646641,"BRL":5.23060373,"BSD":1,"BTC":0.00001313,"BTN":90.45176172,"BWP":13.1223979,"BYN":2.86012544,"BZD":2.01315991,"CAD":1.3661623,"CDF":2279.96232708,"CHF":0.7759656,"CLF":0.02168832,"CLP":858.11736681,"CNH":6.93864588,"CNY":6.94164177,"COP":3639.85877757,"CRC":495.6518468,"CUC":1,"CUP":23.97469664,"CVE":93.32459734,"CZK":20.6163248,"DJF":178.01969121,"DKK":6.32048746,"DOGE":9.28763339,"DOLARBLUE":1440,"DOP":62.69960351,"DZD":129.90088855,"DZDBM":236.5,"EGP":46.93711141,"EGPBM":47.71,"ERN":15,"ETB":155.91914966,"ETH":0.00044263,"EUR":0.84632808,"FJD":2.20025627,"FKP":0.72926284,"GBP":0.72926284,"GEL":2.68746455,"GGP":0.72926284,"GHS":10.96952174,"GIP":0.72926284,"GMD":73.60509034,"GNF":8777.5873292,"GTQ":7.66759002,"GYD":208.92845025,"HKD":7.81232626,"HNL":26.41281975,"HRK":6.37665892,"HTG":130.96663229,"HUF":322.16011025,"IDR":16795.71224181,"ILS":3.08530271,"IMP":0.72926284,"INR":90.45176172,"IQD":1308.77004774,"IRR":1154476.31932701,"ISK":122.72313319,"JEP":0.72926284,"JMD":156.78458854,"JOD":0.709,"JPY":156.72015093,"KES":128.99302391,"KGS":87.46096766,"KHR":4034.31764655,"KMF":416.36612109,"KPW":900.03624825,"KRW":1456.50280435,"KWD":0.30738627,"KYD":0.83156693,"KZT":496.85135634,"LAK":21479.5248738,"LBP":89491.40272319,"LD":252.5,"LKR":309.17462856,"LRD":185.73590664,"LSL":15.96842678,"LYD":6.31348301,"MAD":9.17065589,"MDL":16.90265776,"MGA":4444.68762868,"MKD":52.15982193,"MMK":2099.98227965,"MNT":3569.43368233,"MOP":8.04669605,"MRO":397.38669084,"MRU":39.73866908,"MUR":45.8686421,"MVR":15.45966632,"MWK":1732.53383811,"MXN":17.25927549,"MYR":3.9315753,"MZN":63.88625641,"NAD":15.96842678,"NGN":1371.70674241,"NGNBM":1450,"NIO":36.78853768,"NOK":9.64806629,"NPR":144.79065757,"NZD":1.66032208,"OMR":0.38475838,"PAB":1,"PEN":3.36080223,"PGK":4.27896872,"PHP":58.99109428,"PKR":279.52146495,"PLN":3.57582122,"PMRRUB":16.1,"PYG":6636.39249835,"QAR":3.64,"RON":4.31213793,"RSD":99.36032201,"RUB":76.75720107,"RWF":1464.05118899,"SAR":3.75,"SBD":8.05275892,"SCR":13.64992421,"SDG":600.00835217,"SEK":8.94776992,"SGD":1.2717288,"SHP":0.72926284,"SLE":22.91001615,"SLL":22910.01615154,"SOS":571.32355734,"SPL":0.16666667,"SRD":38.16163326,"SSP":4534.0176594,"STN":20.93079833,"SVC":8.75,"SYP":110.57497281,"SZL":15.96842678,"THB":31.61551122,"TJS":9.3431722,"TMT":3.50966358,"TND":2.85911701,"TOP":2.40673125,"TRY":43.49708441,"TTD":6.76872157,"TVD":1.42380163,"TWD":31.56984304,"TZS":2586.42567775,"UAH":43.16870229,"UAHBM":43.24,"UGX":3559.41883991,"USD":1,"UYU":38.4971165,"UZS":12261.79400602,"VED":372.99071951,"VES":372.99071951,"VND":26021.86923303,"VUV":119.77083753,"WAUA":0.72782323,"WST":2.72629068,"XAF":555.15482812,"XAG":0.01112794,"XAU":0.0001983,"XCD":2.7072906,"XCG":1.79964347,"XDR":0.72779188,"XOF":555.15482812,"XPD":0.00054488,"XPF":100.99380425,"XPT":0.00043472,"YER":238.36784424,"ZAR":15.96842678,"ZMW":19.56157712,"ZWG":25.7884656,"ZWL":64438.26307406},"source":"FEX","ts":"2026-02-04T12:24:00.684679Z"}

  const rates = data.rates;


  const path = event.rawPath || event.path || event.requestContext?.http?.path || "";
  const params = event.queryStringParameters || {};

  console.log('Path:', path);
  console.log('Params:', params);

  // Convert Endpoint
  if (path.includes("/convert")) {
    const { from, to, amount } = params;

    if (!from || !to || !amount) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ error: "Missing 'from', 'to', or 'amount' parameter" })
      };
    }

    const amt = parseFloat(amount);
    if (isNaN(amt)) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ error: "Invalid amount" })
      };
    }

    const fromRate = rates[from.toUpperCase()];
    const toRate = rates[to.toUpperCase()];

    if (!fromRate || !toRate) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ 
          error: "Currency not supported",
          supportedCurrencies: Object.keys(rates)
        })
      };
    }

    const result = amt * (toRate / fromRate);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        from: from.toUpperCase(),
        to: to.toUpperCase(),
        amount: amt,
        result: parseFloat(result.toFixed(2))
      })
    };
  }

  // Currencies Endpoint
  if (path.includes("/currencies")) {
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        base: data.base,
        currencies: Object.keys(rates).sort()
      })
    };
  }

  // Default 404
  return {
    statusCode: 404,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({ error: "Endpoint not found" })
  };
};