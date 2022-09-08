# Summary of Facebook data extraction methods

### I. General Comparison

| Method                                                                                                                                                                                       | Sign-in required |                                             Risk when sign-in                                              |  Risk when not sign-in  | Difficulty |      Speed      |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------------: | :--------------------------------------------------------------------------------------------------------: | :---------------------: | :--------: | :-------------: |
| 1️⃣ &nbsp;[Personal account Access Token + Graph API](https://github.com/18520339/facebook-data-extraction/tree/master/1%20-%20Personal%20account%20Access%20Token%20with%20Graph%20API)      |        ✅        | Access Token leaked, [Rate Limits](https://developers.facebook.com/docs/graph-api/overview/rate-limiting/) |       Not working       |    Easy    |      Fast       |
| 2️⃣ &nbsp;[Automation tools + IP hiding techniques](https://github.com/18520339/facebook-data-extraction/tree/master/2%20-%20Automation%20tools%20with%20IP%20hiding%20techniques)            | Depend **(\*)**  |                                 Checkpoint but less _loading more_ failure                                 |         Safest          |    Hard    | Slow **(\*\*)** |
| 3️⃣ &nbsp;[Run JS code directly at the DevTools Console](https://github.com/18520339/facebook-data-extraction/tree/master/3%20-%20Run%20JS%20code%20directly%20at%20the%20DevTools%20Console) | Depend **(\*)**  |                                 Checkpoint but less _loading more_ failure                                 | Can be banned if abused |   Medium   | Slow **(\*\*)** |
| 4️⃣ &nbsp;[Mbasic Facebook + IP hiding techniques](https://github.com/18520339/facebook-data-extraction/tree/master/4%20-%20Mbasic%20Facebook%20+%20IP%20hiding%20techniques)                 | Depend **(\*)**  |                                                     -                                                      |            -            |    Hard    |        -        |

**(\*)** Depend on the tasks that you need to sign in to perform. Example: Tasks that need to access private groups or private posts, ...

**(\*\*)** Depend on how much data you want to extract, the more the number, the more times for scrolling down to load the contents.

### II. My general conclusion after many tries with different methods

-   When run at **not sign-in** state, Facebook usually redirects to the login page or prevent you from loading more comments / replies.
-   No matter which method you use, any fast or irregular activity continuously in **sign-in** state for a long time can be likely to get blocked at any time.
-   If you want to use at **sign-in** state, for safety, I recommend create a **fake account** (you can use a [Temporary Email Address](https://temp-mail.org/en/) to create one) and use it for the extraction.
-   With the **sign-in** state, there's also another technique to limit the Checkpoint is to sign in with different **Cookies**.

### III. DISCLAIMER

All information provided in this repo and related articles are for educational purposes only. So use at your own risk, I will not guarantee & not be responsible for any situations including:

-   Whether your Facebook account may get Checkpoint due to repeatedly or rapid actions.
-   Problems that may occur or for any abuse of the information or the code provided.
-   Problems about your privacy while using [IP hiding techniques](https://github.com/18520339/facebook-data-extraction/tree/master/2%20-%20Automation%20tools%20with%20IP%20hiding%20techniques#ii-ip-hiding-techniques) or any malicious scripts.
