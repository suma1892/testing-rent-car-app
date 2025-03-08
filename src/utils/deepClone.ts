const deepClone = (obj: any) => {
  const temp = JSON.parse(JSON.stringify(obj));
  return temp;
};

export default deepClone;
