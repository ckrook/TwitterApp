# twitter-clone

## Summary
This is part of a school group project where our objective is to create a Twitter-like app where users can create posts, comment and like other posts / comments.

## Collections
| Users  |   | |
| ------------- | ------------- | ------------- | 
| Property  | Type  | Required  | Other  |
| _id  | ObjectId  | Yes  |  
| Username  | String  | Yes  |  
| Email  | String  | Yes  |  
| Password  | String  | Yes  |  
| Admin  | Boolean  | Yes  | 
| Bio  | String  | No  |  
| Profile_picture  | String  | No  |  
| Created  | Int  | Yes  |  
| Posts  | String []  | Yes  |  
| Liked  | String []  | Yes  |  

| Posts  |   | | 
| ------------- | ------------- | ------------- | 
| Property  | Type  | Required  | Other  |
| _id  | ObjectId  | Yes  |  
| Content  | String  | Yes  |  
| Created  | Int  | Yes  |  
| Like_count  | Int  | Yes  |  
| Retweet_count  | Int  | Yes  | 
| Comments  | String []  | Yes  |  

| Comments  |   | | 
| ------------- | ------------- | ------------- | 
| Property  | Type  | Required  | Other  |
| _id  | ObjectId  | Yes  |  
| Content  | String  | Yes  |  
| Created  | Int  | Yes  |  
| Like_count  | Int  | Yes  |  
