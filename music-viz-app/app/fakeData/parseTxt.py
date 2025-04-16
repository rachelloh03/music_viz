newPopper = open("app/fakeData/newPopper.txt", "w")

with open("app/fakeData/popper.txt","r") as file:
    for line in file:
        print(line)
        vals = line.split(" ")
        startTime = str(float(vals[3][:-1])*1000)+","
        endTime = str(float(vals[5][:-2])*1000)+"},\n"
        vals[0] = "{"+vals[0]
        vals[3] = startTime
        vals[5] = endTime
        newLine = " ".join(vals)
        newPopper.write(newLine)

newPopper.close()