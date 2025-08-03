const getFormatAddress = (address) => {
    let addressArray = address.split(',');
    const output = {
        country:'',
        state:'',
        city:'',
        address_line2:'',
        address_line1:'',
    };
    const address_line1 = addressArray.splice(0, 1).join(', ');
    addressArray = addressArray.reverse();
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < addressArray.length; i++) {
        output[Object.keys(output)[i]] = addressArray[i].trim();
    }
    output.address_line1 =
      addressArray.length > 4
          ? `${address_line1}, ${addressArray.slice(4).reverse().join(', ')}`
          : address_line1;
    return output;
};

module.exports = { getFormatAddress };