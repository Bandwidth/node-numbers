const transformParsedObject = (obj) => {
  if(Array.isArray(obj)){
    return obj.map(function(i){
      return transformParsedObject(i);
    });
  }
  if(typeof obj === "object"){
    var k, result = {};
    for(k in obj){
      result[k] = transformParsedObject(obj[k]);
    }
    return result;
  }
  if(obj === "true" || obj === "false"){
    return (obj  === "true");
  }
  if(/^\d{4}\-\d{2}-\d{2}T\d{2}\:\d{2}\:\d{2}(\.\d{3})?Z$/.test(obj)){
    return new Date(obj);
  }
  if(/\d{10}/.test(obj)){
    return obj;
  }
  if(!isNaN(obj)){
    return Number(obj);
  }
  return obj;
}

const prepareToBuildXml = (obj) => {
  if(Array.isArray(obj)){
    return obj.map(function(i){
      return prepareToBuildXml(i);
    });
  }
  if(obj instanceof Date){
    return obj.toISOString();
  }
  if(typeof obj === "object"){
    var j, k, v, result = {};
    for(k in obj)
    {
      v = obj[k];
      if(v === null || v === undefined || k[0] === "_") continue;
      result[obj["_" + k + "XmlElement"] || k[0].toUpperCase() + k.substr(1)] = prepareToBuildXml(v);
    }
    return result;
  }
  return obj.toString();
}

const findFirstDescendant = (obj, name) => {
  var j, k, v, r;
  for(k in obj){
    v = obj[k];
    if(k === name){
      return v;
    }
    if(Array.isArray(v)){
      for(j = 0; j < v.length; j ++){
        r = findFirstDescendant(v[j], name);
        if(r){
          return r;
        }
      }
    }
    else if(typeof v === "object"){
      r = findFirstDescendant(v, name);
      if(r){
        return r;
      }
    }
  }
  return null;
}

const findDescendants = (obj, name) => {
  var j, k, v, r, list = [];
  for(k in obj){
    v = obj[k];
    if(k === name){
      list.push(v);
      continue;
    }
    if(Array.isArray(v)){
      for(j = 0; j < v.length; j ++){
        r = findFirstDescendant(v[j], name);
        if(r){
          list = list.concat(r);
        }
      }
    }
    else if(typeof v === "object"){
      r = findFirstDescendant(v, name);
      if(r){
        list = list.concat(r);
      }
    }
  }
  return list;
}

const fixPath = (path) => {
  if (!path) {
    return "";
  }
  if (path[0] !== "/") {
    return "/" + path;
  }
  return path;
}

const customTags = (name) => {
  if(name.toLowerCase() === "lata"){
    return "lata";
  }
  return name;
}

module.exports = {
  fixPath,
  findFirstDescendant,
  findDescendants,
  prepareToBuildXml,
  transformParsedObject,
  customTags
};
