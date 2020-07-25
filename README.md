# 🗓️ IlluCal
Plotting up calendar view in Illustrator is a horrible and time consuming task, this zero dependency(Only uses Fs to store the .csv) Node.js script generates a dataset for a given year to create a super simple calendar view for that year, example outputs included in the `ExampleOutput` folder.

If I'm ever in the mood i might make this into a web function/app.


### ❓How to:
Clone the repo.\
Make sure you have nodejs installed.\
Edit the `run.js` file `@line 384`and input the comma separated years you want to generate.\
Run the `run.js` file with `node run.js`.

Open the `Template/Month-Template.ait` file with Illustrator.\
Open up your variables panel.\
Click the hamburger in top right corner of the Variables Panel.\
Click `Load Variable Library...`\
Select the corresponding .csv file for the year you wish.\
Illustrator will give you a warning that the current document already contains variables. Select Yes.\
Cycle the months in the `Data Set:` field at the top of the variables panel.\
Create something awsome!

### 🤗 Pulls.
If you are an Illustrator user and a coder and you see that you can improve the code then please don't hesitate with throwing some pull requests at the repo. I'm not that focused on performance since this is a script that just generates something that you need rarely.
