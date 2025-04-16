import jsonData from "app/fakeData/pitch_attention_truncated.json";

export const parseAttention = () => {
  const attentions = jsonData[0]["attentions"];
  console.log(attentions);
  return attentions;
};
