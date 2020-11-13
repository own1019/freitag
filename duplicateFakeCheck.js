const fs = require('fs');

module.exports = duplicateFakeCheck = async (productId) => {
    fs.readFile('./public/data/freitag.json', 'utf8', async (err, data) => {
        let sameProductCount = 0; //중복제품, 뻥스탁을 카운트하는 변수
        let duplicateFakeCheckResult = false;
        if (err) {
            console.log('파일쓰기 에러');
            console.log(err);
            duplicateFakeCheckResult = false;
        } else {
            obj = JSON.parse(data);
            for (k = 0; obj.length > k; k++) { //json데이터와 productId를를 비교하여 일치하면 뻥스탁카운트 상승
                if (obj[k].productId == productId) {
                    sameProductCount++;
                }
            }

            if(sameProductCount > 2) { //뻥스탁 3번까지만 조회
                console.log('뻥스탁---------------------------------');
                duplicateFakeCheckResult = false;
            } else {
                await obj.push({ productId: productId });
                json = JSON.stringify(obj);
                fs.writeFile('./public/data/freitag.json', json, 'utf8', () => {
                    console.log('4');
                    console.log('파일덮어쓰기 완료');
                    duplicateFakeCheckResult = true;
                });
            }
        }
        return duplicateFakeCheckResult;
    });
}