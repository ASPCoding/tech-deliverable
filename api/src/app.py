from contextlib import asynccontextmanager
from datetime import datetime, timedelta
from typing import AsyncIterator

from fastapi import FastAPI, Form, status
from fastapi.responses import RedirectResponse
from typing_extensions import TypedDict

from services.database import JSONDatabase


class Quote(TypedDict):
    name: str
    message: str
    time: str


database: JSONDatabase[list[Quote]] = JSONDatabase("data/database.json")


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    """Handle database management when running app."""
    if "quotes" not in database:
        print("Adding quotes entry to database")
        database["quotes"] = []

    yield

    database.close()


app = FastAPI(lifespan=lifespan)


@app.post("/quote")
def post_message(name: str = Form(), message: str = Form()) -> RedirectResponse:
    """
    Process a user submitting a new quote.
    You should not modify this function except for the return value.
    """
    now = datetime.now()
    quote = Quote(name=name, message=message, time=now.isoformat(timespec="seconds"))
    database["quotes"].append(quote)

    # You may modify the return value as needed to support other functionality
    return RedirectResponse("/", status.HTTP_303_SEE_OTHER)


# TODO: add another API route with a query parameter to retrieve quotes based on max age
@app.get("/quote/{time}")
def get_quotes(times: str) -> list[Quote]:
    response = list()
    now = datetime.now()
    begin = 0
    end = len(database["quotes"])
    pointer = len(database["quotes"])/2

    if time == "Last Week":
        now -= timedelta(days = 7)
        while begin < end :
            if database["quotes"][pointer].time < now:
                end = pointer
                pointer = (begin + end)/2
            elif database["quotes"][pointer].time > now:
                begin = pointer
                pointer = (begin + end)/2
            else:
                break
        if database["quotes"][pointer].time > now:
            pointer += 1
        while pointer < len(database["quotes"]):
            response.append(database["quotes"][pointer])
            pointer += 1

    elif time == "Last Month":
        now -= timedelta(months = 1)
        while begin < end :
            if database["quotes"][pointer].time < now:
                end = pointer
                pointer = (begin + end)/2
            elif database["quotes"][pointer].time > now:
                begin = pointer
                pointer = (begin + end)/2
            else:
                break
        if database["quotes"][pointer].time > now:
            pointer += 1
        while pointer < len(database["quotes"]):
            response.append(database["quotes"][pointer])
            pointer += 1
    elif time == "Last Year":
        now -= timedelta(years = 1)
        while begin < end :
            if database["quotes"][pointer].time < now:
                end = pointer
                pointer = (begin + end)/2
            elif database["quotes"][pointer].time > now:
                begin = pointer
                pointer = (begin + end)/2
            else:
                break
        if database["quotes"][pointer].time > now:
            pointer += 1
        while pointer < len(database["quotes"]):
            response.append(database["quotes"][pointer])
            pointer += 1
    else:
        for quote in database["quotes"]:
            response.append(quote)

    return response