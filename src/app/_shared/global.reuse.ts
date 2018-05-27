/**
 * the reason we put it here beause i want to resuse this module without injection and external delendencies
 * and for some reason if i also include another class export even thou it is a new class for some stupid reason i still get this error
 * >> "WARNING in Circular dependency detected:"
 * but now it works:)
 */



export class GlobalReuse  {

    constructor(){

    }

    encodeQueryData(data) {
        let ret = [];
        for (let d in data)
            ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
        return ret.join('&');
    }

    removeEmptyParam(sourceURL) {
        if(sourceURL.indexOf('?')==-1){
            sourceURL = "?"+sourceURL;
        }
        var rtn = sourceURL.split("?")[0],
            param, 
            params_arr = [],
            queryString = (sourceURL.indexOf("?") !== -1) ? sourceURL.split("?")[1] : "";
        if (queryString !== "") {
            params_arr = queryString.split("&");
            for (var i = params_arr.length - 1; i >= 0; i -= 1) {
                param = params_arr[i].split("=")[0];
                var is_empty = params_arr[i].split("=")[1].length==0;
                if (is_empty) {      
                  params_arr.splice(i, 1);
                }
            }
            rtn = rtn + "?" + params_arr.join("&");
        }
        return rtn;
    }
}
