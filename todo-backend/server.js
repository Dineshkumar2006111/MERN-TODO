//express

const express=require('express')
const app=express();
const mongoose=require('mongoose')
const cors=require('cors')
// let todos=[];
app.use(cors())
app.use(express.json())


//connecting mongoose db

mongoose.connect('mongodb://localhost:27017/mern-todo')
.then(()=>{console.log('db connected')})
.catch((err)=>{
    console.log(err)
})


//creating schema

const todoSchema=new mongoose.Schema({
    title: {required:true,
        type:String
    },
    description: {required:true,
        type:String,
    },
    
})


//creating model

const todoModel = mongoose.model('Todo',todoSchema);

app.post('/todos',async(req,res)=>{

    const {title,description}=req.body;
    try{
    const newTodo= new todoModel({title,description})
    await newTodo.save();
    res.status(201).json(newTodo)
    }
    catch(error)
    {
        console.log(error)
        res.status(500).json({message:error.message})
    }
    
})


//get data
app.get('/todos', async(req,res)=>{
    try{
        const todos = await todoModel.find();
        res.json(todos)
    }catch(error){
        console.log(error)
        res.status(500).json({message:error.message})
    }
})


//update

app.put("/todos/:id",async(req,res)=>{
    try{
        const {title,description}=req.body;
    const id=req.params.id;
    const updatedtodo = await todoModel.findByIdAndUpdate(
        id,
        {title,description},
        { new : true}
    )

    if(!updatedtodo){
        return res.status(404).json(updatedtodo)
    }
    res.json(updatedtodo);
    }catch(error){
        console.log(error.message);
        res.status(505).json({message:error.message})
    }
    
})

//delete the todo item

app.delete("/todos/:id",async(req,res)=>{
    try{
        const id=req.params.id;
        await todoModel.findByIdAndDelete(id);
        res.status(204).end();
    }
    catch(error){
        console.log(error);
        res.status(500).json({message:error.message})
    }
})


const port=8000;
app.listen(port,()=>{
    console.log("server is running on port "+port)
})