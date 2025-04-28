import json

newPopper = open("app/fakeData/newPopper.txt", "w")
attentions = []

with open("app/fakeData/pitch_attention_truncated.json", 'r') as file:
    jsonData = json.load(file)
    attentions = jsonData[0]["attentions"]

with open("app/fakeData/popper.txt","r") as file:
    for i, line in enumerate(file):
        print(line)
        vals = line.split(" ")
        startTime = str(float(vals[3][:-1])*1000)+","
        endTime = str(float(vals[5][:-2])*1000)+", "
        vals[0] = "{"+vals[0]
        vals[3] = startTime
        vals[5] = endTime
        newLine = " ".join(vals)
        try:
            newLine += "attention: "+ str(attentions[i]['attention']) +"},\n"
            newPopper.write(newLine)
        except:
            break

newPopper.close()