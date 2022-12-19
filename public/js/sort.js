d = {}
arr = ['அ','ஆ','இ','ஈ','உ','ஊ','எ','ஏ','ஐ','ஒ','ஓ','ஔ','ஃ'];
arr2 = ['க','ங','ச','ஞ','ட','ண','த','ந','ப','ம','ய','ர','ல','வ','ழ','ள','ற','ன'];

rank = 1
for(var i =0; i<arr.length; i++){
    d[arr[i]] = rank++;
}
for(var i =0; i<arr2.length; i++){
    d[arr2[i]] = rank++;
}
function split_words(a){
    temp = []
    for(var i=0;i<a.length;i++){
        unicode = a.charCodeAt(i);
        if(unicode >= 3006 && unicode <= 3022){
            temp[temp.length - 1] += a[i]
        }
        else{
            temp.push(a[i])
        }
    }
    return temp
}

function compare(aa,ba){
    var a = aa.shopNameTamil
    var b = bb.shopNameTamil
    a_letters = split_words(a)
    b_letters = split_words(b)
    for(var i=0;i<Math.min(a_letters.length,b_letters.length);i++){
        if(a_letters[i] != b_letters[i]){
            if(d[a_letters[i]] == undefined || d[b_letters[i]] == undefined){
                if(a_letters[i].length==1 || b_letters[i].length == 1){
                    if(a_letters[i][0] == b_letters[i][0]){
                        var idx1 = a_letters[i].length-1;
                        var idx2 = b_letters[i].length-1;
                        return a_letters[i].charCodeAt(idx1) - b_letters[i].charCodeAt(idx2);
                    }
                    return d[a_letters[i][0]] - d[b_letters[i][0]]
                }

                if(a_letters[i].charCodeAt(0) == b_letters[i].charCodeAt(0)){
                    if(a_letters[i].charCodeAt(1) == b_letters[i].charCodeAt(1)){
                        continue;
                    }
                    else{
                        if(a_letters[i].charCodeAt(1) == 3021){
                            return -1
                        }
                        if(b_letters[i].charCodeAt(1) == 3021){
                            return 1
                        }
                        return a_letters[i].charCodeAt(1) - b_letters[i].charCodeAt(1)
                    }
                }
                else{
                    return d[a_letters[i][0]] - d[b_letters[i][0]]
                }
            }
            else{
                return d[a_letters[i]] - d[b_letters[i]]
            }
        }
    }

    return a_letters.length - b_letters.length;
}
