function numberWithCommas(x) {
    if (x === undefined || x === null) return "0";
    // Convert to string safely
    let str = x.toString();
    let parts = str.split(".");
    // Use regex to add commas to the integer part
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    // Join the integer and decimal parts back together
    return parts.join(".");
}

export default numberWithCommas