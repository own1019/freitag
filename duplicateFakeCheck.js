const fs = require('fs');

module.exports = duplicateFakeCheck = async (productId) => {
    let data = fs.readFileSync('./public/data/freitag.json', 'utf8');
    let obj = JSON.parse(data); //json문자열을 분석하여 javscript객체를 생성
    let sameProductCount = 0; //중복제품, 뻥스탁을 카운트하는 변수

    for (k = 0; obj.length > k; k++) { //json데이터와 productId를를 비교하여 일치하면 뻥스탁카운트 상승
        if (obj[k].productId == productId) {
            sameProductCount++;
        }
    }

    if(sameProductCount > 2) { //뻥스탁 3번까지만 조회
        console.log('뻥스탁---------------------------------');
        return false;
    } else {
        await obj.push({ productId: productId });
        let json = JSON.stringify(obj);
        fs.writeFileSync('./public/data/freitag.json', json, 'utf8');
        return true;
    }
}