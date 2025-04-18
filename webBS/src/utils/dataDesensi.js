function tmName(val) {
  //*姓名脱敏
  val = val.replace(/^\s+|\s+$/g, "");
  if (val && val.length == 2) {
    return val.replace(/^(.{1}).*(.{1})$/, "$1*");
  } else if (val && val.length > 2) {
    return val.replace(/^(.{1}).*(.{1})$/, "$1*$2");
  } else {
    return val;
  }
}
function tmNames(val) {
  //*姓名多个脱敏
  const names = [];
  val.split(",").forEach((item) => {
    item = item.replace(/^\s+|\s+$/g, "");
    if (item && item.length == 2) {
      names.push(item.replace(/^(.{1}).*(.{1})$/, "$1*"));
    } else if (item && item.length > 2) {
      names.push(item.replace(/^(.{1}).*(.{1})$/, "$1*$2"));
    } else {
      names.push(item);
    }
  });
  return names.join("、");
}
function tmPhone(val) {
  if (val.length === 11) {
    //*电话脱敏
    return val.replace(/^(.{3}).*(.{4})$/, "$1**$2");
  }
}
function tmIdCard(val) {
  if (val.length === 18) {
    //*身份证号脱敏
    return val.replace(/^(.{3}).*(.{4})$/, "$1****$2");
  }
}
function tmPinyin(val) {
  //*拼音脱敏
  return val.replace(/^(.{2}).*(.{2})$/, "$1****$2");
}
function tmCard(val) {
  //*证件号脱敏
  return val.replace(/^(.{2}).*(.{2})$/, "$1****$2");
}
function tmEmail(val) {
  //*邮箱脱敏
  return val.replace(/^(.{3}).*(.{5})$/, "$1****$2");
}
function tmZipCode(val) {
  //*邮编--传真脱敏
  return val.replace(/^(.{2}).*(.{2})$/, "$1**$2");
}

export default {
  tmName,
  tmNames,
  tmIdCard,
  tmPinyin,
  tmCard,
  tmEmail,
  tmZipCode,
  tmPhone,
};
