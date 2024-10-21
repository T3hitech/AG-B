const validation = (result) => {
    let resultObj = {
        msg: '',
        error: true
    }
    if(result.error){
        resultObj.msg = result.error;
    }else{
        resultObj.msg = result;
        resultObj.error = false;
    }
    return resultObj;
}
module.exports = {validation};