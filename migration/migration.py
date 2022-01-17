import datetime
from pymongo import MongoClient


def extract_data():
    data = {"1": {}, "2": {}}
    with open("./old_data.csv") as f:
        f.readline()
        for line in f.readlines():
            info = line.split(",")[3:7]
            utorid = info[0].replace("\"", "")
            question = info[1].replace("\"", "")
            answer = info[2].replace("\"", "")
            time = info[3].replace("\"", "").replace("\n", "")
            if utorid not in data[question]:
                data[question][utorid] = {"ans": answer, "timestamp": time}
            else:
                if parseTime(data[question][utorid]["timestamp"]) < parseTime(time):
                    data[question][utorid] = {"ans": answer, "timestamp": time}
    return data


def parseTime(timestamp: str) -> int:
    timestamp = timestamp.replace("\\n", "").replace("\"", "").replace(":", "").replace(".", "").replace("Z", "")
    timestamp = timestamp.split("T")
    return int(timestamp[1])


if __name__ == '__main__':

    pollName = "CSC338Week1_1"
    courseCode = "CSC338"
    extracted_data = extract_data()
    # Connecting to DB

    # client = MongoClient(
    #     "mongodb://mongo:27018/?readPreference=primary&directConnection=true&ssl=false")
    client = MongoClient('mongo', 27017)
    database = client["quiz"]
    collection = database["polls"]
    d = datetime.datetime.strptime("2022-01-14T16:57:00.000Z", "%Y-%m-%dT%H:%M:%S.000Z")
    # Recreating poll
    poll = {"name": pollName, "courseCode": courseCode, "description": "", "created": d, "__v": 0}
    a = collection.insert_one(poll)
    objectId = a.inserted_id
    all_student_data = []
    for question in extracted_data:
        for student in extracted_data[question]:
            student_data = extracted_data[question][student]
            ans = student_data["ans"]
            timestamp = str(student_data["timestamp"])
            d = datetime.datetime.strptime(timestamp, "%Y-%m-%dT%H:%M:%S.%fZ")
            student_obj = {"pollId": str(objectId), "sequence": question, "__v": 0, "answer": ans, "timestamp": d, "utorid": student}
            all_student_data.append(student_obj)
    collection = database["students"]
    collection.insert_many(all_student_data)
