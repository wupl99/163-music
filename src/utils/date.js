export function parseDate(time){
  var curDate = new Date();
  curDate.setTime(time);
  var year = curDate.getFullYear();
  var month = curDate.getMonth() + 1;
  var date = curDate.getDate();

/*  month = month < 10 ? '0'+month : month;
  date = date < 10 ? '0'+date : date;*/
  return year+'年'+month+'月'+date+'日';
};

export function uploadDate(){
  var curDate = new Date();
  var month = curDate.getMonth() + 1;
  var date = curDate.getDate();

  month = month < 10 ? '0'+month : month;
  date = date < 10 ? '0'+date : date;
  return month+'月'+date+'日';
};

export function publishDate(time){
  var curDate = new Date();
  curDate.setTime(time);
  var year = curDate.getFullYear();
  var month = curDate.getMonth() + 1;
  var date = curDate.getDate();

  month = month < 10 ? '0'+month : month;
  date = date < 10 ? '0'+date : date;

  return year+'-'+month+'-'+date;
};