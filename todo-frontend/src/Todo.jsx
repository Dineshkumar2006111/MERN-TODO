import React, { useEffect, useState } from 'react'

const Todo = () => {
    const [title,settitle]=useState("")
    const [description,setdescription]=useState("")
    const [todos,settodos]=useState([])
    const [err,seterr]=useState("")
    const [msg,setmsg]=useState("")
    const [editid,seteditid]=useState(-1)
     const [edtitle,setedtitle]=useState("")
    const [eddescription,seteddescription]=useState("")
    const apiurl="http://localhost:8000"


    const handlesubmit=()=>{
        seterr("")
        if(title.trim() != "" && description.trim() != ""){
            fetch(apiurl+"/todos",{method:"POST",
                headers:{'content-Type':'application/json'},
                body:JSON.stringify({title,description})
            },   
            )
            .then((res)=>{
                if(res.ok){
                    //add item
                    settodos([...todos,{title,description}])
                    settitle("")
                    setdescription("")
                    setmsg("Item added successfully")
                    setTimeout(()=>{
                        setmsg("")
                    },3000)
                }else{
                    seterr("unable to create todo")
                }
            }).catch((err)=>{
                seterr("unable to create todo")
            })  
        }
    }
useEffect(()=>{
    getitem()
},[])
const getitem=()=>{
        fetch(apiurl+"/todos",{method:"GET"})
        .then((res)=>res.json())
        .then((data)=>{settodos(data)})
    }

const handleedit=(item)=>{
    seteditid(item._id);
    setedtitle(item.title); 
    seteddescription(item.description)
}
   
const handleupdate=()=>{
    seterr("")
        if(edtitle.trim() != "" && eddescription.trim() != ""){
            fetch(apiurl+"/todos/"+editid,{method:"PUT",
                headers:{'content-Type':'application/json'},
                body:JSON.stringify({title:edtitle,description:eddescription})
            },   
            )
            .then((res)=>{
                if(res.ok){
                    //update
                    const updatedtodos=todos.map((item)=>{
                        if(item._id==editid){
                            item.title=edtitle
                            item.description=eddescription
                        }
                        return item;
                    })

                    settodos(updatedtodos)
                    setmsg("Item updated successfully")
                    seteditid(-1)
                    setTimeout(()=>{
                        setmsg("")
                    },3000)
                }
            }).catch((err)=>{
                seterr("unable to create todo")
            }) 
        }
}

const handleeditcancel=()=>{
    seteditid(-1);
}

const handledelete=(id)=>{
    if(window.confirm('Are you sure want to delete?')){
        fetch(todos+"/todos/"+id,{method:"DELETE"})
        .then(()=>{
            const adtodos=todos.filter((item)=>id!=item._id)
            settodos([...adtodos])
        })
    }
}

  return (
  <>
    <div className='row p-2 bg-success text-light'>
        <h1>Todo Project With MERN Stack</h1>    
    </div>
    <div className='row mt-3'>
        <h3>Add Item</h3>

        {msg &&<p className='text-success'>{msg}</p>}
        <div className='form-group mt-3'>
            <input className='form-control' onChange={(e)=>{settitle(e.target.value)}} value={title} placeholder='Title' type="text" />
            <input className='form-control' onChange={(e)=>{setdescription(e.target.value)}} value={description} placeholder='Description' type="text" />
            <button className='btn btn-dark mt-3' onClick={handlesubmit}>Submit</button>
            {err && <p className='text-danger'>{err}</p>}
        </div>

{/* body */}
        <div className='row mt-3'>
            <h3>Tasks</h3>
            <ul className='list-group'>
                {
                    todos?.map((item)=>(
                        <li className='list-group-item d-flex justify-content-between align-item-center my-2'>
                        <div className='d-flex flex-column me-2'>
                        {
                            editid ==-1 || editid!==item._id ? <>
                        <span className='fw-bold'>{item.title}</span>
                        <span>{item.description}</span>
                        </>:<>
                         <div className='form-group d-flex gap-2'>
                <input className='form-control' onChange={(e)=>{setedtitle(e.target.value)}} value={edtitle} placeholder='Title' type="text" />
                <input className='form-control' onChange={(e)=>{seteddescription(e.target.value)}} value={eddescription} placeholder='Description' type="text" />
        </div></>
                        }
                        
                    </div>
                    
                    <div className='d-flex gap-2'>
                       {editid ==-1 || editid!==item._id ? <button className='btn btn-warning' onClick={()=>handleedit(item)}>Edit</button>: <button className='btn btn-warning' onClick={handleupdate}>Update</button>}
                        {editid ==-1 || editid!==item._id ? <button className='btn btn-danger' onClick={()=>{handledelete(item._id)}}>Delete</button>:<button className='btn btn-danger' onClick={handleeditcancel}>Cancel</button>}
                    </div>
                    
                </li>
                    ))
                }
            </ul>
        </div>
    </div>
    </>
  )
}

export default Todo