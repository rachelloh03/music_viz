import json

def makeTxtFile(head):
    filename = "app/fakeData/popperHead" + str(head) + ".txt"
    popperHead = open(filename, "w")
    attentions = []

    with open("app/fakeData/pitch_attentions_popper.json", 'r') as file:
        jsonData = json.load(file)
        attentions = jsonData[head]["attentions"]

    with open("app/fakeData/popper.txt","r") as file:
        for i, line in enumerate(file):
            vals = line.split(" ")
            startTime = str(float(vals[3][:-1])*1000)+","
            endTime = str(float(vals[5][:-2])*1000)+", "
            vals[0] = "{"+vals[0]
            vals[3] = startTime
            vals[5] = endTime
            newLine = " ".join(vals)
            try:
                newLine += "attention: "+ str(attentions[i]['attention']) +"},\n"
                popperHead.write(newLine)
            except:
                break

    popperHead.close()

for head in range(12):
    makeTxtFile(head)