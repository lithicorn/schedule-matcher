from openai import OpenAI
from datetime import datetime
from googleapiclient.discovery import build
import requests

GOOGLE_API_KEY = "AIzaSyDMNx19M5i7aCERH9LIY0JS2wAip-aGrWA"
OPENAI_API_KEY = "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"
SEARCH_ENG_ID = "8718be29de12e4a7d"
client = OpenAI()
current_year = datetime.now().year
next_year = current_year + 1

def google_search(search_term, api_key, cse_id, **kwargs):
    service = build("customsearch", "v1", developerKey=api_key)
    res = service.cse().list(q=search_term, cx=cse_id, **kwargs).execute()
    return res['items']

def fetch_breaks(colleges):
    """
    Fetch academic breaks for each college based on their academic calendar.

    :param colleges: List of colleges with their locations.
    :return: Dictionary with college names as keys and lists of start-end date pairs for breaks as values.
    """
    all_schedules = {}
    prompt_template = (
        "Given the academic calendar below for the {year}-{next_year} academic year, "
        "what are the breaks that result in three or more consecutive days without classes or exams, "
        "with dates extended to include adjacent weekends? "
        "Provide the output as an array of begin/end date pairs in ISO 8601 format (YYYY-MM-DD)."
        "Add no additional text or information, purely the array.\n"
        "\n"
        "{academic_calendar}"
    )

    for college in colleges:
        breaks = []  # Fall, Thanksgiving, Winter, Spring, End of School, pairs (start, end)
        # Formulate search query
        search = college.split('%')[0] + " " + college.split('%')[1] + " academic calendar " + str(current_year) + "-" + str(next_year)
        results = google_search(search, GOOGLE_API_KEY, SEARCH_ENG_ID, num=1)
        r = requests.get(results[0]["link"])
        prompt = prompt_template.format(year=current_year, next_year=next_year,academic_calendar=r)
        
        # try:
        #     response = client.chat.completions.create(
        #         model="gpt-4o-mini",
        #         messages=[
        #             {
        #                 "role": "system", "content": "You are an assistant that processes academic calendars.",
        #                 "role": "user", "content": prompt,
        #             },
        #         ],
        #     )
        #     # Extract the breaks from the API response
        #     breaks = response.choices[0].message.content.strip()
        #     print(response.choices[0].message.content)
        #     if breaks.startswith("[") and breaks.endswith("]"):
        #         all_schedules[college] = json.loads(breaks)  # Use json.loads for safer deserialization
        #     else:
        #         all_schedules[college] = f"No appropriate academic calendar found for {college}"
        # except Exception as e:
        #     print(f"Error fetching breaks for {college}: {e}")

    return all_schedules


# Read college names from file and call fetch_breaks
# with open('C:/Users/diffe/Documents/Code/schedule-matcher/public/colleges.txt', mode='r') as input_file:
#     colleges = [line.strip() for line in input_file.readlines()]  # Assuming each line is a college entry
colleges = ["Yale University%New Haven"]
all_breaks = fetch_breaks(colleges)

# Optionally, write the results to a file (if needed)
with open('C:/Users/diffe/Documents/Code/schedule-matcher/public/schedules-v2.txt', mode='w') as out_file:
    for college, breaks in all_breaks.items():
        out_file.write(f"{college}: {breaks}\n")
