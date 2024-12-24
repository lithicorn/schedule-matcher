import requests
from bs4 import BeautifulSoup
import csv
# credit to Bredan Martin, LearnDataSci

url = 'https://www.4icu.org/us/a-z/'

r = requests.get(url)
soup = BeautifulSoup(r.content, 'html.parser')
print(r.content[:100])
colleges = []
rows = soup.select('tbody tr')
for row in rows:
    name = row.select_one('a').text.strip()
    location = row.select_one('td:nth-of-type(3)').text.strip().rstrip(".") if row.select_one('td:nth-of-type(3)') else ""
    # print(name)
    colleges.append((name,location))

with open('C:/Users/diffe/Documents/Code/schedule-matcher/public/colleges.txt',mode='w') as f:
    for i in range(len(colleges)):
        name, loc = colleges[i]
        if i < len(colleges)-1:
            f.write(name+"%"+loc+"\n")