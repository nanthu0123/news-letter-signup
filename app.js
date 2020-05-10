// include the necessary modules
const express = require("express")
const bodyParser = require("body-parser")
const request = require("request")
const https = require("https")

const app = express()

// enable the urlencoded method of bodyParser module
app.use(bodyParser.urlencoded({ extended: true }))
// enable the static method in order to embed static and external files
app.use(express.static("public"))


app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html")
})

// create the post request 
app.post("/", function (req, res) {
    const firstName = req.body.firstName
    const lastName = req.body.lastName
    const email = req.body.email
    // javascript object for mailchimp 
    // this is called request body in mailchimp
    const data = {
        members: [{
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: firstName,
                LNAME: lastName
            }

        }]
    }
    // convert the javascript object into json formate 
    const jsonData = JSON.stringify(data)


    const url = "https://us18.api.mailchimp.com/3.0/lists/c66028d86d"  //API endpoint/path/listID
    const options = {
        method: "POST",
        auth: "nanthu:bd515d5280aa36e0501ccd574b743c77-us18"      //username:API key
    }
    // post the data to external resource or external server
    const request = https.request(url, options, function (response) {
        if(response.statusCode===200){
            res.sendFile(__dirname+"/success.html")
        }else{
            res.sendFile(__dirname+"/failure.html")
        }
        response.on("data", function (data) {                 //response from mailchimp in json format
            console.log(JSON.parse(data))
        })
    })
    // the json data is send to the mailchimp
    request.write(jsonData)
    request.end()
})

// redirect to the home route if sign up failure
app.post("/failure",function(req,res){
    res.redirect("/")
})



// create the server
app.listen(process.env.PORT||4000, function () {
    console.log("server running on port 4000")
})

