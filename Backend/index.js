const express = require("express");
const server = express();
server.use(express.json());
require("dotenv").config();
const PORT = process.env.PORT;
const mongodb = require("mongodb")
const mongoclient = new mongodb.MongoClient(process.env.DB_URL)


server.post("/create", async(request, response)=>{
	let noteTitle = request.body.noteTitle.trim()
	let noteContent = request.body.noteContent.trim()
	// let note_id = request.body.note_id.trim()
	if(noteTitle.length > 0 && noteContent.length > 0){
		// proceed to save note
		const feedback = await mongoclient.db(process.env.DB_NAME).collection(process.env.COLLECTION_NAME).insertOne({noteTitle, noteContent});
		if (feedback){
			return response.send({
				message: "Note was created successfully", 
				code: "success",
				data: {feedback}
			})

		}else{
			return response.send({
				message: "Error communicating with server", 
				data: null 
			})
		}
		

	}else{
		return response.send({
			message: "Check your note has Title and Content",
			date: null
		})
	}

})

// server.post("/update", async (request, response)=>{
// 	if(!request.body.note_id){
// 		// no note_id in request
// 		return response.send({
// 			message: "No note ID was passed", 
// 			data: null 
// 		})
// 	}else{
// 		//proceed to work with ID
// 		const note_id = request.body.note_id.trim()
// 		const newnoteTitle = request.body.noteTitle.trim()
// 		const newnoteContent = request.body.noteContent.trim()
// 		const feedback = await mongoclient.db(process.env.DB_NAME).collection(process.env.COLLECTION_NAME).updateOne({"_id": new ObjectId(note_id))
// 		if(feedback){
// 			return response.send({
// 				message: "You have successfully updated your note", 
// 				code: "success", 
// 				data : {feedback}
// 			})
// 		}else{
// 			return response.send({
// 				message: "Wrong ID", 
// 				code: null,
// 				data: {feedback}
// 			})
// 		}

// 	}

// })


server.post("/update", async (request, response) => {
    if (!request.body.note_id) {
        return response.send({
            message: "No note ID was passed",
            data: null
        });
    } else {
        const note_id = request.body.note_id.trim();
        const newnoteTitle = request.body.noteTitle.trim();
        const newnoteContent = request.body.noteContent.trim();
        
        const ObjectId = require("mongodb").ObjectId; // Make sure to import ObjectId
        const { modifiedCount } = await mongoclient.db(process.env.DB_NAME).collection(process.env.COLLECTION_NAME).updateOne(
            { "_id": new ObjectId(note_id) }, // Add a closing parenthesis here
            { $set: { noteTitle: newnoteTitle, noteContent: newnoteContent } } // Assuming you want to update these fields
        );

        if (modifiedCount > 0) {
            return response.send({
                message: "You have successfully updated your note",
                code: "success"
            });
        } else {
            return response.send({
                message: "Wrong ID",
                code: null
            });
        }
    }
});

server.post("/view", async(request, response)=>{
	const note_id = request.body.note_id.trim();
	if(note_id){
		//proceed to retrieve notes from db using note_id as key
		const ObjectId = require("mongodb").ObjectId;
		const feedback = await mongoclient.db(process.env.DB_NAME).collection(process.env.COLLECTION_NAME).findOne({note_id:("mongodb").ObjectId})
		if (feedback){
			return response.send({
				message: "Note found",
				data: feedback
				// data : [(`Note Title: ${feedback.noteTitle}`),
				// 		(`Note Content: ${feedback.noteContent}`)]
			})
			
		}
		else{
			return response.send({
				message: "ID not found", 
				code: null
			})
		}
	}else{
		return response.send({
			message: "Check your request", 
			code: null
		})
	}

})

server.post("/delete", (request, response)=>{

})

server.listen(PORT, ()=>
console.log(`server is active on ${PORT}`))